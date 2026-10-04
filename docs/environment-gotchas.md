# Environment gotchas

Short notes on traps found while working in this repo, mostly from WSL with the repo on a Windows drive (`/mnt/d`, DrvFs).
Each entry says what goes wrong and what to do.
Root causes are fixed where possible; these notes explain the fix or the remaining workaround.

## DrvFs (repo on `/mnt/<drive>`)

- **Slow cold start.** The first request after a dev-server start can take 20-60 s. Wait for `[dev-warmup] done` or the `ready in` line, and give the first `curl` a long timeout. See `.claude/skills/dev-server/SKILL.md`.
- **No file-watch events.** inotify sees nothing on DrvFs. `app/vite.config.ts` turns on `server.watch.usePolling` for `/mnt/` paths. Verify a change by fetching the served module.
- **Executable bit.** `core.fileMode=false` (DrvFs reports every file as 777), so `git add` never records `+x` on a new file. Use `git update-index --chmod=+x <path>` and check with `git ls-files -s <path>`.
- **Case-insensitive paths.** A wrong-case import works locally but breaks elsewhere. `forceConsistentCasingInFileNames` in `app/tsconfig.json` catches it.
- **Moving the repo** to the native Linux filesystem would remove most of this slowness. That is the human's decision.

## Git hooks

- `core.hooksPath=.githooks` is local git config and is not cloned. `yarn install` in `app/` sets it via `postinstall` (`scripts/setup-git-hooks.mjs`).
- git only runs a hook named exactly `pre-commit`. A `pre-commit.exe` or similar is silently skipped.

## Tooling traps

- **`yarn check`** is Yarn's own dependency checker. Use `yarn typecheck`.
- **Paths from `import.meta.url`.** Never strip the leading `/` from `.pathname` (a Windows-only trick). Use `path.dirname(fileURLToPath(import.meta.url))`. An ESLint rule in `app/.eslintrc.cjs` flags the old pattern.
- **svelte-check at `1:1`.** A CSS error in a `lang="scss"` component can be reported at `1:1`. Compile the file directly: preprocess the style with `sass`, splice the CSS back in, run `svelte/compiler`'s `compile()` from `app/`, and read the error's `.frame`. Known upstream limitation.
- **Interactive CLIs** (`npx sv migrate` and other clack prompts) have no non-interactive mode. Use `scripts/drive-interactive-cli.mjs` (no pty; submits with `\r`; reacts to prompt text, not to a fixed order).

## Playwright and e2e

- **Missing system libraries.** On a fresh Linux/WSL machine Chromium cannot launch. Run `sudo npx playwright install-deps` once from `app/`. An agent cannot do this without sudo; ask the human.
- **First-test flake.** A cold dev server makes the first test time out. `app/e2e/global-setup.cjs` sends a warm-up request first.
- Run e2e against a running dev server with `E2E_BASE_URL=http://localhost:5173`.
- Browser tests need `networkidle` before keyboard input.
- The `/content/...` route renders in the browser. Test server logic via `/api/page?file=...` and `/api/search?q=...`.
- After bulk content edits, the dev server's search index stays stale until a page is visited or the server restarts.
