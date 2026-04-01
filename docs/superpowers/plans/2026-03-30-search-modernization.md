# Search Modernization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modernized wiki search with derived facets, restrained advanced syntax, deterministic sorting, stronger result UX, and regression-safe highlighting without introducing authored search metadata.

**Architecture:** Extend the existing Fuse-based search into a cached derived search model with explicit query parsing, facet derivation, and structured API responses. Keep preview search intentionally narrow, rebuild the full search page around the new contract, and lock behavior down with focused regression tests for parsing, ranking, filters, highlighting, and zero-result flows.

**Tech Stack:** SvelteKit, TypeScript, Fuse.js, existing wiki/Markdown pipeline, regression tests, `svelte-check`, Vite build

> **Testing note (2026-03-31):** The repo no longer uses manual `esbuild | node` test execution for `app/src/**/*.test.ts`. Run `yarn test` from `app/` for the unified Vitest suite and keep `yarn test:e2e` for Playwright.

---

## File Map

### Existing files to modify

- `app/src/lib/searchCore.ts`
  - Keep normalized search utilities and shared highlight helpers.
  - Remove responsibilities that belong in dedicated query/facet modules if the file becomes too large.
- `app/src/lib/wiki.ts`
  - Switch from the current simple search output to the structured derived search model.
- `app/src/lib/searchExcerpt.ts`
  - Keep excerpt creation aligned with parsed-query-driven highlighting.
- `app/src/routes/api/search/+server.ts`
  - Return explicit object payloads for full and preview search.
- `app/src/routes/content/search/+page.server.ts`
  - Consume the new API contract and pass structured data to the page.
- `app/src/routes/content/search/+page.svelte`
  - Rebuild the page UX around facets, sorting, chips, syntax help, zero-result states, and structured results.
- `app/src/lib/components/Searchbar.svelte`
  - Update preview fetch and rendering for the new preview response shape.
- `app/src/lib/components/SearchEntry.svelte`
  - Render metadata lines and any richer result context required by the new page.
- `app/src/types.d.ts`
  - Update shared search result typing only if global types are still the established pattern.

### New helper files to create

- `app/src/lib/searchQuery.ts`
  - Parse raw query strings into deterministic query state.
- `app/src/lib/searchDerivedData.ts`
  - Build derived page records, normalized path/domain labels, and facet catalogs from existing wiki data.
- `app/src/lib/searchRanking.ts`
  - Apply hard filters, invoke Fuse/search scoring, and sort/group results.
- `app/src/lib/searchContracts.ts`
  - Define `SearchApiResponse`, `SearchPreviewResponse`, and related payload types used by API and UI.
- `app/src/lib/searchZeroResults.ts`
  - Compute broaden-search guidance and relaxed-query suggestions using the approved rules.

### New tests to create

- `app/src/lib/searchQuery.test.ts`
- `app/src/lib/searchDerivedData.test.ts`
- `app/src/lib/searchRanking.test.ts`
- `app/src/lib/searchZeroResults.test.ts`

### Existing tests to extend

- `app/src/lib/searchCore.test.ts`
- `app/src/lib/searchExcerpt.test.ts`

## Task 1: Define Search Contracts and Query Parser

**Files:**
- Create: `app/src/lib/searchContracts.ts`
- Create: `app/src/lib/searchQuery.ts`
- Test: `app/src/lib/searchQuery.test.ts`

- [ ] **Step 1: Write the failing parser and contract tests**

```ts
import assert from 'node:assert/strict';
import { parseSearchQuery } from './searchQuery';

const parsed = parseSearchQuery('title:"Do Uspil" foo -Lateralen path:Sodili type:article');

assert.deepEqual(parsed.freeTextTerms, ['foo']);
assert.deepEqual(parsed.phrases, []);
assert.deepEqual(parsed.exclusions, ['Lateralen']);
assert.deepEqual(parsed.fieldFilters.title, ['Do Uspil']);
assert.deepEqual(parsed.fieldFilters.path, ['Sodili']);
assert.deepEqual(parsed.fieldFilters.type, ['article']);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test -- src/lib/searchQuery.test.ts`

Expected: FAIL because `searchQuery.ts` does not exist or `parseSearchQuery` is not implemented.

- [ ] **Step 3: Write minimal parser and contract definitions**

Implement:
- query state types in `searchContracts.ts`
- deterministic token parsing in `searchQuery.ts`
- prefix binding rules
- repeated-filter OR collection
- cross-field AND representation

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test -- src/lib/searchQuery.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/searchContracts.ts app/src/lib/searchQuery.ts app/src/lib/searchQuery.test.ts
git commit -m "feat: add structured search query parser"
```

## Task 2: Build Derived Search Records and Facet Catalogs

**Files:**
- Create: `app/src/lib/searchDerivedData.ts`
- Test: `app/src/lib/searchDerivedData.test.ts`
- Modify: `app/src/lib/wiki.ts`

- [ ] **Step 1: Write the failing derived-data tests**

```ts
import assert from 'node:assert/strict';
import { deriveDomainInfo, buildFacetCatalogs } from './searchDerivedData';

assert.deepEqual(
  deriveDomainInfo('content/Volk_/Lateralen_/Sodili/index.md'),
  { key: 'volk', label: 'Volk' }
);
```

Include tests for:
- root content fallback domain
- media/gallery ancestor fallback
- underscore normalization
- category facet counts
- page-type facet counts

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test -- src/lib/searchDerivedData.test.ts`

Expected: FAIL because `searchDerivedData.ts` does not exist or functions are missing.

- [ ] **Step 3: Implement derived-record and facet helpers**

Implement:
- content-relative path normalization
- primary domain key/label derivation
- deterministic facet catalogs with counts
- stable key/label generation for categories and page types
- reusable derived record shape for the search pipeline

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test -- src/lib/searchDerivedData.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/searchDerivedData.ts app/src/lib/searchDerivedData.test.ts app/src/lib/wiki.ts
git commit -m "feat: derive search domains and facets"
```

## Task 3: Implement Ranking, Filtering, and Deterministic Sorting

**Files:**
- Create: `app/src/lib/searchRanking.ts`
- Test: `app/src/lib/searchRanking.test.ts`
- Modify: `app/src/lib/searchCore.ts`

- [ ] **Step 1: Write the failing ranking tests**

```ts
import assert from 'node:assert/strict';
import { runSearchRanking } from './searchRanking';

// Cover:
// - hard filters
// - `path:` vs domain facet
// - `Bereich` sort with German collation
// - title always enabled
// - title/category/content scope behavior
```

Add explicit cases for:
- `path:Sodili` only matching matching path segments
- domain sort tie-breaking by title
- UI category/content toggles not disabling title matches
- repeated field filters OR behavior
- zero result after exclusions not leaking excluded results

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test -- src/lib/searchRanking.test.ts`

Expected: FAIL because ranking helpers are not implemented.

- [ ] **Step 3: Implement the ranking pipeline**

Implement:
- hard filter application
- Fuse-backed scoring with explicit weighting
- deterministic sort modes:
  - relevance
  - title ascending
  - domain ascending with German collation and title tie-break
- result payload assembly with derived metadata and title highlights

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test -- src/lib/searchRanking.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/searchRanking.ts app/src/lib/searchRanking.test.ts app/src/lib/searchCore.ts
git commit -m "feat: add structured search ranking pipeline"
```

## Task 4: Implement Zero-Result Guidance and Relaxed Query Suggestions

**Files:**
- Create: `app/src/lib/searchZeroResults.ts`
- Test: `app/src/lib/searchZeroResults.test.ts`
- Modify: `app/src/lib/searchRanking.ts`

- [ ] **Step 1: Write the failing zero-result tests**

```ts
import assert from 'node:assert/strict';
import { buildZeroResultSuggestions } from './searchZeroResults';

// Cover:
// - broadenSearch true when exclusions or hard filters exist
// - stable removeFilters ordering
// - nearbyQueries only when a relaxed query yields results
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test -- src/lib/searchZeroResults.test.ts`

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement zero-result helpers**

Implement:
- broaden-search flag
- stable removable-filter list
- relaxed query generation in approved order:
  1. remove exclusions
  2. disable UI hard filters
  3. drop field prefixes while preserving free text

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test -- src/lib/searchZeroResults.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/searchZeroResults.ts app/src/lib/searchZeroResults.test.ts app/src/lib/searchRanking.ts
git commit -m "feat: add zero-result search guidance"
```

## Task 5: Upgrade the Wiki Search Backend and API Contract

**Files:**
- Modify: `app/src/lib/wiki.ts`
- Modify: `app/src/routes/api/search/+server.ts`
- Modify: `app/src/routes/content/search/+page.server.ts`
- Test: extend `app/src/lib/searchCore.test.ts`

- [ ] **Step 1: Write failing backend contract assertions**

Extend tests to assert:
- full search returns an object with `query`, `parsedQuery`, `activeFilters`, `sort`, `facets`, `suggestions`, `results`
- preview returns an object with `query` and `results`
- preview omits full-page-only payload fields

- [ ] **Step 2: Run targeted tests to verify they fail**

Run:
- `yarn test -- src/lib/searchCore.test.ts`

Expected: FAIL because the server/page assumptions still reflect the old contract.

- [ ] **Step 3: Implement the backend contract**

Implement:
- cached derived search model usage from `wiki.ts`
- full structured response in `/api/search`
- preview response object shape
- updated full-page loader consumption

- [ ] **Step 4: Run targeted tests to verify they pass**

Run:
- `yarn test -- src/lib/searchCore.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/wiki.ts app/src/routes/api/search/+server.ts app/src/routes/content/search/+page.server.ts app/src/lib/searchCore.test.ts
git commit -m "feat: add structured search API responses"
```

## Task 6: Rebuild the Full Search Page UI

**Files:**
- Modify: `app/src/routes/content/search/+page.svelte`
- Modify: `app/src/lib/components/SearchEntry.svelte`

- [ ] **Step 1: Write failing source-level UI assertions**

Extend or add source-inspection assertions covering:
- active filter chip rendering
- facet groups for domains/page types/categories
- sort controls
- syntax help block
- zero-result guidance hooks

- [ ] **Step 2: Run targeted tests to verify they fail**

Run the relevant Vitest-backed UI/source assertions.

Expected: FAIL because the current page still renders the simple search form and result list.

- [ ] **Step 3: Implement the search page UI**

Implement:
- filter rail / collapsible filter sections
- active chips
- sort controls
- syntax help
- results metadata line
- stronger zero-result state and nearby-query suggestions
- mobile-safe layout behavior

- [ ] **Step 4: Run targeted tests to verify they pass**

Run the updated UI/source assertions.

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/src/routes/content/search/+page.svelte app/src/lib/components/SearchEntry.svelte
git commit -m "feat: redesign full search page"
```

## Task 7: Align Preview Search with the New Model

**Files:**
- Modify: `app/src/lib/components/Searchbar.svelte`
- Modify: `app/src/routes/api/search/+server.ts`

- [ ] **Step 1: Write failing preview assertions**

Add assertions for:
- preview fetch consuming `{ query, results }`
- compact title-first rendering
- no dependency on full-page payload fields

- [ ] **Step 2: Run targeted tests to verify they fail**

Run the relevant Vitest-backed search tests.

Expected: FAIL because preview still assumes the old response shape.

- [ ] **Step 3: Implement preview alignment**

Implement:
- updated preview fetch/response handling
- preserved compact result count
- consistent controlled title highlighting

- [ ] **Step 4: Run targeted tests to verify they pass**

Run the same targeted tests.

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/components/Searchbar.svelte app/src/routes/api/search/+server.ts
git commit -m "feat: align preview search with structured backend"
```

## Task 8: Regressions, Highlighting, and Final Verification

**Files:**
- Modify: `app/src/lib/searchCore.test.ts`
- Modify: `app/src/lib/searchExcerpt.test.ts`
- Modify: any files touched in earlier tasks only if required to fix failing regressions

- [ ] **Step 1: Add final regression cases**

Add or extend tests for:
- noisy short-query title highlighting stays controlled
- noisy short-query excerpt highlighting stays controlled
- phrase highlighting
- umlaut/transliteration handling
- page/server payload shape
- zero-result behavior

- [ ] **Step 2: Run focused regression tests**

Run:
- `yarn test -- src/lib/searchQuery.test.ts`
- `yarn test -- src/lib/searchDerivedData.test.ts`
- `yarn test -- src/lib/searchRanking.test.ts`
- `yarn test -- src/lib/searchZeroResults.test.ts`
- `yarn test -- src/lib/searchCore.test.ts`
- `yarn test -- src/lib/searchExcerpt.test.ts`

Expected: PASS on all six commands.

- [ ] **Step 3: Run full project verification**

Run:
- `yarn run check`
- `yarn run build`

Expected:
- `svelte-check found 0 errors and 0 warnings`
- Vite build completes successfully

- [ ] **Step 4: Review diff manually**

Check:
- no accidental content/lore changes
- no duplicated domain-normalization logic
- preview and full-page payloads stay intentionally different but structurally explicit

- [ ] **Step 5: Commit**

```bash
git add app/src
git commit -m "feat: modernize wiki search experience"
```

## Manual Review Notes

Subagent review loop was skipped for this plan because delegation is not explicitly authorized for the plan-writing step in this turn.

Manual review checklist:
- task order follows TDD and keeps commits small
- file boundaries are explicit
- API contract work happens before UI rebuild
- preview alignment is isolated from the main search page rebuild
- final verification includes both focused regressions and full app checks

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-03-30-search-modernization.md`. Ready to execute?
