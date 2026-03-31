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

Bei der Arbeit an Markdown-Dateien gilt:
- neue oder geänderte Markdown-Dateien müssen immer valides Markdown bleiben
- projektspezifische Syntax wie `:::`, `§imglink`, Tabellen und HTML-Kommentare darf nicht beschädigt werden
- Fließtext im etablierten Satz-pro-Zeile-Stil schreiben
- bei Unsicherheit bestehende Struktur bevorzugen statt Formatierung zu erzwingen

Implementation-specific instructions:
- All implementation-oriented communication, plans, specs, code comments, and technical documentation must be written in English.
- Treat implementation work as separate from lore and content work whenever practical.
- Do not mix implementation refactors with ongoing lore/content edits unless the user explicitly asks for both in the same change.
- For implementation work, prefer using a Git worktree by default.
- Exception: if the user explicitly wants the implementation work to happen in the current workspace, a worktree is not required.
- Worktrees are for technical/UI/code changes only. Do not use a worktree for pure lore or content writing/editing unless the user explicitly asks for it.
- When working in a worktree for implementation changes, keep the scope limited to technical/UI/code changes and avoid unrelated lore or content edits.
