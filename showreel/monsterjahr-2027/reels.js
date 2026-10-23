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
  mono(claim ? 'MONSTERJAHR 2027' : 'STUDIO HORST', 62, 1160, 24, '#A6A3AD', t0 + 1.3, 'left', 5); mono('KIRCHZARTEN', 1018, 1160, 24, '#A6A3AD', t0 + 1.3, 'right', 5);
  reveal('KEINE VORSÄTZE. IDEEN.', 62, 1310, DISP(fitDisp('KEINE VORSÄTZE. IDEEN.', 940, 72)), C.light, t0 + 1.5, 0.8, null, 'left', 0);
  mono('STUDIO-HORST.DE', 62, 1370, 24, '#A6A3AD', t0 + 1.8, 'left', 4);
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

// =====================================================================
// REEL 0 · NEUJAHR · the cuckoo clock strikes twelve, HORST comes out
// =====================================================================
const MID = 4.8; // the clock reaches twelve
function reel0(){
  if (T >= 12.4){ endQuiet(12.4); return; }
  // night
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0E0B16'); bg.addColorStop(1, '#201C25'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  for (let k = 0; k < 70; k++){ ctx.fillStyle = `rgba(248,247,248,${0.3 + 0.5*rnd(k + Math.floor(T*2))})`; ctx.fillRect(rnd(k)*W, rnd(k + 9)*600, 3, 3); }
  // snow falling
  for (let k = 0; k < 90; k++){ const y = ((rnd(k + 40)*H + T*(40 + rnd(k)*60)) % (H + 20)) - 10, x = rnd(k + 80)*W + Math.sin(T + k)*12; ctx.fillStyle = 'rgba(248,247,248,.55)'; ctx.beginPath(); ctx.arc(x, y, 2 + rnd(k)*3, 0, TAU); ctx.fill(); }
  // the clock: wooden house with roof, dial, pendulum
  const cx = 540, cy = 980, inA = eo(seg(T, 0.2, 1.0)); ctx.save(); ctx.translate(cx, cy + (1 - inA)*80); ctx.globalAlpha = inA;
  ctx.fillStyle = '#4A2E1E'; ctx.fillRect(-300, -380, 600, 700); ctx.fillStyle = '#2E1B12'; ctx.beginPath(); ctx.moveTo(-360, -380); ctx.lineTo(0, -620); ctx.lineTo(360, -380); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3A2418'; for (let k = 0; k < 6; k++){ ctx.fillRect(-340 + k*120, -400, 100, 24); }
  // pendulum
  const pa = Math.sin(T*Math.PI*2/1.0)*0.25; ctx.save(); ctx.translate(0, 320); ctx.rotate(pa); ctx.fillStyle = '#C9A24A'; ctx.fillRect(-6, 0, 12, 260); ctx.beginPath(); ctx.arc(0, 280, 46, 0, TAU); ctx.fill(); ctx.restore();
  // door (above the dial)
  const open = eback(seg(T, MID, MID + 0.5)), back = seg(T, 9.6, 10.2);
  ctx.fillStyle = '#1A0F0A'; ctx.fillRect(-110, -330, 220, 170);
  // HORST pops out of the door
  if (open > 0 && back < 1){ const out = open*(1 - back), hy = -250 - out*150; drawHead(0, hy, 380*Math.max(0.01, out), Math.sin((T - MID)*5)*0.08*Math.exp(-(T - MID)*0.8)); }
  ctx.save(); ctx.translate(-110, -330); ctx.scale(1 - open*0.9, 1); ctx.fillStyle = '#7A4A2A'; ctx.fillRect(0, 0, 110, 170); ctx.restore();
  ctx.save(); ctx.translate(110, -330); ctx.scale(-(1 - open*0.9), 1); ctx.fillStyle = '#7A4A2A'; ctx.fillRect(0, 0, 110, 170); ctx.restore();
  // dial
  ctx.fillStyle = '#F3E9D2'; ctx.beginPath(); ctx.arc(0, 0, 200, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2E1B12'; ctx.lineWidth = 10; ctx.stroke();
  for (let k = 0; k < 12; k++){ ctx.save(); ctx.rotate(k*TAU/12); ctx.fillStyle = '#2E1B12'; ctx.fillRect(-4, -180, 8, k % 3 ? 22 : 40); ctx.restore(); }
  // hands race to twelve
  const q = eio(seg(T, 0.8, MID)), minA = lerp(-TAU*0.35, 0, q) , hrA = lerp(-TAU/12*0.35, 0, q);
  ctx.strokeStyle = '#2E1B12'; ctx.lineCap = 'round'; ctx.lineWidth = 16; ctx.save(); ctx.rotate(hrA); ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(0, -105); ctx.stroke(); ctx.restore();
  ctx.lineWidth = 10; ctx.save(); ctx.rotate(minA); ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(0, -160); ctx.stroke(); ctx.restore();
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill();
  ctx.restore();
  // shake on the strike
  if (T >= MID && T < MID + 0.3){ const k = (1 - seg(T, MID, MID + 0.3))*14; ctx.setTransform(1, 0, 0, 1, (rnd(Math.floor(T*60)) - .5)*k, (rnd(Math.floor(T*60) + 7) - .5)*k); }
  if (T < MID) mono('31.12.2026 · 23:59', 540, 300, 28, '#A6A3AD', 0.4, 'center', 6);
  if (T >= MID){ reveal('KUCKUCK.', 540, 290, DISP(150), C.light, MID + 0.1, 0.5, 6.6, 'center', 0); }
  if (T >= 6.8){ reveal('2027 WIRD EIN', 540, 230, DISP(fitDisp('2027 WIRD EIN', 940, 110)), C.light, 6.8, 0.9, null, 'center', 0); reveal('MONSTERJAHR.', 540, 345, DISP(fitDisp('MONSTERJAHR.', 940, 120)), C.red, 6.95, 0.9, null, 'center', 0); }
  if (T >= 9.0){ reveal('KEINE VORSÄTZE. IDEEN.', 540, 1770, DISP(fitDisp('KEINE VORSÄTZE. IDEEN.', 940, 64)), C.light, 9.0, 0.8, null, 'center', 0); }
  grain(0.03);
}
function audio0(add){
  // ticking, a rising sweep to twelve, twelve strikes compressed, then calm
  for (let t = 0; t < MID; t += 0.5) add(t, (d,w) => noise(d, w, 'bandpass', 2500, 2, 0.14, 0.04));
  add(0.8, (d,w) => riser(d, w, MID - 0.8, 0.18));
  for (let k = 0; k < 12; k++) add(MID + k*0.12, (d,w) => { tone(d, w, 'triangle', 660, 0.12, 0.7, 0.003); tone(d, w, 'sine', 1320, 0.05, 0.4, 0.003); });
  add(MID, (d,w) => { kick(d, w, 1.3); crash(d, w); });
  add(MID + 0.4, (d,w) => tone(d, w, 'square', 880, 0.08, 0.18, 0.003)); add(MID + 0.65, (d,w) => tone(d, w, 'square', 698, 0.08, 0.3, 0.003)); // cuckoo
  pulse(add, 6.8, 12.2, 0.75);
  add(6.95, (d,w) => [130.8, 196, 261.6, 329.6].forEach(f => tone(d, w, 'triangle', f, 0.06, 2.6, 0.02, 2500)));
  add(9.0, (d,w) => tick(d, w)); add(12.4, (d,w) => { kick(d, w, 0.7); tone(d, w, 'sine', 55, 0.18, 2.0, 0.02); });
}

// =====================================================================
// REELS 1–14 · VORSÄTZE · one resolution each, struck out, replaced by an idea
// =====================================================================
const VORSAETZE = [
  ['Mehr posten.', 'Etwas zu sagen haben.'],
  ['Endlich das Logo erneuern.', 'Erst wissen, wofür es steht.'],
  ['Diesmal wirklich Social Media.', 'Eine Geschichte, die man erzählen will.'],
  ['Website bis März.', 'Ein Satz, der auf die Startseite gehört.'],
  ['Weniger Stockfotos.', 'Ein eigenes Bild. Eins reicht.'],
  ['Jünger wirken.', 'Klarer wirken.'],
  ['Sichtbarer werden.', 'Unverwechselbar werden.'],
  ['Newsletter starten.', 'Einen Grund liefern, ihn zu öffnen.'],
  ['Mehr Reichweite.', 'Mehr Haltung.'],
  ['KI ausprobieren.', 'Die Idee behalten. KI darf helfen.'],
  ['Professioneller auftreten.', 'Mutiger auftreten.'],
  ['Die Konkurrenz beobachten.', 'Die eigenen Kunden fragen.'],
  ['Alles überarbeiten.', 'Das Eine richtig machen.'],
  ['Nächstes Jahr dann.', 'Jetzt.'],
];
const N = VORSAETZE.length;
function wrapLines(s, maxW, font){ ctx.save(); ctx.font = font; const out = []; let line = ''; s.split(' ').forEach(w => { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line){ out.push(line); line = w; } else line = t; }); if (line) out.push(line); ctx.restore(); return out; }
const V_STAMP = 2.6, V_IDEA = 4.2, V_HEAD = 6.3, V_END = 8.0;
function vorsatz(i){
  const v = VORSAETZE[i][0].toUpperCase(), idee = VORSAETZE[i][1].toUpperCase(), nn = String(i + 1).padStart(2, '0');
  if (T >= V_END){ endQuiet(V_END); return; }
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  grid(0.07, 12, 0.05, 0.03);
  mono(`VORSATZ ${nn} / ${N}`, 62, 300, 26, C.dark, 0.2, 'left', 5); mono('MONSTERJAHR 2027', 1018, 300, 24, '#6F717A', 0.3, 'right', 5);
  rule(62, 330, 1018, 0.3, 0.9, C.dark, 2);
  // the resolution, as if written on a list: checkbox + lines
  const fsz = fitD(v, 880, 120), f = DISP(fsz), lines = wrapLines(v, 880, f);
  ctx.save(); ctx.strokeStyle = C.dark; ctx.lineWidth = 4; ctx.globalAlpha = expo(seg(T, 0.5, 0.9)); ctx.strokeRect(62, 520, 56, 56); ctx.restore();
  lines.forEach((l, k) => reveal(l, 150, 600 + k*fsz*1.12, f, C.dark, 0.6 + k*0.1, 0.9, null, 'left', 0));
  // strike-through draws, then the stamp slams
  const sp = expo(seg(T, V_STAMP - 0.25, V_STAMP + 0.15)); if (sp > 0){ ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.lineCap = 'round'; lines.forEach((l, k) => { ctx.save(); ctx.font = f; const w = ctx.measureText(l).width; ctx.beginPath(); ctx.moveTo(140, 600 - fsz*0.32 + k*fsz*1.12); ctx.lineTo(140 + (w + 30)*sp, 594 - fsz*0.32 + k*fsz*1.12); ctx.stroke(); ctx.restore(); }); }
  stampSlam(640, 640 + (lines.length - 1)*fsz*0.56, -0.12, ['GESTRICHEN'], V_STAMP, 1.35);
  // the idea
  mono(`IDEE ${nn} / ${N}`, 62, 1000, 26, C.red, V_IDEA - 0.2, 'left', 5);
  rule(62, 1030, 1018, V_IDEA - 0.1, 0.8, C.red, 2);
  const fs = fitD(idee, 940, 116), fi = DISP(fs), il = wrapLines(idee, 940, fi);
  il.forEach((l, k) => reveal(l, 62, 1150 + k*fs*1.12, fi, C.red, V_IDEA + k*0.1, 0.9, null, 'left', 0));
  // HORST nods in from the corner
  if (T >= V_HEAD){ const p = eback(seg(T, V_HEAD, V_HEAD + 0.5)); drawHead(900, 1640, 320*p, Math.sin((T - V_HEAD)*6)*0.08*Math.exp(-(T - V_HEAD))); }
  reveal('KEINE VORSÄTZE. IDEEN.', 62, 1710, DISP(fitDisp('KEINE VORSÄTZE. IDEEN.', 640, 56)), C.dark, V_HEAD + 0.3, 0.8, null, 'left', 0);
  grain(0.035);
}

function fitD(s, maxW, maxS, maxLines = 2){ for (let size = maxS; size > 40; size -= 4){ if (wrapLines(s, maxW, DISP(size)).length <= maxLines) return size; } return 40; }
function fitHead(s, maxW, maxS){ ctx.save(); ctx.font = HEAD(100); ctx.textAlign = 'left'; ls(ctx, -3); const lines = wrapLines(s, maxW*100/maxS, HEAD(100)); ctx.restore(); return lines.length <= 2 ? maxS : Math.max(64, maxS*2/lines.length); }
function audioV(add){
  pulse(add, 0, V_END - 0.2, 0.75);
  [0.6, 0.7].forEach(t => add(t, (d,w) => tick(d, w)));
  add(V_STAMP - 0.25, (d,w) => noise(d, w, 'bandpass', 1200, 0.6, 0.12, 0.35));
  add(V_STAMP, (d,w) => { kick(d, w, 1.2); noise(d, w, 'lowpass', 900, 0.5, 0.7, 0.14); });
  add(V_IDEA, (d,w) => { tick(d, w, 0.14); [130.8, 196, 261.6, 329.6].forEach(f => tone(d, w, 'triangle', f, 0.06, 2.2, 0.02, 2500)); });
  add(V_HEAD, (d,w) => noise(d, w, 'bandpass', 1800, 0.5, 0.1, 0.2)); add(V_HEAD + 0.3, (d,w) => tick(d, w));
  add(V_END, (d,w) => { kick(d, w, 0.7); tone(d, w, 'sine', 55, 0.18, 2.0, 0.02); });
}

// ---------- the set ----------
const REELS = [
  { id:'neujahr', name:'Neujahr 0:00', tech:'Kuckucksuhr', dur:15, render:reel0, audio:audio0, hud:'01.01.2027', hudColor:() => C.light, file:'horst-2027-neujahr', still:5.4,
    desc:'Schneenacht, Kuckucksuhr, die Zeiger rasen auf Mitternacht zu. Schlag zwölf: Türchen auf, <b>HORST statt Kuckuck</b>. „2027 wird ein Monsterjahr. Keine Vorsätze. Ideen.“ Zum Posten am 1. Januar um 0:00.' },
  ...VORSAETZE.map(([v, idee], i) => ({ id:'v' + (i + 1), name:`Vorsatz ${String(i + 1).padStart(2, '0')}`, tech:v.replace(/\.$/, ''), dur:10.5, render:() => vorsatz(i), audio:audioV, hud:'VORSÄTZE', hudColor:() => C.dark, file:`horst-2027-vorsatz-${String(i + 1).padStart(2, '0')}`, still:5.6,
    desc:`Tag ${i + 2} im Januar: der Vorsatz <b>„${v}“</b> erscheint auf der Liste, der rote Strich zieht durch, der Stempel GESTRICHEN knallt drauf. Dann die Idee: „${idee}“ HORST nickt. Alle 14 aus derselben Vorlage, Sätze in <code>VORSAETZE</code> tauschbar.` })),
];
