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
- For action, Discord "Dynamic Poses" (V3 to V5 era) suggests `dynamic pose` plus verbs before the noun (`dancing elf`, `attacking knight`).
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

- **Default to an isolated specimen, not a scene.** Tested 2026-09-22: a habitat scene describing several instances of an invented species (`a herd of ... beasts ... each beast has ...`) produced impossible anatomy (limbs and heads in the wrong places). A wiki creature has no archetype of its own to keep several copies of it coherent at once (see below). Show one animal, plain or minimal ground, front or three-quarter view, per `house-style.md`. Use a habitat scene only once a single-specimen prompt already works well, and even then prefer one animal in an environment over several.
- **Anchor the body plan to a real animal, even for a wholly invented species.** Tested 2026-09-22: describing only invented traits (`stocky`, `wide heavy jaw`, `spines`, `powerful legs`) with no real-world anchor gave the model no coherent skeleton to draw from. Name a real animal whose body plan is close enough, then layer the invented traits on top: `a rhino-like beast with an oversized, spine-covered jaw` keeps four legs and a torso where they belong; the jaw and spines are still the invented part.
- **Make the defining trait the visual focus, not just a mentioned detail.** If a feature has a specific purpose (a defensive jaw, a venomous stinger), frame the shot so that feature is close to the camera and give it a concrete comparison: `its jaw juts forward like a natural shield, lined with thick defensive spines`. A trait only named in passing competes for attention with everything else in the sentence.
- **Archetype problem.** The model prefers what the training data shows most: a rider on a horse, two eyes. Words strongly linked to the usual form pull it back. Say `cyclops` and avoid `eye`.
- Say the species word plainly first, then add details.
- Prefer `creature`, `monster`, `mythical being` over the name of a real animal.
- Describe the features that are uniquely of each part: `horse body and legs with hooves, a muscular human torso, shoulders and head`.
- Lower `--s` and use `--raw` for prompt adherence.
- Check the other controls. A profile, moodboard or sref pulls strongly. Test the words with default parameters first.
- Both FAQ pages recommend `--niji 7` for centaurs and cyclops. The house style does not use Niji. Offer it as an option for mythical hybrids, and say that the interplay with `--raw` and `--p` is not documented.
- Several tries are normal. The FAQ says a prompt may need a few chances.
- **Original creatures and hybrids.** Sourced ideas from the Discord posts "Create Original Creatures" and "Hybrids" (V3 to V6 era, test in V8.2). Describe a blend of two known animals: `a monster blended from a scorpion and a rabbit`, `a hybrid rabbit-scorpion`, `a horse/bunny hybrid`, `a horse-bunny chimera`, `a spiky elephant-like monster`. Add an "unlock" word that gives the model permission to leave the archetype: `fantasy`, `surreal`, `mythical`, `fantastical`, `supernatural`, `legendary`. A helper trick for a missing part: `a mermaid wearing a mermaid tail` creates the tail. Reroll a few times, then revise.

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
- **Planet background must be stated explicitly as black.** Tested 2026-09-22: a prompt naming a toxic green/yellow atmosphere gave the whole image a green-tinted background instead of confining the color to the planet. Say the surrounding space plainly and late in the prompt, as its own clause: `... The planet is small and isolated against a vast, pure black, starlit void of space.` Do not rely on "against a starfield in deep space" alone; name the color of the void itself.

## Flora, single specimen

Skill guidance, tested 2026-09-22. No FAQ page covers plants specifically; treat like an isolated creature specimen (see above): one plant, plain or minimal ground, no habitat scene, no swarm or second creature unless that interaction is the whole point of a separate prompt. Describe one static state of the plant, not a change over time (see `prompt-craft.md`, rule 12).

## Magic and energy effects

Sourced idea, Discord "Magical FX" (V5 era, test in V8.2). To make a spell come from a caster, use a joining verb: `contains`, `grown from`. For a shaft of light or energy, name a physical shape (`shaft`, `spear`, `whip`) and add a magic word (`magical shimmershaft`, `neon sparklewhip`). To give the spell a target and a direction, use an aggressive verb and a target (`attacks a wall`). Add `action shot, dynamic pose` for a dynamic figure. If three to five rerolls fail, revise the prompt.

## Isolated objects, icons and stickers

Sourced ideas, Discord "Create Blank Backgrounds (V5)" and "Create Logos Icons Stickers". Add `isolated on a blank white background` (any color works). For an icon, sticker or logo, open with the design type (`icon`, `sticker`, `logo`, `vector`), then a simple subject: `sticker sheet of cute fluffy puffs`. The model is bad at text, so aim for the image and add any lettering later.

## Photographic look

Sourced: Notion "Create a Photograph" (edited 2026-03-02) and Discord "Create a Photograph". Say it: `photograph of a cat`. Use photo words (`photo`, `film`, `snapshot`, `cinematic still shot`) or a source (`photographed by National Geographic`). **Do not write `photorealistic`.** It is an art style for realistic paintings. Genres steer the look: editorial, product, fine art, conceptual, portrait, fashion, documentary, street, landscape, minimalist, surreal, fantasy photography. `--raw` is already on and helps photo-like results. Camera and film names are noise, see `prompt-craft.md`.

## Line art and coloring pages

Sourced: Notion "Create Coloring Book Pages" (edited 2026-06-08). Name the look: `coloring page`, `black and white line drawing`, `black outline on white background`, `flat vector` or `ink`, `simple, minimal, clean` or `detailed, intricate`. Repeat key words if needed. `--no gradient, shading` removes shading, and `--raw` raises adherence. `--hd` makes the lines crisper (V8.x). Other archetypes to mix in: `logo`, `sticker`, `icon`, `comic`, `stained glass`, `mandala`, `pattern`.

## Color palettes

Sourced idea, Discord "Create a Color Palette" (V5 era, test in V8.2). Template: `palette, the color scheme of a cozy library`. Guide the colors with two colors: `..., shades of mint green and yellow`. More than two colors blend. A color word with a second meaning (`coral pink`) may show the object. Exact colors, hex codes and the order of colors cannot be set.

## Peoples and their looks

Skill guidance. The lore decides the traits, never the skill.

- Describe body, skin, hair and clothing as visible facts from the wiki page. One trait per sentence.
- Fantasy skin colors (Discord "Create Fantasy Skin Colors", V5 era, test in V8.2): add `fantasy` or `surreal` so the model may break archetypes. Write the color as an adjective (`blue-skinned`, not `with blue skin`). Invoke an archetype that has the color (`devil` for red skin). Use materials (`eyes made of ruby`) or wording like `dyed black`, `stained red`. Reroll to give the prompt more than one chance.
- Body types: name them in plain words (`plus-sized`) or start from a fitting archetype. If it does not show, describe it more or adjust the emphasis.
- Real-world ethnic, cultural or national terms invoke real appearances. Use them only when the lore points to a real culture.
- Keep the same trait sentences across all images of a people. This helps consistency without a style anchor.
- If the wiki gives no visible facts, ask the user. Do not invent them.
