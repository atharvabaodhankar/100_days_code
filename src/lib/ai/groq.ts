import { env } from "../env";
import { KeyRotator } from "./key-rotator";
import { buildSystemPrompt, buildUserPrompt, RawScrapedProblem } from "./prompts";

// Verified active free tier Groq model
const GROQ_MODEL = "qwen/qwen3.6-27b";

export async function generateWithGroq(params: {
  dayNumber: number;
  topic: string;
  problems: RawScrapedProblem[];
}): Promise<{ data: any; provider: string; latencyMs: number }> {
  const startTime = Date.now();
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt({
    ...params,
    publicUrl: env.NEXT_PUBLIC_APP_URL,
  });

  const keys = env.GROQ_API_KEYS;
  if (keys.length === 0) {
    throw new Error("GROQ_API_KEY environment variable is not configured.");
  }

  const groqRotator = new KeyRotator("Groq", keys);

  const rawJsonText = await groqRotator.executeWithRotation(async (apiKey) => {
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Groq API error (status ${res.status}): ${errorBody}`);
    }

    const responseData = await res.json();
    const content = responseData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Groq returned an empty response choice.");
    }

    return content;
  });

  const parsed = JSON.parse(rawJsonText);
  return {
    data: parsed,
    provider: `groq (${GROQ_MODEL})`,
    latencyMs: Date.now() - startTime,
  };
}
