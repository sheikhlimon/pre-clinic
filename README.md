# PreClinic

> **Built for healthcare hackathon** - AI-powered oncology clinical trial matching platform that helps cancer patients find relevant research opportunities through natural conversation.

(https://github.com/user-attachments/assets/a872592c-c002-4254-aafa-ba57fb4be7c5)

## What It Does

PreClinic uses natural language processing to understand patient symptoms and medical history, then matches them with appropriate cancer clinical trials from ClinicalTrials.gov.

**Flow:** Patient describes symptoms → AI asks clarifying questions → AI shows extraction panel → Search trials → Display ranked results with match reasons

## Key Features

- **Chat-Based Interface**: Natural conversation for describing symptoms and diagnosis
- **AI Symptom Extraction**: Automatically extracts age, symptoms, conditions, and location from chat
- **Smart Trial Matching**: Ranks trials by relevance using symptom matching, recruiting status, and phase preferences
- **Real-Time Results**: Returns ranked trial cards with relevance scores and match explanations
- **Transparency**: Extraction panel shows what the AI understood about your medical profile
- **Quick Start Prompts**: Two-click access for symptoms-based or diagnosis-based search

## Quick Start

1. **Get OpenRouter API key**
   ```
   https://openrouter.ai/keys
   ```

2. **Add your API key to `apps/web/.env`**
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3001

## How It Works

### 1. Describe Your Situation
Start chatting by describing your symptoms or diagnosis. You can use the quick-start prompts:
- "I have symptoms and want to find relevant clinical trials"
- "I have a diagnosis and looking for clinical trial options"

### 2. AI Builds Your Profile
The AI asks clarifying questions and extracts:
- Age
- Symptoms and duration
- Medical conditions with probability scores
- Location preferences

### 3. View Matched Trials
PreClinic searches ClinicalTrials.gov and returns ranked results with:
- Trial title and NCT ID
- Relevance score (0-100)
- Match reasons explaining why it's a good fit
- Recruitment status and phase information

### 4. Explore Options
Click on trial cards to view full details on ClinicalTrials.gov, including eligibility criteria, locations, and contact information.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **UI Library**: shadcn/ui + Tailwind CSS
- **AI Model**: Claude 3.5 Sonnet via OpenRouter API
- **Data Source**: ClinicalTrials.gov V2 API (free, no authentication)
- **State Management**: React hooks + localStorage
- **Type Safety**: TypeScript

## Project Structure

```
pre-clinic/
├── apps/web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── chat/route.ts       # Streaming chat + extraction + search
│   │   │   │   └── search-trials/route.ts  # Standalone trial search
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   └── chat/
│   │   │       ├── chat-interface.tsx  # Main chat UI
│   │   │       ├── extraction-panel.tsx  # Shows extracted data
│   │   │       └── trial-card.tsx      # Trial result cards
│   │   ├── lib/
│   │   │   ├── prompts.ts             # AI system prompt
│   │   │   ├── schemas.ts             # TypeScript schemas
│   │   │   ├── use-chat.ts            # Chat hook with streaming
│   │   │   ├── clinical-trials-client.ts  # Trial search
│   │   │   └── trial-ranking.ts       # Relevance scoring
│   │   └── ...
│   └── package.json
└── package.json
```

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run check-types`: Check TypeScript types

## How the AI Matching Works

1. **Symptom Extraction**: Claude 3.5 Sonnet analyzes chat messages to extract structured medical data
2. **Condition Identification**: AI identifies possible conditions with probability scores
3. **Trial Search**: ClinicalTrials.gov API searched by condition names
4. **Relevance Ranking**: Trials scored based on:
   - Condition match strength
   - Recruiting status bonus
   - Phase preference (Phase 1-2)
   - Age appropriateness
   - Location proximity

## License

MIT License - see LICENSE file for details.

## Acknowledgments

Built for healthcare hackathon. Uses ClinicalTrials.gov API (NLM/NIH).
