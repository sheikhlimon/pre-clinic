# Architecture

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + shadcn/ui
- **AI**: Claude 3.5 Sonnet via OpenRouter
- **Validation**: Zod
- **Styling**: Tailwind CSS + Bio-Luxe tokens (Forest Green #1A2F23, Sand #F5F2ED)

## Data Flow

```
User input → Chat API → Claude (OpenRouter)
                      ↓
                 Symptom extraction (age, symptoms, conditions)
                      ↓
                 ClinicalTrials.gov API (EXPANSION[Concept] search)
                      ↓
                 Trial ranking algorithm
                      ↓
                 Ranked results to frontend
```

## ClinicalTrials.gov V2 API

Base URL: `https://clinicaltrials.gov/api/v2/studies`

### Key Operator
**EXPANSION[Concept]** - Enables synonym/related-term matching for conditions

Example query:
```
?query.term=lung+cancer&query.expansion=concept
```

## Zod Schemas

### Extraction (from Claude)
```typescript
{
  age?: number
  symptoms: string[]
  conditions: string[]
  duration?: string
  probability: number
  readyToSearch: boolean
}
```

### Trial (from API)
```typescript
{
  nctId: string           // ClinicalTrials.gov identifier
  title: string           // Brief title
  status: string          // Recruiting, Active, etc.
  conditions: string[]    // Medical conditions studied
  eligibility: string     // Inclusion/exclusion criteria
  location?: string       // Study location
  phase?: string          // Phase 1, 2, 3, etc.
  url: string            // Full study page
}
```

### RankedTrial (output)
```typescript
{
  trial: Trial
  relevanceScore: number  // 0-100
  matchReasons: string[]
}
```
