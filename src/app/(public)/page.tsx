import Link from "next/link";
import { ArrowRight, Code2, Sparkles, Terminal, CheckCircle2, Flame, BookOpen } from "lucide-react";
import { getPublicDays } from "@/lib/mock-data";
import { DayCard } from "@/components/public/day-card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const publishedDays = getPublicDays();
  const latestDay = publishedDays[0];

  const features = [
    {
      title: "Pedagogical Clarity",
      desc: "Every challenge includes intuitive observations, step-by-step logic, and detailed state traces.",
    },
    {
      title: "Multi-Language Solutions",
      desc: "Clean, idiomatic reference code in C++, Python, and Java with time and space complexity breakdowns.",
    },
    {
      title: "Daily Consistency",
      desc: "1 to 3 curated problems every single day covering core DSA patterns from arrays to graphs and DP.",
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="space-y-6 text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span>Active Challenge Track: 100 Days of Structured Mastery</span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-[1.15]">
            Master DSA with structured daily intuition.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-sans">
            A minimalist learning platform designed to eliminate cognitive overload. Read the logic, dry run the state transitions, and study verified implementations.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {latestDay && (
            <Link href={`/day/${latestDay.dayNumber}`}>
              <Button size="lg" className="font-semibold">
                Start Today's Challenge (Day {latestDay.dayNumber})
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          <Link href="/days">
            <Button variant="secondary" size="lg">
              <BookOpen className="mr-2 h-4 w-4 text-zinc-400" />
              Browse All Days
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured / Latest Day Spotlight */}
      {latestDay && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-zinc-400" />
              Latest Released Challenge
            </h2>
            <Link
              href="/days"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
            >
              View all days
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedDays.slice(0, 2).map((day) => (
              <DayCard key={day.id} day={day} />
            ))}
          </div>
        </section>
      )}

      {/* Pillars / Feature Grid */}
      <section className="border-t border-zinc-900 pt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
          Built for Serious Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5 space-y-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-800 text-zinc-200 text-xs font-mono font-bold">
                0{idx + 1}
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">{feat.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
