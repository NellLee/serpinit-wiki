# Testing Cleanup Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fragmented ad hoc test setup with a conventional `Vitest + Playwright + svelte-check` workflow, remove obsolete custom test execution paths, and clean generated test artifacts.

**Architecture:** Keep browser coverage in Playwright and move the `app/src/**/*.test.ts` assertion scripts onto Vitest so unit and source-regression checks run under a single test runner. Preserve existing test intent where it is still useful, remove obsolete `esbuild`-driven scripts and stale generated files, and leave current Playwright snapshot failures visible rather than papering over them.

**Tech Stack:** SvelteKit, TypeScript, Vitest, Playwright, Yarn, existing markdown/search regression tests

---

### Task 1: Map The Existing Test Surface

**Files:**
- Modify: `app/package.json`
- Modify: `app/vite.config.ts`
- Review: `app/playwright.config.cjs`
- Review: `app/src/**/*.test.ts`

- [ ] **Step 1: List all current test files and scripts**

Run: `rg --files app/src -g "*.test.ts" && Get-Content app/package.json`
Expected: inventory of assertion-style tests and the current `check:*` / `test:e2e` scripts.

- [ ] **Step 2: Define the target command set**

Target commands:
- `yarn test` for Vitest
- `yarn test:watch` or equivalent local Vitest watch command
- `yarn test:e2e` for Playwright
- `yarn check` for `svelte-check`
- `yarn build` for production build verification

- [ ] **Step 3: Commit the command contract to code changes**

Ensure every later change supports the command set above without requiring manual `esbuild | node` execution.

### Task 2: Add Vitest Infrastructure

**Files:**
- Modify: `app/package.json`
- Modify: `app/vite.config.ts`
- Create or Modify: `app/vitest.setup.ts` only if needed

- [ ] **Step 1: Add the failing infrastructure changes**

Update `app/package.json` to include Vitest dev dependencies and new scripts, removing obsolete `check:stability` / `check:presentation` scripts.

- [ ] **Step 2: Configure Vitest in Vite**

Add a `test` block to `app/vite.config.ts` with a Node-compatible environment, include pattern for `src/**/*.test.ts`, and minimal settings needed for the existing tests.

- [ ] **Step 3: Run the new test command**

Run: `yarn test --runInBand` if needed for diagnosis, otherwise `yarn test --run`
Expected: failing test files until migration from top-level `assert` scripts is complete.

- [ ] **Step 4: Commit the infrastructure pass**

```bash
git add app/package.json app/vite.config.ts app/yarn.lock
git commit -m "test: add vitest infrastructure"
```

### Task 3: Migrate Assertion Scripts To Vitest

**Files:**
- Modify: `app/src/lib/*.test.ts`
- Modify: `app/src/lib/presentation/pagePresentation.test.ts`
- Modify: `app/src/lib/stability/apiInitialization.test.ts`
- Modify: `app/src/routes/content/search/searchPageSource.test.ts`

- [ ] **Step 1: Convert tests to Vitest imports and structure**

Replace top-level Node `assert` execution with `describe`, `it`/`test`, and `expect` from Vitest while preserving the current assertions.

- [ ] **Step 2: Keep source-regression tests explicit**

For tests that inspect file contents by regex or string search, keep the same coverage intent but express it in named Vitest cases so failures are attributable and grouped.

- [ ] **Step 3: Run the migrated suite**

Run: `yarn test --run`
Expected: all migrated `*.test.ts` files pass under Vitest.

- [ ] **Step 4: Commit the migration**

```bash
git add app/src/lib app/src/routes/content/search/searchPageSource.test.ts
git commit -m "test: migrate source assertions to vitest"
```

### Task 4: Clean Obsolete Test Paths And Generated Residue

**Files:**
- Modify: `app/.gitignore`
- Modify: `app/README.md`
- Modify: `docs/superpowers/specs/2026-03-30-search-modernization-design.md`
- Modify: `docs/superpowers/plans/2026-03-30-search-modernization.md`
- Delete: stale `vite.config.ts.timestamp-*` files if they are purely generated leftovers

- [ ] **Step 1: Ignore generated Playwright output**

Add `test-results` and `playwright-report` to `app/.gitignore`.

- [ ] **Step 2: Remove obsolete references**

Update project docs that describe the old `esbuild`-based test workflow so they point to the unified Vitest command set, but do not rewrite historical content unrelated to testing.

- [ ] **Step 3: Prune safe generated leftovers**

Delete the `vite.config.ts.timestamp-*` files if no code or docs rely on them.

- [ ] **Step 4: Commit the cleanup**

```bash
git add app/.gitignore app/README.md docs/superpowers/specs/2026-03-30-search-modernization-design.md docs/superpowers/plans/2026-03-30-search-modernization.md
git commit -m "test: remove obsolete test artifacts and docs"
```

### Task 5: Verify And Report Residual Failures

**Files:**
- Review: `app/playwright.config.cjs`
- Review: `app/e2e/*.spec.js`

- [ ] **Step 1: Run the full verification set**

Run:
- `yarn test --run`
- `yarn run check`
- `yarn run build`
- `yarn run test:e2e`

Expected:
- Vitest passes
- `svelte-check` passes
- build passes
- Playwright remains red only for pre-existing browser issues or snapshot drift not addressed by this cleanup

- [ ] **Step 2: Capture residual risk explicitly**

Document any remaining Playwright failures, especially snapshot mismatches and the existing SSR `page` store error path involving `src/lib/components/Navbar.svelte`.

- [ ] **Step 3: Commit the final integration**

```bash
git add -A
git commit -m "test: unify and clean project testing workflow"
```
