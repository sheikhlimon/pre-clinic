# Code Standards

ESLint + Prettier enforce code quality. Husky + lint-staged run checks on commit.

## Quick Reference

- **Lint**: `npm run lint`
- **Lint fix**: `npm run lint:fix`
- **Format**: `npm run format`
- **Format check**: `npm run format:check`
- **Build**: `npm run build`

Pre-commit hook runs lint-staged automatically (eslint --fix + prettier --write).

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions
- Use `async/await` syntax instead of promise chains
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Don't define components inside other components
- Max ~100 lines per component. Extract when it grows beyond that.
- Use shared types from `lib/types.ts` — never redeclare interfaces across files
- No duplicate event handlers. Extract reusable components instead.
- No hardcoded colors. Use CSS custom properties or Tailwind theme.

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings
- Use `try-catch` blocks meaningfully
- Prefer early returns over nested conditionals for error cases

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Framework-Specific

**Next.js:**
- Use Next.js `<Image>` component for images
- Use App Router metadata API for head elements
- Use Server Components for async data fetching

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests — use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat

## What Linters Can't Catch

Focus your attention on:

1. **Business logic correctness** — algorithms and data flow
2. **Meaningful naming** — descriptive names for functions, variables, and types
3. **Architecture decisions** — component structure, data flow, and API design
4. **Edge cases** — boundary conditions and error states
5. **User experience** — accessibility, performance, and usability
