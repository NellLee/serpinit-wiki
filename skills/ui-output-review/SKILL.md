---
name: ui-output-review
description: Use when reviewing rendered website output for complex UI changes, dense multi-panel pages, custom inspectors, visible state behavior, or when the user asks to assess how a page actually looks and reads.
---

# UI Output Review

## Overview

Review the rendered surface, not the implementation internals.
Use this skill to judge whether a complex UI reads clearly, behaves legibly, and feels coherent in its visible output.

## Baseline Failure

This skill exists because tests, type checks, and builds can all pass while the rendered result still fails to communicate structure or state.
The rune inspector already exposed that gap: technical correctness did not automatically produce a review of what the user actually sees.

## When To Use

Use this skill for:
- complex UI changes
- large visual refactors
- dense multi-panel pages
- custom inspectors or dev surfaces such as `/dev/runes`
- explicit requests to review UI output, rendered behavior, or visible clarity

Do not use this skill for:
- pure code review with no rendered-output question
- backend-only work
- tiny UI edits whose result is obvious and low-risk

## Review Procedure

1. Identify the page or UI surface under review.
2. Inspect the rendered output directly whenever the harness allows it.
3. Exercise only the minimum interactions needed to understand state changes.
4. Review using the base dimensions below plus one profile from `references/profiles.md` when relevant.
5. Report findings first, then open questions or assumptions, then a brief summary or residual risks.

If direct inspection is not possible in the current harness, say so explicitly and downgrade certainty instead of pretending the output was seen.

## Base Dimensions

### Visual Clarity

Check whether important parts, emphasis, grouping, and active state are distinguishable at a glance.

### Information Hierarchy

Check whether the surface makes it obvious what matters first, what supports it, and what can stay secondary.

### Behavioral Legibility

Check whether visible state changes and interaction results are understandable when they happen.

### Output Coherence

Check whether the screen feels like one intentional system instead of disconnected pieces competing for attention.

## Profiles

Use `general` unless the surface clearly fits a more specific profile.
Read `references/profiles.md` only for the profiles you actually need.

## Reporting Format

### 1. Findings

List findings first, ordered by severity.
Each finding must name a concrete page area, panel, state, or interaction and tie the problem to visible evidence.

### 2. Open Questions Or Assumptions

Use this section only when part of the surface could not be checked directly or when behavior depends on an unverified state.

### 3. Brief Summary Or Residual Risks

Keep this short.
Summarize overall risk and any important limits of the review.

## Quick Reference

| Situation | Action |
| --- | --- |
| Complex page and no special domain | Use `general` |
| Rune inspector or runic visualization | Use `runes` |
| Search-heavy UI | Use `search` |
| Dense internal tool or dev route | Use `dev-surface` |
| Cannot inspect rendered output directly | State limitation and avoid strong conclusions |

## Common Mistakes

### Collapsing into code review

Do not critique implementation structure unless it directly explains a visible output problem.

### Giving vague design commentary

Do not write "feels off" or similar empty judgments.
Tie every finding to a visible issue and why it harms comprehension.

### Pretending uncertain states were checked

If the harness could not render or interact with the surface directly, say that.
Do not speak with full certainty about unseen output.

### Creating artifact clutter

Do not create recurring screenshots, snapshots, or persistent visual dump files as part of ordinary review.
