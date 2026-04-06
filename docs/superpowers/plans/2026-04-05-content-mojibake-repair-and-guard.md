# Content Mojibake Repair And Guard

## Plan

1. Add a tested content-only mojibake detector with staged and full-tree modes.
2. Wire the detector into a repo-managed pre-commit hook and document setup.
3. Repair the currently corrupted content markdown files without discarding intentional later structure changes.
4. Verify the detector on synthetic fixtures and run a full content scan on the repaired tree.
