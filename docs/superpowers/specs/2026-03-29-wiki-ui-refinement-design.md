# Wiki UI Refinement Design

## Metadata

- Date: 2026-03-29
- Branch: `ui/wiki-ui-revision`
- Scope: Implementation-facing desktop UI refinement
- Status: Draft approved in conversation, written for review

## Context

This repository contains a markdown-driven worldbuilding wiki rendered through a SvelteKit application.
The current system is functionally solid, but the presentation layer is weighted too evenly across content, navigation, and contextual rails.
The result is usable, especially on desktop, but it feels more like a technically correct renderer than an intentionally composed reading interface.

This design defines a conservative refinement cycle.
It preserves the current information architecture, markdown pipeline, and route model.
It does not propose a product redesign or a content/lore rewrite.

## Goals

- Improve desktop reading hierarchy across article pages.
- Make the UI more intentional and visually coherent without replacing the current structure.
- Introduce page-type-aware presentation rules so different page classes are not forced into the same visual treatment.
- Improve readability, context navigation, and consistency across core UI components.
- Keep implementation work isolated from ongoing lore/content changes.

## Non-Goals

- Mobile-first redesign.
- Content rewriting or lore restructuring.
- Changing canon-facing terminology or article semantics.
- Replacing the markdown-driven article architecture.
- Turning the site into a fundamentally different navigation model.

## Product Direction

This revision cycle follows a conservative refinement strategy.
The existing wiki shell, article routing, and contextual navigation model remain in place.
The work should strengthen hierarchy, spacing, readability, and consistency rather than inventing a new product language from scratch.

Core principle:
primary reading surface first, secondary navigation second, contextual discovery third.

## Page Taxonomy

The presentation layer should stop treating every page as the same visual object.
The content pipeline can remain unified, but the UI should recognize a small page taxonomy with different default behavior.

### Page Classes

- `hub`: top-level entry pages that orient the user and route into major branches
- `index`: branch overview pages that primarily organize navigation
- `article`: standard long-form reading pages
- `media`: pages where images or gallery-like content are primary
- `utility`: search, timeline, converter, and other non-article interfaces

### Presentation Defaults by Page Class

#### `hub`

- Stronger overview framing
- Lower emphasis on side rails
- Clearer promotion of major entry paths

#### `index`

- Navigation-first presentation
- Stronger sibling/child discovery cues
- Less article-like reading emphasis

#### `article`

- Strongest main-column priority
- Best typographic reading flow
- Context systems subordinate to content

#### `media`

- More visual breathing room
- Less interference from text-first layout assumptions

#### `utility`

- Allowed to diverge from article framing where necessary
- Consistency should come from shared shell/components, not forced article styling

## Structural Design

The current three-part composition model should remain:

- global shell
- primary content region
- secondary context regions

What changes is the weighting.
These regions should no longer feel equally prominent by default.

### Structural Rules

- The main content column is always the dominant region on desktop article pages.
- Side rails are assistive and visually quieter.
- Page-class rules may suppress, reduce, or rebalance secondary regions where appropriate.
- Layout decisions should be driven by explicit presentation rules, not by fixed-width proportions alone.

### Presentation Model

Introduce a small presentation model per page.
It does not need to be complex, but it should centralize decisions that are currently implicit.

Suggested responsibilities:

- determine page class
- decide whether left TOC is shown
- decide whether right context rail is shown
- determine content width mode
- determine overview prominence
- provide layout flags to the route-level page component

This gives the UI a stable decision layer and reduces scattered component-specific exceptions.

## Component Impact Map

### Global Shell

[`app/src/routes/+layout.svelte`](D:/My_Files/Programming/serpinit-wiki/.worktrees/wiki-ui-revision/app/src/routes/+layout.svelte)

- Own global shell concerns only
- Clean up invalid markup structure
- Own global navigation framing, top-level spacing, and shared chrome

### Page Composition

[`app/src/routes/content/[...page]/+page.svelte`](D:/My_Files/Programming/serpinit-wiki/.worktrees/wiki-ui-revision/app/src/routes/content/[...page]/+page.svelte)

- Compose typed regions from page presentation data
- Stop hard-coding a one-size-fits-all three-column balance
- Apply page-class-aware layout choices

### Content Surface

[`app/src/lib/components/ContentCard.svelte`](D:/My_Files/Programming/serpinit-wiki/.worktrees/wiki-ui-revision/app/src/lib/components/ContentCard.svelte)

- Focus on article-body presentation
- Improve title, overview, figure, table, and block treatment
- Reduce accidental global styling behavior

### Support Regions

[`app/src/lib/components/Sidebar.svelte`](D:/My_Files/Programming/serpinit-wiki/.worktrees/wiki-ui-revision/app/src/lib/components/Sidebar.svelte)
[`app/src/lib/components/ContentTree.svelte`](D:/My_Files/Programming/serpinit-wiki/.worktrees/wiki-ui-revision/app/src/lib/components/ContentTree.svelte)
[`app/src/lib/components/ReferenceList.svelte`](D:/My_Files/Programming/serpinit-wiki/.worktrees/wiki-ui-revision/app/src/lib/components/ReferenceList.svelte)
[`app/src/lib/components/Breadcrumbs.svelte`](D:/My_Files/Programming/serpinit-wiki/.worktrees/wiki-ui-revision/app/src/lib/components/Breadcrumbs.svelte)
[`app/src/lib/components/Navbar.svelte`](D:/My_Files/Programming/serpinit-wiki/.worktrees/wiki-ui-revision/app/src/lib/components/Navbar.svelte)
[`app/src/lib/components/MidPanel.svelte`](D:/My_Files/Programming/serpinit-wiki/.worktrees/wiki-ui-revision/app/src/lib/components/MidPanel.svelte)

- Rebalance prominence
- Standardize supporting UI behavior
- Make context systems clearer and less visually noisy

### Data/Presentation Boundary

Potential home:

- route load data
- dedicated presentation helpers under `app/src/lib`

This layer should stay implementation-facing and avoid contaminating markdown/content logic with display-specific heuristics.

## Revision Plan

## Revision 1: Desktop Hierarchy

### Objective

Make article pages feel reading-first while preserving the current navigation model.

### Work

- Rebalance column prominence
- Reduce visual weight of side rails
- Improve top-level spacing between navbar, breadcrumbs, title, overview, and article body
- Reduce dependence on brittle hard-coded layout ratios
- Clean up structurally invalid shell markup

### Acceptance Criteria

- The main content region is the strongest visual focus on standard article pages.
- Left and right support regions are visibly subordinate.
- Spacing feels intentional rather than mechanically distributed.
- No major article page depends on fragile fixed-width balance to remain usable on desktop.

## Revision 2: Page-Type Presentation Rules

### Objective

Apply different presentation defaults to hub, index, article, media, and utility pages.

### Work

- Add page-class identification logic
- Introduce page-class-aware layout flags
- Differentiate hub/index pages from article pages
- Allow utility pages to diverge from article framing when necessary

### Acceptance Criteria

- Root and branch entry pages no longer feel identical to long-form articles.
- Index pages present navigation more clearly than prose.
- Media-oriented pages are not constrained by text-first assumptions.
- Search and timeline are allowed to diverge without looking disconnected from the site.

## Revision 3: Typography and Editorial Readability

### Objective

Improve long-form desktop readability across varied article structures.

### Work

- Refine heading scale and spacing rhythm
- Improve paragraph spacing and reading width
- Improve treatment of figures, captions, lists, tables, and comment/note blocks
- Improve in-body link readability and consistency

### Acceptance Criteria

- Long-form articles are easier to scan and easier to read deeply.
- Dense pages do not feel visually collapsed.
- Structural elements read as intentional editorial choices.

## Revision 4: Navigation and Context Clarity

### Objective

Make orientation and contextual discovery more predictable and less noisy.

### Work

- Refine breadcrumb treatment
- Reduce TOC visual dominance
- Improve right-rail block differentiation and ordering
- Clarify "where am I?" and "what next?" navigation patterns

### Acceptance Criteria

- Breadcrumbs assist orientation without dominating the page.
- TOC remains useful without competing with the article body.
- Context blocks are easier to understand by purpose.

## Revision 5: Visual System Consolidation

### Objective

Turn the current working interface into a more coherent desktop visual system.

### Work

- Standardize card, panel, and container behavior
- Standardize spacing, borders, radii, shadows, and backgrounds
- Unify title, support-panel, and embedded block presentation
- Reduce one-off styling behavior

### Acceptance Criteria

- Repeated UI patterns feel related and intentional.
- The site looks like one product instead of a set of independently working components.
- The result still reads as a refinement of the current wiki, not a redesign.

## Review Set

Every revision should be reviewed against a representative desktop sample set, not a single article.

Required review set:

- root/home page
- at least one section index page
- at least two long-form articles with different structure density
- at least one image-heavy or gallery-oriented page
- search page
- timeline page

This prevents overfitting the implementation to a single article shape.

## Engineering Constraints

- Keep implementation-oriented work in English.
- Preserve lore/content semantics.
- Avoid mixing implementation changes with unrelated content edits.
- Keep the worktree focused on technical/UI changes.
- Prefer reusable presentation rules over page-specific patches.

## Verification Expectations

Before implementation is considered complete for any revision:

- the affected page classes must be reviewed against the fixed desktop sample set
- the relevant Svelte/UI checks must be run if dependencies are available in the worktree
- visual regressions should be assessed against current output, not just code inspection

## Open Implementation Questions

- What is the cleanest source of truth for page classification?
- Should page-class logic live at route-load level or in a dedicated presentation helper layer?
- Which contextual blocks should be globally reusable versus page-class-specific?
- How much of the current proportional layout can remain after hierarchy rebalancing?

## Next Step

Write an implementation plan that breaks the revision cycle into executable phases, component touch points, verification commands, and review checkpoints.
