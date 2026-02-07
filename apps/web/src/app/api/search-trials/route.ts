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
      return new Response("Conditions required", { status: 400 });
    }

    // Search ClinicalTrials.gov
    const searchResults = await searchTrials({ conditions, age });

    if (searchResults.length === 0) {
      return Response.json({ trials: [] });
    }

    // Rank trials
    const extraction = {
      age,
      conditions: conditions.map((name) => ({ name, probability: 50 })),
    };
    const rankedTrials = rankTrials(searchResults, extraction);

    // Format for frontend
    const trials = rankedTrials.slice(0, 5).map((t) => ({
      nctId: t.trial.nctId,
      title: t.trial.title,
      relevanceScore: t.relevanceScore,
      matchReasons: t.matchReasons,
    }));

    return Response.json({ trials });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Search trials error:", error);
    return new Response("Search failed", { status: 500 });
  }
}
