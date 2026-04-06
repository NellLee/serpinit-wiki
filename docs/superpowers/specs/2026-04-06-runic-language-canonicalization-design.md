# Runic Language Canonicalization Design

## Goal

Align the runic language implementation with the lore by making the canonical runic model itself express greater complexity, power, and internal coherence.
The model must stop behaving like a renderer-shaped technical schema with lore annotations.
Instead, it must become a lore-first formal language whose structure, terminology, and example runes are all consistent with the established runic canon.

## Problem

The current implementation successfully establishes a first tooling slice for canonical runic files, validation, and inspection.
However, the canonical layer still reflects a strong hybrid between internal app terminology and lore terminology.
This creates three problems.

First, the existing runic documents feel too diagrammatic and too flat relative to the lore.
They represent components and paths, but they do not yet express the degree of conditional execution, control logic, and built-in operational nuance described in the wiki.

Second, the current terminology is not canonically clean.
The canonical files and schema contain a visible mixture of English renderer-oriented words and lore terms.
That weakens the credibility of the runic language as an in-world formal system.

Third, the structure currently risks separating form from function.
The lore describes runes as integrated magical structures whose geometry, ordering, and relationships are themselves the control logic.
The implementation must therefore avoid treating control as a separate software-like layer bolted onto otherwise passive shapes.

## Lore Constraints

The design must remain fully aligned with the established lore in [content/Allgemein/Magie/Sgrisignier-Runen.md](/D:/My_Files/Programming/serpinit-wiki/content/Allgemein/Magie/Sgrisignier-Runen.md).
The most important constraints are:

- runes are read from the core outward
- runes are integrated structures of channels, nodes, and control patterns
- greater complexity means more conditions, feedbacks, and control logic
- the full rune is three-dimensional, while the visible 2D form is only a reduced but real projection
- the meaning of a part depends on radial position, neighboring structures, and total embedding
- modern peoples work mostly with reduced 2D forms rather than full original Sgrisignier complexity

These constraints mean that the model must represent control as part of the runic body itself.
The rune must remain one coherent structure, not a geometry model plus an external execution graph.

## Design Principles

### 1. Lore-first canonical language

The canonical JSON documents under `runes/` are the source of truth for the runic language.
They must use lore-aligned German terminology by default.
Artificial specialist vocabulary is acceptable only where it genuinely improves canonical precision and still feels like runic scholarship rather than app engineering.

English terms must not remain part of the canonical runic language.
If the app needs technical helper terminology for rendering or presentation, that terminology must exist only in derived internal code, never in the canonical files.

### 2. Integrated structure and function

Runic control logic must not be modeled as a separate control subsystem alongside topology.
Instead, the rune remains a single integrated structure.
Its elements and relations are intrinsically functional.

That means:

- a runic component is never only shape
- a runic path is never only connection
- control, gating, checking, throttling, sealing, and later feedback are all embodied in runic forms and relations

The result should feel like a real formal magical notation rather than a software flowchart drawn onto a rune.

### 3. Canonical complexity before visual polish

The next step must prioritize the expressive power of the canonical model rather than superficial inspector polish.
The inspector should be improved only after the runic language can actually encode richer logic.

### 4. Reduced 2D honesty

The 2D model must continue to present itself as a reduced projection of a richer runic structure.
It should become more informative, but it must not falsely imply that the visible 2D shadow fully captures the total rune.

## Proposed Canonical Direction

### Keep a single runic structure model

The existing topological heart of the model should remain the main basis of the runic document.
The design should not introduce a separate parallel `controlModel`.

Instead, the canonical structure should be expanded so that:

- elements carry inherently operative meaning
- relations carry inherently operative meaning
- more kinds of runic forms can express more kinds of controlled behavior

This keeps the runic language unified and lore-consistent.

### Expand the primitive vocabulary with controlling forms

The current primitive vocabulary is not yet strong enough to express lore-appropriate conditionality and control.
The canonical language should therefore gain a compact set of new first-class controlling structure types.

Recommended new core forms:

- `schwelle`
- `pruefkammer`
- `weiche`
- `rueckfuehrung`
- `siegelpfad`

These names are intentionally lore-first and describe runic forms that are both structural and operative.

Their intended roles are:

- `schwelle`
  expresses threshold-dependent passage or activation
- `pruefkammer`
  expresses checking, comparison, or validation before propagation
- `weiche`
  expresses conditional redirection into different paths
- `rueckfuehrung`
  expresses controlled return movement that later supports stabilization and feedback logic
- `siegelpfad`
  expresses deliberate closure, suppression, or terminal sealing behavior

This set should remain intentionally small.
The goal is not to invent a large arbitrary catalog immediately, but to give the runic language enough canonical vocabulary to express more realistic control behavior.

### Build higher-order structures from those forms

Once the primitive vocabulary is extended, the library should gain structure-level compositions that demonstrate how control emerges from ordered runic assembly.

Recommended early structures:

- `gepruefter-auslass`
- `gebundene-umschaltung`
- `substratgekoppelte-pruefung`
- `gedaempfte-rueckfuehrung`

These structures should show that the runic language is not merely naming isolated symbols.
It is assembling meaningful, readable control bodies from known forms.

## Terminology Strategy

### Canonical layer

The canonical layer includes:

- `runes/schema/*.json`
- `runes/index/*.json`
- `runes/primitives/*.json`
- `runes/structures/*.json`
- `runes/runes/*.json`
- `runes/README.md`

This layer must use lore-aligned terminology.

Preferred rule:

- field names and canonical values should be German and lore-near
- specialized terms are acceptable in moderation if they sound like in-world runic scholarship
- English canonical values should be removed

### Derived app layer

The app layer includes:

- [contracts.ts](/D:/My_Files/Programming/serpinit-wiki/app/src/lib/runes/contracts.ts)
- [projection.ts](/D:/My_Files/Programming/serpinit-wiki/app/src/lib/runes/projection.ts)
- [runePresentation.ts](/D:/My_Files/Programming/serpinit-wiki/app/src/lib/components/runes/runePresentation.ts)
- [RuneCanvas.svelte](/D:/My_Files/Programming/serpinit-wiki/app/src/lib/components/runes/RuneCanvas.svelte)

This layer may still use implementation-oriented terminology where necessary.
However, those terms must be explicit derivations from the canonical language and must not define canonical meaning.

In practice, the renderer should adapt to the runic language, not the other way around.

## Data Model Direction

### Preserve the single-body structure

The canonical document should remain organized around one unified runic body.
The design should continue to use a single structural section for the runic arrangement rather than splitting structure and logic into separate domains.

### Strengthen element meaning

Runic elements should evolve from simple typed components into richer operative structures.
The schema should support lore-aligned descriptors for things such as:

- operative role within the rune
- expected activation behavior
- placement in the inward-to-outward sequence
- binding or sealing tendency
- threshold or checking behavior where relevant

These descriptors must still read as part of runic scholarship, not generic software metadata.

### Strengthen relation meaning

Runic relations should also move beyond static containment and linkage.
The language should support more operationally meaningful runic relations that describe behaviors such as:

- directed propagation
- conditional redirection
- suppression
- checking dependence
- controlled return

The exact canonical names should be chosen during implementation, but they must be lore-aligned and German by default.

### Refactor projection terminology

The current projection model contains a mix of useful lore structure and renderer-shaped naming.
Its concepts should be preserved where they genuinely reflect the lore, but the canonical vocabulary should be cleaned.

This especially applies to names such as:

- placement and path terms
- shape grouping terms
- orientation and system descriptors

The canonical projection description should describe a runic reading in lore terms.
The app may derive rendering families or SVG strategies from that later.

## Example Rune Direction

The example runes should be rebuilt so that they no longer read as simple outlet diagrams.
They should visibly encode a richer internal logic appropriate to the lore, even within reduced 2D constraints.

The first revised examples should prioritize:

- conditional release
- checked propagation
- controlled redirection
- sealed or bound outcomes

Only after these are working should the next step deepen explicit feedback and stabilization behavior.

This sequencing matches the requested priority:

1. conditional execution and control logic
2. feedback and stabilization

## Inspector Consequences

The inspector should change only after the canonical model changes.
Once the richer canonical language exists, the inspector should make those distinctions legible by showing more than generic bands and connectors.

It should help a reader distinguish, for example:

- a threshold structure from a passive conduit
- a checking structure from a holding structure
- a switching path from a direct path
- a sealing path from a general boundary

However, the inspector must still present these as reduced readings of a larger runic body, not as a claim to total three-dimensional completeness.

## Documentation Consequences

`runes/README.md` should be upgraded from a primarily technical note into a short runic authoring guide.
It should explain:

- the canonical terminology rules
- the distinction between canonical language and app derivation
- the meaning of the core primitive and controlling forms
- how to compose example structures and runes in a lore-consistent way

This documentation should support future work without turning the runic system into arbitrary pseudo-code.

## Rejected Direction

### Separate structure model and control model

Rejected because it contradicts the lore emphasis that runic structure and runic function are inseparable.
Such a split would make the language feel like geometry plus software logic, which is the wrong mental model for Sgrisignier runes.

### Leave canonical terminology mixed

Rejected because it weakens the credibility of the runic language as an in-world formal system and keeps the source of truth too tightly coupled to renderer concerns.

### Improve visuals before canonical language

Rejected because it would make the inspector more impressive without fixing the deeper mismatch between implementation and lore.

## Success Criteria

The design is successful when:

- the canonical runic files use lore-aligned terminology consistently
- English renderer terms are removed from the canonical source of truth
- the primitive vocabulary can express conditional execution through integrated runic forms
- example structures and runes read as more powerful and internally coherent than the current examples
- the app derives its presentation from the canonical language rather than imposing its own vocabulary on it
- the resulting system still respects the lore that visible 2D runes are reduced projections of a richer total structure

## Implementation Outline

1. Define the canonical terminology migration for schema fields and enum values.
2. Extend the primitive vocabulary with controlling forms.
3. Extend the relation vocabulary with lore-consistent operative relations.
4. Update the TypeScript contracts to mirror the revised canonical schema.
5. Rework the initial primitive, structure, and rune documents to use the cleaned terminology and richer control logic.
6. Update the projection and presentation pipeline to derive visuals from the new canonical language.
7. Expand tests to validate the new schema, terms, and example semantics.
8. Rewrite `runes/README.md` as a lore-aligned authoring guide.
