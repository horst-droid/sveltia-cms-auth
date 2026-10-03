# Übergabe: Reels für Studio HORST

Stand 2026-10-03. Alles hier wurde in einer Claude-Code-Session gebaut. Diese Datei reicht, um nahtlos weiterzumachen.

## Die Reels (alle 9:16, 1080 × 1920, für Instagram)

| Ordner | Live-Artifact | Inhalt |
| --- | --- | --- |
| `horst-reel-2026/` | https://claude.ai/artifact/AThPAEWv9VrRHEsVs2KtuE | Showreel 15 s: MONSTERIDEEN®-Intro, „Viele Marken sehen ordentlich aus…“, THE IDEA IS THE KEY, 7 Projekte (Bilder + 3 Videos), Stempel „20 · seit 2004“, Kontakt |
| `monster-reel/` | https://claude.ai/artifact/AX6MGsa4jgF16Y86eBdibA | 13,5 s: Monster HORST (Website-Video als Boomerang) stellt sich in Sprechblasen vor, stürzt auf die Kamera zu, Zähne fressen den Screen („MAMPF!“), innen roter Abspann |
| `referenzen-reel/` | https://claude.ai/artifact/EtaTQa1e4KBB9iHNkX1u1i | 15 s: horst.-Logo (SVG) fest in der Mitte, darunter 15 Kundenlogos im Takt, immer schneller, dann Logo-Wand, Kontakt |
| `wer-ist-das-reel/` | https://claude.ai/artifact/UFgQUXeKKwbNcQ8roeqbzr | 15,5 s: Teaser durchs Guckloch – Fell, Kette, Ohr, Hörner, Schnauzer, Augen (Hinweis 1–6), dann Guckloch öffnet sich, „DAS IST HORST.“ + Ansage-Sprechblase, roter Abspann |
| `claim-reel/` | https://claude.ai/artifact/BcbxvXYo3LotABEsURVVLM | 15 s: Signet baut sich auf, kinetische Typo: „Monsterideen® für mutige Marken. Ich entwickle kraftvolle Ideen für MARKEN, PRODUKTE UND KAMPAGNEN – und übersetze sie gemeinsam mit meinen Kunden in SICHTBARE AUFTRITTE.“ |

Ältere Versuche (nicht mehr im Branding, nur Referenz): `studio-horst-reel-9x16.html`, `studio-horst-reel-16x9.html`, `claude-motion-reel.html`.

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
- Monster-Reel: Mundraum in `#FF4255` statt Dunkelrot? Zoom weniger stark (Video wird unscharf).
- 16:9-Fassungen für Website/Präsentation.
- Reels für Kunden mit Logo-Animation: Material liegt in Felix' Google-Drive-Ordner (lokale Session nötig). SVG-Logos bevorzugen, dann lassen sich Logos Teil für Teil animieren.
