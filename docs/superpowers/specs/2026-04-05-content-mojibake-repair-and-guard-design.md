# Content Mojibake Repair And Guard Design

## Goal

Repair the currently corrupted markdown files under `content/` and add a lightweight workflow guard that prevents mojibake from being committed there again.

## Scope

This work covers:

- repairing corrupted `content/**/*.md` files already stored in Git
- adding a fast detector for mojibake patterns in `content/**/*.md`
- adding a pre-commit guard that checks only staged content markdown files
- adding a full-tree verification path for manual or CI use
- documenting how the guard works and how to install or refresh it locally

This work does not cover:

- scanning non-content source files
- broad text normalization outside the mojibake repair
- unrelated lore rewrites

## Root Cause Summary

The corruption was introduced by a batch content rewrite in commit `a447f32`.
Affected files show the classic double-encoding pattern where valid UTF-8 bytes were interpreted as a legacy single-byte encoding and then written back as UTF-8.
The result is text like `müssen` becoming `mÃ¼ssen` and `„` becoming `â€ž`.

## Constraints

- Performance must stay high during normal commits.
- The guard must focus only on `content/**/*.md`.
- Existing lore wording should be preserved except for mojibake repair.
- The implementation must be repo-managed rather than depending on ad-hoc local editor settings.

## Recommended Design

### 1. Repair Strategy

Repair the currently corrupted files by reconstructing them from Git history and the intended post-corruption markdown structure.

For each affected file:

- identify a known-good pre-corruption revision
- compare it with the current file
- keep intentional structural edits made later
- restore only the mojibake-corrupted text

This avoids blunt reverts that would discard later markdown-callout migrations or other intended edits.

### 2. Detector

Add a small Node script at `scripts/check-content-mojibake.mjs`.

The detector should:

- scan only `content/**/*.md`
- support full-tree mode
- support staged-only mode by asking Git for staged file paths
- check for a focused set of high-signal mojibake markers such as `Ã`, `Â`, and `â€`
- print precise file and line references when corruption is found
- exit non-zero on detection

The detector should stay intentionally narrow to keep false positives low.

### 3. Pre-commit Safety Net

Add a repo-managed `pre-commit` hook that runs the detector in staged-only mode.

The hook should:

- no-op when no staged `content/**/*.md` files are present
- fail the commit with a direct error message when mojibake is detected

This keeps the normal commit path fast because unchanged content files are never rescanned there.

### 4. Full Verification Path

Expose a full scan command so the entire content tree can be checked explicitly and in automation.

This provides a second line of defense when local hooks are missing, stale, or bypassed.

## Testing Strategy

Use `node:test` with fixture strings rather than repo file mutation.

Tests should prove:

- valid German UTF-8 text is accepted
- common mojibake sequences are rejected
- staged-file filtering restricts checks to staged content markdown files

## Success Criteria

- all known corrupted `content/**/*.md` files are repaired
- the detector catches representative mojibake samples
- the detector ignores valid UTF-8 German text
- a commit that stages mojibake in `content/**/*.md` is blocked locally
- a full-tree scan passes on the repaired repository
