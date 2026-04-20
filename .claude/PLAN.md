# PreClinic Master Plan

## Phase 1: Project Structure & Types
- [ ] Create `.claude/` project files (AGENTS.md, PLAN.md, DESIGN.md, MEMORY.md)
- [ ] Extract shared types to `lib/types.ts`
- [ ] Update `use-chat.ts` to import from `types.ts`

## Phase 2: Component Decomposition
- [ ] Create `prompt-card.tsx` — reusable prompt card with `text` + `onSelect` props
- [ ] Create `error-banner.tsx` — amber (API key) + red (other errors)
- [ ] Create `chat-input.tsx` — textarea + submit button + auto-grow
- [ ] Create `mobile-cards-panel.tsx` — collapsible extraction + trials
- [ ] Create `info-item.tsx` — icon + label row (for age, location)
- [ ] Create `condition-card.tsx` — condition name + probability bar

## Phase 3: Rewrite Main Components
- [ ] Rewrite `chat-interface.tsx` (~150 lines, orchestrator only)
- [ ] Simplify `extraction-panel.tsx` (~60 lines, using info-item + condition-card)

## Phase 4: Style Cleanup
- [ ] Remove inline `style={{}}` objects — use Tailwind classes
- [ ] Replace hardcoded `#E07856` etc. with CSS custom properties
- [ ] Remove duplicate localStorage logic in chat-interface.tsx
- [ ] Consolidate DRY event handlers

## Phase 5: Verification
- [ ] `npm run build` passes
- [ ] `npm exec -- ultracite fix` passes
- [ ] Full chat flow works on desktop
- [ ] Full chat flow works on mobile
- [ ] Extraction panel displays correctly
- [ ] Trial cards render with scores
- [ ] Error states display correctly

## Commit Sequence

1. `refactor: extract shared types to lib/types.ts`
2. `refactor: extract prompt-card and error-banner components`
3. `refactor: extract chat-input component`
4. `refactor: extract info-item and condition-card components`
5. `refactor: extract mobile-cards-panel component`
6. `refactor: rewrite chat-interface and extraction-panel`
7. `style: replace inline styles with Tailwind classes and design tokens`
