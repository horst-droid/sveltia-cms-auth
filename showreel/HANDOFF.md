# Übergabe: Reels für Studio HORST

Stand 2026-10-03 (abends: Statement- und Projekt-Reels ergänzt, gebaut in einer lokalen Session mit Zugriff auf den Google-Drive-Content-Pool). Alles hier wurde in einer Claude-Code-Session gebaut. Diese Datei reicht, um nahtlos weiterzumachen.

## Die Reels (alle 9:16, 1080 × 1920, für Instagram)

| Ordner | Live-Artifact | Inhalt |
| --- | --- | --- |
| `horst-reel-2026/` | https://claude.ai/artifact/AThPAEWv9VrRHEsVs2KtuE | Showreel 15 s: MONSTERIDEEN®-Intro, „Viele Marken sehen ordentlich aus…“, THE IDEA IS THE KEY, 7 Projekte (Bilder + 3 Videos), Stempel „20 · seit 2004“, Kontakt |
| `monster-reel/` | https://claude.ai/artifact/AX6MGsa4jgF16Y86eBdibA | 13,5 s: Monster HORST (Website-Video als Boomerang) stellt sich in Sprechblasen vor, stürzt auf die Kamera zu, Zähne fressen den Screen („MAMPF!“), innen roter Abspann |
| `referenzen-reel/` | https://claude.ai/artifact/EtaTQa1e4KBB9iHNkX1u1i | 15 s: horst.-Logo (SVG) fest in der Mitte, darunter 15 Kundenlogos im Takt, immer schneller, dann Logo-Wand, Kontakt |
| `wer-ist-das-reel/` | https://claude.ai/artifact/UFgQUXeKKwbNcQ8roeqbzr | 15,5 s: HORST setzt sich auf einem Bild Stück für Stück zusammen (weiche Flecken: Fell am Arm, Kette, Ohren, Hörner, Schnauzer, Augen), kein Text bis er ganz da ist, dann „DAS IST HORST.“ + Ansage-Sprechblase, roter Abspann |
| `claim-reel/` | https://claude.ai/artifact/BcbxvXYo3LotABEsURVVLM | 15 s: Signet baut sich auf, kinetische Typo: „Monsterideen® für mutige Marken. Ich entwickle kraftvolle Ideen für MARKEN, PRODUKTE UND KAMPAGNEN – und übersetze sie gemeinsam mit meinen Kunden in SICHTBARE AUFTRITTE.“ |
| `statement-reels/` | https://claude.ai/artifact/V9LKvxFRu8wSWSYx2rZ9nQ | 6 Haltungs-Reels à 12 s, umschaltbar (Chips oder `#slug`): **Sichtbarkeit** (Spotlight findet „Substanz“ → SICHTBAR WACHSEN), **Bekanntheit** (30 gleiche Kacheln, eine wird rot → CHARAKTER), **Mut** (laut, durchgestrichen → „Mut heißt klar sein.“ → „ordentlich“ gestrichen), **Design** (Konstruktionsraster, Signet mit Maßen), **Kreativität** (Gekritzel wird Linie → VERSTEHEN, EINORDNEN, ZUSPITZEN → THE IDEA IS THE KEY), **KI** (Variantenrauschen → „Aber nur Menschen haben Ideen.“ → KI ALS WERKZEUG / IDEE ALS SCHLÜSSEL). Texte aus `content-pool/01-ideen-haltung/statements/statements.docx` und `ki .docx` |
| `projekt-reels/` | https://claude.ai/artifact/XLGnxRnLX9YcirURJrjEdR | **Showreel** 15 s (5 MARKEN. 5 MONSTERIDEEN. → 5 Logoanimationen à 2 s → Abspann) + je 12 s **EVOMOTIV, JACOB, green hornets, Riva, Goth**: Name + Unterzeile → Logoanimation → „Im Einsatz“-Bilder (bzw. „Ein Zeichen, das bleibt.“ ohne Bilder) → „Deine Marke als Nächstes?“ |
| `pool-reels/` | https://claude.ai/artifact/71uuWXkXdbpHAfCuoZsG4f | 8 Reels aus dem Content-Pool: **20 Thaten** (15 s, Jahreszähler 2003→2024 mit 12 Stationen aus `20 Thaten.docx`, 2006–2018 als „mit Jung & Hungrig“ markiert), **Irrtum 1–5** (je 10 s, Marken-Irrtümer aus `Free Guide.docx`, Säule 02 Wissen & Hilfe), **Checkliste** („Deine Marke verliert Aufmerksamkeit, wenn …“), **Finde Felix** (Monsterbad als Wimmelbild, Ideenatlas D01) |
| `ideenatlas-reels/` | https://claude.ai/artifact/BvNScdaV5izaUiyebbjzkx | Ideenatlas-Karten ohne Dreh: **A12** Eine Idee. Viele Auftritte. (EVOMOTIV-Logo → Kartenstapel echter Anwendungen), **A04** Kirchzarten hast vergessen (Berlin/London/New York mit Koordinaten → HORST-Video mit Sprechblase), **C14** Zettelberge (20 Ideen-Zettel, einer bleibt), **E06-Endkarte** (3,5 s „Studio HORST. Jetzt auch mit Gesicht.“ zum Anhängen in CapCut) |
| `website-showreel/` | https://claude.ai/artifact/CmftJzrfdhSbhXUaXjniUb | **Das große Showreel** (42,7 s = 16 Takte à 90 BPM, Laid-back-Boom-Bap live synthetisiert: geswingte Hats, späte Snare, Rhodes-Akkorde Am9–Fmaj7–Dm9–Em7, Vinyl-Knistern; jeder Schnitt auf dem Beat). Story nach studio-horst.de: Schwarzwald (saubere Ebene aus `website/fog-cover-the-forest…psd`) → HORST „Salli. Ich bin HORST.“ → Website-Fragen „Wo steht deine Marke heute? …“ → MONSTERIDEE → 16 Referenzen aus `website/hero-slider/` (eine pro Beat, Leistungen als Laufschrift) → Bildschirmaufnahme green hornets im 12×-Zeitraffer → 4 Logoanimationen → Filme EVOMOTIV/Wetterauer → Breakdown „Die Werkzeuge sind zweitrangig“ → 15 Logos auf 16teln → HORST „Und deine Marke?“ → Abspann mit Hauptstr. 24 |

Ältere Versuche (nicht mehr im Branding, nur Referenz): `studio-horst-reel-9x16.html`, `studio-horst-reel-16x9.html`, `claude-motion-reel.html`.

### Quellcode der Varianten-Reels
`statement-reels/`, `projekt-reels/`, `pool-reels/`, `ideenatlas-reels/` und `website-showreel/` werden aus `_build/` erzeugt: `python3 _build/build.py .` (im Ordner `showreel/`, aus `_build/` heraus aufrufen) nimmt Motor, Ton und Transport aus `claim-reel/index.html` und setzt die Szenen aus `stmt-scenes.js`, `proj-scenes.js`, `pool-scenes.js` bzw. `atlas-scenes.js`/`web-scenes.js` ein; die letzten drei teilen sich `common-media.js` (Laden, Video-Sync über `variant.video()`, Neuzeichnen nach `seeked`, Endkarte, Ton – oder eigener Track über `variant.sound`, `render`). Jede Variante: `{slug, name, dur, end, draw, hits}`; `draw()` gibt `true` zurück, wenn der Hintergrund hell ist (HUD wird dann dunkel). Der Ton baut sich pro Variante aus `soundFor()` (Beat bis `end`, Akzente auf `hits`, Crash am Abspann). Datei-Export heißt `studio-horst-statement-<slug>.mp4` bzw. `studio-horst-projekt-<slug>.mp4`.

## Marke Studio HORST
- Farben: Rot `#FF4255`, Dunkel `#201C25`, Schwarz `#000000`, Weiß `#FFFFFF`, Hellgrau `#F8F7F8`
- Schriften: **ransom** (Headlines, eckig-geometrisch, `assets/font/ransom.woff2`, im HTML als base64 `@font-face` „HorstRansom“ eingebettet), **Inter** 600–800 (Text), **Montserrat** 600 uppercase gesperrt (kleine Labels)
- Logo „horst. Design und Kreativstudio“: `assets/logo/horst-rz-02.svg` (Original von Felix, Fill `#1d1d1b`, für Weiß im Code umgefärbt)
- Signet „h im Quadrat“: `assets/logo/horst-rz-solo.svg` (viewBox 184.7 × 183.3; im Code als Geometrie nachgebaut, damit es sich Balken für Balken aufbauen kann)
- Stempel „20 · Thatendrang und Heldenthaten · seit 2004“: `assets/logo/horst-rz-stempel-1.png`
- Claim: „Monsterideen® für mutige Marken.“ · Gruß: „Salli!“ · Leitsatz: „THE IDEA IS THE KEY.“
- Kontakt: Felix Thatenhorst, Hauptstr. 24, 79199 Kirchzarten, salli@studio-horst.de, 07661 90 95 259, studio-horst.de
- Ton der Texte: direkt, ich-Form, Schwarzwald, „Monsteridee“ als Leitidee eines Projekts

## Material (`assets/`)
- `projekte/`: 12 Galerie-Bilder der Website (1080²) – Fisherman's Friend, EVOMOTIV, Ganter, green hornets, JACOB (2), p4u, Weinflaschen, Kaffee/Visitenkarten, Zahn-Motiv, Prägung, Geschäftsausstattung „W“
- `videos/`: Website-Videos (u. a. `horst-1.mov` = Monster HORST, `green-hornets.mp4`, `evomotiv-film.mp4`, `w-start.mp4`)
- `referenzen/`: 15 Kundenlogos (weiß auf transparent) von der Website
- `projekt-reels/media/`: Logoanimationen (je 6 s, 4:5, weißer Grund; Logo baut sich 0,5–2,5 s auf, steht bis ~5 s) aus `content-pool/03-projekte-cases/<kunde>/*_00.mp4`, dazu Anwendungsbilder EVOMOTIV (Prägung, Geschäftsausstattung, Zeitung), JACOB (Transporter), green hornets (Wald-Visual, CD-Cover 2024)
- Projekt-Zuordnungen und Unterzeilen („Logoentwicklung“, „Kampagne“ …) sind aus den Bildern abgeleitet, nicht von Felix bestätigt.

## Technik (gilt für alle Reels)
- Eine HTML-Datei pro Reel, geschrieben als claude.ai-Artifact (ohne `<html>/<head>`; der Publish setzt das Gerüst). Ein Canvas 1080 × 1920, eine deterministische Funktion `render(t)` → jedes Bild ist eine Funktion der Zeit, Scrubben geht exakt.
- Szenen als Funktionen (`s1()`, `s2()` …) mit Zeitfenstern in `SCENES`; Helfer: `seg/eo/ein/eio/eback`, `slamWord` (Buchstaben knallen einzeln rein), `layoutWords/wordsIn` (Wort für Wort), `drawSignet`, `pill`.
- Ton: Web Audio, live synthetisiert (Kick, Hat, Clap, Bass, Riser, Crash, Pads), Event-Liste `EVENTS` mit Zeiten, Lookahead-Scheduler. Ton startet erst nach Klick (Browser-Regel).
- Export: Button „● Reel aufnehmen“ = `MediaRecorder` auf `canvas.captureStream(60)` + Audio-Stream, Echtzeit-Aufnahme, Speichern über die Artifact-Capability `downloads` (`claude.use("downloads").save`). Chrome/Safari → MP4, sonst WebM.
- Medien liegen in `<reel>/media/` und werden beim Publish als Dateien mitgegeben: Artifact-Tool mit `root` = Reel-Ordner, `files` = `{"media/x.jpg": "media/x.jpg", …}`, `capabilities: {"downloads": true}`.
- Videos: H.264-MP4, für Canvas vorher mit ffmpeg zuschneiden/komprimieren (z. B. 1080², crf 27, ohne Ton). Video-Zeichnen prüft `videoWidth > 0` (nicht `readyState >= 2`), sonst flackert es beim Seeken.
- Testen lokal: `python3 -m http.server` im Reel-Ordner, Playwright scrubbt per `#scrub` und screenshottet `#cv`. Achtung: Playwright-Chromium kann kein H.264 → für Tests eine VP9-WebM-Kopie verwenden. Ohne `<meta charset>` zeigt der lokale Test Umlaute falsch (nur lokal).

## Offene Ideen
- Content-Pool-Hinweise: In `91-texte-archiv/HORST One.docx` steht ein von ChatGPT erfundenes Kundenzitat („Jochen W.“) – nicht verwenden. Adresse dort „Hauptstraße 42“ ist veraltet – laut studio-horst.de gilt Hauptstr. 24. Stempel „20 · seit 2004“ für 2026 prüfen.
- Nächste Kandidaten aus dem Pool: Einzelgeschichten pro Jahr aus „20 Thaten“ (z. B. „Kleinstes Oktoberfest der Welt – nix verdient, aber geile Aktion“), Ritter-Standbild (`chatgpt-ideenatlas/figuren/spricht-folge-01/03-ritter.png`) mit Atlas-B02-Text, „Über mich“ als Karussell, Projekt-Karussells 4:5 nach `Instagram-Plan-Studio-HORST.docx`.
- Monster-Reel: Mundraum in `#FF4255` statt Dunkelrot? Zoom weniger stark (Video wird unscharf).
- 16:9-Fassungen für Website/Präsentation.
- Unterzeilen der Projekt-Reels („Logo · Corporate Design“, „Logo · Fahrzeug“ …) sind aus dem Material abgeleitet – von Felix bestätigen lassen; Freigaben der Kunden für Instagram stehen in den `_quellen.md` noch auf ☐.
- Weitere Projekt-Reels: Content-Pool hat Material zu Ganter, Rothaus/SC Freiburg, Strudels, Fisherman's Friend (nur Bilder, keine Logoanimation) – dafür eine Bilder-Variante von `caseReel()` bauen.
- Statements übrig für weitere Reels: „Positionierung ist kein Workshop-Ergebnis. Sie ist eine Entscheidung.“, „Substanz vor Fassade.“, „20+ Jahre Erfahrung …“, „Ich gebe die Richtung vor. Wir entwickeln sie gemeinsam weiter.“
