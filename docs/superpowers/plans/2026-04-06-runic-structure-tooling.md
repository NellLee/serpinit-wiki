# Runic Structure Tooling Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first vertical slice of the runic structure tooling: canonical JSON documents plus schema validation, an initial runic library, and a SvelteKit inspector route that renders canonical 2D projections as SVG.

**Architecture:** Keep the canonical runic model outside the app under `runes/` as JSON plus JSON Schema. Add a small app-side loading and validation pipeline that reads the authoritative index, resolves document ids, validates documents, derives renderer-specific view models, and renders a development-only inspector route for primitives, structures, and complete runes.

**Tech Stack:** SvelteKit, TypeScript, JSON Schema, JSON runic documents, Vitest, existing Yarn app workflow

---

### Task 1: Set Up The Canonical Runic Library Skeleton

**Files:**
- Create: `runes/schema/rune-document.schema.json`
- Create: `runes/index/library.json`
- Create: `runes/primitives/leitbahn.json`
- Create: `runes/primitives/drossel.json`
- Create: `runes/primitives/kammer.json`
- Create: `runes/primitives/gabel.json`
- Create: `runes/primitives/anker.json`
- Create: `runes/primitives/mantel.json`
- Create: `runes/primitives/sperre.json`
- Create: `runes/structures/gebundene-leitbahn.json`
- Create: `runes/structures/geschuetzter-auslass.json`
- Create: `runes/runes/lokaler-auslass.json`
- Create: `runes/runes/substrat-gebundener-auslass.json`

- [ ] **Step 1: Create the canonical directory layout**

Create the `runes/schema`, `runes/index`, `runes/primitives`, `runes/structures`, and `runes/runes` directories exactly as specified.

- [ ] **Step 2: Write the first shared JSON Schema**

Define the shared top-level contract for `primitive`, `structure`, and `rune` documents with required fields:
- `id`
- `name`
- `kind`
- `version`
- `description`
- `semantics`
- `topology`
- `geometry`
- `projection2d`

Also define the initial enumerations needed for:
- ontology classes
- primitive kinds
- sector names
- sector axis modes

The schema must not stop at shared top-level fields.
It must also encode the first-slice kind-specific requirements for:
- `primitive`
- `structure`
- `rune`

That includes:
- what each kind must provide locally
- when `instances` are allowed
- when full assembled structure is required
- the minimum contract for `projection2d`
- the minimum contract for the orientation frame that preserves the distinction between vendotic structure and physical embedding

- [ ] **Step 3: Create the authoritative library index**

Create `runes/index/library.json` as the single authoritative discovery source for the first slice.
Include grouped entries for primitives, structures, and runes with stable ids and file paths.

- [ ] **Step 4: Add the initial primitive documents**

Create one canonical JSON file for each primitive:
- `leitbahn`
- `drossel`
- `kammer`
- `gabel`
- `anker`
- `mantel`
- `sperre`

Each file should be schema-valid and include minimal but real semantics, topology, geometry, and `projection2d` definitions.

- [ ] **Step 5: Add the initial composed structures**

Create two reusable structures that compose or refine the primitives:
- `gebundene-leitbahn`
- `geschuetzter-auslass`

Use document ids rather than file paths for cross-document references.

- [ ] **Step 6: Add two complete example runes**

Create:
- `lokaler-auslass`
- `substrat-gebundener-auslass`

Each rune must reuse primitives and/or structures rather than redefining every part inline.

- [ ] **Step 7: Commit the canonical library pass**

```bash
git add runes
git commit -m "feat: add canonical runic library scaffold"
```

### Task 2: Add App-Side Runic Contracts, Loading, And Validation

**Files:**
- Create: `app/src/lib/runes/contracts.ts`
- Create: `app/src/lib/runes/library.ts`
- Create: `app/src/lib/runes/projection.ts`
- Create: `app/src/lib/runes/library.test.ts`
- Modify: `app/package.json`
- Modify: `app/yarn.lock`

- [ ] **Step 1: Add the schema validation dependency**

Add the smallest practical JSON Schema validator dependency for Node-side loading.
Prefer `ajv` unless an equally small existing dependency already covers the need cleanly.

- [ ] **Step 2: Define app-local reader contracts**

Create `app/src/lib/runes/contracts.ts` with derived TypeScript types that mirror the canonical JSON shape without becoming the source of truth.
Include contracts for:
- library index entries
- primitive documents
- structure documents
- rune documents
- `projection2d`
- sector names and axis modes

- [ ] **Step 3: Implement authoritative library loading**

Create `app/src/lib/runes/library.ts` to:
- load `runes/index/library.json`
- resolve document ids to canonical files
- parse JSON documents
- validate them against `runes/schema/rune-document.schema.json`
- expose grouped library accessors for the inspector route

- [ ] **Step 4: Implement projection derivation**

Create `app/src/lib/runes/projection.ts` to transform canonical `projection2d` data into renderer-ready view models.
This file should handle:
- layer normalization
- sector lookup
- radial placement derivation
- relation path-mode derivation
- orientation-frame derivation for physical embedding metadata
- explicit preservation of the boundary between vendotic structure and physical orientation

It must not emit raw SVG strings.

- [ ] **Step 5: Write focused validation and loading tests**

Create `app/src/lib/runes/library.test.ts` covering:
- successful loading through the authoritative index
- schema validation of the initial library
- id-based document resolution
- rejection of malformed or unsupported documents

- [ ] **Step 6: Run the app test and check commands**

Run from `app/`:

```bash
yarn test
yarn check
```

Expected:
- new runic tests pass
- no Svelte or TypeScript regressions are introduced

- [ ] **Step 7: Commit the loading and validation layer**

```bash
git add app/package.json app/yarn.lock app/src/lib/runes
git commit -m "feat: add runic loading and validation pipeline"
```

### Task 3: Build The SVG Rendering Components

**Files:**
- Create: `app/src/lib/components/runes/RuneCanvas.svelte`
- Create: `app/src/lib/components/runes/RuneLegend.svelte`
- Create: `app/src/lib/components/runes/RuneStructurePanel.svelte`
- Create: `app/src/lib/components/runes/RuneProjectionPanel.svelte`
- Create: `app/src/lib/components/runes/RuneLibraryPanel.svelte`
- Create: `app/src/lib/components/runes/runePresentation.ts`
- Create: `app/src/lib/components/runes/runePresentation.test.ts`

- [ ] **Step 1: Define a presentation adapter for SVG rendering**

Create `runePresentation.ts` to convert projection-ready view models into a stable presentation model for Svelte components.
This should include:
- layer display order
- sector labels
- canonical shape-family mapping
- relation line descriptors
- legend metadata

- [ ] **Step 2: Build the SVG canvas component**

Create `RuneCanvas.svelte` to render:
- the runic core
- concentric layers
- eight named sectors
- projected primitive shapes
- projected relation paths

Use ordinary Svelte SVG rendering first.
Do not introduce D3 unless the layout proves awkward without it.

- [ ] **Step 3: Build the supporting inspector panels**

Create separate components for:
- library browsing
- structure data display
- projection data display
- legend display

Keep each panel focused and avoid one oversized inspector component.

- [ ] **Step 4: Test the presentation adapter**

Create `runePresentation.test.ts` covering:
- sector ordering
- opposition mapping visibility
- layer rendering order
- shape-family mapping for the initial primitive set

- [ ] **Step 5: Run verification for the rendering slice**

Run from `app/`:

```bash
yarn test
yarn check
```

Expected:
- rendering adapter tests pass
- Svelte components type-check cleanly

- [ ] **Step 6: Commit the rendering components**

```bash
git add app/src/lib/components/runes
git commit -m "feat: add runic svg presentation components"
```

### Task 4: Add The Development Inspector Route

**Files:**
- Create: `app/src/routes/dev/runes/+page.server.ts`
- Create: `app/src/routes/dev/runes/+page.svelte`
- Modify: `app/src/routes/+layout.svelte`

- [ ] **Step 1: Add the server route loader**

Create `+page.server.ts` to:
- load the authoritative runic library through `library.ts`
- choose a default selection
- pass grouped library data and resolved documents to the page

- [ ] **Step 2: Build the development inspector page**

Create `+page.svelte` to compose:
- `RuneLibraryPanel`
- `RuneCanvas`
- `RuneStructurePanel`
- `RuneProjectionPanel`
- `RuneLegend`

Support switching between at least the initial primitives, structures, and full runes.

- [ ] **Step 3: Expose a development entry point**

Add a temporary development navigation link in `app/src/routes/+layout.svelte` only if that is the smallest clean way to reach the route during the first slice.
If adding a navbar entry feels too noisy for normal browsing, keep the route undiscoverable except by direct URL and document that choice in the final report.

- [ ] **Step 4: Run local route verification**

Run from `app/`:

```bash
yarn check
yarn build
```

Expected:
- the dev route compiles server-side
- the app build succeeds with the new inspector included

- [ ] **Step 5: Commit the inspector route**

```bash
git add app/src/routes/dev/runes app/src/routes/+layout.svelte
git commit -m "feat: add runic inspector route"
```

### Task 5: Tighten The Authoring Workflow And Library Readability

**Files:**
- Create: `runes/README.md`
- Modify: `runes/index/library.json`
- Modify: `docs/superpowers/specs/2026-04-06-runic-structure-tooling-design.md` only if implementation reveals a necessary spec clarification

- [ ] **Step 1: Document the authoring workflow inside the runes directory**

Create `runes/README.md` describing:
- directory purpose
- one-definition-per-file rule
- index authority
- id-based references
- the inspect-and-refine workflow

- [ ] **Step 2: Make sure the index stays readable and intentional**

Review `runes/index/library.json` for stable ordering and grouped discoverability.
Do not let it become an unsorted dump.

- [ ] **Step 3: Apply only implementation-proven spec clarifications**

If implementation forces a genuine clarification to the approved spec, update the spec surgically.
Do not broaden scope.

- [ ] **Step 4: Commit the workflow documentation**

```bash
git add runes/README.md runes/index/library.json docs/superpowers/specs/2026-04-06-runic-structure-tooling-design.md
git commit -m "docs: document runic authoring workflow"
```

### Task 6: Final Verification And Handoff

**Files:**
- Review: `runes/**/*.json`
- Review: `app/src/lib/runes/*`
- Review: `app/src/lib/components/runes/*`
- Review: `app/src/routes/dev/runes/*`

- [ ] **Step 1: Run the full verification set**

Run from `app/`:

```bash
yarn test
yarn check
yarn build
```

Expected:
- canonical library loading tests pass
- presentation tests pass
- Svelte check passes
- production build passes

- [ ] **Step 2: Manually verify the inspector route**

Run:

```bash
yarn dev
```

Open `/dev/runes` and verify:
- primitives, structures, and runes are listed
- selection changes the SVG canvas and side panels
- sector naming and radial layout remain readable
- the two complete example runes render distinctly
- the inspector shows canonical structure data separately from `projection2d` data rather than collapsing them into one undifferentiated view

- [ ] **Step 3: Capture residual risks explicitly**

Document any remaining limitations, especially:
- unresolved questions in the first schema cut
- places where `projection2d` still feels underspecified
- temporary simplifications in rendering or shape-family mapping

- [ ] **Step 4: Commit the integrated slice**

```bash
git add -A
git commit -m "feat: add first runic structure tooling slice"
```
