import { openai } from "@ai-sdk/openrouter";
import { streamText } from "ai";
import type { NextRequest } from "next/server";
import { searchTrials } from "@/lib/clinical-trials-client";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { ExtractionSchema } from "@/lib/schemas";
import { rankTrials } from "@/lib/trial-ranking";

const JSON_REGEX = /```json\n([\s\S]*?)\n```/;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: Message[] };

  const result = streamText({
    model: openai("claude-3-5-sonnet-20241022", {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    }),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 1000,
    temperature: 0.7,
    onFinish: async (event) => {
      // Check if extraction JSON in response
      const fullText = event.text;
      const jsonMatch = fullText.match(JSON_REGEX);

      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          const extraction = ExtractionSchema.parse(data);

          if (extraction.readyToSearch && extraction.conditions.length > 0) {
            const conditionNames = extraction.conditions.map((c) => c.name);
            const searchResults = await searchTrials({
              conditions: conditionNames,
              age: extraction.age,
            });
            const rankedTrials = rankTrials(searchResults, extraction);

            // Add trials to response (handled by frontend)
            // This is just for logging/verification
            // eslint-disable-next-line no-console
            console.log(`Found ${rankedTrials.length} ranked trials`);
          }
        } catch (e) {
          // Parsing error, continue
          // eslint-disable-next-line no-console
          console.error("Error parsing extraction:", e);
        }
      }
    },
  });

  return result.toTextStreamResponse();
}
