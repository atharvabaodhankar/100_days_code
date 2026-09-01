"use client";

import * as React from "react";
import { Problem } from "@/types";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DifficultyBadge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { ExternalLink } from "lucide-react";

export function ProblemEditor({
  problem,
  onUpdate,
}: {
  problem: Problem;
  onUpdate?: (updated: Problem) => void;
}) {
  const [current, setCurrent] = React.useState<Problem>(problem);

  const handleChange = <K extends keyof Problem>(key: K, val: Problem[K]) => {
    const updated = { ...current, [key]: val };
    setCurrent(updated);
    onUpdate?.(updated);
  };

  return (
    <div className="space-y-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-5 shadow-xs transition-colors">
      {/* Problem Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50">
            Problem #{current.order}
          </span>
          <DifficultyBadge difficulty={current.difficulty} />
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Source: {current.sourceName}
          </span>
        </div>

        {current.sourceUrl && (
          <a
            href={current.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 w-fit"
          >
            <span>Original Link</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* Main Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Problem Title"
            value={current.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <div>
          <Input
            label="Topic Category"
            value={current.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
          />
        </div>
      </div>

      {/* Statement */}
      <div>
        <Textarea
          label="Problem Statement"
          rows={3}
          value={current.statement}
          onChange={(e) => handleChange("statement", e.target.value)}
        />
      </div>

      {/* Observation & Logic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Textarea
            label="Intuition & Observation"
            rows={4}
            value={current.observation}
            onChange={(e) => handleChange("observation", e.target.value)}
          />
        </div>
        <div>
          <Textarea
            label="Step-by-Step Logic"
            rows={4}
            value={current.logic}
            onChange={(e) => handleChange("logic", e.target.value)}
          />
        </div>
      </div>

      {/* Approach & Dry Run */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Textarea
            label="Approach Details"
            rows={4}
            value={current.approach}
            onChange={(e) => handleChange("approach", e.target.value)}
          />
        </div>
        <div>
          <Textarea
            label="Dry Run & State Trace"
            rows={4}
            value={current.dryRun}
            onChange={(e) => handleChange("dryRun", e.target.value)}
          />
        </div>
      </div>

      {/* Complexity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            label="Time Complexity"
            value={current.complexity.time}
            onChange={(e) =>
              handleChange("complexity", {
                ...current.complexity,
                time: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Input
            label="Space Complexity"
            value={current.complexity.space}
            onChange={(e) =>
              handleChange("complexity", {
                ...current.complexity,
                space: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Code Solutions Editor */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
          Reference Code Implementation
        </label>
        <Tabs defaultValue="cpp">
          <TabsList>
            <TabsTrigger value="cpp">C++ Solution</TabsTrigger>
            <TabsTrigger value="python">Python Solution</TabsTrigger>
            {current.solutions.java && (
              <TabsTrigger value="java">Java Solution</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="cpp">
            <Textarea
              rows={8}
              value={current.solutions.cpp}
              onChange={(e) =>
                handleChange("solutions", {
                  ...current.solutions,
                  cpp: e.target.value,
                })
              }
            />
          </TabsContent>

          <TabsContent value="python">
            <Textarea
              rows={8}
              value={current.solutions.python}
              onChange={(e) =>
                handleChange("solutions", {
                  ...current.solutions,
                  python: e.target.value,
                })
              }
            />
          </TabsContent>

          {current.solutions.java && (
            <TabsContent value="java">
              <Textarea
                rows={8}
                value={current.solutions.java}
                onChange={(e) =>
                  handleChange("solutions", {
                    ...current.solutions,
                    java: e.target.value,
                  })
                }
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
