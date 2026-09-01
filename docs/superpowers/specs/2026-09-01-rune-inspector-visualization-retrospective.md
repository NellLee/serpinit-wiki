# Rune Inspector Visualization: Retrospective

## What this is

The `/dev/runes` inspector went through four iteration passes ("loop 1" through "loop 3b")
between 2026-04-07 and 2026-05-18. The UI code from all four has been reset to its
pre-loop-1 state (commit `59ae7d7`). This document is the only thing kept from that
work: why it happened, why it was reset instead of continued, and canon lore decisions
that were made along the way and should survive the reset.

## Timeline (reset)

- **Loop 1** (`/dev/runes` layout): fixed weak active-selection state, fragmented
  detail panels, and viewport noise. Landed cleanly, no process issues.
- **Loop 2** (control-path readability): made relation/control paths the primary visual
  reading layer instead of decorative path variants. Landed cleanly, no process issues.
- **Loop 3** (shape language): aimed to give control-oriented shape families
  (`schwelle`, `pruefkammer`, `weiche`, `rueckfuehrung`, `siegelpfad`) visibly distinct
  silhouettes instead of colored variants of one shared band geometry. **Its design and
  plan docs were committed to master, but the implementation was never merged** — master
  documented work that didn't exist in the code.
- **Loop 3b** (branch-only, never documented on master): continued loop 3's unmerged
  work and escalated the goal from "shapes are geometrically distinct" to the rune
  canvas "feels aesthetic, like a coherent writing system" — a subjective, unbounded
  target. It also introduced a second, more rigorous canon-governance layer
  (`runes/GRAMMAR.md` + `runes/decisions/`) that never reached master, leaving two
  competing rulebooks for the runic language (one live in `runes/README.md`, one
  stranded on the branch).

## Why this was reset instead of continued

- **Goal drift, not convergence.** Each loop's definition of "done" got vaguer, not
  sharper: readable layout → readable paths → distinct geometry → "feels authentic."
  No loop closed the previous one's open questions; each opened a fuzzier one.
- **Visible thrashing within a single loop.** Landing one glyph (`leitbahn`) took three
  consecutive corrective commits in loop 3b (render as fiber bundle → make stroke-only →
  make fibers the primary glyph).
- **Docs claiming unshipped work.** Loop 3's design/plan docs sat on master describing a
  visual language that was never implemented there — a trap for anyone reading `docs/`
  as a source of truth about current state.
- **Weight without a verifiable payoff.** Loop 3b roughly doubled the inspector's
  rendering code chasing a goal ("aesthetic," "authentic") that has no test that can
  confirm it was met.

## Lesson for the next attempt

Give the visualization work a concrete, testable "done" bar before starting — not an
adjective. "Family X is visually distinguishable from family Y in a static screenshot"
is testable; "feels like a coherent writing system" is not. If a loop's proposed scope
can't be phrased as a pass/fail check, that's a sign to stop and re-scope before writing
code, not to loosen the target further in the next loop.

## Canon decisions carried forward (Approved Canon, not reset)

These four decisions were marked `Approved Canon` by the user on the loop-3b branch
(`runes/decisions/`, dated 2026-05-18). They are lore/data facts about the Sgrisignier
runic language, independent of the UI implementation that was reset above. They were
never migrated into the live canon (`runes/README.md`, `runes/primitives/*.json`) —
**that migration is still open** and should happen as its own deliberate canon pass,
not be smuggled back in as part of any future visualization loop.

### Leitbahn (Approved Canon, 2026-05-18)

The Leitbahn's base form is not a simple line but an ordered, gently-twisted fiber
bundle — it transports and lightly orients magical pressure. It may smooth, weakly
rotate, fan out, or bundle the flow, but must not perform strong shaping, dosing,
checking, or binding. A Leitbahn never attaches directly to the rune core; a
`Kernspeisung` (core-feed transition) always sits between core and Leitbahn. Once
fibers permanently split into two or more stable sub-bundles, it is no longer a pure
Leitbahn (it becomes e.g. a Gabel or Weiche depending on function).

### Drossel (Approved Canon, 2026-05-18)

The Drossel is a syntactically dependent bausteine — a local fiber contraction on an
*existing* fiber flow, never freestanding. Its function is pressure densification
through controlled narrowing; the degree of constriction is meaning-bearing (mild
constriction keeps individual fibers distinct, strong constriction nearly merges them
into one strand). Past that point the structure tips into Sperre, Kammer, Schwelle, or
an unnamed special case. Standalone/isolated Drossel representations should read as
fragmentary or didactic, never as a complete canonical rune.

### Resrubor-Lesemodell (Approved Canon, 2026-05-18)

Runes are read core-to-outward. The `Formung` / `Kontrollzonen` / `Bindung` / `Abschluss`
zone sequence is **not** an attested ancient Sgrisignier self-concept — it is a modern
Conius/Resrubor classification model, an open system for reading reduced cross-sections,
not a closed four-zone doctrine. Uncertain or partially-attested aspects should be
modeled as open questions, reconstructions, or disputed readings, not treated as
automatically secure canon.

### Runischer Baustein (Approved Canon, 2026-05-18)

A runic building block is defined by structure-function coupling: neither a letter, nor
pure geometry, nor a pure effect description alone. Its concrete meaning also depends on
radial position, adjacency, and embedding in the overall structure. Candidate blocks
(Leitbahn, Drossel, Kammer, Gabel, Anker, Mantel, Sperre, etc.) are not automatically a
stable Approved-Canon list — each must be individually confirmed by the user.

## Source material

Full decision records (lore definition, formal representation, schema/UI impact per
decision) are preserved in git history on the now-superseded branch
`feat/rune-shape-language-loop-3b`, path `runes/decisions/*.md` and `runes/GRAMMAR.md`,
commit range `2b444a9..9e7247b`.
