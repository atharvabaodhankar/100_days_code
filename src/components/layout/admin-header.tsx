"use client";

import Link from "next/link";
import { ExternalLink, ShieldCheck, Sparkles, LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side / Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-800 border border-zinc-700">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-100 tracking-tight">
            Admin Studio
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700/40">
            <Sparkles className="h-2.5 w-2.5 text-zinc-400" />
            AI Pipeline Active
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Public View
        </Link>
        <Link href="/admin/login">
          <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-zinc-200">
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Logout
          </Button>
        </Link>
      </div>
    </header>
  );
}
