# Search Modernization Design

## Summary

Upgrade the wiki search from a simple Fuse-backed query page into a modern wiki-style search experience without introducing any new authored search metadata.
All facets, labels, groups, and rankings must be derived strictly from existing page data, path structure, current categories, and page presentation classification.

The result should provide:
- better filters and sorting
- restrained advanced query syntax
- cleaner result grouping and metadata
- stronger zero-result recovery
- regression-safe title and excerpt highlighting

## Goals

- Reach a modern wiki/docs baseline for search UX while staying appropriate for a custom Svelte wiki.
- Keep all search enrichment strictly derived from existing content and code structure.
- Preserve fast preview search while significantly improving the full search page.
- Avoid building an oversized search DSL or a metadata maintenance system.
- Make the system highly testable and resistant to ranking/highlighting regressions.

## Non-Goals

- No new frontmatter or page-level search metadata.
- No manual alias tables or curated synonym catalogs.
- No external search service or hosted indexing platform.
- No large-scale lore or content restructuring.
- No full enterprise search language.

## Constraints

- Derive everything from:
  - page title
  - existing categories
  - content text / rendered HTML
  - path structure
  - existing page presentation classification
- Normalize branch/domain labels into clean user-facing names while still deriving them from the path.
- Keep advanced syntax limited to high-value features only.

## User Experience

### Search Page

The search page should become a modern search workspace rather than a plain form and result list.

It should include:
- a prominent search field
- a compact syntax help block
- active filter chips
- a filter rail on desktop
- collapsible filters on mobile
- visible sort controls
- stronger empty and zero-result states

### Facets

All facets are derived and precomputed from existing data.

Primary facets:
- `Bereich`: normalized path-derived domain / branch
- `Seitentyp`: derived from existing presentation/page classification
- `Kategorien`: derived from existing page categories

Search scope controls remain available:
- categories
- content

Title remains always enabled and is not user-toggleable off.
If the API exposes `includeTitle` for schema clarity, it must always be `true`.

### Sorting

Support these sort modes:
- `Relevanz`
- `Titel A-Z`
- `Bereich`

If implementation cost remains low, `Titel Z-A` may be added as a mirror option, but it is not required.

`Bereich` sorting must use locale-aware ascending ordering on the display domain label.
Within a shared domain label, use `Titel A-Z` as the deterministic tie-breaker.

### Result Presentation

Each result should show:
- title with controlled highlighting
- derived metadata line with domain, page type, and categories
- content excerpt when content search is enabled or relevant

Default presentation remains a flat result list.
Grouping is a display enhancement, not a hard mode shift.
The page may visually cluster results when multiple adjacent items belong to the same domain or type, but relevance remains the primary mental model.

### Zero-Result Handling

When no results are found, the page should provide:
- the preserved query
- active filters that can be removed quickly
- a clear “broaden search” path
- nearby or relaxed-match suggestions when cheap to derive
- syntax hints if the query includes advanced operators

## Query Syntax

Support a restrained advanced syntax:

- quoted phrase:
  - `"Do Uspil"`
- exclusion:
  - `-Lateralen`
- field prefixes:
  - `title:`
  - `category:`
  - `path:`
  - `type:`

Everything outside these operators remains free-text query input.

Examples:
- `title:"Do Uspil"`
- `category:Religion -Lateralen`
- `path:Sodili type:article`

`path:` matches the normalized content-relative path, including individual path segments.
It is a structural filter and is intentionally more precise than the derived `Bereich` facet.

Deliberately out of scope:
- boolean expression trees
- nested groups
- wildcard mini-language
- range operators

### Query Semantics

The parser must use deterministic semantics.

#### Token Classes

The raw query is parsed into:
- free-text terms
- quoted phrases
- exclusions
- field filters

#### Prefix Binding

A field prefix binds only to the next syntactic unit:
- next quoted phrase, or
- next single token

Examples:
- `title:"Do Uspil" foo`
  - title phrase filter: `Do Uspil`
  - global free-text term: `foo`
- `category:Religion category:Politik`
  - two category filters
- `path:Sodili Lateralen`
  - path filter: `Sodili`
  - global free-text term: `Lateralen`

#### Repeated Filter Semantics

Repeated field filters are OR within the same field:
- `category:Religion category:Politik`
  - matches pages with either category
- `type:article type:index`
  - matches either page type

Different filter fields combine with AND:
- `path:Sodili type:article`
  - must match both path and page type

`path:` and `Bereich` are not synonyms:
- `path:` filters raw normalized structural path content
- `Bereich` filters derived top-level domain keys used for the user-facing facet

#### Free Text Semantics

Free-text terms and quoted phrases participate in ranking and candidate selection.
They do not create hard field restrictions unless they are attached to a field prefix.

#### Exclusion Semantics

Exclusions apply globally after structured filters are resolved and before final scoring output.
If any exclusion matches a candidate in title, categories, path-derived labels, or searchable content, the candidate is removed.

#### UI Filter Merge Rules

UI-selected filters and query-syntax filters merge by field.

Rules:
- query-syntax filters remain visible as active chips
- UI filters in the same field are OR-added to the same field set
- different fields remain AND-combined
- clearing a chip removes only that filter source

Example:
- query: `path:Sodili`
- UI page type filter: `article`
  - result set must satisfy:
    - path in `Sodili`
    - type in `article`

This keeps syntax and UI behavior aligned and testable.

## Architecture

### Derived Search Model

Introduce a single cached derived search model built from existing wiki pages.

Each indexed record should include:
- title
- href
- categories
- extracted content text
- page class
- normalized path
- raw path segments
- normalized domain key
- display domain label
- precomputed fields used for ranking and filtering

The model should also cache facet catalogs and counts for:
- categories
- domains
- page classes

### Query Pipeline

The search pipeline should become explicit:

1. Parse the raw query into:
   - free-text terms
   - quoted phrases
   - exclusions
   - field filters
2. Resolve filter state from:
   - query syntax
   - UI filters
3. Apply hard filters before scoring.
4. Score remaining candidates with field-aware weighting.
5. Apply requested sort mode.
6. Build display payload:
   - title highlights
   - excerpts
   - active filters
   - facet counts
   - zero-result suggestions

### Ranking

Keep Fuse as the base scorer, but wrap it in explicit query planning and post-processing rather than relying on one raw search string.

Field weighting should continue to prefer:
- title
- categories
- content

Title must always participate in candidate selection and ranking.
Category and content participation may be toggled by the UI scope controls.

Phrase hits and exact structured filters should be allowed to boost ranking without replacing the existing fuzzy baseline entirely.

### Highlighting

Highlighting should continue using controlled matching rules rather than raw Fuse character scatter.

For both titles and excerpts, prefer:
1. exact normalized phrase match
2. exact token matches
3. constrained fuzzy word fallback for longer tokens only

This keeps typo tolerance while preventing noisy highlights for short multi-word queries.

### Preview Search

Preview search remains intentionally narrower and faster than the full search page.

Preview should:
- stay compact
- reuse the same derived search model
- use a limited result count
- support title-first behavior
- render the same controlled title highlighting

It should not attempt to expose the full filter or grouping experience.

## Data Derivation Rules

### Domain / Bereich Labels

Domains are derived from path structure, then normalized for display.

Rules:
- use stable path branches, not ad hoc snippet content
- start from the content-relative path
- discard the filename leaf (`index.md` or article filename)
- ignore utility routes and non-content search routes
- choose the first meaningful path branch beneath `content/` as the primary domain key
- if that branch is empty, the page belongs to a fallback root domain such as `Allgemein`
- normalize for display by:
  - replacing underscore separators with spaces
  - trimming trailing structural underscores
  - preserving existing transliteration where it is part of the actual stored path
  - title-casing only when the existing branch naming does not already encode the intended label
- media/gallery branches should derive their domain from the nearest non-media ancestor branch
- domain normalization must be implemented as one helper with regression tests, not duplicated across UI and API

Examples:
- `content/Volk_/Lateralen_/Sodili/index.md`
  - domain key: `volk`
  - domain label: `Volk`
- `content/Himmelskoerper_/index.md`
  - domain key: `himmelskoerper`
  - domain label: `Himmelskoerper`
- `content/index.md`
  - fallback domain label: `Allgemein`

### Category Facets

Category facets are derived from the categories already attached to pages.
They should be precomputed into a stable catalog with counts rather than recomputed separately in each UI path.

### Page Type Facets

Use the existing page presentation/classification system as the source of truth.
This avoids inventing a second page-type taxonomy.

## API Changes

Upgrade the search API payload to include:
- parsed query state
- result list
- facet catalogs with counts
- sort mode
- active filters
- optional nearby/relaxed suggestions

The API should be usable by both:
- the full search page
- the compact preview search

Preview mode can continue to request a reduced payload.

### API Contract

The API contract must be explicit and stable.

#### Full Search Response

`GET /api/search` returns an object:

```ts
type SearchApiResponse = {
  query: string;
  parsedQuery: {
    freeTextTerms: string[];
    phrases: string[];
    exclusions: string[];
    fieldFilters: {
      title: string[];
      category: string[];
      path: string[];
      type: string[];
    };
  };
  activeFilters: {
    domains: string[];
    pageTypes: string[];
    categories: string[];
    includeTitle: boolean;
    includeCategories: boolean;
    includeContent: boolean;
  };
  sort: 'relevance' | 'title-asc' | 'domain';
  facets: {
    domains: Array<{ key: string; label: string; count: number }>;
    pageTypes: Array<{ key: string; label: string; count: number }>;
    categories: Array<{ key: string; label: string; count: number }>;
  };
  suggestions: {
    broadenSearch: boolean;
    removeFilters: string[];
    nearbyQueries: string[];
  };
  results: SearchResultPayload[];
  };
```

`includeTitle` is always `true`.

`activeFilters.domains` contains derived `Bereich` domain keys only.
`parsedQuery.fieldFilters.path` contains explicit `path:` query filters.

`SearchResultPayload` includes:
- serialized page item
- title highlight ranges
- excerpts
- derived metadata fields needed by the UI

#### Preview Response

`GET /api/search?preview=true` returns an object, not a bare array:

```ts
type SearchPreviewResponse = {
  query: string;
  results: Array<{
    item: string;
    titleHighlights?: [number, number][];
  }>;
};
```

Preview intentionally omits:
- facets
- parsed query details
- suggestions
- full excerpt payload

This prevents shape drift between preview and full search while keeping the preview transport small.

## UI Changes

Files likely affected:
- `app/src/lib/searchCore.ts`
- `app/src/lib/wiki.ts`
- `app/src/routes/api/search/+server.ts`
- `app/src/routes/content/search/+page.server.ts`
- `app/src/routes/content/search/+page.svelte`
- `app/src/lib/components/Searchbar.svelte`
- `app/src/lib/components/SearchEntry.svelte`

Additional helper modules are expected for:
- query parsing
- facet derivation
- sort/group helpers
- result formatting

## Testing Strategy

The implementation must be regression-oriented and modular.

Add focused tests for:
- query parser behavior
- phrase handling
- exclusions
- field prefix handling
- prefix binding rules
- repeated filter OR behavior
- cross-field AND behavior
- UI-filter and query-filter merge behavior
- path-to-domain normalization
- category facet derivation
- page type facet derivation
- ranking expectations for common wiki queries
- title highlighting behavior
- excerpt highlighting behavior
- zero-result fallback behavior
- search page/server payload contract

Zero-result behavior must be testable with explicit rules:
- `broadenSearch` becomes `true` when at least one hard filter is active or at least one exclusion is present
- `removeFilters` lists active hard filters in a stable order
- `nearbyQueries` appears only when:
  - the parsed query has at least one non-empty free-text term or phrase
  - total results are zero
  - a relaxed query produced at least one result

Allowed relaxed strategies, in order:
1. remove exclusions
2. disable content/category/path/type hard filters from UI
3. drop field prefixes while preserving free text

Do not invent spelling suggestions from external data.

Verification should include:
- targeted esbuild-based regression tests for the new helpers
- `yarn run check`
- `yarn run build`

## Implementation Plan Shape

Recommended slices:

1. Introduce derived search model and query parser.
2. Add facet derivation, sorting, and API contract changes.
3. Rebuild the full search page UI around facets, sorting, and active filters.
4. Align preview search with the shared model.
5. Add regression coverage and polish zero-result behavior.

## Risks

- Path-derived domains may be structurally accurate but still feel imperfect as user-facing concepts.
- Ranking complexity can grow quickly if too many boosts are layered at once.
- Query syntax can become confusing if surfaced too aggressively.
- Search UI scope can sprawl if grouping and faceting are overbuilt.

## Risk Mitigations

- Keep normalization rules deterministic and test-backed.
- Limit syntax to phrases, exclusion, and four field prefixes.
- Preserve relevance as the default sort and mental model.
- Keep preview intentionally narrow.
- Prefer explicit helper modules over growing one large search file.
