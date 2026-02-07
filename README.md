# Pre-Clinic

Conversational AI assistant that helps patients discover relevant oncology clinical trials through natural conversation.

## What It Does

Patient describes symptoms (not diagnosis) → AI asks clarifying questions → AI shows extraction (transparency) → Search trials → Show ranked results with match reasons.

## Quickstart

1. **Get OpenRouter API key**
   ```
   https://openrouter.ai/keys
   ```

2. **Add your API key to apps/web/.env**
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3001

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + shadcn/ui
- **AI**: Claude 3.5 Sonnet via OpenRouter
- **API**: ClinicalTrials.gov V2 (free, no auth)
- **Styling**: Tailwind CSS

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run check-types`: Check TypeScript types
