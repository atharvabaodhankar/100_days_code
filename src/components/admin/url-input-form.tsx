"use client";

import * as React from "react";
import { Plus, Trash2, Globe, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

export function UrlInputForm({
  onSubmit,
}: {
  onSubmit?: (data: { dayNumber: number; topic: string; urls: string[] }) => void;
}) {
  const [dayNumber, setDayNumber] = React.useState<number>(27);
  const [topic, setTopic] = React.useState<string>("Binary Search & Lower Bound");
  const [urls, setUrls] = React.useState<string[]>([
    "https://takeuforward.org/plus/dsa/problems/search-insert-position",
    "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
  ]);
  const [isProcessing, setIsProcessing] = React.useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSubmit?.({ dayNumber, topic, urls });
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <label className="text-xs font-medium text-zinc-300">
            Problem URLs (1 to 3 URLs)
          </label>
          <span className="text-xs text-zinc-400 font-mono">
            {urls.length}/3 URLs added
          </span>
        </div>

        <div className="space-y-2.5">
          {urls.map((url, index) => {
            const detectedSource = detectSource(url);
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg border border-zinc-800 bg-zinc-900/30"
              >
                <span className="text-xs font-mono text-zinc-400 w-6 text-center shrink-0">
                  #{index + 1}
                </span>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://takeuforward.org/... or https://leetcode.com/..."
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="flex-1 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none font-mono"
                    required
                  />

                  {detectedSource && (
                    <Badge variant="outline" className="text-[10px] shrink-0 w-fit">
                      <Globe className="h-2.5 w-2.5 mr-1 text-zinc-400" />
                      {detectedSource}
                    </Badge>
                  )}
                </div>

                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(index)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer rounded"
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
            className="w-full text-xs border-dashed text-zinc-400 hover:text-zinc-200"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Another Problem URL ({urls.length}/3)
          </Button>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <AlertCircle className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span>Scraper will extract problem data and trigger AI generation.</span>
        </div>

        <Button
          type="submit"
          variant="default"
          isLoading={isProcessing}
          className="font-semibold"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-zinc-900" />
          Fetch & Generate AI Content
        </Button>
      </div>
    </form>
  );
}
