# Rune Inspector UI Review Loop 1 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the `/dev/runes` inspector so the active selection, canvas, and explanatory detail stay readable in one working surface before any deeper canvas-complexity work begins.

**Architecture:** Keep the existing left-library / center-canvas / right-detail structure, but strengthen each zone’s role. Convert the library into a bounded navigation surface with a clear active state, keep the canvas visually central, and collapse the three right-side detail panels into one tabbed detail area so the initial viewport carries the subject, output, and explanatory lens together.

**Tech Stack:** SvelteKit, Svelte components, existing rune presentation pipeline, Vitest, Playwright-backed manual UI review, existing Yarn workflow

---

### Task 1: Lock In The Review Baseline And Keep Scope Clean

**Files:**
- Review: `docs/superpowers/specs/2026-04-07-rune-inspector-ui-review-loop-1-design.md`
- Ignore: `tmp/ui-output-review-vite.out.log`
- Ignore: `tmp/ui-output-review-vite.err.log`

- [ ] **Step 1: Confirm the loop only targets inspector readability**

Re-read the approved spec and keep this loop limited to:
- library active-state clarity
- bounded library scrolling
- right-side detail tabs
- first-viewport inspector readability

Do not expand scope into canvas-language redesign or canonical rune-document changes.

- [ ] **Step 2: Confirm the temporary log files stay out of scope**

Run:

```bash
git status --short
```

Expected:
- the `tmp/ui-output-review-vite.*.log` files may still be present as untracked artifacts
- they are not included in any commit for this loop

- [ ] **Step 3: Record the baseline UI issues in the implementation notes**

Use the approved review findings as the RED baseline:
- active selection too weak
- selected entry can sit far away from the canvas viewport
- right-side panels stack too deep
- the page reads more like a long report than a focused inspector

This baseline should guide all later verification.

### Task 2: Add A Focused Detail-Tabs Surface

**Files:**
- Create: `app/src/lib/components/runes/RuneDetailTabs.svelte`
- Modify: `app/src/routes/dev/runes/+page.svelte`
- Modify: `app/src/lib/components/runes/RuneStructurePanel.svelte`
- Modify: `app/src/lib/components/runes/RuneProjectionPanel.svelte`
- Modify: `app/src/lib/components/runes/RuneLegend.svelte`

- [ ] **Step 1: Write the failing presentation test for tabbed detail focus**

Add or update a focused test in `app/src/lib/components/runes/runePresentation.test.ts` only if that file already cleanly covers page-level UI semantics.
If it does not, create a new focused component test file for `RuneDetailTabs.svelte` under `app/src/lib/components/runes/`.

The test should assert:
- only one detail view is visible at a time
- the tabs are named `Struktur`, `Projektion`, and `Legende`
- switching tabs does not change the selected rune document heading

Example expectation shape:

```ts
it('shows one rune detail panel at a time behind explicit tabs', async () => {
  render(RuneDetailTabs, { ...props });

  expect(screen.getByRole('tab', { name: 'Struktur' })).toBeInTheDocument();
  expect(screen.getByRole('tabpanel')).toHaveTextContent(/Semantik|Gefuege/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `app/`:

```bash
yarn test src/lib/components/runes
```

Expected:
- FAIL because the tabbed detail surface does not exist yet

- [ ] **Step 3: Implement the tabbed detail wrapper**

Create `app/src/lib/components/runes/RuneDetailTabs.svelte` as the single right-side detail controller.

It should:
- own the current tab state
- expose three tabs: `Struktur`, `Projektion`, `Legende`
- render one panel at a time
- preserve a compact, desktop-readable layout

Keep the existing detail panel components mostly presentational.
Do not re-embed all their content directly into `+page.svelte`.

- [ ] **Step 4: Adapt the existing detail panels for tab use**

Update:
- `app/src/lib/components/runes/RuneStructurePanel.svelte`
- `app/src/lib/components/runes/RuneProjectionPanel.svelte`
- `app/src/lib/components/runes/RuneLegend.svelte`

Make only the changes needed so they:
- fit cleanly within a shared tab panel
- avoid duplicated outer spacing that assumed a long stacked column
- remain individually understandable

- [ ] **Step 5: Wire the new detail surface into the route**

Update `app/src/routes/dev/runes/+page.svelte` so the three stacked detail panels are replaced by the single tabbed detail area.

Keep the page data flow unchanged:
- library selects the subject
- tabs select the explanatory lens

- [ ] **Step 6: Run the component test to verify it passes**

Run from `app/`:

```bash
yarn test src/lib/components/runes
```

Expected:
- PASS

- [ ] **Step 7: Commit the tabbed detail surface**

```bash
git add app/src/lib/components/runes/RuneDetailTabs.svelte app/src/routes/dev/runes/+page.svelte app/src/lib/components/runes/RuneStructurePanel.svelte app/src/lib/components/runes/RuneProjectionPanel.svelte app/src/lib/components/runes/RuneLegend.svelte
git commit -m "feat: add tabbed rune inspector detail surface"
```

### Task 3: Strengthen Library State And Scroll Behavior

**Files:**
- Modify: `app/src/lib/components/runes/RuneLibraryPanel.svelte`
- Modify: `app/src/routes/dev/runes/+page.svelte`

- [ ] **Step 1: Write the failing library-state test**

Add a focused component test for `RuneLibraryPanel.svelte` asserting that:
- the selected entry is exposed with a semantic current/selected marker
- the selected entry has a dedicated active class or attribute hook
- the library container exposes a bounded scrollable surface rather than relying on full-page height

Example expectation shape:

```ts
it('marks the selected library entry clearly', () => {
  render(RuneLibraryPanel, { groups, selectedId: 'rune.substrat-gebundener-auslass' });

  expect(screen.getByRole('link', { name: /Substratgebundener Auslass/i })).toHaveAttribute('aria-current', 'page');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `app/`:

```bash
yarn test src/lib/components/runes
```

Expected:
- FAIL because the current active-state semantics and layout hooks are too weak or missing

- [ ] **Step 3: Strengthen the selected entry semantics and styling hooks**

Update `app/src/lib/components/runes/RuneLibraryPanel.svelte` so the selected item:
- uses `aria-current="page"` or an equally explicit semantic marker
- has a dedicated active styling hook
- gains stronger visual emphasis than the current subtle tint and thin border

Keep the list readable for all three groups: primitives, structures, and runes.

- [ ] **Step 4: Bound the library into its own scrolling surface**

Still in `RuneLibraryPanel.svelte`, adjust the panel layout so:
- the library height is bounded relative to the viewport
- the library scrolls internally
- group headings stay readable during navigation

If the page-level layout needs small support changes, make them in `app/src/routes/dev/runes/+page.svelte`.

- [ ] **Step 5: Run the test to verify it passes**

Run from `app/`:

```bash
yarn test src/lib/components/runes
```

Expected:
- PASS

- [ ] **Step 6: Commit the library-state refinement**

```bash
git add app/src/lib/components/runes/RuneLibraryPanel.svelte app/src/routes/dev/runes/+page.svelte
git commit -m "feat: clarify rune library selection state"
```

### Task 4: Rebalance The Page Layout Around The Canvas

**Files:**
- Modify: `app/src/routes/dev/runes/+page.svelte`
- Modify: `app/src/lib/components/runes/RuneCanvas.svelte`

- [ ] **Step 1: Write the failing page-layout expectation**

Add a focused route-level or component-level test only if the repo already has a clean way to assert page structure in Svelte components.
If such a test would be artificial, document that limitation in the final implementation report and rely on the manual rendered review for this task.

The target behavior is:
- the canvas remains visually primary
- the right-side tab panel sits beside it in the initial viewport
- the layout does not regress into a long vertical report

- [ ] **Step 2: Update the route layout**

Adjust `app/src/routes/dev/runes/+page.svelte` so the main inspector region:
- keeps the canvas central
- aligns the tabbed detail area beside the canvas on desktop
- avoids pushing the key explanatory surface below the fold

Prefer CSS grid or a similarly explicit layout system over ad-hoc spacing tweaks.

- [ ] **Step 3: Make only minimal canvas-container adjustments**

Update `app/src/lib/components/runes/RuneCanvas.svelte` only as needed to support the new layout.

Do not change the rune-drawing semantics in this task.
Limit changes to sizing, containment, spacing, or presentation support for the new inspector layout.

- [ ] **Step 4: Run focused app checks**

Run from `app/`:

```bash
yarn check
```

Expected:
- PASS

- [ ] **Step 5: Commit the layout rebalance**

```bash
git add app/src/routes/dev/runes/+page.svelte app/src/lib/components/runes/RuneCanvas.svelte
git commit -m "feat: rebalance rune inspector layout"
```

### Task 5: Re-Run The UI Output Review Against `/dev/runes`

**Files:**
- Review: `app/src/routes/dev/runes/+page.svelte`
- Review: `app/src/lib/components/runes/RuneLibraryPanel.svelte`
- Review: `app/src/lib/components/runes/RuneDetailTabs.svelte`
- Review: `app/src/lib/components/runes/RuneStructurePanel.svelte`
- Review: `app/src/lib/components/runes/RuneProjectionPanel.svelte`
- Review: `app/src/lib/components/runes/RuneLegend.svelte`

- [ ] **Step 1: Start the local dev server**

Run from `app/`:

```bash
yarn dev --host 127.0.0.1 --port 4173
```

Expected:
- the local app serves successfully

- [ ] **Step 2: Re-run `skills/ui-output-review` on `/dev/runes`**

Review the rendered output using:
- the `runes` profile
- one primitive state
- one full-rune state
- at least one selection change

The review should check specifically whether:
- the active selection is now unmistakable
- the library remains part of the same working surface as the canvas
- the right-side tabs reduce vertical fragmentation
- the first viewport feels more like an inspector and less like a long report

Do not create screenshot artifacts.

- [ ] **Step 3: Capture any remaining findings**

If the review still finds problems:
- note them explicitly in the final implementation report
- do not silently broaden this loop into canvas-language work

- [ ] **Step 4: Commit only if review-driven adjustments were necessary**

```bash
git add app/src/routes/dev/runes/+page.svelte app/src/lib/components/runes
git commit -m "refactor: tighten rune inspector review loop 1 polish"
```

Only create this commit if the re-review revealed and fixed a real issue.

### Task 6: Final Verification And Handoff

**Files:**
- Review: `docs/superpowers/specs/2026-04-07-rune-inspector-ui-review-loop-1-design.md`
- Review: `app/src/routes/dev/runes/+page.svelte`
- Review: `app/src/lib/components/runes/*`

- [ ] **Step 1: Run the final verification set**

Run from `app/`:

```bash
yarn test src/lib/components/runes
yarn check
yarn build
```

Expected:
- component tests pass
- type and Svelte checks pass
- production build passes

- [ ] **Step 2: Verify repo hygiene**

Run from the repo root:

```bash
git status --short
git diff --check
```

Expected:
- no accidental inclusion of `tmp/ui-output-review-vite.*.log`
- no whitespace or patch-hygiene issues

- [ ] **Step 3: Capture residual risks explicitly**

In the final implementation report, call out:
- any remaining selection or layout limitations
- that canvas-complexity work still remains for a later loop
- whether the right-side tab model introduced any new discoverability tradeoffs

- [ ] **Step 4: Commit the integrated loop**

```bash
git add -A
git commit -m "feat: refine rune inspector review loop 1"
```
