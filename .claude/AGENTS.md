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

## Ultracite

**Run before every commit:**

```bash
npm exec -- ultracite fix
```

Biome handles most formatting. Focus on things it can't catch:
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
- [ ] Ran `npm exec -- ultracite fix`
