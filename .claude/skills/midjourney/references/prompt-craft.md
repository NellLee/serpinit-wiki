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
9. **Length.** The prompt shortener starts above 1,024 characters and may drop details. The v8.2 guide also names about 1,300 characters as a comfort zone. The two figures conflict, so stay under about 1,000 characters.

## Lore names

Made-up names such as `Sgrisignier` or `Tjosand` mean nothing to the model. Never use one as the only description. Describe what it looks like, for example `a tall lizard-like people with copper-colored scales`. The visual facts come from the wiki page. This rule is a skill rule, not from the sources.

## Medium and style words

`--raw` is on by default, so the prompt words decide the look. Every prompt names a medium or style. Ideas from the docs "Art of Prompting":

- Mediums: block print, ballpoint pen sketch, cyanotype, graffiti, paint-by-numbers, risograph, ukiyo-e, pencil sketch, watercolor, pixel art, blacklight painting, cross stitch, acrylic pour, cut paper, pressed flowers, oil painting.
- Time periods: a decade or century, for example `1920s` or `1700s`.
- Emotions: shy, determined, sad, joyful, angry, sleepy.
- Colors: millennial pink, acid green, sepia, duotone, pastel, neon, grayscale, iridescent.
- Environments: tundra, salt flat, jungle, desert, forest, cave, crystal forest, city, garden, ocean.

## Words that do not help

`4K`, `8K`, `HD`, `HDR`, `ultra`, `insanely`, `octane`, `unreal`, `v-ray`, `lumion`, `dpi`, `1080p`, camera numbers such as focal length or aperture, and `trending on ArtStation` do not raise quality or resolution. They pull in whatever training images carry those labels, such as screenshots and ads, and can cause blur and broken coherence. Use them only for their style effect. When an image looks off, remove them first.

## Text in images

Put the text in double quotation marks. Single quotes do not work. Use the Latin alphabet, keep it short, and add `with the words` or `written`. If the text fails, lower `--s`, keep `--raw`, or fix it in the Editor.

## Several subjects

Start with the group, then anchor each important subject by position:

`Three musicians perform on a small jazz club stage. The musician on the left plays upright bass. The musician in the center sings into a silver microphone. The musician on the right plays a red drum kit.`

For a crowd, name the few important subjects first and push the crowd into the background. If a scene with several focal points still fails, switch to process prompting.

## Direct and process prompting

| Method | Use it for | Weakness |
| --- | --- | --- |
| Direct: one prompt | One focal point, a consistent look | Several focal points, control over the layout |
| Process: a base image, then edit steps | Several subjects, control over the canvas | Consistent look and color across steps |

The skill uses direct prompting for normal motifs and process prompting for complex motifs. See `SKILL.md`.
