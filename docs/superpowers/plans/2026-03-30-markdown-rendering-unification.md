# Markdown Rendering Unification Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace visible project-specific Markdown authoring syntax with CommonMark plus invisible HTML comment hooks while preserving the current website rendering through screenshot-based regression checks.

**Architecture:** Introduce a normalization layer in the Markdown pipeline so both legacy syntax and new hook comments produce the same internal render intent before HTML is emitted. Add screenshot-based browser verification first, then implement hook parsing, then migrate content in small batches while keeping legacy syntax support until parity is proven.

**Tech Stack:** SvelteKit, TypeScript, `marked`, `marked-directive`, Cheerio, DOMPurify, Fancybox, Playwright for screenshot regression checks

---

## File Structure

### Existing files to modify

- Modify: `D:\My_Files\Programming\serpinit-wiki\app\package.json`
  Purpose: add screenshot-regression scripts and, if needed, Playwright-related commands.
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownPage.ts`
  Purpose: add the new comment-hook parsing and the legacy-to-normalized compatibility layer.
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\components\ContentCard.svelte`
  Purpose: preserve or adapt CSS/DOM assumptions only if DOM-shape alignment is required to keep screenshot parity. Do not treat this as redesign scope.
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\index.md`
  Purpose: migrate existing `§imglink` content to the new authoring form.
- Modify: representative content pages that currently use legacy syntax such as:
  - `D:\My_Files\Programming\serpinit-wiki\content\Himmelskoerper_\Mavorak\index.md`
  - `D:\My_Files\Programming\serpinit-wiki\content\Himmelskoerper_\Aridess\index.md`
  - `D:\My_Files\Programming\serpinit-wiki\content\Volk_\Varnops\index.md`
  - `D:\My_Files\Programming\serpinit-wiki\content\DnD-5e\Session_\index.md`
  - `D:\My_Files\Programming\serpinit-wiki\content\Volk_\Varnops\Politik\Zirkel_\index.md`
  Purpose: migrate legacy syntax to hook-based authoring once compatibility is in place.

### New files to create

- Create: `D:\My_Files\Programming\serpinit-wiki\app\playwright.config.ts`
  Purpose: define the screenshot-regression runner and local dev-server integration.
- Create: `D:\My_Files\Programming\serpinit-wiki\app\e2e\markdown-rendering.spec.ts`
  Purpose: capture and compare screenshots for the representative page corpus.
- Create: `D:\My_Files\Programming\serpinit-wiki\app\e2e\fixtures\markdown-rendering-pages.ts`
  Purpose: hold the representative page list and viewport coverage in one place.
- Create: `D:\My_Files\Programming\serpinit-wiki\scripts\validate-markdown-authoring.mjs`
  Purpose: verify that migrated Markdown files keep canonical content visible and use only approved invisible hook comments.
- Create: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownRenderHooks.ts`
  Purpose: parse invisible HTML comment hooks into a normalized render-intent model.
- Create: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownLegacyCompatibility.ts`
  Purpose: convert legacy project syntax into the same normalized render-intent model used by new hooks.
- Create: `D:\My_Files\Programming\serpinit-wiki\docs\markdown-rendering-authoring.md`
  Purpose: document the new hook vocabulary and repository authoring rules after implementation.

## Representative Verification Corpus

Use the screenshot baseline to cover this fixed corpus at minimum:

- `content/Himmelskoerper_/Mavorak/index.md`
  Covers overview layout plus image and table content.
- `content/Himmelskoerper_/Aridess/index.md`
  Covers overview layout in a simpler form.
- `content/Volk_/Varnops/index.md`
  Covers figure, figcaption, relative image URLs, Fancybox wrapping, legacy `note` and `todo` callouts, images, and long-form prose.
- `content/index.md`
  Covers image-link card rendering.
- `content/DnD-5e/Session_/index.md`
  Covers `§index`.
- `content/Volk_/Varnops/Politik/Zirkel_/index.md`
  Covers `<!-- INDEX -->`.
- `content/Himmelskoerper_/Aridess/Flora_/Vorolae/index.md`
  Covers a smaller image-focused page with figure rendering.
- `/content/Volk_/Varnops/images`
  Covers the generated gallery route with a fixed path.
- `content/Allgemein/Magie/index.md`
  Covers dense tables and figure content.
- One dedicated test-controlled fixture page for `maybe` callout coverage if no live content page uses that state yet.

Run each page at desktop width first.
Add a smaller mobile-width pass only if current rendering materially changes with viewport width.

## Task 1: Add Screenshot Regression Harness

**Files:**
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\package.json`
- Create: `D:\My_Files\Programming\serpinit-wiki\app\playwright.config.ts`
- Create: `D:\My_Files\Programming\serpinit-wiki\app\e2e\fixtures\markdown-rendering-pages.ts`
- Create: `D:\My_Files\Programming\serpinit-wiki\app\e2e\markdown-rendering.spec.ts`

- [ ] **Step 1: Add the failing screenshot test scaffold**

Create a Playwright screenshot suite that visits each representative page and asserts against named snapshots.

Include code shaped like:

```ts
import { test, expect } from "@playwright/test";
import { pages } from "./fixtures/markdown-rendering-pages";

for (const pageDef of pages) {
	test(pageDef.name, async ({ page }) => {
		await page.setViewportSize(pageDef.viewport);
		await page.goto(pageDef.url);
		await page.waitForLoadState("networkidle");
		await page.locator("#content-body").waitFor();
		await page.locator("img").evaluateAll((images) =>
			Promise.all(
				images.map((img) =>
					img.complete
						? Promise.resolve()
						: new Promise((resolve) => img.addEventListener("load", resolve, { once: true }))
				)
			)
		);
		await page.addStyleTag({
			content: `*, *::before, *::after { animation: none !important; transition: none !important; }`
		});
		await expect(page.locator("#content-body")).toHaveScreenshot(pageDef.snapshot);
	});
}
```

- [ ] **Step 2: Add package scripts for baseline and verification**

Add scripts shaped like:

```json
{
	"test:e2e": "playwright test",
	"test:e2e:update": "playwright test --update-snapshots"
}
```

- [ ] **Step 3: Install and configure Playwright**

Run: `yarn add -D @playwright/test`

Expected: dependency added successfully to `devDependencies`.

- [ ] **Step 4: Verify the suite fails before baselines exist**

Run: `yarn test:e2e`

Expected: FAIL because snapshots are missing.

- [ ] **Step 5: Generate the first baseline**

Run: `yarn test:e2e:update`

Expected: PASS and screenshot snapshots written under the Playwright snapshot directory.

- [ ] **Step 6: Re-run to verify baseline stability**

Run: `yarn test:e2e`

Expected: PASS with zero screenshot diffs.

- [ ] **Step 7: Fix any flakiness before proceeding**

If repeated runs produce diffs, tighten stabilization rules before continuing.
Do not accept a flaky baseline.

- [ ] **Step 8: Commit**

```bash
git add app/package.json app/playwright.config.ts app/e2e
git commit -m "test: add markdown rendering screenshot baseline"
```

## Task 2: Add CommonMark Authoring Validation

**Files:**
- Create: `D:\My_Files\Programming\serpinit-wiki\scripts\validate-markdown-authoring.mjs`
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\package.json`

- [ ] **Step 1: Write a validator for migrated Markdown files**

The validator should fail when:

- canonical prose is stored inside non-hook HTML comments
- unapproved hook comments are present
- banned legacy authoring syntax remains in files that have been migrated

It should allow only the approved invisible hook vocabulary.

- [ ] **Step 2: Add a package script**

Add a script shaped like:

```json
{
	"validate:markdown-authoring": "node ../scripts/validate-markdown-authoring.mjs"
}
```

- [ ] **Step 3: Run the validator against one known-good sample**

Run:

```bash
node scripts/validate-markdown-authoring.mjs content/Himmelskoerper_/Aridess/index.md
```

Expected: PASS once the sample is in migrated form.

- [ ] **Step 4: Commit**

```bash
git add scripts/validate-markdown-authoring.mjs app/package.json
git commit -m "test: add markdown authoring validator"
```

## Task 3: Introduce Hook Parsing as a New Normalized Input

**Files:**
- Create: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownRenderHooks.ts`
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownPage.ts`
- Test: `D:\My_Files\Programming\serpinit-wiki\app\e2e\markdown-rendering.spec.ts`

- [ ] **Step 1: Write a focused failing test page using new hook syntax**

Add one representative content fixture page or convert one low-risk page copy in a controlled location so the new syntax can be rendered by the app.

Use content shaped like:

```md
<!-- layout: overview -->

![Test](./images/test.png)

| Key | Value |
| --- | --- |
| A | B |
```

- [ ] **Step 2: Run screenshot test to confirm current renderer does not honor it**

Run: `yarn test:e2e --grep overview`

Expected: FAIL because the new comment hook does not yet produce overview rendering.

- [ ] **Step 3: Implement hook parsing**

Create a parser that recognizes only the approved hook vocabulary and returns structured render intent, for example:

```ts
export type MarkdownRenderHook =
	| { kind: "layout"; value: "overview" }
	| { kind: "callout"; value: "note" | "todo" | "maybe" }
	| { kind: "display"; value: "card-link" }
	| { kind: "render"; value: "folder-index" | "gallery" };
```

- [ ] **Step 4: Wire the parser into `MarkdownPage` without removing legacy behavior**

Ensure hook parsing happens before final HTML emission and feeds the same render decisions currently derived from legacy syntax.

- [ ] **Step 5: Re-run screenshot tests**

Run: `yarn test:e2e`

Expected: PASS for all baseline pages and PASS for the new-hook coverage page.

- [ ] **Step 6: Verify CommonMark authoring constraints for the new-hook page**

Run:

```bash
node scripts/validate-markdown-authoring.mjs <migrated-file>
```

Expected: PASS and no warning that canonical content is hidden inside comments.

- [ ] **Step 7: Commit**

```bash
git add app/src/lib/markdownRenderHooks.ts app/src/lib/markdownPage.ts app/e2e
git commit -m "feat: support markdown render hooks"
```

## Task 4: Isolate Legacy Syntax Behind a Compatibility Layer

**Files:**
- Create: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownLegacyCompatibility.ts`
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownPage.ts`
- Test: `D:\My_Files\Programming\serpinit-wiki\app\e2e\markdown-rendering.spec.ts`

- [ ] **Step 1: Write a failing parity check covering one legacy form and one new form**

Add a screenshot case pair where two pages should render identically:

- one authored with legacy syntax
- one authored with the new hook syntax

- [ ] **Step 2: Run the pair and confirm parity currently fails**

Run: `yarn test:e2e --grep parity`

Expected: FAIL or show visible differences.

- [ ] **Step 3: Move legacy conversions out of `markdownPage.ts` into a dedicated compatibility module**

Extract logic for:

- legacy comment callouts
- `§imglink`
- `§index`
- `<!-- INDEX -->`
- legacy overview and gallery structures

The module should output the same normalized render-intent model used by the new hook parser.
For `<!-- INDEX -->`, preserve the current generated-folder-content behavior first and normalize it to the matching internal render intent rather than assuming it is identical to every `folder-index` case.

- [ ] **Step 4: Keep the final rendered DOM shape aligned with current CSS expectations**

Do not change class names such as:

- `.comment`
- `.comment-indicator`
- `.comment-content`
- `.img-link`
- `#gallery`

- [ ] **Step 5: Re-run full screenshot suite**

Run: `yarn test:e2e`

Expected: PASS with no diffs on the representative corpus.

- [ ] **Step 6: Run static app checks**

Run: `yarn check`

Expected: PASS with no new type-check issues.

- [ ] **Step 7: Commit**

```bash
git add app/src/lib/markdownLegacyCompatibility.ts app/src/lib/markdownPage.ts
git commit -m "refactor: normalize legacy markdown rendering"
```

## Task 5: Migrate Callout Authoring from Comment-Content Containers to Visible Markdown

**Files:**
- Modify: representative content pages that use `<!-- NOTE ... -->`, `<!-- TODO ... -->`, or similar legacy comment containers
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownPage.ts` only if callout block association needs a small adjustment
- Test: `D:\My_Files\Programming\serpinit-wiki\app\e2e\markdown-rendering.spec.ts`

- [ ] **Step 1: Convert one low-risk legacy callout page to visible Markdown plus hook**

Use the new form:

```md
<!-- callout: note -->
> **Note:** Existing visible content here.
```

- [ ] **Step 2: Run screenshot comparison for that page**

Run: `yarn test:e2e --grep <page-name>`

Expected: PASS with no visible differences.

- [ ] **Step 3: Migrate the remaining representative callout pages in a small batch**

Keep the visible prose identical.
Only change the source syntax.

- [ ] **Step 4: Run full screenshot suite**

Run: `yarn test:e2e`

Expected: PASS with zero diffs.

- [ ] **Step 5: Run authoring validation on the migrated callout files**

Run:

```bash
node scripts/validate-markdown-authoring.mjs <file-1> <file-2>
```

Expected: PASS and only approved hook comments remain.

- [ ] **Step 6: Commit**

```bash
git add content app/e2e
git commit -m "refactor: migrate markdown callouts to hook syntax"
```

## Task 6: Migrate Overview Authoring

**Files:**
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Himmelskoerper_\Mavorak\index.md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Himmelskoerper_\Aridess\index.md`
- Modify: additional overview pages such as character or planet pages that use `:::overview`
- Test: `D:\My_Files\Programming\serpinit-wiki\app\e2e\markdown-rendering.spec.ts`

- [ ] **Step 1: Convert one overview page from `:::overview` to `<!-- layout: overview -->`**

Preserve the exact visible image and table content.

- [ ] **Step 2: Run screenshot test for that page**

Run: `yarn test:e2e --grep Mavorak`

Expected: PASS with no layout or spacing regression.

- [ ] **Step 3: Migrate the remaining representative overview pages**

Keep source content CommonMark-compatible and avoid adding raw HTML.

- [ ] **Step 4: Run full screenshot suite**

Run: `yarn test:e2e`

Expected: PASS with zero diffs.

- [ ] **Step 5: Run authoring validation on the migrated overview files**

Run:

```bash
node scripts/validate-markdown-authoring.mjs content/Himmelskoerper_/Mavorak/index.md content/Himmelskoerper_/Aridess/index.md
```

Expected: PASS and overview content remains visible as normal Markdown outside the website renderer.

- [ ] **Step 6: Commit**

```bash
git add content app/e2e
git commit -m "refactor: migrate overview markdown to hook syntax"
```

## Task 7: Migrate Image Link Cards and Folder Index Authoring

**Files:**
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\index.md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\DnD-5e\Session_\index.md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Volk_\Varnops\Politik\Zirkel_\index.md`
- Test: `D:\My_Files\Programming\serpinit-wiki\app\e2e\markdown-rendering.spec.ts`

- [ ] **Step 1: Convert one `§imglink` example to visible Markdown plus `display: card-link`**

Use shape like:

```md
<!-- display: card-link -->
[![Die Magie](./path/to/image.png)](/content/Allgemein/Magie/index.md)

Die Magie
```

- [ ] **Step 2: Convert one folder index page to the appropriate new render hook**

For pages whose current behavior is a plain folder index, migrate to:

```md
<!-- render: folder-index -->
```

For pages whose current `<!-- INDEX -->` behavior maps to a richer generated folder-content path, preserve that behavior through the matching internal render intent instead of forcing the wrong authoring shape.

- [ ] **Step 3: Run screenshot checks for the converted pages**

Run: `yarn test:e2e --grep "card|index"`

Expected: PASS with zero diffs.

- [ ] **Step 4: Convert the remaining representative pages using `§index` or `<!-- INDEX -->`**

- [ ] **Step 5: Run full screenshot suite**

Run: `yarn test:e2e`

Expected: PASS with zero diffs.

- [ ] **Step 6: Run authoring validation on the migrated card-link and index files**

Run:

```bash
node scripts/validate-markdown-authoring.mjs content/index.md content/DnD-5e/Session_/index.md content/Volk_/Varnops/Politik/Zirkel_/index.md
```

Expected: PASS and visible link content remains present in raw Markdown.

- [ ] **Step 7: Commit**

```bash
git add content app/e2e
git commit -m "refactor: migrate markdown index and card-link syntax"
```

## Task 8: Migrate Gallery Authoring and Preserve Figure Rendering

**Files:**
- Modify: any representative gallery-authored pages or routes that currently depend on generated gallery wrappers
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownPage.ts` if gallery hook attachment still depends on the old syntax path
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\components\ContentCard.svelte` only if a DOM-alignment tweak is necessary to preserve current screenshot output
- Test: `D:\My_Files\Programming\serpinit-wiki\app\e2e\markdown-rendering.spec.ts`

- [ ] **Step 1: Add a failing screenshot check for the fixed representative gallery route**

Run: `yarn test:e2e --grep gallery`

Expected: FAIL if the new hook path is not yet producing the current gallery layout.

- [ ] **Step 2: Migrate gallery trigger syntax to `<!-- render: gallery -->`**

Preserve generated image ordering, wrappers, and CSS hooks such as `#gallery`.

- [ ] **Step 3: Verify figure and figcaption pages still match baseline**

Run: `yarn test:e2e --grep "figure|Varnops|Vorolae"`

Expected: PASS with no figcaption overlay regressions.

- [ ] **Step 4: Run full screenshot suite**

Run: `yarn test:e2e`

Expected: PASS with zero diffs.

- [ ] **Step 5: Run authoring validation on any migrated gallery trigger files**

Run:

```bash
node scripts/validate-markdown-authoring.mjs <gallery-source-files>
```

Expected: PASS and only approved hook comments remain.

- [ ] **Step 6: Commit**

```bash
git add content app/src/lib/markdownPage.ts app/src/lib/components/ContentCard.svelte app/e2e
git commit -m "refactor: migrate markdown gallery syntax"
```

## Task 9: Document the New Authoring Contract

**Files:**
- Create: `D:\My_Files\Programming\serpinit-wiki\docs\markdown-rendering-authoring.md`

- [ ] **Step 1: Write the authoring guide**

Document:

- allowed hook vocabulary
- canonical content rules
- examples for overview, callout, card-link, folder-index, and gallery
- legacy syntax marked as deprecated

- [ ] **Step 2: Verify examples are consistent with the implemented renderer**

Run: no command required beyond manual comparison against implemented behavior.
Expected: examples match actual behavior exactly.

- [ ] **Step 3: Commit**

```bash
git add docs/markdown-rendering-authoring.md
git commit -m "docs: add markdown rendering authoring guide"
```

## Task 10: Remove Legacy Syntax Support After Content Migration

**Files:**
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownLegacyCompatibility.ts`
- Modify: `D:\My_Files\Programming\serpinit-wiki\app\src\lib\markdownPage.ts`
- Test: `D:\My_Files\Programming\serpinit-wiki\app\e2e\markdown-rendering.spec.ts`

- [ ] **Step 1: Confirm no remaining legacy syntax exists in tracked content**

Run:

```bash
rg -n "§|:::overview|<!--\\s*(NOTE|TODO|MAYBE|INDEX)\\b" content
```

Expected: no matches that represent live legacy authoring.

- [ ] **Step 2: Remove dead compatibility branches**

Delete only the branches no longer needed by repository content.

- [ ] **Step 3: Run full verification**

Run: `yarn check`
Expected: PASS

Run: `yarn test:e2e`
Expected: PASS with zero diffs

Run:

```bash
node scripts/validate-markdown-authoring.mjs $(rg --files content -g *.md)
```

Expected: PASS and only approved invisible hook comments remain in migrated authoring

- [ ] **Step 4: Commit**

```bash
git add app/src/lib/markdownLegacyCompatibility.ts app/src/lib/markdownPage.ts
git commit -m "refactor: remove legacy markdown rendering syntax"
```

## Final Verification

- [ ] Run: `yarn check`
  Expected: PASS
- [ ] Run: `yarn test:e2e`
  Expected: PASS with zero screenshot diffs
- [ ] Run:

```bash
node scripts/validate-markdown-authoring.mjs $(rg --files content -g *.md)
```

  Expected: PASS and no canonical content hidden inside non-hook comments
- [ ] Run:

```bash
rg -n "§|:::overview|<!--\\s*(NOTE|TODO|MAYBE|INDEX)\\b" content
```

  Expected: no live legacy authoring syntax remains

## Notes for Execution

- Do not rewrite all content at once.
- Keep each migration batch small enough that screenshot regressions are easy to localize.
- Preserve current DOM hooks and CSS class names unless there is a verified reason to change them.
- If a page cannot be migrated without visual drift, stop and restore parity before continuing.
- This repository normally avoids worktrees for implementation work; execute in the current workspace unless the user explicitly requests isolation.
- Treat plan review as a required workflow gate before execution, not an optional follow-up.
