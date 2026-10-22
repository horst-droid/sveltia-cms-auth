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
  mono(claim ? 'SAG EINFACH HORST' : 'STUDIO HORST', 62, 1160, 24, '#A6A3AD', t0 + 1.3, 'left', 5); mono('KIRCHZARTEN', 1018, 1160, 24, '#A6A3AD', t0 + 1.3, 'right', 5);
  reveal('Langweilig? Sag einfach Horst.', 62, 1300, HEAD(fitHeadW('Langweilig? Sag einfach Horst.', 940, 56)), C.light, t0 + 1.5, 0.8, null, 'left', -2);
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


function fitHeadW(s, maxW, maxS){ ctx.save(); ctx.font = HEAD(100); ls(ctx, -3); const w = ctx.measureText(s).width; ctx.restore(); return Math.min(maxS, 100*maxW/w); }
function wrapLines(s, maxW, font){ ctx.save(); ctx.font = font; const out = []; let line = ''; s.split(' ').forEach(w => { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line){ out.push(line); line = w; } else line = t; }); if (line) out.push(line); ctx.restore(); return out; }

// =====================================================================
// REEL 0 · START · HORST explains the challenge
// =====================================================================
function reel0(){
  if (T >= 12.6){ endQuiet(12.6); return; }
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  grid(0.07, 12, 0.05, 0.03);
  mono('CHALLENGE · JANUAR 2027', 62, 300, 24, C.red, 0.2, 'left', 5); mono('MONSTERJAHR', 1018, 300, 24, '#6F717A', 0.3, 'right', 5);
  rule(62, 330, 1018, 0.3, 0.9, C.dark, 2);
  // HORST points at you (the still, big, slight lean-in)
  const p = eback(seg(T, 0.4, 1.0)), lean = 1 + 0.06*seg(T, 1.0, 11.0); drawHead(540, 760, 620*p*lean, Math.sin(T*2)*0.03);
  reveal('Du.', 540, 1180, HEAD(120), C.dark, 1.2, 0.7, 2.6, 'center', -4);
  reveal('Ja, du.', 540, 1180, HEAD(120), C.dark, 2.8, 0.7, 4.2, 'center', -4);
  reveal('Schick mir deine', 540, 1140, HEAD(74), C.dark, 4.5, 0.9, null, 'center', -3);
  reveal('langweiligste Anzeige.', 540, 1230, HEAD(74), C.red, 4.65, 0.9, null, 'center', -3);
  mono('PER DM · NUR EIGENE WERBEMITTEL', 540, 1330, 22, '#6F717A', 6.0, 'center', 5);
  rule(340, 1400, 740, 6.4, 0.7, C.dark, 1);
  reveal('Antwort in fünf Sekunden.', 540, 1520, HEAD(52), C.dark, 7.2, 0.8, null, 'center', -2);
  reveal('Als Reel. Mit HORST.', 540, 1590, HEAD(52), '#6F717A', 7.4, 0.8, null, 'center', -2);
  reveal('Langweilig? Sag einfach Horst.', 540, 1760, HEAD(46), C.red, 9.4, 0.8, null, 'center', -2);
  grain(0.035);
}
function audio0(add){
  pulse(add, 0, 12.4, 0.75);
  add(0.4, (d,w) => noise(d, w, 'bandpass', 1500, 0.5, 0.12, 0.3));
  [1.2, 2.8].forEach(t => add(t, (d,w) => { kick(d, w, 0.9); tick(d, w, 0.14); }));
  add(4.5, (d,w) => tick(d, w)); add(4.65, (d,w) => [130.8, 196, 261.6, 329.6].forEach(f => tone(d, w, 'triangle', f, 0.06, 2.4, 0.02, 2500)));
  [7.2, 7.4, 9.4].forEach(t => add(t, (d,w) => tick(d, w)));
  add(12.6, (d,w) => { kick(d, w, 0.7); tone(d, w, 'sine', 55, 0.18, 2.0, 0.02); });
}

// =====================================================================
// ANTWORT-VORLAGE · 5-second loop: the boring original, then HORST's version wipes over
// Each entry: who sent it, the original (drawn as a deliberately dull ad), HORST's lines.
// A real submission replaces the drawn original with an image: media/orig-<id>.jpg (optional).
// =====================================================================
const ANTWORTEN = [
  { id:'01', von:'Handwerksbetrieb, Dreisamtal', orig:{ head:'Wir sind für Sie da.', sub:'Qualität · Zuverlässigkeit · Erfahrung', col:'#8E8E96' }, neu:['Wir sind da.', 'Für dich.', 'Seit 1987.'] },
  { id:'02', von:'Bäckerei, Kirchzarten', orig:{ head:'Frische Backwaren täglich', sub:'Jetzt neu: unser Sortiment', col:'#A08C6A' }, neu:['Um 5 Uhr', 'riecht es', 'nach uns.'] },
  { id:'03', von:'Steuerberatung, Freiburg', orig:{ head:'Ihr Partner für Steuern', sub:'Kompetent · Persönlich · Engagiert', col:'#6A7A8E' }, neu:['Wir mögen', 'Zahlen.', 'Du musst nicht.'] },
];
const SWIPE = 2.2;
function antwort(i){
  const a = ANTWORTEN[i], lt = T % 5;
  // the original: a dull ad, grey, centered, stock-like gradient
  const im = M['orig' + a.id];
  if (ok(im)){ const s = Math.max(W/im.naturalWidth, H/im.naturalHeight); ctx.drawImage(im, 540 - im.naturalWidth*s/2, 960 - im.naturalHeight*s/2, im.naturalWidth*s, im.naturalHeight*s); }
  else {
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#E9E9EC'); g.addColorStop(1, '#CFCFD6'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = a.orig.col; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.ellipse(540, 760, 380, 300, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; // a vague "stock photo" blob
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(120, 1120, 840, 300);
    ctx.save(); ctx.font = `700 54px Arial, Helvetica, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#3A3A44'; ctx.fillText(a.orig.head, 540, 1230); ctx.font = `400 30px Arial, Helvetica, sans-serif`; ctx.fillStyle = '#7A7A86'; ctx.fillText(a.orig.sub, 540, 1300); ctx.fillStyle = a.orig.col; ctx.fillRect(400, 1340, 280, 40); ctx.fillStyle = '#FFF'; ctx.font = `700 22px Arial, Helvetica, sans-serif`; ctx.fillText('MEHR ERFAHREN', 540, 1368); ctx.restore();
  }
  ctx.save(); ls(ctx, 4); text('VORHER', 62, 300, MONO(24), '#3A3A44', 'left', 1, 4); text(`EINSENDUNG ${a.id}`, 1018, 300, MONO(24), '#3A3A44', 'right', 1, 4); ctx.restore();
  // HORST's version wipes in from the left with a red edge
  const p = expo(seg(lt, SWIPE, SWIPE + 0.9)); if (p <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W*p, H); ctx.clip();
  ctx.fillStyle = C.dark; ctx.fillRect(0, 0, W, H); grid(0.08, 12, -1, 0);
  ctx.save(); ls(ctx, 4); text('NACHHER', 62, 300, MONO(24), '#A6A3AD', 'left', 1, 4); text('HORST', 1018, 300, MONO(24), C.red, 'right', 1, 4); ctx.restore();
  ctx.fillStyle = 'rgba(248,247,248,.35)'; ctx.fillRect(62, 330, W - 124, 1);
  const size = Math.min(150, ...a.neu.map(l => fitDisp(l, 940, 150)));
  a.neu.forEach((l, k) => { ctx.save(); ctx.font = DISP(size); ctx.textAlign = 'left'; ctx.fillStyle = k === a.neu.length - 1 ? C.red : C.light; ctx.fillText(l, 62, 760 + k*size*1.05); ctx.restore(); });
  ctx.save(); ls(ctx, 4); text(('EINGESENDET VON ' + a.von).toUpperCase(), 62, 1340, MONO(22), '#A6A3AD', 'left', 1, 4); ctx.restore();
  drawHead(900, 1540, 260, Math.sin(lt*4)*0.05);
  ctx.restore();
  if (p > 0 && p < 1){ ctx.fillStyle = C.red; ctx.fillRect(W*p - 3, 0, 6, H); }
  stampSlam(300, 1760, -0.08, ['HORST WAR DA'], SWIPE + 0.9, 0.7, C.red);
}
function audioA(add){
  add(0, (d,w) => noise(d, w, 'bandpass', 2600, 0.4, 0.03, 2.2)); // dull hiss on the original
  add(SWIPE, (d,w) => { riser(d, w, 0.5, 0.2); }); add(SWIPE + 0.5, (d,w) => { kick(d, w, 1.1); crash(d, w); [110, 164.8, 220, 277.2].forEach(f => tone(d, w, 'triangle', f, 0.07, 2.0, 0.02, 2200)); });
  add(SWIPE + 0.9, (d,w) => { kick(d, w, 1.0); noise(d, w, 'lowpass', 900, 0.5, 0.6, 0.14); });
  for (let t = SWIPE + 0.5; t < 5; t += 0.5) add(t, (d,w) => tone(d, w, 'sine', 55, 0.12, 0.4, 0.02));
}

// ---------- the set ----------
const REELS = [
  { id:'start', name:'Start', tech:'Aufruf 15 s', dur:15, render:reel0, audio:audio0, hud:'CHALLENGE', hudColor:() => C.dark, file:'horst-challenge-start', still:5.6,
    desc:'HORST zeigt auf dich: „Du. Ja, du. Schick mir deine <b>langweiligste Anzeige</b>.“ Regeln in einer Zeile (per DM, nur eigene Werbemittel), Versprechen: Antwort in fünf Sekunden, als Reel, mit HORST. Zum Posten am 8. Januar.' },
  ...ANTWORTEN.map((a, i) => ({ id:'a' + a.id, name:`Antwort ${a.id}`, tech:a.von, dur:5, render:() => antwort(i), audio:audioA, hud:'LOOP', hudColor:() => T % 5 > SWIPE + 0.5 ? C.light : C.dark, file:`horst-challenge-antwort-${a.id}`, still:3.6,
    desc:`Vorlage für eine Antwort, 5 s als Loop: links das Original (hier gezeichnet als absichtlich langweilige Anzeige „${a.orig.head}“; eine echte Einsendung kommt als Bild <code>media/orig-${a.id}.jpg</code> rein), dann <b>wischt HORSTs Version rüber</b>: „${a.neu.join(' ')}“ Stempel HORST WAR DA.` })),
];
