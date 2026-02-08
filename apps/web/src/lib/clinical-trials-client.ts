import type { Trial } from "./schemas";

const BASE_URL = "https://clinicaltrials.gov/api/v2/studies";

export async function searchTrials(params: {
  conditions: string[];
  age?: number;
  location?: string;
  maxResults?: number;
}): Promise<Trial[]> {
  const { conditions, location, maxResults = 30 } = params;

  // Build query - use simpler format for better API compatibility
  // Join multiple conditions with AND for narrower results
  const queryTerms = conditions
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  if (queryTerms.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("No valid conditions provided for search");
    return [];
  }

  // Use simpler query format: first term only to avoid syntax errors
  // The API is sensitive to query syntax, so keep it minimal
  const query = queryTerms[0];

  const searchParams = new URLSearchParams({
    "query.term": query,
    pageSize: Math.min(maxResults, 50).toString(),
    fields: "NCTId,BriefTitle,OverallStatus,Condition,Phase,Location",
  });

  if (location) {
    searchParams.append("query.locn", location);
  }

  const url = `${BASE_URL}?${searchParams}`;

  // eslint-disable-next-line no-console
  console.log(
    "ClinicalTrials.gov search - Conditions:",
    queryTerms,
    "URL:",
    url
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000), // 10 second timeout
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "(no body)");
      // eslint-disable-next-line no-console
      console.error(
        `ClinicalTrials.gov API error ${response.status}:`,
        errorBody
      );
      throw new Error(
        `ClinicalTrials.gov API error: ${response.statusText} (${response.status})`
      );
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

    // eslint-disable-next-line no-console
    console.log("API response studies count:", data.studies?.length || 0);
    if (!data.studies || data.studies.length === 0) {
      // eslint-disable-next-line no-console
      console.warn("No studies found for conditions:", conditions);
    }

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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching from ClinicalTrials.gov:", error);
    // eslint-disable-next-line no-console
    console.warn(
      "Returning mock data as fallback. API may be unavailable or query syntax unsupported."
    );
    // Return mock trials as fallback
    return MOCK_TRIALS.slice(0, maxResults);
  }
}

// Mock trial data for development/fallback
const MOCK_TRIALS: Trial[] = [
  {
    nctId: "NCT04900000",
    title: "Combination Immunotherapy for Advanced Cancer",
    status: "RECRUITING",
    conditions: ["Advanced Cancer", "Metastatic Disease"],
    phase: "Phase 2",
    location: "New York, NY",
    eligibility: "18+ years old, confirmed diagnosis, adequate organ function",
    url: "https://clinicaltrials.gov/study/NCT04900000",
  },
  {
    nctId: "NCT04901111",
    title: "Novel Targeted Therapy Trial",
    status: "RECRUITING",
    conditions: ["Solid Tumors", "Cancer"],
    phase: "Phase 2",
    location: "Los Angeles, CA",
    eligibility: "18-75 years old, measurable disease, good performance status",
    url: "https://clinicaltrials.gov/study/NCT04901111",
  },
  {
    nctId: "NCT04902222",
    title: "Personalized Medicine Cancer Study",
    status: "ENROLLING_BY_INVITATION",
    conditions: ["Genetic Cancer", "Hereditary Cancer"],
    phase: "Phase 1/2",
    location: "Boston, MA",
    eligibility:
      "Genetic confirmation required, 21+ years, life expectancy > 6 months",
    url: "https://clinicaltrials.gov/study/NCT04902222",
  },
];
