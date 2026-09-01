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
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/days/25",
      label: "Review Day 25",
      icon: CalendarDays,
      exact: false,
    },
  ];

  const workflowSteps = [
    { label: "1. URLs Input", icon: PlusCircle },
    { label: "2. Scraper Engine", icon: FileCode2 },
    { label: "3. AI Generation", icon: Cpu },
    { label: "4. Admin Review", icon: CalendarDays },
    { label: "5. WhatsApp Announcement", icon: MessageSquareShare },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 p-4 flex flex-col justify-between shrink-0 hidden md:flex transition-colors">
      <div className="space-y-6">
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 px-2">
            Navigation
          </h4>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/50 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Workflow Guide */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 px-2">
            Publishing Pipeline
          </h4>
          <div className="space-y-1.5 px-2">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 py-1"
                >
                  <Icon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Quick Meta */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/40 p-3 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
        <div className="flex justify-between">
          <span>AI Primary:</span>
          <span className="text-zinc-900 dark:text-zinc-200 font-mono">Gemini 1.5</span>
        </div>
        <div className="flex justify-between">
          <span>AI Fallback:</span>
          <span className="text-zinc-900 dark:text-zinc-200 font-mono">Groq Llama-3</span>
        </div>
        <div className="flex justify-between">
          <span>Database:</span>
          <span className="text-zinc-900 dark:text-zinc-200 font-mono">Firestore</span>
        </div>
      </div>
    </aside>
  );
}
