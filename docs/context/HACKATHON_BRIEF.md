# Hackathon Brief: Clinical Trial Patient Matcher

## Problem Statement
Patients with serious conditions don't know clinical trials exist for them. Even when they do, eligibility criteria are complex. 80% of clinical trials fail to meet enrollment timelines.

## Our Solution
**Conversational AI assistant that helps patients discover relevant oncology trials through natural conversation.**

Patient describes symptoms (not diagnosis) → AI asks clarifying questions → AI shows extraction (transparency) → Search trials → Show ranked results with match reasons.

---

## User & Scope

### Primary User
**Oncology patients** without a diagnosis (or uncertain diagnosis)
- Don't know their specific condition
- Don't know trials exist
- Intimidated by medical terminology
- Want to understand what symptoms suggest

### Why Oncology?
- Largest trial pool (10,000+ active trials)
- Best public data (ClinicalTrials.gov)
- Urgent need (cancer patients motivated to find trials)
- Largest problem research opportunity

### What We're Solving
Patient: "I'm exhausted, losing weight, have shortness of breath"
→ **Traditional**: Patient Googles symptoms, finds WebMD, gets scared, doesn't know about trials
→ **Our solution**: AI helps extract what this might be, shows oncology trials matching this profile

---

## MVP Flow (24 Hours)

### User Experience
```
Landing Page:
1. Patient reads: "Find Your Perfect Clinical Trial"
2. Clicks chat box, types: "I'm tired and losing weight"
3. AI responds: "How long has this been happening?"
4. Patient: "2 months"
5. AI: "Your age?"
6. Patient: "62"
7. AI shows extraction (transparent thinking):
   - Age: 62
   - Symptoms: Fatigue, weight loss
   - Duration: 2 months
   - Condition probability: Lung cancer (85%), Lymphoma (72%)
   - Searching ClinicalTrials.gov...
8. Results display:
   - Trial 1: Match 95/100 - "Accepts undiagnosed patients + your age + symptom profile"
   - Trial 2: Match 78/100 - "Matches weight loss pattern"
   - etc.
9. Patient clicks trial, goes to ClinicalTrials.gov
```

### Why This WOW
- **Transparency**: Patient sees AI thinking (not black box)
- **Education**: Patient learns what symptoms suggest
- **Empowerment**: Patient discovers trials they didn't know existed
- **Relevance**: Top results actually match their profile (not keyword search)

---

## Technical Architecture

### Frontend (Phase 0)
- Next.js 16 + React 19
- Chat interface (scrollable messages)
- Extraction panel (shows AI understanding)
- Trial cards (visual scoring + match reasons)
- **Design**: Superdesign.dev style (clean, modern, spacious)
- **Colors**: Bio-Luxe Forest Green (#1A2F23) + Sand (#F5F2ED)

### Backend (Phase 1)
- Claude 3.5 Sonnet API (via OpenRouter) for conversational extraction
- ClinicalTrials.gov V2 API (free, no auth) for trial search
- Trial ranking algorithm (condition match + eligibility + recruiting status)
- **No database** (in-memory chat, no user accounts needed)

### Data Sources
- **Clinical Trials**: ClinicalTrials.gov API V2 (public, free)
- **AI Extraction**: Claude 3.5 Sonnet (symptom → condition probability)
- **No real patient data**: User input only

---

## Success Metrics (Hackathon Evaluation)

### Problem Research (25%)
- ✅ Identified real problem: 80% of trials fail to meet enrollment
- ✅ Focused on patients (not doctors/recruiters)
- ✅ Focused on oncology (largest trial pool)
- ✅ Identified undiagnosed patients as key target

### Novelty (25%)
- ✅ Not just search (educational + conversational)
- ✅ Shows AI extraction (transparency differentiator)
- ✅ Ranks by condition probability + eligibility (smart matching)
- ✅ Teaches patients what symptoms suggest

### UX & Empathy (20%)
- ✅ Beautiful, modern design (Superdesign style)
- ✅ Mobile-first (patients use phones)
- ✅ Conversational (feels like talking to someone)
- ✅ Transparent (patient understands AI reasoning)
- ✅ Educational (patient learns, not just gets results)

### Technical Execution (15%)
- ✅ Works end-to-end (chat → extraction → API → results)
- ✅ Real API integration (Claude + ClinicalTrials.gov)
- ✅ Meaningful AI use (not just chat wrapper)

### Communication (15%)
- ✅ Clear problem statement (patients don't know trials exist)
- ✅ Justified design decisions (why patients, why oncology, why transparent)
- ✅ Shows thinking process (decision log in docs)

---

## Implementation Timeline (24 Hours)

| Phase | Time | Deliverable |
|-------|------|-------------|
| **Phase 0** | 6-8h | Beautiful chat UI (Superdesign style) with placeholder data |
| **Phase 1** | 6-8h | Real AI + API integration (Claude + ClinicalTrials.gov) |
| **Polish** | 2-4h | Testing, mobile tweaks, edge cases |
| **Total** | 24h | Working MVP |

---

## File Structure

```
apps/web/src/
├── app/
│   ├── page.tsx                    (landing page + chat)
│   ├── api/
│   │   └── chat/
│   │       └── route.ts            (Claude + search endpoint)
│   └── layout.tsx
├── components/
│   ├── chat/
│   │   ├── chat-interface.tsx      (main chat container)
│   │   ├── chat-message.tsx        (individual message)
│   │   ├── extraction-panel.tsx    (shows AI understanding)
│   │   ├── trial-card.tsx          (trial display with score)
│   │   └── chat-input.tsx          (input box)
│   ├── landing/
│   │   └── hero.tsx                (hero section)
│   ├── header.tsx                  (minimal logo)
│   └── footer.tsx                  (disclaimer)
├── lib/
│   ├── schemas.ts                  (Zod schemas)
│   ├── claude-client.ts            (Claude API integration)
│   ├── clinical-trials-client.ts   (ClinicalTrials.gov)
│   └── trial-ranking.ts            (ranking algorithm)
└── index.css                       (styles + gradients)
```

---

## Key Design Decisions

| Decision | Why |
|----------|-----|
| **Patients over doctors** | Larger problem, no existing tool, higher impact |
| **Oncology only** | Largest trial pool + best data + urgent need |
| **Chat interface** | Natural, empowering, feels like consulting assistant |
| **Show extraction** | Transparency builds trust, educates patient |
| **No auth** | Simplifies scope, patients don't need accounts |
| **Top 5 results** | Prevents overwhelm, AI ranking quality matters |
| **Superdesign style** | Clean, modern, professional (healthcare brand) |

---

## WOW Factors

1. **Transparency**: Patient sees exactly what AI extracted
2. **Education**: Patient learns what symptoms mean (lung cancer pattern vs lymphoma pattern)
3. **Empowerment**: Discovers trials they didn't know existed
4. **Beauty**: Modern, spacious design (not healthcare boring)
5. **Relevance**: Ranked results actually match their profile

---

## Known Limitations (Intentional)
- No persistent chat history (in-memory only)
- No user accounts (no database)
- No sidebar/previous chats
- Oncology only (could expand later)
- No real patient data (user input only)
- No eligibility verification (just matching heuristics)

**Rationale**: MVP focus. Add these in post-hackathon if users want it.

---

## Next Steps (Post-Hackathon)
1. User feedback (does extraction feel accurate?)
2. Add persistent chat history (database + auth)
3. Expand to other specialties (cardiology, rare diseases)
4. Add real eligibility checking (HL7 integration)
5. Doctor collaboration features (share results)
6. Trial coordinator integration (recruitment funnel)

---

## Questions to Ask Judges

1. "Does showing AI extraction (transparency) feel valuable?"
2. "Would you use this if you had a symptom?"
3. "What's missing from the experience?"
4. "Would this change how you think about trial recruitment?"

---

## Links

- **ClinicalTrials.gov API**: https://clinicaltrials.gov/api
- **Claude API**: https://api.anthropic.com
- **Superdesign.dev**: https://app.superdesign.dev (design inspiration)
- **Hackathon Brief**: Above

---

**Status**: 🔴 Ready to build (Phase 0 planning complete)  
**Next**: Start Phase 0 implementation when ready
