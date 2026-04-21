import type { NextRequest } from "next/server";
import { searchTrials } from "@/lib/clinical-trials-client";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { ExtractionSchema } from "@/lib/schemas";
import { rankTrials } from "@/lib/trial-ranking";

const JSON_REGEX = /```json\s*\n?([\s\S]*?)\n?\s*```/;

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

interface StreamWriter {
  write: (chunk: Uint8Array) => Promise<void>;
}

async function handleExtractionAndSearch(
  fullText: string,
  encoder: TextEncoder,
  writer: StreamWriter,
): Promise<void> {
  const jsonMatch = fullText.match(JSON_REGEX);
  if (!jsonMatch) {
    return;
  }

  try {
    const jsonStr = jsonMatch[1];
    const parsed = JSON.parse(jsonStr);
    const extraction = ExtractionSchema.parse(parsed);

    // Send extraction data to frontend for extraction panel display
    await writer.write(
      encoder.encode(
        `data: ${JSON.stringify({ extractedData: extraction })}\n\n`,
      ),
    );

    if (!extraction.readyToSearch) {
      return;
    }

    // Notify frontend that trial search has started
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ searchingTrials: true })}\n\n`),
    );

    // Search for trials internally
    const searchResults = await searchTrials({
      conditions: extraction.conditions.map((c) => c.name),
      age: extraction.age,
      location: extraction.location,
    });

    if (searchResults.length === 0) {
      return;
    }

    // Rank trials
    const rankedTrials = rankTrials(searchResults, extraction);

    // Format and send trials to frontend
    const trials: TrialResult[] = rankedTrials.map((t) => ({
      nctId: t.nctId,
      title: t.title,
      relevanceScore: t.relevanceScore,
      matchReasons: t.matchReasons,
    }));

    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ trials })}\n\n`),
    );
  } catch {
    // Extraction parsing or trial search failed silently
  }
}

function processStreamChunk(chunk: string): string {
  const lines = chunk.split("\n");
  let accumulatedContent = "";

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
        accumulatedContent += content;
      }
    } catch {
      // Skip unparseable lines
    }
  }

  return accumulatedContent;
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: Message[] };

  if (!process.env.OPENROUTER_API_KEY) {
    return Response.json(
      {
        error: "missing_api_key",
        message: "OpenRouter API key not configured",
      },
      { status: 503 },
    );
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
          model: process.env.OPENROUTER_MODEL || "openrouter/free",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 1000,
          temperature: 0.7,
          stream: true,
          reasoning: { enabled: false },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const parsed = JSON.parse(errorText);
        const message =
          parsed?.error?.message || parsed?.error?.code || "Unknown API error";
        return Response.json(
          { error: "openrouter_error", message },
          { status: response.status },
        );
      } catch {
        return Response.json(
          { error: "openrouter_error", message: errorText.slice(0, 200) },
          { status: response.status },
        );
      }
    }

    // Stream response — forward each LLM chunk to client immediately
    const encoder = new TextEncoder();

    // Use a TransformStream so we can write to it imperatively
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();

    // Pump the LLM stream in the background
    (async () => {
      const reader = response.body?.getReader();
      if (!reader) {
        await writer.close();
        return;
      }

      let fullText = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const content = processStreamChunk(chunk);
          fullText += content;

          // Forward each chunk to the client immediately
          if (content) {
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
            );
          }
        }

        // After streaming completes, handle extraction and trial search
        await handleExtractionAndSearch(fullText, encoder, writer);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Stream error:", error);
      }

      await writer.close();
    })();

    return new Response(readable, {
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
