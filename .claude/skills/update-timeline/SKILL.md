---
name: update-timeline
description: Use whenever a Serpinit-Wiki conversation establishes, changes, or removes a datable/chronological fact — a new event, a shift in when something happened, a new "vor/nach der Ikusation" placement, a birth/death, war start/end, discovery, founding, etc. Keeps the wiki's `<!-- event: ... -->` hooks (embedded directly in the relevant content/**.md pages) in sync with lore decisions. Trigger on phrases like "wann passiert das", "das war vor/nach der Ikusation", "zeitlich einordnen", or any time a lore decision implies a point or span on the world's timeline.
---

# Timeline aktuell halten

Die Weltchronologie lebt **direkt in den Wiki-Seiten** als unsichtbarer Markdown-Hook, nicht mehr in einer externen Datei. Die App scraped beim Start alle `content/**.md`-Dateien nach `<!-- event: ... -->`-Kommentaren (`app/src/lib/timeline.ts`) und baut daraus die Timeline für `/content/timeline` sowie die "Ereignis in Zeitleiste anzeigen"-Links auf den einzelnen Seiten. Es gibt keine `timeline/Geschichte.timeline`-Datei mehr.

## Wann aktiv werden

Immer wenn im Gespräch ein zeitlich verortbares Ereignis **neu entschieden, verschoben oder gestrichen** wird — nicht bei rein beschreibenden/atemporalen Lore-Fragen (Magiesysteme, Charaktereigenschaften ohne Datierung, etc.).

## Hook-Syntax

```
<!-- event: start=<dezimal> [end=<dezimal>] category="<Name>" text="<Label>" [fuzzy] [fuzzy_start] [fuzzy_end] -->
```

- **`start`** (Pflicht): Dezimalwert in **Serpen**, siehe [Allgemein/Zeit.md](/content/Allgemein/Zeit.md) und [Allgemein/Serpe.md](/content/Allgemein/Serpe.md). Epoche `0.0` = Beginn der Ikusation. Negative Werte liegen davor.
- **`end`** (optional): fehlt er, ist es ein Zeitpunkt (`end = start`), sonst eine Zeitspanne.
- **`category`** (Pflicht, in Anführungszeichen): muss exakt einem Namen aus `app/src/lib/timelineCategories.ts` entsprechen (aktuell: Planetar, Agranum, Aridess, Collot & Linunar, Luqua, Mognar, Navura, Venoxi, Ikus, Mavorak, Universal, Interplanetar, Ikusation). Fehlt eine passende Kategorie, mit dem Nutzer klären, ob eine neue Zeile in dieser Datei ergänzt wird (Name, Farbe, ggf. `parent`).
- **`text`** (Pflicht, in Anführungszeichen): kurzes Label für die Zeitleiste. Kann NICHT von der Seitenüberschrift übernommen werden, da eine Seite mehrere Events mit unterschiedlichen Labels tragen kann.
- **`fuzzy`, `fuzzy_start`, `fuzzy_end`**: einfache Flags ohne Wert, wenn die Datierung bewusst unscharf bleibt.

## Platzierung und Beschreibungstext

Der Hook selbst schreibt **niemals** Lore-Text — er bleibt ein unsichtbarer Kommentar und wird beim Rendern nicht verändert. Steht er direkt vor einem normalen Absatz (keine Überschrift, Liste, Tabelle, Bild, Zitat oder ein weiterer Hook dazwischen), wird dieser Absatz automatisch als `description` für die Zeitleisten-Ansicht mitgenommen — ganz ohne Text zu duplizieren. Soll das Ereignis **keine** Beschreibung zeigen, den Hook einfach vor eine Überschrift oder ans Ende eines Abschnitts setzen.

Eine Seite darf **beliebig viele** `event`-Hooks enthalten (z. B. eine Ereignis-Seite mit mehreren Phasen, oder ein Charakter mit mehreren Lebensstationen) — jeder Hook erzeugt einen eigenen Eintrag, alle geteilt über den href dieser Seite.

Beispiel (Ereignis ohne Beschreibung, weil direkt eine Überschrift folgt):
```md
<!-- event: start=0 category="Ikusation" text="Beginn der Ikusation" -->

## Auslöser
...
```

Beispiel (mehrere Ereignisse auf einer Seite, Beschreibung wird aus vorhandenem Text übernommen):
```md
## Creapatos
<!-- event: start=-21006404 category="Interplanetar" text="Creapatos erschafft das Serpinit-Sonnensystem" fuzzy_end -->
In einer Galaxis entwickelte sich die konzentrierte magische Substanz zu einer namenlosen Gottheit, ...
```

## Vorgehen bei einer neuen/geänderten Datierung

1. Passende Seite identifizieren — meist die Seite, die gerade im Gespräch bearbeitet/besprochen wird. Bei einem neuen, noch nicht verschriftlichten Ereignis: die inhaltlich naheliegendste bestehende Seite wählen, nicht extra eine neue Seite nur für das Event anlegen.
2. Zeitpunkt relativ zur Ikusation (`0.0`) und im Verhältnis zu benachbarten bestehenden Events ableiten. Grobe Umrechnung zur Einordnung: 1 Serpe ≈ 1024 Mavorak-Zyklen ≈ 145 Jahre. Ist die Einordnung unklar, aktiv nachfragen (z. B. "wie viele Jahre vor/nach X ungefähr?") statt zu raten — ein `fuzzy`-Flag ist ein legitimes Ergebnis, kein Ausweichen.
3. Hook an der inhaltlich passenden Stelle einfügen (siehe Platzierungsregel oben).
4. Bei Verschiebung/Löschung: den bestehenden `<!-- event: ... -->`-Kommentar auf der betroffenen Seite suchen (`grep -rn "<!-- event:" content/`) und gezielt anpassen oder entfernen.
5. **Vor dem Schreiben immer Zeitwert, Kategorie und Label dem Nutzer zur Bestätigung vorlegen.**
6. Nach dem Schreiben optional verifizieren: `grep -rn "<!-- event:" content/ | wc -l` zur Kontrolle der Gesamtzahl, sowie `npm run test --prefix app` (Datei `app/src/lib/timeline.test.ts` deckt die Scraping-Logik ab).
