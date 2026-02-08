# Phase 2: Modern UI Redesign Plan
**Timeline**: Phase 2.1 to 2.3 (Full Frontend Aesthetic Overhaul)
**Status**: Planning
**Updated**: 2026-02-08

---

## Vision Statement

Transform from "functional MVP" to "beautiful, empathic healthcare experience" inspired by Claude.ai, Linear.app, and Vercel design patterns. The interface should feel like consulting an intelligent healthcare assistant—calm, clear, and human.

**Key Philosophy**: Form follows empathy. Every visual decision should reduce anxiety and increase understanding for patients seeking clinical trials.

---

## Current State Analysis

### What Works ✅
- End-to-end chat → extraction → trial search (functional)
- Streaming chat interface (responsive)
- localStorage persistence
- Mobile responsive base
- Proper TypeScript + React patterns

### Pain Points 🔴
- Generic Tailwind styling (no personality)
- Separate hero + header (should integrate)
- Chat box doesn't grow dynamically (static height)
- Trial cards buried in chat stream (hard to scan)
- Animations are basic (fade, no personality)
- No clear visual hierarchy between sections
- Colors borrowed from design tokens but not applied strategically
- Streaming animation lacks polish (jarring text updates)

---

## Redesign Strategy

### Layout Architecture (2-Column + Dynamic Sidebar)

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR (Integrated) - Logo + Title + Dark Mode Toggle       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  LEFT PANEL (Chat + Extraction)    │  RIGHT PANEL (Trials)  │
│  ┌──────────────────────────────┐  │  ┌────────────────────┐│
│  │ Hero Headline (Compact)      │  │  │ "Matching Trials"  ││
│  │ Chat Messages                │  │  │ ┌────────────────┐ ││
│  │ [Message]                    │  │  │ │ Trial Card 1   │ ││
│  │ [Message]                    │  │  │ │ Score: 95/100  │ ││
│  │ [Message]                    │  │  │ └────────────────┘ ││
│  │ ┌─────────────────────────┐  │  │  │ ┌────────────────┐ ││
│  │ │ Extraction Panel        │  │  │  │ │ Trial Card 2   │ ││
│  │ │ ✓ Age: 62              │  │  │  │ │ Score: 87/100  │ ││
│  │ │ ✓ Symptoms: [list]     │  │  │  │ └────────────────┘ ││
│  │ │ ✓ Conditions: [with %] │  │  │  │ ┌────────────────┐ ││
│  │ │ [Search Button]        │  │  │  │ │ Trial Card 3   │ ││
│  │ └─────────────────────────┘  │  │  │ └────────────────┘ ││
│  │ ┌─────────────────────────┐  │  │  └────────────────────┘│
│  │ │ Chat Input (Grows)      │  │  │                        │
│  │ │ [Textarea]              │  │  │                        │
│  │ │ [Send Button]           │  │  │                        │
│  │ └─────────────────────────┘  │  │                        │
│  └──────────────────────────────┘  │                        │
│                                     │                        │
└─────────────────────────────────────────────────────────────┘
```

**Viewport Behavior**:
- Empty state: Hero headline + chat input centered (no right panel)
- With messages: Left panel grows, right panel slides in from right
- Mobile: Stack vertically, full-width chat, trials below

### Color Palette (Empathic + Healthcare)

| Purpose | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Brand | Warm Terracotta | `#E07856` | Accents, CTAs, highlights |
| Secondary | Soft Sage | `#A8D5BA` | Supporting elements, extraction |
| Tertiary | Deep Indigo | `#2C3E50` | Text, backgrounds, trust |
| Accent | Coral | `#FF6B6B` | Errors, alerts, important |
| Neutral | Warm Gray | `#F8F5F1` | Backgrounds, cards |
| Dark Mode | Charcoal | `#1A1A1A` | Dark mode background |
| Calm | Light Aqua | `#E8F4F8` | Loading states, gentle actions |

**Rationale**:
- **Terracotta** = warm, human, non-clinical
- **Sage** = calming, natural, health association
- **Indigo** = trustworthy, professional, not alarmist
- Avoid pure clinical white (too stark for anxious patients)
- Warm palette (no cool grays) = empathic

### Font Hierarchy

```
Display:    Inter 700 - 3xl (32px)  - Headlines
Heading 1:  Inter 700 - 2xl (24px)  - Section titles
Heading 2:  Inter 600 - xl  (20px)  - Card titles
Body:       Inter 400 - base (16px) - Chat, body text
Small:      Inter 400 - sm  (14px)  - Labels, captions
Micro:      Inter 400 - xs  (12px)  - Timestamps, hints
```

**Typography Rules**:
- Max 65 characters per line (readability)
- 1.6 line-height for body text (accessibility)
- No text smaller than 14px (mobile readability)

---

## Phase Breakdown

### Phase 2.1: Layout Architecture + Grid System
**Time**: 2-3 hours
**Tasks**:
1. Create new layout grid system (2-column + responsive)
2. Update `page.tsx` for navbar + hero integration
3. Refactor `chat-interface.tsx` for 2-column layout
4. Add right-panel skeleton for trials
5. Implement dynamic spacing (grows/shrinks with content)

**Files to Modify**:
- `app/page.tsx` - Navbar integration, layout container
- `components/chat/chat-interface.tsx` - Left/right column split
- `components/layout/` - Create new directory for layout components
- `lib/styles/grid.ts` - Create grid utilities

**Output**:
- New layout structure without styling
- Responsive grid working on mobile/tablet/desktop
- Trial cards appear on right when `trials.length > 0`

---

### Phase 2.2: Color System + Component Styling
**Time**: 3-4 hours
**Tasks**:
1. Define CSS custom properties for color palette
2. Create Tailwind config overrides for new colors
3. Apply terracotta/sage/indigo to components
4. Style extraction panel with gradient backgrounds
5. Create trial card variants (normal, hover, focused)
6. Update chat messages (user=terracotta, assistant=white)
7. Dark mode color mappings

**Files to Modify**:
- `tailwind.config.ts` - Add color palette
- `components/chat/chat-interface.tsx` - Apply new colors
- `components/chat/chat-message.tsx` - Terracotta user messages
- `components/chat/extraction-panel.tsx` - Sage background, icons
- `components/chat/trial-card.tsx` - Indigo text, terracotta accents
- `components/header.tsx` - Navbar styling with new colors
- `globals.css` - Add CSS custom properties

**Output**:
- Consistent color system across all components
- Dark mode fully supported
- No hardcoded colors (all from design tokens)

---

### Phase 2.3: Animations + Micro-interactions
**Time**: 2-3 hours
**Tasks**:
1. Fix streaming animation (stagger text rendering, not jarring)
2. Add page transitions (hero → chat → extraction → trials)
3. Create entrance animations:
   - Messages: fade-in + slide-up
   - Extraction panel: slide-up + opacity
   - Trial cards: stagger in from right
4. Add hover states:
   - Trial cards: lift + shadow
   - Buttons: color shift + scale
   - Input focus: glow effect
5. Loading animations:
   - Pulse for searching
   - Skeleton loaders for trials
6. Scroll behavior:
   - Smooth auto-scroll to new messages
   - Parallax on hero text

**Files to Modify**:
- `globals.css` - Add keyframe animations
- `components/chat/chat-interface.tsx` - Streaming animation fix
- `components/chat/chat-message.tsx` - Entrance animation
- `components/chat/extraction-panel.tsx` - Slide-up animation
- `components/chat/trial-card.tsx` - Stagger animation
- `components/header.tsx` - Navbar entrance
- `tailwind.config.ts` - Add animation utilities

**Output**:
- Smooth, delightful animations
- No jarring updates
- Professional feel (like Claude/Linear)

---

### Phase 2.4: Polish + Details
**Time**: 1-2 hours
**Tasks**:
1. Icon selection + placement
2. Spacing refinement (padding/margin consistency)
3. Border radius consistency (8px/12px/16px scale)
4. Shadow hierarchy (1 = subtle, 3 = elevated, 5 = modal)
5. Focus states for accessibility (keyboard navigation)
6. Loading states + error messages
7. Empty state illustrations

**Files to Modify**:
- All component files - spacing/border/shadow review
- `components/chat/` - Add icons where appropriate
- New: `components/empty-state.tsx`
- New: `components/loading-skeleton.tsx`

**Output**:
- Polished, production-ready interface
- Accessible (WCAG AA compliant)
- Consistent visual language

---

## Detailed Component Specifications

### Navbar (Integrated into Hero)
```
├─ Logo + Brand Name (left)
├─ [Spacer]
└─ Dark Mode Toggle (right)

Colors:
- Background: semi-transparent (glass morphism)
- Text: Indigo (#2C3E50)
- Toggle: Terracotta accent

Spacing: px-6 py-4 (md: px-8)
Border: Bottom 1px border in sage (10% opacity)
```

### Chat Container (Left Panel)
```
├─ Messages Area
│  ├─ User message (terracotta gradient, right-aligned)
│  ├─ Assistant message (white/dark, left-aligned)
│  └─ Extraction panel (sage background, staggered in)
│
└─ Input Area
   ├─ Textarea (grows from 1 row to 4 rows max)
   ├─ Send Button (terracotta, hover: scale 1.05)
   └─ Disclaimer (micro text, muted)

Colors:
- User messages: Linear gradient terracotta
- Assistant messages: White (light) / Dark gray (dark)
- Background: Warm gray (#F8F5F1)
- Input border: Sage focus, gray default
```

### Extraction Panel
```
├─ Header "I understood:" (with stethoscope icon)
├─ Age (if present) - with baby icon
├─ Symptoms - with activity icon
├─ Conditions - with probability badges
│  └─ Each: [Condition name] [%badge in terracotta]
└─ [Search for matching trials] button (if ready)

Colors:
- Background: Linear gradient sage to warm gray
- Header: Indigo text with terracotta icon
- Icons: Terracotta
- Badges: Terracotta circular
- Status text: Muted sage

Spacing: p-4, gap-3 between sections
Border radius: rounded-2xl, inner cards rounded-lg
```

### Trial Cards (Right Panel)
```
├─ Header
│  ├─ Trial Title (indigo, left)
│  └─ Score badge (terracotta, right) [95/100]
├─ Score bar (gradient terracotta, width = score%)
├─ "Why this matches:"
│  └─ Bullet points (reasons)
└─ [View Trial] button (terracotta, arrow icon)

Colors:
- Card: White (light) / Dark charcoal (dark)
- Title: Indigo
- Badge: Terracotta gradient
- Bar: Terracotta → coral gradient
- Reasons: Muted gray
- Button: Terracotta with hover effect

Spacing: p-4, gap-3
Border radius: rounded-2xl
Shadow: Elevation 2 (hover: elevation 4)
```

### Chat Messages
```
User Message:
- Background: Linear gradient (terracotta → coral)
- Text: White
- Alignment: Right
- Max width: 85%
- Border radius: 20px
- Animation: Fade in + slide from bottom

Assistant Message:
- Background: White / Dark
- Text: Indigo
- Alignment: Left
- Max width: 85%
- Border radius: 20px
- Animation: Fade in + slide from bottom (staggered)
```

---

## Animation Specifications

### Entrance Animations
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

Message: fadeInUp 0.3s ease-out
Extraction Panel: fadeInUp 0.5s ease-out (delayed 0.2s)
Trial Card: fadeInUp 0.3s ease-out (staggered by 0.1s each)
```

### Streaming Text Animation
```css
/* Fix: Instead of updating whole message at once */
/* New approach: Append char by char with subtle opacity transition */
@keyframes charFadeIn {
  from { opacity: 0.7; }
  to { opacity: 1; }
}
/* Apply only to NEW content chunk (50ms duration) */
```

### Hover States
```css
Trial Card:
  transform: translateY(-4px);
  box-shadow: elevation 4;
  transition: all 0.2s ease

Button:
  background: slightly darker terracotta
  transform: scale(1.02);
  box-shadow: elevation 3;
  transition: all 0.15s ease

Input Focus:
  border-color: terracotta;
  box-shadow: 0 0 0 3px rgba(terracotta, 0.1);
```

### Loading States
```css
Search button (loading):
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  animation: pulse 2s ease-in-out infinite;

Trial card skeleton:
  Background: gray shimmer
  @keyframes shimmer { /* gradient slide animation */ }
```

---

## Responsive Breakpoints

```
Mobile (< 768px):
- Single column layout
- Full-width chat
- Trial cards stack below
- Navbar: Logo only (title as subheading)
- Spacings: px-4, gap-2

Tablet (768px - 1024px):
- 1.5 column (chat takes 60%, trials 40%)
- Side by side but scrollable
- Navbar: Full width

Desktop (> 1024px):
- 2 column layout (50-50 or 60-40)
- Fixed right panel (scrollable within)
- Left panel responsive
- Navbar: Full width
```

---

## Color Tokens Implementation

### CSS Custom Properties (in globals.css)
```css
:root {
  /* Primary */
  --color-primary: #E07856;      /* Terracotta */
  --color-primary-light: #F5A899;
  --color-primary-dark: #C85C3D;

  /* Secondary */
  --color-secondary: #A8D5BA;    /* Sage */
  --color-secondary-light: #D4E8DC;
  --color-secondary-dark: #7CB89F;

  /* Tertiary */
  --color-tertiary: #2C3E50;     /* Indigo */
  --color-tertiary-light: #4A5F7F;
  --color-tertiary-dark: #1A2530;

  /* Neutrals */
  --color-background: #F8F5F1;
  --color-surface: #FFFFFF;
  --color-text: #2C3E50;
  --color-text-muted: #6B7280;

  /* Dark Mode */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1A1A1A;
    --color-surface: #2A2A2A;
    --color-text: #F0F0F0;
    --color-text-muted: #A0A0A0;
  }
}
```

### Tailwind Config Extension
```js
// tailwind.config.ts
extend: {
  colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    tertiary: 'var(--color-tertiary)',
  },
  keyframes: {
    fadeInUp: { ... },
    shimmer: { ... },
    charFadeIn: { ... },
  },
}
```

---

## File Structure Changes

```
components/
├── chat/
│   ├── chat-interface.tsx (redesigned - 2-column)
│   ├── chat-message.tsx (updated colors/animations)
│   ├── extraction-panel.tsx (new styling)
│   └── trial-card.tsx (new styling)
├── layout/
│   ├── navbar.tsx (new - integrated header)
│   ├── hero-section.tsx (refactored from page.tsx)
│   └── two-column-layout.tsx (new - main layout)
├── empty-state.tsx (new)
├── loading-skeleton.tsx (new)
└── header.tsx (can be deprecated)

app/
└── page.tsx (simplified - uses new layout)

lib/
├── styles/
│   ├── colors.ts (color constants)
│   ├── animations.ts (animation utilities)
│   └── spacing.ts (spacing scale)
└── (existing files)

globals.css (extended with animations + custom properties)
```

---

## Success Criteria

✅ **Layout**:
- [ ] 2-column layout implemented
- [ ] Trial cards appear on right
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dynamic height growth as chat expands

✅ **Colors**:
- [ ] All components use new palette
- [ ] Dark mode fully supported
- [ ] No hardcoded colors
- [ ] Contrast meets WCAG AA

✅ **Animations**:
- [ ] Streaming animation is smooth
- [ ] Page transitions are delightful
- [ ] Hover states responsive
- [ ] No janky rendering

✅ **Polish**:
- [ ] Icons placed strategically
- [ ] Spacing consistent
- [ ] Border radius scale applied
- [ ] Shadows create proper depth

✅ **Performance**:
- [ ] Lighthouse score > 90
- [ ] Animations use GPU (transform/opacity)
- [ ] No layout thrashing

---

## Git Commit Plan

```
feat: integrate navbar into hero section
feat: implement 2-column layout architecture
feat: apply empathic color palette
feat: create extraction panel styling
feat: style trial cards with new design
feat: fix streaming animation
feat: add entrance animations
feat: refine spacing and shadows
feat: add dark mode styling
feat: polish micro-interactions
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Responsive breaks on mobile | Medium | High | Test early on all breakpoints |
| Animation performance | Low | Medium | Use transform/opacity only |
| Color contrast issues | Medium | High | Run WCAG checker before commit |
| Streaming animation complexity | High | Medium | Implement simple append approach |
| Right panel overflow | Medium | Medium | Use scrollable container with sticky header |

---

## Timeline Estimate

- Phase 2.1 (Layout): 2-3 hours
- Phase 2.2 (Colors): 3-4 hours
- Phase 2.3 (Animations): 2-3 hours
- Phase 2.4 (Polish): 1-2 hours
- **Total: 8-12 hours**

---

## Dependencies

- None (existing tech stack sufficient)
- Tailwind CSS 4 (already installed)
- Lucide React icons (already installed)
- Next.js 16 (already installed)

---

## Notes for Implementation

1. **Start with layout** - Get structure right before styling
2. **Color test** - View in both light and dark mode continuously
3. **Animation performance** - Use browser DevTools to check for jank
4. **Mobile first** - Design mobile view first, then enhance desktop
5. **Accessibility** - Test keyboard navigation throughout
6. **Git hygiene** - One logical change per commit

---

**Created**: 2026-02-08
**Status**: Ready for Phase 2.1 implementation
**Next Step**: Begin layout architecture changes to page.tsx
