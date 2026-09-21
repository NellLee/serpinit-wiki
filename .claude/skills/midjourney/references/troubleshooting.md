# Troubleshooting

What to change when a result is wrong. Sources: Notion "Midjourney Prompting Guide v8.2" (troubleshooting section), "Troublesome Tokens", "Improve Coherency (Faces, Hands)" (marked "updating for V8", so the V7 methods are a guide only), "Create Full-Body Character Portraits". Edit failures are in `edit-workflows.md`.

Change one thing at a time. Then judge again.

| Problem | What to do |
| --- | --- |
| An important detail is dropped | Move it earlier. Say it more concretely. Attach it directly to the subject. Example: `A brass lantern carved with crescent moons glows in a woman's hand.` instead of `a woman ... holding a lantern with carved moons on it`. |
| The image is messy | Remove competing subjects, props and style directions. Give the model one clear visual job. Anchor a few subjects by position and push the rest into the background. |
| The prompt is vague | Replace mood words with visible evidence. `A lonely futuristic city` becomes `An empty futuristic city street with shuttered glass storefronts and wet black pavement. One red traffic signal glows through pale rain.` |
| The prompt is followed too loosely | Lower `--s` below 100 and keep `--raw`. The V8.2 release notes say this wins adherence back. |
| The focus is wrong | Make the intended focus the first noun phrase and the grammatical subject. |
| Blur, odd focus, melting details | Remove rendering words (`4K`, `octane`, `ultra`, camera numbers, `trending on ArtStation`). Then shorten the prompt. |
| The prompt is too long | Cut redundancy. Stay under about 1,000 characters. |
| Faces or hands are wrong | Try a subtle variation or a creative upscale. Fix the area in the Editor and describe the whole scene there. Remove the mention of hands or smiles, or describe them in more detail with an attitude, emotion or activity. Raise `--s`. The FAQ names 800 to 1000 for badly placed characters, at the cost of literal control. |
| The whole body is not in the frame | Use the full-length checklist in `motif-recipes.md`. |
| An unwanted frame, border or panels appear | Frames: an art-object word in the prompt (for example `map`, `painting`) invites a frame, so change the wording, or add `--no interior decor, product shot`. Borders: match `--ar` to any attached image, or add `scan of`, `borderless`, `close-up`. Panels: write clear grammar, not a list. Source: Discord "No Frames, No Panels" (V4 to V5 era). |
| Unwanted text appears | Avoid text words such as `logo`, `sign`, `poster`, `book`. Use `--no text`, or name the kind of text (`title`, `caption`, `watermark`). |
| Faces show doodle-like marks or odd details | Add your own style words instead of relying on the default look. Remove `detailed` and any 3D, video or photo tokens. Source: Discord "Create Clear Faces". |
| The same element repeats | Change the aspect ratio to remove extra canvas. Say what fills the empty areas. Prefer adjectives to nouns that imply more subjects. |
| The subject is cropped at the edge | Say the background is tall, wide or large. Say the subject is small compared to the background, `isolated`, or `beneath a night sky`. Use a wider ratio. Or widen the canvas in the Editor. Source: Discord "Fix Cropping Issues" (V3 to V5 era). |
| An Editor or region edit invents the wrong thing | Give context. `A green turtle` alone gives the model nothing to place. `A turtle swims in a pond between two trees` lets it find the pond and the trees. Source: Discord "Editor / Vary Region". |
| A small flaw remains after an otherwise good image | Try a subtle variation, or a creative upscale (it adds small improvements and can be redone several times). If several tries fail, go back to the prompt. Sources: docs "Upscalers", Discord "Subtle & Creative Upscales". |
| Text is wrong | Quotation marks, a short word, `with the words`, lower `--s`, or fix it in the Editor. |
| Everything looks the same | Add variety in the words. Raise `--c` a little. Change one trait per attempt. |
| Traits mix between two characters | Describe each character in its own sentence and anchor them by position. In an edit, combine the characters in one reference image. |
| The look drifts between images | Fix the medium and style words. Reuse the same sentence for style. Later, add a style anchor to the house style. |

## Test cheaply

`--draft` makes a batch of 24 low-resolution images for a fraction of the GPU time (V8.1 and V8.2, website only). Use it to test wording. Then run the final prompt normally.
