const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const M = {};
const ok = el => el && el.complete && el.naturalWidth > 0;
function loadImg(key, src){ return new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; M[key] = i; }); }
const mediaP = Promise.race([Promise.all([loadImg('logo', svgURL(SVG_LOGO_W.replace(/#201C25/gi, '#F8F7F8').replace(/#FFFFFF/gi, '#201C25'))), loadImg('logoW', svgURL(SVG_LOGO_W)), loadImg('still', 'media/horst-still.jpg')]), new Promise(r => setTimeout(r, 8000))]).then(() => { dirty = true; });
function syncV(){}
// HORST's head, cut out of the still with a soft ellipse (video coords: center 640,250, radii 250×270)
const head = document.createElement('canvas'); head.width = 520; head.height = 560; let headReady = false;
function buildHead(){
  if (headReady || !ok(M.still)) return; const c = head.getContext('2d');
  const g = c.createRadialGradient(260, 270, 165, 260, 270, 225); g.addColorStop(0, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.save(); c.scale(1, 560/520); c.fillStyle = g; c.beginPath(); c.arc(260, 250, 225, 0, TAU); c.fill(); c.restore();
  c.globalCompositeOperation = 'source-in'; c.drawImage(M.still, 380, -30, 520, 560, 0, 0, 520, 560); headReady = true;
}
function drawHead(cx, cy, w, rot = 0, alpha = 1){ buildHead(); if (!headReady) return; const h = w*560/520; ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.drawImage(head, -w/2, -h/2, w, h); ctx.restore(); }
// ---------- studio helpers (from the Studio set) ----------
const MONO = s => `500 ${s}px "SF Mono", Menlo, Consolas, "Courier New", monospace`;
const HEAD = s => `800 ${s}px Inter, system-ui, sans-serif`;
const expo = p => p >= 1 ? 1 : 1 - Math.pow(2, -10*p);
const einExpo = p => p <= 0 ? 0 : Math.pow(2, 10*(p - 1));
function reveal(s, x, y, font, color, t0, dur = 0.9, tOut = null, align = 'left', spacing = -3){
  const pIn = expo(seg(T, t0, t0 + dur)); if (pIn <= 0) return;
  const pOut = tOut === null ? 0 : einExpo(seg(T, tOut, tOut + 0.45)); if (pOut >= 1) return;
  ctx.save(); ctx.font = font; const m = ctx.measureText(s), asc = m.actualBoundingBoxAscent || 80, desc = m.actualBoundingBoxDescent || 20;
  ctx.beginPath(); ctx.rect(0, y - asc - 12, W, asc + desc + 24); ctx.clip();
  const dy = (1 - pIn)*(asc + desc + 30) - pOut*(asc + desc + 40);
  ctx.fillStyle = color; ctx.textAlign = align; ls(ctx, spacing); ctx.fillText(s, x, y + dy); ctx.restore();
}
function rule(x1, y, x2, t0, dur = 0.8, color = C.dark, wdt = 2){ const p = expo(seg(T, t0, t0 + dur)); if (p <= 0) return; ctx.fillStyle = color; ctx.fillRect(x1, y, (x2 - x1)*p, wdt); }
function mono(s, x, y, size, color, t0, align = 'left', spacing = 3){ const a = seg(T, t0, t0 + 0.3); if (a <= 0) return; ctx.save(); ls(ctx, spacing); text(s, x, y, MONO(size), color, align, a, spacing); ctx.restore(); }
function grain(a = 0.05){ ctx.fillStyle = `rgba(32,28,37,${a})`; const f = Math.floor(T*12); for (let k = 0; k < 420; k++) ctx.fillRect(rnd(k + f*5)*W, rnd(k*3 + f)*H, 2, 2); }
function endQuiet(t0, claim = true){
  const wipe = expo(seg(T, t0, t0 + 0.9)); ctx.fillStyle = C.dark; ctx.fillRect(0, H*(1 - wipe), W, H*wipe); if (wipe < 1) return;
  const lg = M.logoW; if (ok(lg)){ const lw = 620, lh = lw*lg.naturalHeight/lg.naturalWidth, a = expo(seg(T, t0 + 0.7, t0 + 1.4)); ctx.save(); ctx.globalAlpha = a; ctx.drawImage(lg, 540 - lw/2, 830 - lh/2 + (1 - a)*20, lw, lh); ctx.restore(); }
  rule(62, 1100, 1018, t0 + 1.0, 0.8, 'rgba(248,247,248,.35)', 1);
  mono(claim ? 'MONSTER-CHECK' : 'STUDIO HORST', 62, 1160, 24, '#A6A3AD', t0 + 1.3, 'left', 5); mono('KIRCHZARTEN', 1018, 1160, 24, '#A6A3AD', t0 + 1.3, 'right', 5);
  reveal('THE IDEA IS THE KEY.', 62, 1310, DISP(fitDisp('THE IDEA IS THE KEY.', 940, 80)), C.light, t0 + 1.5, 0.8, null, 'left', 0);
  reveal(cur.cta, 62, 1440, HEAD(fitHeadW(cur.cta, 940, 44)), C.red, t0 + 2.2, 0.8, null, 'left', -1);
  mono('STUDIO-HORST.DE', 62, 1520, 24, '#A6A3AD', t0 + 2.6, 'left', 4);
}
function grid(a, cols = 12, t0 = 0, stagger = 0.04){ ctx.save(); const cw = (W - 124)/cols; for (let i = 0; i <= cols; i++){ const p = expo(seg(T, t0 + i*stagger, t0 + i*stagger + 0.7)); if (p <= 0) continue; ctx.fillStyle = `rgba(32,28,37,${a})`; ctx.fillRect(62 + i*cw, 0, 1, H*p); } ctx.restore(); }
function tick(d, w, g = 0.12){ noise(d, w, 'highpass', 5000, 0.8, g, 0.03); }
function pulse(add, t0, t1, b = 0.75){ for (let t = t0; t < t1; t += b) add(t, (d,w) => tone(d, w, 'sine', 55, 0.12, 0.5, 0.02)); }
// the rubber stamp from the Heldentaten set
function stampSlam(x, y, rot, lines, t0, scale = 1, color = C.red){
  const p = seg(T, t0, t0 + 0.18); if (p <= 0) return; const e = eo(p), s = lerp(2.2, 1, e)*scale;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, p*6)*0.92;
  ctx.font = DISP(64); ctx.textAlign = 'center'; const tw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 70, th = lines.length*72 + 40;
  ctx.strokeStyle = color; ctx.lineWidth = 9; ctx.strokeRect(-tw/2, -th/2, tw, th); ctx.fillStyle = color; lines.forEach((l, i) => ctx.fillText(l, 0, -th/2 + 68 + i*72));
  // ink speckle
  for (let k = 0; k < 60; k++){ const sx = (rnd(k + t0*7) - .5)*tw, sy = (rnd(k*3 + t0*7) - .5)*th; ctx.globalAlpha *= 0.6; ctx.fillRect(sx, sy, 3, 3); ctx.globalAlpha /= 0.6; }
  ctx.restore();
}


function fitHeadW(s, maxW, maxS){ ctx.save(); ctx.font = HEAD(100); ls(ctx, -3); const w = ctx.measureText(s).width; ctx.restore(); return Math.min(maxS, 100*maxW/w); }
function wrapLines(s, maxW, font){ ctx.save(); ctx.font = font; const out = []; let line = ''; s.split(' ').forEach(w => { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line){ out.push(line); line = w; } else line = t; }); if (line) out.push(line); ctx.restore(); return out; }

// =====================================================================
// MONSTER-CHECK · ist deine Marke launch-ready? · animated checklist, 40 s
// =====================================================================
const CH = [
  { n:'01', t:'KLARHEIT', pts:['In 5 Sekunden klar, was du machst', 'Klar, für wen', 'Klar, warum du'] },
  { n:'02', t:'IDEE',     pts:['Es gibt eine Leitidee', 'Sie zieht sich durch Bild, Text und Ton', 'Man erkennt dich auch ohne Logo'] },
  { n:'03', t:'AUFTRITT', pts:['Texte klingen nach dir, nicht nach Vorlage', 'Echte Bilder statt Stock', 'Mobil genauso stark wie am Desktop'] },
  { n:'04', t:'HANDLUNG', pts:['Eine klare Hauptaktion', 'Kontakt in einem Klick', 'Beweise: echte Projekte, echte Stimmen'] },
];
const HOOK_END = 3.0, CH_D = 7.0, PT_T = [1.3, 3.0, 4.7], BADGE_T = HOOK_END + 4*CH_D, END_T = BADGE_T + 5.0; // 31 / 36
const chapterStart = i => HOOK_END + i*CH_D;
function checkTime(i, k){ return chapterStart(i) + PT_T[k]; }
function checksDone(){ let n = 0; CH.forEach((c, i) => c.pts.forEach((_, k) => { if (T >= checkTime(i, k)) n++; })); return n; }
function checkbox(x, y, t0){ // box, then a red check drawn in two strokes
  ctx.save(); ctx.strokeStyle = C.dark; ctx.lineWidth = 4; ctx.strokeRect(x, y - 44, 56, 56);
  const p = seg(T, t0, t0 + 0.22); if (p > 0){ ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x + 10, y - 16);
    const p1 = clamp(p/0.4, 0, 1), p2 = clamp((p - 0.4)/0.6, 0, 1); ctx.lineTo(x + 10 + 14*p1, y - 16 + 16*p1); if (p2 > 0) ctx.lineTo(x + 24 + 26*p2, y - 46*p2); ctx.stroke();
    const s = eback(p); ctx.translate(x + 28, y - 16); ctx.scale(s, s); ctx.translate(-(x + 28), -(y - 16)); }
  ctx.restore();
}
function monsterCheck(){
  if (T >= END_T){ endQuiet(END_T); return; }
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  grid(0.07, 12, 0.05, 0.03);
  // header: title left, counter right (counts up with every check)
  mono('MONSTER-CHECK', 62, 300, 24, C.red, 0.1, 'left', 5);
  const done = checksDone(), lastT = Math.max(-1, ...CH.flatMap((c, i) => c.pts.map((_, k) => checkTime(i, k))).filter(t => t <= T)), bump = lastT >= 0 ? 1 + 0.25*Math.max(0, 1 - (T - lastT)/0.3) : 1;
  ctx.save(); ctx.translate(1018, 300); ctx.scale(bump, bump); ls(ctx, 2); text(`${done} / 12`, 0, 0, MONO(32), done === 12 ? C.red : C.dark, 'right', 1, 2); ctx.restore();
  rule(62, 330, 1018, 0.2, 0.9, C.dark, 2);
  // chapter progress ticks
  CH.forEach((c, i) => { ctx.fillStyle = T >= chapterStart(i) ? C.red : 'rgba(32,28,37,.18)'; ctx.fillRect(62 + i*239, 350, 231, 4); });
  if (T < HOOK_END + 0.4){ // hook
    const out = T >= HOOK_END ? einExpo(seg(T, HOOK_END, HOOK_END + 0.4)) : 0;
    ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(0, -out*120);
    reveal('29 / 29', 540, 760, DISP(200), C.dark, 0.1, 0.6, null, 'center', 0);
    reveal('TECHNIK-PUNKTE.', 540, 900, DISP(fitDisp('TECHNIK-PUNKTE.', 940, 110)), C.dark, 0.35, 0.6, null, 'center', 0);
    reveal('0 ANFRAGEN.', 540, 1090, DISP(fitDisp('0 ANFRAGEN.', 940, 150)), C.red, 0.9, 0.6, null, 'center', 0);
    const l = wrapLines('Deine Website kann technisch perfekt sein. Und trotzdem niemanden überzeugen.', 820, F(600, 40)); l.forEach((s, k) => reveal(s, 540, 1300 + k*54, F(600, 40), '#6F717A', 1.6 + k*0.08, 0.7, null, 'center', -1));
    ctx.restore();
  }
  if (T >= HOOK_END){ // chapters
    const i = Math.min(3, Math.floor((T - HOOK_END)/CH_D)), c = CH[i], t0 = chapterStart(i), lt = T - t0;
    const out = einExpo(seg(lt, CH_D - 0.35, CH_D));
    if (out < 1){ ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(0, -out*100);
    mono(`KAPITEL ${c.n} / 04`, 62, 470, 24, '#6F717A', t0 + 0.1, 'left', 5);
    ctx.save(); ctx.font = DISP(140); const nw = ctx.measureText(c.n).width; ctx.restore();
    reveal(c.n, 62, 640, DISP(140), C.red, t0 + 0.15, 0.6, null, 'left', 0);
    reveal(c.t, 62 + nw + 44, 640, DISP(fitDisp(c.t, 956 - nw - 44, 140)), C.dark, t0 + 0.25, 0.7, null, 'left', 0);
    rule(62, 700, 1018, t0 + 0.4, 0.7, C.dark, 1);
    c.pts.forEach((p, k) => { const y = 840 + k*180, a = expo(seg(lt, 0.6 + k*0.12, 1.1 + k*0.12)); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a*(1 - out); ctx.translate((1 - a)*-40, 0); checkbox(62, y, checkTime(i, k) - t0 + t0);
      const lines = wrapLines(p, 820, F(700, 46)); lines.forEach((s, j) => text(s, 150, y - 8 + j*54, F(700, 46), T >= checkTime(i, k) ? C.dark : '#6F717A', 'left', a*(1 - out), -1)); ctx.restore(); });
    ctx.restore(); }
  }
  if (T >= BADGE_T){ // badge + closing lines
    reveal('TECHNIK MACHT DEINE SEITE SICHER.', 540, 560, DISP(fitDisp('TECHNIK MACHT DEINE SEITE SICHER.', 940, 64)), C.dark, BADGE_T + 1.2, 0.8, null, 'center', 0);
    reveal('EINE IDEE MACHT SIE STARK.', 540, 650, DISP(fitDisp('EINE IDEE MACHT SIE STARK.', 940, 64)), C.red, BADGE_T + 1.5, 0.8, null, 'center', 0);
    const p = seg(T, BADGE_T + 0.1, BADGE_T + 0.3); if (p > 0){ const e = eo(p), s = lerp(2.4, 1, e); ctx.save(); ctx.translate(540, 1000); ctx.rotate(-0.08); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, p*5)*0.95;
      ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.strokeRect(-430, -130, 860, 260); ctx.fillStyle = C.red; ctx.font = DISP(fitDisp('✓ MONSTER-READY', 780, 96)); ctx.textAlign = 'center'; ctx.fillText('✓ MONSTER-READY', 0, 36);
      for (let k = 0; k < 80; k++){ ctx.globalAlpha *= 0.7; ctx.fillRect((rnd(k) - .5)*860, (rnd(k + 9) - .5)*260, 3, 3); ctx.globalAlpha /= 0.7; } ctx.restore(); }
    mono('12 / 12 · GEPRÜFT VON HORST', 540, 1200, 24, '#6F717A', BADGE_T + 0.6, 'center', 5);
  }
  // HORST the inspector: bottom right, nods at each chapter start and at every check, grins at the badge
  const nods = [...CH.map((_, i) => chapterStart(i)), ...CH.flatMap((c, i) => c.pts.map((_, k) => checkTime(i, k))), BADGE_T].filter(t => t <= T), tn = nods.length ? Math.max(...nods) : -9;
  const nod = Math.sin(Math.min(1, (T - tn)/0.45)*Math.PI)*0.16, big = T >= BADGE_T ? eback(seg(T, BADGE_T, BADGE_T + 0.5)) : 0;
  drawHead(900 - big*360, 1620 - big*220, 260 + big*220, nod + (T >= BADGE_T ? Math.sin((T - BADGE_T)*6)*0.05*Math.exp(-(T - BADGE_T)) : 0));
  grain(0.03);
}
function audioCheck(add){
  pulse(add, 0, END_T - 0.2, 0.75);
  [0.1, 0.35].forEach(t => add(t, (d,w) => tick(d, w)));
  add(0.9, (d,w) => { kick(d, w, 1.0); tone(d, w, 'sawtooth', 55, 0.2, 1.2, 0.01, 300); });
  CH.forEach((c, i) => { const t0 = chapterStart(i); add(t0, (d,w) => { noise(d, w, 'bandpass', 1600, 0.6, 0.14, 0.25); tick(d, w, 0.14); });
    c.pts.forEach((_, k) => add(checkTime(i, k), (d,w) => { tick(d, w, 0.1); tone(d, w, 'sine', 1318.5, 0.09, 0.35, 0.003); tone(d, w + 0.06, 'sine', 1760, 0.07, 0.4, 0.003); })); });
  add(BADGE_T, (d,w) => riser(d, w, 0.25, 0.15)); add(BADGE_T + 0.25, (d,w) => { kick(d, w, 1.3); noise(d, w, 'lowpass', 900, 0.5, 0.7, 0.14); crash(d, w); });
  add(BADGE_T + 1.2, (d,w) => tick(d, w)); add(BADGE_T + 1.5, (d,w) => [130.8, 196, 261.6, 329.6].forEach(f => tone(d, w, 'triangle', f, 0.06, 2.4, 0.02, 2500)));
  add(END_T, (d,w) => { kick(d, w, 0.7); tone(d, w, 'sine', 55, 0.18, 2.0, 0.02); });
}

// ---------- the set ----------
const REELS = [
  { id:'kommentar', name:'Monster-Check', tech:'CTA: Kommentar-Funnel', dur:40, render:monsterCheck, audio:audioCheck, hud:'CHECK', hudColor:() => C.dark, file:'horst-monster-check-kommentar', still:14.5, cta:'Kommentiere MONSTER, ich schick dir den kompletten Check.',
    desc:'Hook „29 / 29 Technik-Punkte. 0 Anfragen.“, dann vier Kapitel <b>Klarheit, Idee, Auftritt, Handlung</b> mit je drei Haken, Zähler oben rechts zählt bis 12 / 12, HORST prüft aus der Ecke und nickt bei jedem Haken. Badge ✓ MONSTER-READY stempelt rein, „Technik macht deine Seite sicher. Eine Idee macht sie stark.“ Endkarte THE IDEA IS THE KEY mit Kommentar-CTA. Voice-over-Sätze als Text, damit es ohne Sprecher geht.' },
  { id:'bio', name:'Monster-Check', tech:'CTA: Link in Bio', dur:40, render:monsterCheck, audio:audioCheck, hud:'CHECK', hudColor:() => C.dark, file:'horst-monster-check-bio', still:31.5, cta:'Monsterideen-Check: Link in Bio.',
    desc:'Dasselbe Reel mit dem zweiten CTA aus dem Skript: <b>„Monsterideen-Check: Link in Bio.“</b> Passt zum bestehenden Lead Magnet, braucht kein Auto-DM.' },
];
