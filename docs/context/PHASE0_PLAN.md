# Phase 0: Landing Page + Chat Interface (Superdesign Style)

## Context
Current landing page (Hero + Features + CTA) needs redesign into a conversational MVP. Goal: Clean, modern, Superdesign.dev aesthetic with chat as main CTA. Patient describes symptoms naturally → AI asks clarifying questions.

## Goals
- ✅ Modern, clean landing page (Superdesign style)
- ✅ Beautiful hero section with gradient
- ✅ Centered chat interface (main interaction)
- ✅ Show extraction panel (transparency)
- ✅ Show trial results with visual scoring
- ✅ Mobile-first responsive
- ✅ Bio-Luxe colors (Forest Green #1A2F23 + Sand #F5F2ED)
- ✅ Set up for Phase 1 (AI backend)

## MVP Interface Layout

```
┌────────────────────────────────────────┐
│  HEADER (minimal)                      │
│  Logo (left)                           │
├────────────────────────────────────────┤
│                                        │
│  HERO (spacious, gradient bg)          │
│  Find Your Perfect Clinical Trial      │
│  Subtitle: AI-powered symptom match    │
│                                        │
│  CHAT INTERFACE (scrollable)           │
│  ┌──────────────────────────────────┐ │
│  │ AI: Hi! Tell me your symptoms... │ │
│  │                                  │ │
│  │ User: Fatigue, lost weight...    │ │
│  │                                  │ │
│  │ AI: How old are you? Any medical │ │
│  │ history?                         │ │
│  │                                  │ │
│  │ [EXTRACTION PANEL]               │ │
│  │ I understood:                    │ │
│  │ ✓ Age: 62                        │ │
│  │ ✓ Symptoms: Fatigue, weight loss │ │
│  │ ✓ Conditions: Lung cancer (85%)  │ │
│  │ [searching...]                   │ │
│  │                                  │ │
│  │ [TRIAL RESULTS]                  │ │
│  │ Trial 1: 95/100 - Why: ...       │ │
│  │ Trial 2: 78/100 - Why: ...       │ │
│  │ ...                              │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [Input: Type your symptoms...]  [→] │
│                                        │
│  FOOTER (minimal disclaimer)           │
└────────────────────────────────────────┘
```

## Implementation Steps

### Step 0.1: Audit Current Landing Page
1. Review page.tsx (Hero + Features + Buttons)
2. Plan what to remove: Features section, CTA buttons
3. Keep: Hero text, gradient background concept
4. Add: Chat container, extraction panel, results area

### Step 0.2: Create Chat Interface Container
**File**: `apps/web/src/components/chat/chat-interface.tsx`

**Features**:
- Scrollable message area (Patient + AI messages)
- Extraction panel (shows AI understanding)
- Trial results area (shows ranked trials)
- Input box at bottom (patient types symptoms)
- Smooth animations (fade-in messages)

```typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Extraction {
  age?: number;
  symptoms: string[];
  conditions: Array<{ name: string; probability: number }>;
  status: 'gathering' | 'extracting' | 'searching' | 'complete';
}

interface TrialResult {
  title: string;
  nctId: string;
  score: number;
  reasons: string[];
}
```

### Step 0.3: Create Extraction Panel
**File**: `apps/web/src/components/chat/extraction-panel.tsx`

**Shows**:
```
I understood:
✓ Age: 62
✓ Key symptoms: Fatigue, SOB, weight loss
✓ Duration: 2 months
✓ Possible conditions:
  - Lung cancer (85% similar patients)
  - Lymphoma (72% similar patients)
✓ Status: Searching ClinicalTrials.gov...
```

**Props**:
```typescript
interface ExtractionPanelProps {
  age?: number;
  symptoms: string[];
  conditions: Array<{ name: string; probability: number }>;
  status: 'gathering' | 'extracting' | 'searching' | 'complete';
}
```

### Step 0.4: Create Trial Result Card
**File**: `apps/web/src/components/chat/trial-card.tsx`

**Shows**:
```
Trial: KEYNOTE-407 Lung Cancer
Match: 95/100 [████████░]

Why this trial:
✓ Accepts undiagnosed patients
✓ Your age range (60+)
✓ Enrolling patients with your symptom profile
✓ Currently recruiting

[View on ClinicalTrials.gov →]
```

**Props**:
```typescript
interface TrialCardProps {
  title: string;
  nctId: string;
  score: number;
  reasons: string[];
  onViewClick?: () => void;
}
```

### Step 0.5: Create Chat Message
**File**: `apps/web/src/components/chat/chat-message.tsx`

**Shows**:
- User message (aligned right, light background)
- Assistant message (aligned left, darker background)
- Markdown support for AI responses
- Smooth animations

### Step 0.6: Create Chat Input
**File**: `apps/web/src/components/chat/chat-input.tsx`

**Features**:
- Text area (auto-resize)
- Send button
- Placeholder: "Tell me about your symptoms..."
- Loading state (disabled during processing)

### Step 0.7: Update Page Layout
**File**: `apps/web/src/app/page.tsx`

**New structure**:
```typescript
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1A2F23] to-[#F5F2ED]">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Chat Interface */}
      <ChatInterface />
      
      {/* Minimal Footer */}
      <Footer disclaimer="Always consult with healthcare provider" />
    </main>
  );
}
```

### Step 0.8: Design System
**Colors**:
- Primary: Forest Green `#1A2F23`
- Accent: Sand `#F5F2ED`
- User message bg: `#1A2F23` with white text
- AI message bg: `#F5F2ED` with dark text
- Extraction panel: Subtle border, monospace font
- Trial card: Gradient score bar

**Typography**:
- Hero H1: 48px bold
- Message text: 16px
- Extraction: 14px monospace

### Step 0.9: Mobile Optimization
- Chat interface: Full width on mobile
- Input: Touch-friendly (48px min height)
- Messages: Stack vertically
- Trial cards: Single column on mobile
- Hero: Responsive font sizes

### Step 0.10: Dark Mode Support
- Gradient works in both light + dark
- Text contrast sufficient
- Input field visible in both modes

## Files to Create
1. **NEW**: `apps/web/src/components/chat/chat-interface.tsx`
2. **NEW**: `apps/web/src/components/chat/chat-message.tsx`
3. **NEW**: `apps/web/src/components/chat/extraction-panel.tsx`
4. **NEW**: `apps/web/src/components/chat/trial-card.tsx`
5. **NEW**: `apps/web/src/components/chat/chat-input.tsx`
6. **NEW**: `apps/web/src/components/landing/hero.tsx`

## Files to Modify
1. `apps/web/src/app/page.tsx` - Replace with new layout
2. `apps/web/src/components/header.tsx` - Simplify (logo only)
3. `apps/web/src/index.css` - Add gradient + spacing utilities

## Verification Checklist
- [ ] Landing page loads without errors
- [ ] Hero section centered, spacious
- [ ] Chat interface visible and scrollable
- [ ] Extraction panel shows when AI responds (placeholder)
- [ ] Trial cards render correctly (placeholder data)
- [ ] Mobile responsive (test on 375px width)
- [ ] Dark mode works
- [ ] Input box focused, ready for typing
- [ ] No auth, no sidebar, no nav
- [ ] Can move to Phase 1 (AI backend integration)

## Commits (One per step)
1. `[feat] redesign landing page - superdesign style (hero section)`
2. `[feat] add chat interface components (messages, input, extraction panel)`
3. `[feat] add trial card component with visual scoring`
4. `[chore] add mobile responsive + dark mode support`

## Notes
- **Phase 0 = UI only**: No AI backend yet (Phase 1)
- **Placeholder data**: Chat will have hardcoded AI responses for demo
- **Next phase**: Connect to Claude API + ClinicalTrials.gov API
- **Design inspiration**: Superdesign.dev (clean, spacious, modern)

## Related Context
- MVP Flow: Conversational + Educational (see active_context.md)
- Phase 1: AI extraction + API integration (PHASE1_PLAN.md)
- AGENTS.md: Incremental commits + context tracking
