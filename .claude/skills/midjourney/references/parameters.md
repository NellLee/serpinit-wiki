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
| `--sref <code or URL>` | Style reference: colors, medium, texture, light. Not objects. | Write simple prompts. Describe content, not instructions. |
| `--sw N` | Style reference weight. | 0 to 1000, default 100 |
| `--seed N` | Locks the start noise for tests. | 0 to 4294967295. It does not save a style or a character. Not with Turbo. |
| `--q N` | GPU time for the first four images. | Values 1, 2, 4. Docs state the default for V7. |
| `--hd`, `--sd` | 2K or standard resolution (V8.1 and later). | HD costs more GPU time (about 1.3 minutes). Editing tools downscale HD images to SD. The web button Run as HD reruns an SD job as HD. |
| `--iw N` | Weight of an image prompt (rough composition scaffolding). | 0.5 to 3.0 in steps of 0.5 in V8.1 and V8.2, according to the release notes. The docs list it without a range. |
| `--tile` | Seamless pattern. | Not compatible with the Edit model. |
| `--repeat N` | Runs the prompt several times. | |
| `--edit` | Edit model, used with images. | See `edit-workflows.md`. On the website the Attach to prompt tile does the job. |
| `--draft` | Fast, cheap batch of 24 low-resolution images (V8.1 and V8.2, website only). | Good for testing wording, not for final images. |

## Legacy, do not use for V8.2

- Multi-prompts with `::` and weights work in versions up to 6.1. The docs list no later version.
- Omni Reference (`--oref`), Character Reference (`--cref`) and the Retexture tool are replaced by the Edit model in V8.2.
- Pan and Zoom Out use the Edit model in V8.2.
- `--exp` appears in the FAQ for V7. The docs chart does not confirm it for V8.2. Do not use it unless the user asks.
- `--niji` is a separate anime-focused model line.
- Video parameters (`--motion`, `--loop`, `--bs`, `--video`) belong to the video workflow. `--video` cannot share a prompt with `--edit`.

## Check before you trust

Parameters change with model updates. If a parameter is missing here, or the user says the default model changed, read the current docs article. `sources.md` explains how to fetch it.
