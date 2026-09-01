"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  FileCode2,
  Cpu,
  MessageSquareShare,
  Layers,
  BookOpen,
  Trophy,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  // Extract current review day from URL if on /admin/days/[day]
  const match = pathname.match(/\/admin\/days\/(\d+)/);
  const currentDayNumber = match ? match[1] : null;

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-4 flex flex-col justify-between shrink-0 hidden md:flex transition-colors">
      <div className="space-y-6">
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 px-2">
            Navigation
          </h4>
          <nav className="space-y-1">
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                pathname === "/admin"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/50 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Publishing Dashboard</span>
            </Link>

            {currentDayNumber && (
              <Link
                href={`/admin/days/${currentDayNumber}`}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                  pathname.startsWith(`/admin/days/${currentDayNumber}`)
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/50 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                <CalendarDays className="h-4 w-4 shrink-0 text-amber-500" />
                <span>Editing Day {currentDayNumber}</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Quick Links to Public Views */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 px-2">
            Public Site Quick Links
          </h4>
          <nav className="space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                <span>Overview</span>
              </div>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </Link>

            <Link
              href="/days"
              target="_blank"
              className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Challenges Archive</span>
              </div>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </Link>

            <Link
              href="/leaderboard"
              target="_blank"
              className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5" />
                <span>Leaderboard</span>
              </div>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </Link>
          </nav>
        </div>

        {/* Workflow Pipeline Guide */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 px-2">
            Publishing Pipeline
          </h4>
          <div className="space-y-1.5 px-2">
            {[
              { label: "1. URLs Input", icon: PlusCircle },
              { label: "2. Scraper Engine", icon: FileCode2 },
              { label: "3. AI Generation", icon: Cpu },
              { label: "4. Admin Review", icon: CalendarDays },
              { label: "5. WhatsApp Broadcast", icon: MessageSquareShare },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 py-0.5"
                >
                  <Icon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Engine Metadata */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 p-3 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
        <div className="flex justify-between">
          <span>AI Primary:</span>
          <span className="text-zinc-900 dark:text-zinc-200 font-mono">Gemini 2.5 Flash</span>
        </div>
        <div className="flex justify-between">
          <span>Failover:</span>
          <span className="text-zinc-900 dark:text-zinc-200 font-mono">Groq (5-Key Pool)</span>
        </div>
        <div className="flex justify-between">
          <span>Storage:</span>
          <span className="text-zinc-900 dark:text-zinc-200 font-mono">Cloud Firestore</span>
        </div>
      </div>
    </aside>
  );
}
