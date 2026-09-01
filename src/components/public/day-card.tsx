import Link from "next/link";
import { ArrowRight, Calendar, Code2 } from "lucide-react";
import { PublicDay } from "@/types";
import { DifficultyBadge } from "../ui/badge";
import { formatDate } from "@/lib/utils";

export function DayCard({ day }: { day: PublicDay }) {
  return (
    <Link
      href={`/day/${day.dayNumber}`}
      className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-md"
    >
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/40">
            Day {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(day.publishedAt)}</span>
          </div>
        </div>

        {/* Topic Title */}
        <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
          {day.topic}
        </h3>

        {/* Problems Preview List */}
        <div className="mt-3 space-y-2">
          {day.problems.map((problem, index) => (
            <div
              key={problem.id}
              className="flex items-center justify-between text-xs text-zinc-300 py-1 border-t border-zinc-800/60 first:border-t-0"
            >
              <div className="flex items-center gap-2 truncate mr-2">
                <span className="text-[10px] font-mono text-zinc-400">
                  {index + 1}.
                </span>
                <span className="truncate font-medium text-zinc-200">
                  {problem.title}
                </span>
              </div>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
        <span className="flex items-center gap-1">
          <Code2 className="h-3.5 w-3.5" />
          {day.problems.length} {day.problems.length === 1 ? "problem" : "problems"}
        </span>
        <span className="flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
          View Breakdown
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
