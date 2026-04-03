# DnD Lore Migration Design

## Goal

Migrate all DnD-derived lore from the wiki into normal canon lore articles so that no DnD framing, rule terminology, session structure, or DnD-specific file remains visible in the wiki afterwards.

## Scope

This migration covers:

- `content/DnD-5e/**`
- all `DnD-5e_*` character, Micu, fauna, and flora sheets in `content/**`
- all explicit textual references to DnD in normal lore articles
- timeline alignment in `timeline/Geschichte.timeline`

This migration does not aim to preserve tabletop mechanics, balancing data, or GM-facing material.

## Canon Rules Confirmed

- Session events should be treated as raw material for true in-world history.
- Concrete session actions should remain canon-capable, but may be adapted.
- Adaptation may be fairly free as long as the core is preserved.
- Cases that are complicated or do not fit directly into canon should be surfaced to the user.
- Existing player characters remain real canonical figures and should persist as such.
- DnD sheets should be fully converted into normal lore and then removed.

## Existing Persistence Model

The repository already persists history in two complementary ways:

1. Markdown lore articles as the primary canon source.
2. `timeline/Geschichte.timeline` as a historical visualization and secondary structured index.

The migration should therefore treat markdown articles as canonical truth and then align the timeline with the resulting historical structure.

## Recommended Structure

### 1. Event-Centered Canonization

DnD session content should be converted into a clean set of in-world historical events. The main historical backbone should live in `content/Ereignis_` and in existing related location and character articles.

Expected outcomes:

- the Ikusation expedition becomes a fully historical sequence rather than a campaign scaffold
- session arcs become event phases, incidents, expeditions, discoveries, conflicts, and aftermath
- references like "the players", DC checks, combat framing, and scenario instructions are removed

### 2. Character Integration

All relevant player characters remain canonical individuals.

Their lore articles should:

- remove class-based or DnD-specific identity labels
- preserve role, personality, motivation, and known biography
- describe their participation in historical events in-world
- absorb any relevant sheet-only information that is worth keeping as lore

### 3. Supporting World Integration

Supporting DnD-only content should be redistributed into:

- location articles
- flora/fauna articles
- event articles
- character articles
- newly created lore articles where the current wiki has no proper home yet

### 4. DnD Artifact Removal

After canonization is complete, the migration should remove:

- `content/DnD-5e`
- all `DnD-5e_*` files
- explicit DnD wording in normal lore pages
- dead links caused by removed DnD files

### 5. Timeline Alignment

The final historical version should be reflected in `timeline/Geschichte.timeline` so the timeline and article network describe the same story.

## Migration Sequence

### Phase 1: Inventory and Extraction

- read all session pages in chronological order
- extract real events, participants, places, discoveries, and unresolved canon gaps
- identify which DnD-only files already overlap with existing lore articles

### Phase 2: Canon Mapping

- map each extracted item to its destination article
- decide which items require:
  - expansion of an existing article
  - creation of a new event article
  - creation of a new location article
  - direct user clarification

### Phase 3: Historical Rewrite

- rewrite session material into in-world history
- preserve established tone and wiki style
- keep markdown valid and preserve project-specific syntax

### Phase 4: Repository Cleanup

- remove obsolete DnD files and DnD labels
- repair links and navigation surfaces
- verify no DnD-facing wording remains in wiki content

### Phase 5: Timeline Update

- add or revise timeline entries for the resulting canon events

## Decision Heuristics

The migration should ask the user before locking in canon when:

- a session outcome materially conflicts with existing lore
- multiple mutually exclusive interpretations are plausible
- a DnD artifact contains information that looks mechanical rather than world-authored
- a major event needs a date or causal placement that cannot be inferred safely

The migration should proceed without asking when:

- a session detail can be restated as normal history with only wording changes
- a DnD class label can be replaced by an existing in-world role
- descriptive creature, flora, or personal details fit naturally into existing canon

## Expected Deliverable

After the migration:

- no wiki-facing DnD section remains
- no article points readers to DnD sheets or sessions
- the former campaign material reads as native world history
- canonical characters remain intact
- unresolved edge cases are either clarified with the user or deliberately left out

## Review Standard

Success means the result feels like the wiki was always written as a worldbuilding encyclopedia rather than adapted from a tabletop campaign archive.
