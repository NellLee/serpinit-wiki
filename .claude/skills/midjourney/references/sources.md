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
