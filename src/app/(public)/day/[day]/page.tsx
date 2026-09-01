"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, ArrowLeft } from "lucide-react";
import { getPublicDayByNumber, getPublicDays } from "@/lib/mock-data";
import { ProblemView } from "@/components/public/problem-view";
import { DifficultyBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function DayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dayParam = params?.day as string;
  const dayNumber = parseInt(dayParam, 10);

  const day = getPublicDayByNumber(dayNumber);
  const allDays = getPublicDays();

  const [selectedProblemIndex, setSelectedProblemIndex] = React.useState(0);

  if (!day || isNaN(dayNumber)) {
    return (
      <div className="py-12">
        <EmptyState
          title={`Day ${dayParam} Not Found`}
          description="This day might not have been published yet or the URL is invalid."
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
        {activeProblem && <ProblemView problem={activeProblem} />}
      </div>
    </div>
  );
}
