import re
s = open('r11/index.html').read()
a = s.index('// ---------- media ----------\n') + len('// ---------- media ----------\n')
b = s.index('let cur = REELS[0];')
s = s[:a] + open('svg.js').read() + open('r12/reels.js').read() + s[b:]
rep = [
 ('<title>HORST Heldentaten</title>', '<title>HORST Retro</title>'),
 ('<p class="eyebrow">Reel-Set · 1080 × 1920 · seit 2004</p>', '<p class="eyebrow">Reel-Set · 1080 × 1920 · 80er &amp; 90er</p>'),
 ('<h1>Jeder Tag braucht Heldentaten<span>.</span></h1>', '<h1>HORST, zurückgespult<span>.</span></h1>'),
 ('<p class="lede">Aus dem „Über mich“-Text: die Heldentaten-Uhr, das Rezept für Heldentaten und der Pfeil, der um die Ecke denkt. Alles live gerechnet.</p>',
  '<p class="lede">Vier Retro-Nummern mit HORST (VHS-Band, Arcade-Automat, 90er-Memphis, Mixtape-Kassette) plus die Geschichte von Herrn Thaten als Bilderbuch und die Mundpropaganda-Nummer „Geh zum Felix“. Bild und Sound werden live gerechnet, die Punchline ist immer dieselbe: Monsterideen, seit 2004.</p>'),
 ('.reels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}', '.reels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}'),
 ("/^[1-3]$/", "/^[1-6]$/"),
 ('<kbd>1</kbd>–<kbd>3</kbd> Reel wählen.', '<kbd>1</kbd>–<kbd>6</kbd> Reel wählen.'),
 ("document.fonts.load(DISP(100), '06:30')", "document.fonts.load(DISP(100), 'HORST')"),
]
for x, y in rep:
    assert x in s, x[:60]
    s = s.replace(x, y)
assert 'stempel' not in s, 'stempel left'
open('r12/index.html', 'w').write(s)
open('r12/test.html', 'w').write('<meta charset="utf-8">\n' + s.replace('horst-monster.mp4', 'horst-monster.webm'))
print('ok', len(s))
