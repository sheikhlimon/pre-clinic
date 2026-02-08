import type { NextRequest } from "next/server";
import { searchTrials } from "@/lib/clinical-trials-client";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { ExtractionSchema } from "@/lib/schemas";
import { rankTrials } from "@/lib/trial-ranking";

const JSON_REGEX = /```json\s*\n?([\s\S]*?)\n?\s*```/;

// Strip JSON blocks from content for display
function stripJsonFromContent(content: string): string {
  return content.replace(JSON_REGEX, "").trim();
}

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
): Promise<void> {
  const jsonMatch = fullText.match(JSON_REGEX);
  if (!jsonMatch) {
    return;
  }

  try {
    const jsonStr = jsonMatch[1];
    const parsed = JSON.parse(jsonStr);
    const extraction = ExtractionSchema.parse(parsed);

    // eslint-disable-next-line no-console
    console.log("Extraction parsed:", {
      readyToSearch: extraction.readyToSearch,
      conditions: extraction.conditions.length,
      symptoms: extraction.symptoms.length,
      age: extraction.age,
      location: extraction.location,
    });

    // Send extraction data to frontend for extraction panel display
    controller.enqueue(
      encoder.encode(
        `data: ${JSON.stringify({ extractedData: extraction })}\n\n`
      )
    );

    if (!extraction.readyToSearch) {
      // eslint-disable-next-line no-console
      console.log("Not ready to search yet - readyToSearch is false");
      return;
    }

    // eslint-disable-next-line no-console
    console.log("CHAT ROUTE: Starting search for trials...");

    // Search for trials internally
    const searchResults = await searchTrials({
      conditions: extraction.conditions.map((c) => c.name),
      age: extraction.age,
      location: extraction.location,
    });

    // eslint-disable-next-line no-console
    console.log("Search results:", searchResults.length);

    if (searchResults.length === 0) {
      // eslint-disable-next-line no-console
      console.log("No search results found");
      return;
    }

    // eslint-disable-next-line no-console
    console.log("Ranking trials...");

    // Rank trials
    const rankedTrials = rankTrials(searchResults, extraction);

    // eslint-disable-next-line no-console
    console.log("Ranked trials:", rankedTrials.length);

    // Format and send trials to frontend
    const trials: TrialResult[] = rankedTrials.map((t) => ({
      nctId: t.nctId,
      title: t.title,
      relevanceScore: t.relevanceScore,
      matchReasons: t.matchReasons,
    }));

    // eslint-disable-next-line no-console
    console.log("Sending trials to frontend:", trials.length);

    try {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ trials })}\n\n`)
      );
      // eslint-disable-next-line no-console
      console.log("Trials sent successfully");
    } catch (sendError) {
      // eslint-disable-next-line no-console
      console.error("Error sending trials:", sendError);
    }
  } catch (e) {
    // Parsing or search error, continue silently
    // eslint-disable-next-line no-console
    console.error("Extraction/search error:", e);
    if (e instanceof Error) {
      // eslint-disable-next-line no-console
      console.error("Error details:", e.message);
    }
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
              // Extract JSON from full text and search for trials
              await handleExtractionAndSearch(fullText, encoder, controller);
              break;
            }

            const chunk = new TextDecoder().decode(value);
            fullText += processStreamChunk(chunk);
          }

          // After extracting JSON, stream the non-JSON content to client
          const cleanContent = stripJsonFromContent(fullText);
          if (cleanContent && cleanContent.trim().length > 0) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ content: cleanContent })}\n\n`
              )
            );
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Stream error:", error);
        }

        // Close controller AFTER all async operations complete
        controller.close();
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
