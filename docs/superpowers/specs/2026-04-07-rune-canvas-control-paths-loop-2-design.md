# Rune Canvas Control Paths Loop 2 Design

## Goal

Increase the readable control complexity of the `/dev/runes` canvas by making relationship and control paths the primary visual reading layer.
This loop should make the rune image communicate more of the control chain itself before a later loop deepens the distinction between the effect forms.

## Problem

The inspector UI is now substantially cleaner, but the canvas still under-carries the semantic complexity described by the surrounding text.
In the current state:

- control relations are visible, but they still read mostly as decorative path variants
- different relation modes are not yet separated strongly enough in reading priority
- complex runes still communicate much of their logic in the right-side text rather than in the rune image
- the eye still reads "which forms exist" more easily than "how control propagates"

This means the canvas remains less lore-expressive than the data model and the panel text around it.

## Scope

This loop is intentionally focused on control-path readability.
It should address:

- stronger geometric differentiation between relation modes
- stronger visual separation between control paths and form bodies
- clearer readable flow between checking, switching, return, and sealing paths
- path emphasis and drawing order that support causal reading

It should not yet address:

- a full redesign of primitive shape geometry
- a major change to the canonical runic model
- a broader inspector layout change
- large additions to legend or side-panel taxonomy beyond what is needed to support path reading

## Priority Order

This loop follows the agreed sequence:

1. visible relationship and control paths first
2. stronger distinction between effect forms second

That means path geometry and path reading get priority over shape redesign.

## Review Findings Driving This Loop

The post-loop-1 review still shows that the canvas lags behind the semantic structure.
In particular:

- the canvas scaffold is stable, but the control chain is still too easy to miss
- path differences exist, but they do not yet dominate reading strongly enough
- the rune image still yields less control information than the accompanying text

This loop exists to close that gap by turning relations into a more explicit reading layer.

## Proposed Approach

Use geometry-first differentiation for relation modes, with styling as reinforcement rather than the main signal.

The path modes should stop behaving like minor decorative variations of one generic line language.
Instead, each relation mode should read as a distinct kind of runic guidance:

- `strahl` as direct, decisive propagation
- `bogen` as shell-bound or enclosing flow
- `strahlbogen` as controlled redirection
- `bruecke` as visible cross-coupling between regions

The viewer should be able to infer more of the control sequence from the image before reading the textual explanation.

## Geometric Strategy

### `strahl`

This mode should read as the most direct path class.

It should likely:

- favor strong directional movement
- minimize decorative curvature
- feel like deliberate propagation from one control point toward another

### `bogen`

This mode should read as shell-related binding or curved containment rather than as a generic alternate line.

It should likely:

- hug shell logic more strongly
- reinforce the circular order of the rune
- feel less like direct discharge and more like guided circumferential relation

### `strahlbogen`

This mode should read as a mixed control maneuver rather than a small variant of either parent type.

It should likely:

- visibly pivot or redirect in a way that implies conditional steering
- preserve readable relation between direct propagation and controlled curvature

### `bruecke`

This mode should read as a transverse coupling relation.

It should likely:

- feel recognizably cross-cutting
- stand apart from shell-following and radial propagation
- make it clear that two otherwise separate regions are being linked or coordinated

## Styling Strategy

Style differences should support geometry, not replace it.

Useful supporting signals may include:

- stroke weight
- opacity
- dash usage only where meaningfully justified
- controlled color separation by relation class
- z-ordering between paths and shapes

The goal is not decorative flourish.
The goal is to make the control-path class legible even before reading labels.

## Drawing Order

The rendering order matters for control readability.

This loop should explicitly consider whether:

- some relations should sit beneath forms
- some relations should sit above forms
- shape labels should remain legible without suppressing control-path readability

If all paths remain visually subordinate to filled shapes, the control chain will continue to read as secondary.

## Legend Impact

The legend may need a small update if path reading becomes more important.
However, the loop should avoid turning the right-side legend into the primary carrier of meaning again.

Any legend change should only support the canvas, for example by:

- making relation classes more explicit
- reflecting the new path emphasis without bloating the detail tabs

## File-Level Impact

The implementation should likely center on:

- `app/src/lib/components/runes/RuneCanvas.svelte`

And may need supporting updates in:

- `app/src/lib/components/runes/RuneLegend.svelte`
- `app/src/lib/components/runes/runePresentation.ts`
- `app/src/lib/components/runes/runePresentation.test.ts`
- `app/e2e/rune-inspector.spec.js`

Only make changes outside those files if the path model cannot be made readable otherwise.

## Success Criteria

This loop is successful when:

- the viewer can distinguish relation modes more quickly and more confidently
- the canvas communicates more of the control chain without relying on the side text
- complex runes read more as guided systems and less as a set of colored parts
- path geometry and path emphasis clearly outperform the previous decorative-line feel
- the result remains honest as a reduced 2D reading of a richer structure

## Rejected Directions

### Shape-first redesign in this loop

Rejected because the agreed priority is control-path readability before stronger form differentiation.

### Pure style-only differentiation

Rejected because simple stroke or color changes are not enough for this kind of diagram.
Geometry must carry more of the reading load.

### Full canvas reinvention

Rejected because this loop should remain reviewable and comparable against the current baseline.

## Residual Risk

Even after this loop, the forms themselves may still be too close to one another in visual identity.
That is acceptable.
The goal here is to make the control chain read more clearly first, so that the following loop can refine the shape language on top of a stronger relation structure.
