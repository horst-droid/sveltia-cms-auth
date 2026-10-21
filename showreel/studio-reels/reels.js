const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const M = {};
const ok = el => el && (el.tagName === 'VIDEO' ? el.videoWidth > 0 && el.readyState >= 1 : el.complete && el.naturalWidth > 0);
function loadImg(key, src){ return new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; M[key] = i; }); }
function loadVid(key, src){ return new Promise(res => { const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.loop = true; v.preload = 'auto';
  v.addEventListener('loadeddata', () => res(), { once:true }); v.addEventListener('error', () => res(), { once:true }); v.src = src; M[key] = v; }); }
const WORKS = [
  { k:'ff',     client:'Fisherman’s Friend', cat:'Packaging' },
  { k:'evo',    client:'EVOMOTIV',           cat:'Markenzeichen' },
  { k:'gh',     client:'green hornets',      cat:'Logoentwicklung' },
  { k:'jm',     client:'Jacob Messtechnik',  cat:'Markenauftritt' },
  { k:'s2',     client:'Likörmanufaktur',    cat:'Packaging' },
  { k:'wt',     client:'Wetterauer',         cat:'Geschäftsausstattung' },
  { k:'ganter', client:'Ganter Brauerei',    cat:'Kampagne' },
];
const mediaP = Promise.race([Promise.all([loadImg('logo', svgURL(SVG_LOGO_W.replace(/#201C25/gi, '#F8F7F8').replace(/#FFFFFF/gi, '#201C25'))), loadImg('logoW', svgURL(SVG_LOGO_W)), loadVid('v', 'media/horst-monster.mp4'), ...WORKS.map(w => loadImg(w.k, `media/${w.k}.jpg`))]), new Promise(r => setTimeout(r, 12000))]).then(() => { dirty = true; });
function syncV(){
  const v = M.v; if (!v || !ok(v)) return;
  const d = v.duration || 7.13, want = T % d;
  if (playing && cur.id === 'portrait' && T < 11.6){ if (v.paused) v.play().catch(() => {}); const diff = Math.abs(v.currentTime - want); if (diff > 0.3 && diff < d - 0.3) v.currentTime = want; }
  else { if (!v.paused) v.pause(); if (Math.abs(v.currentTime - want) > 0.04) v.currentTime = want; }
}
// ---------- studio helpers: masked type reveals, drawn rules, quiet end card ----------
const MONO = s => `500 ${s}px "SF Mono", Menlo, Consolas, "Courier New", monospace`;
const HEAD = s => `800 ${s}px Inter, system-ui, sans-serif`;
const expo = p => p >= 1 ? 1 : 1 - Math.pow(2, -10*p);
const einExpo = p => p <= 0 ? 0 : Math.pow(2, 10*(p - 1));
// a line of type sliding up out of a clipping slot; tOut slides it on upward and away
function reveal(s, x, y, font, color, t0, dur = 0.9, tOut = null, align = 'left', spacing = -3){
  const pIn = expo(seg(T, t0, t0 + dur)); if (pIn <= 0) return;
  const pOut = tOut === null ? 0 : einExpo(seg(T, tOut, tOut + 0.45)); if (pOut >= 1) return;
  ctx.save(); ctx.font = font; const m = ctx.measureText(s), asc = m.actualBoundingBoxAscent || 80, desc = m.actualBoundingBoxDescent || 20;
  ctx.beginPath(); ctx.rect(0, y - asc - 12, W, asc + desc + 24); ctx.clip();
  const dy = (1 - pIn)*(asc + desc + 30) - pOut*(asc + desc + 40);
  ctx.fillStyle = color; ctx.textAlign = align; ls(ctx, spacing); ctx.fillText(s, x, y + dy); ctx.restore();
}
function rule(x1, y, x2, t0, dur = 0.8, color = C.dark, wdt = 2, tOut = null){
  const p = expo(seg(T, t0, t0 + dur)); if (p <= 0) return; const q = tOut === null ? 0 : expo(seg(T, tOut, tOut + 0.5));
  ctx.fillStyle = color; ctx.fillRect(x1 + (x2 - x1)*q, y, (x2 - x1)*(p - q), wdt);
}
function mono(s, x, y, size, color, t0, align = 'left', spacing = 3){ const a = seg(T, t0, t0 + 0.3); if (a <= 0) return; ctx.save(); ls(ctx, spacing); text(s, x, y, MONO(size), color, align, a, spacing); ctx.restore(); }
function grain(a = 0.05){ ctx.fillStyle = `rgba(32,28,37,${a})`; const f = Math.floor(T*12); for (let k = 0; k < 420; k++) ctx.fillRect(rnd(k + f*5)*W, rnd(k*3 + f)*H, 2, 2); }
// quiet end card: dark, the wordmark in white, address in mono
function endQuiet(t0){
  const wipe = expo(seg(T, t0, t0 + 0.9)); ctx.fillStyle = C.dark; ctx.fillRect(0, H*(1 - wipe), W, H*wipe); if (wipe < 1) return;
  const lg = M.logoW; if (ok(lg)){ const lw = 620, lh = lw*lg.naturalHeight/lg.naturalWidth, a = expo(seg(T, t0 + 0.7, t0 + 1.4)); ctx.save(); ctx.globalAlpha = a; ctx.drawImage(lg, 540 - lw/2, 830 - lh/2 + (1 - a)*20, lw, lh); ctx.restore(); }
  rule(62, 1100, 1018, t0 + 1.0, 0.8, 'rgba(248,247,248,.35)', 1);
  mono('MONSTERIDEEN FÜR MUTIGE MARKEN', 62, 1160, 24, '#A6A3AD', t0 + 1.3, 'left', 5); mono('KIRCHZARTEN', 1018, 1160, 24, '#A6A3AD', t0 + 1.3, 'right', 5);
  reveal('studio-horst.de', 62, 1300, HEAD(56), C.light, t0 + 1.5, 0.8, null, 'left', -2);
  mono('SALLI@STUDIO-HORST.DE', 62, 1370, 24, '#A6A3AD', t0 + 1.8, 'left', 4);
}
// baseline grid: 12 columns and faint horizontal lines, the design-studio backdrop
function grid(a, cols = 12, t0 = 0, stagger = 0.04){ ctx.save(); const cw = (W - 124)/cols; for (let i = 0; i <= cols; i++){ const p = expo(seg(T, t0 + i*stagger, t0 + i*stagger + 0.7)); if (p <= 0) continue; ctx.fillStyle = `rgba(32,28,37,${a})`; ctx.fillRect(62 + i*cw, 0, 1, H*p); } ctx.restore(); }

// =====================================================================
// REEL 1 · HALTUNG · kinetic typography, three questions, one answer
// =====================================================================
function reel1(){
  if (T >= 13.0){ endQuiet(13.0); return; }
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  grid(0.07, 12, 0.1);
  mono('01 — HALTUNG', 62, 300, 24, C.dark, 0.3, 'left', 5); mono('STUDIO HORST, KIRCHZARTEN', 1018, 300, 24, '#6F717A', 0.5, 'right', 5);
  rule(62, 330, 1018, 0.4, 0.9, C.dark, 2);
  const f = HEAD(112);
  reveal('Wo steht', 62, 760, f, C.dark, 0.9, 0.9, 3.5); reveal('deine Marke', 62, 880, f, C.dark, 1.02, 0.9, 3.56); reveal('heute?', 62, 1000, f, C.dark, 1.14, 0.9, 3.62);
  reveal('Wo soll', 62, 760, f, C.dark, 4.1, 0.9, 6.5); reveal('sie hin?', 62, 880, f, C.dark, 4.22, 0.9, 6.56);
  reveal('Und was fehlt', 62, 760, f, C.dark, 7.0, 0.9, 9.3); reveal('dazwischen?', 62, 880, f, C.dark, 7.12, 0.9, 9.36);
  reveal('Eine Idee,', 62, 760, f, C.dark, 9.9, 0.9); reveal('die trägt.', 62, 880, f, C.red, 10.02, 0.9);
  mono('WIR NENNEN SIE', 62, 1130, 24, '#6F717A', 11.0, 'left', 5);
  reveal('MONSTERIDEE.', 62, 1290, DISP(fitDisp('MONSTERIDEE.', 956, 150)), C.red, 11.2, 1.0, null, 'left', 0);
  rule(62, 1560, 1018, 1.6, 0.9, C.dark, 1); mono('SEIT 2004', 62, 1620, 24, '#6F717A', 2.0, 'left', 5); mono('DESIGN- UND KREATIVSTUDIO', 1018, 1620, 24, '#6F717A', 2.0, 'right', 5);
  grain(0.04);
}
// studio sound: a low pulse, soft ticks on every reveal, one piano note at the answer
function tick(d, w, g = 0.12){ noise(d, w, 'highpass', 5000, 0.8, g, 0.03); }
function pulse(add, t0, t1, b = 0.75){ for (let t = t0; t < t1; t += b) add(t, (d,w) => tone(d, w, 'sine', 55, 0.12, 0.5, 0.02)); }
function audio1(add){
  pulse(add, 0, 12.8);
  [0.9, 1.02, 1.14, 4.1, 4.22, 7.0, 7.12, 9.9, 10.02].forEach(t => add(t, (d,w) => tick(d, w)));
  [3.5, 6.5, 9.3].forEach(t => add(t, (d,w) => noise(d, w, 'lowpass', 1200, 0.5, 0.1, 0.25)));
  add(10.02, (d,w) => [130.8, 196, 246.9, 329.6].forEach(f => tone(d, w, 'triangle', f, 0.06, 2.6, 0.02, 2500)));
  add(11.2, (d,w) => { kick(d, w, 0.8); [110, 164.8, 220].forEach(f => tone(d, w, 'triangle', f, 0.07, 2.4, 0.02, 2000)); });
  add(13.0, (d,w) => { kick(d, w, 0.7); tone(d, w, 'sine', 55, 0.18, 2.0, 0.02); });
}

// =====================================================================
// REEL 2 · ARBEITEN · editorial case gallery, masked reveals on a strict beat
// =====================================================================
const W_T0 = 1.6, W_D = 1.65, W_END = W_T0 + WORKS.length*W_D; // 13.15
function reel2(){
  if (T >= W_END){ endQuiet(W_END); return; }
  ctx.fillStyle = C.dark; ctx.fillRect(0, 0, W, H);
  mono('02 — ARBEITEN', 62, 300, 24, C.light, 0.2, 'left', 5);
  rule(62, 330, 1018, 0.3, 0.9, 'rgba(248,247,248,.4)', 1);
  if (T < W_T0){ reveal('Ausgewählte', 62, 760, HEAD(104), C.light, 0.5, 0.9, W_T0 - 0.4); reveal('Arbeiten', 62, 880, HEAD(104), C.light, 0.62, 0.9, W_T0 - 0.34); mono('2004 — 2026', 62, 980, 28, '#A6A3AD', 1.0, 'left', 6); return; }
  const i = Math.min(WORKS.length - 1, Math.floor((T - W_T0)/W_D)), lt = T - W_T0 - i*W_D, w = WORKS[i], im = M[w.k];
  const fx = 90, fy = 470, fw = 900, fh = 900;
  // previous image stays, the new one wipes over it (alternating left/right), scaling from 1.08 to 1
  const drawWork = (img, p, dir) => { if (!ok(img)) return; ctx.save(); ctx.beginPath(); if (dir > 0) ctx.rect(fx, fy, fw*p, fh); else ctx.rect(fx + fw*(1 - p), fy, fw*p, fh); ctx.clip(); const s = lerp(1.08, 1, p), dw = fw*s, dh = fh*s; ctx.drawImage(img, fx + fw/2 - dw/2, fy + fh/2 - dh/2, dw, dh); ctx.restore(); };
  if (i > 0) drawWork(M[WORKS[i - 1].k], 1, 1);
  const p = expo(seg(lt, 0, 1.0)); drawWork(im, p, i % 2 ? -1 : 1);
  // wipe edge
  if (p > 0 && p < 1){ ctx.fillStyle = C.red; const ex = i % 2 ? fx + fw*(1 - p) : fx + fw*p; ctx.fillRect(ex - 2, fy, 4, fh); }
  // caption slot
  const ca = expo(seg(lt, 0.25, 0.9)), co = einExpo(seg(lt, W_D - 0.3, W_D - 0.05));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 1440, W, 220); ctx.clip(); const dy = (1 - ca)*60 - co*70;
  text(w.client, 90, 1530 + dy, HEAD(54), C.light, 'left', 1, -2); ctx.save(); ls(ctx, 5); text(w.cat.toUpperCase(), 90, 1590 + dy, MONO(24), '#A6A3AD', 'left', 1, 5); ctx.restore(); ctx.restore();
  ctx.save(); ls(ctx, 4); text(`${String(i + 1).padStart(2, '0')} / ${String(WORKS.length).padStart(2, '0')}`, 990, 1530, MONO(28), '#A6A3AD', 'right', 1, 4); ctx.restore();
  // progress ticks for the set
  WORKS.forEach((_, k) => { ctx.fillStyle = k <= i ? C.red : 'rgba(248,247,248,.25)'; ctx.fillRect(90 + k*(900/WORKS.length), 1700, 900/WORKS.length - 8, 3); });
}
function audio2(add){
  pulse(add, 0, W_END, 0.55);
  add(0.5, (d,w) => tick(d, w)); add(0.62, (d,w) => tick(d, w));
  for (let i = 0; i < WORKS.length; i++){ const t = W_T0 + i*W_D; add(t, (d,w) => { kick(d, w, 0.55); noise(d, w, 'bandpass', 900, 0.8, 0.14, 0.22); }); add(t + 0.25, (d,w) => tick(d, w, 0.08)); }
  add(W_T0, (d,w) => [110, 164.8, 220, 261.6].forEach(f => tone(d, w, 'triangle', f, 0.05, 3.5, 0.5, 1800)));
  add(W_T0 + 4*W_D, (d,w) => [98, 146.8, 196, 246.9].forEach(f => tone(d, w, 'triangle', f, 0.05, 3.5, 0.5, 1800)));
  add(W_END, (d,w) => { kick(d, w, 0.7); tone(d, w, 'sine', 55, 0.18, 2.0, 0.02); });
}

// =====================================================================
// REEL 3 · SYSTEM · a blueprint drawing itself: three steps, one result
// =====================================================================
const NODES = [{ x:260, y:1150, l:'VERSTEHEN', t:2.4 }, { x:540, y:640, l:'EINORDNEN', t:4.4 }, { x:820, y:1150, l:'ZUSPITZEN', t:6.4 }];
function dline(a, b, t0, dur, col = C.dark, wdt = 2){ const p = expo(seg(T, t0, t0 + dur)); if (p <= 0) return; ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + (b.x - a.x)*p, a.y + (b.y - a.y)*p); ctx.stroke(); }
function dim(x1, x2, y, label, t0){ const p = expo(seg(T, t0, t0 + 0.6)); if (p <= 0) return; ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = '#6F717A'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 + (x2 - x1)*p, y); ctx.moveTo(x1, y - 10); ctx.lineTo(x1, y + 10); ctx.moveTo(x2, y - 10); ctx.lineTo(x2, y + 10); ctx.stroke(); ctx.restore(); mono(label, (x1 + x2)/2, y - 14, 20, '#6F717A', t0 + 0.2, 'center', 2); }
function reel3(){
  if (T >= 12.6){ endQuiet(12.6); return; }
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  grid(0.08, 12, 0.1, 0.03);
  mono('03 — SYSTEM', 62, 300, 24, C.dark, 0.3, 'left', 5); mono('FIG. 1', 1018, 300, 24, '#6F717A', 0.5, 'right', 5);
  rule(62, 330, 1018, 0.4, 0.9, C.dark, 2);
  // construction circle through the three nodes
  const cx = 540, cy = 930, r = 330, pc = expo(seg(T, 0.8, 2.0));
  ctx.strokeStyle = 'rgba(32,28,37,.35)'; ctx.lineWidth = 1; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + TAU*pc); ctx.stroke(); ctx.setLineDash([]);
  if (pc > 0.3){ const q = seg(pc, 0.3, 1); ctx.beginPath(); ctx.moveTo(cx - r*q, cy); ctx.lineTo(cx + r*q, cy); ctx.moveTo(cx, cy - r*q); ctx.lineTo(cx, cy + r*q); ctx.stroke(); }
  dim(cx - r, cx + r, cy + r + 60, 'Ø 660', 2.0);
  // nodes appear in sequence, edges draw between them
  NODES.forEach((n, i) => { const p = expo(seg(T, n.t, n.t + 0.5)); if (p <= 0) return;
    ctx.fillStyle = C.light; ctx.strokeStyle = C.dark; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(n.x, n.y, 22*p, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = C.dark; ctx.beginPath(); ctx.arc(n.x, n.y, 7*p, 0, TAU); ctx.fill();
    const lx = i === 1 ? n.x : (i === 0 ? n.x - 40 : n.x + 40), ly = i === 1 ? n.y - 60 : n.y + 90, al = i === 1 ? 'center' : (i === 0 ? 'left' : 'right');
    mono(`0${i + 1}`, i === 0 ? n.x - 40 : i === 1 ? n.x : n.x + 40, ly - 36, 20, C.red, n.t + 0.3, al, 3); mono(n.l, lx, ly, 26, C.dark, n.t + 0.4, al, 5); });
  dline(NODES[0], NODES[1], 3.3, 0.9); dline(NODES[1], NODES[2], 5.3, 0.9); dline(NODES[2], NODES[0], 7.3, 0.9);
  // the result fills the centre in red
  const pr = expo(seg(T, 8.5, 9.4)); if (pr > 0){ ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(cx, cy, 120*pr, 0, TAU); ctx.fill(); }
  reveal('MONSTERIDEE.', 540, 1460, DISP(fitDisp('MONSTERIDEE.', 900, 120)), C.red, 9.2, 0.9, null, 'center', 0);
  reveal('Drei Schritte. Ein Ergebnis.', 540, 1560, F(600, 40), '#6F717A', 10.2, 0.8, null, 'center', -1);
  rule(62, 1660, 1018, 1.6, 0.9, C.dark, 1);
  grain(0.03);
}
function audio3(add){
  pulse(add, 0, 12.4, 0.8);
  add(0.8, (d,w) => noise(d, w, 'bandpass', 3000, 0.5, 0.05, 1.2));
  NODES.forEach(n => { add(n.t, (d,w) => { tick(d, w, 0.16); tone(d, w, 'sine', 880, 0.05, 0.3, 0.004); }); add(n.t + 0.9, (d,w) => noise(d, w, 'bandpass', 2500, 0.5, 0.05, 0.9)); });
  add(8.5, (d,w) => { kick(d, w, 0.8); [130.8, 196, 261.6, 329.6].forEach(f => tone(d, w, 'triangle', f, 0.06, 2.8, 0.05, 2200)); });
  add(9.2, (d,w) => tick(d, w, 0.14));
  add(12.6, (d,w) => { kick(d, w, 0.7); tone(d, w, 'sine', 55, 0.18, 2.0, 0.02); });
}

// =====================================================================
// REEL 4 · ZEICHEN · the signet constructed like a guideline page, then inverted
// =====================================================================
const HP = SIG.hp.map(([x, y]) => [x, y]);
function subpath(c, pts, close, p){ // draws a polyline up to fraction p of its length
  let L = 0; const segs = []; const P = close ? [...pts, pts[0]] : pts; for (let i = 1; i < P.length; i++){ const l = Math.hypot(P[i][0] - P[i-1][0], P[i][1] - P[i-1][1]); segs.push(l); L += l; }
  let left = L*p; c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++){ const l = segs[i-1]; if (left >= l){ c.lineTo(P[i][0], P[i][1]); left -= l; } else { const q = left/l; c.lineTo(P[i-1][0] + (P[i][0] - P[i-1][0])*q, P[i-1][1] + (P[i][1] - P[i-1][1])*q); break; } } c.stroke();
}
function signetStroke(cx, cy, size, p1, p2, p3, col, wdt){ const s = size/SIG.w, { w, h, b } = SIG; ctx.save(); ctx.translate(cx - size/2, cy - SIG.h*s/2); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = wdt/s; ctx.lineJoin = 'miter';
  if (p1 > 0) subpath(ctx, [[0, 0], [w, 0], [w, h], [0, h]], true, p1); if (p2 > 0) subpath(ctx, [[b, b], [w - b, b], [w - b, h - b], [b, h - b]], true, p2); if (p3 > 0) subpath(ctx, HP, true, p3); ctx.restore(); }
function reel4(){
  if (T >= 12.8){ endQuiet(12.8); return; }
  const inv = expo(seg(T, 9.2, 10.0)); // invert wipe: dark circle grows from the centre
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  grid(0.08, 12, 0.1, 0.03);
  if (inv > 0){ ctx.fillStyle = C.dark; ctx.beginPath(); ctx.arc(540, 900, 1400*inv, 0, TAU); ctx.fill(); }
  const fg = inv > 0.5 ? C.light : C.dark, mu = inv > 0.5 ? '#A6A3AD' : '#6F717A';
  mono('04 — ZEICHEN', 62, 300, 24, fg, 0.3, 'left', 5); mono('KONSTRUKTION', 1018, 300, 24, mu, 0.5, 'right', 5);
  rule(62, 330, 1018, 0.4, 0.9, inv > 0.5 ? 'rgba(248,247,248,.4)' : C.dark, inv > 0.5 ? 1 : 2);
  // phase A: construction + stroke drawing at the centre, size 640
  const move = expo(seg(T, 6.0, 7.0)), size = lerp(640, 260, move), cx = 540, cy = lerp(900, 700, move);
  if (T < 6.0){ const pa = expo(seg(T, 0.6, 1.6)); ctx.save(); ctx.globalAlpha = pa*(1 - seg(T, 5.4, 6.0)); ctx.strokeStyle = 'rgba(32,28,37,.35)'; ctx.lineWidth = 1; ctx.setLineDash([6, 8]);
    ctx.beginPath(); ctx.arc(cx, cy, 460*pa, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(cx - 520*pa, cy); ctx.lineTo(cx + 520*pa, cy); ctx.moveTo(cx, cy - 520*pa); ctx.lineTo(cx, cy + 520*pa); ctx.stroke(); ctx.restore();
    if (T < 5.6){ dim(cx - 320, cx + 320, cy - 400, '184,7', 1.4); dim(cx - 320, cx - 320 + 640*SIG.b/SIG.w, cy + 400, 'b = 15,7', 2.2); } }
  const fillA = expo(seg(T, 4.4, 5.2));
  if (fillA > 0){ ctx.save(); ctx.globalAlpha = fillA; drawSignet(ctx, cx, cy, size, inv > 0.5 ? C.light : C.red); ctx.restore(); }
  if (fillA < 1) signetStroke(cx, cy, size, expo(seg(T, 1.8, 2.9)), expo(seg(T, 2.5, 3.5)), expo(seg(T, 3.2, 4.6)), C.dark, 3);
  // phase B: wordmark + descriptor
  const lg = inv > 0.5 ? M.logoW : M.logo; if (ok(lg) && T >= 6.6){ const lw = 700, lh = lw*lg.naturalHeight/lg.naturalWidth, p = expo(seg(T, 6.6, 7.6)); ctx.save(); ctx.beginPath(); ctx.rect(540 - lw/2, 980 - lh/2, lw*p, lh); ctx.clip(); ctx.drawImage(lg, 540 - lw/2, 980 - lh/2, lw, lh); ctx.restore(); }
  rule(340, 1230, 740, 8.2, 0.7, inv > 0.5 ? 'rgba(248,247,248,.4)' : C.dark, 1);
  reveal('Ein Zeichen. Seit 2004.', 540, 1380, F(600, 44), fg, 10.6, 0.8, null, 'center', -1);
  reveal('Kirchzarten im Schwarzwald.', 540, 1440, F(600, 44), mu, 10.8, 0.8, null, 'center', -1);
  grain(0.03);
}
function audio4(add){
  pulse(add, 0, 12.6, 0.8);
  add(0.6, (d,w) => noise(d, w, 'bandpass', 3000, 0.5, 0.05, 1.0));
  [1.8, 2.5, 3.2].forEach(t => add(t, (d,w) => { tick(d, w, 0.12); noise(d, w, 'bandpass', 2200, 0.6, 0.04, 1.1); }));
  add(4.4, (d,w) => [110, 164.8, 220, 277.2].forEach(f => tone(d, w, 'triangle', f, 0.06, 2.6, 0.3, 2200)));
  add(6.0, (d,w) => noise(d, w, 'lowpass', 1500, 0.5, 0.08, 0.6)); add(6.6, (d,w) => tick(d, w, 0.14));
  add(9.2, (d,w) => { kick(d, w, 0.9); riser(d, w, 0.8, 0.12); [98, 146.8, 196, 246.9].forEach(f => tone(d, w, 'triangle', f, 0.06, 3.0, 0.05, 2000)); });
  add(10.6, (d,w) => tick(d, w)); add(12.8, (d,w) => { kick(d, w, 0.7); tone(d, w, 'sine', 55, 0.18, 2.0, 0.02); });
}

// =====================================================================
// REEL 5 · PORTRAIT · HORST in an editorial frame, slow push-in, two lines
// =====================================================================
function reel5(){
  if (T >= 11.6){ endQuiet(11.6); return; }
  ctx.fillStyle = C.dark; ctx.fillRect(0, 0, W, H);
  mono('05 — PORTRAIT', 62, 300, 24, C.light, 0.2, 'left', 5); mono('FIG. 01', 1018, 300, 24, '#A6A3AD', 0.4, 'right', 5);
  rule(62, 330, 1018, 0.3, 0.9, 'rgba(248,247,248,.4)', 1);
  const fw = 760, fh = 950, fx = 540 - fw/2, fy = 440, open = expo(seg(T, 0.6, 1.8)), z = lerp(1.0, 1.08, seg(T, 0.6, 11.6));
  const v = M.v; if (ok(v)){ ctx.save(); ctx.beginPath(); ctx.rect(fx, fy + fh*(1 - open), fw, fh*open); ctx.clip(); const s = Math.max(fw/1500, fh/844)*z, dw = 1500*s, dh = 844*s; ctx.filter = 'grayscale(1) contrast(1.08)'; ctx.drawImage(v, fx + fw/2 - dw/2 - 110*s, fy + fh/2 - dh/2, dw, dh); ctx.filter = 'none'; ctx.restore(); }
  // double frame
  ctx.strokeStyle = 'rgba(248,247,248,.55)'; ctx.lineWidth = 1; ctx.strokeRect(fx - 14, fy - 14, fw + 28, fh + 28); ctx.strokeStyle = C.light; ctx.lineWidth = 2; ctx.strokeRect(fx, fy, fw, fh);
  // red accent: a single square at the frame corner
  const ra = expo(seg(T, 1.6, 2.0)); ctx.fillStyle = C.red; ctx.fillRect(fx + fw - 28*ra, fy - 14, 28*ra, 28*ra);
  reveal('HORST', 160, 1500, HEAD(56), C.light, 2.0, 0.8, null, 'left', -2);
  mono('STUDIOMASKOTTCHEN — KIRCHZARTEN', 160, 1556, 22, '#A6A3AD', 2.4, 'left', 5);
  reveal('Ernsthaft gut.', 160, 1700, HEAD(76), C.light, 7.4, 0.9, null, 'left', -3);
  reveal('Nicht ernst.', 160, 1790, HEAD(76), C.red, 7.6, 0.9, null, 'left', -3);
}
function audio5(add){
  pulse(add, 0, 11.4, 0.75);
  add(0.6, (d,w) => noise(d, w, 'bandpass', 1800, 0.4, 0.04, 1.4));
  add(0.6, (d,w) => [82.4, 123.5, 164.8, 207.7].forEach(f => tone(d, w, 'triangle', f, 0.05, 6.0, 1.0, 1600)));
  [2.0, 2.4, 7.4, 7.6].forEach(t => add(t, (d,w) => tick(d, w)));
  add(7.6, (d,w) => [110, 164.8, 220, 261.6].forEach(f => tone(d, w, 'triangle', f, 0.06, 3.0, 0.05, 2000)));
  add(11.6, (d,w) => { kick(d, w, 0.7); tone(d, w, 'sine', 55, 0.18, 2.0, 0.02); });
}

// ---------- the set ----------
const REELS = [
  { id:'haltung',  name:'Haltung',  tech:'Kinetische Typo', dur:15, render:reel1, audio:audio1, hud:'01', hudColor:() => C.dark,  file:'horst-studio-haltung',  still:4.6,
    desc:'Drei Fragen, eine Antwort. Zeilen schieben sich aus <b>Masken-Schlitzen</b> nach oben, Linien zeichnen sich auf dem 12-Spalten-Raster, Expo-Easing, kein Schnickschnack. „Wo steht deine Marke heute? Wo soll sie hin? Und was fehlt dazwischen? Eine Idee, die trägt.“ Wir nennen sie Monsteridee.' },
  { id:'arbeiten', name:'Arbeiten', tech:'Editorial-Galerie', dur:15, render:reel2, audio:audio2, hud:'02', hudColor:() => C.light, file:'horst-studio-arbeiten', still:6.0,
    desc:'Sieben echte Projekte von studio-horst.de im strengen Takt: jedes Bild <b>wischt seitlich</b> über das vorherige, skaliert von 1,08 auf 1, rote Wischkante, Kunde und Kategorie in Mono-Beschriftung, Zähler 01/07. Dunkel, ruhig, mit tiefem Puls.' },
  { id:'system',   name:'System',   tech:'Blueprint',        dur:15, render:reel3, audio:audio3, hud:'03', hudColor:() => C.dark,  file:'horst-studio-system',   still:7.6,
    desc:'Ein Schaubild zeichnet sich selbst: Konstruktionskreis, Maßlinie, drei Knoten <b>Verstehen, Einordnen, Zuspitzen</b>, verbunden mit gezogenen Linien. Im Zentrum füllt sich der rote Punkt: Monsteridee. „Drei Schritte. Ein Ergebnis.“' },
  { id:'zeichen',  name:'Zeichen',  tech:'Logo-Konstruktion', dur:15, render:reel4, audio:audio4, hud:'04', hudColor:() => T >= 9.6 ? C.light : C.dark, file:'horst-studio-zeichen', still:4.0,
    desc:'Wie eine Seite aus dem Brand Guide: Hilfskreis, Achsen, Maße (184,7 / b = 15,7), das <b>Signet zeichnet sich als Linie</b>, füllt sich rot, rückt nach oben, die Wortmarke „horst.“ wischt auf. Dann kippt die Seite ins Negativ.' },
  { id:'portrait', name:'Portrait', tech:'Editorial-Frame',  dur:15, render:reel5, audio:audio5, hud:'05', hudColor:() => C.light, file:'horst-studio-portrait', still:8.4,
    desc:'HORST ernst genommen: das Video in Schwarzweiß in einem 4:5-Rahmen mit Doppellinie, langsamer Push-in, Bildunterschrift wie im Magazin. Dann zwei Zeilen: „Ernsthaft gut. <b>Nicht ernst.</b>“' },
];
