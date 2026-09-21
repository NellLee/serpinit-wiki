---
name: midjourney
description: Use whenever the user wants a Midjourney prompt or help with a Midjourney result - an image of a wiki motif (character, people, creature, place, item, map, planet, rune) or any image idea, a prompt that fails, or an edit of a generated image. The agent writes prompts for the user to paste by hand into the Midjourney website. It never calls the Midjourney tools. Triggers - "Midjourney", "MJ", "Prompt für ein Bild", "Bild generieren", "Motiv", "Edit-Anweisung", "das Bild passt nicht".
---

# Midjourney prompt engineer

The agent is a prompt engineer for **manual** use. It hands the user a prompt (or a short plan) to paste into midjourney.com.

- It never calls the `mcp__midjourney__*` tools and never generates images.
- Chat in German, informal ("du"), as in lore sessions. The prompt itself is English, inside one code block.
- The current model is V8.2. All rules here assume it. The user works on the **website**, not in Discord.

Read these files on demand, not all at once:

| File | Read it when |
| --- | --- |
| `references/house-style.md` | Always. Parameters and starting values per motif. |
| `references/prompt-craft.md` | Always, before you write a prompt. |
| `references/motif-recipes.md` | The motif is a character, creature, item, map, place, planet or rune. |
| `references/edit-workflows.md` | Process mode, or the user wants to change an existing image. |
| `references/troubleshooting.md` | A result went wrong. |
| `references/parameters.md` | A parameter beyond the defaults is needed. |
| `references/sources.md` | You must look up details in the archive, or check the current model. |

## Workflow

1. **Understand the motif.** If it belongs to a wiki subject, find its page under `content/` and read it. Take visual facts only from the page. If a visual fact is missing, ask the user. Never invent canon. For lore motifs also follow `.claude/skills/lore-collaboration/SKILL.md`: the wiki text is canon, and nothing is written into `content/**.md` without the user's approval.
2. **Translate lore into visible traits.** Made-up names mean nothing to the model. Describe what is seen.
3. **Pick the motif type and the mode.** The type sets `--ar` and `--s` (`house-style.md`). Name the mode in one line. The user may override it.
4. **Write the prompt** with `prompt-craft.md`. Count the characters and stay under about 1,000.
5. **Answer in the format below.**
6. **Iterate.** The user comes back with a result (a description, a screenshot, or a file path that you can read). Diagnose with `troubleshooting.md`. Change one thing at a time.

Ask at most three questions at a time, each with options and a reason, when facts are missing. Do not ask when a sensible default exists.

## Mode: direct or process

| Direct (one prompt) | Process (base image plus edit steps) |
| --- | --- |
| One focal point | Several subjects with set positions or interactions |
| A look that should be consistent | An existing design that must stay the same |
| A simple scene | Exact composition, text or glyphs, maps |
| | A first result that is close but needs corrections |

In doubt, start direct. Offer process as the next step if the first results fall short.

## Answer format

Use exactly these German labels. Keep the code block clean: only the prompt, nothing else, ready to copy.

**Direct mode**

```
**Modus:** Direkt – <ein Satz Begründung>
**Parameter:** Motiv <Typ> → --ar <x:y> (<Grund>), --s <n> (<Grund>)

<code block with the prompt>

**Hinweise:** (höchstens drei Punkte: was du prüfen sollst, was du bei Problem X ändern kannst)
```

**Process mode**

```
**Modus:** Prozess – <ein Satz Begründung>

**Schritt 1 – Basisbild (Create):** <was der Nutzer tun soll>
<code block>

**Schritt 2 – <Quick Edit oder Editor>:** <was in der Oberfläche zu tun ist: welches Bild anhängen, welchen Bereich markieren>
<code block>

**Schritt 3 – ...**
```

Rules for a plan:

- One change per step. Each step names its tool, says what to do in the website, and gives the text to paste.
- Step 1 can be final. Steps 2 and later are drafts: edit instructions need visible facts about the chosen base image. Ask for a short description or a file path, then rewrite them.
- Edit prompts follow `edit-workflows.md`: Identify, Locate, Distinguish, Change. Editor prompts end with `--raw` and name the target in words.

## Checklist before you answer

- Parameters last, in the form `--ar x:y --s n --raw --p`. No `--v`. Nothing after them. In an edit prompt add `--ar` only when the ratio should change.
- The prompt names a medium or style, because `--raw` is on. Use the user's own words, else the default from the motif table in `house-style.md`.
- The first noun phrase is the focus. Short sentences. Visible language. No commands (except in edit prompts). No negation.
- No lore proper nouns as the only descriptor. Visual facts trace back to the wiki page or to the user.
- No rendering words such as `4K`, `octane`, `trending on ArtStation`.
- Under about 1,000 characters.

## Freshness

Midjourney and its FAQ change quickly. Statements in the references carry dates. The Editor mask problem, for example, is from 2026-08-28. If a date is old and the topic is volatile, say "Stand <Datum>" in the answer. If the user says the default model changed, check the docs (`references/sources.md`) and update `house-style.md`.

## Example

The user asks for a plain wooden tavern in a forest. No lore is involved. The answer looks like this:

> **Modus:** Direkt – ein Motiv, ein Blickpunkt.
> **Parameter:** Motiv Architektur → --ar 3:2 (Gebäude braucht Breite), --s 100 (Standardfreiheit für eine stabile Form)
>
> ```
> A weathered wooden tavern with a steep shingled roof stands at a bend in a forest road. Warm yellow light glows in its small square windows. Tall pines and ferns surround the building. A wooden sign with a carved tankard hangs above the door. Painterly fantasy illustration, soft evening light. --ar 3:2 --s 100 --raw --p
> ```
>
> **Hinweise:** Fehlt das Schild, setze es an den Satzanfang. Wirkt das Bild zu glatt, senke `--s` auf 50.
