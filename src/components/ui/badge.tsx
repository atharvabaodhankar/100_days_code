import * as React from "react";
import { cn } from "@/lib/utils";
import { Difficulty } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "easy" | "medium" | "hard" | "draft" | "published";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700/60",
    secondary: "bg-zinc-900 text-zinc-400 border-zinc-800",
    outline: "text-zinc-400 border-zinc-800 bg-transparent",
    easy: "bg-emerald-950/40 text-emerald-400 border-emerald-800/40 font-medium",
    medium: "bg-amber-950/40 text-amber-400 border-amber-800/40 font-medium",
    hard: "bg-rose-950/40 text-rose-400 border-rose-800/40 font-medium",
    draft: "bg-zinc-800/80 text-zinc-400 border-zinc-700/50",
    published: "bg-emerald-950/30 text-emerald-300 border-emerald-800/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const variantMap: Record<Difficulty, "easy" | "medium" | "hard"> = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
  };
  return <Badge variant={variantMap[difficulty]}>{difficulty}</Badge>;
}
