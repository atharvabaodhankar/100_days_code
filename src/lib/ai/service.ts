import { z } from "zod";
import { generateWithGemini } from "./gemini";
import { generateWithGroq } from "./groq";
import { RawScrapedProblem } from "./prompts";
import { AdminDay, Problem } from "@/types";

// Schema for runtime validation of AI output
export const GeneratedProblemSchema = z.object({
  order: z.number().default(1),
  title: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Easy"),
  sourceName: z.string().default("Web"),
  sourceUrl: z.string().default(""),
  statement: z.string().min(1),
  constraints: z.array(z.string()).default([]),
  examples: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string().optional(),
      })
    )
    .default([]),
  shortDescription: z.string().default(""),
  observation: z.string().min(1),
  logic: z.string().min(1),
  approach: z.string().min(1),
  dryRun: z.string().default(""),
  complexity: z.object({
    time: z.string().default("O(N)"),
    space: z.string().default("O(1)"),
  }),
  keyConcepts: z.array(z.string()).default([]),
  solutions: z.object({
    cpp: z.string().min(1),
    python: z.string().min(1),
    java: z.string().optional(),
  }),
});

export const GeneratedDayPayloadSchema = z.object({
  dayNumber: z.number(),
  topic: z.string(),
  problems: z.array(GeneratedProblemSchema),
  whatsappMessage: z.string().min(10),
});

export interface AIGenerationResult {
  day: AdminDay;
  providerUsed: "gemini" | "groq";
  modelUsed: string;
  latencyMs: number;
}

export class AIService {
  /**
   * Generates full challenge breakdown & WhatsApp message.
   * Runs Gemini primary with Round-Robin key rotation, then falls back to Groq with 5-key Round-Robin rotation.
   */
  static async generateChallengeContent(params: {
    dayNumber: number;
    topic: string;
    problems: RawScrapedProblem[];
  }): Promise<AIGenerationResult> {
    let resultData: any;
    let providerUsed: "gemini" | "groq" = "gemini";
    let modelUsed: string = "gemini-1.5-flash";
    let latencyMs: number = 0;

    // 1. Try Gemini (Primary)
    try {
      console.log(`[AIService] Triggering Gemini generation for Day ${params.dayNumber}...`);
      const geminiRes = await generateWithGemini(params);
      resultData = geminiRes.data;
      providerUsed = "gemini";
      modelUsed = geminiRes.provider;
      latencyMs = geminiRes.latencyMs;
      console.log(`[AIService] Gemini successfully generated content in ${latencyMs}ms`);
    } catch (geminiError) {
      console.warn("[AIService] Gemini generation failed. Falling back to Groq Llama-3...", geminiError);

      // 2. Fallback to Groq (Secondary)
      try {
        const groqRes = await generateWithGroq(params);
        resultData = groqRes.data;
        providerUsed = "groq";
        modelUsed = groqRes.provider;
        latencyMs = groqRes.latencyMs;
        console.log(`[AIService] Groq successfully generated content in ${latencyMs}ms`);
      } catch (groqError) {
        console.error("[AIService] Both Gemini and Groq AI providers failed:", {
          geminiError,
          groqError,
        });
        throw new Error(
          "All AI generation providers failed. Please verify API keys or retry."
        );
      }
    }

    // 3. Strict Schema Validation with Zod
    const validation = GeneratedDayPayloadSchema.safeParse(resultData);
    if (!validation.success) {
      console.error("[AIService] AI response failed schema validation:", validation.error.format());
      throw new Error(`AI generated invalid response structure: ${validation.error.message}`);
    }

    const validData = validation.data;

    // 4. Transform into complete AdminDay model
    const now = new Date().toISOString();
    const formattedProblems: Problem[] = validData.problems.map((p, idx) => ({
      id: `p-${validData.dayNumber}-${idx + 1}-${Date.now().toString(36)}`,
      order: p.order || idx + 1,
      title: p.title,
      topic: p.topic || validData.topic,
      difficulty: p.difficulty,
      sourceName: (p.sourceName as any) || "takeuforward",
      sourceUrl: p.sourceUrl || params.problems[idx]?.sourceUrl || "",
      statement: p.statement,
      constraints: p.constraints,
      examples: p.examples,
      shortDescription: p.shortDescription || p.observation.slice(0, 100),
      observation: p.observation,
      logic: p.logic,
      approach: p.approach,
      dryRun: p.dryRun,
      complexity: p.complexity,
      keyConcepts: p.keyConcepts,
      solutions: {
        cpp: p.solutions.cpp,
        python: p.solutions.python,
        java: p.solutions.java || undefined,
      },
    }));

    const adminDay: AdminDay = {
      id: `day-${validData.dayNumber}`,
      dayNumber: validData.dayNumber,
      topic: validData.topic,
      status: "draft",
      problemCount: formattedProblems.length,
      rawUrls: params.problems.map((p) => p.sourceUrl),
      whatsappMessage: validData.whatsappMessage,
      createdAt: now,
      updatedAt: now,
      generationMetadata: {
        providerUsed,
        latencyMs,
      },
      problems: formattedProblems,
    };

    return {
      day: adminDay,
      providerUsed,
      modelUsed,
      latencyMs,
    };
  }
}
