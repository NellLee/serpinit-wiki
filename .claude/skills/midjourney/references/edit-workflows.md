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

## The Editor on the website

Source: docs "Editor". Inpainting and outpainting use the Edit model in V8.X.

- **Two versions.** A light Editor opens from an image on Create or Organize (Edit button under Creation Actions). The full Edit tab (website menu, Edit) also takes uploaded images or a pasted URL and has Layers, custom ratios and Suggest Prompt. Use Open in Edit tab to move from the light one to the full one.
- **Tools.** Undo, Redo, Reset. Move / Resize (move, scale, rotate, change the aspect ratio with presets or by dragging the gray bars). Paint with an Erase and a Restore brush. Smart Select for a mask. Suggest Prompt (Describe). Layers. Export.
- **Apply the mask.** After Smart Select, press Erase Selection or Erase Background. If green highlight is still visible, the mask is not applied.
- **Add something new.** First widen the canvas with the aspect ratio so there is room. Erase the area. Describe what you want to see there in the Imagine bar. Press Submit Edit. Results appear as four images, and each new edit adds to the panel.
- **Whole-image retexture.** Prompt a description of the finished image without erasing or selecting anything, for example `watercolor painting of a black cat with green eyes wearing a gold crown`. The edit applies to the whole image.
- **Export.** Upscale to Gallery, or Download Image with Save Original Generation and Save Current Edit (a transparent PNG of the erased areas). Edits with layers or uploaded images do not show on Create or Organize until you upscale them.
- Images made with Omni Reference open only in the Edit tab. Remove Omni Reference and `--ow` before you submit.
- A community note (Office Hours 2026-08-26, not in the docs) says the Edit model can also work as an upscaler when asked for a higher-resolution version. Treat it as unconfirmed.
- The interface changes fast. Office Hours notes mention an alpha website with frequent changes. Button names in a plan may differ. Say so when unsure.

## Layers in the Editor (photobashing)

Source: Notion "Use Layers in the Editor" (edited 2026-03-12). The Edit tab on the website lets you place and mask several images as layers, then blend them with a prompt.

- The prompt must describe the **finished** combined image or its anchor points. `A greyscale photographic angel with hawk-feathered wings, isolated on a colorful gradient background`, not `blend the angel with the background`. A vague prompt gives a fight between two images.
- Method 1: add the layers, position them, mask every layer (foreground and background), take a few pixels off the subject edge to feather it, then write the prompt.
- Method 2: flatten first by submitting an edit without a mask, then mask and prompt the flat image.
- Optional: clear space in the background before you add the foreground layer.
- Download offers the original generation (before layers were flattened) or the current edit.
- Layers are for basic photobashing. Expect to fix seams with a second Editor pass.

## Retexture and structure

Source: Discord "Retexturing" (V6 era) and the docs. A base image works as scaffolding: the composition stays, the prompt decides what things become (three glass spheres plus `three hedgehogs` gives three hedgehogs). Restate in the prompt what must stay: text, colors, expressions. If the edit adds an unwanted detail, prompt for what you want instead (`empty sky`, not `no birds`).

## Consistency with reference images

Source: Notion FAQ pages for `--cref` and `--oref`, written for those older tools. The Edit model replaces them, so treat this as a hint, not a rule. **Big signature features** carry over well: teal curly hair, pink sunglasses, a floor-length trench coat. **Small details drift**: a pendant with eight tiny jewels, a jacket with lettering. Anchor the important traits in the prompt as well. The likeness is never exact. The older tools combined with other tools that compete: to keep the reference, lower the weight of style references, image prompts and stylize.

## Fixing without editing

- **Variations** on the website: Subtle changes little, Strong changes more. Remix lets you change the prompt with a variation. Edit-model results cannot be used with Remix.
- **Upscale**: SD images start at 1024 px (1:1) and the upscalers (Subtle, Creative) double them to 2048 px. HD images are 2048 px from the start and cannot be upscaled further. In V8.2 a 2:3 image is 896 x 1344 px (SD) and 1792 x 2688 px (upscaled or HD). Upscales cost GPU minutes, up to twice the cost of the first images.
- The docs say Pan and Zoom Out use V6.1, and their own chart says the Edit model does the job in V8.2. The two statements conflict. Prefer the Editor and check the result.

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
