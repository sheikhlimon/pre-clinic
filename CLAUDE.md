# Bio-Luxe Design System

## Design Tokens
- Forest Green: `#1A2F23`
- Sand: `#F5F2ED`

## Directive (CRITICAL)
**ALWAYS** read `docs/context/active_context.md` before taking action.

## Agent Workflow (from .claude/AGENTS.md)

### Before ANY code change:
1. Read `docs/context/active_context.md`
2. Update "Current Task" section
3. Note blocking dependencies

### For multi-step work:
- Use `TaskCreate` to track steps
- Mark `in_progress` when starting
- Mark `completed` when done

### Implementation:
- **ONE commit per logical change** (no one-shotting)
- Run `npm exec -- ultracite fix` before each commit
- Commit format: `[type] brief description`

### After completing:
- Update `docs/context/progress.md` (check off items)
- Log AI interactions to "AI Chat Log" in active_context.md

### Code Review Checklist:
- [ ] Understand what code does
- [ ] Reviewed changes
- [ ] Tested manually
- [ ] No security vulnerabilities
- [ ] Follows standards (ultracite fix passed)

## Project Context
Symptom-to-Trial matcher for healthcare hackathon. Next.js 16 + React 19 + shadcn/ui.

See `.claude/CLAUDE.md` for coding standards.
