const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const M = {};
const ok = el => el && el.complete && el.naturalWidth > 0;
function loadImg(key, src){ return new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; M[key] = i; }); }
const mediaP = Promise.race([Promise.all([loadImg('logo', svgURL(SVG_LOGO_W)), loadImg('still', 'media/horst-still.jpg')]), new Promise(r => setTimeout(r, 8000))]).then(() => { dirty = true; });
function syncV(){}
// ---------- handmade helpers ----------
const MARK = s => `400 ${s}px "Permanent Marker", "Comic Sans MS", cursive`;
const HAND = s => `700 ${s}px Caveat, "Segoe Script", cursive`;
const PAPER = '#F4EFE4', INK = '#2A2520', PENCIL = '#4A4440';
const FPS8 = () => Math.floor(T*8);                       // stop-motion clock: everything handmade moves at 8 fps
const jit = (seed, amp = 2) => (rnd(seed + FPS8()*13) - .5)*amp;  // per-frame wobble, deterministic
// paper: warm sheet, fibres, slight vignette, a pencil margin
let paperC = null;
function paper(){
  if (!paperC){ paperC = document.createElement('canvas'); paperC.width = W; paperC.height = H; const c = paperC.getContext('2d');
    c.fillStyle = PAPER; c.fillRect(0, 0, W, H);
    for (let k = 0; k < 26000; k++){ c.fillStyle = `rgba(90,70,50,${0.02 + rnd(k)*0.05})`; c.fillRect(rnd(k + 1)*W, rnd(k + 2)*H, 1 + rnd(k + 3)*2, 1); }
    for (let k = 0; k < 500; k++){ c.strokeStyle = `rgba(120,100,80,${0.05 + rnd(k + 9)*0.08})`; c.lineWidth = 1; c.beginPath(); const x = rnd(k + 4)*W, y = rnd(k + 5)*H; c.moveTo(x, y); c.lineTo(x + (rnd(k + 6) - .5)*40, y + (rnd(k + 7) - .5)*10); c.stroke(); }
    const g = c.createRadialGradient(540, 960, 500, 540, 960, 1300); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(60,40,20,.18)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  ctx.drawImage(paperC, 0, 0);
}
// a wobbly hand-drawn line: many short segments with jitter that re-rolls at 8 fps
function sketchLine(x1, y1, x2, y2, col = PENCIL, wdt = 4, p = 1, seed = 0){
  if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const n = Math.max(6, Math.round(Math.hypot(x2 - x1, y2 - y1)/18)), m = Math.ceil(n*p);
  for (let pass = 0; pass < 2; pass++){ ctx.globalAlpha = pass ? 0.45 : 0.9; ctx.beginPath(); for (let i = 0; i <= m; i++){ const q = i/n, x = x1 + (x2 - x1)*q + jit(seed + i*7 + pass*99, 5), y = y1 + (y2 - y1)*q + jit(seed + i*11 + pass*77, 5); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  ctx.restore();
}
// a wobbly ellipse drawn with a marker, drawn progressively (the "circle it!" gesture)
function sketchRing(cx, cy, rx, ry, col, wdt, p, seed = 0){
  if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.lineCap = 'round'; ctx.globalAlpha = 0.9;
  const n = 64, m = Math.ceil(n*1.15*p); ctx.beginPath();
  for (let i = 0; i <= m; i++){ const a = -0.6 + i/n*TAU, w = 1 + jit(seed + i*5, 0.06), x = cx + Math.cos(a)*rx*w + jit(seed + i*3, 6), y = cy + Math.sin(a)*ry*w + jit(seed + i*9, 6); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke(); ctx.restore();
}
// handwriting that writes itself: the text is revealed left to right behind a ragged edge, with a wobble
function fitF(fontFn, s, maxW, maxS){ ctx.save(); ctx.font = fontFn(100); const w = ctx.measureText(s).width; ctx.restore(); return Math.min(maxS, 100*maxW/w); }
function write(s, x, y, font, col, t0, dur, align = 'left', seed = 0){
  const p = seg(T, t0, t0 + dur); if (p <= 0) return;
  ctx.save(); ctx.font = font; const w = ctx.measureText(s).width, x0 = align === 'center' ? x - w/2 : align === 'right' ? x - w : x;
  ctx.beginPath(); const edge = x0 + w*p; ctx.rect(x0 - 40, y - 200, edge - x0 + 40 + jit(seed, 10), 300); ctx.clip();
  ctx.translate(jit(seed + 1, 2), jit(seed + 2, 2)); ctx.rotate(jit(seed + 3, 0.01));
  ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.fillText(s, x0, y); ctx.restore();
  return w;
}
// masking tape strip
function tape(x, y, w, rot, seed = 0){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = 'rgba(235,225,190,.85)'; ctx.fillRect(-w/2, -22, w, 44); ctx.fillStyle = 'rgba(255,255,255,.25)'; for (let k = 0; k < 12; k++) ctx.fillRect(-w/2 + rnd(seed + k)*w, -22, 2, 44); ctx.restore(); }
// HORST as a pencil sketch: Sobel edges of the still, thresholded, drawn as graphite with an 8-fps boil
const sk = document.createElement('canvas'); sk.width = 520; sk.height = 560; let skReady = false;
function buildSketch(){
  if (skReady || !ok(M.still)) return; const c = sk.getContext('2d'); c.drawImage(M.still, 380, -30, 520, 560, 0, 0, 520, 560);
  const src = c.getImageData(0, 0, 520, 560), d = src.data, out = c.createImageData(520, 560), o = out.data, Wd = 520, Hd = 560;
  const gray = new Float32Array(Wd*Hd); for (let i = 0; i < Wd*Hd; i++) gray[i] = (d[i*4]*0.3 + d[i*4 + 1]*0.59 + d[i*4 + 2]*0.11);
  for (let y = 1; y < Hd - 1; y++) for (let x = 1; x < Wd - 1; x++){
    const i = y*Wd + x, gx = -gray[i - Wd - 1] - 2*gray[i - 1] - gray[i + Wd - 1] + gray[i - Wd + 1] + 2*gray[i + 1] + gray[i + Wd + 1], gy = -gray[i - Wd - 1] - 2*gray[i - Wd] - gray[i - Wd + 1] + gray[i + Wd - 1] + 2*gray[i + Wd] + gray[i + Wd + 1];
    const g = Math.hypot(gx, gy), dx = x - 260, dy = (y - 250)*520/560, inside = Math.hypot(dx, dy) < 230; // keep the head only
    const a = inside ? clamp((g - 28)/70, 0, 1) : 0; o[i*4] = 60; o[i*4 + 1] = 52; o[i*4 + 2] = 48; o[i*4 + 3] = Math.round(a*230);
  }
  c.putImageData(out, 0, 0); skReady = true;
}
function sketchHorst(cx, cy, w, p = 1, alpha = 1){ // p reveals top to bottom with a ragged edge
  buildSketch(); if (!skReady || p <= 0) return; const h = w*560/520, f = FPS8();
  ctx.save(); ctx.translate(cx + jit(5, 3), cy + jit(6, 3)); ctx.rotate(jit(7, 0.012)); ctx.globalAlpha = alpha;
  ctx.beginPath(); const edge = -h/2 + h*p; ctx.moveTo(-w/2 - 20, -h/2 - 20); ctx.lineTo(w/2 + 20, -h/2 - 20); for (let x = w/2 + 20; x >= -w/2 - 20; x -= 20) ctx.lineTo(x, edge + rnd(x + f)*30); ctx.closePath(); ctx.clip();
  ctx.drawImage(sk, -w/2, -h/2, w, h); ctx.globalAlpha *= 0.5; ctx.drawImage(sk, -w/2 + 2, -h/2 + 1, w, h); ctx.restore();
}
function scratch(d, w, dur = 0.5, g = 0.08){ noise(d, w, 'bandpass', 2200, 1.5, g, dur, 0.02); noise(d, w + dur*0.3, 'bandpass', 3400, 2, g*0.6, dur*0.6, 0.02); }
function squeak(d, w, f0 = 900, f1 = 1500, dur = 0.25){ const o = actx.createOscillator(), gg = actx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0, w); o.frequency.exponentialRampToValueAtTime(f1, w + dur); env(gg, w, 0.05, dur, 0.02); o.connect(gg); gg.connect(d); o.start(w); o.stop(w + dur + 0.1); }
function endPaper(t0){ // end card on paper: pencil frame, logo stamped, handwriting
  paper(); const p = eo(seg(T, t0, t0 + 0.5));
  sketchLine(90, 90 + 0, 990, 90, PENCIL, 3, p, 31); sketchLine(990, 90, 990, 1830, PENCIL, 3, p, 32); sketchLine(990, 1830, 90, 1830, PENCIL, 3, p, 33); sketchLine(90, 1830, 90, 90, PENCIL, 3, p, 34);
  const lg = M.logo; if (ok(lg)){ const lw = 640, lh = lw*lg.naturalHeight/lg.naturalWidth, sp = seg(T, t0 + 0.5, t0 + 0.65); if (sp > 0){ ctx.save(); ctx.translate(540 + jit(40, 2), 800 + jit(41, 2)); ctx.rotate(-0.03); ctx.scale(lerp(1.4, 1, eo(sp)), lerp(1.4, 1, eo(sp))); ctx.globalAlpha = 0.92;
    // the white wordmark as a dark rubber stamp: recolor via composite
    const o = document.createElement('canvas'); o.width = lw; o.height = Math.ceil(lh); const c = o.getContext('2d'); c.drawImage(lg, 0, 0, lw, lh); c.globalCompositeOperation = 'source-in'; c.fillStyle = C.red; c.fillRect(0, 0, lw, lh);
    ctx.drawImage(o, -lw/2, -lh/2); ctx.restore(); } }
  write('Monsterideen für mutige Marken.', 540, 1180, HAND(fitF(HAND, 'Monsterideen für mutige Marken.', 860, 78)), INK, t0 + 0.9, 1.4, 'center', 50);
  write('studio-horst.de', 540, 1320, MARK(54), C.red, t0 + 2.2, 0.8, 'center', 51);
  write('Kirchzarten im Schwarzwald', 540, 1420, HAND(44), PENCIL, t0 + 2.9, 0.9, 'center', 52);
}

// =====================================================================
// REEL 1 · SERVIETTE · the idea, scribbled on a napkin: pencil, marker, coffee ring
// =====================================================================
function reel1(){
  if (T >= 12.0){ endPaper(12.0); return; }
  paper();
  // coffee ring, already there
  ctx.save(); ctx.strokeStyle = 'rgba(110,70,30,.28)'; ctx.lineWidth = 26; ctx.beginPath(); ctx.ellipse(780, 420, 190, 180, 0.2, 0, TAU); ctx.stroke(); ctx.strokeStyle = 'rgba(110,70,30,.14)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(780, 420, 215, 205, 0.2, 0, TAU); ctx.stroke(); ctx.restore();
  tape(540, 120, 360, -0.04, 1);
  // pencil note, written at hand speed
  write('Idee:', 110, 560, HAND(96), PENCIL, 0.4, 0.6, 'left', 1);
  write('Dein Logo sagt', 110, 700, HAND(96), PENCIL, 1.1, 1.0, 'left', 2);
  write('„wir sind da“.', 110, 820, HAND(96), PENCIL, 2.2, 1.0, 'left', 3);
  write('Sag lieber, warum.', 110, 940, HAND(96), PENCIL, 3.4, 1.2, 'left', 4);
  // the pencil sketch of HORST appears in the corner, line by line
  sketchHorst(790, 1240, 560, seg(T, 4.6, 6.4));
  // marker circle around "warum", arrow to HORST, then the big word
  sketchRing(540, 905, 300, 95, C.red, 10, seg(T, 6.4, 7.0), 20);
  sketchLine(640, 1010, 700, 1120, C.red, 9, seg(T, 7.0, 7.3), 21); sketchLine(700, 1120, 660, 1100, C.red, 9, seg(T, 7.3, 7.4), 22); sketchLine(700, 1120, 706, 1070, C.red, 9, seg(T, 7.3, 7.4), 23);
  write('MONSTER-', 110, 1560, MARK(150), C.red, 7.8, 0.7, 'left', 5);
  write('IDEE.', 110, 1720, MARK(150), C.red, 8.5, 0.5, 'left', 6);
  sketchLine(110, 1760, 700, 1770, C.red, 8, seg(T, 9.1, 9.5), 24);
  write('(so machen wir das)', 1000, 1880, HAND(40), PENCIL, 9.8, 0.9, 'right', 7);
}
function audio1(add){
  add(0.4, (d,w) => scratch(d, w, 0.6)); add(1.1, (d,w) => scratch(d, w, 1.0)); add(2.2, (d,w) => scratch(d, w, 1.0)); add(3.4, (d,w) => scratch(d, w, 1.2));
  for (let t = 4.6; t < 6.4; t += 0.25) add(t, (d,w) => scratch(d, w, 0.22, 0.05));
  add(6.4, (d,w) => squeak(d, w, 700, 1400, 0.55)); add(7.0, (d,w) => squeak(d, w, 1200, 800, 0.3));
  add(7.8, (d,w) => squeak(d, w, 600, 1100, 0.7)); add(8.5, (d,w) => squeak(d, w, 650, 1000, 0.5)); add(9.1, (d,w) => squeak(d, w, 900, 1300, 0.35));
  add(9.8, (d,w) => scratch(d, w, 0.9, 0.06));
  add(12.0, (d,w) => noise(d, w, 'lowpass', 1200, 0.5, 0.25, 0.3)); add(12.5, (d,w) => { kick(d, w, 1.0); noise(d, w, 'lowpass', 800, 0.5, 0.5, 0.12); });
  add(12.9, (d,w) => scratch(d, w, 1.4, 0.06)); add(14.2, (d,w) => squeak(d, w, 800, 1200, 0.5));
}

// =====================================================================
// REEL 2 · POST-ITS · stop motion at 8 fps: three notes land on the wall, one gets circled
// =====================================================================
const NOTES = [
  { t:0.6, x:330, y:620, rot:-0.06, col:'#FFE766', l1:'Verstehen', l2:'wo steht die Marke?' },
  { t:2.2, x:760, y:900, rot:0.05, col:'#FFD1DC', l1:'Einordnen', l2:'was fehlt?' },
  { t:3.8, x:400, y:1230, rot:-0.03, col:'#BDE8C9', l1:'Zuspitzen', l2:'ein Satz. eine Idee.' },
];
function postit(n, p){ // p: 0..1 landing (stop-motion: 3 discrete positions), then rests with wobble
  const step = Math.min(3, Math.floor(p*4)), off = [900, 260, 60, 0][step], sc = [1.25, 1.12, 1.03, 1][step];
  ctx.save(); ctx.translate(n.x + jit(n.x, 2), n.y - off + jit(n.y, 2)); ctx.rotate(n.rot + jit(n.x + n.y, 0.01)); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 18*sc; ctx.shadowOffsetY = 10*sc; ctx.fillStyle = n.col; ctx.fillRect(-220, -220, 440, 440); ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(0,0,0,.06)'; ctx.fillRect(-220, -220, 440, 60);
  ctx.fillStyle = INK; ctx.font = MARK(64); ctx.textAlign = 'center'; ctx.fillText(n.l1, 0, 10); ctx.font = HAND(46); ctx.fillStyle = PENCIL; ctx.fillText(n.l2, 0, 110);
  ctx.restore();
}
function reel2(){
  if (T >= 12.0){ endPaper(12.0); return; }
  // wall: slightly darker paper with a pencil-drawn frame already there
  paper(); ctx.fillStyle = 'rgba(80,60,40,.06)'; ctx.fillRect(0, 0, W, H);
  write('Wie eine Monsteridee entsteht:', 540, 400, HAND(fitF(HAND, 'Wie eine Monsteridee entsteht:', 940, 72)), PENCIL, 0.0, 0.9, 'center', 11);
  NOTES.forEach(n => { if (T >= n.t) postit(n, seg(T, n.t, n.t + 0.5)); });
  // arrows between notes, drawn in pencil
  sketchLine(520, 700, 600, 760, PENCIL, 5, seg(T, 2.9, 3.2), 61); sketchLine(600, 760, 575, 715, PENCIL, 5, seg(T, 3.2, 3.3), 62); sketchLine(600, 760, 560, 770, PENCIL, 5, seg(T, 3.2, 3.3), 63);
  sketchLine(620, 1060, 560, 1080, PENCIL, 5, seg(T, 4.5, 4.8), 64); sketchLine(560, 1080, 598, 1046, PENCIL, 5, seg(T, 4.8, 4.9), 65); sketchLine(560, 1080, 602, 1095, PENCIL, 5, seg(T, 4.8, 4.9), 66);
  // the red marker circles the third note, then writes the result
  sketchRing(400, 1230, 270, 260, C.red, 11, seg(T, 5.6, 6.3), 70);
  write('= Monsteridee.', 70, 1680, MARK(fitF(MARK, '= Monsteridee.', 600, 120)), C.red, 6.9, 0.9, 'left', 12);
  sketchHorst(860, 1500, 380, seg(T, 8.0, 9.6));
  write('(immer so. seit 2004.)', 300, 1800, HAND(44), PENCIL, 9.8, 1.0, 'center', 13);
}
function audio2(add){
  add(0.0, (d,w) => scratch(d, w, 0.9));
  NOTES.forEach(n => { add(n.t, (d,w) => noise(d, w, 'bandpass', 1800, 0.6, 0.12, 0.08)); add(n.t + 0.25, (d,w) => noise(d, w, 'lowpass', 1500, 0.5, 0.3, 0.06)); add(n.t + 0.4, (d,w) => noise(d, w, 'bandpass', 900, 0.8, 0.18, 0.12)); });
  [2.9, 4.5].forEach(t => add(t, (d,w) => scratch(d, w, 0.4, 0.06)));
  add(5.6, (d,w) => squeak(d, w, 700, 1400, 0.7)); add(6.9, (d,w) => squeak(d, w, 600, 1000, 0.8));
  for (let t = 8.0; t < 9.6; t += 0.25) add(t, (d,w) => scratch(d, w, 0.22, 0.05));
  add(9.8, (d,w) => scratch(d, w, 1.0, 0.06));
  add(12.0, (d,w) => noise(d, w, 'lowpass', 1200, 0.5, 0.25, 0.3)); add(12.5, (d,w) => { kick(d, w, 1.0); noise(d, w, 'lowpass', 800, 0.5, 0.5, 0.12); });
  add(12.9, (d,w) => scratch(d, w, 1.4, 0.06)); add(14.2, (d,w) => squeak(d, w, 800, 1200, 0.5));
}

// ---------- the set ----------
const REELS = [
  { id:'serviette', name:'Serviette', tech:'Bleistift + Marker', dur:15, render:reel1, audio:audio1, hud:'KRITZEL', hudColor:() => PENCIL, file:'horst-kritzel-serviette', still:8.8,
    desc:'Papier mit Fasern und Kaffeerand, Klebeband oben. Eine Notiz <b>schreibt sich in Handschrift</b>: „Dein Logo sagt wir sind da. Sag lieber, warum.“ HORST entsteht als Bleistiftskizze (Kantenzeichnung aus dem echten Standbild, mit 8-fps-Wackeln), der rote Marker kreist „warum“ ein und schreibt MONSTERIDEE. Ton: Bleistiftkratzen, Marker-Quietschen.' },
  { id:'postits', name:'Post-its', tech:'Stop-Motion 8 fps', dur:15, render:reel2, audio:audio2, hud:'KRITZEL', hudColor:() => PENCIL, file:'horst-kritzel-postits', still:7.4,
    desc:'Drei Post-its landen <b>in drei Stop-Motion-Schritten</b> an der Wand: Verstehen, Einordnen, Zuspitzen. Bleistiftpfeile dazwischen, der rote Marker kreist das dritte ein: „= Monsteridee.“ HORST skizziert sich daneben. Alles wackelt leicht mit 8 Bildern pro Sekunde, wie von Hand fotografiert.' },
];
