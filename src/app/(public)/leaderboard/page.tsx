"use client";

import * as React from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
  User,
  Medal,
} from "lucide-react";
import { getLeaderboard, getStudentStreak, StudentStreakData } from "@/lib/firebase/gamification";
import { LeaderboardRankable } from "@/lib/gamification/streaks";
import { useAuth } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";

export default function LeaderboardPage() {
  const { user, signInWithGithub } = useAuth();
  const [entries, setEntries] = React.useState<(LeaderboardRankable & { rank: number })[]>([]);
  const [userStreak, setUserStreak] = React.useState<StudentStreakData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const list = await getLeaderboard();
        setEntries(list);
        if (user?.uid) {
          const s = await getStudentStreak(user.uid);
          setUserStreak(s);
        }
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const userRank = user ? entries.find((e) => e.uid === user.uid)?.rank : null;

  return (
    <div className="space-y-8 py-4">
      {/* Page Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 px-3 py-1 text-xs text-amber-800 dark:text-amber-300 font-medium">
          <Trophy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>Global 100 Days of Code Standings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-100">
          Leaderboard & Streaks
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Rankings are calculated dynamically: Days Completed &gt; Problems Solved &gt; Continuous Streak.
        </p>
      </div>

      {/* Personal Progress Spotlight */}
      {user ? (
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "You"}
                  className="h-10 w-10 rounded-full ring-2 ring-emerald-500/30"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <User className="h-5 w-5 text-zinc-500" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.displayName || user.githubUsername || "Your Profile"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {userRank ? `Ranked #${userRank} on Global Board` : "Participating in Challenge"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs font-semibold text-amber-800 dark:text-amber-300">
                <Flame className="h-4 w-4 text-amber-500" />
                <span>{userStreak?.currentStreak || 0} Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>{userStreak?.totalDaysCompleted || 0} / 100 Days</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <span>Progress to 100 Days</span>
              <span>{userStreak?.totalDaysCompleted || 0}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(2, (userStreak?.totalDaysCompleted || 0)))}%` }}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Track your streak on the leaderboard
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Sign in with GitHub to save your daily solutions, increment your continuous streak, and rank among peers.
            </p>
          </div>
          <Button onClick={signInWithGithub} size="sm" className="font-semibold shrink-0">
            <GitHubIcon className="h-3.5 w-3.5 mr-1.5" />
            Connect with GitHub
          </Button>
        </section>
      )}

      {/* Leaderboard Table */}
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading leaderboard rankings...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400">
              <Medal className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                No submissions on the leaderboard yet!
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Be the first student to solve a problem and save your solution to claim the #1 ranking.
              </p>
            </div>
            <Link href="/days" className="inline-block pt-2">
              <Button size="sm" variant="outline" className="text-xs font-semibold">
                Explore Today's Challenge
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-14">Rank</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4 text-center">Days Done</th>
                  <th className="py-3 px-4 text-center">Problems</th>
                  <th className="py-3 px-4 text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-sans">
                {entries.map((student) => {
                  const isCurrentUser = user && student.uid === user.uid;
                  return (
                    <tr
                      key={student.uid}
                      className={`transition-colors ${
                        isCurrentUser
                          ? "bg-emerald-50/60 dark:bg-emerald-950/20 font-semibold"
                          : "hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40"
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="py-3.5 px-4 font-mono font-bold">
                        {student.rank === 1 ? (
                          <span className="text-amber-500">🥇 1</span>
                        ) : student.rank === 2 ? (
                          <span className="text-zinc-400">🥈 2</span>
                        ) : student.rank === 3 ? (
                          <span className="text-amber-700 dark:text-amber-500">🥉 3</span>
                        ) : (
                          <span className="text-zinc-500 dark:text-zinc-400">#{student.rank}</span>
                        )}
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {student.avatarUrl ? (
                            <img
                              src={student.avatarUrl}
                              alt={student.displayName}
                              className="h-7 w-7 rounded-full ring-1 ring-zinc-200 dark:ring-zinc-700"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[11px] text-zinc-600 dark:text-zinc-300">
                              {student.displayName.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-zinc-900 dark:text-zinc-100">
                              {student.displayName}
                              {isCurrentUser && (
                                <span className="ml-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                                  YOU
                                </span>
                              )}
                            </span>
                            {student.githubUsername && (
                              <Link
                                href={`https://github.com/${student.githubUsername}`}
                                target="_blank"
                                className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1 font-mono"
                              >
                                @{student.githubUsername}
                                <ExternalLink className="h-2.5 w-2.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Days Completed */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-zinc-900 dark:text-zinc-100">
                        {student.daysCompleted} / 100
                      </td>

                      {/* Problems Solved */}
                      <td className="py-3.5 px-4 text-center font-mono text-zinc-600 dark:text-zinc-400">
                        {student.problemsSolved}
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
                          <Flame className="h-3.5 w-3.5 text-amber-500" />
                          {student.currentStreak}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
