# Landing Page Cleanup Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the landing page so it keeps the current look, preserves the main browse cards, and removes redundant lower sections.

**Architecture:** Keep the existing homepage route and data helper. Reduce the number of rendered sections, trim the backing homepage data shape to match, and verify the new structure through focused homepage tests plus app-level checks.

**Tech Stack:** SvelteKit, Svelte, TypeScript, Vitest

---

### Task 1: Lock the simplified homepage contract with tests

**Files:**
- Modify: `app/src/lib/homepage.test.ts`
- Test: `app/src/lib/homepage.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions that the homepage only exposes one utility section and no `quickLinks` collection, while keeping the four primary browse cards.

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test src/lib/homepage.test.ts`
Expected: FAIL because the current homepage data and route still expose redundant sections.

- [ ] **Step 3: Write minimal implementation**

Update the homepage data contract and route usage to remove the redundant section and keep one compact utility block.

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test src/lib/homepage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-04-07-landing-page-cleanup.md app/src/lib/homepage.test.ts app/src/lib/homepage.ts app/src/routes/content/+page.svelte
git commit -m "feat: simplify landing page sections"
```

### Task 2: Verify the route renders the simplified structure cleanly

**Files:**
- Modify: `app/src/routes/content/+page.svelte`
- Test: `app/src/lib/homepage.test.ts`

- [ ] **Step 1: Run focused verification**

Run: `yarn test src/lib/homepage.test.ts`
Expected: PASS with route-source assertions matching the simplified structure.

- [ ] **Step 2: Run app checks**

Run: `yarn run check`
Expected: PASS

- [ ] **Step 3: Review the landing page in the dev server**

Confirm the page structure is:
- intro plus search
- four primary browse cards
- one utility block

- [ ] **Step 4: Commit**

```bash
git add app/src/routes/content/+page.svelte app/src/lib/homepage.ts app/src/lib/homepage.test.ts
git commit -m "chore: verify simplified landing page structure"
```
