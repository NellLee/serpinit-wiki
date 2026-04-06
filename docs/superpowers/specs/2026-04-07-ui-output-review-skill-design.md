# UI Output Review Skill Design

## Goal

Create a repo-local skill that can be triggered repeatedly to review complex UI output of the website by looking at the rendered result and interaction flow rather than only code structure.
The skill must support the runic inspector as the first concrete use case, but it should not be limited to runes.
It should become part of the general skill chain for complex UI work and review-heavy implementation tasks.

## Problem

The current workflow can verify schema, tests, and builds, but those checks do not actually judge whether a complex surface is visually legible, behaviorally understandable, or coherent in its rendered state.
For surfaces like `/dev/runes`, this gap matters.
The code can be valid and the tests can pass while the visible result still fails to communicate hierarchy, meaning, or operational logic.

The same issue is not unique to the rune inspector.
Any denser website surface can suffer from:

- weak information hierarchy
- confusing state transitions
- overloaded presentation
- inconsistent emphasis
- visually correct but functionally unclear output

The project therefore needs a reusable, explicitly triggerable review operation at the AI/skill level rather than another repo test.

## Requirements

### 1. Skill-level review, not test-level review

The review action must exist as a skill and workflow step, not as a unit test, screenshot diff suite, or repository-level pass/fail assertion.
It should be callable and repeatable, but it should not generate recurring test artifacts or snapshot clutter.

### 2. Output-focused review

The skill must evaluate:

- the visible rendered UI
- the information hierarchy shown to a user
- the legibility of important distinctions
- interaction flow and state transitions where relevant

It must not collapse into a code review of implementation internals.

### 3. Reusable beyond runes

The first use case is the rune inspector.
However, the skill must be framed for complex UI output in general, so it can later be applied to:

- content pages
- search surfaces
- development-only tools
- any dense or highly stateful website section

### 4. No screenshot archive

The skill must not create recurring screenshot artifacts, snapshot folders, or other persistent visual review dumps as part of normal execution.
The user explicitly does not want the repository or workflow cluttered by such outputs.

### 5. Review-first reporting

The skill should produce findings in a review-oriented structure:

- findings first
- prioritized by severity
- concrete references to page, state, or interaction
- clear separation between observation, risk, and recommendation where useful

This mirrors the established review style used elsewhere in the workflow.

## Proposed Skill

### Name

Recommended skill name:

`ui-output-review`

This is broad enough to cover the intended scope while still being specific about the kind of review being performed.

### Scope

The skill reviews complex rendered website output.
It is intended for situations where successful implementation still leaves open the question:

"Does this surface actually read well and behave coherently when seen as a user would see it?"

It should be usable for:

- complex UI changes
- dense new pages
- large visual refactors
- custom inspectors or dev surfaces
- UI states that are hard to evaluate from code alone

### Profiles

The skill should support a general review flow with optional review profiles.

Recommended starting profiles:

- `general`
- `runes`
- `content-page`
- `search`
- `dev-surface`

The initial implementation only needs enough specificity to make `general` and `runes` practical, but the structure should allow more profiles later.

## Review Method

### Base review dimensions

Every execution of the skill should review the rendered output along these dimensions:

1. Visual clarity
   Can the user distinguish important parts, groupings, emphasis, and state?

2. Information hierarchy
   Does the page communicate what matters first, second, and last?

3. Behavioral legibility
   When the page changes state or responds to interaction, is the transition understandable?

4. Output coherence
   Does the surface feel like one intentional system rather than a pile of separate UI pieces?

### Rune-specific additions

For the `runes` profile, the skill should additionally consider:

- whether important runic forms remain visibly distinguishable
- whether the visual output suggests the intended structural logic rather than arbitrary decoration
- whether the reduced 2D reading remains honest about being a projection rather than a full total structure
- whether labels, hierarchy, and paths support understanding rather than obscuring it

These checks should stay phrased as UI/output review, not as absolute lore adjudication detached from what is actually on screen.

## Execution Shape

The skill should define a repeatable review procedure:

1. Identify the relevant page or UI surface
2. Open or inspect the current rendered output
3. Exercise the minimum interactions needed to understand the state changes
4. Evaluate using the base review dimensions plus any chosen profile
5. Produce review findings in the project review style
6. State residual uncertainty if something could not be checked directly

The procedure should be light enough to repeat often but disciplined enough to avoid vague taste-based commentary.

## Reporting Format

The review output should follow this structure:

1. Findings
   Primary section, ordered by severity

2. Open questions or assumptions
   Only when needed

3. Brief overall summary or residual risks
   Secondary, short

Each finding should point to a concrete UI issue such as:

- weak selection state
- overloaded panel density
- unclear relationship between controls and result
- labels overpowering or under-supporting the structure
- interaction results that are hard to notice or interpret

The output should avoid generic design language like "feels off" unless it is tied to a specific observable problem.

## Integration Into The General Skill Chain

The skill must not merely exist as an optional isolated tool.
It should be integrated into the broader workflow.

### Explicit chain point

For complex UI work, there should be an explicit workflow expectation that before calling the work complete, an agent should run `ui-output-review`.

This is especially important for:

- larger visual changes
- custom visualizations
- multi-panel surfaces
- interfaces whose success depends heavily on legibility and perceived structure

### Triggerability

The skill should also remain normally triggerable by direct request or by obviously matching tasks such as:

- "review the UI output"
- "look at how this page actually renders"
- "check the visual result"
- "review the runic inspector output"

### Relationship to other review stages

The skill complements, but does not replace:

- code review
- automated tests
- type checks
- build verification

It fills the output-judgment gap between "the code works" and "the surface succeeds."

## Repository Placement

The skill should be repo-local rather than installed globally.
This keeps it close to the project's patterns, profiles, and review expectations, and supports the requested integration into the local skill chain.

The implementation should therefore live in a repository skill directory appropriate for local Codex skill discovery.

## Success Criteria

The design is successful when:

- the project has a repo-local reusable skill for rendered UI review
- the skill is usable for `/dev/runes` immediately
- the skill is framed broadly enough for other complex website surfaces
- the skill produces concrete, prioritized findings rather than vague aesthetic commentary
- the workflow explicitly expects this review step before closing out complex UI work
- no screenshot archive or snapshot clutter is introduced as part of ordinary execution

## Rejected Directions

### Screenshot-heavy artifact workflow

Rejected because it creates recurring clutter and the user explicitly does not want that.

### Purely rune-specific review only

Rejected because the same review mechanism should serve other complex website surfaces.

### Repo test or snapshot suite

Rejected because the user wants this to exist on the AI/skill layer, not as a unit or integration test.

### Purely generic design critique

Rejected because the review must stay concrete, operational, and tied to observed UI output and behavior.
