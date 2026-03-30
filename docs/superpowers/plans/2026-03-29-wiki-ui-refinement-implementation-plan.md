# Wiki UI Refinement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the desktop wiki UI so article pages, index pages, hub pages, media pages, and utility pages present information more intentionally while preserving the current routing model and markdown-driven content system.

**Architecture:** Add a small presentation layer between route data and layout components so page classes and layout decisions are explicit instead of emerging from fixed-width defaults. Then incrementally refactor the shell, article layout, support rails, and utility views around that model while keeping the current wiki information architecture intact.

**Tech Stack:** SvelteKit, Svelte 4, TypeScript, SCSS, existing markdown rendering pipeline, existing Svelte route structure

---

## File Structure

### Existing files to modify

- Modify: `app/src/routes/+layout.svelte`
- Modify: `app/src/routes/content/[...page]/+page.server.ts`
- Modify: `app/src/routes/content/[...page]/+page.svelte`
- Modify: `app/src/lib/components/ContentCard.svelte`
- Modify: `app/src/lib/components/Sidebar.svelte`
- Modify: `app/src/lib/components/ContentTree.svelte`
- Modify: `app/src/lib/components/ReferenceList.svelte`
- Modify: `app/src/lib/components/Breadcrumbs.svelte`
- Modify: `app/src/lib/components/Navbar.svelte`
- Modify: `app/src/lib/components/MidPanel.svelte`
- Modify: `app/src/routes/content/search/+page.svelte`
- Modify: `app/src/routes/content/timeline/+page.svelte`
- Modify: `app/src/routes/convert/+page.svelte`

### New files to create

- Create: `app/src/lib/presentation/pagePresentation.ts`
- Create: `app/src/lib/presentation/pagePresentation.test.ts` or equivalent lightweight verification file if the repo has no formal unit-test setup
- Create: `docs/superpowers/plans/review-set.md` only if a reusable review checklist becomes necessary during implementation

### Reference files to inspect during implementation

- Reference: `app/src/lib/markdownPage.ts`
- Reference: `app/src/lib/fileLink.ts`
- Reference: `app/src/lib/constants.ts`
- Reference: `app/src/routes/+page.server.ts`
- Reference: `app/src/routes/content/search/+page.server.ts`
- Reference: `app/src/routes/content/timeline/+page.server.ts`

## Implementation Notes

- Keep all implementation-facing changes in English.
- Do not edit lore/content markdown as part of this plan.
- Stay desktop-first for this cycle.
- Use the fixed desktop review set from the spec rather than validating on one article only.
- Prefer minimal layout-model additions over broad architectural churn.
- Use TDD where practical for page classification and presentation-rule helpers.

### Fixed Desktop Review Set

Use these exact routes for manual validation throughout the implementation:

- Hub/root: `/content/index.md`
- Section index: `/content/Volk_/index.md`
- Long-form article A: `/content/Volk_/Varnops/index.md`
- Long-form article B: `/content/Allgemein/Magie/index.md`
- Media page: `/content/Volk_/Varnops/images`
- Search: `/content/search?q=Varnops`
- Timeline: `/content/timeline`
- Convert: `/convert`

### Single Source of Truth for Presentation State

`app/src/lib/presentation/pagePresentation.ts` is the single source of truth for presentation state.

It should expose:
- one shared helper for content-route classification and layout flags
- one shared helper for standalone utility-route presentation with a hard-coded `utility` page class plus per-view layout options

Do not duplicate presentation logic independently inside `search`, `timeline`, or `convert`.
Those routes may supply their own utility-view identifier, but they should consume the same presentation module.

## Task 1: Bootstrap the isolated implementation workspace

**Files:**
- Modify: `app/package.json` only if a missing script blocks verification
- Reference: `app/yarn.lock`

- [ ] **Step 1: Check dependency state in the worktree**

Run: `Test-Path app/node_modules`
Expected: confirm whether the isolated worktree already has dependencies available

- [ ] **Step 2: If dependencies are missing, install app dependencies**

Run: `yarn install`
Expected: `node_modules` created under `app/`

- [ ] **Step 3: Run the baseline type-check**

Run: `yarn check`
Expected: baseline pass, or a captured list of pre-existing failures

- [ ] **Step 4: Run the baseline lint pass**

Run: `yarn lint`
Expected: baseline pass, or a captured list of pre-existing failures

- [ ] **Step 5: Record baseline status in the implementation notes**

Update the active working notes or commit message context with whether checks were green before UI work started.

- [ ] **Step 6: Commit bootstrap-only adjustments if any were required**

```bash
git add app/package.json app/yarn.lock
git commit -m "chore: prepare worktree verification baseline"
```

## Task 2: Define the desktop review set and page taxonomy checkpoints

**Files:**
- Modify: `docs/superpowers/plans/2026-03-29-wiki-ui-refinement-implementation-plan.md`
- Optional Create: `docs/superpowers/plans/review-set.md`

- [ ] **Step 1: Copy the fixed desktop review set into active working notes**

Use the exact routes defined in the implementation notes:
- `/content/index.md`
- `/content/Volk_/index.md`
- `/content/Volk_/Varnops/index.md`
- `/content/Allgemein/Magie/index.md`
- `/content/Volk_/Varnops/images`
- `/content/search?q=Varnops`
- `/content/timeline`
- `/convert`

- [ ] **Step 2: Associate each fixed route with its validation purpose**

- `/content/index.md`: validates hub framing
- `/content/Volk_/index.md`: validates navigation-first index behavior
- `/content/Volk_/Varnops/index.md`: validates prose-first article layout
- `/content/Allgemein/Magie/index.md`: validates heading rhythm and denser structural variation
- `/content/Volk_/Varnops/images`: validates media-page layout behavior and reduced text-first chrome assumptions
- `/content/search?q=Varnops`: validates utility search framing
- `/content/timeline`: validates utility visualization framing
- `/convert`: validates converter tool-surface framing

- [ ] **Step 3: Commit the review-set definition if a separate file was created**

```bash
git add docs/superpowers/plans/2026-03-29-wiki-ui-refinement-implementation-plan.md docs/superpowers/plans/review-set.md
git commit -m "docs: define wiki UI review set"
```

## Task 3: Add the presentation model

**Files:**
- Create: `app/src/lib/presentation/pagePresentation.ts`
- Create: `app/src/lib/presentation/pagePresentation.test.ts` or lightweight verification script
- Modify: `app/src/routes/content/[...page]/+page.server.ts`

- [ ] **Step 1: Write a failing test or verification harness for page classification**

Cover at least:
- hub/root page
- index page
- article page
- media-oriented page
- utility page

Use concrete starter signals so classification does not drift during implementation:
- `hub`: top-level root entry such as `/content` or equivalent root wiki landing view
- `index`: directory/branch overview pages whose primary role is navigation into child content
- `article`: standard prose-first markdown pages
- `media`: image/gallery-dominant pages, including generated gallery index pages
- `utility`: non-markdown workflow pages such as `/content/search`, `/content/timeline`, and `/convert`

- [ ] **Step 2: Run the test to verify it fails**

Run the narrowest command available, for example:
`yarn check`
or a targeted test command if a test runner is introduced.

Expected: failure because the presentation helper does not exist yet

- [ ] **Step 3: Create `pagePresentation.ts` with a minimal typed API**

Start with a focused shape such as:

```ts
export type PageClass = "hub" | "index" | "article" | "media" | "utility";

export interface PagePresentation {
  pageClass: PageClass;
  showToc: boolean;
  showContextRail: boolean;
  contentWidth: "standard" | "wide";
  emphasizeOverview: boolean;
}
```

Also add a shared utility-route entry point, for example:

```ts
export type UtilityView = "search" | "timeline" | "convert";

export function getUtilityPagePresentation(view: UtilityView): PagePresentation {
  // returns pageClass: "utility" plus view-specific layout flags
}
```

- [ ] **Step 4: Implement minimal page classification heuristics**

Base them on route/page context only.
Do not modify markdown semantics.

- [ ] **Step 5: Feed presentation data out of `[...page]/+page.server.ts`**

Return `presentation` alongside `page`.

- [ ] **Step 6: Document that utility routes must consume the same presentation module**

Do not create independent per-route classification logic in `search`, `timeline`, or `convert`.

- [ ] **Step 7: Run the narrow verification again**

Expected: helper compiles and classification logic is exercised

- [ ] **Step 8: Commit the presentation model**

```bash
git add app/src/lib/presentation/pagePresentation.ts app/src/lib/presentation/pagePresentation.test.ts app/src/routes/content/[...page]/+page.server.ts
git commit -m "feat: add page presentation model"
```

## Task 4: Clean up the global shell and establish hierarchy-friendly layout primitives

**Files:**
- Modify: `app/src/routes/+layout.svelte`
- Modify: `app/src/lib/components/Navbar.svelte`
- Modify: `app/src/lib/components/MidPanel.svelte`

- [ ] **Step 1: Remove invalid nested body structure in `+layout.svelte`**

Keep the shell semantically valid and preserve current route behavior.

- [ ] **Step 2: Normalize shell-level spacing and container behavior**

Make top-level spacing intentional rather than emergent from nested widths.

- [ ] **Step 3: Refine navbar spacing and desktop framing**

Reduce visual heaviness without redesigning the nav model.

- [ ] **Step 4: Adjust `MidPanel.svelte` to support main-column prioritization**

Keep it reusable for article and utility contexts.

- [ ] **Step 5: Run `yarn check`**

Expected: shell changes compile cleanly

- [ ] **Step 6: Run `yarn lint`**

Expected: no new lint errors from shell cleanup

- [ ] **Step 7: Commit shell cleanup**

```bash
git add app/src/routes/+layout.svelte app/src/lib/components/Navbar.svelte app/src/lib/components/MidPanel.svelte
git commit -m "refactor: clean up global shell layout"
```

## Task 5: Refactor the article route to consume the presentation model

**Files:**
- Modify: `app/src/routes/content/[...page]/+page.svelte`
- Modify: `app/src/lib/components/Sidebar.svelte`

- [ ] **Step 1: Write the failing route-level behavior change**

Define what should differ by page class:
- article keeps assistive rails
- hub/index may rebalance rails
- media may widen main content

- [ ] **Step 2: Run the narrow verification**

Use `yarn check` unless a more targeted route test exists.

- [ ] **Step 3: Replace fixed `15/70/15` assumptions with presentation-driven layout**

Keep the three-region concept, but stop treating the proportions as the product.

- [ ] **Step 4: Make sidebar presentation quieter by default**

Reduce visual competition with the article surface.

- [ ] **Step 5: Verify the review pages manually in the browser**

At minimum:
- home
- one index page
- one article page

- [ ] **Step 6: Commit the route composition refactor**

```bash
git add app/src/routes/content/[...page]/+page.svelte app/src/lib/components/Sidebar.svelte
git commit -m "feat: make content layout presentation-driven"
```

## Task 6: Improve article-body composition and typography

**Files:**
- Modify: `app/src/lib/components/ContentCard.svelte`

- [ ] **Step 1: Write down the article-body issues to fix before editing**

Include:
- title hierarchy
- overview treatment
- paragraph rhythm
- figure integration
- table/list/callout presentation

- [ ] **Step 2: Refine title, overview, and body spacing**

Make the article card read as a deliberate surface instead of a generic panel.

- [ ] **Step 3: Refine heading hierarchy and inline-link readability**

Explicitly improve heading scale, heading spacing rhythm, and in-body link treatment so long-form articles are easier to scan.

- [ ] **Step 4: Reduce rigid image assumptions**

Keep current figure behavior, but avoid overfitting it to one article shape.

- [ ] **Step 5: Improve note/comment/table/list styling without changing markdown semantics**

Keep authoring behavior stable.

- [ ] **Step 6: Run `yarn check`**

Expected: style/script changes compile cleanly

- [ ] **Step 7: Manually verify both dense prose and image-heavy article pages**

Use two different article types from the review set.

- [ ] **Step 8: Commit article-body improvements**

```bash
git add app/src/lib/components/ContentCard.svelte
git commit -m "feat: refine article reading surface"
```

## Task 7: Differentiate support navigation systems

**Files:**
- Modify: `app/src/lib/components/ContentTree.svelte`
- Modify: `app/src/lib/components/ReferenceList.svelte`
- Modify: `app/src/lib/components/Breadcrumbs.svelte`

- [ ] **Step 1: Define the intended role of each support navigation block**

TOC:
section orientation

Breadcrumbs:
location context

Reference lists:
discovery and related navigation

- [ ] **Step 2: Reduce TOC dominance**

Keep it useful without making it compete with the article title and body.

- [ ] **Step 3: Refine breadcrumb density and readability**

Preserve location context while reducing noise.

- [ ] **Step 4: Make reference-list cards more clearly differentiated by purpose**

Use layout and visual hierarchy, not content rewrites.

- [ ] **Step 5: Manually verify on one index page and one article page**

Expected: support navigation is clearer and more subordinate

- [ ] **Step 6: Commit support-navigation refinements**

```bash
git add app/src/lib/components/ContentTree.svelte app/src/lib/components/ReferenceList.svelte app/src/lib/components/Breadcrumbs.svelte
git commit -m "feat: refine support navigation hierarchy"
```

## Task 8: Apply page-type-aware presentation to utility routes

**Files:**
- Modify: `app/src/routes/content/search/+page.svelte`
- Modify: `app/src/routes/content/timeline/+page.svelte`
- Modify: `app/src/routes/convert/+page.svelte`

- [ ] **Step 1: Inspect current utility-route layout constraints**

Confirm where search, timeline, and converter currently inherit article assumptions.

- [ ] **Step 2: Define their utility-page presentation needs**

Search should prioritize results scanning.
Timeline should prioritize visualization and controls.
Converter should prioritize the working tool surface and its inputs/outputs.

- [ ] **Step 3: Adjust each route so it aligns with the shared shell without pretending to be an article page**

Keep consistency, drop inappropriate article framing, and source presentation state from `app/src/lib/presentation/pagePresentation.ts`.

- [ ] **Step 4: Run `yarn check`**

Expected: utility views compile cleanly

- [ ] **Step 5: Manually verify all utility routes**

Expected: utility pages feel coherent with the site but not constrained by article composition

- [ ] **Step 6: Commit utility-page adjustments**

```bash
git add app/src/routes/content/search/+page.svelte app/src/routes/content/timeline/+page.svelte app/src/routes/convert/+page.svelte
git commit -m "feat: align utility pages with presentation model"
```

## Task 9: Consolidate the visual system

**Files:**
- Modify: `app/src/lib/components/Card.svelte` only if needed
- Modify: `app/src/lib/components/Sidebar.svelte`
- Modify: `app/src/lib/components/ContentCard.svelte`
- Modify: `app/src/lib/components/MidPanel.svelte`
- Modify: `app/src/routes/+layout.svelte`

- [ ] **Step 1: Inventory repeated UI tokens already present**

Identify:
- background layers
- borders
- shadows
- radii
- spacing scales

- [ ] **Step 2: Standardize only the repeated patterns actually used**

Do not introduce a speculative design system.

- [ ] **Step 3: Remove obvious one-off visual behavior that survived earlier tasks**

Focus on repeated cards, rails, and content containers.

- [ ] **Step 4: Run `yarn check`**

Expected: consolidated styles compile cleanly

- [ ] **Step 5: Run `yarn lint`**

Expected: no new lint errors

- [ ] **Step 6: Review the full desktop sample set**

Use the exact review pages chosen in Task 2.

- [ ] **Step 7: Commit visual-system consolidation**

```bash
git add app/src/lib/components/Card.svelte app/src/lib/components/Sidebar.svelte app/src/lib/components/ContentCard.svelte app/src/lib/components/MidPanel.svelte app/src/routes/+layout.svelte
git commit -m "style: consolidate wiki UI visual system"
```

## Task 10: Final verification and implementation handoff

**Files:**
- Modify: `docs/superpowers/plans/2026-03-29-wiki-ui-refinement-implementation-plan.md` only if status notes are added

- [ ] **Step 1: Run the final type-check**

Run: `yarn check`
Expected: pass

- [ ] **Step 2: Run the final lint pass**

Run: `yarn lint`
Expected: pass

- [ ] **Step 3: Re-open the full desktop review set**

Confirm:
- hierarchy
- page-type differentiation
- article readability
- support-navigation clarity
- utility-page coherence

- [ ] **Step 4: Compare final behavior against the design spec**

Check the implementation against:
`docs/superpowers/specs/2026-03-29-wiki-ui-refinement-design.md`

- [ ] **Step 5: Write a short implementation summary**

Include:
- what changed
- what remains intentionally deferred
- any follow-up risks or cleanup items

- [ ] **Step 6: Commit final verification notes if needed**

```bash
git add docs/superpowers/plans/2026-03-29-wiki-ui-refinement-implementation-plan.md
git commit -m "docs: finalize wiki UI implementation plan notes"
```

## Verification Commands

Run from: `app/`

- `yarn install`
- `yarn check`
- `yarn lint`
- `yarn dev --host 127.0.0.1 --port 4173`

## Review Checklist

- Main reading surface dominates on article pages.
- Hub and index pages no longer feel identical to long-form article pages.
- Support rails assist rather than compete.
- Search and timeline feel like utility views, not malformed article pages.
- The result feels like a refinement of the current wiki, not a redesign.
- No lore/content files were changed as part of the UI work.
