s = open('r11/index.html').read()
a = s.index('// ---------- media ----------\n') + len('// ---------- media ----------\n')
b = s.index('let cur = REELS[0];')
s = s[:a] + open('svg.js').read() + open('r13/reels.js').read() + s[b:]
rep = [
 ('<title>HORST Heldentaten</title>', '<title>HORST Studio</title>'),
 ('<p class="eyebrow">Reel-Set · 1080 × 1920 · seit 2004</p>', '<p class="eyebrow">Reel-Set · 1080 × 1920 · Studio-Stil</p>'),
 ('<h1>Jeder Tag braucht Heldentaten<span>.</span></h1>', '<h1>Ruhig, präzise, Studio<span>.</span></h1>'),
 ('<p class="lede">Aus dem „Über mich“-Text: die Heldentaten-Uhr, das Rezept für Heldentaten und der Pfeil, der um die Ecke denkt. Alles live gerechnet.</p>',
  '<p class="lede">Fünf Reels im Ton eines Designstudios: Schweizer Typografie auf dem 12-Spalten-Raster, Masken-Reveals, gezeichnete Linien, echte Projektbilder, Schwarz, Weiß und ein Rot. Sound nur als tiefer Puls und Klicks.</p>'),
 ('.reels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}', '.reels{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}'),
 ("/^[1-3]$/", "/^[1-5]$/"),
 ('<kbd>1</kbd>–<kbd>3</kbd> Reel wählen.', '<kbd>1</kbd>–<kbd>5</kbd> Reel wählen.'),
 ('<p class="note">HORST stammt aus dem Video von studio-horst.de.', '<p class="note">Projektbilder und HORST stammen von studio-horst.de.'),
 ("document.fonts.load(DISP(100), '06:30')", "document.fonts.load(DISP(100), 'MONSTERIDEE')"),
 ("hud(cur.hud, cur.dur, T >= cur.dur - 2.4 ? C.white : cur.hudColor());", "hud(cur.hud, cur.dur, T >= cur.dur - 2.0 ? C.white : cur.hudColor());"),
]
for x, y in rep:
    assert x in s, x[:60]
    s = s.replace(x, y)
assert 'stempel' not in s
open('r13/index.html', 'w').write(s)
open('r13/test.html', 'w').write('<meta charset="utf-8">\n' + s.replace('horst-monster.mp4', 'horst-monster.webm'))
print('ok', len(s))
