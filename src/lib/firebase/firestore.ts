import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./client";
import { AdminDay, PublicDay } from "@/types";

const DAYS_COLLECTION = "days";
const ADMIN_DAYS_COLLECTION = "adminDays";

/**
 * Fetch all published days directly from Firestore.
 */
export async function getPublishedDays(): Promise<PublicDay[]> {
  try {
    const daysRef = collection(db, DAYS_COLLECTION);
    const q = query(daysRef, where("status", "==", "published"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const days = snapshot.docs.map((docSnap) => docSnap.data() as PublicDay);
      return days.sort((a, b) => b.dayNumber - a.dayNumber);
    }
  } catch (err) {
    console.error("[Firestore] Failed to query published days:", err);
  }

  return [];
}

/**
 * Fetch a single published day by day number from Firestore.
 */
export async function getPublishedDayByNumber(dayNumber: number): Promise<PublicDay | undefined> {
  try {
    const dayDocRef = doc(db, DAYS_COLLECTION, `day-${dayNumber}`);
    const snapshot = await getDoc(dayDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as PublicDay;
      if (data.status === "published") {
        return data;
      }
    }
  } catch (err) {
    console.error(`[Firestore] Failed to fetch day-${dayNumber}:`, err);
  }

  return undefined;
}

/**
 * Fetch all days (drafts + published) directly from Firestore for Admin Studio.
 */
export async function getAllAdminDays(): Promise<AdminDay[]> {
  try {
    const adminRef = collection(db, ADMIN_DAYS_COLLECTION);
    const snapshot = await getDocs(adminRef);

    if (!snapshot.empty) {
      const days = snapshot.docs.map((docSnap) => docSnap.data() as AdminDay);
      return days.sort((a, b) => b.dayNumber - a.dayNumber);
    }
  } catch (err) {
    console.error("[Firestore] Failed to query admin days:", err);
  }

  return [];
}

/**
 * Fetch a single admin day (draft or published) by day number from Firestore.
 */
export async function getAdminDayByNumber(dayNumber: number): Promise<AdminDay | undefined> {
  try {
    const adminDocRef = doc(db, ADMIN_DAYS_COLLECTION, `day-${dayNumber}`);
    const snapshot = await getDoc(adminDocRef);

    if (snapshot.exists()) {
      return snapshot.data() as AdminDay;
    }
  } catch (err) {
    console.error(`[Firestore] Failed to fetch admin day-${dayNumber}:`, err);
  }

  return undefined;
}

/**
 * Save or update an admin draft in adminDays collection.
 */
export async function saveAdminDraft(day: AdminDay): Promise<void> {
  const docRef = doc(db, ADMIN_DAYS_COLLECTION, `day-${day.dayNumber}`);
  const payload: AdminDay = {
    ...day,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(docRef, payload, { merge: true });
}

/**
 * Publish a day:
 * 1. Updates adminDays status to 'published'
 * 2. Writes the clean PublicDay object to the public 'days' collection
 */
export async function publishDay(day: AdminDay): Promise<void> {
  const now = new Date().toISOString();

  // 1. Update Admin Collection
  const updatedAdminDay: AdminDay = {
    ...day,
    status: "published",
    publishedAt: day.publishedAt || now,
    updatedAt: now,
  };
  const adminDocRef = doc(db, ADMIN_DAYS_COLLECTION, `day-${day.dayNumber}`);
  await setDoc(adminDocRef, updatedAdminDay, { merge: true });

  // 2. Publish to Public Collection
  const publicDayPayload: PublicDay = {
    id: day.id || `day-${day.dayNumber}`,
    dayNumber: day.dayNumber,
    topic: day.topic,
    status: "published",
    publishedAt: day.publishedAt || now,
    problemCount: day.problems.length,
    problems: day.problems,
  };
  const publicDocRef = doc(db, DAYS_COLLECTION, `day-${day.dayNumber}`);
  await setDoc(publicDocRef, publicDayPayload, { merge: true });
}

/**
 * Delete a day from both adminDays and days collections.
 */
export async function deleteDay(dayNumber: number): Promise<void> {
  await deleteDoc(doc(db, ADMIN_DAYS_COLLECTION, `day-${dayNumber}`));
  await deleteDoc(doc(db, DAYS_COLLECTION, `day-${dayNumber}`));
}
