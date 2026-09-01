"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Loader2,
} from "lucide-react";
import { getAdminDayByNumber, saveAdminDraft, publishDay } from "@/lib/firebase/firestore";
import { AdminDay, Problem } from "@/types";
import { ProblemEditor } from "@/components/admin/problem-editor";
import { WhatsAppPreview } from "@/components/admin/whatsapp-preview";
import { WorkflowStepper } from "@/components/admin/workflow-stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminDayReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const dayParam = params?.day as string;
  const dayNumber = parseInt(dayParam, 10);

  const [dayData, setDayData] = React.useState<AdminDay | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [selectedProblemIndex, setSelectedProblemIndex] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

  React.useEffect(() => {
    async function loadDay() {
      if (isNaN(dayNumber)) {
        setLoading(false);
        return;
      }
      try {
        const fetched = await getAdminDayByNumber(dayNumber);
        setDayData(fetched);
      } catch (err) {
        console.error("Failed to load admin day:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDay();
  }, [dayNumber]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500">Loading day data from Firestore...</p>
      </div>
    );
  }

  if (!dayData) {
    return (
      <div className="py-12">
        <EmptyState
          title={`Day ${dayParam} Not Found`}
          description="Could not locate draft or published day record with this identifier in Firestore."
          actionLabel="Back to Dashboard"
          onAction={() => router.push("/admin")}
        />
      </div>
    );
  }

  const handleProblemUpdate = (updatedProblem: Problem) => {
    const updatedProblems = [...dayData.problems];
    updatedProblems[selectedProblemIndex] = updatedProblem;
    setDayData({ ...dayData, problems: updatedProblems });
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await saveAdminDraft(dayData);
      showToast({
        type: "success",
        title: "Draft Saved to Firestore",
        message: `Day ${dayData.dayNumber} draft updated successfully.`,
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Failed to Save",
        message: err?.message || "Could not write to Firestore.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishDay(dayData);
      setDayData({ ...dayData, status: "published" });
      showToast({
        type: "success",
        title: "Day Published Live!",
        message: `Day ${dayData.dayNumber} is now live in Firestore for students at /day/${dayData.dayNumber}.`,
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Publish Failed",
        message: err?.message || "Could not publish to Firestore.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const activeProblem = dayData.problems[selectedProblemIndex] || dayData.problems[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumbs & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Admin Dashboard</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {dayData.status === "published" && (
            <Link href={`/day/${dayData.dayNumber}`} target="_blank">
              <Button variant="ghost" size="sm" className="text-xs">
                <Eye className="h-3.5 w-3.5 mr-1" />
                Live Student Page
              </Button>
            </Link>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            isLoading={isSaving}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Draft to Firestore
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handlePublish}
            isLoading={isPublishing}
            className="font-semibold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-zinc-950"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            {dayData.status === "published" ? "Update Published Day" : "Publish Day to Live Site"}
          </Button>
        </div>
      </div>

      {/* Workflow Stage */}
      <WorkflowStepper currentStepIndex={dayData.status === "published" ? 5 : 3} />

      {/* Day Overview Header Card */}
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/50">
              Day {dayData.dayNumber} Editor
            </span>
            <Badge variant={dayData.status === "published" ? "published" : "draft"}>
              {dayData.status === "published" ? "Published Live" : "Draft (Admin Only)"}
            </Badge>
          </div>

          <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            Provider: {dayData.generationMetadata?.providerUsed || "Gemini"} • {dayData.problemCount} Problems • Firestore Linked
          </div>
        </div>

        {/* Day Metadata Input */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <Input
              label="Day Number"
              type="number"
              value={dayData.dayNumber}
              onChange={(e) =>
                setDayData({
                  ...dayData,
                  dayNumber: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
          <div className="sm:col-span-3">
            <Input
              label="Challenge Topic Title"
              value={dayData.topic}
              onChange={(e) =>
                setDayData({ ...dayData, topic: e.target.value })
              }
            />
          </div>
        </div>
      </section>

      {/* Problem Review & Inline Editing Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Problem Breakdown & Code Review
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {dayData.problems.length} problems in this challenge
          </span>
        </div>

        {/* Problem Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {dayData.problems.map((prob, idx) => {
            const isSelected = idx === selectedProblemIndex;
            return (
              <button
                key={prob.id}
                onClick={() => setSelectedProblemIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700"
                    : "bg-zinc-100/60 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <span className="font-mono text-zinc-400 dark:text-zinc-500">#{idx + 1}</span>
                <span className="font-semibold">{prob.title}</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">({prob.difficulty})</span>
              </button>
            );
          })}
        </div>

        {/* Active Problem Editor */}
        {activeProblem && (
          <ProblemEditor
            key={activeProblem.id}
            problem={activeProblem}
            onUpdate={handleProblemUpdate}
          />
        )}
      </section>

      {/* PRIVATE ADMIN CONTENT: WhatsApp Announcement */}
      <section className="space-y-3 pt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          WhatsApp Community Announcement
        </h2>
        <WhatsAppPreview
          message={dayData.whatsappMessage}
          dayNumber={dayData.dayNumber}
        />
      </section>
    </div>
  );
}
