"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading, signInWithGoogle, signInWithGithub } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-500 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-xs font-mono">Verifying admin authorization...</p>
      </div>
    );
  }

  // Not signed in as baodhankaratharva@gmail.com
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 space-y-6 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
              Admin Access Restricted
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This publishing studio is restricted to the challenge administrator (
              <code className="text-zinc-900 dark:text-zinc-200 font-semibold bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">
                baodhankaratharva@gmail.com
              </code>
              ).
            </p>
            {user && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 pt-1 font-mono">
                Currently logged in as: {user.email || "Anonymous"} (Unauthorized)
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={signInWithGoogle}
              className="w-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950"
            >
              <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
              Sign in with Google (Admin)
            </Button>
            <Button
              variant="outline"
              onClick={signInWithGithub}
              className="w-full font-semibold text-xs"
            >
              <GitHubIcon className="h-4 w-4 mr-2" />
              Sign in with GitHub (Admin)
            </Button>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <AdminHeader />
      <div className="flex-1 flex w-full">
        <AdminSidebar />
        <main className="flex-1 max-w-5xl mx-auto p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
