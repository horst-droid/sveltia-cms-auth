# Übergabe: Showreel Studio HORST

Stand 2026-10-03. Ziel: echtes Showreel für Studio HORST, zuerst 9:16 für Instagram (1080 × 1920, ca. 15 s), danach optional 16:9.

## Bisher gebaut
- **`horst-reel-2026/`**: aktuelles Reel mit echter Marke, live als Artifact: https://claude.ai/artifact/AThPAEWv9VrRHEsVs2KtuE (Medien liegen in `media/`, beim Publish als Dateien mitgeben).
- `studio-horst-reel-9x16.html`, live als Artifact: https://claude.ai/artifact/Wyts464KW48V5isM1k7gH1
  Canvas-Engine mit `render(t)`, Web-Audio-Beat, vier Medien-Slots, Export per MediaRecorder und `downloads`-Capability.
  **Achtung:** Farben und Schrift kommen dort aus einer alten Dither-Demo (Grün-Grau, Bricolage) und sind NICHT die echte Marke. Auf das Branding unten umstellen.
- `studio-horst-reel-16x9.html`: Querformat, Farben frei gewählt, ebenfalls umstellen.
- `claude-motion-reel.html`: erste Demo, nur als Referenz.

## Echte Marke (von studio-horst.de, Elementor-Kit)
- Farben: Rot `#FF4255` (Akzent), Dunkel `#201C25`, Schwarz `#000000`, Weiß `#FFFFFF`, Hellgrau `#F8F7F8`
- Schriften: `ransom` für Headlines (Datei `assets/font/ransom.woff2`, 700), `Inter` 600 für Text/Labels (Google Fonts), `Montserrat` 600 uppercase für kleine Labels
- Logo: Wortmarke „horst.“ mit „Design und Kreativstudio“ (`assets/logo/horst-rz-white-scaled-1.png`, weiß), Bildmarke „h“ im Quadrat (`assets/logo/horst-logo-05.png`), Stempel „20 · Thatendrang und Heldenthaten · seit 2004“ (`assets/logo/horst-rz-stempel-1.png`)
- Claim: „Monsterideen® für mutige Marken.“ Gruß: „Salli!“ Leitsatz: „THE IDEA IS THE KEY.“
- Kontakt: Felix Thatenhorst, Hauptstr. 24, 79199 Kirchzarten, salli@studio-horst.de, 07661 90 95 259, studio-horst.de
- Kernaussagen: über 20 Jahre Design- und Agenturerfahrung; „Viele Marken sehen ordentlich aus. Aber fühlen sich nicht wirklich nach etwas an.“; „Am Anfang steht nicht das Design – sondern die Idee.“
- Leistungen: Monsteridee entwickeln · Branding & Markenauftritt · Logo & Markenzeichen · Visuelle Systeme · Kampagnen · Print & digitale Medien · Marken-Check · Kreative Sparringsrunden · Langfristige Markenbegleitung

## Material in `assets/`
Projekte (1080 × 1080 JPG, aus der Website-Galerie):
| Datei | Motiv |
| --- | --- |
| `-FF2` | Fisherman's Friend Dose |
| `-evo5` | EVOMOTIV Prägung auf Rot |
| `-ganter` | Ganter/Freiburger Bier, Paar als Flaschen |
| `-gh` | green hornets Solartechnik Logo |
| `-jm` | JACOB Transporter-Beschriftung |
| `-jm3` | JACOB Messtechnik Logo auf Blau |
| `-p4u` | „Ein Plus für Sie.“ Logo-Prägung |
| `-s2` | Drei Weinflaschen auf Lila |
| `-st` | Kaffeebecher und Visitenkarten |
| `-v` | Zahnmaler im Mund (Zahnarzt-Motiv) |
| `-w` | Bildmarke-Prägung grau |
| `1` | Geschäftsausstattung schwarz-weiß „W“ |

Videos (MP4, quadratisch 1080/960, 5–15 s): `evomotiv-film.mp4`, `green-hornets.mp4`, `w-start.mp4`, `gen4-animation-1/2.mp4`; `horst-1.mov` (1280 × 720).

Kundennamen und Bildzuordnung bitte mit Felix abstimmen, bevor sie als Text ins Reel gehen.

## Nächste Schritte
1. 9:16-Reel auf echtes Branding umbauen (Farben, ransom/Inter, Logo „horst.“, Stempel).
2. Projektbilder und -videos fest einbauen (über `assets`-Capability hochladen oder als Dateien neben der Seite publizieren), statt leerer Slots.
3. Texte aus der Website verwenden, Export testen, dann 16:9-Version.
