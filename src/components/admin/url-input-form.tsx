"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  Globe,
  Sparkles,
  AlertCircle,
  Loader2,
  ListOrdered,
  Layers,
  Check,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Wand2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/toast";
import {
  STRIVERS_A2Z_SHEET,
  CURRENT_DAY_50_INDEX,
  getNextProblemsFromSheet,
  StriverProblem,
} from "@/lib/data/strivers-sheet";

const STORAGE_KEY = "strivers_sheet_current_index";

export function UrlInputForm({
  initialDayNumber = 51,
  onSubmit,
}: {
  initialDayNumber?: number;
  onSubmit?: (data: { dayNumber: number; topic: string; urls: string[]; generatedDay?: any }) => void;
}) {
  const { showToast } = useToast();

  const [mode, setMode] = React.useState<"auto" | "manual">("auto");
  const [dayNumber, setDayNumber] = React.useState<number>(initialDayNumber);
  const [topic, setTopic] = React.useState<string>("");
  const [urls, setUrls] = React.useState<string[]>([""]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Striver's sheet auto-picker state
  const [pickCount, setPickCount] = React.useState<1 | 2 | 3>(1);
  const [sheetIndex, setSheetIndex] = React.useState<number>(CURRENT_DAY_50_INDEX >= 0 ? CURRENT_DAY_50_INDEX : 15);
  const [searchFilter, setSearchFilter] = React.useState<string>("");

  // Sync initialDayNumber if parent updates
  React.useEffect(() => {
    if (initialDayNumber) {
      setDayNumber(initialDayNumber);
    }
  }, [initialDayNumber]);

  // Load last saved index from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < STRIVERS_A2Z_SHEET.length) {
          setSheetIndex(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Compute next problems to be picked
  // Note: sheetIndex points to the LAST completed problem (e.g. Koko eating bananas), so next starts at sheetIndex + 1
  const nextStartIndex = (sheetIndex + 1) % STRIVERS_A2Z_SHEET.length;
  const { problems: selectedProblems, nextIndex: projectedNextIndex } = getNextProblemsFromSheet(
    nextStartIndex,
    pickCount
  );

  const currentLastProblem = STRIVERS_A2Z_SHEET[sheetIndex] || STRIVERS_A2Z_SHEET[CURRENT_DAY_50_INDEX];

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

  // Auto-fill from selected sheet problems
  const handleApplySheetSelection = () => {
    if (!selectedProblems.length) return;

    const chosenUrls = selectedProblems.map((p) => p.tufUrl);
    const chosenTopic = selectedProblems[0].topic || selectedProblems[0].step;

    setTopic(chosenTopic);
    setUrls(chosenUrls);
    setMode("manual");

    showToast({
      type: "success",
      title: "Problems Applied",
      message: `Loaded ${selectedProblems.length} problem(s) from Striver's sheet for Day ${dayNumber}.`,
    });
  };

  // Auto-detect topic from current URLs or slug
  const handleAutoDetectTopic = () => {
    const firstUrl = urls.find((u) => u.trim().length > 0);
    if (!firstUrl) {
      showToast({
        type: "error",
        title: "No URL found",
        message: "Please enter at least one problem URL to detect topic.",
      });
      return;
    }

    // Check if matching in striver's sheet
    const matched = STRIVERS_A2Z_SHEET.find(
      (p) =>
        firstUrl.toLowerCase().includes(p.title.toLowerCase().replace(/[^a-z0-9]/g, "-")) ||
        (p.tufUrl && firstUrl.includes(p.tufUrl.split("/").filter(Boolean).pop() || ""))
    );

    if (matched) {
      setTopic(matched.topic);
      showToast({
        type: "success",
        title: "Topic Detected",
        message: `Set topic to "${matched.topic}"`,
      });
      return;
    }

    // Fallback: Clean URL slug
    try {
      const urlObj = new URL(firstUrl);
      const segments = urlObj.pathname.split("/").filter(Boolean);
      const lastSegment = segments[segments.length - 1] || segments[segments.length - 2] || "";
      const cleaned = lastSegment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      if (cleaned) {
        setTopic(cleaned);
        showToast({
          type: "success",
          title: "Topic Inferred",
          message: `Inferred "${cleaned}" from URL slug.`,
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Invalid URL",
        message: "Could not parse URL to detect topic.",
      });
    }
  };

  const handleUpdateLastCompletedIndex = (newIndex: number) => {
    setSheetIndex(newIndex);
    try {
      localStorage.setItem(STORAGE_KEY, newIndex.toString());
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const validUrls = urls.filter((u) => u.trim().length > 0);
      if (validUrls.length === 0) {
        throw new Error("Please add at least one valid problem URL.");
      }

      if (!topic.trim()) {
        throw new Error("Please provide a topic title.");
      }

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

      // Advance sheet pointer if we applied from sheet
      handleUpdateLastCompletedIndex((sheetIndex + validUrls.length) % STRIVERS_A2Z_SHEET.length);

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

  const filteredSheetProblems = searchFilter.trim()
    ? STRIVERS_A2Z_SHEET.filter(
        (p) =>
          p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          p.topic.toLowerCase().includes(searchFilter.toLowerCase()) ||
          p.step.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : STRIVERS_A2Z_SHEET;

  return (
    <div className="space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("auto")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "auto"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Auto-Pick (Striver's A2Z Sheet)
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "manual"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Manual / Custom URLs
          </button>
        </div>

        <span className="text-[11px] font-mono text-zinc-400">
          Target: Day {dayNumber}
        </span>
      </div>

      {/* Auto-Pick from Striver's Sheet Panel */}
      {mode === "auto" && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/15">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px]">
                  Sequential Tracker
                </Badge>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  Last Solved: <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{currentLastProblem?.title}</strong>
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                {currentLastProblem?.step} • {currentLastProblem?.topic} (Index #{sheetIndex + 1} of {STRIVERS_A2Z_SHEET.length})
              </p>
            </div>

            {/* Pick count selector */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto">
              <span className="text-[11px] font-medium text-zinc-500 px-2">Pick for Today:</span>
              <button
                type="button"
                onClick={() => setPickCount(1)}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  pickCount === 1
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                1 Problem
              </button>
              <button
                type="button"
                onClick={() => setPickCount(2)}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  pickCount === 2
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                2 Problems
              </button>
            </div>
          </div>

          {/* Next problem cards preview */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <ListOrdered className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Next Problem(s) in Sequence for Day {dayNumber}:
            </span>

            <div className="grid gap-2">
              {selectedProblems.map((prob, idx) => (
                <div
                  key={prob.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        #{idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {prob.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1.5 py-0 ${
                          prob.difficulty === "Easy"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : prob.difficulty === "Medium"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-rose-500/10 text-rose-600"
                        }`}
                      >
                        {prob.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span>{prob.step}</span>
                      <span>•</span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">{prob.topic}</span>
                    </div>
                  </div>

                  <a
                    href={prob.tufUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-emerald-600 transition-colors"
                    title="View Problem on TakeUForward"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row & Change Pointer Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0">
                Change Last Solved:
              </label>
              <select
                value={sheetIndex}
                onChange={(e) => handleUpdateLastCompletedIndex(parseInt(e.target.value, 10))}
                className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-2 py-1 text-zinc-800 dark:text-zinc-200 max-w-xs focus:outline-none"
              >
                {STRIVERS_A2Z_SHEET.map((p, idx) => (
                  <option key={p.id} value={idx}>
                    #{idx + 1}: {p.title} ({p.topic})
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleApplySheetSelection}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
            >
              <Wand2 className="h-3.5 w-3.5 mr-1.5" />
              Auto-Fill Day {dayNumber} ({pickCount} Problem{pickCount > 1 ? "s" : ""})
            </Button>
          </div>
        </div>
      )}

      {/* Main Input Form */}
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
          <div className="sm:col-span-2 space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Topic Title
              </label>
              <button
                type="button"
                onClick={handleAutoDetectTopic}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Sparkles className="h-3 w-3" />
                Auto-detect from URLs
              </button>
            </div>
            <Input
              placeholder="e.g. Binary Search on Answers or Dynamic Programming"
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
              {urls.filter((u) => u.trim().length > 0).length}/3 URLs added
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
                      placeholder="https://takeuforward.org/practice/dsa/... or https://leetcode.com/problems/..."
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
            <span>Gemini 2.5 Flash Round-Robin (Primary) → Groq Llama-3 (Fallback).</span>
          </div>

          <Button
            type="submit"
            variant="default"
            isLoading={isProcessing}
            className="font-semibold shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Fetch & Generate AI Content
          </Button>
        </div>
      </form>
    </div>
  );
}
