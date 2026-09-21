# Edit workflows (process prompting) for V8.2

For complex motifs: a simple base image first, then edit steps. Sources: Notion "Edit Images (Editor and --edit)" (edited 2026-08-28), docs "Edit Model", "Editor", "Version", Notion "Direct vs Process Prompting".

## Two tools, do not mix them

| You want to | Tool |
| --- | --- |
| Change an attached image with written instructions | **Edit model** (`--edit`) |
| Combine subjects or objects from several attached images | **Edit model** |
| Turn an image into another style (retexture) | **Edit model** |
| Show the same character from another side | **Edit model** |
| Brush a region, inpaint, outpaint, use layers | **Editor** |
| Fix one small feature (an ear, a hat, a hand, a sign) | **Editor**, with explicit target words |

If you use the Editor, do not add `--edit`. `--edit` cannot share a prompt with `--video`. The Edit model is not compatible with `--tile`, and its results cannot be used with Remix.

## Edit model on the website

1. In the Imagine bar click the image icon (Add Images). Upload the image or pick one from the library.
2. Drag it into the far-left tile **Attach to prompt**. Do not drop it into Style Reference, Image Prompts or Animate. Uploading and attaching are two actions.
3. Up to four images can be attached. The lock icon keeps them pinned for the next prompts.
4. On an image in Create or Organize, **Quick Edit** puts the image into the Imagine bar. **Open Editor** loads it into the Editor.
5. Write the instruction and submit.

The Edit model copies the aspect ratio of the first attached image. Your default ratio does not apply. Add `--ar` only if the ratio should change.

## Writing an edit instruction

Direct instructions are welcome here (`make`, `change`, `turn`, `put`). Or describe the finished result. The formula:

**Identify → Locate → Distinguish → Change**

- Identify the subject or object: the woman.
- Locate it: in the middle, on the lower left, on her right shoulder.
- Distinguish it by a visible trait: with grey hair, in the green jacket.
- State the exact result: red glasses, a silver buckle.

Weak: `Make her wear red glasses.` Strong: `Make the woman with grey hair in the middle of the image wear red glasses.`

Use only details that are visible in the source image. The skill cannot see the image by itself. Ask the user for a short description, or for a file path to the image so that it can be viewed.

### Several source images

- Say `the first image`, `the second image`. Be more precise if needed: `the turtle on the lower left in the third image`.
- The first attached image has more influence by default. Attach the most important one first.
- Name source and destination: `Place the red leather handbag from the second image in the left hand of the woman in the first image.`
- If the order of the images is unknown, ask. Do not guess.

### Typical uses

| Goal | Example |
| --- | --- |
| Change a detail | `Change the blue coat worn by the woman beside the bicycle into a long red wool coat.` |
| Combine | `Combine the turtle from the first image with the garden in the second image.` |
| New view | `Let's see this image from behind.` |
| Retexture | `Depict this image as a photograph.` The docs and the FAQ describe retexture through the Edit model. The FAQ calls this "expected" for late August 2026, so check before you promise it. |
| Make a character from a sketch | `Make this girl into a real character.` |
| Several characters | Attach up to four references. If traits mix, combine the characters into one reference image. |
| Style with a reference | `Hand drawn pencil sketch of this image --sref <code>`. Also describe the style in words. This activates it more reliably. |

## Editor

Use it for a selected region, inpainting, outpainting and layers.

**Known problem (FAQ, as of 2026-08-28):** since 2026-08-26 the selected region is not a reliable boundary. The model may change other parts of the image. The workaround has two parts:

1. End every Editor prompt with `--raw`. This is already the house default.
2. Name the target in words as if there were no mask: `A gold top hat rests on top of the tortoise's head.` Not `add a gold top hat` and not `inside the selected area`.

Check whether the problem is fixed before you rely on the workaround. The FAQ page `notion/n-edit-images-editor-and-edit.md` holds the newest text.

## Diagnosing a failed edit

Find out what failed. Do not repeat the same prompt louder.

| What went wrong | Fix |
| --- | --- |
| Wrong person or object | Strengthen the identification: `the woman` → `the woman in the center` → `the woman with grey hair in the center, wearing the blue coat` |
| Right object, wrong feature | Name the feature |
| Wrong side | Say left or right, or give a position |
| Wrong source image | Add the ordinal |
| Editor changed another area | Keep `--raw`, name the target in words |

## Process prompting as a plan

A complex motif becomes a short plan. The prompt is the chisel, not the sculpture.

1. **Base image.** A simple direct prompt for the setting or the main figure. Get a good base.
2. **Edit steps.** One change per step. Each step names its tool and gives the text to paste.
3. **Check after each step.** The user picks the best result and continues from it.

Example plan for a throne room scene with a king and mourners:

1. Base prompt: the empty marble throne room stairs, mood and style.
2. Editor: select the area for the king, prompt `A dying dark elf king in black armor lies collapsed on the marble stairs. --raw`.
3. Editor: select the area for the crowd, prompt `A crowd of mourning peasants stands on the stairs. --raw`.

`SKILL.md` defines the answer format for the plan.
