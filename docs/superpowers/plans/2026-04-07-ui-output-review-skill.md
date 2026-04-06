# UI Output Review Skill Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a repo-local `ui-output-review` skill that reviews rendered website output for complex UI work, then wire it into the repository's general workflow so agents are expected to run it before calling major UI work complete.

**Architecture:** Keep the skill repo-local under a root `skills/` directory so the project owns its review heuristics and profile language. Integrate it into the general chain through `AGENTS.md` rather than through test infrastructure: the skill remains manually triggerable, but the repository instructions explicitly require it as a pre-completion review step for complex UI changes. Keep the skill lean, with a single main skill file and one small profile reference file so future UI-specific review criteria can expand without bloating the trigger document.

**Tech Stack:** Markdown skill documents, repo-local workflow instructions, Python-based skill validation from the existing global skill-creator tooling

---

### Task 1: Establish The Repo-Local Skill Scaffold

**Files:**
- Create: `skills/ui-output-review/SKILL.md`
- Create: `skills/ui-output-review/agents/openai.yaml`
- Create: `skills/ui-output-review/references/profiles.md`

- [ ] **Step 1: Run a baseline discovery check before writing the skill**

Verify the repo currently has no local skill folder and no existing `ui-output-review` implementation.

Run:

```bash
rg --files -g "SKILL.md" skills
```

Expected:
- no results, or at minimum no `skills/ui-output-review/SKILL.md`

- [ ] **Step 2: Initialize the repo-local skill folder**

Use the existing `init_skill.py` helper to create a repo-local skill scaffold at `skills/ui-output-review`.

Run:

```bash
python C:\Users\nelll\.codex\skills\.system\skill-creator\scripts\init_skill.py ui-output-review --path D:\My_Files\Programming\serpinit-wiki\skills --resources references
```

Expected:
- a new `skills/ui-output-review/` directory exists
- the scaffold includes `SKILL.md`
- the scaffold includes `agents/openai.yaml`
- the scaffold includes `references/`

- [ ] **Step 3: Write the minimal repo-local skill metadata and trigger text**

Replace the generated placeholder content in `skills/ui-output-review/SKILL.md` so the frontmatter and opening instructions clearly cover:
- direct requests to review rendered UI output
- complex website UI changes whose success depends on legibility or behavior
- complex dev surfaces such as `/dev/runes`

Keep the description focused on trigger conditions, not on summarizing the entire workflow.

- [ ] **Step 4: Add the reusable profile reference**

Write `skills/ui-output-review/references/profiles.md` with the initial review profiles:
- `general`
- `runes`
- `content-page`
- `search`
- `dev-surface`

This file should define only the additional review dimensions for each profile.
Do not duplicate the base review workflow from `SKILL.md`.

- [ ] **Step 5: Regenerate or correct the UI-facing skill metadata**

Ensure `skills/ui-output-review/agents/openai.yaml` matches the final `SKILL.md` wording and exposes a sane display name, short description, and default prompt.

If regeneration is needed, run:

```bash
python C:\Users\nelll\.codex\skills\.system\skill-creator\scripts\generate_openai_yaml.py D:\My_Files\Programming\serpinit-wiki\skills\ui-output-review --interface display_name="UI Output Review" --interface short_description="Review rendered UI output for complex website changes." --interface default_prompt="Review the current rendered UI output, prioritize findings by severity, and focus on visible clarity, hierarchy, behavior, and coherence."
```

- [ ] **Step 6: Commit the local skill scaffold**

```bash
git add skills/ui-output-review
git commit -m "feat: add ui output review skill scaffold"
```

### Task 2: Write The Review Workflow And Reporting Contract

**Files:**
- Modify: `skills/ui-output-review/SKILL.md`
- Modify: `skills/ui-output-review/references/profiles.md`

- [ ] **Step 1: Write the failing baseline review expectation**

Before tightening the skill, document at least one concrete failure mode from current ad-hoc behavior in the implementation notes or commit message draft for this task.

Use the already observed gap:
- passing tests and builds still leave rendered UI quality unevaluated
- `/dev/runes` was improved without a standardized output review step

This baseline is the RED phase for the skill-writing workflow in the absence of explicit subagent permission.

- [ ] **Step 2: Write the core review procedure**

Expand `skills/ui-output-review/SKILL.md` so it defines a repeatable procedure:
1. identify the relevant page or UI surface
2. inspect the current rendered output
3. exercise the minimum interactions needed to understand state changes
4. review via base dimensions plus any selected profile
5. report findings first, then open questions, then residual risks

The skill must explicitly forbid these failure modes:
- collapsing into code review
- vague taste-based commentary
- snapshot or screenshot artifact generation as routine output
- claiming certainty about states that were not directly checked

- [ ] **Step 3: Define the base review dimensions**

In `skills/ui-output-review/SKILL.md`, make the base dimensions explicit and concise:
- visual clarity
- information hierarchy
- behavioral legibility
- output coherence

For each dimension, include one short sentence describing what to look for in rendered output.

- [ ] **Step 4: Tighten profile-specific criteria**

Update `skills/ui-output-review/references/profiles.md` so each profile adds focused checks instead of generic design commentary.

For the `runes` profile, include checks for:
- distinguishable runic forms
- readable structure/path logic
- honest reduced-projection framing

For the `general` profile, emphasize:
- primary/secondary emphasis
- state discoverability
- control/result relationship

- [ ] **Step 5: Define the reporting format**

In `skills/ui-output-review/SKILL.md`, require this output order:
1. Findings
2. Open questions or assumptions
3. Brief summary or residual risks

Also require:
- severity ordering
- concrete references to page, panel, state, or interaction
- concise problem statements tied to visible evidence

- [ ] **Step 6: Validate the skill structure**

Run:

```bash
python C:\Users\nelll\.codex\skills\.system\skill-creator\scripts\quick_validate.py D:\My_Files\Programming\serpinit-wiki\skills\ui-output-review
```

Expected:
- validation succeeds with no frontmatter or naming errors

- [ ] **Step 7: Commit the review workflow contract**

```bash
git add skills/ui-output-review
git commit -m "feat: define ui output review workflow"
```

### Task 3: Integrate The Skill Into The Repository Workflow Chain

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Write the failing chain expectation**

Identify the missing workflow rule in the current `AGENTS.md`:
- it governs worktrees, lore safety, and implementation boundaries
- it does not yet define a repo-local skill chain entry for complex UI output review

Use that gap as the implementation target.

- [ ] **Step 2: Add repo-local skill discovery guidance**

Update `AGENTS.md` with a short implementation-facing section that tells future agents:
- repo-local skills for this project live under `skills/`
- when a repo-local skill is relevant, they must read and follow its `SKILL.md`

Keep this addition concise and scoped to project-local behavior.

- [ ] **Step 3: Add the explicit pre-completion chain point**

Update `AGENTS.md` so that for complex UI work, agents are expected to run `skills/ui-output-review/SKILL.md` before calling the work complete.

This should cover at least:
- larger visual refactors
- dense multi-panel pages
- custom inspectors or dev surfaces
- changes whose success depends on rendered legibility or visible state behavior

- [ ] **Step 4: Add the direct-trigger guidance**

Still in `AGENTS.md`, state that the same repo-local skill should be used when the user explicitly asks to:
- review UI output
- inspect how a page renders
- assess the visible result of a complex surface

- [ ] **Step 5: Review the AGENTS wording for instruction priority conflicts**

Confirm the new skill-chain wording:
- does not override user authority
- does not force UI review on non-UI work
- stays compatible with the existing implementation/lore separation rules

- [ ] **Step 6: Commit the chain integration**

```bash
git add AGENTS.md
git commit -m "docs: wire ui output review into local workflow"
```

### Task 4: Forward-Test The Skill On The Rune Inspector Path

**Files:**
- Modify: `skills/ui-output-review/SKILL.md` only if testing exposes an actual gap
- Modify: `skills/ui-output-review/references/profiles.md` only if testing exposes an actual gap
- Modify: `AGENTS.md` only if chain wording proves ambiguous

- [ ] **Step 1: Run the skill against the first intended use case**

Use the repo-local skill to review the current `/dev/runes` surface.

The execution should:
- inspect the visible rune inspector output
- assess at least one meaningful state change
- produce findings in the required review format

Do not create screenshot files or persistent review artifacts.

- [ ] **Step 2: Check whether the skill output is specific enough**

Review the generated findings and verify they:
- point to concrete visible problems
- do not collapse into generic design language
- distinguish observation from recommendation

If the output is vague, tighten the skill wording instead of accepting vague review quality.

- [ ] **Step 3: Check whether the chain integration is discoverable**

Simulate the intended trigger path mentally against `AGENTS.md` and the skill metadata:
- a user asks for complex UI work
- implementation nears completion
- the repo instructions should point the agent toward `ui-output-review`

If that path still feels implicit, tighten the AGENTS wording.

- [ ] **Step 4: Re-run structural validation after any refinement**

Run:

```bash
python C:\Users\nelll\.codex\skills\.system\skill-creator\scripts\quick_validate.py D:\My_Files\Programming\serpinit-wiki\skills\ui-output-review
```

Expected:
- validation still succeeds

- [ ] **Step 5: Commit only implementation-proven refinements**

```bash
git add skills/ui-output-review AGENTS.md
git commit -m "refactor: tighten ui output review skill prompts"
```

### Task 5: Final Verification And Handoff

**Files:**
- Review: `skills/ui-output-review/SKILL.md`
- Review: `skills/ui-output-review/references/profiles.md`
- Review: `skills/ui-output-review/agents/openai.yaml`
- Review: `AGENTS.md`
- Review: `docs/superpowers/specs/2026-04-07-ui-output-review-skill-design.md`

- [ ] **Step 1: Run the final validation set**

Run:

```bash
python C:\Users\nelll\.codex\skills\.system\skill-creator\scripts\quick_validate.py D:\My_Files\Programming\serpinit-wiki\skills\ui-output-review
git diff --check
```

Expected:
- the skill validates cleanly
- there are no whitespace or patch hygiene issues

- [ ] **Step 2: Perform a final manual consistency review**

Verify that:
- the skill matches the approved spec
- the profile reference extends rather than duplicates the main skill
- `AGENTS.md` establishes a real chain point for complex UI completion
- no test or screenshot artifact workflow was added

- [ ] **Step 3: Capture residual risks explicitly**

In the final implementation report, call out any remaining limitations, especially:
- repo-local discoverability depending on repository instructions rather than guaranteed native global discovery
- future need for more profiles if the website grows more varied
- limits of review quality when the harness cannot directly inspect a rendered surface

- [ ] **Step 4: Commit the integrated skill feature**

```bash
git add -A
git commit -m "feat: add repo-local ui output review skill"
```
