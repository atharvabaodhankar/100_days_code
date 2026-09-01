import Link from "next/link";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-8 text-zinc-500 dark:text-zinc-500 text-xs mt-auto transition-colors">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          <span className="font-medium text-zinc-700 dark:text-zinc-400">100 Days of Code</span>
          <span>— Curated DSA Mastery</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/days" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
            All Days
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
          >
            GitHub
          </a>
          <Link href="/admin/login" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
