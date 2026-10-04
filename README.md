# Serpinit Wiki

A personal worldbuilding wiki, with a SvelteKit app in `app/` for browsing it.

This file is for the human working in this repo. For the rules an assistant follows here, see `AGENTS.md` instead.

## Setting up a new machine

1. Install Node 22 (see `.nvmrc`) and Yarn 1 (`app/package.json` pins `yarn@1.22.19`).
2. Clone the repo and run `cd app && yarn install`. This also turns on the git pre-commit hook.
3. Only on Linux/WSL, and only for e2e tests: run `sudo npx playwright install-deps` once from `app/`.
4. Open the repo in VS Code and accept "Install recommended extensions". Project editor settings come from `.vscode/settings.json`.
5. Launch Claude Code in the repo root. The `chrome-devtools` and `svelte` MCP servers are pre-enabled by `.claude/settings.json`.

These stay personal and do not come with the repo:

- VS Code extensions and settings outside this project: use VS Code's Settings Sync.
- Claude Code user settings, output styles, and the `midjourney` MCP server (`~/.claude/`, `~/.claude.json`).
- Claude Code's auto-memory. Lasting rules belong in `AGENTS.md` or `.claude/skills/` instead.

## Starting a session

Work happens directly in the repo root, on `master` or a short-lived task branch.
Launch the assistant there.
Known environment traps are listed in `docs/environment-gotchas.md`.
