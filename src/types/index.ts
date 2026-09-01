export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemSource = "takeuforward" | "leetcode" | "unstop" | "generic" | "manual";

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemComplexity {
  time: string;
  space: string;
}

export interface ProblemSolutions {
  cpp: string;
  python: string;
  java?: string;
}

export interface Problem {
  id: string;
  order: number;
  title: string;
  topic: string;
  difficulty: Difficulty;
  sourceName: ProblemSource;
  sourceUrl: string;
  statement: string;
  constraints: string[];
  examples: ProblemExample[];
  shortDescription: string;
  observation: string;
  logic: string;
  approach: string;
  dryRun: string;
  complexity: ProblemComplexity;
  keyConcepts: string[];
  solutions: ProblemSolutions;
}

export interface PublicDay {
  id: string;
  dayNumber: number;
  topic: string;
  status: "published";
  problemCount: number;
  publishedAt: string;
  problems: Problem[];
}

export interface AdminDay {
  id: string;
  dayNumber: number;
  topic: string;
  status: "draft" | "published";
  problemCount: number;
  rawUrls: string[];
  whatsappMessage: string;
  generationMetadata?: {
    providerUsed: "gemini" | "groq";
    tokensUsed?: number;
    latencyMs: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  problems: Problem[];
}

export type PipelineStep = "input" | "scraping" | "ai_generating" | "review" | "publish" | "whatsapp";
