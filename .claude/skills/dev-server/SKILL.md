---
name: dev-server
description: Use whenever doing website work (app/**) or lore work (content/**.md) in this repo and the human should be able to see changes live via hot reload. Covers starting, confirming, and monitoring a background SvelteKit dev server for the current worktree, and avoiding duplicate instances. Triggers - starting website or lore work, "start the dev server", "let's see this live", or wanting to confirm a change actually rendered.
---

# Dev Server

## Why this exists

For website and lore work, results matter more than diff review - the human judges a change by seeing it render, not by reading the code or prose. That only works if a dev server is actually running and current. Keeping one up is part of the task, not an optional extra.

## One dev server per worktree

`app/svelte.config.js` resolves wiki assets as `../content`, and `app/src/lib/wiki.ts` resolves `WIKI_PATH` relative to its own file location. Both are worktree-relative. A dev server started inside `.worktrees/lore/app` serves `.worktrees/lore/content`; one started in the main tree serves the main tree's `content`. A dev server in the wrong worktree shows the wrong (or stale) content - it does not show the human what they think it shows.

Always start the dev server from inside the `app/` directory of the worktree you are actually working in.

## Before starting

Check whether a dev server is already running for this worktree before starting another one. Starting a second instance is harmless in itself (Vite will just bind the next free port), but it wastes a process and makes port numbers confusing. If unsure whether one is already up, check recent background tasks or ask.

## Starting

Run in the background, not in the foreground - a foreground dev server blocks all further tool use for the rest of the session.

```bash
cd app && yarn dev
```

Use Bash with `run_in_background: true`.

## Confirming it actually started

Read the initial output for the bound URL (e.g. `Local: http://localhost:5173/`). Do not assume the default port - Vite auto-increments to the next free port if 5173 is already taken by another worktree's instance. Report the actual URL, not an assumed one.

## Watching it while you work

For anything beyond a one-off check, arm a persistent Monitor on the dev server's output rather than polling it manually. The filter must cover failure, not just progress - a dev server can sit crashed or stuck on a compile error while still looking "running" to a filter that only watches for success lines.

```bash
# example filter - adjust to what this dev server actually prints
grep -E --line-buffered "ready in|hmr update|page reload|error|Error|failed to compile"
```

Use `persistent: true` since the dev server runs for the length of the work, not for a single event.

## Stopping it

Stop the dev server (and any Monitor watching it) with TaskStop when the task or session ends, unless the human wants it left running for their own continued use. Do not leave orphaned dev server processes across unrelated later tasks.

## What this does not replace

A rendering correctly is not the same as a rendering correctly *and* passing its tests/typecheck. This skill is about live visibility, not correctness verification - keep running `yarn test` / `yarn typecheck` as their own step. (Use `yarn typecheck`, not `yarn check` - the latter is Yarn's own built-in dependency checker, not this project's script.)

## Verifying liveness from inside a Claude Code session

A short-timeout `curl localhost:<port>` right after starting the dev server can time out with 0 bytes received, even though the server is up. This is not a networking problem - it is a slow first request. This repo lives on `/mnt/d` (a Windows drive mounted into WSL as DrvFs), and DrvFs file access is much slower than native Linux disk. Vite's dependency pre-bundling and first-page compile read many small files, so the *first* request after a cold start (or after `Re-optimizing dependencies because lockfile has changed`) can take 20-30 seconds; every request after that is near-instant.

To verify liveness from inside the session:
- Wait for the `ready in`/`Local:` line in the server's log (via Monitor) before curling at all.
- Give the *first* `curl` a generous timeout, e.g. `curl -m 60 ...` - it will return once the cold compile finishes.
- A `curl` that returns instantly on the second call but hung on the first is expected, not a bug.

## Verifying a change is actually served

Before telling the human to look at a change, fetch the changed module and grep for a string from the new code, e.g. `curl -s http://127.0.0.1:5173/src/lib/components/X.svelte | grep -c marker`.
Do not rely on "hot reload" alone: on DrvFs, inotify reports no events, so `app/vite.config.ts` turns on `usePolling` for `/mnt/` paths. If that ever stops working, the server silently serves stale code.
A Monitor that stays silent after an edit is a warning sign, not a success signal - Vite logs `hmr update` only while a browser holds the module.
If the human reports "still broken" after a fix, check for stale served code before questioning the fix.
Editing `vite.config.ts` restarts the dev server; never do it during a test run against that server.
