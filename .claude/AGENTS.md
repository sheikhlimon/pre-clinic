# Agent Workflow Rules

## Incremental Implementation

**CRITICAL: Commit after EACH implementation step separately**

- One logical change per commit
- No one-shotting multiple files/features
- Commit before moving to next task

Commit format:
```
[type] brief description
```

Types: feat, fix, chore, refactor, docs

## Context System

**MUST follow hierarchical context before ANY code change**

1. Before starting work:
   - Read `docs/context/active_context.md`
   - Update "Current Task" section
   - Note blocking dependencies

2. After AI interactions:
   - Log to "AI Chat Log" section in active_context.md

3. After completing:
   - Update `docs/context/progress.md`
   - Check off completed items

## Planning

**Write plan file before implementation**

1. Create plan file or use built-in plan mode
2. Plan must include:
   - Context (why this change)
   - Implementation steps (ordered)
   - Critical files to modify
   - Verification steps
3. Get approval before executing

## Linting & Formatting

**Run before every commit:**

```bash
npm run lint:fix && npm run format
```

Pre-commit hook (husky + lint-staged) runs automatically. Focus on things linters can't catch:
- Business logic correctness
- Meaningful naming
- Architecture decisions
- Edge cases
- UX considerations

## Task Tracking

- Use TaskCreate for multi-step work
- Mark in_progress when starting
- Mark completed when done
- Clean up stale tasks

## Code Review Checklist

Before committing:
- [ ] Understand what code does
- [ ] Reviewed changes
- [ ] Tested manually
- [ ] No security vulnerabilities
- [ ] Follows standards
- [ ] Ran `npm run lint:fix && npm run format`

---

## React Component Architecture

### Component Decomposition

- **Max ~100 lines per component**. If a component grows beyond this, extract sub-components.
- **One responsibility per component**: state management OR layout OR display, not all three.
- **Don't define components inside other components.** Extract to separate files.
- **Keep render methods flat.** Use early returns for conditional rendering.

### Shared Types

- **Single source of truth** in `apps/web/src/lib/types.ts`.
- All component interfaces import from `types.ts`, never redeclare.
- Zod schemas in `schemas.ts` derive types; component props use those types.

### DRY Principles

- **No duplicate event handlers.** If two elements use the same handler pattern, extract a reusable component.
- **No duplicate JSX blocks.** If you copy-paste JSX, extract a component.
- **No duplicate style objects.** Use Tailwind classes or CSS custom properties, not inline styles.
- **No duplicate types.** One interface, imported everywhere.

### Design Tokens

- **Never hardcode colors.** Use CSS custom properties (`var(--color-terracotta)`) or Tailwind theme values.
- **Never use inline `style={{}}` for font sizes, line heights, or letter spacing.** Use Tailwind classes.
- Defined tokens are in `apps/web/src/index.css` under `:root`.

### File Organization

```
apps/web/src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   └── layout.tsx
├── components/
│   ├── chat/               # Chat feature components
│   │   ├── chat-interface.tsx    # Orchestrator only
│   │   ├── chat-input.tsx        # Input + submit
│   │   ├── chat-message.tsx      # Single message bubble
│   │   ├── error-banner.tsx      # Error state display
│   │   ├── extraction-panel.tsx  # Extracted data sidebar
│   │   ├── info-item.tsx         # Icon + label row
│   │   ├── condition-card.tsx    # Condition + probability
│   │   ├── mobile-cards-panel.tsx # Mobile collapsible panel
│   │   ├── prompt-card.tsx       # Quick-start prompt card
│   │   └── trial-card.tsx        # Trial result card
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── types.ts            # Shared TypeScript types
│   ├── schemas.ts          # Zod validation schemas
│   ├── use-chat.ts         # Chat hook
│   ├── prompts.ts          # AI system prompt
│   ├── clinical-trials-client.ts
│   └── trial-ranking.ts
└── index.css               # Design tokens + animations
```

### Dependencies

- Next.js 16 (App Router)
- React 19
- shadcn/ui + Tailwind CSS
- OpenRouter API (configurable model)
- ClinicalTrials.gov V2 API
- Zod (validation)
- Lucide React (icons)
