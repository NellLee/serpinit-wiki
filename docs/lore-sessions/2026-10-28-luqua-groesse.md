# Lore-Session 2026-10-28: Luqua, astronomischer Reality Check

Übergabe-Notiz für die Fortsetzung auf einem anderen Gerät.
Enthält nur Analyse, Entscheidungen aus dem Gespräch und offene Punkte — keine Wiki-Prosa.
Regeln für die Session: `.claude/skills/lore-collaboration/SKILL.md`, Abschnitt "Realitäts-Checks".

## Stand

Aktueller Aspekt: **Luquas Größe und Schichtaufbau** — noch nicht abgeschlossen.
Nächster Schritt: die offenen Punkte unten per AskUserQuestion klären.
Erst danach fragen, ob es zum nächsten Aspekt geht.

`content/Himmelskörper/Luqua/index.md` enthält eine unfertige Bearbeitung des Nutzers (WIP-Commit, endet mit "…Planet beschreiben, denn ").

## Entscheidungen aus dem Gespräch

- "78 % Wasser" bezieht sich auf das **Volumen** (entspricht grob 50–55 % der Masse).
- Der Satz "erstreckt sich der eigentliche Ozean Luquas bis hinab zum Planetenkern" darf fallen.
- Kontakt zwischen Wasser und Gestein ist nicht durchgängig nötig, eventuell kaum.
- Fluero erzeugt über die Substanz-Schlote stetig neues Wasser.
  Darum muss Luquas Aufbau bewirken, dass auf der Tagseite Dampf ins All entweicht.
  Sonst würde die Masse des Planeten immer weiter zunehmen.
- Luqua soll eher klein sein.

## Ziele für den Aspekt

- **Pflicht:** Wasserverlust ins All auf der Tagseite (Gleichgewicht mit Flueros Zufuhr).
- **Pflicht:** physikalisch glaubhafter Planet, der seine Bahn freiräumt.
  Kollidiert das Freiräumen mit den Zielen, ist eine andere schlüssige Begründung für eine freie Bahn erlaubt.
- **Wunsch:** fleckiges Hochdruck-Eis am Ozeangrund, realistisch begründet.
- **Wunsch:** 78 % Wasser nach Volumen beibehalten.

## Analyse (grobe Abschätzungen)

Modell: Gesteinskern mit 60 % des Radius (Dichte 3,5 g/cm³), Wasser 1,1 g/cm³.

| Radius | Ozeantiefe | Schwerkraft | Fluchtgeschw. | Druck an der Kerngrenze | Masse |
|-|-|-|-|-|-|
| 1500 km | ca. 600 km | 0,7 m/s² | 1,4 km/s | 0,5 GPa | 0,004 Erdmassen |
| 2000 km | ca. 800 km | 0,9 m/s² | 1,9 km/s | 0,9 GPa | 0,009 Erdmassen |
| 2500 km | ca. 990 km | 1,1 m/s² | 2,4 km/s | 1,3 GPa | 0,018 Erdmassen |
| 3000 km | ca. 1200 km | 1,4 m/s² | 2,9 km/s | 1,9 GPa | 0,031 Erdmassen |
| 5000 km | ca. 2000 km | 2,3 m/s² | 4,8 km/s | 5,4 GPa | 0,14 Erdmassen |

- Hochdruck-Eis (Eis VI) bildet sich ab ca. 0,6 GPa bei 0 °C, bei ca. 80 °C erst ab ca. 2 GPa.
- Die Tiefe allein macht das Eis kaum fleckig: Kerntopografie ändert den Druck nur wenig.
  Die Temperatur wirkt viel stärker.
- **Grenzgröße** für fleckiges Eis: ca. 1700–2300 km Radius.
- Wasserverlust: UV-Strahlung von Ikus spaltet den Dampf, Wasserstoff entweicht leicht.
  Sauerstoff geht vor allem durch den Sternwind verloren — begünstigt durch geringe Schwerkraft und fehlendes Magnetfeld.
  Ab ca. 5000 km Radius wird der Verlust schwer zu begründen.
- Selbstregelung: Bei konstanter Zufuhr wächst Luqua, bis der Verlust (wächst mit der Oberfläche) die Zufuhr ausgleicht.

### Freiräumen der Bahn (Kriterium nach Margot 2015, Systemmasse ca. 42 M☉, Alter ca. 3 Mrd. Jahre)

| Abstand | Mindestmasse zum Freiräumen |
|-|-|
| 1 AU | ca. 0,02 Erdmassen |
| 5 AU | ca. 0,14 Erdmassen |
| 20 AU | ca. 0,66 Erdmassen |
| 50 AU | ca. 1,9 Erdmassen |
| 450 AU | ca. 22 Erdmassen |

Ohne Magie läge die bewohnbare Zone von Ikus bei ca. 450–900 AU.
Ergebnis: Ein kleiner Luqua räumt seine Bahn nirgends natürlich frei, wo er bewohnbar wäre — die freie Bahn braucht eine andere Begründung.

Kandidaten (noch nicht entschieden):
- Creapatos hat die Bahnen geformt (`Schöpfungsgeschichte.md`: er "formt … auch das Serpinit-System").
- Ein schwerer Nachbar (z. B. Collot) hält Luqua in einer stabilen Bahnresonanz und hat die Umgebung geräumt.
- Strahlung, Sternwind und Mavoraks frühere Supernova haben Kleinmaterial entfernt (allein eher zu schwach, als Ergänzung brauchbar).

### Mechanismen für fleckiges Hochdruck-Eis (noch nicht entschieden, kombinierbar)

- **Hohe Berge:** geringe Schwerkraft erlaubt Berge von grob 50 km und mehr, ca. 5–7 % Druckunterschied. Allein knapp.
- **Unterschiedlicher Wärmefluss:** Schmelzgrenze von Eis VI steigt um ca. 50 K pro GPa; 10 K wärmer verschiebt die Grenze um ca. 0,2 GPa. Stärkster Hebel (Flueros Ader, Gesteinskern).
- **Dichte Salzlauge:** salziges Wasser sammelt sich in Becken und gefriert später ("Club Sandwich"-Modell für Ganymed, Vance et al. 2014).

## Offene Punkte in diesem Aspekt

1. Genaue Größe innerhalb der Grenzgröße.
2. Welche Mechanismen das Eis fleckig machen.
3. Begründung für die freie Bahn.
4. Luquas Abstand zu Ikus hier mitklären oder als eigenen Aspekt danach (bestimmt auch die Temperatur der Tagseite, nötig grob 150–200 K).

## Für spätere Aspekte notiert

- Herkunft des Kabel-Minerals der Fluctro (`Fluctro/index.md`): Gestein an der Ader, Ausfällung aus Flueros Quellen oder erstarrte Substanz.
- Begründung des Wasserverlusts auf der Luqua-Seite ("geringe Temperatur hält seine Atmosphäre so kompakt") ist physikalisch nur halb richtig; Kandidat für eine Korrektur.
- `Fluero.md` spricht von "Bindung gewaltiger Wassermassen" durch Magie; physikalisch hält die Schwerkraft das Wasser.
- Der Vergleich mit "schwarzen Rauchern" passt ohne Gesteinskontakt schlechter.
- Luqua vor der Vier-Teilung (ca. 54 Mio. Jahre zurück): Die Oktopus-Vorfahren der Fluctro lebten schon davor.
- Magnetfeld, Salzgehalt des Ozeans, Dicke und Verhalten der Eisdecke.
