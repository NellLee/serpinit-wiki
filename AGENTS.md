# AGENTS.md

Dieses Repository ist ein persönliches Worldbuilding-Projekt.

Standardrolle von Assistenten:
- Planung, Analyse, Konsistenzprüfung und strukturiertes Brainstorming
- bestehende Lore bewahren, außer es wird ausdrücklich um Änderungen gebeten
- keine leichtfertigen Eingriffe in den Kanon
- keine Umschreibungen etablierter Inhalte ohne klare Zustimmung

Bei der Arbeit an Lore gilt:
- der Nutzer ist die finale Autorität über den Kanon
- Beobachtungen, offene Fragen und Vorschläge klar voneinander trennen
- bestehende Tonalität, Struktur und Intention der Texte respektieren
- für Rolle, Optionsvorschläge, Lücken-Suche und die Schreibfreigabe gilt zusätzlich `skills/lore-collaboration/SKILL.md` — bei jeder Lore-Session lesen und befolgen

Bei der Arbeit an Markdown-Dateien gilt:
- neue oder geänderte Markdown-Dateien müssen immer valides Markdown bleiben
- projektspezifische Syntax wie `:::`, `§imglink`, Tabellen und HTML-Kommentare darf nicht beschädigt werden
- Fließtext im etablierten Satz-pro-Zeile-Stil schreiben
- bei Unsicherheit bestehende Struktur bevorzugen statt Formatierung zu erzwingen

Implementation-specific instructions:
- All implementation-oriented communication, plans, specs, code comments, and technical documentation must be written in English.
- Treat implementation work as separate from lore and content work whenever practical.
- Do not mix implementation refactors with ongoing lore/content edits unless the user explicitly asks for both in the same change.
- Repo-local skills for this project live under `skills/`. When a repo-local skill is relevant, assistants must read and follow its `SKILL.md`.
- Before starting a new task, assistants must ensure previous completed work that should be kept is already committed. Do not leave it uncommitted across task boundaries, and do not start a new task on top of it, unless the user explicitly asks for that.
- Multiple agents may work in parallel in the same working tree, on files the user has scoped to be non-overlapping. Unrelated uncommitted changes elsewhere in the tree are expected in that case and are not, by themselves, a reason to stop or to flag friction.
- If a task actually needs to touch a file that is already dirty from another agent's work, would switch the checked-out branch, or otherwise collides with another agent's in-flight work, stop immediately and ask the user how to proceed. Do not resolve the collision unprompted — no stashing, no branching, no guessing.
- Some project aspects get a standing branch and worktree under `.worktrees/<name>` for isolated parallel work, set up deliberately per aspect rather than as a blanket default. Currently: lore work uses branch `aspect/lore` at `.worktrees/lore`. Where a dedicated worktree exists for the aspect being worked on, use it instead of the shared working tree.
- When a standing aspect worktree has a meaningful chunk of finished work, the agent should propose merging it into `master` and ask for approval, rather than merging unprompted or leaving it to drift unmerged.
- For implementation work, use the current workspace by default.
- Implementation work should happen on a deliberate branch, not casually on `master` or `main`, unless the user explicitly asks for direct work there.
- For complex UI work, assistants must run `skills/ui-output-review/SKILL.md` before calling the work complete. This applies especially to larger visual refactors, dense multi-panel pages, custom inspectors or dev surfaces, and changes whose success depends on rendered legibility or visible state behavior.
- Use `skills/ui-output-review/SKILL.md` as well when the user explicitly asks for a review of UI output, rendered behavior, or how a page actually looks.
