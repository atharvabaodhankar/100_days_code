import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/ai/service";
import { RawScrapedProblem } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body
    const body = await req.json();
    const { dayNumber, topic, urls } = body;

    if (!dayNumber || !topic || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "dayNumber, topic, and at least 1 problem URL are required." },
        { status: 400 }
      );
    }

    // 2. Prepare problem inputs from URLs
    const problems: RawScrapedProblem[] = urls.map((url: string, idx: number) => {
      let slug = "Problem";
      try {
        const parsed = new URL(url);
        const pathSegments = parsed.pathname.split("/").filter(Boolean);
        slug = pathSegments[pathSegments.length - 1] || `problem-${idx + 1}`;
      } catch {
        slug = `problem-${idx + 1}`;
      }

      const formattedTitle = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        order: idx + 1,
        title: formattedTitle,
        sourceUrl: url,
        sourceName: url.includes("takeuforward")
          ? "TakeUForward"
          : url.includes("leetcode")
          ? "LeetCode"
          : url.includes("unstop")
          ? "Unstop"
          : "Web",
        statement: `Solve the ${formattedTitle} problem on ${url}. Provide the most efficient time and space optimal approach with clear intuition and dry run trace.`,
        difficulty: idx === 0 ? "Easy" : idx === 1 ? "Medium" : "Hard",
      };
    });

    // 3. Trigger AI Generation with Round-Robin Rotation and Provider Failover
    const result = await AIService.generateChallengeContent({
      dayNumber: Number(dayNumber),
      topic,
      problems,
    });

    return NextResponse.json({
      success: true,
      day: result.day,
      providerUsed: result.providerUsed,
      modelUsed: result.modelUsed,
      latencyMs: result.latencyMs,
    });
  } catch (error: any) {
    console.error("[API Pipeline] Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate challenge content." },
      { status: 500 }
    );
  }
}
