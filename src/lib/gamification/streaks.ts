/**
 * Cheat-Resistant Gamification & Streak Computation Engine
 */

export interface StreakComputation {
  currentStreak: number;
  longestStreak: number;
  streakMaintained: boolean;
  isNewDay: boolean;
}

/**
 * Calculates updated streak when a student completes an assigned challenge problem.
 */
export function calculateNewStreak(
  currentStreak: number,
  longestStreak: number,
  lastActiveDateStr?: string
): StreakComputation {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  if (!lastActiveDateStr) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak),
      streakMaintained: true,
      isNewDay: true,
    };
  }

  const lastDate = new Date(lastActiveDateStr).toISOString().split("T")[0];

  // Already submitted today -> Streak remains active, same day
  if (lastDate === today) {
    return {
      currentStreak,
      longestStreak,
      streakMaintained: true,
      isNewDay: false,
    };
  }

  // Submitted yesterday -> Continuous Streak increment
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (lastDate === yesterday) {
    const updated = currentStreak + 1;
    return {
      currentStreak: updated,
      longestStreak: Math.max(updated, longestStreak),
      streakMaintained: true,
      isNewDay: true,
    };
  }

  // Missed a day -> Reset streak to 1
  return {
    currentStreak: 1,
    longestStreak,
    streakMaintained: false,
    isNewDay: true,
  };
}

export interface LeaderboardRankable {
  uid: string;
  displayName: string;
  avatarUrl?: string;
  githubUsername?: string;
  daysCompleted: number;
  problemsSolved: number;
  currentStreak: number;
  lastActiveAt: string;
}

/**
 * Hierarchical Multi-Key Anti-Spam Sort:
 * 1. Days Completed (descending)
 * 2. Total Problems Solved (descending)
 * 3. Current Streak (descending)
 * 4. Earliest Milestone Timestamp (ascending)
 */
export function sortLeaderboard<T extends LeaderboardRankable>(entries: T[]): (T & { rank: number })[] {
  const sorted = [...entries].sort((a, b) => {
    if (b.daysCompleted !== a.daysCompleted) {
      return b.daysCompleted - a.daysCompleted;
    }
    if (b.problemsSolved !== a.problemsSolved) {
      return b.problemsSolved - a.problemsSolved;
    }
    if (b.currentStreak !== a.currentStreak) {
      return b.currentStreak - a.currentStreak;
    }
    return new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime();
  });

  return sorted.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}
