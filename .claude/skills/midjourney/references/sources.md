# Sources and archive

Where the knowledge comes from, how far to trust it, and how to look deeper.

## Trust order for the current model version

1. **Official docs** (docs.midjourney.com). The rules of the product.
2. **Notion FAQ** (prompt-faqs.notion.site, "Midjourney FAQs • Guides • Tutorials"). Maintained by the Midjourney Promptcraft community (Clarinet). Current and practical. Pages carry an edit date and a status such as "Verified up-to-date" or "Updating for V8".
3. **Discord posts** (`#prompt-faqs` forum on the Midjourney server). The older, longer archive with community questions and answers. Written for V3 to V6. Use it for ideas and reasons, never for parameter syntax.

If sources disagree, the higher one wins. If a page is dated, say so.

## The archive

`.claude/skills/midjourney/archive/` is **not in git**. It holds third-party content: raw exports in `raw/` and readable Markdown in `md/`. If the folder is missing, this section explains how to rebuild it.

`md/index.md` lists every file with title, versions and pairs between sources. Every Markdown file starts with front matter: `source`, `title`, `url`, and for Notion `versions`, `status`, `confidence`.

| Folder | Content | Files |
| --- | --- | --- |
| `md/docs/` | 47 official articles about prompting, parameters, tools and models | `o-<title>.md` |
| `md/notion/` | 60 FAQ pages | `n-<title>.md` |
| `md/discord/` | 105 forum posts, without archived ones. System notes, bumps and footers are removed. Guide messages are marked `[Guide]`, community replies are not. | `dNNN-<title>.md` |

Good first files:

| Need | File |
| --- | --- |
| Current prompt style | `notion/n-midjourney-prompting-guide-v8-2.md` |
| Editing | `notion/n-edit-images-editor-and-edit.md`, `docs/o-edit-model.md`, `docs/o-editor.md` |
| Models and their features | `docs/o-version.md` |
| Parameters | `docs/o-parameter-list.md` |
| Style anchors | `docs/o-style-reference.md`, `docs/o-moodboards.md`, `docs/o-personalization.md` |
| Video | `notion/n-midjourney-video-prompting-guide.md`, `docs/o-video.md` |
| Community notes and known problems | `notion/n-office-hours-notes.md`, `notion/n-v8-2-community-release-notes.md` |

Search the archive instead of reading it whole:

```bash
grep -ril "centaur" .claude/skills/midjourney/archive/md
grep -rn "Last edited" .claude/skills/midjourney/archive/md/notion | head
```

## What the references cover

The references are a distillation, not a copy of the archive. Status on 2026-09-21.

**Read and distilled:**
- Docs: Version, Edit Model, Editor, Parameter List, Stylize, Raw, Aspect Ratio, Chaos, Weird, No, Quality, Seeds, Text Generation, Multi-Prompts, Draft & Conversational, Image Prompts, Describe, Style Creator, Style Reference, Personalization, Moodboards, Art of Prompting, Prompt Basics, and the headings of Legacy Features.
- Notion: Prompting Guide v8.2, V8.2 release notes, Edit Images, Direct vs Process, Multiple Subjects, Prompt Ordering / Length, Emphasis, Archetypes, Troublesome Tokens, Camera Myths, Style Glossary, Layers in the Editor, External Image References, `--style raw`, `--sref` (top), Full-Body Portraits, Character Sheets, Coherency, Centaurs, Cyclops, Camera Angle, Poses, and the newest Office Hours entries.
- Discord: the TLDR of all 29 posts that have one, and the Guide text of Maps, Weapons, Props, Original Creatures, Hybrids, Fantasy Skin Colors, Ethnicities, Magical FX and Aesthetics.

**Read in a second pass (2026-09-21):**
- All remaining Notion pages, except the Patchwork guide and the video pages, which were read only in part.
- The older Office Hours entries, back to 2026-03.
- The remaining docs articles that matter: Omni Reference, Video, Vary Region, Remix, Upscalers, Variations, Pan, Zoom Out, Repeat, Permutations, Tile, Creating on Web, Modifying Your Creations, Getting Started, Web vs Discord, Website Overview, GPU Speed, Image Size.
- The Guide text of the Discord posts that have no Notion counterpart.

**Read in full on 2026-09-22:** the rest of `--oref`, `--cref`, `--sref` and `--p` (weighting, blending, best-practice FAQs), and more of the Video Prompting Guide and the Patchwork guide. The "Style Tools" and "Style Exploration" Notion pages have no public content (0 characters on crawl); nothing more to read there.

**Only skimmed or skipped. Search here before you answer on these topics:**
- Notion: the rest of the Video Prompting Guide's deep-dive table (per-problem workarounds) and the rest of Patchwork (a story/worldbuilding tool, not image prompting — could matter for a future writing-focused skill, not this one).
- Docs: the Discord-only pages (Command List, Creation Settings, Using Midjourney in Discord, Blend Images, Discord Direct Messages), the account details of Profiles, and the fine print of Pan and Zoom Out.
- Discord: a few older versions of pages that Notion covers (Rerolls, Corrective Upscales, Puppeteering, Remastering, Text with an image reference). They are V3 to V6 tools that V8.2 has replaced.

## Early warning

`notion/n-office-hours-notes.md` records the Midjourney office hours. As of 2026-09-03 it says: V9 is in development, an interim V8.3 is possible, an improved edit model is in development, Niji 8 is approaching, and the alpha website changes often. When one of these ships, the references need a check. Read the newest entries when the user mentions a new model.

## Check the current model

Before you rely on version details, or when the user says the default changed:

```bash
curl -s -A "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0" \
  "https://docs.midjourney.com/api/v2/help_center/en-us/articles/32199405667853.json" \
  | grep -o 'current default Midjourney version is [^<]*'
```

WebFetch gets HTTP 403 from docs.midjourney.com. The command above works because of the browser user agent. On the Notion site WebFetch only sees the word "Notion", because the pages need JavaScript.

## Rebuild or refresh the archive

Run from the repo root. The Notion and docs crawlers send about 2 requests and 1 request every 1.5 seconds. Cached answers are reused.

```bash
node .claude/skills/midjourney/tools/docs-crawl.mjs
node .claude/skills/midjourney/tools/notion-crawl.mjs
node .claude/skills/midjourney/tools/build-archive.mjs
```

The Discord export cannot run from the shell. It needs a logged-in browser:

1. Open the forum channel in Firefox, filter the tags, close any open post.
2. Paste `tools/discord-index.js` into the console. It saves a list of all posts.
3. Paste `tools/discord-export.js`, then run `__mjRun('name', [[listPosition, 'threadId'], ...])` with ids from that list, sorted by list position.
4. Copy the downloaded files into `archive/raw/discord/` and run `build-archive.mjs`.

Both scripts only read what the page already shows and scroll slowly. Discord forbids automating user accounts, so the risk is the user's own. Do not raise the pace.
