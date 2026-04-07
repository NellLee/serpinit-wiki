# Rune Inspector UI Review Loop 1 Design

## Goal

Improve the `/dev/runes` inspector so the first review loop removes avoidable UI noise before deeper canvas-complexity work begins.
This loop focuses on state clarity, layout hierarchy, and viewport legibility rather than on expanding the rune drawing language itself.

## Problem

The current rune inspector is technically functional, but its UI still interferes with visual review.
The main problems observed in direct rendered review are:

- the active library selection is too weak
- the selected entry can sit far outside the same viewport as the rendered rune
- the right-side detail information is vertically fragmented into a long stacked column
- the inspector reads more like a long data report than a focused analysis tool

This makes subsequent visual review less trustworthy because the reviewer has to work through avoidable interface noise before judging the rune output itself.

## Scope

This loop is intentionally narrow.
It should address:

- library selection clarity
- library scroll behavior and viewport containment
- right-side detail hierarchy
- overall inspector readability in the initial viewport

It should not yet address:

- a major redesign of the rune canvas
- new rune drawing primitives
- changes to the canonical rune model
- broader site-wide navigation or theming changes

## Review Findings Driving This Loop

The approved review identified four relevant UI issues:

1. The active library selection is visually too weak for a dense inspector.
2. The selected rune entry can sit far below the canvas and detail panels, weakening state discoverability.
3. The right side is split into three stacked detail panels that extend too far downward.
4. The canvas updates correctly, but the surrounding layout makes the active state harder to track than it should be.

This loop is designed to resolve those issues before deeper visual-language work continues.

## Proposed Approach

Use a focused inspector-layout refinement rather than a large redesign.

The inspector should keep its three functional zones:

- left: library
- center: canvas
- right: detail

But those zones should behave more intentionally:

- the library becomes a fixed-height, internally scrollable navigation surface
- the active library item becomes clearly highlighted
- the right side becomes one tabbed detail surface instead of three stacked panels

This preserves the current mental model while removing the biggest readability and navigation issues.

## Layout Design

### Left Library

The library remains in the left column, but it should stop behaving like a long passive document block.

It should:

- have a bounded height relative to the viewport
- scroll internally
- keep group labels readable as the user moves through the list
- make the active entry visually unmistakable

The intent is that selection remains part of the same working surface as the canvas rather than disappearing into a long page scroll.

### Center Canvas

The canvas remains the primary visual focus.
This loop should not fundamentally change the rune drawing model.

However, the surrounding layout should ensure the canvas stays in the first meaningful viewport together with:

- the selected document heading
- the left-side selection context
- the right-side active detail view

The canvas should read as the main artifact under inspection, not as one panel among many equivalent panels.

### Right Detail Surface

The three current detail panels should be collapsed into a single detail area with tabs:

- `Struktur`
- `Projektion`
- `Legende`

This change is the main hierarchy improvement in the loop.

It reduces:

- unnecessary vertical scrolling
- panel repetition
- competing blocks of equal visual weight

It improves:

- focus
- proximity between the canvas and the currently relevant explanation
- initial viewport readability

## Active State Design

The active item in the library should be significantly more legible than the current subtle treatment.

The active style should likely combine:

- stronger background separation
- a clearer accent edge or marker
- stronger typographic emphasis
- preservation of readability across all groups

The goal is not decorative flourish.
The goal is immediate recognition of which document currently drives the canvas and right-side details.

## Interaction Model

The interaction model remains simple.

Library selection changes:

- page heading
- canvas content
- right-side tab content

The new detail tabs change only which explanation surface is visible.
They should not alter the selected rune document itself.

This keeps the inspector understandable:

- library changes the subject
- tabs change the lens

## File-Level Impact

The implementation should likely center on:

- `app/src/routes/dev/runes/+page.svelte`
- `app/src/lib/components/runes/RuneLibraryPanel.svelte`

And only the necessary supporting changes in:

- `app/src/lib/components/runes/RuneStructurePanel.svelte`
- `app/src/lib/components/runes/RuneProjectionPanel.svelte`
- `app/src/lib/components/runes/RuneLegend.svelte`

If needed, a small new detail-tabs wrapper component would be appropriate, but only if that makes the page structure clearer rather than more fragmented.

## Success Criteria

This loop is successful when:

- the active library selection is immediately obvious
- the library is scrollable without pushing the selected state out of the working surface
- the right side no longer requires three stacked detail panels
- the first viewport communicates subject, canvas, and current explanatory context clearly
- the inspector becomes easier to review before further canvas-complexity changes

## Rejected Directions

### Deep canvas redesign in this loop

Rejected because the current blocker is inspector legibility, not yet the full canvas language.

### Keeping the right side as three stacked panels

Rejected because that layout is a direct cause of vertical fragmentation and weak focus.

### Full inspector redesign

Rejected because the current issues can be resolved with a narrower structural refinement.

## Residual Risk

Even after this loop, the rune canvas may still under-express semantic complexity compared with the surrounding text.
That is acceptable for this loop.
The purpose here is to make the inspector itself reviewable enough that the next visual review can target the canvas honestly rather than through layout friction.
