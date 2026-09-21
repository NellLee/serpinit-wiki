# Parameters for V8.2

Only what matters for the skill. Sources: docs "Parameter List", "Version", "Aspect Ratio", "Stylize", "Raw", "Chaos", "Weird", "Quality", "Seeds", "No", "Style Reference", "Personalization", "Moodboards", "Edit Model". Status as of the docs checked on 2026-09-01.

## Writing parameters

1. Parameters go after the prompt text. Never write prompt text after them.
2. Put a space before the dashes: `poppies --ar 2:3`, not `poppies--ar 2:3`.
3. Do not use commas or periods inside the parameters.
4. `--ar` takes no decimals: write `139:100`, not `1.39:1`.

## Used by default

| Parameter | Meaning | Values |
| --- | --- | --- |
| `--ar W:H` | Aspect ratio. Default 1:1. | Max 14:1. Extreme ratios are experimental. |
| `--s N` | Stylize, artistic freedom. Low follows the words, high is more artistic. | 0 to 1000, default 100 |
| `--raw` | Turns off the automatic creative touch. | On or off |
| `--p` | Applies the user's default personalization profiles. `--p <ID>` picks a profile or moodboard. Your global V7 profile works in V8.2. | Needs an unlocked profile |

The defaults per motif are in `house-style.md`. `--v` is omitted, so the default model applies (V8.2).

## Used when needed

| Parameter | Meaning | Note |
| --- | --- | --- |
| `--c N` (`--chaos`) | Variety between the four images. | 0 to 100, default 0. High values follow the prompt less. |
| `--w N` (`--weird`) | Quirky, unusual results. | 0 to 3000, default 0. Experimental. Not fully compatible with seeds. |
| `--no a, b` | Excludes things. | Same as a weight of -0.5. Prefer describing what is present. |
| `--sref <code or URL>` | Style reference: colors, medium, texture, light. Not objects. | A code is a short number, `--sref random` picks one. Write simple prompts. Describe content, not instructions. The FAQ page for `--sref` is marked "updating for V8". |
| `--sw N` | Style reference weight. | 0 to 1000, default 100 |
| `--seed N` | Locks the start noise for tests. | 0 to 4294967295. It does not save a style or a character. Not with Turbo. |
| `--q N` | GPU time for the first four images. | Values 1, 2, 4. Docs state the default for V7. |
| `--hd`, `--sd` | 2K or standard resolution (V8.1 and later). | HD costs more GPU time (about 1.3 minutes). Editing tools downscale HD images to SD. The web button Run as HD reruns an SD job as HD. |
| `--iw N` | Weight of an image prompt (rough composition scaffolding). | 0.5 to 3.0 in steps of 0.5 in V8.1 and V8.2, according to the release notes. The docs list it without a range. |
| `--tile` | Seamless pattern. | Not compatible with the Edit model. |
| `--repeat N` | Runs the prompt several times. | |
| `--edit` | Edit model, used with images. | See `edit-workflows.md`. On the website the Attach to prompt tile does the job. |
| `--draft` | Fast, cheap batch of 24 low-resolution images (V8.1 and V8.2, website only). | Good for testing wording, not for final images. |

## Style tools, from specific to general

Source: Notion "Using External Image References" (edited 2026-03-12) and the docs. The tools form a spectrum. Combine them only on purpose, because they compete.

| Tool | What it carries over | Where it goes |
| --- | --- | --- |
| Image prompt | Composition, subject and some style of one picture | URL at the front of the prompt, weight `--iw` (0.5 to 3.0) |
| Style reference URL | The look of one image, not its objects | `--sref <URL>` at the end, weight `--sw` |
| `--sref` code | A saved, reusable style as a short code | `--sref <code>` |
| Moodboard | A broader visual world from a chosen set of images | `--p <mID>` |
| Profile | Your learned taste | `--p` or `--p <ID>` |

If a prompt goes wrong, test the words with default parameters first. A profile, moodboard or sref pulls strongly, and so do `--c` and `--w`.

## Running many variants

- **Permutations** put options in curly braces: `a {red, green, yellow} bird`, or in parameters: `--ar {1:1, 2:3, 3:5}`. One permutation prompt makes up to 4 (Basic), 10 (Standard) or 40 (Pro, Mega) prompts, only in Fast and Turbo modes. Each prompt costs GPU time. Source: docs "Permutations".
- **`--repeat N`** (`--r`) runs one prompt several times with the same plan limits. The parameter is stripped from the finished image, so add it again when you rerun.
- **`--tile`** makes one tile. Upscaling usually breaks the seams. On the website, click the tile image twice to preview the pattern.
- Turbo mode is not supported in V8.1 (docs "GPU Speed").
- Uploads may be at most 10 MB. Ctrl or Cmd plus Enter runs a prompt and keeps its text in the Imagine bar.

## Video, in short

Not the focus of the skill. Source: docs "Video" and Notion "Midjourney Video Prompting Guide". Video starts from a still starting frame and makes a 5-second clip. Animate Manually lets you write a motion prompt. Video accepts only `--motion low`, `--motion high`, `--raw`, `--loop`, `--end` and `--bs`. Choose a starting frame that already holds the composition, pose and props. Prompt one concrete, visible motion (`steam rises, candle flickers`), and avoid reasoning words (`remains still`). Sequence words such as `then` are weak. A video can be extended up to four times by about 4 seconds each.

## Legacy, do not use for V8.2

- Multi-prompts with `::` and weights work in versions up to 6.1. The docs list no later version.
- Omni Reference (`--oref`, V7), Character Reference (`--cref`, `--cw`, V6) and the Retexture tool (V7 and earlier) are replaced by the Edit model in V8.X.
- Listed as legacy in the docs: style tuner codes (`--style <code>`), `--test`, `--testp`, `--creative`, `--sameseed`, `--uplight`, `--stop`. The Notion FAQ still explains `--stop`, but treat it as legacy.
- Deprecated: `--width`, `--height`, `--hq`, `--newclip`, `--nostretch`, `--old`, `--upbeta`, `--upanime`.
- Remix, Vary Region as a button, scaffolding and low variation mode belong to V4 to V6 workflows. Edit model results cannot be used with Remix.
- Pan and Zoom Out use the Edit model in V8.2.
- `--exp` appears in the FAQ for V7. The docs chart does not confirm it for V8.2. Do not use it unless the user asks.
- `--niji` is a separate anime-focused model line (Niji 7 exists, Niji 8 is announced).
- `--stop` does not exist in V7 and V8. `--preview` was an early access to V8.2 and is obsolete now.
- Conversational Mode (an LLM writes the prompt from your chat) is listed for V7 and V8.1 in the docs. The skill does not use it, because the agent writes the prompt.
- Video parameters (`--motion`, `--loop`, `--bs`, `--video`) belong to the video workflow. `--video` cannot share a prompt with `--edit`.

## Check before you trust

Parameters change with model updates. If a parameter is missing here, or the user says the default model changed, read the current docs article. `sources.md` explains how to fetch it.
