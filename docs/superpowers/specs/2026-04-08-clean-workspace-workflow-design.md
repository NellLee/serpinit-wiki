# Clean Workspace Workflow Design

## Goal

Remove Git worktrees from the default implementation workflow and replace them with a stricter clean-workspace model based on one active workspace, one active branch, and hard preflight checks before any new technical task begins.

This change should eliminate the repeated trust, locking, cleanup, and process-management failures that clustered around worktree usage while preserving the safety guarantees that worktrees were previously meant to provide.

## Problem

The recent implementation loops exposed that the current workflow cost of worktrees is too high.
The intended benefit was isolation.
The actual result was repeated tool friction:

- Git trust problems around `safe.directory`
- `git add` and `git commit` requiring worktree-specific command variants
- branch and worktree cleanup ordering issues
- temporary review artifacts living inside worktrees and polluting branch completion
- file deletion failures caused by background processes attached to worktree-local logs
- extra setup churn such as dependency installation and path handling in each isolated tree

These failures are not isolated annoyances.
They affect exactly the moments where the workflow should be most reliable:

- starting implementation
- saving implementation
- reviewing rendered output
- finishing a branch cleanly

The conclusion is straightforward:
worktrees are a net negative for the current operating model and should not remain part of the default chain.

## Desired Replacement

The replacement is not "just stop using worktrees."
Removing isolation without replacing it would weaken the workflow.

The new default should be:

- one current workspace
- one active implementation branch
- one technical task stream at a time per repository state
- hard blocking on dirty or mixed work before a new task starts
- required verification and commit before moving on

This preserves safety, but shifts the safety mechanism from directory isolation to state discipline.

## Core Workflow Rules

The new default workflow should be:

1. implementation work happens in the current workspace
2. implementation work happens on a deliberate branch, not casually on `master` or `main`
3. before any new implementation task:
   - run `git status`
   - stop on unrelated uncommitted changes
   - stop if previous completed work that should be kept is still uncommitted
4. do not run multiple parallel implementation efforts in the same repository state
5. before switching tasks:
   - verify
   - commit
   - only then continue

This means the current workspace becomes the only implementation surface, and its cleanliness becomes a strict invariant.

## New Default Safety Model

The replacement safety model should enforce:

- branch hygiene instead of tree proliferation
- commit discipline instead of cleanup-heavy isolation
- explicit blocking on mixed state instead of hoping a separate checkout avoids it

The key safety questions become:

- Is the workspace clean enough to start?
- Is the branch appropriate for this task?
- Is the previous task fully committed before we begin the next?

If any answer is no, the workflow stops immediately.

## Skill-Chain Impact

### Replace `using-git-worktrees`

The current worktree skill should be replaced functionally by a clean-workspace safety skill.

Its responsibilities should be:

- inspect current repository status
- confirm whether current work is already on a suitable branch
- create or switch to a branch only when needed
- block execution if unrelated or mixed changes exist
- confirm dependency state in the current workspace
- verify the workspace is ready before implementation starts

It should not:

- create worktrees
- reason about worktree directories
- manage worktree cleanup
- require path indirection for normal technical tasks

### Update `executing-plans`

`executing-plans` should stop requiring worktree setup before execution.
Instead, it should require:

- clean-workspace preflight
- no implementation on `master` or `main` without explicit user approval
- no execution on top of mixed uncommitted state

### Update `subagent-driven-development`

Where subagents are available, the same clean-workspace gate should replace worktree assumptions.
Subagents may still work on the codebase conceptually, but the main workflow should not assume that each implementation task begins inside a dedicated worktree.

### Update `finishing-a-development-branch`

This skill should be simplified.
It no longer needs to manage:

- worktree detection
- worktree cleanup
- branch deletion ordering relative to worktree removal

Its focus should narrow to:

- verify tests
- present integration options
- execute the chosen integration path
- keep or clean branch state as requested

### Update `writing-plans`

The plan-writing guidance should stop assuming that implementation happens in a dedicated worktree.
Plans should instead assume execution happens in the current workspace under clean-workspace rules.

## Repo-Specific Impact

`AGENTS.md` in this repository should be updated so that:

- all default references preferring worktrees are removed
- the repo explicitly prefers current-workspace implementation
- the existing dirty-state guard remains, but is expressed without worktree assumptions
- implementation starts require a clean or intentionally understood workspace state
- the repository explicitly forbids parallel implementation strands on mixed uncommitted state

The repo should treat "single clean workspace on branch" as the standard operating model.

## Scope

This change should include:

- global Superpowers skill updates where worktrees are currently required or preferred
- repository-specific workflow guidance updates in `AGENTS.md`
- any local skill-chain references that assume worktree-first behavior
- wording changes in docs where those references are part of current process guidance

This change should not include:

- rewriting historical design documents just to erase old path examples
- deleting the idea of worktrees from existence
- forbidding worktrees as an explicit, manual exception if a user specifically asks for one

## Compatibility Position

Worktrees should cease to be part of the default or required chain.
However, they do not need to be conceptually banned from the tool universe.

The intended compatibility rule is:

- not default
- not recommended
- not implicitly required
- still possible only on direct, explicit user instruction

This preserves flexibility without allowing old defaults to creep back into routine execution.

## Success Criteria

This workflow change is successful when:

- implementation skills no longer instruct the agent to create or prefer worktrees by default
- repository-specific rules align with current-workspace execution
- branch completion no longer includes worktree cleanup logic
- the standard workflow blocks mixed dirty states before implementation starts
- the workflow remains at least as safe as before, but with less tool friction

## Primary Risks

### Risk: losing isolation discipline

If worktrees are removed without a strong replacement, mixed state problems would increase.

Mitigation:
- make clean-workspace checks explicit and mandatory
- require commit-before-next-task discipline
- block on dirty unrelated state

### Risk: partial migration

If repo-specific rules change but global skills still require worktrees, the workflow becomes contradictory.

Mitigation:
- update both global skills and repo-specific instructions in the same change set

### Risk: hidden old assumptions in downstream docs

Some plans and specs may still mention worktrees historically.
That is acceptable unless those references still drive live behavior.

Mitigation:
- prioritize live instructions, active skills, and current repo rules first

## Recommended Rollout

The rollout should happen in this order:

1. update the global skills that currently require or prefer worktrees
2. update this repository's `AGENTS.md`
3. update any repo-local workflow docs that still guide live execution
4. verify the new chain reads coherently from planning through execution and branch completion

## Residual Risk

Even after this migration, some legacy references to old worktree paths may remain inside historical specs and plans.
That is acceptable as long as they no longer drive the active workflow.
The critical requirement is that live instructions, live skills, and current repository policy all align on the new clean-workspace model.
