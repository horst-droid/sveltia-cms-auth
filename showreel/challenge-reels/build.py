s = open('r11/index.html').read()
a = s.index('// ---------- media ----------\n') + len('// ---------- media ----------\n')
b = s.index('let cur = REELS[0];')
s = s[:a] + open('svg.js').read() + open('r15/reels.js').read() + s[b:]
rep = [
 ('<title>HORST Heldentaten</title>', '<title>Sag einfach Horst</title>'),
 ('<p class="eyebrow">Reel-Set · 1080 × 1920 · seit 2004</p>', '<p class="eyebrow">Reel-Set · 1080 × 1920 · Challenge</p>'),
 ('<h1>Jeder Tag braucht Heldentaten<span>.</span></h1>', '<h1>Langweilig? Sag einfach Horst<span>.</span></h1>'),
 ('<p class="lede">Aus dem „Über mich“-Text: die Heldentaten-Uhr, das Rezept für Heldentaten und der Pfeil, der um die Ecke denkt. Alles live gerechnet.</p>',
  '<p class="lede">Konzept 03: das Start-Reel mit den Regeln und die Antwort-Vorlage als 5-Sekunden-Loop. Links das Original der Einsendung, dann wischt HORSTs Version rüber. Drei gezeichnete Beispiele stehen als Platzhalter, echte Einsendungen kommen als Bild rein.</p>'),
 ('.reels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}', '.reels{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}'),
 ("/^[1-3]$/", "/^[1-9]$/"),
 ('<kbd>1</kbd>–<kbd>3</kbd> Reel wählen.', '<kbd>1</kbd>–<kbd>9</kbd> Reel wählen, weitere per Klick.'),
 ("document.fonts.load(DISP(100), '06:30')", "document.fonts.load(DISP(100), 'HORST WAR DA')"),
 ("hud(cur.hud, cur.dur, T >= cur.dur - 2.4 ? C.white : cur.hudColor());", "hud(cur.hud, cur.dur, T >= cur.dur - 2.5 ? C.white : cur.hudColor());"),
]
for x, y in rep:
    assert x in s, x[:60]
    s = s.replace(x, y)
open('r15/index.html', 'w').write(s)
open('r15/test.html', 'w').write('<meta charset="utf-8">\n' + s)
print('ok', len(s))
