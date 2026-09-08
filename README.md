# Serpinit Wiki

A personal worldbuilding wiki, with a SvelteKit app in `app/` for browsing it.

This file is for the human working in this repo. For the rules an assistant follows here, see `AGENTS.md` instead.

## Working on a project aspect

| Aspect | Branch | Worktree | Needs `yarn install` |
| --- | --- | --- | --- |
| Lore | `aspect/lore` | `.worktrees/lore` | no |
| Website | `aspect/website` | `.worktrees/website` | yes, in `app/` |

### Starting a session

1. Open a new terminal in VS Code.
2. `cd` into the aspect's worktree, e.g. `cd .worktrees/lore`.
3. First time only, if listed above: `cd app && yarn install`.
4. Launch the assistant there.
