# Architecture

## ClinicalTrials.gov V2 API

Base URL: `https://clinicaltrials.gov/api/v2/studies`

### Key Operator
**EXPANSION[Concept]** - Enables synonym/related-term matching for conditions

Example query:
```
?query.term=depression&query.expansion=concept
```

## Zod Schemas

### SymptomExtraction
```typescript
{
  keywords: string[]      // Extracted symptoms/conditions
  duration?: string        // e.g., "2 weeks", "6 months"
  severity?: 'mild' | 'moderate' | 'severe'
}
```

### TrialResult
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

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + shadcn/ui
- **AI**: Google Gemini (current) → OpenRouter + Claude (future)
- **Validation**: Zod
- **Styling**: Tailwind CSS + Bio-Luxe tokens
