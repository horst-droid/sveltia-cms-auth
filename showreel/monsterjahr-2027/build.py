s = open('r11/index.html').read()
a = s.index('// ---------- media ----------\n') + len('// ---------- media ----------\n')
b = s.index('let cur = REELS[0];')
s = s[:a] + open('svg.js').read() + open('r14/reels.js').read() + s[b:]
rep = [
 ('<title>HORST Heldentaten</title>', '<title>Monsterjahr 2027</title>'),
 ('<p class="eyebrow">Reel-Set · 1080 × 1920 · seit 2004</p>', '<p class="eyebrow">Reel-Set · 1080 × 1920 · Januar 2027</p>'),
 ('<h1>Jeder Tag braucht Heldentaten<span>.</span></h1>', '<h1>Keine Vorsätze. Ideen<span>.</span></h1>'),
 ('<p class="lede">Aus dem „Über mich“-Text: die Heldentaten-Uhr, das Rezept für Heldentaten und der Pfeil, der um die Ecke denkt. Alles live gerechnet.</p>',
  '<p class="lede">Konzept 01 und der Neujahrs-Auftakt: die Kuckucksuhr um Mitternacht und 14 Vorsätze-Reels, einer pro Tag vom 2. bis 15. Januar. Alle Vorsätze kommen aus einer Liste und lassen sich tauschen.</p>'),
 ('.reels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}', '.reels{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}'),
 ("/^[1-3]$/", "/^[1-9]$/"),
 ('<kbd>1</kbd>–<kbd>3</kbd> Reel wählen.', '<kbd>1</kbd>–<kbd>9</kbd> Reel wählen, weitere per Klick.'),
 ("document.fonts.load(DISP(100), '06:30')", "document.fonts.load(DISP(100), 'GESTRICHEN')"),
 ("hud(cur.hud, cur.dur, T >= cur.dur - 2.4 ? C.white : cur.hudColor());", "hud(cur.hud, cur.dur, T >= cur.dur - 2.5 ? C.white : cur.hudColor());"),
]
for x, y in rep:
    assert x in s, x[:60]
    s = s.replace(x, y)
open('r14/index.html', 'w').write(s)
open('r14/test.html', 'w').write('<meta charset="utf-8">\n' + s)
print('ok', len(s))
