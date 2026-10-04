import re, sys
R = sys.argv[1]
src = open(f'{R}/claim-reel/index.html').read()
a_end = src.index('// ---------- Claim:')
b_start = src.index('// ---------- audio ----------')
A, B = src[:a_end], src[b_start:]
def rep(s, old, new, count=1):
    assert old in s, old[:80]
    return s.replace(old, new, count)
# shared engine edits
A = rep(A, 'const W = 1080, H = 1920, DUR = 15;', 'const W = 1080, H = 1920; let DUR = 12;')
A = re.sub(r"const SCENES = \[.*?\];\n", '', A, flags=re.S)
for line in ["const M = {};\n", "function loadImg(key, src){ return new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; M[key] = i; }); }\n",
             "const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);\n", "const ready = el => el && el.complete && el.naturalWidth > 0;\n", "function syncVideos(){}\n"]:
    A = rep(A, line, '')
A = rep(A, '.scenes{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}', '.scenes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}')
A = rep(A, '@media (max-width:520px){.scenes{grid-template-columns:repeat(3,minmax(0,1fr))}}', '@media (max-width:520px){.scenes{grid-template-columns:repeat(2,minmax(0,1fr))}}')
A = rep(A, '<div class="tc" id="tc">00.0 <span>/ 15.0</span></div>', '<div class="tc" id="tc">00.0 <span>/ 12.0</span></div>')
A = rep(A, 'max="15000"', 'max="12000"')
B = re.sub(r"const EVENTS = \[\];\n\(function build\(\)\{.*?\n\}\)\(\);\n",
  "let EVENTS = [];\nfunction buildEvents(){ EVENTS = []; soundFor((t, fn) => EVENTS.push({ t, fn })); EVENTS.sort((a,b) => a.t - b.t); }\n", B, flags=re.S)
assert 'buildEvents' in B
B = re.sub(r"const sceneWrap = \$\('scenes'\);\nconst chips = SCENES\.map.*?\n\}\);\nlet lastIdx = -1;\n",
"""const sceneWrap = $('scenes');
const chips = VARIANTS.map((v, i) => {
  const b = document.createElement('button'); b.type = 'button';
  b.innerHTML = `<b>${v.name}</b><small>${v.dur} s</small>`;
  b.addEventListener('click', () => { if (!recording) selectVariant(i, true); });
  sceneWrap.appendChild(b); return b;
});
let lastIdx = -1;
function selectVariant(i, autoplay){
  const was = playing; if (playing) pause();
  cur = i; DUR = VARIANTS[i].dur; scrub.max = DUR*1000; buildEvents();
  try { history.replaceState(null, '', '#' + VARIANTS[i].slug); } catch(e){}
  t = 0; lastIdx = -1; dirty = true;
  if (autoplay || was) play();
}
selectVariant(cur, false);
window.addEventListener('hashchange', () => { const i = VARIANTS.findIndex(v => '#' + v.slug === location.hash); if (i >= 0 && i !== cur && !recording) selectVariant(i, false); });
""", B, flags=re.S)
assert 'selectVariant(cur' in B
B = rep(B, "tc.innerHTML = `${t.toFixed(1).padStart(4,'0')} <span>/ 15.0</span>`;", "tc.innerHTML = `${t.toFixed(1).padStart(4,'0')} <span>/ ${DUR.toFixed(1)}</span>`;")
B = rep(B, "von 15 s`", "von ${DUR} s`")
B = rep(B, "if (reduce) t = 13.8;", "if (reduce) t = DUR - 1.2;")
def build(name, scenes, title, aria, eyebrow, h1, lede, fname_prefix, note=None):
    a = rep(A, '<title>HORST Claim Reel</title>', f'<title>{title}</title>')
    a = rep(a, 'aria-label="Instagram-Typo-Reel mit dem Claim von Studio HORST"', f'aria-label="{aria}"')
    a = re.sub(r'<p class="eyebrow">.*?</p>', f'<p class="eyebrow">{eyebrow}</p>', a, count=1)
    a = re.sub(r'<h1>.*?</h1>', f'<h1>{h1}</h1>', a, count=1)
    a = re.sub(r'<p class="lede">.*?</p>', f'<p class="lede">{lede}</p>', a, count=1, flags=re.S)
    if note: a = rep(a, '<p class="note">', f'<p class="note">{note} ')
    b = rep(B, "filename:`studio-horst-claim.${ext}`", f"filename:`{fname_prefix}-${{VARIANTS[cur].slug}}.${{ext}}`")
    out = a + ''.join(open(f).read() + '\n' for f in (scenes if isinstance(scenes, list) else [scenes])) + b
    open(f'{R}/{name}/index.html', 'w').write(out)
    print(name, len(out))
build('statement-reels', 'stmt-scenes.js', 'HORST Statement Reels', 'Instagram-Reel mit einem Haltungs-Statement von Studio HORST',
  'Instagram Reels · 1080 × 1920 · je 12 Sekunden · 6 Themen', 'Statements<span>.</span>',
  'Sechs Haltungs-Reels aus deinen eigenen Statements: Sichtbarkeit, Bekanntheit, Mut, Design, Kreativität und KI. Thema wählen, abspielen, aufnehmen – jedes Thema wird ein eigenes Video.',
  'studio-horst-statement', 'Texte aus deiner Statement-Sammlung im Content-Pool.')
build('projekt-reels', 'proj-scenes.js', 'HORST Projekt Reels', 'Instagram-Reel mit Logoanimationen aus dem Portfolio von Studio HORST',
  'Instagram Reels · 1080 × 1920 · Showreel 15 s + 5 Projekte à 12 s', 'Projekte<span>.</span>',
  'Logoanimationen aus deinem Portfolio: ein Showreel mit allen fünf Marken und je ein Projekt-Reel für EVOMOTIV, JACOB, green hornets, Riva und Goth – Name, Logo in Bewegung, Anwendung, Abspann.',
  'studio-horst-projekt', 'Videos und Bilder aus dem Content-Pool (03-projekte-cases). Unterzeilen wie „Logo · Corporate Design“ bitte prüfen.')
build('pool-reels', ['pool-scenes.js', 'common-media.js'], 'HORST Pool Reels', 'Instagram-Reel aus dem Content-Pool von Studio HORST',
  'Instagram Reels · 1080 × 1920 · Chronik, 5 Irrtümer, Checkliste, Finde Felix', 'Aus dem Pool<span>.</span>',
  'Acht Reels aus deinem Content-Pool: „20 Thaten“ als Chronik von 2003 bis heute, fünf Marken-Irrtümer und eine Checkliste aus deinem Free Guide (Säule Wissen &amp; Hilfe) und „Finde Felix“ mit dem Monsterbad.',
  'studio-horst-pool', 'Bilder aus 20-jahre-schtorys, 03-projekte-cases und dem Ideenatlas. Projekte 2006–2018 sind als Arbeit bei Jung &amp; Hungrig gekennzeichnet.')
build('ideenatlas-reels', ['font-agilo.js', 'atlas-scenes.js', 'common-media.js'], 'HORST Ideenatlas Reels', 'Instagram-Reel nach einer Karte aus dem Ideenatlas von Studio HORST',
  'Instagram Reels · 1080 × 1920 · Ideen überall, A12, A04, C14 + E06-Endkarte', 'Ideenatlas<span>.</span>',
  'Karten aus deinem Ideenatlas, umgesetzt ohne Dreh: „Ideen überall“ aus dem Hook-Storyboard C01–C08 im Skizzenbuch-Look, A12 „Eine Idee. Viele Auftritte.“ mit echten EVOMOTIV-Anwendungen, A04 „Kirchzarten hast vergessen“ mit HORST und C14 „Zettelberge“. Dazu die Endkarte für E06 „Mein schwierigster Kunde“ zum Anhängen in CapCut.',
  'studio-horst-atlas', 'Karten-IDs wie im Ideenatlas vom 19.09.2026.')
build('website-showreel', ['web-scenes.js', 'common-media.js'], 'HORST Website Showreel', 'Showreel von Studio HORST mit Referenzen von der Website',
  'Showreel · 1080 × 1920 · 42,7 Sekunden · 90 BPM Laid-back Hip-Hop', 'Showreel<span>.</span>',
  'Deine Website als Geschichte in 16 Takten: Schwarzwald, HORST sagt Salli, die ehrliche Einordnung, die Monsteridee, 16 Referenzen auf dem Beat, ein Logo entsteht im Zeitraffer, Logos und Filme in Bewegung, Markenidentitäten, Abspann. Jeder Schnitt sitzt auf dem Beat.',
  'studio-horst-showreel', 'Material aus deinem Website-Ordner: Hero-Slider, Schwarzwald-Hintergrund, Kundenlogos, Logoanimationen, Filme und das HORST-Video.')
build('skizzenbuch-reels', ['font-agilo.js', 'font-barlow.js', 'sketch-scenes.js', 'common-media.js'], 'HORST Skizzenbuch Reels', 'Instagram-Reel im Skizzenbuch-Look von Studio HORST',
  'Instagram Reels · 1080 × 1920 · Lookstudie 01 · drei Beispiele', 'Aus dem Skizzenbuch<span>.</span>',
  'Der Look aus deiner Lookstudie 01 als Reihe: Riso-Bilder auf gerissenem Papier, Klebeband, Schnittmarken, Druckschrift-Headlines und rote Marker-Notizen. Drei Beispiele: „Jetzt bin ich selbst dran.“, „Salli.“ und „Was ist eine Monsteridee?“',
  'studio-horst-skizzenbuch', 'Bilder aus Sichtbarkeits-Moodboard, Lookstudie und Monsterbad, im Riso-Verfahren neu gerastert.')
