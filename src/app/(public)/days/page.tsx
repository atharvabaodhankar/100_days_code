"use client";

import * as React from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import { getPublicDays } from "@/lib/mock-data";
import { DayCard } from "@/components/public/day-card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";

export default function DaysArchivePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const allDays = getPublicDays();

  const filteredDays = allDays.filter((d) => {
    const query = searchQuery.toLowerCase();
    const matchesTopic = d.topic.toLowerCase().includes(query);
    const matchesDayNum = `day ${d.dayNumber}`.includes(query) || d.dayNumber.toString() === query;
    const matchesProblem = d.problems.some((p) =>
      p.title.toLowerCase().includes(query)
    );
    return matchesTopic || matchesDayNum || matchesProblem;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
          Challenges Archive
        </h1>
        <p className="text-sm text-zinc-400">
          Browse all published daily challenges, curated logic breakdowns, and verified solutions.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Input
            placeholder="Search by topic, problem name, or day number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        </div>

        <div className="text-xs text-zinc-400 font-mono self-end sm:self-center">
          Showing {filteredDays.length} of {allDays.length} days
        </div>
      </div>

      {/* Days Grid */}
      {filteredDays.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDays.map((day) => (
            <DayCard key={day.id} day={day} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No challenges found"
          description={`No published days matched "${searchQuery}". Try searching for another topic like "Arrays" or "Sliding Window".`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery("")}
        />
      )}
    </div>
  );
}
