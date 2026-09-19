---
name: page-tags
description: Use whenever a wiki page or folder in content/** needs tags - creating a new tag folder (Charakter, Fauna, Clan, ...), adding a page to a guild/family/group, making a page inherit a tag such as Volk, or when a [tags] warning or a tag hook warning at commit time shows up. Documents the `<!-- tags: -->`, `<!-- folder-tag -->` and `inherit=N` hooks and the rules for where they go.
---

# Page tags

Tags are labels on wiki pages. Search shows them per result and filters by them. They come from four sources, in this order:

1. **name**: the page's own file name (or folder name for an `index.md`), split at `_`. Automatic.
2. **folder**: the tag of the tag folder the page is a direct entry of.
3. **inherit**: tags of higher tag folders, only when the page asks for them.
4. **hook**: tags written in the page itself.

Tags match case-insensitively and ignore diacritics (`Himmelskörper` = `himmelskoerper`, `Brauner-Ring` = `Brauner Ring`). If two sources give the same tag, the explicit one wins.

## Hooks

All hooks are single-line HTML comments. They form a **hook block at the very top of the file**: consecutive comment lines, blank lines allowed between them, ending at the first line of real content (usually the `# Title`).

| Hook | Where | Meaning |
| --- | --- | --- |
| `<!-- folder-tag -->` | `index.md` of a folder only | The folder is a tag folder. Its direct entries get the folder name as a tag. |
| `<!-- tags: A, B -->` | any page | These free tags belong to this page. |
| `<!-- tags: inherit=1 -->` | any page | Also take the tag of the next tag folder above the parent tag folder. Can be combined: `<!-- tags: Schmuggler, inherit=1 -->`. |

Items in the `tags:` list that contain `=` are options. Everything else is a tag. The only option is `inherit=N`.

## Rules

- **Flat.** A tag folder tags only its direct entries: files directly inside it, and the `index.md` of its direct subfolders. A page deeper inside an entry folder gets nothing. Reason: a character in a clan is not itself a clan.
- **Inheritance is opt-in and counts tag folders.** `inherit=1` on `Volk/Lateralen/Conius/index.md` adds `Volk` next to `Lateralen`. Folders without a `folder-tag` are skipped when counting. It only works on a direct entry of a tag folder.
- **Position.** A tag hook below page content still works, but it warns. Move it into the top block.
- **A tag folder needs an `index.md`.** For a new tag folder create one:

```md
<!-- folder-tag -->
# Fauna Index

<!-- render: folder-index -->
```

  `render: folder-index` keeps the automatic list of the folder's contents.
- **Folder names are plain.** No trailing `_`. A `_` inside a name is a space in the tag (`Diebesgilde_Brauner-Ring` gives the tag `Diebesgilde Brauner-Ring`). Umlauts are allowed in folder names.

## Checking

- Dev server console: `[tags] <page>: <message>` for every misplaced or unknown hook.
- Pre-commit: `scripts/check-content-tags.mjs` prints the same hook warnings for staged pages. It never blocks the commit.
- All pages: `node scripts/check-content-tags.mjs` from the repo root.
- Unit tests: `app/src/lib/tagHooks.test.ts` (parsing), `tags.test.ts` (resolution).
- Live: `/api/search?q=<title>&includeContent=false` lists the resolved tags of a page under `categories` (the search code still uses the old word).

## Code

`app/src/lib/tagHooks.ts` parses the hooks, `tags.ts` resolves the tags, `pageTags.ts` reads the folders' index pages. `MarkdownPage` calls them, and `wiki.ts` rebuilds a cached page when its tags change through another page's hook.
