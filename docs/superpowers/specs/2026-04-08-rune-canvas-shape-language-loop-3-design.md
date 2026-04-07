# Rune Canvas Shape Language Loop 3 Design

## Goal

Increase the readable distinctness of the rune form language in the `/dev/runes` canvas by giving the main control-oriented shape families visibly different projected bodies.
This loop should make the rune image communicate more of the difference between thresholding, checking, switching, return, and sealing directly in the form silhouettes rather than mainly through color and text.

## Problem

The previous loop made relation and control paths substantially easier to read.
That improved the control chain, but the form bodies still lag behind the semantic model.

In the current state:

- most shape families still read as colored variants of one shared band geometry
- control-heavy families are named clearly in the side panels, but remain only weakly differentiated in the image itself
- the canvas still relies too heavily on labels and legend support to explain what the main forms are doing
- a complex rune now has stronger path logic, but its form language still under-expresses the role of each control body

This means the rune image still does not fully match the lore-facing complexity now carried by the model and inspector text.

## Scope

This loop is focused on shape-language differentiation for the control-oriented families that now carry most of the visible rune logic.
It should address:

- stronger silhouette differentiation between the main control families
- shape generation that expresses runic function through geometry rather than only fill color
- preservation of the improved relation-path reading from the previous loop
- a tighter link between visible body shape and lore-facing control role

It should not address:

- a redesign of the canonical runic document model
- a full rewrite of all primitive and support families
- major inspector layout changes
- ornament-heavy decoration that only disguises the shared band base

## Priority Families

This loop should prioritize the five control-oriented families in this order:

1. `schwelle`
2. `pruefkammer`
3. `weiche`
4. `rueckfuehrung`
5. `siegelpfad`

These families should be treated as the main targets because they carry the highest lore-relevant control meaning in the currently complex example runes.
If they become immediately distinguishable, the semantic gain is larger than improving the more neutral support families first.

## Rejected Primary Strategy

Pure ornamentation is not enough.
Adding notches, markers, or decorative accents on top of the current shared band body would risk repeating the same weakness the relation paths had before the previous loop.

This loop should therefore prefer geometric differentiation first.
Ornamental or internal detail may support the result, but should not be the main signal.

## Proposed Approach

Use a mixed strategy with a strong geometry bias:

- give the priority control families their own primary silhouette logic where needed
- allow limited shared band foundations only where a family still ends up visually distinct
- use internal cutouts or contour modulation only when they reinforce an already distinct body

This avoids a full all-families reinvention while still creating real visual separation for the forms that matter most right now.

## Shape-Language Direction

### `schwelle`

This family should read as constricting, thresholding, or arresting flow.

It should likely:

- narrow or compress across its span
- feel like a crossing constraint rather than an open channel body
- imply resistance, gating, or a change in admissibility

### `pruefkammer`

This family should read as a contained checking body rather than a generic segment.

It should likely:

- feel chambered or enclosed
- show an inner differentiated zone or inspected core
- imply collection and evaluation before onward propagation

### `weiche`

This family should read as switching or diverted guidance.

It should likely:

- become asymmetrical
- suggest branching, steering, or deflection
- feel directionally biased instead of radially neutral

### `rueckfuehrung`

This family should read as return, re-entry, or recovery of flow.

It should likely:

- bend back into itself or visibly curl inward
- suggest reversal or recapture
- avoid reading like just another outward-propagating body

### `siegelpfad`

This family should read as sealing, closure, or active suppression.

It should likely:

- feel more abrupt or hard-edged
- present a terminating or closing contour
- imply blockage, containment, or enforced completion

## Technical Strategy

The shape-language logic should live in `runePresentation.ts`, not in `RuneCanvas.svelte`.

That means:

- replace the current one-shape-fits-all band path generation with shape-family-aware path builders
- keep the canvas component focused on rendering, layering, and styling
- preserve the existing presentation pipeline as the place where runic projection becomes visible geometry

This keeps the responsibilities clear:

- `runePresentation.ts` decides how a projected runic body is formed
- `RuneCanvas.svelte` decides how that body is drawn and layered

## Rendering Constraints

The new form language should stay honest to the existing reduced-projection premise.
The goal is not to fake a full 3D structure.
The goal is to make the 2D projection more truthful about functional differences inside the rune.

This means the shapes should still:

- respect shell and sector placement
- remain compatible with the current projection framework
- keep labels and relation paths readable
- avoid drifting into arbitrary emblem design detached from the runic projection system

## Legend Impact

The legend may need only a minor update, if any.
If the new shapes become clearly distinguishable in the image itself, the legend should remain secondary.

Any legend change should only:

- support recognition of the new control families
- avoid becoming the primary explanatory carrier for the new shape language

## File-Level Impact

The implementation should likely center on:

- `app/src/lib/components/runes/runePresentation.ts`

And will likely need changes in:

- `app/src/lib/components/runes/RuneCanvas.svelte`
- `app/src/lib/components/runes/runePresentation.test.ts`
- `app/e2e/rune-inspector.spec.js`

`RuneLegend.svelte` should only change if the visual review shows a real support gap.

## Success Criteria

This loop is successful when:

- the priority control families are distinguishable by shape, not only by color or label
- the complex rune reads more like a structured system of different control bodies
- the improved path reading from loop 2 remains intact
- the canvas communicates more of the semantic role of each body before the user reads the right-side text
- the result still reads as a reduced 2D projection of a richer runic structure rather than as freeform icon art

## Review Standard

The closing review should focus on:

- whether the five priority families are visibly more distinct in the complex rune view
- whether the new shapes support the control narrative rather than competing with it
- whether labels and relations remain readable after the geometry becomes more differentiated
- whether the inspector now communicates more of the rune through the canvas itself

## Residual Risk

Even after this loop, some non-priority support families may still feel too close to one another.
That is acceptable.
This loop should optimize for the control-heavy families first and only broaden the visual vocabulary further if review proves that the remaining overlap is still materially limiting.
