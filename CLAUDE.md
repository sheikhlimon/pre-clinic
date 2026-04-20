# PreClinic

Symptom-to-trial oncology matcher. Next.js 16 + React 19 + Tailwind + shadcn/ui.

## Working Rules

- **EXPLAIN FIRST** — before writing code, explain WHAT and WHY
- **ONE FILE AT A TIME** — never implement multiple files in one response
- **TEACH** — explain architecture decisions, common mistakes, scaling concerns
- **COMMIT AFTER EACH FEATURE** — one logical unit of work
- **ANSWER QUESTIONS** — pause and explain when asked

## Code Standards

- **Lint**: `npm run lint` | **Format**: `npm run format` | **Build**: `npm run build`
- Pre-commit hook runs eslint --fix + prettier --write automatically
- Commit format: `feat: concise description` (only important details)
- Shared types from `lib/types.ts` — never redeclare
- No hardcoded colors — use CSS custom properties or Tailwind theme
- Comments explain WHY not WHAT
- Components ~100 lines max, extract when bloated

## Design System

- **Terracotta**: `var(--color-terracotta)` — primary accent
- **Sage**: `var(--color-sage)` — secondary
- **Indigo**: `var(--color-indigo)` — text/headers
- **Cream**: `var(--color-cream)` — backgrounds
- **Typography**: Fraunces (display/serif), DM Sans (body/sans)
- No generic AI aesthetics — asymmetric layouts, personality, warm editorial feel
