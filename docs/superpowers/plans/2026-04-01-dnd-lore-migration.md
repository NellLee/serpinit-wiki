# DnD Lore Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are both available and allowed for this turn) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all DnD-derived wiki content into normal canon lore, then remove every wiki-facing DnD reference and artifact.

**Architecture:** Treat markdown lore articles as the primary canon source and use the DnD sessions only as source material. First extract and map the historical narrative, then rewrite or create event, character, location, flora, and fauna articles, and finally remove obsolete DnD files and align the timeline.

**Tech Stack:** Markdown content files, XML timeline data, ripgrep, git history, internal wiki link structure

---

### Task 1: Build the source inventory and canonical event map

**Files:**
- Modify: `D:\My_Files\Programming\serpinit-wiki\docs\superpowers\plans\2026-04-01-dnd-lore-migration.md`
- Reference: `D:\My_Files\Programming\serpinit-wiki\content\DnD-5e\**`
- Reference: `D:\My_Files\Programming\serpinit-wiki\content\Ereignis_\**`
- Reference: `D:\My_Files\Programming\serpinit-wiki\content\Volk_\**`
- Reference: `D:\My_Files\Programming\serpinit-wiki\content\Himmelskoerper_\**`

- [ ] **Step 1: Read all DnD session files in chronological order**

Run: `Get-ChildItem 'content\DnD-5e\Session_' -Directory | Sort-Object Name | ForEach-Object { Get-Content ($_.FullName + '\index.md') }`
Expected: complete campaign/session source material is reviewed.

- [ ] **Step 2: Extract a canon-facing event chain**

Write down:
- the See-Kulios / Elementar incident
- the Carpebur decision phase
- the first portal expedition
- the Aridess entry and Varnop contact sequence
- all named figures and their roles

Expected: a stable list of historical phases exists before any article rewrite begins.

- [ ] **Step 3: Identify every DnD-only file that must be redistributed**

Run: `rg --files content | rg "DnD-5e|DnD-5e_|Character-Blatt|Micu-Blatt|Fauna_-Blatt|Flora_-Blatt"`
Expected: a removal/migration checklist of DnD-only files.

- [ ] **Step 4: Note unresolved canon gaps**

Expected: only genuinely ambiguous items are held back for user clarification.

### Task 2: Define destination articles for every migrated content block

**Files:**
- Modify: `D:\My_Files\Programming\serpinit-wiki\docs\superpowers\plans\2026-04-01-dnd-lore-migration.md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Ereignis_\Ikusation.md`
- Create: `D:\My_Files\Programming\serpinit-wiki\content\Ereignis_\[new event articles].md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Volk_\Lateralen_\**\index.md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Himmelskoerper_\**\index.md`

- [ ] **Step 1: Map each extracted event to an existing or new event article**

Expected: each session-era event has one canonical home.

- [ ] **Step 2: Map each sheet-only detail to a permanent lore destination**

Expected:
- character details go into character articles
- creature and plant details go into flora/fauna articles
- travel and diplomacy details go into event or location articles

- [ ] **Step 3: Decide which new articles are required**

Expected: only lore-justified new articles are introduced.

### Task 3: Rewrite the historical backbone

**Files:**
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Ereignis_\Ikusation.md`
- Create: `D:\My_Files\Programming\serpinit-wiki\content\Ereignis_\[new event articles].md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Allgemein\TODO.md` if obsolete DnD-derived notes become canon or are superseded

- [ ] **Step 1: Rewrite Ikusation into a concrete historical process**

Expected: the article no longer contains placeholder-level statements like the current unfinished expedition note.

- [ ] **Step 2: Add the early pre-expedition and expedition incidents as canon events**

Expected: the event chain is readable without consulting former session files.

- [ ] **Step 3: Integrate the Aridess first-contact and Varnop contact developments**

Expected: first contact with Aridess and early Varnop diplomacy become historical lore.

### Task 4: Rewrite character and supporting lore articles

**Files:**
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Volk_\Lateralen_\Sodili\Charakter_\**\index.md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Volk_\Lateralen_\Conius\Charakter_\**\index.md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Himmelskoerper_\Aridess\Fauna_\**\index.md`
- Modify: `D:\My_Files\Programming\serpinit-wiki\content\Himmelskoerper_\Aridess\Flora_\**\index.md`

- [ ] **Step 1: Remove DnD class framing from character identity**

Expected: articles use only in-world functions, talents, and biography.

- [ ] **Step 2: Merge useful sheet-only details into normal lore prose**

Expected: no needed detail remains trapped in DnD sheets.

- [ ] **Step 3: Integrate bandits, hazards, fauna, and flora as world elements**

Expected: all retained content reads like native setting lore rather than encounter prep.

### Task 5: Remove DnD artifacts and repair the wiki graph

**Files:**
- Delete: `D:\My_Files\Programming\serpinit-wiki\content\DnD-5e\**`
- Delete: `D:\My_Files\Programming\serpinit-wiki\content\**\DnD-5e_*`
- Modify: every lore file that links to removed DnD paths

- [ ] **Step 1: Search for all remaining DnD-facing text**

Run: `rg -n "DnD|D&D|5e|Character-Blatt|Micu-Blatt|Fauna_-Blatt|Flora_-Blatt|Spieler|Saving Throw|DC " content`
Expected: a final cleanup checklist.

- [ ] **Step 2: Remove obsolete DnD files**

Expected: no wiki-facing DnD source files remain.

- [ ] **Step 3: Repair links and article references**

Expected: no remaining content points at deleted DnD files.

### Task 6: Align the timeline and verify the migration

**Files:**
- Modify: `D:\My_Files\Programming\serpinit-wiki\timeline\Geschichte.timeline`
- Reference: `D:\My_Files\Programming\serpinit-wiki\content\Ereignis_\**`

- [ ] **Step 1: Add or revise timeline entries for the canonized events**

Expected: the timeline reflects the migrated event chain.

- [ ] **Step 2: Run a final DnD-reference verification search**

Run: `rg -n "DnD|D&D|5e|Character-Blatt|Micu-Blatt|Fauna_-Blatt|Flora_-Blatt" content timeline`
Expected: no relevant matches in canon-facing wiki content.

- [ ] **Step 3: Review residual uncertainty manually**

Expected: any unresolved canon edge case is surfaced explicitly instead of silently guessed.
