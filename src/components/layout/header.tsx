"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Shield,
  Menu,
  X,
  BookOpen,
  Layers,
  Trophy,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ui/theme-toggle";
import { GitHubIcon } from "../ui/icons";
import { useAuth } from "@/lib/firebase/auth";
import { useToast } from "../ui/toast";
import { Button } from "../ui/button";

export function Header() {
  const pathname = usePathname();
  const { user, loading, signInWithGithub, signOut } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(false);

  const navLinks = [
    { href: "/", label: "Overview", icon: Layers },
    { href: "/days", label: "Challenges Archive", icon: BookOpen },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithGithub();
      showToast({
        type: "success",
        title: "Signed In with GitHub",
        message: "Welcome! Your 100 Days profile is connected.",
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Sign In Failed",
        message: err?.message || "Could not complete GitHub sign-in.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast({
        type: "info",
        title: "Signed Out",
        message: "You have been logged out.",
      });
    } catch (err: any) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-800 dark:border-zinc-700/60 group-hover:border-zinc-600 transition-colors">
              <Terminal className="h-4 w-4 text-zinc-100 dark:text-zinc-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                100 Days of Code
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/40">
                  DSA
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/40"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-900"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Student Auth Section */}
          {loading ? (
            <div className="h-8 w-8 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-xs shadow-xs">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Student"}
                    className="h-5 w-5 rounded-full ring-1 ring-zinc-200 dark:ring-zinc-700"
                  />
                ) : (
                  <User className="h-4 w-4 text-zinc-500" />
                )}
                <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[100px] hidden sm:inline">
                  {user.githubUsername || user.displayName || "Student"}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-zinc-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 p-0.5 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignIn}
              isLoading={authLoading}
              className="text-xs font-semibold h-8 px-2.5"
            >
              <GitHubIcon className="h-3.5 w-3.5 mr-1.5" />
              <span>Sign In</span>
            </Button>
          )}

          {/* Admin link */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            title="Admin Portal"
          >
            <Shield className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
