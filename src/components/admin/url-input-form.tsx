"use client";

import * as React from "react";
import { Plus, Trash2, Globe, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/toast";

export function UrlInputForm({
  onSubmit,
}: {
  onSubmit?: (data: { dayNumber: number; topic: string; urls: string[]; generatedDay?: any }) => void;
}) {
  const { showToast } = useToast();
  const [dayNumber, setDayNumber] = React.useState<number>(27);
  const [topic, setTopic] = React.useState<string>("Binary Search & Lower Bound");
  const [urls, setUrls] = React.useState<string[]>([
    "https://takeuforward.org/plus/dsa/problems/search-insert-position",
    "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
  ]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const detectSource = (url: string) => {
    if (url.includes("takeuforward.org")) return "TakeUForward";
    if (url.includes("leetcode.com")) return "LeetCode";
    if (url.includes("unstop.com")) return "Unstop";
    if (url.length > 5) return "Generic Web";
    return null;
  };

  const handleAddUrl = () => {
    if (urls.length < 3) {
      setUrls([...urls, ""]);
    }
  };

  const handleRemoveUrl = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const handleUrlChange = (index: number, val: string) => {
    const updated = [...urls];
    updated[index] = val;
    setUrls(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const validUrls = urls.filter((u) => u.trim().length > 0);
      const res = await fetch("/api/admin/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayNumber,
          topic,
          urls: validUrls,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation pipeline failed.");
      }

      showToast({
        type: "success",
        title: "AI Generation Complete",
        message: `Generated with ${data.providerUsed} (${data.latencyMs}ms). Opening review studio.`,
      });

      onSubmit?.({
        dayNumber,
        topic,
        urls: validUrls,
        generatedDay: data.day,
      });
    } catch (err: any) {
      console.error("Pipeline submission error:", err);
      setErrorMessage(err.message || "Failed to trigger generation pipeline.");
      showToast({
        type: "error",
        title: "Pipeline Error",
        message: err.message || "Failed to generate AI content.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Day Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Input
            label="Day Number"
            type="number"
            min={1}
            max={100}
            value={dayNumber}
            onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Topic Title"
            placeholder="e.g. Dynamic Programming (1D vs 2D)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
      </div>

      {/* URL Inputs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Problem URLs (1 to 3 URLs)
          </label>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {urls.length}/3 URLs added
          </span>
        </div>

        <div className="space-y-2.5">
          {urls.map((url, index) => {
            const detectedSource = detectSource(url);
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30"
              >
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 w-6 text-center shrink-0">
                  #{index + 1}
                </span>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://takeuforward.org/... or https://leetcode.com/..."
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none font-mono"
                    required
                  />

                  {detectedSource && (
                    <Badge variant="outline" className="text-[10px] shrink-0 w-fit">
                      <Globe className="h-2.5 w-2.5 mr-1 text-zinc-500 dark:text-zinc-400" />
                      {detectedSource}
                    </Badge>
                  )}
                </div>

                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(index)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors cursor-pointer rounded"
                    title="Remove URL"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {urls.length < 3 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddUrl}
            className="w-full text-xs border-dashed text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Another Problem URL ({urls.length}/3)
          </Button>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <AlertCircle className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <span>Gemini 1.5 Flash (Primary) → Groq Llama-3 (Fallback) with round-robin key rotation.</span>
        </div>

        <Button
          type="submit"
          variant="default"
          isLoading={isProcessing}
          className="font-semibold"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Fetch & Generate AI Content
        </Button>
      </div>
    </form>
  );
}
