# Pre-Clinic MVP - Quick Start Guide

## What is this?
Clinical trial patient matcher that helps patients discover oncology trials through conversational AI. Patients describe symptoms → AI asks clarifying questions → shows what conditions match → searches ClinicalTrials.gov → ranks by relevance.

## Setup (2 minutes)

### 1. Get OpenRouter API Key
```bash
# Visit: https://openrouter.ai/keys
# Copy your API key
```

### 2. Create .env.local
```bash
cp .env.local.example .env.local
# Edit .env.local and paste your OpenRouter API key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

Visit **http://localhost:3001** (web app runs on port 3001)

## How It Works

1. **Hero Section** - Landing page with call-to-action
2. **Chat Interface** - Type symptoms naturally
3. **AI Extraction** - Claude shows what it understood (age, symptoms, conditions)
4. **Trial Search** - Automatically searches ClinicalTrials.gov
5. **Results** - Top 5 trials ranked by relevance with match scores

## Architecture

### Frontend (React 19 + Next.js 16)
- `components/chat/` - Chat UI components
- `components/landing/` - Hero section
- `lib/use-chat.ts` - Custom chat hook with streaming

### Backend (Node.js)
- `app/api/chat/route.ts` - Claude integration via OpenRouter
- `lib/schemas.ts` - Data validation (Zod)
- `lib/prompts.ts` - System prompt for Claude
- `lib/clinical-trials-client.ts` - ClinicalTrials.gov API
- `lib/trial-ranking.ts` - Relevance ranking algorithm

### Storage
- **localStorage** - Chat history persists in browser only (no database)

## Key Files

```
apps/web/src/
├── app/
│   ├── page.tsx              (Hero + Chat container)
│   └── api/chat/route.ts     (Claude + trial search endpoint)
├── components/
│   ├── chat/
│   │   ├── chat-interface.tsx    (Main chat + state)
│   │   ├── chat-message.tsx      (Message display)
│   │   ├── extraction-panel.tsx  (Shows AI understanding)
│   │   └── trial-card.tsx        (Trial result card)
│   ├── landing/
│   │   └── hero.tsx          (Hero section)
│   └── header.tsx            (Logo + dark mode toggle)
└── lib/
    ├── use-chat.ts           (Custom chat hook)
    ├── schemas.ts            (Types + Zod validation)
    ├── prompts.ts            (Claude system prompt)
    ├── clinical-trials-client.ts  (API client)
    └── trial-ranking.ts      (Ranking algorithm)
```

## Testing Checklist

- [ ] Can type in chat
- [ ] Claude responds naturally
- [ ] Extraction panel appears when Claude provides extraction JSON
- [ ] Trial cards render with scores
- [ ] Mobile responsive (try 375px width)
- [ ] Dark mode toggle works
- [ ] Chat history persists on refresh

## Example Flow

```
User: "I've been exhausted and losing weight for 2 months"
→ Claude: "How old are you?"
→ User: "62"
→ Claude: "Any medical conditions?"
→ User: "None, just started recently"
→ Claude: [Shows extraction JSON]
           "Searching for matching trials..."
→ API: Searches ClinicalTrials.gov for lung cancer, lymphoma, etc.
→ Display: 5 trials ranked by relevance
           "Trial: KEYNOTE-407"
           "Match: 95/100"
           "Why: Accepts undiagnosed patients, your age, your symptoms"
```

## Code Standards

- **Formatting**: `npm exec -- ultracite fix` (auto-fixes with Biome)
- **Commit Style**: `[type] description` (feat, fix, chore, docs, refactor)
- **One commit per logical change** (no squashing multiple features)

## Troubleshooting

### "OpenRouter API key not configured"
→ Create `.env.local` with `OPENROUTER_API_KEY=sk-or-v1-...`

### Chat not responding
→ Check that `.env.local` has correct API key (no spaces/typos)

### Build fails
→ Run `npm install` then `npm run build`

## Design System

- **Primary**: Forest Green `#1A2F23`
- **Accent**: Sand `#F5F2ED`
- **Typography**: Modern, readable, accessible
- **Layout**: Mobile-first, responsive
- **Dark mode**: Fully supported

## What's NOT Included (Intentional)

- ❌ Database (only localStorage)
- ❌ User authentication
- ❌ Chat history across browsers
- ❌ Multiple specialties (oncology only for MVP)
- ❌ Real eligibility verification

These can be added post-hackathon if needed.

## Next Steps (Post-Hackathon)

1. Add error handling/recovery UI
2. Add loading skeletons
3. Implement browser caching for trials
4. Add follow-up question support
5. Add persistent backend database
6. Expand to other medical specialties

## Success Metrics

✅ End-to-end MVP working (chat → extraction → trials)
✅ Beautiful, modern UI (Superdesign.dev style)
✅ Conversational & educational (patient learns, not just searches)
✅ Transparent (extraction panel shows AI reasoning)
✅ Mobile-first & dark mode support
✅ Built in 24 hours with clear planning

---

**Status**: Production Ready for Hackathon Submission
**Last Updated**: 2026-02-08
**Environment**: Next.js 16, React 19, Tailwind CSS 4
