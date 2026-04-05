# Runic Structure Tooling Design

## Goal

Create a small, extensible tooling slice for defining and inspecting runic structures.
The first slice must establish a canonical runic file format, a reusable structure library, and a browser-based inspector that renders the current 2D projection of those definitions.

This is not an editor project yet.
The first slice is an authoring and inspection foundation that supports incremental worldbuilding work on the runic language.

## Context

The runic language is being developed as a formal system for the setting rather than as loose illustration.
The working model currently assumes:

- the runic system can function in 2D, though in a reduced form
- the full system may later expand toward 3D structures
- runes should be describable independently of any single renderer or application
- the current web app is the first consumer, not the owner, of the data model

The immediate need is therefore not freehand drawing but a stable workflow for defining primitives, combined structures, and full runes in a machine-readable and human-reviewable form.

## Constraints

- The canonical data format must be application-agnostic.
- The first implementation must target 2D visualization, but the model must not block future 3D extension.
- The web app must consume the canonical files rather than defining the runes internally.
- The first slice must support multiple primitives, multiple reusable structures, and multiple complete runes.
- The first slice must not include a graphical editor.
- The first slice must be easy to extend with additional primitives, ontological classes, and projection rules.
- The eventual workflow must support later skill automation, so the model and directory layout must remain predictable.

## Decision

The first implementation will use a parallel vertical slice:

- a canonical JSON document format for runic definitions
- JSON Schema validation for those documents
- a dedicated runic library directory outside the app
- a SvelteKit inspector route that loads those documents and renders a 2D SVG projection
- a small initial inventory of primitives, structures, and complete runes

The first slice will deliberately stop before direct manipulation, drag-and-drop editing, or a domain-specific text language.

## Core Principle

There are two separate but connected layers:

1. Canonical runic definition layer
   A stable data model stored as JSON documents and validated by schema.
2. Application projection layer
   Web-app-specific loading, presentation, and SVG rendering derived from the canonical model.

The app is allowed to derive view models from the canonical data.
It is not allowed to become the source of truth for runic definitions.

## Canonical File Organization

The runic system will live in a top-level `runes/` directory:

- `runes/schema/`
- `runes/primitives/`
- `runes/structures/`
- `runes/runes/`
- `runes/index/`

Purpose of each directory:

- `schema/`
  Holds JSON Schemas used to validate runic documents.
- `primitives/`
  Holds one primitive definition per file.
- `structures/`
  Holds one reusable composed structure per file.
- `runes/`
  Holds one complete rune per file.
- `index/`
  Holds collection and navigation documents for library grouping and future automation.

This layout must remain app-neutral so that future tools or skills can consume the same library.

## Canonical Format

### Format Choice

The canonical format will be plain JSON.

Reasons:

- it is strict and widely supported
- it is easy to validate with JSON Schema
- it is easy for future tools and skills to read and write
- it avoids locking the runic system into the current app or language runtime

TypeScript may define app-local reader types, but TypeScript objects are not the canonical source format.

### Document Granularity

The library will use one definition per file:

- one primitive per file
- one composed structure per file
- one full rune per file

Collection metadata will live separately in index documents.

This keeps reuse and versioning simple and avoids large monolithic files.

### Index Authority

`runes/index/` is authoritative for library discovery and navigation in the first slice.
The app should not discover runic documents by ad hoc recursive directory scanning.

Index documents exist to provide:

- stable ordering
- grouping by document kind
- curated visibility in the inspector
- predictable inputs for later automation and skills

The source of truth for a definition remains the referenced per-file JSON document.
The source of truth for library membership and inspector discovery is the relevant index document.

This intentionally accepts explicit registration work in exchange for deterministic behavior and avoidance of stale implicit discovery rules.

## Data Model Shape

The first schema cut should stay intentionally small.
It must be large enough to support real inspection and composition, but not so large that it encodes future editor requirements prematurely.

### Required Top-Level Concepts

Each runic document needs:

- document identity
- document kind
- semantic meaning
- topological structure
- geometry
- canonical 2D projection description
- compositional references

### Conceptual Sections

The model should separate these concerns:

1. Metadata
   Document id, name, version, description, and kind.
2. Semantics
   Ontological classes, process roles, and constraints.
3. Topology
   Elements, relations, layers, and flow assumptions.
4. Geometry
   Renderer-neutral spatial placement.
5. Projection
   Canonical renderer-agnostic 2D projection description.
6. Composition
   Imports and instantiated substructures.

### Minimum Required Fields

The first slice must define one shared core contract plus document-kind-specific requirements.

Shared required top-level fields:

- `id`
- `name`
- `kind`
- `version`
- `description`
- `semantics`
- `topology`
- `geometry`
- `projection2d`

Optional top-level fields:

- `constraints`
- `imports`
- `instances`
- `notes`

The first slice should support these `kind` values:

- `primitive`
- `structure`
- `rune`

Minimum kind-specific expectations:

- `primitive`
  Must define its own local elements, local topology, and a self-contained canonical 2D projection.
- `structure`
  May define local elements directly and may also compose imported definitions through `instances`.
- `rune`
  Must represent a complete assembled definition and may combine direct local definitions with imported instances.

### Reference Format

Composition references must be explicit and file-stable.
The first slice should use document ids as canonical cross-document references.
Index documents map library groupings to those ids, and app-side loading resolves ids to files through the index layer.

This avoids file-path coupling in the canonical structure definitions and keeps renames manageable.

### Dimensions

The geometry model should be designed to grow into 3D without rethinking the whole format.
For the first slice, only 2D coordinates are required operationally, but the geometry model should avoid assumptions that only make sense in a flat SVG-specific world.

In practice this means:

- geometry must be stored in neutral coordinate structures
- rendering-specific SVG path logic must stay in the app layer
- 2D projection data may exist, but it must be clearly distinguished from the canonical geometry

### Projection Boundary

The first slice deliberately keeps a canonical 2D projection description inside each runic document.
This is not a contradiction of the canonical/app separation.
It is part of the canonical runic definition because reduced 2D readability is itself part of the lore and working model.

Allowed in canonical `projection2d`:

- radial layer assignments
- sector assignments
- sector spans
- layer spans
- canonical orientation metadata
- renderer-neutral shape families
- renderer-neutral relation path modes

Not allowed in canonical `projection2d`:

- raw SVG path strings
- CSS classes
- concrete colors for app styling
- pixel-tuned screen coordinates
- app layout metadata such as panel state or inspector preferences

The app is responsible for deriving final SVG primitives, labels, visual styling, and interaction state from the canonical projection description.

### Radial Projection System

The canonical 2D projection model for the first slice uses a discrete radial system centered on the runic core.

The projection system must include:

- concentric layers
- eight named sectors
- optional offsets and spans within those layers and sectors
- an orientation frame that describes how the projection is embedded relative to the physical world

The sector system is not decorative.
It is a reduced 2D expression of vendotic syntax.

### Sector Axes

The first slice defines eight sectors through three binary axes:

1. Gravitative mode
   - `hebend`
   - `senkend`
2. Polar mode
   - `polwaerts`
   - `feldwaerts`
3. Rotative mode
   - `fortlaufend`
   - `gegenlaufend`

These three binary axes produce the eight named sector classes used in canonical 2D projection.

### Sector Set

The first slice should use this sector set and treat the names as canonical:

- `auslass`
- `lenkung`
- `entfaltung`
- `spaltung`
- `praegung`
- `siegelung`
- `sammlung`
- `begrenzung`

These sectors are positions with weak functional tendencies, not hard single-word meanings.
Concrete meaning still depends on primitive kind, radial position, topology, and composition.

### Sector Oppositions

The sector model should preserve four opposition pairs:

- `auslass` ↔ `begrenzung`
- `lenkung` ↔ `sammlung`
- `entfaltung` ↔ `siegelung`
- `spaltung` ↔ `praegung`

Opposition is defined by inversion across the three binary sector axes, not by arbitrary placement.

### Orientation Frame

Vendos is treated as the syntax and semantics of ordered magical form, not as a global directional field.
Therefore, physical orientation must be represented separately from vendotic structure.

The first slice should model a canonical 2D orientation frame that can later grow without breaking compatibility.
At minimum, the orientation frame must allow the definition to state how its projected sector system is embedded relative to physical conditions such as local gravity and any target-facing anchor orientation.

The exact field names can be finalized in the implementation plan, but the schema and plan must preserve this distinction:

- vendotic structure defines meaning
- physical orientation defines embedding and operational alignment

## Initial Semantic Inventory

The first slice should include these ontological classes:

- `substrat`
- `fluss`
- `leib`
- `geist`
- `ort`
- `bindung`
- `grenze`
- `wandel`
- `potenz`

The first slice should include these primitive structure kinds:

- `leitbahn`
- `drossel`
- `kammer`
- `gabel`
- `anker`
- `mantel`
- `sperre`

`ruecklauf` is intentionally deferred to a later slice so that the first model does not take on more flow complexity than necessary.

## Initial Library Content

The first slice must include enough content to prove the system works as a library instead of a single demo.

### Primitive Definitions

Create one canonical file for each initial primitive kind.

### Reusable Structures

Create at least two reusable composed structures.
Representative examples discussed during design:

- a bound channel form
- a protected outlet form

These are examples of scope, not final lore canon.
Names may change during implementation if a cleaner formal naming convention emerges.

### Complete Runes

Create at least two complete runes that reuse primitives and composed structures rather than redefining everything inline.

The goal is to prove:

- the document format
- library indexing
- composition mechanics
- visual comparison in the inspector

## Inspector Design

The first web consumer will be a dedicated development-facing inspector route inside the existing SvelteKit app.

### Purpose

The inspector is a review and tuning surface.
It allows the user to browse the library, inspect a definition, compare its semantic model to its 2D projection, and refine the visual language incrementally.

### Required Panels

The first slice should provide four core views:

1. Library panel
   Browse primitives, structures, and complete runes.
2. Canvas panel
   Show the current 2D SVG projection.
3. Structure panel
   Show topology, semantic roles, and composition data.
4. Projection panel
   Show projection-specific interpretation of the canonical model.

An additional legend panel is recommended for primitive kinds and ontology classes if the layout remains readable.

### Route Placement

The inspector should live in a development-oriented route rather than being mixed into normal content browsing.
A `dev` route namespace is appropriate for this first slice.

## Rendering Architecture

The app should read canonical JSON documents and transform them through a small, explicit pipeline:

1. Load index documents and referenced runic files
2. Validate documents against schema
3. Normalize them into app-local reader types
4. Derive projection-ready view models
5. Render those view models as SVG in Svelte components

Important rule:
The canonical JSON files must not contain raw SVG path commands or app-only styling details unless later experience proves that absolutely necessary.
The rendering layer should interpret neutral structures into SVG.

## Workflow for New Structures

The first slice should establish the workflow that later authoring and automation will follow:

1. Add a new canonical JSON definition
2. Validate it against schema
3. Add it to the relevant library index
4. Open it in the inspector
5. Review semantic structure and 2D projection together
6. Refine the definition or the renderer as needed
7. Treat the result as reusable library material only after inspection passes

This workflow is more important than raw feature count.
The project needs repeatable structure definition, not only a one-off demo.

## Future Extension Boundaries

This design is intentionally preparing for later expansion, but does not implement it yet.

### Explicitly Deferred

- direct graphical editing
- drag-and-drop or handle-based manipulation
- a custom textual rune DSL
- 3D rendering
- physical flow simulation
- automated rune generation skills

### Planned Compatibility Targets

The first slice should remain compatible with:

- future 3D coordinates or layered geometry extensions
- future editor-specific view metadata
- future import/export tooling
- future runic authoring skills that emit canonical JSON documents

## Verification Strategy

The first slice should be considered successful when all of the following are true:

- canonical JSON files exist for primitives, structures, and runes
- those files validate against schema
- the inspector route can browse and display the library
- at least two complete runes render from canonical data
- the inspector clearly separates canonical structure from 2D projection
- adding a new structure is straightforward and localized

The focus of verification should be correctness of the pipeline and clarity of the authoring workflow, not polished final visuals.

## Recommended Implementation Order

1. Create the canonical directory layout under `runes/`
2. Write the first JSON Schema
3. Create initial primitive documents
4. Create initial structure and rune documents
5. Build app-side loading and schema validation
6. Build projection derivation and SVG rendering
7. Build the inspector route and panels
8. Refine the initial library and visual output with live inspection

## Follow-Up

After this design is approved in written form, the next step is a dedicated implementation plan for the tooling slice only.
The later skill for rune creation should be planned only after the canonical format, workflow, and inspector have proven stable in practice.
