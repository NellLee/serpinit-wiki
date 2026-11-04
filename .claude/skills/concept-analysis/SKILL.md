---
name: concept-analysis
description: Use when a Serpinit-Wiki lore concept is spread over many pages, has drifted through several iterations, or needs a full reality check before decisions can be made - e.g. a planetary phenomenon, a magic mechanism, a species' biology, a historical event chain. Runs a read-only subagent that collects every statement with sources, digs through git history, derives the design goals, checks each claim against physics and the magic system ("Magie-Budget"), and returns decision axes with options. Triggers - "analysiere das Konzept komplett", "Realitäts-Check für X" when X touches many pages, "das ist über die Seiten verstreut", "was wollte ich da eigentlich", "starte einen Subagenten für X".
---

# Konzept-Analyse

Diese Skill ergänzt `.claude/skills/lore-collaboration/SKILL.md`.
Dort stehen die Regeln für das Gespräch: Rolle, Kanon-Modell, Optionen über AskUserQuestion, Realitäts-Check-Regeln, Schreib-Ablauf.
Hier steht nur, wie eine tiefe Analyse eines verstreuten Konzepts beschafft und an den Nutzer übergeben wird.

## Wann diese Skill, wann nicht

Eine Konzept-Analyse lohnt sich, wenn mindestens eines davon zutrifft:

- das Konzept wird auf vielen Seiten erwähnt, und die Aussagen passen nicht mehr sicher zusammen
- die Seiten zeigen Spuren mehrerer Fassungen (alte Begriffe, Reste eines anderen Mechanismus)
- eine Detailfrage (z. B. zu einer Tierart) hängt an einem Grundkonzept, das selbst ungeklärt ist
- der Nutzer verlangt ausdrücklich eine vollständige Analyse oder einen Subagenten

Eine einzelne, eng umrissene Frage bleibt im Gespräch und folgt nur `lore-collaboration`.

## Grundhaltung

- **Seiten sind Belege für Absichten, kein Kanon.** Für die Analyse gilt keine Aussage als gesetzt. Aus den Aussagen werden die Ziele abgeleitet, die der Nutzer offenbar verfolgt.
- **Auch die Ziele sind nicht fest.** Jedes Ziel wird bewertet: **Kern** (durchgehend über Seiten und Fassungen), **wahrscheinlich** (mehrfach belegt oder strukturell genutzt), **beiläufig** (einmalig, Detail). Zielkonflikte und teure Ziele werden benannt, damit der Nutzer sie fallen lassen oder umformen kann.
- **Magie-Budget** ist das Maß für Realismus (siehe `lore-collaboration`, Abschnitt „Realitäts-Checks“).
- **Nichts entscheiden.** Die Analyse liefert Optionen mit Kosten, keine Empfehlung im Optionsteil.

## Ablauf

1. **Abgrenzen.** Das Konzept und seine direkt abhängigen Themen benennen (z. B. bei einem Planetenphänomen: Geografie, Atmosphäre, Fauna, Zeitleiste).
2. **Subagent starten**, schreibgeschützt, mit dem Auftrag unten. Er läuft im Hintergrund; der Nutzer erfährt kurz, was er tut.
3. **Bericht übergeben**, siehe „Übergabe an den Nutzer“.
4. **Entscheidungen** laufen danach normal nach `lore-collaboration`: eine Achse nach der anderen, über AskUserQuestion, die grundlegendste zuerst.
5. **Schreiben** erst nach ausdrücklicher Freigabe und über den zweistufigen Schreib-Ablauf. Die Seitenliste aus dem Bericht dient dabei als Prüfliste für den Umfang.

## Auftrag an den Subagenten

Der Auftrag wird auf Englisch formuliert, der Bericht auf Deutsch verlangt.
Folgende Punkte gehören immer hinein; konkrete Seiten, Suchbegriffe und Physik-Themen werden pro Konzept ergänzt.

- **Nur lesen.** Keine Datei anlegen, ändern, verschieben oder löschen, nichts committen, keine Server starten.
- **Keine Lore erfinden, keine Option auswählen.**
- **Drei Ebenen trennen:** (a) was das Wiki sagt, mit Pfad und wörtlichem Zitat, (b) Analyse, (c) Optionen. Realwelt-Physik sichtbar als solche markieren, nie als Kanon.
- **Kanon-Status für den Auftrag:** keine Aussage gilt als Kanon; Ziele ableiten und bewerten (siehe Grundhaltung).
- **Ganzes `content/` durchsuchen**, nicht nur die offensichtlichen Seiten, einschließlich `content/Stories/**`, `content/Allgemein/TODO.md` und Bilddateinamen.
- **Git-Archäologie:** `git log -p --follow` auf die Kernseiten, frühere Dateinamen eingeschlossen. Fassungen als Tabelle (Datum, Commit, Kern der Fassung). Abhängige Seiten ihrer Entstehungs-Fassung zuordnen.
- **Herkunft prüfen:** Commit-Trailer wie `Co-Authored-By:` zeigen, ob eine Fassung zusammen mit einem Assistenten entstand. Solche Fassungen können ein Vorschlag sein, nicht die Absicht des Nutzers; im Bericht als offene Frage nennen.
- **Magiesystem einbeziehen:** `content/Allgemein/Magie/**` und die verlinkten Seiten lesen, ebenso Präzedenzfälle für ähnliche Magie auf anderen Seiten. Optionen müssen zu den eigenen Kostenregeln des Magiesystems passen, nicht zu generischer „Magie“.
- **Zeitangaben:** Die Einheit der `<!-- event: start=... -->`-Hooks steht in `.claude/skills/update-timeline/SKILL.md`. Zeitangaben im Fließtext gegen die Hooks prüfen.
- **Realitäts-Check pro Behauptung:** Was sagt die Physik, wie groß ist die Abweichung, welches Magie-Budget (niedrig / mittel / hoch / extrem) mit einzeiliger Begründung, und wo sitzt die Magie (einmalig oder dauerhaft, örtlich oder planetenweit).
- **Mehrdeutiges nicht still auslegen**, sondern als offene Frage aufführen.
- **Eigene Einschätzung** nur getrennt am Ende und ausdrücklich als solche markiert.

### Berichtsstruktur

1. **Kurzfazit** (5–10 Sätze): Zustand, größte Probleme, Haupt-Achsen.
2. **Bestandsaufnahme**: Fassungen-Tabelle aus der Git-Historie; alle Aussagen nach Thema gruppiert, mit Pfad und Zitat; nummerierte Widersprüche (W1, W2, …).
3. **Abgeleitete Ziele**: Tabelle mit Bewertung und Quellen (Z1, Z2, …); Zielkonflikte; teure Ziele.
4. **Realitäts-Check pro Behauptung** (C1, C2, …).
5. **Design-Achsen und Optionen**: unabhängige Achsen, die grundlegendste zuerst, je 2–5 Optionen. Pro Option: Beschreibung, gehaltene und gebrochene Ziele, Magie-Budget, betroffene Seiten, Folgen für abhängige Themen. Kopplungen zwischen Achsen ausdrücklich.
6. **Gesamtpakete**: 2–4 stimmige Kombinationen ohne Rangfolge, mit Gesamtbudget, was erhalten bleibt und was neu geschrieben werden müsste.
7. **Betroffene Seiten**: Tabelle mit Art der Änderung je nach Entscheidung.
8. **Offene Fragen**, die nur der Nutzer beantworten kann.

## Übergabe an den Nutzer

- Den Pfad zum vollständigen Bericht nennen, damit der Nutzer ihn selbst lesen kann.
- Im Chat eine Zusammenfassung geben: Kernbefund, Fassungen, Achsen, Gesamtpakete. Nicht den ganzen Bericht wiederholen.
- Hat der Nutzer um eine Einschätzung gebeten, gibt der Assistent sie getrennt von den Optionen und klar als seine eigene markiert. Sonst bleibt es bei neutral nebeneinandergestellten Optionen (`lore-collaboration`, „Häufige Fehler“).
- Die erste Frage betrifft die grundlegendste Achse. Liefert der Bericht eine Gewichtungsfrage, die mehrere Achsen auf einmal vorentscheidet (z. B. „Erklärbarkeit oder Optik“), kommt sie zuerst.
- Für die Reihenfolge von Zusammenfassung und Rückfrage gilt `AGENTS.md` (Text vor AskUserQuestion).
- Detailfragen, die am Konzept hängen (z. B. die Tierart, mit der alles anfing), ruhen, bis die betroffenen Achsen entschieden sind.
