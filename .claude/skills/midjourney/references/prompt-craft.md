# Prompt craft for V8.2

How to write a normal prompt (a description of the finished image). Edit prompts follow other rules, see `edit-workflows.md`.

Sources: Notion "Midjourney Prompting Guide v8.2" (edited 2026-05-25), docs "Prompt Basics", "Art of Prompting", "No", "Text Generation", Notion "Troublesome Tokens" and "Direct vs Process Prompting". Paths are in `sources.md`.

## Core idea

There is no single right way to prompt. If the image works, the prompt works. When it does not, treat the prompt as a visual control tool:

- Describe what should be visible.
- Put the most important subject early.
- Keep sentences short, direct and easy to parse.
- Use concrete visual language, not instructions, vague mood, camera metadata or storytelling.

## Shape of a prompt

```
[Main subject with its most important visible traits]. [Closely attached details, pose or action]. [Foreground or nearby objects]. [Background or environment]. [Medium and style]. [Parameters]
```

Example with the house-style parameters:

```
A red fox with wet fur stands on a mossy riverbank. Its paws press into dark mud near scattered yellow leaves. A misty pine forest fills the background. Natural wildlife photography, soft overcast light. --ar 3:2 --s 100 --raw --p
```

## Rules

1. **Short, direct sentences.** One sentence, one visual unit or one simple relationship. Long chains make the model track too much.
2. **Visible language.** The model cannot paint intentions, symbolism or lore. Turn abstract ideas into visible traits. `courage and sacrifice` becomes `a mud-covered warrior kneels beside a torn banner on a smoky battlefield`.
3. **No commands in normal prompts.** Not `create a dragon`, but `A black dragon flies above a stone castle`. Commands are right only in Edit model prompts and Conversational mode.
4. **Avoid negation.** Describe what is present instead of what is absent. If something must be excluded, use `--no` with plain nouns (`--no fruit, apple`). The moderation reads each word of `--no` alone, so `--no modern clothing` is read as `no modern` and `no clothing`.
5. **Keep one image region together.** Subject details, background details and style notes each stay in their own block. Do not scatter them.
6. **Reduce redundancy.** Do not spend words on what the subject already implies. `a bayou with cypress knees, floating duckweed, dark green water`, not `a swampy bayou with swamp plants and swamp water`. Repeat a detail only to fix one that gets dropped.
7. **Use exact numbers.** `three cats`, not `cats`. Collective nouns work too: `a flock of birds`.
8. **Order sets the focus.** Earlier words get slightly more influence. The grammatical subject decides what the image is about: `A duck standing in a field.` focuses on the duck, `A field with a duck standing in it.` treats the duck as part of the landscape.
9. **Length.** The prompt shortener starts above 1,024 characters and may drop details. The v8.2 guide also names about 1,300 characters as a comfort zone. The Notion page "Prompt Ordering / Length" says V8 has a soft limit of about 250 words (a rumor). It depends more on the number of subjects, details and style terms than on the word count. The figures conflict, so stay under about 1,000 characters. If the image turns muddy or details vanish, the prompt is probably too full.
10. **Rich visual words.** Prepositions of place (`above, beside, behind, across`), descriptive adjectives (`weathered, glossy, serene`), concrete nouns, and references to art movements, craft techniques, historical periods, architectural styles or cultures carry weight. Filler words carry little: `extra, ultra, super, hyper, insanely, extremely, quite, rather, somewhat, notably`, and connectors such as `moreover, furthermore, nevertheless, while, during`. Remove them.
11. **Style first if it gets lost.** If the style fades at the end of a long prompt, open with the style phrase: `A surprised man, candid photography.` A missing detail can move to the front the same way. Write sentences that grammatically feature what the image should feature.
12. **Describe one static moment, never a process.** A still image cannot show a change over time. Tested 2026-09-22: `its skin shifting from unripe green to a deep, glowing orange-red as it ripens` produced a messy, undecided result. Pick the one state that matters and describe only that: `its skin is a deep, glowing orange-red`. This is different from a spatial gradient at a single instant (`skin gradually turning to feathers along her jaw`, which worked), because that describes one frozen moment, not a before/after.

## Lore names

Made-up names such as `Sgrisignier` or `Tjosand` mean nothing to the model. Never use one as the only description. Describe what it looks like, for example `a tall lizard-like people with copper-colored scales`. The visual facts come from the wiki page. This rule is a skill rule, not from the sources.

## Medium and style words

`--raw` is on by default, so the prompt words decide the look. Every prompt names a medium or style. Ideas from the docs "Art of Prompting":

- Mediums: block print, ballpoint pen sketch, cyanotype, graffiti, paint-by-numbers, risograph, ukiyo-e, pencil sketch, watercolor, pixel art, blacklight painting, cross stitch, acrylic pour, cut paper, pressed flowers, oil painting.
- Time periods: a decade or century, for example `1920s` or `1700s`.
- Emotions: shy, determined, sad, joyful, angry, sleepy.
- Colors: millennial pink, acid green, sepia, duotone, pastel, neon, grayscale, iridescent.
- Environments: tundra, salt flat, jungle, desert, forest, cave, crystal forest, city, garden, ocean.

### Combining style words

Source: Discord "Create Aesthetics w/Words" and "Craft Aesthetic w/Words (V6)", written for older versions. Combine **two or more** of these to build a look: art movements (`Impressionism`, `Surrealism`), techniques (`impasto`, `pencil sketch`, `watercolor`), genres, media types (`concept art`, `storyboard`, `sculpture`), time periods, and adjectives or adverbs. Media titles and artist names also steer the look. Naming living artists or franchises is the user's decision, so the skill uses movements, techniques and media types by default. If the style does not show, repeat the style phrase, or lower `--s` (about 75 worked in V6).

### Colors

Source: Discord "Control Colors (V5)". The model does not read HEX or RGB values. Use plain color names. Describe eye color with a gem (`sapphire eyes`). Colors often bleed into other objects, and long color lists fail. Use `dark` and `light` instead of a color where you can, and let materials suggest color (`leather` for brown).

## Words that do not help

`4K`, `8K`, `HD`, `HDR`, `ultra`, `insanely`, `octane`, `unreal`, `v-ray`, `lumion`, `dpi`, `1080p`, camera numbers such as focal length or aperture, and `trending on ArtStation` do not raise quality or resolution. They pull in whatever training images carry those labels, such as screenshots and ads, and can cause blur and broken coherence. Use them only for their style effect. When an image looks off, remove them first.

## Camera metadata and lighting jargon

Notion "Midjourney Myths: Camera Control" (edited 2026-03-30): the model does not simulate a camera or a studio. `85mm`, `f/1.4`, `ISO 100`, `rim light`, `Rembrandt lighting` are style hints at best, and they work only when the look is iconic enough. They do not enforce anything. Prefer plain words for the look (`soft overcast light`, `low camera looking up at`). The closest thing to real steering is the Edit model and retexture, which keep the structure.

Notion "Style Glossary" (in progress, 2026-02-24): there is no reliable glossary of magic words. A word works through the whole prompt, its position, the prompt length and the parameters. Test a whole prompt, not single words.

The docs tool **Describe** turns an image into four prompt ideas (right-click an image, or drag it to the Imagine bar). Use it to find words. The results do not copy the image.

## Text in images

Sources: docs "Text Generation", Notion "Create Text" (marked "updating for V8", V6 and V7 advice), Discord "Create Text (V6)". The office hours of 2026-08-19 say that text rendering in V8.2 is a known weak point and a possible V8.3 target.

- Put the text in double quotation marks. Single quotes do not work. Use the Latin alphabet and keep it short.
- The prompt needs a plausible place for the text and words that suggest printed text. Methods: `says`, `printed on`, `entitled`, `inscribed with`, `labeled as`, `engraved with`, `embossed with`, `stamped with`, `lettered with`. Targets: `speech bubble`, `sign`, `poster`, `book cover`, `t-shirt`, `mug`, `billboard`, `ticket`, `business card`, `license plate`.
- For text alone on a plain ground, add `typography design` and `isolated on a white background`. Leave blank copy space by naming it.
- If the text does not show, lower `--s` (75 is suggested, the Notion examples use as low as 16) or keep `--raw`, or fix it in the Editor.
- Symbols: `@` and `+` work in some cases. `# _ - ( ) / * " ' : ;` do not.
- Punctuation and grammar matter in V6 and later. Write normal sentences with good spelling.

## Composition words

Discord "Control Composition" (V6 and later) and "Prompt Word Order": prepositions place things in relation to each other. These work well: `left`, `right`, `center`, `middle`, `foreground`, `background`, `above`, `below`, `beneath`. Word order still matters: `A cart is pulled by a horse.` shows the cart, `A horse pulls a cart.` may show only the horse.

## Archetypes: invoke or break

An archetype is the most common look of a thing in the training data. The model offers it unless you steer away. This matters a lot for lore, because made-up creatures and peoples have no archetype.

- **Invoke** for common things. Name the stereotype and let the model fill in the details: `a lumberjack`, `a swordsman`, `a picnic`, `a family`. This is shorter and works well.
- **Break** for things that must differ. Describe every detail you want, and avoid the word that pulls the default in. `Cafe` puts coffee cups everywhere. `Alien` brings the usual alien look. Recreate the scene without the word: `a woman sitting in a wooden chair at an empty round table in front of a window looking out on a rainy sidewalk`.
- **Swap the archetype.** If the resisting archetype cannot do it, pick one that can. A glass anchor becomes `a glass sculpture in the shape of a ship's anchor`. A cat with one eye becomes `a cyclops cat`.
- **Replace the word.** Change the archetypal token itself: `felinoid` or another coined form instead of `cat` gives the model room for unusual attributes (Discord "Break Archetypes"). This fits lore creatures well.
- **Use archetypes for props.** To make a figure hold something, use the stereotype that holds it: a knight has a sword, a wizard a wand, a scholar a book. Describing each detail is not needed (Discord "Create Props").
- Lore subjects are almost always break cases: describe them in full and keep the trait sentences the same across images.

Source: Notion "Understand & Use Archetypes" (edited 2026-03-20).

## Several subjects

Sources: Notion "Multiple Subjects" (written for V6, edited 2026-03-20, with V8 numbers) and the v8.2 guide.

How many subjects: about 1 to 20 in V8, up to 40 with careful prompting. The page counts subjects plus the details you control. In V6 it was 1 to 2, in V7 1 to 3.

Formula: `[set up a generic scene with keywords] [add details by calling back to those keywords] [describe the rest of the image] [describe the vibe or style]`

1. **Compositional archetype.** Open with the generic scene: `Three different best friends sitting close together on a park bench.` `Different` stops the figures from looking alike.
2. **Lexical anchoring.** Repeat the same keyword in each detail sentence, as a short simple sentence: `The friend in the middle is a cheerful blonde woman wearing jeans and a green tank-top.` Names alone (`Jennifer is in the middle`) or a long inverted sentence work less well.
3. **Differentiating archetypes.** If the figures still blend, do not repeat a shared word such as `character` or `friend`. Give each a different role: `On the middle-left a short human cleric ...`, `On the right a tall elf wizard ...`.
4. **Rest of the image** near the end, so background details do not spill into the figures: `In the foreground, two pigeons on the sidewalk. In the background, the empty park with old oak trees.`
5. **Vibe and style last.**

The steps are a remedy, not a rule. Use them when the plain prompt fails. Roll specifics back if the image turns incoherent. If the shared word carries a strong look, avoid it (`alien` brings the alien archetype).

For a crowd, name the few important subjects first and push the crowd into the background. If a scene with several focal points still fails, switch to process prompting.

## When a detail is dropped

Source: Notion "Create Emphasis & De-Emphasis" (V6 and V7 era, edited 2026-03-26).

The model's attention is limited. Try in this order:

1. **Remove competing details** to free attention for the stubborn one.
2. **Spend more words on it.** `a cat sleeps lying down with his head down, closed eyes, napping, slumbering` beats `a sleeping cat`.
3. **Say it twice in different words.** `A man wears a hat.` plus `A hat is worn by a man.` Synonyms help too.
4. **Lower `--s`** to 50 to 75 for more adherence.
5. **Rewrite from scratch** to rebalance attention, instead of patching.
6. **Give room.** A wider or taller `--ar` lets the model show what it missed. Crop later.

One or two good images in a batch of four is a sign of a well-made prompt. Look at the whole batch before you change anything.

## Direct and process prompting

| Method | Use it for | Weakness |
| --- | --- | --- |
| Direct: one prompt | One focal point, a consistent look | Several focal points, control over the layout |
| Process: a base image, then edit steps | Several subjects, control over the canvas | Consistent look and color across steps |

The skill uses direct prompting for normal motifs and process prompting for complex motifs. See `SKILL.md`.
