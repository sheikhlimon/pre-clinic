# PreClinic Design System

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-terracotta` | `#E07856` | Primary action, buttons, gradients |
| `--color-terracotta-dark` | `#C85C3D` | Gradient end, hover states |
| `--color-sage` | `#A8D5BA` | Accent, symptom tags, calming elements |
| `--color-indigo` | `#2C3E50` | Headings, text, professional elements |
| `--color-coral` | `#FF6B6B` | Gradient accent, probability badges |
| `--color-warm-gray` | `#F8F5F1` | Backgrounds (considered, not currently used) |

## Tailwind Color Classes

Use Tailwind arbitrary values referencing tokens:
- `bg-[var(--color-terracotta)]` instead of `bg-[#E07856]`
- `text-[var(--color-terracotta)]` instead of `text-[#E07856]`
- `from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)]` for gradients

## Typography Scale

| Size | CSS Var | Tailwind |
|------|---------|----------|
| XS (13px) | `var(--font-size-xs)` | `text-xs` or custom |
| SM (16px) | `var(--font-size-sm)` | `text-sm` or `text-base` |
| Base (16px) | `var(--font-size-base)` | `text-base` |
| LG (18px) | `var(--font-size-lg)` | `text-lg` |
| XL (20px) | `var(--font-size-xl)` | `text-xl` |

**Rule:** Use Tailwind's built-in size classes first. Only fall back to CSS vars for exact pixel values.

## Shadow System

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle elevation, cards at rest |
| `--shadow-md` | Hovered cards, focused inputs |
| `--shadow-lg` | Active elements, elevated modals |
| `--shadow-terracotta-sm` | Brand-colored subtle shadow |
| `--shadow-terracotta-md` | Brand-colored medium shadow |

## Component Specs

### PromptCard
- Rounded card with border
- Clickable, centered text
- Hover: border tint + shadow lift
- Props: `text`, `onSelect`

### ErrorBanner
- Amber variant: missing API key
- Red variant: API errors with message
- Icon (AlertTriangle) + title + description

### ChatInput
- Rounded container with border
- Auto-growing textarea (max 160px)
- Gradient submit button (terracotta → terracotta-dark)
- Disabled state when empty or loading

### ChatMessage
- User: right-aligned, terracotta gradient, white text
- Assistant: left-aligned, bordered, subtle bg
- Strips JSON blocks from assistant content
- Slide-up entrance animation

### ExtractionPanel
- Card with status indicator dot
- Info rows for age, location (icon + label + value)
- Symptom tags (sage background)
- Condition cards (name + probability bar + badge)
- Status text at bottom

### TrialCard
- Card with hover lift
- Title + score badge (circular, terracotta gradient ring)
- Score bar (color-coded by range)
- Match reasons list
- CTA button with shimmer effect

### MobileCardsPanel
- Collapsible header with expand/collapse toggle
- Contains ExtractionPanel + TrialCards
- Only visible on `lg:hidden` breakpoint

## Layout Architecture

```
┌─────────────────────────────────────────────┐
│ Navbar (logo + clear + github + theme)       │
│ Hero (only when empty state)                 │
├──────────┬──────────────┬───────────────────┤
│ Extract  │ Chat         │ Trials            │
│ Panel    │ Messages     │ Cards             │
│ (left)   │ + Input      │ (right)          │
│ w-80     │ flex-1       │ w-96             │
│ lg:block │ always       │ lg:block         │
└──────────┴──────────────┴───────────────────┘
```

Mobile: Single column, collapsible panel for extraction + trials.
