import type { Extraction, RankedTrial, Trial } from "./schemas";

export function rankTrials(
  trials: Trial[],
  extraction: Extraction
): RankedTrial[] {
  return trials
    .map((trial) => {
      let score = 50; // Base score
      const reasons: string[] = [];

      // Condition matching (highest weight)
      const matchingConditions = extraction.conditions.filter((cond) =>
        trial.conditions.some(
          (trialCond) =>
            trialCond.toLowerCase().includes(cond.name.toLowerCase()) ||
            cond.name.toLowerCase().includes(trialCond.toLowerCase())
        )
      );

      if (matchingConditions.length > 0) {
        const avgProbability =
          matchingConditions.reduce((sum, c) => sum + c.probability, 0) /
          matchingConditions.length;
        score += (avgProbability / 100) * 40; // Up to 40 points
        reasons.push(`Matches condition: ${matchingConditions[0].name}`);
      }

      // Recruiting status
      if (
        trial.status === "RECRUITING" ||
        trial.status === "ENROLLING_BY_INVITATION"
      ) {
        score += 10;
        reasons.push("Currently recruiting");
      }

      // Phase preference (Phase 1-2 for early exploration)
      if (
        trial.phase &&
        (trial.phase.includes("1") || trial.phase.includes("2"))
      ) {
        score += 5;
        reasons.push(`${trial.phase} trial`);
      }

      // Age appropriateness (if extracting eligibility)
      if (
        extraction.age &&
        trial.eligibility &&
        trial.eligibility.toLowerCase().includes(extraction.age.toString())
      ) {
        score += 5;
        reasons.push("Matches your age range");
      }

      return {
        ...trial,
        relevanceScore: Math.min(Math.round(score), 100),
        matchReasons:
          reasons.length > 0 ? reasons : ["Matched search criteria"],
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5); // Return top 5
}
