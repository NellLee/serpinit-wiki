# Windows-Safe Content Hook Design

## Goal

Make the content mojibake pre-commit guard reliable on Windows so normal commits are actually checked and `--no-verify` is no longer the practical default.

## Scope

This work covers:

- replacing the current shell-dependent pre-commit entry path
- keeping the existing Node-based mojibake detector as the shared validation logic
- verifying that staged `content/**/*.md` commits are blocked when mojibake is present

This work does not cover:

- expanding the detector beyond content markdown
- changing the detector's matching strategy
- broader git hook orchestration beyond this pre-commit guard

## Problem Summary

The current hook uses a POSIX shell entrypoint:

- `.githooks/pre-commit`

On this Windows setup, a normal `git commit` failed before the validation logic ran because Git for Windows attempted to execute the hook through `sh.exe`, which crashed with:

- `fatal error - couldn't create signal pipe, Win32 error 5`

That means the mojibake check itself is valid, but the hook transport layer is unreliable in the target environment.

## Recommended Design

### 1. Keep Validation Logic In Node

The existing detector in `scripts/check-content-mojibake.mjs` remains the single source of truth for content validation.

Why:

- detection logic stays cross-platform
- tests remain simple
- hook-specific behavior stays separate from validation behavior

### 2. Move Hook Orchestration To PowerShell

Add a Windows-native hook script:

- `.githooks/pre-commit.ps1`

This script should:

- ask Git for staged `content/**/*.md` files
- no-op if none are staged
- invoke `node scripts/check-content-mojibake.mjs --files ...`
- propagate the detector exit code

### 3. Minimize The Shell Wrapper

Keep `.githooks/pre-commit` only as a tiny starter that launches PowerShell against the tracked `.ps1` script.

This keeps Git's hook discovery intact while shifting all meaningful work away from fragile shell logic.

### 4. Strengthen Setup

Update `scripts/setup-git-hooks.mjs` so local setup remains explicit and reproducible.

The script should continue setting:

- `core.hooksPath = .githooks`

Optionally, it should also verify that the expected hook files exist and report a clear message if they do not.

## Testing Strategy

Verification should include:

1. existing detector tests
2. direct invocation of the PowerShell hook script
3. a real blocked-commit simulation using a temporary staged content markdown file containing mojibake

## Success Criteria

- a normal Windows commit path reaches the mojibake validator
- staged mojibake in `content/**/*.md` blocks commit
- clean staged content does not block commit
- detector tests still pass
