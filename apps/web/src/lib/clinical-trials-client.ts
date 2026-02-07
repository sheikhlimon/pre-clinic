import type { Trial } from "./schemas";

const BASE_URL = "https://clinicaltrials.gov/api/v2/studies";

export async function searchTrials(params: {
  conditions: string[];
  age?: number;
  location?: string;
  maxResults?: number;
}): Promise<Trial[]> {
  const { conditions, location, maxResults = 30 } = params;

  // Build query: use EXPANSION[Concept] for synonym matching
  const queryTerms = conditions.map((c) => `"${c}"`).join(" OR ");
  const query = `(${queryTerms}) AND (RECR OR ENROLL)`;

  const searchParams = new URLSearchParams({
    "query.term": query,
    "query.expansion": "concept",
    pageSize: maxResults.toString(),
    fields:
      "NCTId,BriefTitle,OverallStatus,Condition,Phase,Location,EligibilityCriteria,URL",
  });

  if (location) {
    searchParams.append("query.locn", location);
  }

  const url = `${BASE_URL}?${searchParams}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ClinicalTrials.gov API error: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    studies?: Array<{
      protocolSection: {
        identificationModule: { nctId: string; briefTitle: string };
        statusModule: { overallStatus: string };
        conditionsModule?: { conditions?: string[] };
        designModule?: { phases?: string[] };
        contactsLocationsModule?: { locations?: Array<{ city?: string }> };
        eligibilityModule?: { eligibilityCriteria?: string };
      };
    }>;
  };

  // Transform to Trial[]
  return (data.studies || []).slice(0, maxResults).map((study) => {
    const proto = study.protocolSection;
    return {
      nctId: proto.identificationModule.nctId,
      title: proto.identificationModule.briefTitle,
      status: proto.statusModule.overallStatus as
        | "RECRUITING"
        | "ENROLLING_BY_INVITATION"
        | "ACTIVE_NOT_RECRUITING"
        | "COMPLETED"
        | "TERMINATED",
      conditions: proto.conditionsModule?.conditions || [],
      phase: proto.designModule?.phases?.[0],
      location:
        proto.contactsLocationsModule?.locations?.[0]?.city ||
        "Multiple locations",
      eligibility: proto.eligibilityModule?.eligibilityCriteria || "",
      url: `https://clinicaltrials.gov/study/${proto.identificationModule.nctId}`,
    };
  });
}
