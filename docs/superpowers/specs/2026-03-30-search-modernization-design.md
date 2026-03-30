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
- title
- categories
- content

### Sorting

Support these sort modes:
- `Relevanz`
- `Titel A-Z`
- `Bereich`

If implementation cost remains low, `Titel Z-A` may be added as a mirror option, but it is not required.

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

Deliberately out of scope:
- boolean expression trees
- nested groups
- wildcard mini-language
- range operators

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
- strip technical artifacts such as underscores when possible
- convert structural names into user-facing labels
- keep normalization deterministic and testable

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
- path-to-domain normalization
- category facet derivation
- page type facet derivation
- ranking expectations for common wiki queries
- title highlighting behavior
- excerpt highlighting behavior
- zero-result fallback behavior
- search page/server payload contract

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
