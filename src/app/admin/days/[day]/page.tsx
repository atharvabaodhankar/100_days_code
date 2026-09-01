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
  Trash2,
} from "lucide-react";
import { getAdminDayByNumber, saveAdminDraft, publishDay, deleteDay } from "@/lib/firebase/firestore";
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
  const [isDeleting, setIsDeleting] = React.useState(false);

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

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete Day ${dayData.dayNumber} from Firestore? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteDay(dayData.dayNumber);
      showToast({
        type: "success",
        title: "Day Deleted",
        message: `Day ${dayData.dayNumber} was permanently removed from Firestore.`,
      });
      router.push("/admin");
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Deletion Failed",
        message: err?.message || "Could not delete day from Firestore.",
      });
      setIsDeleting(false);
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

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
            title="Delete Day"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete Day
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
              {dayData.status === "published" ? "Published Live" : "Draft Mode"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Topic Title
            </label>
            <Input
              value={dayData.topic}
              onChange={(e) => setDayData({ ...dayData, topic: e.target.value })}
              className="font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Day Number
            </label>
            <Input
              type="number"
              value={dayData.dayNumber}
              onChange={(e) =>
                setDayData({
                  ...dayData,
                  dayNumber: parseInt(e.target.value, 10) || dayData.dayNumber,
                })
              }
              className="font-mono"
            />
          </div>
        </div>
      </section>

      {/* WhatsApp Message Preview */}
      <WhatsAppPreview
        message={dayData.whatsappMessage}
        dayNumber={dayData.dayNumber}
      />

      {/* Problem Selection & Editor */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Problems ({dayData.problems.length})
          </h2>
          <div className="flex items-center gap-1.5">
            {dayData.problems.map((p, idx) => (
              <Button
                key={p.id || idx}
                variant={selectedProblemIndex === idx ? "default" : "secondary"}
                size="sm"
                className="font-mono text-xs"
                onClick={() => setSelectedProblemIndex(idx)}
              >
                P{idx + 1}: {p.title.slice(0, 15)}...
              </Button>
            ))}
          </div>
        </div>

        {activeProblem && (
          <ProblemEditor
            problem={activeProblem}
            onUpdate={handleProblemUpdate}
          />
        )}
      </section>
    </div>
  );
}
