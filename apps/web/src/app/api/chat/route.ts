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

interface TrialResult {
  nctId: string;
  title: string;
  relevanceScore: number;
  matchReasons: string[];
}

async function handleExtractionAndSearch(
  fullText: string,
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController<Uint8Array>
): Promise<TrialResult[] | null> {
  const jsonMatch = fullText.match(JSON_REGEX);
  if (!jsonMatch) {
    // eslint-disable-next-line no-console
    console.log("No JSON extraction found in response");
    return null;
  }

  try {
    const extraction = ExtractionSchema.parse(JSON.parse(jsonMatch[1]));
    // eslint-disable-next-line no-console
    console.log("Extraction parsed:", extraction);

    if (!extraction.readyToSearch || extraction.conditions.length === 0) {
      // eslint-disable-next-line no-console
      console.log("Not ready to search or no conditions");
      return null;
    }

    const conditionNames = extraction.conditions.map((c) => c.name);
    // eslint-disable-next-line no-console
    console.log("Searching for conditions:", conditionNames);

    const searchResults = await searchTrials({
      conditions: conditionNames,
      age: extraction.age,
    });
    // eslint-disable-next-line no-console
    console.log("Found trials from API:", searchResults.length);

    const rankedTrials = rankTrials(searchResults, extraction);
    // eslint-disable-next-line no-console
    console.log("Ranked trials:", rankedTrials.length);

    // Send trials to frontend
    const trialsData = rankedTrials.slice(0, 5).map((t) => ({
      nctId: t.trial.nctId,
      title: t.trial.title,
      relevanceScore: t.relevanceScore,
      matchReasons: t.matchReasons,
    }));

    controller.enqueue(
      encoder.encode(
        `data: ${JSON.stringify({
          content: `\n\nFound ${rankedTrials.length} matching trials.`,
          trials: trialsData,
        })}\n\n`
      )
    );

    return trialsData;
  } catch (e) {
    // Parsing error, continue
    // eslint-disable-next-line no-console
    console.error("Extraction/search error:", e);
    return null;
  }
}

function processStreamChunk(
  chunk: string,
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController<Uint8Array>
): string {
  let accumulated = "";
  const lines = chunk.split("\n");

  for (const line of lines) {
    if (!line.startsWith("data: ")) {
      continue;
    }

    const data = line.slice(6);
    if (data === "[DONE]") {
      continue;
    }

    try {
      const parsed = JSON.parse(data);
      const content = parsed.choices?.[0]?.delta?.content || "";
      if (content) {
        accumulated += content;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
        );
      }
    } catch {
      // Skip unparseable lines
    }
  }

  return accumulated;
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: Message[] };

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response("OpenRouter API key not configured", { status: 500 });
  }

  try {
    // Call OpenRouter API with streaming
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "claude-3.5-sonnet",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 1000,
          temperature: 0.7,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      // eslint-disable-next-line no-console
      console.error("OpenRouter error:", error);
      return new Response("API error", { status: response.status });
    }

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let fullText = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              await handleExtractionAndSearch(fullText, encoder, controller);
              break;
            }

            const chunk = new TextDecoder().decode(value);
            fullText += processStreamChunk(chunk, encoder, controller);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
