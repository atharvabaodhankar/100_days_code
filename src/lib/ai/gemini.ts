import { env } from "../env";
import { KeyRotator } from "./key-rotator";
import { buildSystemPrompt, buildUserPrompt, RawScrapedProblem } from "./prompts";

const geminiRotator = new KeyRotator("Gemini", env.GEMINI_API_KEYS);

// Free tier model
const GEMINI_MODEL = "gemini-1.5-flash";

export async function generateWithGemini(params: {
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

  const rawJsonText = await geminiRotator.executeWithRotation(async (apiKey) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Gemini API error (status ${res.status}): ${errorBody}`);
    }

    const responseData = await res.json();
    const candidate = responseData.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gemini returned an empty response body.");
    }

    return text;
  });

  const parsed = JSON.parse(rawJsonText);
  return {
    data: parsed,
    provider: `gemini (${GEMINI_MODEL})`,
    latencyMs: Date.now() - startTime,
  };
}
