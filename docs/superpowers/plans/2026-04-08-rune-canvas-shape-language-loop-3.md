# Rune Canvas Shape Language Loop 3 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the control-oriented rune shape families in `/dev/runes` visibly distinct by geometry so the canvas communicates more of the rune's semantic body structure before labels and side text.

**Architecture:** Keep the existing rune document model and projection framework intact while moving the shared band-shape generation in `runePresentation.ts` to family-aware builders for the priority control families. Preserve the stronger relation-path reading from loop 2, use focused presentation and E2E tests to lock in the new shape differences, and close with a manual `ui-output-review` pass on `/dev/runes`.

**Tech Stack:** SvelteKit, Svelte SVG rendering, TypeScript, existing rune presentation pipeline, Vitest, Playwright, repo-local `ui-output-review` skill

---

### Task 1: Establish The Shape-Language Baseline In Tests

**Files:**
- Modify: `app/src/lib/components/runes/runePresentation.test.ts`
- Modify: `app/e2e/rune-inspector.spec.js`

- [ ] **Step 1: Extend the presentation test with shape-family geometry expectations**

Update `app/src/lib/components/runes/runePresentation.test.ts` so it asserts that the priority control families no longer all collapse to the same plain band behavior.

Add at least one test that loads `rune.substrat-gebundener-auslass` and checks that:
- `schwelle`
- `pruefkammer`
- `weiche`
- `rueckfuehrung`
- `siegelpfad`

each produce a distinct path signature or distinguishing path property.

The test should inspect concrete SVG path characteristics such as:
- whether a shape includes extra contour turns
- whether it includes inner closure or cutout behavior
- whether it is asymmetrical compared with the default band
- whether two priority families no longer share the same path string pattern

- [ ] **Step 2: Add a rendered-output guard for complex rune shape classes**

Update `app/e2e/rune-inspector.spec.js` with one focused assertion on `/dev/runes?id=rune.substrat-gebundener-auslass` that proves the complex rune still renders the expected priority shape classes after the geometry refactor.

The browser check should verify at least:
- the complex rune still renders all five priority shape-family classes
- the canvas still renders relation paths alongside the differentiated shape layer

Keep this test focused on rendered output rather than implementation internals.

- [ ] **Step 3: Run the focused tests to verify the new assertions fail**

Run from `app/`:

```bash
node .\node_modules\vitest\vitest.mjs run src/lib/components/runes/runePresentation.test.ts
node .\node_modules\playwright\cli.js test e2e/rune-inspector.spec.js
```

Expected:
- the new presentation assertions fail because the current shapes still use one shared band body
- the E2E guard either fails directly or demonstrates that rendered differentiation is still too weak to satisfy the new expectations

### Task 2: Introduce Family-Aware Shape Builders In The Presentation Layer

**Files:**
- Modify: `app/src/lib/components/runes/runePresentation.ts`
- Modify: `app/src/lib/components/runes/runePresentation.test.ts`

- [ ] **Step 1: Isolate the current generic band builder**

Refactor `app/src/lib/components/runes/runePresentation.ts` so the current `createBandPath(...)` logic becomes the neutral fallback builder rather than the only path generator.

Do not change behavior yet beyond the minimum structure needed to dispatch by `shapeFamily`.

- [ ] **Step 2: Add dedicated path builders for the priority control families**

Implement family-aware shape builders for:
- `schwelle`
- `pruefkammer`
- `weiche`
- `rueckfuehrung`
- `siegelpfad`

Use the spec-guided shape logic:
- `schwelle`: constricting or compressive silhouette
- `pruefkammer`: chambered body with inner differentiated structure
- `weiche`: asymmetrical or visibly diverted body
- `rueckfuehrung`: returning or inward-curving body
- `siegelpfad`: abrupt, sealing, or terminating body

Keep all shapes compatible with the existing placement model:
- same sector ownership
- same shell framing
- same projection honesty

- [ ] **Step 3: Preserve non-priority families through the neutral builder**

Leave non-priority families on the generic band fallback unless a tiny supporting adjustment is required to keep the file coherent.

Do not broaden this loop into a full all-family redesign.

- [ ] **Step 4: Keep label placement compatible**

Adjust label anchor math only if the new control-family shapes make the current label position unusably misleading.

Prefer small targeted shifts over broad label-system changes.

- [ ] **Step 5: Run the presentation test to verify the new geometry passes**

Run from `app/`:

```bash
node .\node_modules\vitest\vitest.mjs run src/lib/components/runes/runePresentation.test.ts
```

Expected:
- PASS

- [ ] **Step 6: Commit the presentation-layer shape-language upgrade**

```bash
git add app/src/lib/components/runes/runePresentation.ts app/src/lib/components/runes/runePresentation.test.ts
git commit -m "feat: differentiate runic control shapes"
```

### Task 3: Align Canvas Rendering With The New Shape Language

**Files:**
- Modify: `app/src/lib/components/runes/RuneCanvas.svelte`

- [ ] **Step 1: Review shape rendering assumptions**

Update `app/src/lib/components/runes/RuneCanvas.svelte` only where the stronger shape geometry requires renderer support.

Check specifically:
- whether stroke widths still support the new silhouettes
- whether shape fill and border contrast still differentiate the new bodies
- whether relation layering still reads correctly around the more differentiated shapes

- [ ] **Step 2: Make minimal renderer adjustments for shape readability**

If needed, make small updates to:
- shape stroke width
- fill opacity
- shape-family-specific styling
- label emphasis

Keep the existing control-path improvements from loop 2 intact.
Do not rework layout or relation semantics here.

- [ ] **Step 3: Run type and rendering checks**

Run from `app/`:

```bash
yarn check
```

Expected:
- PASS

- [ ] **Step 4: Commit the canvas alignment pass**

```bash
git add app/src/lib/components/runes/RuneCanvas.svelte
git commit -m "feat: align rune canvas with shape language"
```

Only create this commit if `RuneCanvas.svelte` needed a real change.

### Task 4: Strengthen The Rendered Guard For Complex Runes

**Files:**
- Modify: `app/e2e/rune-inspector.spec.js`

- [ ] **Step 1: Finalize the complex-rune rendered assertions**

Update the E2E spec so it checks that `/dev/runes` still renders:
- the five priority shape-family classes
- the distinct relation layer from loop 2
- the tabbed detail view behavior from loop 1

Keep the assertion set compact and directly tied to the rendered surface.

- [ ] **Step 2: Run the Playwright spec**

Run from `app/`:

```bash
node .\node_modules\playwright\cli.js test e2e/rune-inspector.spec.js
```

Expected:
- PASS

- [ ] **Step 3: Commit the rendered guard update**

```bash
git add app/e2e/rune-inspector.spec.js
git commit -m "test: cover differentiated rune control shapes"
```

Only create this commit if the E2E file changed beyond the initial failing test draft.

### Task 5: Review The Output And Apply Only Review-Proven Polish

**Files:**
- Review: `app/src/lib/components/runes/RuneCanvas.svelte`
- Review: `app/src/lib/components/runes/runePresentation.ts`
- Optional Modify: `app/src/lib/components/runes/RuneLegend.svelte`

- [ ] **Step 1: Run the manual `/dev/runes` review with the repo-local skill**

Use `skills/ui-output-review/SKILL.md` with the `runes` profile on the complex rune state.

Review especially:
- whether the five priority families are now distinguishable by body shape
- whether path reading remains intact after the shape differentiation
- whether labels and detail tabs stay secondary to the canvas rather than compensating for it

Do not create screenshot artifacts.

- [ ] **Step 2: Apply only small review-proven adjustments**

If the review reveals a real issue, make only a narrow fix such as:
- a small label offset correction
- a shape stroke/fill tuning
- a tiny legend support addition if recognition is still ambiguous

Do not expand the scope into support-family redesign.

- [ ] **Step 3: Re-run the Playwright spec if review polish changed rendered output**

Run from `app/`:

```bash
node .\node_modules\playwright\cli.js test e2e/rune-inspector.spec.js
```

Expected:
- PASS

- [ ] **Step 4: Commit only if the review produced a real patch**

```bash
git add app/src/lib/components/runes/RuneCanvas.svelte app/src/lib/components/runes/RuneLegend.svelte app/e2e/rune-inspector.spec.js
git commit -m "refactor: tighten rune shape-language reading"
```

Only create this commit if the manual review revealed and fixed a real issue.

### Task 6: Final Verification And Handoff

**Files:**
- Review: `docs/superpowers/specs/2026-04-08-rune-canvas-shape-language-loop-3-design.md`
- Review: `app/src/lib/components/runes/runePresentation.ts`
- Review: `app/src/lib/components/runes/RuneCanvas.svelte`
- Review: `app/src/lib/components/runes/runePresentation.test.ts`
- Review: `app/e2e/rune-inspector.spec.js`

- [ ] **Step 1: Run the final verification set**

Run from `app/`:

```bash
node .\node_modules\vitest\vitest.mjs run src/lib/components/runes/runePresentation.test.ts
node .\node_modules\playwright\cli.js test e2e/rune-inspector.spec.js
yarn check
yarn build
```

Expected:
- presentation tests pass
- `/dev/runes` Playwright review passes
- Svelte/type checks pass
- production build passes

- [ ] **Step 2: Verify repo hygiene**

Run from the repo root:

```bash
git status --short
git diff --check
```

Expected:
- no temporary review artifacts remain
- no whitespace or patch-hygiene issues remain

- [ ] **Step 3: Capture residual risks explicitly**

In the final implementation report, call out:
- any priority family that still reads too close to another
- whether path readability remained intact after the shape changes
- whether any legend support was needed
- that non-priority family differentiation remains a later loop if still needed

- [ ] **Step 4: Commit the integrated shape-language loop**

```bash
git add -A
git commit -m "feat: strengthen rune canvas shape language"
```
