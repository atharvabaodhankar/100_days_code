import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({
  message = "Loading...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center rounded-lg border border-zinc-200 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/30",
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-zinc-500 dark:text-zinc-400 mb-3" />
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
        <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-16"></div>
      </div>
      <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
      <div className="flex gap-2 pt-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20"></div>
      </div>
    </div>
  );
}
