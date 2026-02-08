import type { NextRequest } from "next/server";
import { searchTrials } from "@/lib/clinical-trials-client";
import { rankTrials } from "@/lib/trial-ranking";

interface SearchRequest {
  age?: number;
  conditions: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { age, conditions } = (await req.json()) as SearchRequest;

    if (!conditions || conditions.length === 0) {
      return new Response(JSON.stringify({ error: "Conditions required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // eslint-disable-next-line no-console
    console.log("Searching for trials with conditions:", conditions);

    // Search ClinicalTrials.gov
    const searchResults = await searchTrials({ conditions, age });
    // eslint-disable-next-line no-console
    console.log("Search results count:", searchResults.length);

    if (searchResults.length === 0) {
      return Response.json({ trials: [] });
    }

    // Rank trials
    const extraction = {
      age,
      symptoms: conditions,
      conditions: conditions.map((name) => ({ name, probability: 50 })),
      readyToSearch: true,
    };
    const rankedTrials = rankTrials(searchResults, extraction);

    // Format for frontend
    const trials = rankedTrials.map((t) => ({
      nctId: t.nctId,
      title: t.title,
      relevanceScore: t.relevanceScore,
      matchReasons: t.matchReasons,
    }));

    return Response.json({ trials });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Search trials error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage, details: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
