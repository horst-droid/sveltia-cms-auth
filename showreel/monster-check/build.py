s = open('r11/index.html').read()
a = s.index('// ---------- media ----------\n') + len('// ---------- media ----------\n')
b = s.index('let cur = REELS[0];')
s = s[:a] + open('svg.js').read() + open('r17/reels.js').read() + s[b:]
rep = [
 ('<title>HORST Heldentaten</title>', '<title>Monster-Check Reel</title>'),
 ('<p class="eyebrow">Reel-Set · 1080 × 1920 · seit 2004</p>', '<p class="eyebrow">Reel · 1080 × 1920 · 40 Sekunden</p>'),
 ('<h1>Jeder Tag braucht Heldentaten<span>.</span></h1>', '<h1>Ist deine Marke launch-ready<span>?</span></h1>'),
 ('<p class="lede">Aus dem „Über mich“-Text: die Heldentaten-Uhr, das Rezept für Heldentaten und der Pfeil, der um die Ecke denkt. Alles live gerechnet.</p>',
  '<p class="lede">Nach Felix’ Skript vom 30.10.: die Mechanik der viralen Technik-Checklisten (Zähler, Kapitel, Haken), aber mit der Frage, die dort fehlt. Vier Kapitel, zwölf Haken, HORST als Prüfer in der Ecke, zwei CTA-Varianten. Die Voice-over-Sätze stehen als Text im Bild, ein Sprecher kann sie zusätzlich einsprechen.</p>'),
 ('.reels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}', '.reels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}'),
 ("/^[1-3]$/", "/^[1-9]$/"),
 ('<kbd>1</kbd>–<kbd>3</kbd> Reel wählen.', '<kbd>1</kbd>–<kbd>9</kbd> Reel wählen, weitere per Klick.'),
 ("document.fonts.load(DISP(100), '06:30')", "document.fonts.load(DISP(100), 'MONSTER-READY')"),
 ("hud(cur.hud, cur.dur, T >= cur.dur - 2.4 ? C.white : cur.hudColor());", "hud(cur.hud, cur.dur, T >= cur.dur - 2.5 ? C.white : cur.hudColor());"),
]
for x, y in rep:
    assert x in s, x[:60]
    s = s.replace(x, y)
open('r17/index.html', 'w').write(s)
open('r17/test.html', 'w').write('<meta charset="utf-8">\n' + s)
print('ok', len(s))
