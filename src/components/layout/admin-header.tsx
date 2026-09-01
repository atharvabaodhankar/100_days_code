"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, ShieldCheck, Sparkles, LogOut, User } from "lucide-react";
import * as React from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { useAuth } from "@/lib/firebase/auth";
import { useToast } from "../ui/toast";

export function AdminHeader() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      showToast({
        type: "info",
        title: "Signed Out",
        message: "Admin session ended.",
      });
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left side / Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-50 dark:bg-zinc-800 border border-emerald-200 dark:border-zinc-700">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Admin Studio
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/40">
            <Sparkles className="h-2.5 w-2.5 text-zinc-500 dark:text-zinc-400" />
            AI Pipeline Active
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user && (
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Admin" className="h-4 w-4 rounded-full" />
            ) : (
              <User className="h-3.5 w-3.5 text-zinc-400" />
            )}
            <span className="font-mono text-[11px] truncate max-w-[180px]">
              {user.email || user.displayName}
            </span>
          </div>
        )}

        <ThemeToggle />

        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Public View
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
