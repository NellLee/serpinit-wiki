# Runic Language Canonicalization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the canonical runic language so it expresses lore-consistent control complexity with German canonical terminology, then adapt the app pipeline and inspector to derive from that revised language.

**Architecture:** Treat `runes/` as the only canonical language layer and migrate it away from mixed English renderer vocabulary toward lore-first terms. Keep the rune as one integrated structure by extending canonical structural forms and relations rather than adding a separate control subsystem. Update the app loader, projection derivation, and presentation code only after the canonical schema and documents are redefined, so the UI becomes a downstream interpretation of the new language instead of its implicit author.

**Tech Stack:** JSON Schema, canonical JSON runic documents, TypeScript, SvelteKit, Vitest, existing Yarn workflow

---

### Task 1: Define The Canonical Vocabulary Migration

**Files:**
- Modify: `docs/superpowers/specs/2026-04-06-runic-language-canonicalization-design.md` only if implementation reveals a necessary terminology clarification
- Modify: `runes/schema/rune-document.schema.json`
- Modify: `app/src/lib/runes/contracts.ts`
- Test: `app/src/lib/runes/library.test.ts`

- [ ] **Step 1: Write the failing terminology migration test**

Add or update a focused test in `app/src/lib/runes/library.test.ts` that loads the canonical library and asserts at least one document using the old English canonical vocabulary is rejected.

Example shape:

```ts
it('rejects canonical documents that still use deprecated English schema values', async () => {
	await expect(loadResolvedRunicLibrary({ fixture: 'deprecated-english-canonical-value' })).rejects.toThrow(
		/deprecated|unknown|invalid/i
	);
});
```

- [ ] **Step 2: Run the test to verify it fails for the right reason**

Run from `app/`:

```bash
yarn test src/lib/runes/library.test.ts
```

Expected:
- FAIL because the loader and schema still accept the mixed canonical terminology

- [ ] **Step 3: Rewrite the schema vocabulary to a canonical German-first contract**

Update `runes/schema/rune-document.schema.json` so the canonical contract no longer treats renderer-shaped English values as the language of truth.

This pass should:
- rename field names and enum values where needed to remove canonical English vocabulary
- introduce the new controlling primitive names:
  - `schwelle`
  - `pruefkammer`
  - `weiche`
  - `rueckfuehrung`
  - `siegelpfad`
- keep the rune as one integrated structure rather than introducing a separate control section
- preserve only lore-consistent projection concepts in the canonical contract

- [ ] **Step 4: Mirror the revised canonical vocabulary in TypeScript contracts**

Update `app/src/lib/runes/contracts.ts` so it reflects the new canonical schema exactly and contains no stale canonical English values.

Keep any remaining technical English strictly internal to app implementation helpers, not in the mirrored canonical types.

- [ ] **Step 5: Run the test to verify the migration guard now passes**

Run from `app/`:

```bash
yarn test src/lib/runes/library.test.ts
```

Expected:
- PASS

- [ ] **Step 6: Commit the canonical vocabulary foundation**

```bash
git add runes/schema/rune-document.schema.json app/src/lib/runes/contracts.ts app/src/lib/runes/library.test.ts docs/superpowers/specs/2026-04-06-runic-language-canonicalization-design.md
git commit -m "feat: define canonical runic vocabulary"
```

### Task 2: Rebuild The Canonical Primitive And Relation Language

**Files:**
- Modify: `runes/primitives/leitbahn.json`
- Modify: `runes/primitives/drossel.json`
- Modify: `runes/primitives/kammer.json`
- Modify: `runes/primitives/gabel.json`
- Modify: `runes/primitives/anker.json`
- Modify: `runes/primitives/mantel.json`
- Modify: `runes/primitives/sperre.json`
- Create: `runes/primitives/schwelle.json`
- Create: `runes/primitives/pruefkammer.json`
- Create: `runes/primitives/weiche.json`
- Create: `runes/primitives/rueckfuehrung.json`
- Create: `runes/primitives/siegelpfad.json`
- Modify: `runes/index/library.json`
- Test: `app/src/lib/runes/library.test.ts`

- [ ] **Step 1: Write the failing library coverage test**

Extend `app/src/lib/runes/library.test.ts` with a test that asserts the canonical library exposes the expanded controlling primitive inventory and that every listed primitive validates.

Example shape:

```ts
it('loads the expanded controlling primitive inventory', async () => {
	const library = await loadResolvedRunicLibrary();
	const primitiveIds = library.groups.find((group) => group.kind === 'primitive')?.entries.map((entry) => entry.id) ?? [];

	expect(primitiveIds).toEqual(
		expect.arrayContaining([
			'primitive.schwelle',
			'primitive.pruefkammer',
			'primitive.weiche',
			'primitive.rueckfuehrung',
			'primitive.siegelpfad'
		])
	);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `app/`:

```bash
yarn test src/lib/runes/library.test.ts
```

Expected:
- FAIL because the canonical primitive set is not yet expanded

- [ ] **Step 3: Rewrite the existing primitive files to the new canonical language**

Update the existing primitive JSON files so they:
- use the revised German-first canonical field/value vocabulary
- express richer operative meaning instead of passive shape labeling
- avoid any English renderer-derived canonical values

- [ ] **Step 4: Add the new controlling primitive documents**

Create canonical documents for:
- `schwelle`
- `pruefkammer`
- `weiche`
- `rueckfuehrung`
- `siegelpfad`

Each new primitive should:
- be schema-valid
- have lore-consistent semantics and topology
- express structural and operative meaning together
- remain plausible as a reduced 2D projection of a richer rune body

- [ ] **Step 5: Update the authoritative index**

Modify `runes/index/library.json` so the primitive group contains the revised and expanded inventory in stable intentional order.

- [ ] **Step 6: Run the test to verify the expanded primitive language passes**

Run from `app/`:

```bash
yarn test src/lib/runes/library.test.ts
```

Expected:
- PASS

- [ ] **Step 7: Commit the primitive language rebuild**

```bash
git add runes/primitives runes/index/library.json app/src/lib/runes/library.test.ts
git commit -m "feat: expand canonical runic primitives"
```

### Task 3: Rebuild Structures And Example Runes Around Control Logic

**Files:**
- Modify: `runes/structures/gebundene-leitbahn.json`
- Modify: `runes/structures/geschuetzter-auslass.json`
- Create: `runes/structures/gepruefter-auslass.json`
- Create: `runes/structures/gebundene-umschaltung.json`
- Create: `runes/structures/substratgekoppelte-pruefung.json`
- Create: `runes/structures/gedaempfte-rueckfuehrung.json`
- Modify: `runes/runes/lokaler-auslass.json`
- Modify: `runes/runes/substrat-gebundener-auslass.json`
- Modify: `runes/index/library.json`
- Test: `app/src/lib/runes/library.test.ts`

- [ ] **Step 1: Write the failing example-rune semantics test**

Add a test in `app/src/lib/runes/library.test.ts` that asserts the example runes now encode explicit control complexity, not just simple outlet composition.

Example shape:

```ts
it('loads example runes with integrated control structures', async () => {
	const library = await loadResolvedRunicLibrary();
	const rune = library.documentsById['rune.substrat-gebundener-auslass'];

	expect(JSON.stringify(rune)).toMatch(/pruef|schwelle|weiche|siegel|rueckfuehrung/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `app/`:

```bash
yarn test src/lib/runes/library.test.ts
```

Expected:
- FAIL because the current structures and runes are still too simple

- [ ] **Step 3: Rewrite the reusable structures**

Update existing structures and add the new control-oriented structures so they demonstrate:
- checked propagation
- conditional redirection
- bound outcomes
- early groundwork for later feedback and stabilization

Do not add a separate control graph.
All control must remain embedded in the canonical structural language.

- [ ] **Step 4: Rebuild the example runes**

Rework the existing example runes so they no longer read as simple outlet diagrams.
Each rune should visibly encode a more powerful and lore-consistent sequence of internal handling.

The first revision should prioritize:
- conditional release
- checked propagation
- controlled redirection
- sealed or bound outcomes

- [ ] **Step 5: Update the library index with stable discoverability**

Modify `runes/index/library.json` to include the new structures and keep groups intentionally ordered.

- [ ] **Step 6: Run the test to verify the example runes now express control logic**

Run from `app/`:

```bash
yarn test src/lib/runes/library.test.ts
```

Expected:
- PASS

- [ ] **Step 7: Commit the structure and example-rune pass**

```bash
git add runes/structures runes/runes runes/index/library.json app/src/lib/runes/library.test.ts
git commit -m "feat: deepen canonical runic control structures"
```

### Task 4: Adapt Library Loading And Projection Derivation To The Revised Canon

**Files:**
- Modify: `app/src/lib/runes/library.ts`
- Modify: `app/src/lib/runes/projection.ts`
- Modify: `app/src/lib/runes/library.test.ts`

- [ ] **Step 1: Write the failing projection derivation test**

Add or update tests that prove the app can still derive usable projection data from the revised canonical language without expecting the old English field/value names.

Example shape:

```ts
it('derives projection data from the canonical German runic contract', async () => {
	const library = await loadResolvedRunicLibrary();
	const rune = library.documentsById['rune.lokaler-auslass'];
	const projection = deriveRunicProjection(rune);

	expect(projection.placements.length).toBeGreaterThan(0);
	expect(projection.relationPaths.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `app/`:

```bash
yarn test src/lib/runes/library.test.ts
```

Expected:
- FAIL because loader or projection logic still assumes the previous canonical contract

- [ ] **Step 3: Update library parsing and validation**

Modify `app/src/lib/runes/library.ts` so it:
- validates against the revised schema
- resolves the new canonical vocabulary correctly
- produces clear errors when documents use stale terminology

- [ ] **Step 4: Update projection derivation**

Modify `app/src/lib/runes/projection.ts` so it derives view-ready placement and relation information from the revised lore-first canonical projection language.

This file may still use technical helper terms internally, but only as implementation details.

- [ ] **Step 5: Run focused runic tests**

Run from `app/`:

```bash
yarn test src/lib/runes/library.test.ts
```

Expected:
- PASS

- [ ] **Step 6: Commit the loading and projection adaptation**

```bash
git add app/src/lib/runes/library.ts app/src/lib/runes/projection.ts app/src/lib/runes/library.test.ts
git commit -m "feat: adapt runic loader to canonical language"
```

### Task 5: Rework Presentation Mapping And Inspector Semantics

**Files:**
- Modify: `app/src/lib/components/runes/runePresentation.ts`
- Modify: `app/src/lib/components/runes/runePresentation.test.ts`
- Modify: `app/src/lib/components/runes/RuneCanvas.svelte`
- Modify: `app/src/lib/components/runes/RuneLegend.svelte`
- Modify: `app/src/lib/components/runes/RuneProjectionPanel.svelte`
- Modify: `app/src/lib/components/runes/RuneStructurePanel.svelte`
- Modify: `app/src/routes/dev/runes/+page.server.ts`
- Modify: `app/src/routes/dev/runes/+page.svelte`

- [ ] **Step 1: Write the failing presentation test**

Update `app/src/lib/components/runes/runePresentation.test.ts` so it expects the presentation layer to distinguish control-oriented canonical forms instead of collapsing them into the old generic shape-family set.

Example shape:

```ts
it('exposes distinct presentation metadata for controlling runic forms', () => {
	const presentation = createRunePresentation(exampleRune);

	expect(presentation.legend.some((entry) => entry.id === 'pruefkammer')).toBe(true);
	expect(presentation.legend.some((entry) => entry.id === 'schwelle')).toBe(true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `app/`:

```bash
yarn test src/lib/components/runes/runePresentation.test.ts
```

Expected:
- FAIL because presentation still maps from the old canonical shape categories

- [ ] **Step 3: Rewrite the presentation adapter**

Modify `runePresentation.ts` so it derives display semantics from the revised canonical language and exposes enough metadata for the inspector to distinguish:
- threshold structures
- checking structures
- switching structures
- sealing structures
- controlled return structures

- [ ] **Step 4: Update the inspector components**

Modify the Svelte rune components so the inspector displays the richer canonical distinctions without claiming to show the full three-dimensional rune.

At minimum:
- `RuneCanvas.svelte` should visually separate the new controlling forms from passive conduits
- `RuneLegend.svelte` should describe lore-first categories instead of old renderer-shaped ones
- `RuneProjectionPanel.svelte` and `RuneStructurePanel.svelte` should show the new canonical terms clearly
- the `/dev/runes` route should continue to render the selected documents cleanly

- [ ] **Step 5: Run the presentation test to verify it passes**

Run from `app/`:

```bash
yarn test src/lib/components/runes/runePresentation.test.ts
```

Expected:
- PASS

- [ ] **Step 6: Commit the inspector semantics update**

```bash
git add app/src/lib/components/runes app/src/routes/dev/runes
git commit -m "feat: present canonical runic control semantics"
```

### Task 6: Rewrite The Runic Authoring Guide

**Files:**
- Modify: `runes/README.md`

- [ ] **Step 1: Write the failing documentation expectation**

Add a small assertion to an existing runic test or introduce a focused documentation fixture check only if the repo already uses documentation assertions cleanly.
If that would be artificial, skip test automation for this task and document the reason in the final implementation report.

- [ ] **Step 2: Rewrite the runic README**

Update `runes/README.md` so it explains:
- canonical terminology rules
- the ban on mixed English canonical vocabulary
- the expanded primitive set
- how control complexity is embedded into structure
- how the 2D projection should be authored honestly as a reduced reading

- [ ] **Step 3: Commit the authoring guide**

```bash
git add runes/README.md
git commit -m "docs: align runic authoring guide with canonical language"
```

### Task 7: Final Verification And Residual Risk Capture

**Files:**
- Review: `runes/**/*.json`
- Review: `app/src/lib/runes/*`
- Review: `app/src/lib/components/runes/*`
- Review: `app/src/routes/dev/runes/*`

- [ ] **Step 1: Run the focused automated verification set**

Run from `app/`:

```bash
yarn test src/lib/runes/library.test.ts
yarn test src/lib/components/runes/runePresentation.test.ts
yarn check
yarn build
```

Expected:
- runic library tests pass
- presentation tests pass
- Svelte and TypeScript checks pass
- production build passes

- [ ] **Step 2: Manually verify the dev inspector route**

Run from `app/`:

```bash
yarn dev
```

Open `/dev/runes` and verify:
- the library still loads primitives, structures, and runes
- the revised example runes render without runtime errors
- control-oriented forms are visually distinguishable
- the inspector language is canonically cleaner than before
- the view still reads as a reduced projection, not a claim of total 3D completeness

- [ ] **Step 3: Capture residual risks explicitly**

Document any remaining limitations, especially:
- places where the projection language still feels too renderer-driven
- terms that still need further lore refinement
- areas where explicit stabilization and feedback logic are only partially prepared

- [ ] **Step 4: Commit the integrated canonicalization pass**

```bash
git add -A
git commit -m "feat: canonicalize runic language"
```
