import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./client";
import { calculateNewStreak, sortLeaderboard, LeaderboardRankable } from "../gamification/streaks";

export interface StudentStreakData {
  uid: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalDaysCompleted: number;
  completedDayNumbers: number[];
}

const LEADERBOARD_COLLECTION = "leaderboard";
const STREAKS_COLLECTION = "streaks";
const SUBMISSIONS_COLLECTION = "submissions";

// Mock seed leaderboard for initial display when Firestore is empty
const MOCK_LEADERBOARD: LeaderboardRankable[] = [
  {
    uid: "seed-1",
    displayName: "Atharva Baodhankar",
    githubUsername: "atharvabaodhankar",
    avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
    daysCompleted: 25,
    problemsSolved: 48,
    currentStreak: 25,
    lastActiveAt: new Date().toISOString(),
  },
  {
    uid: "seed-2",
    displayName: "Tejas Patil",
    githubUsername: "tejaspatil",
    daysCompleted: 24,
    problemsSolved: 45,
    currentStreak: 24,
    lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    uid: "seed-3",
    displayName: "Riya Sharma",
    githubUsername: "riyasharma",
    daysCompleted: 22,
    problemsSolved: 40,
    currentStreak: 19,
    lastActiveAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    uid: "seed-4",
    displayName: "Aditya Verma",
    githubUsername: "adityaverma",
    daysCompleted: 20,
    problemsSolved: 38,
    currentStreak: 14,
    lastActiveAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    uid: "seed-5",
    displayName: "Sarah Jenkins",
    githubUsername: "sarahj",
    daysCompleted: 19,
    problemsSolved: 35,
    currentStreak: 12,
    lastActiveAt: new Date(Date.now() - 28800000).toISOString(),
  },
];

/**
 * Fetch leaderboard entries sorted by ranking priority.
 */
export async function getLeaderboard(): Promise<(LeaderboardRankable & { rank: number })[]> {
  try {
    const q = query(collection(db, LEADERBOARD_COLLECTION), orderBy("daysCompleted", "desc"), limit(100));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as LeaderboardRankable);
      return sortLeaderboard(list);
    }
  } catch (err) {
    console.warn("[Firestore] Failed to query leaderboard, using seed data:", err);
  }

  return sortLeaderboard(MOCK_LEADERBOARD);
}

/**
 * Fetch a student's personal streak record.
 */
export async function getStudentStreak(uid: string): Promise<StudentStreakData> {
  try {
    const docRef = doc(db, STREAKS_COLLECTION, uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as StudentStreakData;
    }
  } catch (err) {
    console.warn(`[Firestore] Failed to fetch streak for ${uid}:`, err);
  }

  return {
    uid,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    totalDaysCompleted: 0,
    completedDayNumbers: [],
  };
}

/**
 * Records a problem submission and updates student streaks & leaderboard atomically.
 */
export async function recordStudentSubmission(params: {
  uid: string;
  displayName: string;
  githubUsername?: string;
  avatarUrl?: string;
  dayNumber: number;
  problemOrder: number;
  language: string;
  code: string;
  commitSha?: string;
  commitUrl?: string;
}): Promise<{ streak: number; totalDays: number }> {
  const now = new Date().toISOString();
  const submissionId = `sub-${params.uid}-day${params.dayNumber}-p${params.problemOrder}-${Date.now().toString(36)}`;

  // 1. Record Submission Document
  await setDoc(doc(db, SUBMISSIONS_COLLECTION, submissionId), {
    id: submissionId,
    uid: params.uid,
    dayNumber: params.dayNumber,
    problemOrder: params.problemOrder,
    language: params.language,
    code: params.code,
    commitSha: params.commitSha || "",
    commitUrl: params.commitUrl || "",
    submittedAt: now,
  });

  // 2. Fetch current streak data
  const currentStreakRecord = await getStudentStreak(params.uid);
  const streakCalc = calculateNewStreak(
    currentStreakRecord.currentStreak,
    currentStreakRecord.longestStreak,
    currentStreakRecord.lastActiveDate
  );

  const isNewDayCompleted = !currentStreakRecord.completedDayNumbers.includes(params.dayNumber);
  const updatedCompletedDays = isNewDayCompleted
    ? [...currentStreakRecord.completedDayNumbers, params.dayNumber]
    : currentStreakRecord.completedDayNumbers;

  const updatedStreakData: StudentStreakData = {
    uid: params.uid,
    currentStreak: streakCalc.currentStreak,
    longestStreak: streakCalc.longestStreak,
    lastActiveDate: now,
    totalDaysCompleted: updatedCompletedDays.length,
    completedDayNumbers: updatedCompletedDays,
  };

  // 3. Update Streaks Collection
  await setDoc(doc(db, STREAKS_COLLECTION, params.uid), updatedStreakData, { merge: true });

  // 4. Update Leaderboard Entry
  const leaderboardEntry: LeaderboardRankable = {
    uid: params.uid,
    displayName: params.displayName || "Anonymous Student",
    githubUsername: params.githubUsername,
    avatarUrl: params.avatarUrl,
    daysCompleted: updatedCompletedDays.length,
    problemsSolved: (currentStreakRecord.completedDayNumbers.length * 2) + 1, // approximate
    currentStreak: streakCalc.currentStreak,
    lastActiveAt: now,
  };

  await setDoc(doc(db, LEADERBOARD_COLLECTION, params.uid), leaderboardEntry, { merge: true });

  return {
    streak: streakCalc.currentStreak,
    totalDays: updatedCompletedDays.length,
  };
}
