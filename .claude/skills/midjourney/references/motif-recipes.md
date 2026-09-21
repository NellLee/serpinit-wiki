# Motif recipes

Techniques per motif type. Each recipe says where it comes from. **Sourced** means an FAQ or docs page states it. **Skill guidance** means it is a reasonable rule from the general principles and has not been tested. Test values (`--ar`, `--s`) are in `house-style.md`.

Most Discord posts are from the V3 to V5 era. Their ideas are used only where they still hold. Paths are in `sources.md`.

## Character, full body

Sourced: Notion "Create Full-Body Character Portraits" (edited 2026-03-12).

1. Start with the medium: `Illustration of ...` or `Photograph of ...`.
2. Call the subject **full-length**: `a full-length female elf`. Do not write `full body` (the moderation filter can react), `shot` (several meanings) or `portrait` (usually cropped).
3. Anchor the parts that fall out of frame: footwear or bare feet, paws and tail for an animal, hair or hat, ears.
4. Describe the ground and something above: `walking with bare feet on lush green moss`, `a magical bluebird above her head`.
5. Use a tall ratio.
6. While testing, leave `--c`, `--w` and `--s` at default until full-length views come reliably.

Example: `Illustration in detailed comic style of a full-length female elf with blue hair wandering in a sunny forest, with her bare feet walking on lush green moss. Above her head is a magical bluebird. --ar 2:3`

## Character portrait and pose

Sourced: Notion "Control Poses" (edited 2026-03-12).

- Describe the pose type, an emotion or activity, and facial features together.
- Pose words: `profile shot`, `three-quarter shot`, `head-tilt pose`, `hands-on-hips pose`, `leaning pose`, `S-curve pose`, `crossed-arms pose`, `hands-in-pockets pose`, `sitting pose`, `reclining pose`.
- If a pose word fails, add a matching emotion or attitude (`bashful`, `sleepy`, `intense`, `fierce`) and facial details (`bright eyes`, `intense gaze`, `straight nose`). Do both.

## Character sheet, expressions, turnaround

Sourced: Notion "Create Character Ref Sheets" (edited 2026-03-04). Written for V6 and V7.

- Use a wide or tall ratio for enough room.
- Invoke the layout with `character reference sheet`, `character turnaround`, `character concept art` or `character sheet`.
- Fight the clone habit: name a few expressions, for example `expressive face, multiple emotions like happy, silly, angry`.
- The best expressions often sit on different canvases. Make several sheets and pick from them.
- To keep an existing design, use the Edit model with the design attached. It replaces `--cref` and `--oref` in V8.2.

## Camera angle and framing

Sourced: Notion "Control Camera Angle" (edited 2026-03-02). Plain wording works. The words `view` and `angle` are unreliable because they have other meanings.

| Wanted | Words |
| --- | --- |
| Far away | `in the distance`, `distant perspective`, `on the horizon` |
| Far, looking down | `aerial perspective`, `satellite view`, `drone footage` |
| Low camera | `looking up at`, `low-angle perspective`, `view from floor level looking upwards` |
| High camera | `top-down shot`, `high-angle shot` |
| Whole subject | `full-shot`, `full-length shot` |
| Slanted | `dutch-angle`, `unusual perspective` |
| Close | `close-up`, `eye-level perspective`, `glamour shot`, `macro-shot` |
| Look and framing | `cinematic still-shot`, `magazine photography`, `photographed by <source>`, `directed by <name>` |

## Creatures and hybrids

Sourced: Notion "Create Centaurs" (2026-03-20), "Create a Cyclops" (2026-07-23).

- **Archetype problem.** The model prefers what the training data shows most: a rider on a horse, two eyes. Words strongly linked to the usual form pull it back. Say `cyclops` and avoid `eye`.
- Say the species word plainly first, then add details.
- Prefer `creature`, `monster`, `mythical being` over the name of a real animal.
- Describe the features that are uniquely of each part: `horse body and legs with hooves, a muscular human torso, shoulders and head`.
- Lower `--s` and use `--raw` for prompt adherence.
- Check the other controls. A profile, moodboard or sref pulls strongly. Test the words with default parameters first.
- Both FAQ pages recommend `--niji 7` for centaurs and cyclops. The house style does not use Niji. Offer it as an option for mythical hybrids, and say that the interplay with `--raw` and `--p` is not documented.
- Several tries are normal. The FAQ says a prompt may need a few chances.

## Items, props and weapons

Sourced (idea only): Discord "Create Weapons", V5 era, and the general prompt rules.

- Use the exact term: `recurve bow`, not `bow`. Look up the real name of the weapon.
- Name a style or source: `A broadsword, from The Beastmaster (1982), isolated on a white background`.
- For an action pose, use a verb: `an orc fighting the wind with a broadsword`, not `an orc with a sword`.
- Skill guidance: for a catalogue picture, one centered object on a plain background, `--ar 1:1`.

## Maps

Sourced (idea only): Discord "Create Fantasy Maps", V4 and V5 era.

- No prompt gives a guaranteed map. Positions such as `a lake to the north, a forest to the west` do not work, because there is too much randomness.
- The FAQ template: `top down flat view, medieval dnd style, wide seamless cartography map depicting continents kingdoms oceans countries white background --ar 3:2`. Change the style words: pixel art, watercolor, engraving, 3D, game asset.
- Skill guidance: plan a map as process prompting. Get a base map, then change regions with edit steps.

## Landscape, architecture, settlement, interior

Skill guidance from the v8.2 guide.

- Name the medium and the light. Anchor the main structure first, then the surroundings, then the sky.
- Use concrete materials and shapes. Not `an ancient elven city`, but `a city of pale stone towers with copper roofs, built around a wide waterfall`.
- Use a camera word for the viewpoint (see the table above).

## Planets, celestial bodies, runes, symbols

Skill guidance. No FAQ page covers these.

- Planet: one sphere in the middle. Describe surface color, features, atmosphere and where the light comes from. Use `--s 50` to stay realistic.
- Rune or symbol: name the material and the carving method (`carved into dark basalt`, `glowing copper inlay`), and describe the shape in plain words. The model may not reproduce an exact glyph. Plan on the Editor or on a later manual fix.

## Peoples and their looks

Skill guidance. The lore decides the traits, never the skill.

- Describe body, skin, hair and clothing as visible facts from the wiki page. One trait per sentence.
- Keep the same trait sentences across all images of a people. This helps consistency without a style anchor.
- If the wiki gives no visible facts, ask the user. Do not invent them.
