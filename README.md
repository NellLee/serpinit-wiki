# Serpinit Wiki

A personal worldbuilding wiki, with a SvelteKit app in `app/` for browsing it.

This file is for the human working in this repo. For the rules an assistant follows here, see `AGENTS.md` instead.

## Setting up a new machine

1. Install Node 22 (see `.nvmrc`) and Yarn 1 (`app/package.json` pins `yarn@1.22.19`).
2. Clone the repo and run `cd app && yarn install`. This also turns on the git pre-commit hook.
3. Only on Linux/WSL, and only for e2e tests: run `sudo npx playwright install-deps` once from `app/`.
4. Run `node scripts/setup-vscode-user.mjs`. It installs the keybindings from `.vscode/user/` into VS Code's user folder, and backs up a differing file first.
5. Open the repo in VS Code and accept "Install recommended extensions". Editor settings and snippets come from `.vscode/`.
6. Launch Claude Code in the repo root. `.claude/settings.json` pre-enables the `chrome-devtools` and `svelte` MCP servers and sets the "Wait What" output style.

All VS Code and Claude Code setup for this repo lives in git.
To change a keybinding, edit `.vscode/user/keybindings.json` and run the script again; VS Code reads keybindings only from the user folder.
Claude Code's auto-memory stays per machine; lasting rules belong in `AGENTS.md` or `.claude/skills/`.

## Starting a session

Work happens directly in the repo root, on `master` or a short-lived task branch.
Launch the assistant there.
Known environment traps are listed in `docs/environment-gotchas.md`.
