# Clean Workspace Workflow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace worktree-first implementation guidance with a clean-workspace workflow across the active skill chain and this repository's live rules.

**Architecture:** Update the global Superpowers skills that currently require or prefer worktrees, replace the worktree setup skill with a clean-workspace safety skill, and align the repository's `AGENTS.md` with the new current-workspace-on-branch model. Preserve the existing safety intent by making workspace cleanliness, branch selection, and commit-before-next-task discipline explicit in the live workflow.

**Tech Stack:** Markdown skill docs, repo workflow docs, global Superpowers skill docs, git-based verification of changed instructions

---

### Task 1: Map And Freeze The Live Worktree References

**Files:**
- Review: `AGENTS.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\using-git-worktrees\SKILL.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\executing-plans\SKILL.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\finishing-a-development-branch\SKILL.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\subagent-driven-development\SKILL.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\writing-plans\SKILL.md`

- [ ] **Step 1: Re-scan the active instruction set for worktree dependencies**

Run a focused search over the live instructions that drive current behavior and confirm which references are active, required, or merely historical.

Run from the repo root:

```bash
rg -n "worktree|using-git-worktrees|worktrees" AGENTS.md skills "C:\Users\nelll\.codex\superpowers\skills" -g "*.md"
```

Expected:
- identify the set of live workflow documents that must change now

- [ ] **Step 2: Separate live workflow docs from historical references**

Do not broaden the change to historical specs and plans that only mention old worktree paths as past context.

Record the current edit scope as:
- global active skills
- repo `AGENTS.md`
- any live repo-local workflow docs that still direct current execution

- [ ] **Step 3: Commit only if a mapping note is needed**

Do not create a commit here unless you introduce a real tracked note that helps the migration.

### Task 2: Replace The Worktree Setup Skill With A Clean-Workspace Skill

**Files:**
- Modify: `C:\Users\nelll\.codex\superpowers\skills\using-git-worktrees\SKILL.md`

- [ ] **Step 1: Rewrite the skill purpose and overview**

Update the existing skill file in place so it no longer prescribes worktree creation.

The new skill should:
- keep the slot in the chain
- shift from tree creation to workspace safety
- describe current-workspace readiness as the new default

Rename the conceptual role in the document body to a clean-workspace safety function even if the on-disk folder name remains unchanged initially.

- [ ] **Step 2: Replace the worktree procedure with a clean-workspace preflight**

Rewrite the procedure so it checks:
- current branch
- whether the branch is appropriate
- whether the workspace is clean
- whether unrelated uncommitted changes exist
- whether previous completed work is already committed
- whether dependencies are present in the current workspace

It should explicitly block when:
- the user is on `master` or `main` without explicit approval to implement there
- the workspace contains mixed uncommitted work
- a previous task that should be kept is still uncommitted

- [ ] **Step 3: Remove worktree-specific sections**

Delete or rewrite sections covering:
- directory selection
- `.worktrees` / `worktrees`
- ignore verification for worktree folders
- `git worktree add`
- worktree path reporting
- worktree cleanup assumptions

Replace them with:
- branch creation/switch guidance
- clean-workspace verification
- dependency verification in the current workspace

- [ ] **Step 4: Run a local doc sanity review**

Read the rewritten skill file end to end and verify it no longer instructs the agent to create or prefer worktrees by default.

- [ ] **Step 5: Commit the skill rewrite**

```bash
git add "C:\Users\nelll\.codex\superpowers\skills\using-git-worktrees\SKILL.md"
git commit -m "docs: replace worktree setup guidance with clean workspace checks"
```

Use the appropriate permissions path if the global skill location requires it.

### Task 3: Remove Worktree Assumptions From The Global Execution Chain

**Files:**
- Modify: `C:\Users\nelll\.codex\superpowers\skills\executing-plans\SKILL.md`
- Modify: `C:\Users\nelll\.codex\superpowers\skills\writing-plans\SKILL.md`
- Modify: `C:\Users\nelll\.codex\superpowers\skills\subagent-driven-development\SKILL.md`
- Modify: `C:\Users\nelll\.codex\superpowers\skills\finishing-a-development-branch\SKILL.md`

- [ ] **Step 1: Update `executing-plans`**

Replace the requirement that implementation starts in a worktree with a requirement that implementation starts only after the clean-workspace safety check.

Keep the existing branch-safety rule:
- do not implement on `main` or `master` without explicit approval

- [ ] **Step 2: Update `writing-plans`**

Remove the statement that planning assumes execution in a dedicated worktree.

Replace it with a short note that execution should assume the current workspace under clean-workspace rules.

- [ ] **Step 3: Update `subagent-driven-development`**

Remove any workflow dependency that assumes worktree setup before task execution.

Replace it with:
- clean-workspace preflight for the main execution surface
- explicit warning against running implementation on mixed dirty state

- [ ] **Step 4: Update `finishing-a-development-branch`**

Remove worktree cleanup logic, worktree retention options, and branch deletion ordering tied to worktree removal.

Keep the integration options structure, but simplify the cleanup language so it focuses on:
- merge
- PR
- keep branch
- discard branch

without worktree management.

- [ ] **Step 5: Run a focused global reference scan**

Run a narrow search across the updated global skills:

```bash
rg -n "worktree|using-git-worktrees|worktrees" "C:\Users\nelll\.codex\superpowers\skills\executing-plans\SKILL.md" "C:\Users\nelll\.codex\superpowers\skills\writing-plans\SKILL.md" "C:\Users\nelll\.codex\superpowers\skills\subagent-driven-development\SKILL.md" "C:\Users\nelll\.codex\superpowers\skills\finishing-a-development-branch\SKILL.md" "C:\Users\nelll\.codex\superpowers\skills\using-git-worktrees\SKILL.md"
```

Expected:
- no remaining worktree-first or worktree-required guidance in the active chain

- [ ] **Step 6: Commit the global chain migration**

```bash
git add "C:\Users\nelll\.codex\superpowers\skills\executing-plans\SKILL.md" "C:\Users\nelll\.codex\superpowers\skills\writing-plans\SKILL.md" "C:\Users\nelll\.codex\superpowers\skills\subagent-driven-development\SKILL.md" "C:\Users\nelll\.codex\superpowers\skills\finishing-a-development-branch\SKILL.md"
git commit -m "docs: remove worktree assumptions from workflow skills"
```

Use the appropriate permissions path if the global skill location requires it.

### Task 4: Align Repository Rules With The New Current-Workspace Model

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Remove worktree preference rules**

Delete or rewrite the repo rules that currently:
- prefer using a Git worktree by default
- describe worktrees as the normal surface for technical changes
- define worktree-specific scope expectations

- [ ] **Step 2: Add explicit clean-workspace workflow rules**

Update `AGENTS.md` so it clearly states:
- implementation happens in the current workspace by default
- a deliberate branch is required for implementation work
- no new implementation task starts on mixed uncommitted state
- no parallel implementation strands should proceed in the same repository state
- completed work that should be kept must be committed before starting the next task

- [ ] **Step 3: Keep the existing repo safety intent**

Preserve the repo's existing boundary discipline:
- implementation separate from lore/content when practical
- explicit checks before starting technical work
- UI review obligations remain intact

Do not weaken these rules while removing worktree language.

- [ ] **Step 4: Commit the repo workflow update**

```bash
git add AGENTS.md
git commit -m "docs: adopt clean workspace implementation workflow"
```

### Task 5: Update Any Live Repo-Local Workflow Docs Still Driving Behavior

**Files:**
- Review/Modify as needed: `skills/` repo-local docs that still direct active execution
- Review/Modify as needed: repo-local workflow docs in `docs/` only if they are still part of current process guidance

- [ ] **Step 1: Scan repo-local live docs for active worktree guidance**

Run from the repo root:

```bash
rg -n "worktree|using-git-worktrees|worktrees" skills docs -g "*.md"
```

Classify each hit as:
- active/live guidance that must change now
- historical reference that can remain

- [ ] **Step 2: Update only live guidance**

Change only the repo-local docs that still affect current behavior.
Do not churn old plans and specs just to erase historical mentions.

- [ ] **Step 3: Commit only if live repo-local docs changed**

```bash
git add skills docs
git commit -m "docs: align repo-local workflow guidance with clean workspace model"
```

Only create this commit if the scan found real live docs that required updates.

### Task 6: Final Verification And Workflow Readability Check

**Files:**
- Review: `AGENTS.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\using-git-worktrees\SKILL.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\executing-plans\SKILL.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\writing-plans\SKILL.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\subagent-driven-development\SKILL.md`
- Review: `C:\Users\nelll\.codex\superpowers\skills\finishing-a-development-branch\SKILL.md`

- [ ] **Step 1: Run the final reference scan**

Run a final live-guidance search:

```bash
rg -n "worktree|using-git-worktrees|worktrees" AGENTS.md skills "C:\Users\nelll\.codex\superpowers\skills" -g "*.md"
```

Expected:
- only acceptable residual historical or compatibility mentions remain
- no live instruction still requires or recommends worktrees by default

- [ ] **Step 2: Verify repo hygiene**

Run from the repo root:

```bash
git status --short
git diff --check
```

Expected:
- no unintended file changes remain
- no patch-hygiene issues remain

- [ ] **Step 3: Capture residual risks explicitly**

In the final implementation report, call out:
- any remaining compatibility mention of worktrees that was intentionally preserved
- any global skill path or file-name mismatch still left in place for backward compatibility
- any historical docs intentionally left untouched

- [ ] **Step 4: Commit the integrated workflow migration**

```bash
git add -A
git commit -m "docs: switch workflow from worktrees to clean workspaces"
```
