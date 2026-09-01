"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { getPublishedDays } from "@/lib/firebase/firestore";
import { PublicDay } from "@/types";
import { DayCard } from "@/components/public/day-card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";

export default function DaysArchivePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [allDays, setAllDays] = React.useState<PublicDay[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const days = await getPublishedDays();
        setAllDays(days);
      } catch (err) {
        console.error("Failed to load archive from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
          Challenges Archive
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
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
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono self-end sm:self-center">
          Showing {filteredDays.length} of {allDays.length} days
        </div>
      </div>

      {/* Days Grid */}
      {loading ? (
        <div className="p-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 text-center flex items-center justify-center gap-2 text-xs text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading challenges from Firestore...</span>
        </div>
      ) : filteredDays.length > 0 ? (
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
