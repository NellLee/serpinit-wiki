# House style

Defaults for every prompt the skill writes. The user decided the rules in the first table. The values in the motif table are starting points, not tested. Change them here when results say so.

## Rules (decided)

| Item | Rule | Why |
| --- | --- | --- |
| `--raw` | On every prompt | Less automatic Midjourney flair, so the prompt words decide the look. The prompt must therefore name medium and style in words. |
| `--p` | On every prompt | Applies the user's default personalization profile. If the Personalization button on the website is already on, `--p` is redundant but harmless. The docs say the global V7 profile works in V8.2. The community release notes advise a new profile made for V8.2, because old profiles, moodboards and srefs can behave differently. |
| `--v` | Omitted | The default model applies. It is V8.2 since 2026-07-24 (docs article "Version", checked 2026-09-01). If the user says the default changed, read the current docs first and update this file. |
| `--ar` | Chosen per motif, with a one-line reason | See the table below. |
| `--s` | Chosen per motif, with a one-line reason | Default 100, range 0 to 1000. Low follows the prompt words closely, high gives more artistic freedom. The V8.2 release notes say V8.1 and V8.2 lean toward aesthetics at a small cost to adherence. A value below 100 and `--raw` win adherence back. |
| Style anchor | None yet | No `--sref` code and no moodboard is defined. The wiki images are not a style source. If the user adds one, write it into the slot below. |

Parameters stand at the end of the prompt. Never write prompt text after them.

Format of the parameter tail: `--ar 2:3 --s 50 --raw --p`

The skill states its choices in one line, so the user can override them: `Motiv: Charakter, Ganzkörper → --ar 2:3 (hohes Bild für stehende Figur), --s 50 (Kanon-Merkmale müssen bleiben)`.

## Starting values per motif

| Motif | `--ar` | `--s` | Reason |
| --- | --- | --- | --- |
| Character, full body | 2:3 | 50 | A tall frame fits a standing figure. Stated traits such as skin, ears and gear must survive. |
| Character, portrait or bust | 4:5 | 50 | The face fills the frame. Low stylize keeps stated traits. |
| Character sheet, expressions, turnaround | 3:2 | 50 | Several views next to each other need width. |
| Creature or fauna, in its habitat | 3:2 | 100 | Organic forms gain from the default freedom. The habitat needs width. |
| Creature or fauna, single figure | 2:3 | 100 | A standing or rearing animal fits a tall frame. |
| Landscape, region, atmosphere | 3:2 | 200 | Mood scenes gain from artistic freedom. Single details matter less. |
| Panorama, vista, large scene | 16:9 | 200 | A wide view needs a wide frame. |
| Architecture, settlement | 3:2 | 100 | Buildings need width and a stable form. |
| Interior | 4:3 | 100 | A room reads well in a moderate frame. |
| Item, prop, weapon, artifact (isolated) | 1:1 | 50 | A centered object on a plain background. The exact shape matters. |
| Symbol, rune, emblem | 1:1 | 50 | A centered mark. Shapes must stay exact. |
| Map | 4:3 | 100 | A map on parchment or a table. Maps are hard for the model, so expect several tries. |
| Planet or celestial body | 1:1 | 50 | A centered sphere. Low stylize keeps it realistic. |
| Concept collage, mood sheet | 3:2 | 150 | Several ideas in one frame. More freedom is welcome. |

If a motif mixes types, the dominant subject decides. A character in a landscape is a character motif when the character is the point.

## Edit model notes

- The Edit model ignores the default aspect ratio and copies the first attached image. Add `--ar` only when the ratio should change.
- `--raw` and `--p` work with the Edit model. Docs advise `--raw` for precise control.
- Edit prompts may be instructions, for example `make her cloak dark green`. Normal prompts stay descriptions of the finished image.

## Slots the user may fill later

- Style anchor: `--sref <code>` or moodboard `--p <mID>`. Empty.
- Default personalization profile: the user's own, applied by `--p`. No ID needed.
- Motif rules the user has learned, for example a stylize value that works well for their planets. Add them to the table above.
