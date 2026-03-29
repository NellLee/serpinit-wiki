# Markdown Rendering Unification Design

## Goal

Unify the project's custom Markdown rendering so that source files remain readable and meaningful in a normal CommonMark preview while the website continues to provide the same custom presentation as before.

The migration must preserve the current rendered appearance.
No visible rendering deterioration is acceptable during the transition.

## Constraints

- Source files must remain meaningful in a normal CommonMark preview.
- Visible content must not live only inside website-specific syntax.
- Raw HTML inside Markdown is allowed, but should be avoided where standard Markdown is sufficient.
- Website-specific behavior should be triggered by invisible mechanisms where possible.
- Existing rendered pages should remain visually unchanged after the rework.
- The migration should be incremental and compatibility-preserving rather than a flag-day rewrite.

## Decision

The new authoring model will be:

- Standard Markdown for visible content
- Invisible HTML comment hooks for website-specific rendering hints

Visible proprietary syntax such as `§...` and `:::...` will be treated as legacy syntax and phased out for authoring.

## Core Principle

There are two layers:

1. Canonical content layer
   Visible CommonMark content that stands on its own in a normal editor preview.
2. Presentation hint layer
   Invisible HTML comments that annotate the following block or section for website rendering.

If all website-specific rendering is disabled, the page must still remain understandable and contain all canonical content.

## Hook Vocabulary

The initial hook vocabulary should stay intentionally small:

```md
<!-- layout: overview -->
<!-- callout: note -->
<!-- callout: todo -->
<!-- callout: maybe -->
<!-- display: card-link -->
<!-- render: folder-index -->
<!-- render: gallery -->
```

Rules:

- Hooks annotate the following block.
- Hooks do not contain canonical prose.
- Hooks only describe rendering intent.
- New hook types should be added rarely and deliberately.

## Target Authoring Patterns

### Overview

Use normal Markdown for the visible content and mark the block with an overview hook.

Example:

```md
<!-- layout: overview -->

![Mavorak_TEMP](./images/mavorak_TEMP.gif)

| Merkmal | Wert |
| --- | --- |
| **Masse** | $24.3 M_\odot$ |
| **Abstand zu Ikus** | $1.1 AU$ |
```

In a normal preview, this remains a normal image plus table.
On the website, the annotated block is rendered in the overview panel.

### Callouts

Visible advisory content should be written as visible Markdown, not stored inside HTML comments.

Example:

```md
<!-- callout: note -->
> **Note:** This section reflects an older lore assumption and is not fully stabilized.
```

The website may render this as the existing styled callout box.
Without custom rendering, it remains a readable blockquote.

### Card Links

Clickable visual cards should be authored as normal Markdown links with an image and visible text, then optionally annotated for enhanced website rendering.

Example:

```md
<!-- display: card-link -->
[![Die Magie](./Allgemein/Magie/images/Sgrisignier-Rune_komplex_2_Transparent.png)](/content/Allgemein/Magie/index.md)

Die Magie
```

### Folder Index and Gallery

These remain website-generated affordances under Option A.

Example:

```md
<!-- render: folder-index -->
```

```md
<!-- render: gallery -->
```

In plain CommonMark previews, these hooks will stay invisible and will not expand into generated content.
This is acceptable because these are navigational and presentation-oriented affordances, not canonical lore content.

## Legacy Syntax Mapping

The renderer should support legacy syntax during migration, but normalize it into the same internal representation as the new hooks.

Initial mapping:

- `:::overview` -> `layout: overview`
- `<!-- NOTE ... -->` -> legacy callout normalization
- `<!-- TODO ... -->` -> legacy callout normalization
- `<!-- MAYBE ... -->` -> legacy callout normalization
- `§imglink` -> `display: card-link`
- `§index` -> `render: folder-index`
- `<!-- INDEX -->` -> `render: folder-index` or folder-content generation path, depending on current behavior
- `::::div{#gallery}` and related generated gallery blocks -> `render: gallery`

Important limitation:

- Legacy comment-based content containers should remain supported until content is migrated.
- New and edited content should not introduce new legacy forms.

## Rendering Architecture

The rework should introduce a single normalization path.

### Pipeline

1. Read raw Markdown
2. Detect new HTML comment hooks
3. Detect legacy project-specific syntax
4. Normalize both forms into one internal block model
5. Render HTML from the normalized model
6. Apply existing post-processing such as image wrapping, lazy loading, Fancybox links, and overview extraction behavior
7. Sanitize and emit final HTML

The key requirement is that old syntax and new syntax converge before final rendering so the emitted DOM shape remains effectively unchanged.

## Non-Regression Requirement

The goal of this rework is a source-format improvement, not a visible redesign.

Therefore:

- Existing CSS behavior should be preserved.
- Existing rendered structures such as overview panels, comment boxes, image cards, figures, galleries, and tables should keep their current appearance.
- Any intentional visual difference must be reviewed explicitly rather than accepted implicitly.

## Verification Strategy

The approved acceptance mechanism is screenshot comparison.

### Representative Page Corpus

Build a fixed corpus of pages that covers the current custom rendering surface:

- overview pages
- figure and figcaption pages
- note, todo, and maybe callout pages
- image card pages
- auto-generated folder index pages
- auto-generated gallery pages
- pages with dense tables
- pages with relative image URLs and Fancybox wrapping

### Acceptance Rule

- Before and after screenshots for the representative corpus must match visually.
- Any mismatch must be treated as a regression unless explicitly reviewed and accepted.

## Migration Strategy

Use a compatibility-first migration.

### Phase 1: Establish Safety Net

- Add screenshot capture and comparison for the representative page corpus.
- Freeze that corpus as the visual baseline for the migration.

### Phase 2: Add New Hook Parsing

- Implement parsing for the new HTML comment hooks.
- Do not remove legacy behavior yet.

### Phase 3: Normalize Legacy Syntax

- Move all legacy handling into one compatibility layer.
- Convert legacy syntax into the same internal representation used by new hooks.
- Preserve current output structure.

### Phase 4: Verify Visual Parity

- Run screenshot comparison on the representative corpus.
- Fix regressions until parity is restored.

### Phase 5: Migrate Content Gradually

- Convert content files from legacy syntax to the new hook-based form in small batches.
- Re-run screenshot comparison after each batch.

### Phase 6: Remove Legacy Authoring Paths

- Once content migration is complete and verified, stop using legacy syntax in source files.
- Remove legacy renderer support only after the corpus remains visually stable and the repository no longer depends on it.

## Authoring Rules for the Repository

The repository should adopt these rules after the migration begins:

1. All canonical content must be visible as normal Markdown.
2. HTML comments may be used only as rendering hooks or metadata.
3. HTML comments must not hide essential lore or prose.
4. New content must not use `§...` syntax.
5. New content must not use visible directive syntax for website-only behavior.
6. Raw HTML should be used only when standard Markdown cannot express the needed content acceptably.

## Expected Outcome

After the migration:

- Markdown files remain readable and meaningful in ordinary CommonMark previews.
- Website-specific rendering still works and still looks the same.
- The custom rendering model is unified under one invisible mechanism.
- Legacy syntax complexity is isolated and then removed over time.

## Open Implementation Questions

- Whether overview extraction should continue as a post-HTML DOM operation or move into the normalized block model directly.
- Whether generated folder indexes and galleries should remain fully runtime-generated or shift to a build-time content expansion step.
- Which exact page set should become the permanent screenshot baseline corpus.
