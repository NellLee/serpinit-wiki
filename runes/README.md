# Runische Bibliothek

Dieses Verzeichnis enthaelt die kanonische Arbeitsbibliothek der Sgrisignier-Runensprache.
Die JSON-Dokumente in `runes/` sind die Quelle der Wahrheit fuer die strukturierte Runensprache.
Die App liest diese Sprache nur aus und leitet daraus eine reduzierte Darstellung ab.

## Verzeichnisordnung

- `schema/` enthaelt das gemeinsame Validierungsschema.
- `index/` enthaelt das massgebliche Verzeichnis aller kanonischen Runendokumente.
- `primitives/` enthaelt einzelne Grundformen.
- `structures/` enthaelt wiederverwendbare gefuegte Teilkoerper.
- `runes/` enthaelt vollstaendige Beispielrunen.

## Sprachregel

- Kanonische Begriffe bleiben deutsch und lore-nah.
- Englische Renderer- oder Technikbegriffe gehoeren nicht in die kanonischen Werte.
- Wirkformen, Beziehungsarten, Bahnformen und Ausrichtungswerte werden in der Sprache der Runenkunde benannt.
- App-interne Hilfsbegriffe duerfen nur ausserhalb der kanonischen JSON-Dokumente existieren.

## Autorierungsregeln

- Pro Datei genau eine kanonische Definition.
- `runes/index/library.json` bleibt die einzige massgebliche Entdeckungsquelle.
- Verweise innerhalb der Runensprache laufen ueber stabile Dokument-Ids, nie ueber Dateipfade.
- Die Rune bleibt eine integrierte Struktur.
- Kontrolllogik wird nicht als separates System daneben modelliert, sondern ueber runische Formen und Beziehungen selbst ausgedrueckt.

## Grundformen

Die erste Bibliothek umfasst sowohl einfache Grundformen als auch kontrollierende Grundformen.

Einfache Grundformen:

- `leitbahn`
- `drossel`
- `kammer`
- `gabel`
- `anker`
- `mantel`
- `sperre`

Kontrollierende Grundformen:

- `schwelle`
- `pruefkammer`
- `weiche`
- `rueckfuehrung`
- `siegelpfad`

Diese Formen sind nicht nur sichtbare Geometrie.
Sie tragen selbst operative Bedeutung wie Freigabe, Pruefung, Umlenkung, Ruecknahme und Siegelung.

## Projektion

`projection2d` beschreibt eine reduzierte zweidimensionale Lesart.
Sie ist keine vollstaendige Rune, sondern ein geordneter Querschnitt einer reicheren runischen Struktur.

Beim Authoring gilt:

- innere und aeussere Lesbarkeit muessen erhalten bleiben
- die sektorale Lage muss funktional stimmig sein
- Kontrollformen muessen als solche unterscheidbar bleiben
- Rueckfuehrungen und Siegelungen duerfen nicht wie gewoehnliche Auslassbahnen wirken

## Arbeitsablauf

1. Primitive, Struktur oder Rune in einer eigenen JSON-Datei anlegen oder ueberarbeiten.
2. Auf kanonische Terminologie und lore-stimmige Wirklogik achten.
3. Die Datei gegen `schema/rune-document.schema.json` gueltig halten.
4. Den passenden Eintrag in `index/library.json` anlegen oder aktualisieren.
5. Die Bibliothek ueber den App-Loader pruefen.
6. Die reduzierte Lesart in `/dev/runes` kontrollieren.
7. Tests, Check und Build erneut laufen lassen, bevor die Aenderung als stabil gilt.
