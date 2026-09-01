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
- Before starting a new user task, assistants must ensure the previous completed task is committed if its changes are meant to be kept. Do not leave completed work uncommitted across task boundaries unless the user explicitly asks for that.
- Before starting a new implementation task, assistants must check for unrelated uncommitted changes in the current workspace. If such changes exist, stop immediately and surface them to the user before proceeding.
- Do not continue a new implementation task on top of mixed uncommitted state unless the user explicitly authorizes that exception.
- For implementation work, use the current workspace by default.
- Implementation work should happen on a deliberate branch, not casually on `master` or `main`, unless the user explicitly asks for direct work there.
- Do not start a new implementation task if previous completed work that should be kept is still uncommitted.
- Do not run parallel implementation strands against the same repository state.
- For complex UI work, assistants must run `skills/ui-output-review/SKILL.md` before calling the work complete. This applies especially to larger visual refactors, dense multi-panel pages, custom inspectors or dev surfaces, and changes whose success depends on rendered legibility or visible state behavior.
- Use `skills/ui-output-review/SKILL.md` as well when the user explicitly asks for a review of UI output, rendered behavior, or how a page actually looks.
