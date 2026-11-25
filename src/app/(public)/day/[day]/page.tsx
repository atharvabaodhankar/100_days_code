"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, ArrowLeft, Loader2, Trophy, PartyPopper } from "lucide-react";
import { getPublishedDayByNumber, getPublishedDays } from "@/lib/firebase/firestore";
import { ProblemView } from "@/components/public/problem-view";
import { HeroConfetti } from "@/components/public/hero-confetti";
import { DifficultyBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PublicDay } from "@/types";

export default function DayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dayParam = params?.day as string;
  const dayNumber = parseInt(dayParam, 10);

  const [day, setDay] = React.useState<PublicDay | undefined>(undefined);
  const [allDays, setAllDays] = React.useState<PublicDay[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProblemIndex, setSelectedProblemIndex] = React.useState(0);
  const [confettiBurst, setConfettiBurst] = React.useState(0);

  React.useEffect(() => {
    if (dayNumber === 100 && day) {
      setConfettiBurst((c) => (c === 0 ? 1 : c));
    }
  }, [dayNumber, day]);

  React.useEffect(() => {
    async function load() {
      if (isNaN(dayNumber)) {
        setLoading(false);
        return;
      }
      try {
        const [dayData, daysList] = await Promise.all([
          getPublishedDayByNumber(dayNumber),
          getPublishedDays(),
        ]);
        setDay(dayData);
        setAllDays(daysList);
      } catch (err) {
        console.error("Failed to fetch day from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [dayNumber]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500">Loading challenge from Firestore...</p>
      </div>
    );
  }

  if (!day || isNaN(dayNumber)) {
    return (
      <div className="py-12">
        <EmptyState
          title={`Day ${dayParam} Not Found`}
          description="This challenge day is not published in Firestore yet."
          actionLabel="Back to All Days"
          onAction={() => router.push("/days")}
        />
      </div>
    );
  }

  const activeProblem = day.problems[selectedProblemIndex] || day.problems[0];
  const prevDay = allDays.find((d) => d.dayNumber === dayNumber - 1);
  const nextDay = allDays.find((d) => d.dayNumber === dayNumber + 1);

  return (
    <div className="space-y-8 py-2">
      <HeroConfetti burstKey={confettiBurst} />
      {/* Back link & Day Navigation Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/days"
          className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Challenges</span>
        </Link>

        {/* Prev / Next day switcher */}
        <div className="flex items-center gap-1.5">
          {prevDay ? (
            <Link href={`/day/${prevDay.dayNumber}`}>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                Day {prevDay.dayNumber}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled>
              <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
              Prev
            </Button>
          )}

          {nextDay ? (
            <Link href={`/day/${nextDay.dayNumber}`}>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                Day {nextDay.dayNumber}
                <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled>
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Day 100 Handcrafted Editorial Finale */}
      {dayNumber === 100 && (
        <section className="border-y border-zinc-900/15 dark:border-zinc-100/15 py-8 sm:py-10 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-6xl sm:text-8xl leading-none tracking-tight text-zinc-950 dark:text-zinc-50"
              >
                100
              </span>
              <div className="space-y-1">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  Final Chapter · 100 / 100
                </p>
                <h2
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-2xl sm:text-4xl italic text-zinc-900 dark:text-zinc-100 leading-tight"
                >
                  You made it to the finish line.
                </h2>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfettiBurst((c) => c + 1)}
              className="shrink-0 border-zinc-900/25 dark:border-zinc-200/25 text-zinc-900 dark:text-zinc-100"
            >
              <PartyPopper className="h-3.5 w-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
              Throw Confetti
            </Button>
          </div>

          <p
            style={{ fontFamily: "var(--font-hand)" }}
            className="text-xl sm:text-2xl text-zinc-700 dark:text-zinc-300 leading-snug max-w-2xl"
          >
            Congratulations on showing up through every array, graph, and DP trace from Day 1 to Day 100. Take a bow — and solve one last problem.
          </p>
        </section>
      )}

      {/* Day Title Card */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-2 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700/50">
            Day {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber} of 100
          </span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(day.publishedAt)}</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-100">
          {day.topic}
        </h1>
      </div>

      {/* Problem Selector Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {day.problems.map((prob, idx) => {
            const isSelected = idx === selectedProblemIndex;
            return (
              <button
                key={prob.id}
                onClick={() => setSelectedProblemIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700"
                    : "bg-zinc-100/60 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                  0{idx + 1}.
                </span>
                <span className="truncate max-w-[140px] sm:max-w-xs">{prob.title}</span>
                <DifficultyBadge difficulty={prob.difficulty} />
              </button>
            );
          })}
        </div>

        {/* Active Problem View */}
        {activeProblem && (
          <ProblemView problem={activeProblem} dayNumber={day.dayNumber} />
        )}
      </div>
    </div>
  );
}
