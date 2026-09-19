# AGENTS.md

Dieses Repository ist ein persönliches Worldbuilding-Projekt.

Standardrolle von Assistenten:
- Planung, Analyse, Konsistenzprüfung und strukturiertes Brainstorming
- bestehende Lore bewahren, außer es wird ausdrücklich um Änderungen gebeten
- keine leichtfertigen Eingriffe in den Kanon
- keine Umschreibungen etablierter Inhalte ohne klare Zustimmung

Bei der Arbeit an Lore gilt:
- Lore-Sessions finden auf Deutsch statt — das gilt für das Gespräch selbst (Beobachtungen, Rückfragen, Optionsvorschläge) ebenso wie für geschriebene Lore-Prosa
- der Nutzer ist die finale Autorität über den Kanon
- Beobachtungen, offene Fragen und Vorschläge klar voneinander trennen
- bestehende Tonalität, Struktur und Intention der Texte respektieren
- für Rolle, Optionsvorschläge, Lücken-Suche und die Schreibfreigabe gilt zusätzlich `.claude/skills/lore-collaboration/SKILL.md` — bei jeder Lore-Session lesen und befolgen

Bei der Arbeit an Markdown-Dateien gilt:
- neue oder geänderte Markdown-Dateien müssen immer valides Markdown bleiben
- projektspezifische Syntax wie `:::`, `§imglink`, Tabellen und HTML-Kommentare darf nicht beschädigt werden
- Tag-Hooks (`<!-- tags: … -->`, `<!-- folder-tag -->`) stehen im Hook-Block ganz oben in der Datei; Syntax und Regeln stehen in `.claude/skills/page-tags/SKILL.md`
- Fließtext im etablierten Satz-pro-Zeile-Stil schreiben
- bei Unsicherheit bestehende Struktur bevorzugen statt Formatierung zu erzwingen

Implementation-specific instructions:
- All implementation-oriented communication, plans, specs, code comments, and technical documentation must be written in English.
- The language split is decided by the task, not by the language of a document being read or discussed. A discussion about tooling, workflow, or repo instructions stays in English even when it references a German-language file such as this one.
- Treat implementation work as separate from lore and content work whenever practical.
- Do not mix implementation refactors with ongoing lore/content edits unless the user explicitly asks for both in the same change.
- Repo-local skills for this project live under `.claude/skills/`. When a repo-local skill is relevant, assistants must read and follow its `SKILL.md`.
- Before starting a new task, assistants must ensure previous completed work that should be kept is already committed. Do not leave it uncommitted across task boundaries, and do not start a new task on top of it, unless the user explicitly asks for that.
- Multiple agents may work in parallel in the same working tree, on files the user has scoped to be non-overlapping. Unrelated uncommitted changes elsewhere in the tree are expected in that case and are not, by themselves, a reason to stop or to flag friction.
- If a task actually needs to touch a file that is already dirty from another agent's work, would switch the checked-out branch, or otherwise collides with another agent's in-flight work, stop immediately and ask the user how to proceed. Do not resolve the collision unprompted — no stashing, no branching, no guessing.
- Standing per-aspect worktrees (`EnterWorktree` into `.worktrees/<name>`) are retired: the tool's approval prompt does not reliably reach the user on all sessions (e.g. mobile remote control), so it cannot be relied on. All work happens directly in the repo root, on `master` unless a task calls for its own short-lived branch.
- Implementation work should happen on a deliberate branch, not casually on `master` or `main`, unless the user explicitly asks for direct work there.
- For complex UI work, assistants must run `.claude/skills/ui-output-review/SKILL.md` before calling the work complete. This applies especially to larger visual refactors, dense multi-panel pages, custom inspectors or dev surfaces, and changes whose success depends on rendered legibility or visible state behavior.
- Use `.claude/skills/ui-output-review/SKILL.md` as well when the user explicitly asks for a review of UI output, rendered behavior, or how a page actually looks.
- For website work and for lore work alike, keep a monitored background dev server running per `.claude/skills/dev-server/SKILL.md`, so the human can see changes live via hot reload.
- For website work, commits do not need per-diff review before landing — the human judges results, not diffs. A push to origin still needs a nod each time, same as everywhere else.
- Website implementation should follow basic TDD: write or extend tests as part of implementing, not as an afterthought.
- A new feature is not done just because `yarn test` and `yarn typecheck` pass. (Use `yarn typecheck`, not `yarn check` — the latter is Yarn's own built-in dependency checker, not this project's script.) The human still approves each new feature in practice, normally by seeing or trying it live via the dev server. Tests, typecheck, and `.claude/skills/ui-output-review/SKILL.md` are the agent's own pre-check before presenting something as ready — they do not substitute for that approval.
