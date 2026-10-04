// ---------- Skizzenbuch-Look (Lookstudie 01): riso images on torn paper, tape, crop marks, ink headlines, red marker notes ----------
const OUT = ['o1.jpg', 'o2.jpg', 'o3.jpg', 'o4.jpg', 'o5.jpg', 'o6.jpg'];
const MEDIA = [...OUT, 's1-tuer.jpg', 's2-monster.jpg', 's3-vorhang.jpg', 's4-tisch.jpg', 'mb-full.jpg', 'l1-person.jpg', 'l2-geschichte.jpg', 'l3-ideen.jpg'];
const SB = 60/90, sb = n => n*SB;                                  // 90 BPM
const SK = { paper:'#ECE5D8', ink:'#1C181B', red:'#FF4255', tape:'rgba(233,223,201,.82)' };
const INKF = s => `700 ${s}px HorstRansom, "Arial Black", sans-serif`; // Felix: headlines in his Ransom
const MONO = s => `500 ${s}px "SF Mono", Menlo, Consolas, monospace`;
const HANDF = s => `${Math.round(s*1.3)}px HorstHand, "Comic Sans MS", cursive`;
[['HorstHand', HAND_URL], ['Barlow', BARLOW_URL]].forEach(([n, u]) => { try { const f = new FontFace(n, `url(${u})`, n === 'Barlow' ? { weight:'900' } : {}); document.fonts.add(f); f.load().then(() => { dirty = true; }).catch(() => {}); } catch(e){} });

const noiseTile = (alpha, density, seed) => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), d = g.createImageData(256, 256);
  for (let i = 0; i < d.data.length; i += 4){ const r = rnd(i*0.013 + seed); d.data[i] = d.data[i+1] = d.data[i+2] = r*255; d.data[i+3] = r < density ? alpha : 0; } g.putImageData(d, 0, 0); return c; };
const GRAIN = noiseTile(26, 1, 3), HOLES = noiseTile(255, 0.10, 9);
function paperBg(){
  bg(SK.paper); ctx.save(); ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(540, 960, 400, 540, 960, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(60,40,20,.16)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = SK.ink; ctx.lineWidth = 2; ctx.globalAlpha = 0.7;
  [[60, 200], [1020, 200], [60, 1790], [1020, 1790]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x + 18, y); ctx.moveTo(x, y - 18); ctx.lineTo(x, y + 18); ctx.stroke(); });
  ctx.restore();
}
function monoLabel(str, x, y, size = 30, color = SK.ink, a = 1, align = 'left'){ // "01 / PERSON" with a red slash
  ctx.save(); ctx.globalAlpha = a; ctx.font = MONO(size); ls(ctx, 2); ctx.textBaseline = 'alphabetic';
  const parts = str.split(' / '), widths = parts.map(p => ctx.measureText(p).width), sep = ctx.measureText(' / ').width;
  let x0 = align === 'center' ? x - (widths.reduce((a, b) => a + b, 0) + sep*(parts.length - 1))/2 : x;
  parts.forEach((p, i) => { ctx.fillStyle = color; ctx.fillText(p, x0, y); x0 += widths[i]; if (i < parts.length - 1){ ctx.fillStyle = SK.red; ctx.fillText(' / ', x0, y); x0 += sep; } });
  ctx.restore();
}
const inkOff = document.createElement('canvas'); inkOff.width = 1080; inkOff.height = 1920; const ictx = inkOff.getContext('2d');
// ink headline: uppercase condensed, each line slams in on its beat, worn by printing holes
function inkHead(lines_, size, x, y, lh, tIns, colors, align = 'left', dot = false){
  ictx.setTransform(1,0,0,1,0,0); ictx.clearRect(0, 0, 1080, 1920); ictx.textBaseline = 'alphabetic'; let any = false;
  lines_.forEach((s, i) => {
    const p = seg(T, tIns[i], tIns[i] + 0.16); if (p <= 0) return; any = true;
    ictx.save(); ictx.font = INKF(size); const w = ictx.measureText(s).width, x0 = align === 'center' ? x - w/2 : x, yy = y + i*lh;
    const sc = lerp(1.18, 1, eo(p)); ictx.translate(x0 + w/2, yy - size*0.35); ictx.scale(sc, sc); ictx.rotate((1 - eo(p))*(i % 2 ? 0.04 : -0.04));
    ictx.fillStyle = colors[i] || SK.ink; ictx.fillText(s, -w/2, size*0.35);
    if (dot && i === lines_.length - 1){ ictx.fillStyle = SK.red; ictx.fillRect(w/2 + size*0.06, size*0.35 - size*0.19, size*0.17, size*0.17); }
    ictx.restore();
  });
  if (!any) return;
  ictx.globalCompositeOperation = 'destination-out'; ictx.globalAlpha = 0.55; ictx.fillStyle = ictx.createPattern(HOLES, 'repeat'); ictx.fillRect(0, 0, 1080, 1920);
  ictx.globalCompositeOperation = 'source-over'; ictx.globalAlpha = 1;
  ctx.drawImage(inkOff, 0, 0);
}
const fitInk = (s, maxW, maxS) => { ctx.save(); ctx.font = INKF(100); const w = ctx.measureText(s).width; ctx.restore(); return Math.min(maxS, 100*maxW/w); };
const fitAll = (lines_, maxW, maxS) => Math.min(...lines_.filter(Boolean).map(l => fitInk(l, maxW, maxS)));
function tornPath(w, h, seed){
  const pts = [], step = 16, j = k => (rnd(seed + k*1.7) - .5)*9;
  let k = 0; for (let x = 0; x <= w; x += step) pts.push([x, j(k++)]); for (let y = 0; y <= h; y += step) pts.push([w + j(k++), y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h + j(k++)]); for (let y = h; y >= 0; y -= step) pts.push([j(k++), y]);
  return pts;
}
function tape(x, y, w, rot, seed){
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = SK.tape; ctx.beginPath();
  const h = 46; ctx.moveTo(-w/2, -h/2); for (let i = 0; i <= 6; i++) ctx.lineTo(-w/2 + i*w/6, -h/2 + (rnd(seed + i) - .5)*5);
  for (let i = 0; i <= 4; i++) ctx.lineTo(w/2 + (rnd(seed + 10 + i) - .5)*8, -h/2 + i*h/4);
  for (let i = 6; i >= 0; i--) ctx.lineTo(-w/2 + i*w/6, h/2 + (rnd(seed + 20 + i) - .5)*5);
  for (let i = 4; i >= 0; i--) ctx.lineTo(-w/2 + (rnd(seed + 30 + i) - .5)*8, -h/2 + i*h/4);
  ctx.closePath(); ctx.fill(); ctx.restore();
}
// photo on torn paper; returns the card's frame so notes can point into it
function photoCard(key, cx, cy, w, rot, t0, seed){
  const el = M[key]; if (!ready(el)) return null;
  const h = w*el.naturalHeight/el.naturalWidth, p = eo(seg(T, t0, t0 + 0.24)), s = lerp(1.15, 1, p), dy = (1 - p)*-50;
  if (p <= 0) return null;
  ctx.save(); ctx.translate(cx, cy + dy); ctx.rotate(rot*(2 - p)); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, p*3);
  const path = tornPath(w, h, seed);
  ctx.shadowColor = 'rgba(40,30,20,.35)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10;
  ctx.beginPath(); path.forEach(([x, y], i) => i ? ctx.lineTo(x - w/2, y - h/2) : ctx.moveTo(x - w/2, y - h/2)); ctx.closePath(); ctx.fillStyle = '#F4EEE3'; ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.save(); ctx.clip(); ctx.drawImage(el, -w/2, -h/2, w, h); ctx.restore();
  tape(0, -h/2 + 4, 190, -0.06 + (rnd(seed) - .5)*0.1, seed); tape(w/2 - 60, h/2 - 6, 150, 0.5 + (rnd(seed + 3) - .5)*0.2, seed + 50);
  ctx.restore();
  return { cx, cy, w, h, rot };
}
const inCard = (c, rx, ry) => { const x = (rx - 0.5)*c.w, y = (ry - 0.5)*c.h, cs = Math.cos(c.rot), sn = Math.sin(c.rot); return [c.cx + x*cs - y*sn, c.cy + x*sn + y*cs]; };
function handWrite(lines_, size, x, y, lh, color, tIn, dur, align = 'left', rot = 0){
  ctx.save(); ctx.font = HANDF(size); ctx.fillStyle = color;
  lines_.forEach((s_, i) => {
    const p = seg(T, tIn + i*dur*0.8, tIn + i*dur*0.8 + dur); if (p <= 0) return;
    const w = ctx.measureText(s_).width, x0 = align === 'center' ? x - w/2 : x;
    ctx.save(); ctx.translate(x0, y + i*lh); ctx.rotate(rot); ctx.beginPath(); ctx.rect(-20, -size, (w + 40)*p, size*1.5); ctx.clip(); ctx.fillText(s_, 0, 0); ctx.restore();
  });
  ctx.restore();
}
function stroke(pts, p, width, color = SK.red){
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i-1] + Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]));
  const len = L[L.length-1]*p; if (len <= 0) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && L[i-1] < len; i++){ const r = Math.min(1, (len - L[i-1])/(L[i] - L[i-1])); ctx.lineTo(pts[i-1][0] + (pts[i][0]-pts[i-1][0])*r, pts[i-1][1] + (pts[i][1]-pts[i-1][1])*r); }
  ctx.stroke(); ctx.restore();
}
const ring = (cx, cy, r, seed) => Array.from({ length:41 }, (_, k) => { const a = -2.2 + k/40*TAU*1.12, rr = r*(1 + rnd(seed + k)*0.12 - 0.06); return [cx + Math.cos(a)*rr*1.12, cy + Math.sin(a)*rr]; });
function arrowPts(x0, y0, x1, y1, seed){
  const mx = (x0 + x1)/2 + (rnd(seed)*2 - 1)*80, my = (y0 + y1)/2 + (rnd(seed + 1)*2 - 1)*40, pts = [];
  for (let k = 0; k <= 20; k++){ const t = k/20, a = (1-t)*(1-t), b = 2*(1-t)*t, c = t*t; pts.push([a*x0 + b*mx + c*x1, a*y0 + b*my + c*y1]); }
  const ang = Math.atan2(y1 - pts[17][1], x1 - pts[17][0]), h = 40;
  return [pts, [[x1 - Math.cos(ang - 0.5)*h, y1 - Math.sin(ang - 0.5)*h], [x1, y1], [x1 - Math.cos(ang + 0.5)*h, y1 - Math.sin(ang + 0.5)*h]]];
}
function note(c, rx, ry, r, label, lx, ly, t0, seed, size = 92){ // ring + arrow + handwritten label
  const [tx, ty] = inCard(c, rx, ry);
  stroke(ring(tx, ty, r, seed), eio(seg(T, t0, t0 + 0.3)), 9);
  const [sh, hd] = arrowPts(lx, ly + (ly < ty ? 30 : -80), tx + (lx < tx ? -r*0.8 : r*0.8), ty + (ly < ty ? -r*0.8 : r*0.8), seed);
  stroke(sh, eio(seg(T, t0 + 0.15, t0 + 0.42)), 8); stroke(hd, eio(seg(T, t0 + 0.4, t0 + 0.5)), 8);
  handWrite([label], size, lx, ly, 0, SK.red, t0 + 0.05, 0.35, 'center', -0.05);
}
function paperEnd(t0, head = ['MONSTERIDEEN®', 'FÜR MUTIGE', 'MARKEN']){
  paperBg();
  drawSignet(540, 640, 220, SK.ink, seg(T, t0, t0 + 0.7));
  const hs = fitAll(head, 900, 150); inkHead(head, hs, 540, 960, hs*0.98, head.map((_, k) => t0 + 0.4 + k*0.2), head.map((_, k) => k === head.length - 1 && head.length > 3 ? SK.red : SK.ink), 'center', true);
  monoLabel('STUDIO-HORST.DE / KIRCHZARTEN', 540, 1420, 32, SK.ink, eo(seg(T, t0 + 1.1, t0 + 1.4)), 'center');
  stroke([[300, 1460], [540, 1452], [780, 1458]], eio(seg(T, t0 + 1.3, t0 + 1.6)), 9);
  stroke([[320, 1482], [560, 1476], [760, 1480]], eio(seg(T, t0 + 1.45, t0 + 1.75)), 6, SK.ink);
}

// 01 · Sichtbarkeit — „Ich mache Marken sichtbar. Jetzt bin ich selbst dran.“ (Moodboard Sichtbarkeit, Ideenatlas E12)
const SICHT = [
  { k:'s1-tuer.jpg',    cap:['ZEIT, MICH MAL', 'ZU ZEIGEN.'],           n:'01 / ZEIT', note:[0.47, 0.42, 80, 'das bin ich.'] },
  { k:'s2-monster.jpg', cap:['DIE IDEEN KENNT IHR.', 'JETZT KOMMT DER TYP.'], n:'02 / IDEEN', note:[0.6, 0.4, 70, 'der Typ.'] },
  { k:'s3-vorhang.jpg', cap:['NOCH NICHT FERTIG.', 'ICH FANG TROTZDEM AN.'], n:'03 / ANFANGEN', note:[0.13, 0.5, 80, 'Vorhang auf.'] },
  { k:'s4-tisch.jpg',   cap:['SICHTBAR WERDEN.', 'DAMIT WAS ENTSTEHT.'],  n:'04 / DU', note:[0.88, 0.66, 80, 'dein Platz?'] },
];
function vSicht(){
  const b = T/SB;
  if (b >= 26){ paperEnd(sb(26)); return true; }
  paperBg();
  monoLabel('LOOKSTUDIE / SICHTBARKEIT', 62, 250, 26, SK.ink, 0.85);
  if (b < 4){ const s = fitInk('SICHTBAR.', 960, 250); inkHead(['ICH MACHE', 'MARKEN', 'SICHTBAR.'], s, 62, 760, s*0.95, [sb(0.2), sb(1), sb(2)], [SK.ink, SK.ink, SK.ink]); return true; }
  if (b < 9){
    const s = fitInk('ICH SELBST', 960, 250); inkHead(['JETZT BIN', 'ICH SELBST', 'DRAN.'], s, 62, 760, s*0.95, [sb(4), sb(5), sb(6)], [SK.red, SK.red, SK.red]);
    stroke([[70, 760 + s*1.95 + 30], [380, 760 + s*1.95 + 22], [560, 760 + s*1.95 + 28]], eio(seg(T, sb(7), sb(7.6))), 10, SK.ink);
    return true;
  }
  const i = Math.min(3, Math.floor((b - 9)/4)), c0 = SICHT[i], t0 = sb(9 + i*4);
  monoLabel(c0.n, 62, 470, 30, SK.ink, eo(seg(T, t0, t0 + 0.2)));
  const s = fitAll(c0.cap, 950, 120);
  inkHead(c0.cap, s, 62, 580, s*0.98, [t0 + 0.05, t0 + 0.25], [SK.ink, SK.red]);
  const c = photoCard(c0.k, 540, 1080, 980, (i % 2 ? 0.02 : -0.025), t0 + 0.1, i*31 + 5);
  if (c){ const [rx, ry, r, label] = c0.note; const [tx] = inCard(c, rx, ry); note(c, rx, ry, r, label, clamp(tx + (rx > 0.5 ? -220 : 220), 200, 880), 1530, t0 + 1.2*SB*1.0 + 0.3, i*17); }
  return true;
}

// 02 · Salli — Person, Geschichte, Ideen (Lookstudie 01, ÜBER MICH.docx)
const SALLI = [
  { k:'l1-person.jpg',     n:'01 / PERSON',     head:['ICH BIN', 'FELIX.'],          w:620, rot:-0.03, tail:'Geboren im Dreisamtal.' },
  { k:'l2-geschichte.jpg', n:'02 / GESCHICHTE', head:['SEIT 20 JAHREN', 'DESIGNER.'], w:900, rot:0.025, tail:'Gestaltet. Aufgebaut. Geführt.' },
  { k:'l3-ideen.jpg',      n:'03 / IDEEN',      head:['VIELE', 'IDEEN.'],            w:700, rot:-0.02, tail:null },
];
function vSalli(){
  const b = T/SB;
  if (b >= 20){ paperEnd(sb(20)); return true; }
  paperBg();
  monoLabel('LOOKSTUDIE / ÜBER MICH', 62, 250, 26, SK.ink, 0.85);
  if (b < 3){
    handWrite(['Salli.'], 300, 540, 1060, 0, SK.ink, sb(0.2), 0.9, 'center', -0.04);
    stroke([[330, 1130], [560, 1118], [760, 1126]], eio(seg(T, sb(1.6), sb(2.2))), 12);
    return true;
  }
  if (b < 15){
    const i = Math.min(2, Math.floor((b - 3)/4)), c0 = SALLI[i], t0 = sb(3 + i*4);
    monoLabel(c0.n, 62, 300, 30, SK.ink, eo(seg(T, t0, t0 + 0.2)));
    const c = photoCard(c0.k, 540, 860, c0.w, c0.rot, t0, i*23 + 2);
    const s = fitAll(c0.head, 900, 170), y0 = c ? c.cy + c.h/2 + 60 + s*0.8 : 1400;
    inkHead(c0.head, s, 62, Math.min(y0, 1500), s*0.95, [t0 + sb(1), t0 + sb(1.5)], [SK.ink, SK.red], 'left', false);
    if (c0.tail) handWrite([c0.tail], 70, 62, Math.min(y0, 1500) + s*0.95 + 100, 0, SK.red, t0 + sb(2.4), 0.5, 'left', -0.02);
    if (i === 2 && c) note(c, 0.62, 0.17, 70, 'die eine.', 300, 360, t0 + sb(2.2), 41, 96);
    return true;
  }
  const s = fitInk('ZUSAMMENHÄLT.', 960, 200);
  monoLabel('ENTSCHEIDEND IST', 62, 640, 32, SK.ink, eo(seg(T, sb(15), sb(15.3))));
  inkHead(['DIE EINE,', 'DIE ALLES', 'ZUSAMMENHÄLT.'], s, 62, 800, s*0.98, [sb(15.5), sb(16.5), sb(17.5)], [SK.ink, SK.ink, SK.red]);
  return true;
}

// 03 · Was ist eine Monsteridee? — poster from the look study, then the answer
function vMonster(){
  const b = T/SB;
  if (b >= 22){ paperEnd(sb(22)); return true; }
  paperBg();
  monoLabel('LOOKSTUDIE / MONSTERIDEEN®', 62, 250, 26, SK.ink, 0.85);
  if (b < 7){
    const s = fitInk('WAS IST EINE', 940, 190);
    inkHead(['WAS IST EINE'], s, 540, 560, 0, [sb(0.2)], [SK.ink], 'center');
    const s2 = fitInk('MONSTER', 800, 250); inkHead(['MONSTER'], s2, 540, 900, 0, [sb(1.2)], [SK.ink], 'center');
    stroke([[150, 830], [520, 815], [930, 828]], eio(seg(T, sb(2.3), sb(2.7))), 16, SK.ink);
    handWrite(['MONSTER'], 190, 540, 700, 0, SK.red, sb(2.9), 0.45, 'center', -0.06);
    const s3 = fitInk('IDEE', 700, 330); inkHead(['IDEE'], s3, 540, 1230, 0, [sb(3.8)], [SK.ink], 'center');
    inkHead(['?'], 260, 540, 1500, 0, [sb(4.6)], [SK.ink], 'center');
    handWrite(['Die Idee gibt die Richtung vor.'], 60, 540, 1680, 0, SK.red, sb(5.4), 0.7, 'center', -0.03);
    return true;
  }
  if (b < 14){
    const t0 = sb(7);
    monoLabel('IDEEN GIBT ES VIELE', 62, 300, 32, SK.ink, eo(seg(T, t0, t0 + 0.2)));
    const c = photoCard('mb-full.jpg', 540, 1000, 820, -0.02, t0, 77);
    if (c){ note(c, 0.5, 0.31, 75, 'der hier.', 790, 420, t0 + sb(2), 61, 100); }
    handWrite(['Gefunden wird sie gemeinsam.'], 74, 540, 1740, 0, SK.ink, t0 + sb(4), 0.6, 'center', -0.02);
    return true;
  }
  monoLabel('SO ENTSTEHT SIE', 62, 520, 32, SK.ink, eo(seg(T, sb(14), sb(14.3))));
  const s = fitInk('VERSTEHEN.', 900, 230);
  inkHead(['VERSTEHEN.', 'EINORDNEN.', 'ZUSPITZEN.'], s, 62, 760, s*1.02, [sb(14.5), sb(16), sb(17.5)], [SK.ink, SK.ink, SK.red]);
  [0, 1, 2].forEach(k => { const y = 760 + k*s*1.02 - s*0.35, t = sb(15 + k*1.5); stroke([[930, y], [955, y + 28], [1010, y - 34]], eio(seg(T, t, t + 0.25)), 11); });
  return true;
}

// ---------- Route „Die Idee bleibt“ (Studio HORST 2026): AI as toolkit, the idea as the key ----------
const KEY_END = ['THE IDEA', 'IS STILL', 'THE KEY'];
// positioning reel: everyone talks about what AI can do → yes, a lot → even runs the studio → but one thing matters more → the idea
const ENGINE = ['ANFRAGE', 'PROJEKT', 'BRIEFING', 'VARIANTEN', 'RECHNUNG'], ENGINE_R = ['SORTIERT', 'ANGELEGT', 'VORBEREITET', 'ERZEUGT', 'VORBEREITET'];
function vDieIdee(){
  const b = T/SB;
  if (b >= 22){ paperEnd(sb(22), KEY_END); return true; }
  paperBg(); monoLabel('DIE IDEE BLEIBT / 2026', 62, 250, 26, SK.ink, 0.85);
  if (b < 4){
    const c = photoCard('mb-full.jpg', 540, 1290, 680, -0.02, sb(0), 77);
    const s_ = fitInk('WAS KI INZWISCHEN', 950, 120);
    inkHead(['ALLE REDEN DARÜBER,', 'WAS KI INZWISCHEN', 'ALLES KANN.'], s_, 62, 470, s_*0.98, [sb(0.3), sb(1), sb(1.7)], [SK.ink, SK.ink, SK.ink]);
    return true;
  }
  if (b < 8){ // outputs on eighth notes
    const k = Math.min(OUT.length - 1, Math.floor((b - 4)*2)), t0 = sb(4 + k/2);
    for (let j = Math.max(0, k - 2); j <= k; j++) photoCard(OUT[j], 540 + (j % 2 ? 40 : -40), 1130 + (j - k)*-26, 900, (j % 2 ? 0.04 : -0.035), sb(4 + j/2), 300 + j*11);
    const s_ = fitInk('ZIEMLICH VIEL.', 900, 200); inkHead(['UND JA.', 'ZIEMLICH VIEL.'], s_, 62, 500, s_*0.98, [sb(4.2), sb(5.2)], [SK.ink, SK.red]);
    monoLabel(['BILD', 'FILM', 'ANIMATION', 'LAYOUT', 'WEBSITE', 'KAMPAGNE'][k] + ' / ' + String(k + 1).padStart(2, '0'), 62, 1700, 30, SK.ink, 1);
    return true;
  }
  if (b < 13){ // Maschinenraum: the studio engine ticks through
    const s_ = fitInk('MEIN STUDIO MIT.', 950, 130);
    inkHead(['INZWISCHEN', 'ORGANISIERT SIE', 'MEIN STUDIO MIT.'], s_, 62, 470, s_*0.98, [sb(8), sb(8.6), sb(9.2)], [SK.ink, SK.ink, SK.ink]);
    monoLabel('MASCHINENRAUM / HORST', 62, 900, 30, SK.red, eo(seg(T, sb(9.4), sb(9.7))));
    ENGINE.forEach((e, j) => { const t0 = sb(9.8 + j*0.6), a = eo(seg(T, t0, t0 + 0.2)); if (a <= 0) return; const y = 1010 + j*110;
      monoLabel(`${e} / ${ENGINE_R[j]}`, 62, y, 44, SK.ink, a); stroke([[900, y - 14], [925, y + 12], [975, y - 40]], eio(seg(T, t0 + 0.2, t0 + 0.4)), 10); });
    return true;
  }
  if (b < 17){
    const c = photoCard('mb-full.jpg', 540, 1310, 700, 0.02, sb(13), 91);
    const s_ = fitInk('NICHT UNWICHTIGER.', 950, 140);
    inkHead(['ABER EINE SACHE', 'WIRD DADURCH', 'NICHT UNWICHTIGER.'], s_, 62, 470, s_*0.98, [sb(13.2), sb(14), sb(14.8)], [SK.ink, SK.ink, SK.red]);
    return true;
  }
  const c = photoCard('mb-full.jpg', 540, 1050, 820, 0.02, sb(13), 91);
  if (c) note(c, 0.5, 0.31, 80, 'die eine.', 300, 420, sb(17.1), 61, 100);
  const s_ = fitInk('DIE IDEE.', 900, 300); inkHead(['DIE IDEE.'], s_, 540, 1720, 0, [sb(19)], [SK.ink], 'center');
  return true;
}
// Idee → Direction → System
const TRIAD = [
  { k:'l3-ideen.jpg',  n:'01 / MONSTERIDEE', head:['DIE IDEE.'],      hand:'kommt aus dem Kopf.' },
  { k:'l1-person.jpg', n:'02 / FELIX',       head:['DIE RICHTUNG.'],  hand:'wer entscheidet.' },
  { k:null,            n:'03 / MASCHINENRAUM', head:['DAS SYSTEM.'],  hand:'macht es sichtbar.' },
];
function vTriad(){
  const b = T/SB;
  if (b >= 16){ paperEnd(sb(16), KEY_END); return true; }
  paperBg(); monoLabel('DIE IDEE BLEIBT / ARBEITSWEISE', 62, 250, 26, SK.ink, 0.85);
  if (b < 4){
    const s_ = fitInk('IDEE → DIRECTION', 960, 170);
    inkHead(['IDEE →', 'DIRECTION →', 'SYSTEM.'], s_, 62, 760, s_*1.0, [sb(0.3), sb(1.3), sb(2.3)], [SK.ink, SK.ink, SK.red]);
    return true;
  }
  const i = Math.min(2, Math.floor((b - 4)/4)), c0 = TRIAD[i], t0 = sb(4 + i*4);
  monoLabel(c0.n, 62, 340, 32, SK.ink, eo(seg(T, t0, t0 + 0.2)));
  if (c0.k) photoCard(c0.k, 540, 900, 640, i ? 0.025 : -0.025, t0, 140 + i*9);
  else ENGINE.forEach((e, j) => { const tt = t0 + j*0.25, a = eo(seg(T, tt, tt + 0.2)); if (a > 0) monoLabel(`${String(j + 1).padStart(2, '0')} / ${e}`, 140, 620 + j*120, 52, SK.ink, a); });
  const s_ = fitInk(c0.head[0], 900, 210); inkHead(c0.head, s_, 62, 1500, 0, [t0 + sb(1)], [i === 2 ? SK.red : SK.ink]);
  handWrite([c0.hand], 84, 62, 1640, 0, SK.red, t0 + sb(2), 0.45, 'left', -0.03);
  return true;
}
// Statement series: lines slam in, one gesture in red marker, end card THE IDEA IS STILL THE KEY
const STMTS = [
  { slug:'s-entscheiden', name:'Entscheiden', lines:['JEDER KANN', 'GENERIEREN.', 'NICHT JEDER', 'KANN ENTSCHEIDEN.'], red:[2, 3], mark:{ t:'under', l:3 } },
  { slug:'s-briefing',    name:'Mach mal schön', lines:['KI KANN VIEL.', 'ABER', '', 'IST IMMER NOCH', 'KEIN BRIEFING.'], red:[4], hand:{ l:2, s:'„mach mal schön“' }, mark:{ t:'strikeHand', l:2 } },
  { slug:'s-varianten',   name:'100 Varianten', lines:['100 VARIANTEN', 'SIND NOCH', 'KEINE IDEE.'], red:[2], grid:true },
  { slug:'s-richtung',    name:'Richtung', lines:['DIE AUSFÜHRUNG', 'WIRD SCHNELLER.', 'DIE RICHTUNG', 'NICHT AUTOMATISCH', 'BESSER.'], red:[2, 3, 4], mark:{ t:'under', l:3 } },
  { slug:'s-studio',      name:'Mein Studio', lines:['MEIN STUDIO', 'IST NICHT', 'GRÖSSER GEWORDEN.', 'NUR SEINE', 'MÖGLICHKEITEN.'], red:[4], mark:{ t:'ring', l:4 } },
  { slug:'s-frueher',     name:'Früher / heute', lines:['FRÜHER:', 'GRAFIKDESIGNER.', 'HEUTE:', 'IDEE. DIRECTION.', 'SYSTEM.'], red:[3, 4], mark:{ t:'strike', l:1 } },
  { slug:'s-toolkit',     name:'Toolkit', lines:['AI IS NOT', 'MY STYLE.', 'IT’S MY', 'TOOLKIT.'], red:[3], mark:{ t:'ring', l:3 } },
  { slug:'s-wichtiger',   name:'Wichtiger', lines:['GENERIEREN', 'WIRD EINFACHER.', 'ENTSCHEIDEN', 'WIRD WICHTIGER.'], red:[2, 3], mark:{ t:'under', l:3 } },
];
function vStmt(st, n){ return () => {
  const b = T/SB;
  if (b >= 10){ paperEnd(sb(10), KEY_END); return true; }
  paperBg(); monoLabel(`DIE IDEE BLEIBT / ${String(n).padStart(2, '0')}`, 62, 250, 26, SK.ink, 0.85);
  const size = fitAll(st.lines, 940, 190), lh = size*1.22;
  const y0 = st.grid ? 520 : 960 - (st.lines.length - 1)*lh/2, tins = st.lines.map((_, k) => sb(0.4 + k*0.8));
  inkHead(st.lines, size, 62, y0, lh, tins, st.lines.map((_, k) => st.red.includes(k) ? SK.red : SK.ink));
  const tm = tins[tins.length - 1] + sb(1);
  if (st.hand){ const y = y0 + st.hand.l*lh; handWrite([st.hand.s], size*0.85, 62, y, 0, SK.ink, tins[st.hand.l], 0.5, 'left', -0.03);
    stroke([[50, y - size*0.3], [560, y - size*0.36], [900, y - size*0.28]], eio(seg(T, tm, tm + 0.3)), 14); }
  if (st.mark && st.mark.t !== 'strikeHand'){
    const y = y0 + st.mark.l*lh; ctx.save(); ctx.font = INKF(size); const w = ctx.measureText(st.lines[st.mark.l]).width; ctx.restore();
    if (st.mark.t === 'under'){ const u = size*0.13; stroke([[62, y + u], [62 + w*0.55, y + u - 7], [62 + w, y + u - 2]], eio(seg(T, tm, tm + 0.35)), 10); stroke([[80, y + u*1.9], [62 + w*0.6, y + u*1.9 - 5], [62 + w - 20, y + u*1.9 - 2]], eio(seg(T, tm + 0.2, tm + 0.5)), 6, SK.ink); }
    if (st.mark.t === 'strike') stroke([[50, y - size*0.32], [62 + w*0.5, y - size*0.38], [80 + w, y - size*0.3]], eio(seg(T, tm, tm + 0.3)), 14, SK.ink);
    if (st.mark.t === 'ring'){ const ry = size*0.95, sx = (w*0.62)/(ry*1.12); stroke(ring(62 + w/2, y - size*0.38, ry, n*7).map(([x, yy]) => [62 + w/2 + (x - 62 - w/2)*sx, yy]), eio(seg(T, tm, tm + 0.4)), 10); }
  }
  if (st.grid){ // 100 near-identical variants, one gets circled
    for (let k = 0; k < 100; k++){ const cx = 112 + (k % 10)*95, cy = 1000 + Math.floor(k/10)*72, a = eo(seg(T, sb(2.6) + k*0.012, sb(2.6) + k*0.012 + 0.2)); if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = k === 57 ? SK.red : SK.ink; ctx.beginPath(); ctx.arc(cx, cy, 13 + rnd(k)*4, 0, TAU); ctx.fill(); ctx.restore(); }
    const kx = 112 + 7*95, ky = 1000 + 5*72; stroke(ring(kx, ky, 34, 5), eio(seg(T, sb(6), sb(6.4))), 9);
    handWrite(['die eine.'], 96, 600, 1800, 0, SK.red, sb(6.4), 0.4, 'left', -0.05);
  }
  return true;
}; }

function lofiSk(end){ return add => {
  const BEAT = SB, BAR = 4*SB, swing = BEAT*0.09, late = 0.018;
  const CH = [[220, 261.63, 329.63, 392], [174.61, 220, 261.63, 329.63], [146.83, 174.61, 220, 261.63], [164.81, 196, 246.94, 293.66]], ROOT = [55, 43.65, 73.42, 41.2];
  const snare = (d, w) => { noise(d, w, 'bandpass', 1900, 0.7, 0.36, 0.2); tone(d, w, 'triangle', 190, 0.24, 0.09); };
  for (let bar = 0; bar*BAR <= end; bar++){
    const t0 = bar*BAR, c = CH[bar % 4], drums = bar >= 1 && t0 < end - 0.1, lp = bar === 0 ? 600 : 1400;
    c.forEach(f => add(t0, (d,w) => tone(d, w, 'triangle', f, 0.05, BAR*0.95, 0.03, lp)));
    if (bar >= 1){ add(t0, (d,w) => tone(d, w, 'triangle', ROOT[bar % 4], 0.45, 0.9, 0.01, 280)); add(t0 + 2.25*BEAT, (d,w) => tone(d, w, 'triangle', ROOT[bar % 4], 0.32, 0.5, 0.01, 280)); }
    if (drums){ [0, 1.75, 2.25].forEach(x => add(t0 + x*BEAT, (d,w) => kick(d, w, x ? 0.7 : 0.95))); [1, 3].forEach(x => add(t0 + x*BEAT + late, snare));
      for (let e = 0; e < 8; e++) add(t0 + e*BEAT/2 + (e % 2 ? swing : 0), (d,w) => noise(d, w, 'highpass', 8500, 0.7, e % 2 ? 0.06 : 0.1, 0.04)); }
  }
  add(end, (d,w) => kick(d, w, 1.1)); add(end, (d,w) => crash(d, w));
  for (let i = 0; i < 140; i++){ const tt = rnd(i*5.3)*end; add(tt, (d,w) => noise(d, w, 'highpass', 2500 + rnd(i)*3000, 0.5, 0.02 + rnd(i*2.1)*0.05, 0.008)); }
}; }

const VARIANTS = [
  { slug:'sichtbar',    name:'Selbst dran', dur:Math.round(sb(29.5)*10)/10, end:sb(26), draw:vSicht,   sound:lofiSk(sb(26)), hits:[] },
  { slug:'salli',       name:'Salli',       dur:Math.round(sb(23.5)*10)/10, end:sb(20), draw:vSalli,   sound:lofiSk(sb(20)), hits:[] },
  { slug:'monsteridee', name:'Monsteridee', dur:Math.round(sb(25.5)*10)/10, end:sb(22), draw:vMonster, sound:lofiSk(sb(22)), hits:[] },
  { slug:'die-idee',    name:'Die Idee.',   dur:Math.round(sb(25.5)*10)/10, end:sb(22), draw:vDieIdee, sound:lofiSk(sb(22)), hits:[] },
  { slug:'idee-direction-system', name:'Idee → System', dur:Math.round(sb(19.5)*10)/10, end:sb(16), draw:vTriad, sound:lofiSk(sb(16)), hits:[] },
  ...STMTS.map((st, k) => ({ slug:st.slug, name:st.name, dur:Math.round(sb(13.5)*10)/10, end:sb(10), draw:vStmt(st, k + 1), sound:lofiSk(sb(10)), hits:[] })),
];
