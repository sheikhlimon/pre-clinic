# Phase 1: AI Backend + Extraction + API Integration

## Context
Phase 0 created the beautiful UI with placeholder data. Phase 1 connects it to real AI:
- Claude 3.5 Sonnet (via OpenRouter) for conversational extraction
- ClinicalTrials.gov API V2 for trial search
- Trial ranking algorithm based on symptom similarity
- **No database**: localStorage for chat history (hackathon scope)

## Goals
- ✅ Claude API integration for conversational questions + extraction
- ✅ ClinicalTrials.gov API V2 integration (search + parse)
- ✅ Symptom → Condition probability extraction (educational)
- ✅ Trial ranking by condition match + patient eligibility
- ✅ Show AI reasoning transparently (extraction + why each trial matches)
- ✅ Real conversation flow (not demo responses)

## Implementation Steps

### Step 1.1: Set Up Environment Variables
**File**: `.env.local`

```bash
# Claude API (OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-...

# Optional: ClinicalTrials.gov (no API key needed, public)
NEXT_PUBLIC_CLINICAL_TRIALS_API=https://clinicaltrials.gov/api/v2/studies
```

### Step 1.2: Create Zod Schemas
**File**: `apps/web/src/lib/schemas.ts`

```typescript
import { z } from "zod";

// AI extraction output
export const ExtractionSchema = z.object({
  age: z.number().optional(),
  symptoms: z.array(z.string()),
  duration: z.string().optional(),
  medicalHistory: z.array(z.string()).optional(),
  conditions: z.array(z.object({
    name: z.string(),
    probability: z.number(), // 0-100
    reason: z.string().optional(),
  })),
  readyToSearch: z.boolean(),
});

// Trial result from API
export const TrialSchema = z.object({
  nctId: z.string(),
  title: z.string(),
  status: z.enum(["RECRUITING", "ENROLLING_BY_INVITATION", "ACTIVE_NOT_RECRUITING", "COMPLETED", "TERMINATED"]),
  conditions: z.array(z.string()),
  phase: z.string().optional(),
  location: z.string().optional(),
  eligibility: z.string().optional(),
  url: z.string(),
});

// Ranked trial with match score
export const RankedTrialSchema = TrialSchema.extend({
  relevanceScore: z.number(), // 0-100
  matchReasons: z.array(z.string()),
});

export type Extraction = z.infer<typeof ExtractionSchema>;
export type Trial = z.infer<typeof TrialSchema>;
export type RankedTrial = z.infer<typeof RankedTrialSchema>;
```

### Step 1.3: Create System Prompt (for Claude)
**File**: `apps/web/src/lib/prompts.ts`

```typescript
export const SYSTEM_PROMPT = `You are a compassionate medical assistant helping patients discover clinical trials.

Your role:
1. Ask ONE clarifying question at a time
2. Gather: age, symptoms, duration, medical history
3. Extract possible conditions and their probability (0-100)
4. When you have enough info (symptoms + age + duration):
   - Show extraction in JSON
   - Explain what conditions match their symptoms
   - Set readyToSearch: true

Always be empathetic. Never diagnose. Always recommend consulting a healthcare provider.

When showing extraction, format as:
\`\`\`json
{
  "age": 62,
  "symptoms": ["fatigue", "shortness of breath", "weight loss"],
  "duration": "2 months",
  "medicalHistory": [],
  "conditions": [
    { "name": "Lung cancer", "probability": 85, "reason": "Age + SOB + fatigue combination" },
    { "name": "Lymphoma", "probability": 72, "reason": "Weight loss + fatigue pattern" }
  ],
  "readyToSearch": true
}
\`\`\``;
```

**Note**: Claude extraction happens server-side in /api/chat (via Vercel AI SDK)
```

### Step 1.4: Create ClinicalTrials.gov Client
**File**: `apps/web/src/lib/clinical-trials-client.ts`

```typescript
import type { Trial } from "./schemas";

const BASE_URL = "https://clinicaltrials.gov/api/v2/studies";

export async function searchTrials(params: {
  conditions: string[];
  age?: number;
  location?: string;
  maxResults?: number;
}): Promise<Trial[]> {
  const { conditions, age, location, maxResults = 30 } = params;

  // Build query: use EXPANSION[Concept] for synonym matching
  const queryTerms = conditions.map(c => `"${c}"`).join(" OR ");
  const query = `(${queryTerms}) AND (RECR OR ENROLL)`;

  const searchParams = new URLSearchParams({
    "query.term": query,
    "query.expansion": "concept",
    pageSize: maxResults.toString(),
    fields: "NCTId,BriefTitle,OverallStatus,Condition,Phase,Location,EligibilityCriteria,URL",
  });

  if (location) {
    searchParams.append("query.locn", location);
  }

  const url = `${BASE_URL}?${searchParams}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ClinicalTrials.gov API error: ${response.statusText}`);
  }

  const data = await response.json();

  // Transform to Trial[]
  return (data.studies || []).slice(0, maxResults).map((study: any) => {
    const proto = study.protocolSection;
    return {
      nctId: proto.identificationModule.nctId,
      title: proto.identificationModule.briefTitle,
      status: proto.statusModule.overallStatus,
      conditions: proto.conditionsModule?.conditions || [],
      phase: proto.designModule?.phases?.[0],
      location: proto.contactsLocationsModule?.locations?.[0]?.city || "Multiple locations",
      eligibility: proto.eligibilityModule?.eligibilityCriteria || "",
      url: `https://clinicaltrials.gov/study/${proto.identificationModule.nctId}`,
    };
  });
}
```

### Step 1.5: Create Trial Ranking Algorithm
**File**: `apps/web/src/lib/trial-ranking.ts`

```typescript
import type { Extraction, Trial, RankedTrial } from "./schemas";

export function rankTrials(
  trials: Trial[],
  extraction: Extraction
): RankedTrial[] {
  return trials
    .map(trial => {
      let score = 50; // Base score
      const reasons: string[] = [];

      // Condition matching (highest weight)
      const matchingConditions = extraction.conditions.filter(cond =>
        trial.conditions.some(trialCond =>
          trialCond.toLowerCase().includes(cond.name.toLowerCase()) ||
          cond.name.toLowerCase().includes(trialCond.toLowerCase())
        )
      );

      if (matchingConditions.length > 0) {
        const avgProbability = matchingConditions.reduce((sum, c) => sum + c.probability, 0) / matchingConditions.length;
        score += (avgProbability / 100) * 40; // Up to 40 points
        reasons.push(`Matches condition: ${matchingConditions[0].name}`);
      }

      // Recruiting status
      if (trial.status === "RECRUITING" || trial.status === "ENROLLING_BY_INVITATION") {
        score += 10;
        reasons.push("Currently recruiting");
      }

      // Phase preference (Phase 1-2 for early exploration)
      if (trial.phase && (trial.phase.includes("1") || trial.phase.includes("2"))) {
        score += 5;
        reasons.push(`${trial.phase} trial`);
      }

      // Age appropriateness (if extracting eligibility)
      if (extraction.age && trial.eligibility) {
        const ageInEligibility = trial.eligibility.toLowerCase().includes(extraction.age.toString());
        if (ageInEligibility) {
          score += 5;
          reasons.push(`Matches your age range`);
        }
      }

      return {
        ...trial,
        relevanceScore: Math.min(Math.round(score), 100),
        matchReasons: reasons.length > 0 ? reasons : ["Matched search criteria"],
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5); // Return top 5
}
```

### Step 1.6: Create Chat API Route (with Vercel AI SDK)
**File**: `apps/web/src/app/api/chat/route.ts`

```typescript
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openrouter";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { searchTrials } from "@/lib/clinical-trials-client";
import { rankTrials } from "@/lib/trial-ranking";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  // Use Vercel AI SDK with OpenRouter + Claude
  const result = streamText({
    model: openai("claude-3-5-sonnet-20241022", {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    }),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 1000,
    temperature: 0.7,
  });

  // When streaming complete, check if ready to search
  result.then(async (stream) => {
    const fullText = await stream.text;
    
    // Check if extraction JSON in response
    const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const extraction = JSON.parse(jsonMatch[1]);
        if (extraction.readyToSearch && extraction.conditions?.length > 0) {
          const conditionNames = extraction.conditions.map((c: any) => c.name);
          const searchResults = await searchTrials({
            conditions: conditionNames,
            age: extraction.age,
          });
          const trials = rankTrials(searchResults, extraction);
          // Append trials to stream (handled by frontend)
        }
      } catch (e) {
        // Parsing error, continue
      }
    }
  }).catch(console.error);

  return result.toTextStreamResponse();
}
```

**How it works**:
- Frontend sends messages via useChat()
- API route streams Claude response via Vercel AI SDK
- When extraction JSON detected, server searches trials
- Frontend displays streamed text + extraction + trials

### Step 1.7: Update ChatInterface Component
**File**: `apps/web/src/components/chat/chat-interface.tsx`

Connect to the API:
- Send messages to `/api/chat`
- Update state with extraction
- Show extraction panel when ready
- Display trials when found

### Step 1.8: Test with Real API
- Test with example symptoms
- Verify extraction shows correctly
- Verify trials return with scores
- Check mobile responsiveness

## Files to Create
1. **NEW**: `apps/web/src/lib/schemas.ts` - Zod schemas
2. **NEW**: `apps/web/src/lib/prompts.ts` - System prompt
3. **NEW**: `apps/web/src/lib/clinical-trials-client.ts` - API client
4. **NEW**: `apps/web/src/lib/trial-ranking.ts` - Ranking algorithm
5. **NEW**: `apps/web/src/app/api/chat/route.ts` - Chat endpoint

## Files to Modify
1. `apps/web/src/components/chat/chat-interface.tsx` - Connect to API (useChat hook)
2. `.env.local` - Add OPENROUTER_API_KEY

## Dependencies Already Available
- `ai` package (Vercel AI SDK) - should already be installed
- `zod` - likely already installed
- `@ai-sdk/openrouter` - NEW (need to install)

## Dependencies to Install
```bash
npm install @ai-sdk/openrouter
npm install zod  # if not already installed
```

## Verification Checklist
- [ ] Environment variables set (OPENROUTER_API_KEY)
- [ ] Claude API responds correctly
- [ ] Extraction schema validates properly
- [ ] ClinicalTrials.gov API returns trials
- [ ] Ranking algorithm produces consistent scores
- [ ] Extraction panel displays with real data
- [ ] Trial cards show with match reasons
- [ ] Chat conversation flows naturally
- [ ] Mobile responsive with real data

## Example Flow
1. User: "I'm exhausted and losing weight"
2. AI: "How old are you?"
3. User: "I'm 62"
4. AI: "Any medical history?"
5. User: "No, just started last month"
6. AI: [Shows extraction] + "Searching oncology trials..."
7. Returns: 5 trials ranked by match score with reasons

## Commits (One per step)
1. `[feat] add claude client + extraction logic`
2. `[feat] add clinical trials api client + ranking`
3. `[feat] create chat api endpoint`
4. `[feat] connect chat interface to api`
5. `[test] verify extraction + trials with real data`

## Notes
- **No database**: localStorage handles chat history (frontend)
- **Streaming**: Vercel AI SDK handles streaming automatically
- **API calls**: Server-side only (ClinicalTrials.gov + extraction)
- **Error handling**: Show user-friendly messages
- **localStorage flow**:
  - useChat hook manages messages state
  - Messages auto-saved to localStorage on each update
  - Chat persists across page refreshes
  - No backend persistence needed

## Related Context
- Phase 0: UI components (PHASE0_PLAN.md)
- MVP Flow: Conversational extraction + ranking
- AGENTS.md: Commit frequency + code review
