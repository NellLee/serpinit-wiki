# Runic Library

This directory contains the canonical runic document library for the first tooling slice.

## Directory layout

- `schema/` holds the shared JSON Schema contracts.
- `index/` holds the authoritative discovery index.
- `primitives/` holds one canonical primitive definition per file.
- `structures/` holds reusable composed structures.
- `runes/` holds complete rune documents.

## Authoring rules

- Keep one runic definition per file.
- Treat `runes/index/library.json` as the only authoritative discovery source.
- Reference other documents by stable document id, never by file path inside runic documents.
- Keep the canonical document renderer-agnostic.
- Use `projection2d` only for canonical two-dimensional projection metadata, not for SVG or app-only rendering details.

## Workflow

1. Add or update a canonical JSON document.
2. Keep the document schema-valid against `schema/rune-document.schema.json`.
3. Add or update the matching entry in `index/library.json`.
4. Load the library through the app-side runic loader.
5. Inspect the result in `/dev/runes` and refine structure plus projection together.
6. Re-run app verification before treating the document as stable.

## Current scope

The first slice is centered on canonical 2D projection data with radial layers, named sectors, and explicit orientation-frame metadata.
The document shape is intended to remain extensible toward future three-dimensional projection work.
