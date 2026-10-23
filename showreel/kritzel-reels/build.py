s = open('r11/index.html').read()
a = s.index('// ---------- media ----------\n') + len('// ---------- media ----------\n')
b = s.index('let cur = REELS[0];')
s = s[:a] + open('svg.js').read() + open('r16/reels.js').read() + s[b:]
rep = [
 ('<title>HORST Heldentaten</title>', '<title>HORST Kritzel</title>'),
 ('family=Inter:wght@400;600;700;800&family=Montserrat:wght@600&display=swap', 'family=Inter:wght@400;600;700;800&family=Montserrat:wght@600&family=Permanent+Marker&family=Caveat:wght@700&display=swap'),
 ('<p class="eyebrow">Reel-Set · 1080 × 1920 · seit 2004</p>', '<p class="eyebrow">Reel-Set · 1080 × 1920 · Prototyp handgemacht</p>'),
 ('<h1>Jeder Tag braucht Heldentaten<span>.</span></h1>', '<h1>Aufs Papier gekritzelt<span>.</span></h1>'),
 ('<p class="lede">Aus dem „Über mich“-Text: die Heldentaten-Uhr, das Rezept für Heldentaten und der Pfeil, der um die Ecke denkt. Alles live gerechnet.</p>',
  '<p class="lede">Prototyp für den authentischen Look ohne Dreh: Papier mit Fasern, Handschrift, die sich schreibt, Bleistiftlinien mit 8-fps-Wackeln, Stop-Motion-Post-its, HORST als Kantenskizze aus dem echten Standbild. Mit echten Scans und Fotos von Felix wird daraus die Serie.</p>'),
 ('.reels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}', '.reels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}'),
 ("/^[1-3]$/", "/^[1-2]$/"),
 ('<kbd>1</kbd>–<kbd>3</kbd> Reel wählen.', '<kbd>1</kbd>–<kbd>2</kbd> Reel wählen.'),
 ("document.fonts.load(DISP(100), '06:30'), document.fonts.load(F(800, 100), 'Marken')", "document.fonts.load('400 100px \"Permanent Marker\"', 'MONSTER'), document.fonts.load('700 100px Caveat', 'Idee')"),
 ("hud(cur.hud, cur.dur, T >= cur.dur - 2.4 ? C.white : cur.hudColor());", "hud(cur.hud, cur.dur, cur.hudColor());"),
]
for x, y in rep:
    assert x in s, x[:60]
    s = s.replace(x, y)
open('r16/index.html', 'w').write(s)
open('r16/test.html', 'w').write('<meta charset="utf-8">\n' + s)
print('ok', len(s))
