# Serpinit Wiki

A personal worldbuilding wiki, with a SvelteKit app in `app/` for browsing it.

This file is for the human working in this repo. For the rules an assistant follows here, see `AGENTS.md` instead.

## Working on a project aspect

Some parts of this project ("aspects") have a standing branch and worktree, so their work stays isolated from everything else and multiple agents can run at once without colliding.

**Currently set up:**

| Aspect | Branch | Worktree |
| --- | --- | --- |
| Lore | `aspect/lore` | `.worktrees/lore` |

### Starting a session in an aspect worktree

1. Open a new terminal in VS Code.
2. `cd` into the aspect's worktree, e.g. `cd .worktrees/lore`.
3. Launch the assistant there (Claude Code, Codex, ...).

The assistant now works on that aspect's branch, isolated from `master` and from any other worktree. This step is on you, not the assistant — it won't relocate itself into a worktree on its own.

### Finishing a chunk of work

The assistant proposes a merge back into `master` once a meaningful chunk of work is done; it asks for approval first. To actually run it:

```bash
cd /mnt/d/My_Files/Programming/serpinit-wiki   # the main worktree, on master
git merge aspect/<name>
```

### Aspects without a worktree

Not every aspect gets one — only ones whose files are genuinely disjoint from everything else (see `AGENTS.md`). Everything else stays in the main working tree, mostly on `master`.
