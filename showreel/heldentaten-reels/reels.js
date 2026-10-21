// ---------- media ----------
__SVG__
const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const M = {};
const ok = el => el && el.complete && el.naturalWidth > 0;
function loadImg(key, src){ return new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; M[key] = i; }); }
const mediaP = Promise.race([Promise.all([loadImg('logo', svgURL(SVG_LOGO_W)), loadImg('stempel', 'media/stempel.png')]), new Promise(r => setTimeout(r, 6000))]).then(() => { dirty = true; });
function syncV(){}
function dropY(lt, h, G = 5200, REST = 0.35){ if (lt <= 0) return h; let v = Math.sqrt(2*G*h), tt = lt; const tf = v/G; if (tt < tf) return h - 0.5*G*tt*tt; tt -= tf; v *= REST; for (let b = 0; b < 4; b++){ const dur = 2*v/G; if (tt < dur) return Math.max(0, v*tt - 0.5*G*tt*tt); tt -= dur; v *= REST; } return 0; }
function stamp(x, y, rot, lines, t0, scale = 1, color = C.red){ // a red rubber stamp slamming down
  const st = seg(T, t0, t0 + 0.18); if (st <= 0) return;
  const sc = lerp(2.2, 1, eo(st))*scale, sh = T > t0 + 0.15 && T < t0 + 0.4 ? (rnd(Math.floor(T*60) + x) - .5)*14 : 0;
  ctx.save(); ctx.translate(x + sh, y + sh*0.6); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = Math.min(1, st*4);
  ctx.font = DISP(64); const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 90, h = 50 + lines.length*76;
  ctx.strokeStyle = color; ctx.lineWidth = 10; ctx.strokeRect(-w/2, -h/2, w, h); ctx.lineWidth = 4; ctx.strokeRect(-w/2 + 16, -h/2 + 16, w - 32, h - 32);
  ctx.fillStyle = color; ctx.textAlign = 'center'; lines.forEach((l, i) => ctx.fillText(l, 0, -h/2 + 78 + i*76)); ctx.restore();
}

// =====================================================================
// REEL 1 · JEDER TAG BRAUCHT HELDENTATEN.
// =====================================================================
const DAY = [
  { t:'06:30', s:['ERSTER KAFFEE.'],        x:300, y:1010, r:-0.12 },
  { t:'08:05', s:['INBOX BESIEGT.'],        x:720, y:1140, r:0.08 },
  { t:'09:15', s:['LOGO GERETTET.'],        x:380, y:1290, r:0.05 },
  { t:'11:40', s:['KOMMA GESETZT.'],        x:760, y:1420, r:-0.1 },
  { t:'14:32', s:['IDEE GEHABT.'],          x:330, y:1570, r:0.1 },
  { t:'17:50', s:['KUNDE GLÜCKLICH.'],      x:700, y:1700, r:-0.06 },
  { t:'21:10', s:['FEIERABEND.', 'FAST.'],  x:540, y:860,  r:0.04 },
];
const DAY_T0 = 1.0, DAY_D = 1.05, BIG_T = DAY_T0 + DAY.length*DAY_D + 0.4;
function reel1(){
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  if (T >= 13.0){ endCard(13.0); return; }
  const k = clamp(Math.floor((T - DAY_T0)/DAY_D), -1, DAY.length - 1);
  // the clock: time in ransom, plus a small analog face
  const tstr = k < 0 ? '00:00' : DAY[k].t, flip = k >= 0 ? seg(T - DAY_T0 - k*DAY_D, 0, 0.12) : 1;
  ctx.save(); ctx.translate(540, 520); ctx.scale(1, lerp(0.2, 1, flip)); ctx.font = DISP(200); ctx.fillStyle = C.dark; ctx.textAlign = 'center'; ctx.fillText(tstr, 0, 72); ctx.restore();
  const hh = +tstr.slice(0, 2), mm = +tstr.slice(3), a = eo(seg(T, 0.2, 0.6));
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 260); ctx.strokeStyle = C.dark; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.stroke();
  ctx.lineCap = 'round'; ctx.lineWidth = 8; const ha = (hh % 12 + mm/60)/12*TAU - Math.PI/2, ma = mm/60*TAU - Math.PI/2;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ha)*38, Math.sin(ha)*38); ctx.stroke(); ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ma)*56, Math.sin(ma)*56); ctx.stroke(); ctx.restore();
  ctx.save(); ls(ctx, 5); text('EIN TAG BEI HORST', 540, 700, LAB(28), C.red, 'center', a, 5); ctx.restore();
  if (T < BIG_T) DAY.forEach((d, i) => stamp(d.x, d.y, d.r, d.s, DAY_T0 + i*DAY_D + 0.3, 0.78));
  // the real stamp lands on everything
  if (T >= BIG_T && ok(M.stempel)){
    const st = seg(T, BIG_T, BIG_T + 0.22), sc = lerp(2.4, 1, eo(st)), sh = T > BIG_T + 0.2 && T < BIG_T + 0.6 ? (rnd(Math.floor(T*60)) - .5)*40*(1 - seg(T, BIG_T + 0.2, BIG_T + 0.6)) : 0;
    ctx.fillStyle = `rgba(248,247,248,${0.75*eo(st)})`; ctx.fillRect(0, 760, W, 1100);
    ctx.save(); ctx.translate(540 + sh, 1300 + sh*0.5); ctx.rotate(-0.12 + (T - BIG_T)*0.02); ctx.scale(sc, sc); ctx.globalAlpha = Math.min(1, st*4); const s = 820; ctx.drawImage(M.stempel, -s/2, -s/2, s, s); ctx.restore();
    if (T >= BIG_T + 0.9){ slamWord('JEDER TAG BRAUCHT', fitDisp('JEDER TAG BRAUCHT', 940, 96), 'center', 1740, C.dark, BIG_T + 0.9, 0.03, 2); slamWord('HELDENTATEN.', fitDisp('HELDENTATEN.', 920, 140), 'center', 1860, C.red, BIG_T + 1.4, 0.04, 9); }
  }
}
function audio1(add){
  add(0.2, (d,w) => tone(d, w, 'sine', 880, 0.06, 0.3));
  for (let k = 0; k < 24; k++) add(k*0.5, (d,w) => noise(d, w, 'highpass', 3000, 2, 0.1, 0.03));   // tick
  DAY.forEach((d, i) => { const t = DAY_T0 + i*DAY_D; add(t, (d2,w) => noise(d2, w, 'bandpass', 2500, 1, 0.15, 0.05)); add(t + 0.3, (d2,w) => { kick(d2, w, 0.9); noise(d2, w, 'lowpass', 900, 0.8, 0.45, 0.15); }); });
  add(BIG_T - 0.4, (d,w) => riser(d, w, 0.4, 0.25)); add(BIG_T + 0.2, (d,w) => { kick(d, w, 1.5); noise(d, w, 'lowpass', 700, 0.8, 0.9, 0.3); crash(d, w); });
  for (let k = Math.ceil((BIG_T + 0.9)*2); k < 26; k++){ add(k*0.5, (d,w) => kick(d, w, 0.9)); add(k*0.5 + 0.25, (d,w) => hat(d, w)); if (k % 2) add(k*0.5, (d,w) => clap(d, w)); add(k*0.5 + 0.25, (d,w) => tone(d, w, 'sawtooth', [55, 65.41, 49, 73.42][k % 4]*2, 0.22, 0.2, 0.004, 650)); }
  add(BIG_T + 0.9, (d,w) => kick(d, w, 1.1)); add(BIG_T + 1.4, (d,w) => { kick(d, w, 1.3); clap(d, w); });
  add(13.0, (d,w) => kick(d, w, 1.2)); add(13.0, (d,w) => crash(d, w)); add(13.0, (d,w) => tone(d, w, 'sawtooth', 55, 0.3, 1.9, 0.01, 300));
  [220, 261.63, 329.63, 493.88].forEach(f => add(13.0, (d,w) => tone(d, w, 'triangle', f, 0.07, 1.9, 0.06)));
}

// =====================================================================
// REEL 2 · DAS REZEPT.
// =====================================================================
const BOWL = { x:540, y:1420, w:700, h:120 };
const ING = [
  { l:'1 KOPF VOLLER IDEALE', t:1.2, draw(c){ c.fillStyle = C.dark; c.beginPath(); c.arc(0, 0, 70, 0, TAU); c.fill(); c.font = DISP(80); c.fillStyle = C.white; c.textAlign = 'center'; c.fillText('!', 0, 30); } },
  { l:'1 PRISE MUT', t:3.0, draw(c){ c.fillStyle = C.red; for (let k = 0; k < 7; k++){ c.beginPath(); c.arc((rnd(k) - .5)*120, (rnd(k + 3) - .5)*60, 10 + rnd(k + 5)*10, 0, TAU); c.fill(); } } },
  { l:'1 SATTE PORTION EINSATZ', t:4.8, draw(c){ c.fillStyle = C.dark; c.fillRect(-110, -70, 220, 140); c.fillStyle = C.red; c.fillRect(-110, -70, 220, 24); } },
  { l:'FESTER GLAUBE AN ERFOLG', t:6.6, draw(c){ c.fillStyle = '#F6D772'; c.beginPath(); for (let k = 0; k < 10; k++){ const r = k % 2 ? 38 : 90, an = k/10*TAU - Math.PI/2; c.lineTo(Math.cos(an)*r, Math.sin(an)*r); } c.closePath(); c.fill(); } },
];
const MIX_T = 8.4, OUT_T = 10.0;
function reel2(){
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  if (T >= 13.2){ endCard(13.2); return; }
  const a = eo(seg(T, 0.2, 0.6));
  ctx.save(); ls(ctx, 5); text('REZEPT FÜR HELDENTATEN', 540, 300, LAB(30), C.red, 'center', a, 5); ctx.restore();
  text('Es ist nicht so schwer.', 540, 400 + (1-a)*16, F(700, 56), C.dark, 'center', a, -1.5);
  // ingredient list on the left, ticked as they drop
  ING.forEach((g, i) => { const la = eo(seg(T, g.t - 0.5, g.t - 0.2)); if (la <= 0) return; const done = T > g.t + 0.6; ctx.save(); ctx.globalAlpha = la; ctx.fillStyle = done ? C.red : 'rgba(32,28,37,.25)'; ctx.fillRect(120, 540 + i*90 - 14, 28, 28); ctx.font = F(700, 38); ctx.fillStyle = C.dark; ctx.textAlign = 'left'; ls(ctx, 1); ctx.fillText(g.l, 180, 540 + i*90); ctx.restore(); });
  // the mix shakes the bowl, then the idea rises
  const mix = T > MIX_T && T < OUT_T ? Math.sin((T - MIX_T)*30)*0.06*(1 - seg(T, OUT_T - 0.4, OUT_T)) : 0, sh = mix*80;
  const rise = clamp(eback(seg(T, OUT_T, OUT_T + 0.7)), 0, 1.15);
  // idea blob behind the bowl rim
  if (rise > 0){ ctx.save(); ctx.translate(540, BOWL.y - 60 - 260*rise); ctx.scale(rise, rise);
    ctx.fillStyle = C.red; ctx.beginPath(); for (let k = 0; k <= 48; k++){ const an = k/48*TAU, rr = 200*(1 + 0.07*Math.sin(an*5 + T*5)); k ? ctx.lineTo(Math.cos(an)*rr, Math.sin(an)*rr) : ctx.moveTo(Math.cos(an)*rr, Math.sin(an)*rr); } ctx.closePath(); ctx.fill();
    [-1, 1].forEach(sd => { ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(sd*62, -30, 38, 0, TAU); ctx.fill(); ctx.fillStyle = C.dark; ctx.beginPath(); ctx.arc(sd*62 + 10, -24, 18, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = C.dark; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 36, 52, 0.15*Math.PI, 0.85*Math.PI); ctx.stroke(); ctx.restore(); }
  // ingredients fall into the bowl
  ING.forEach((g, i) => { const lt = T - g.t; if (lt < 0) return; const off = dropY(lt, 1100 + i*80), sink = seg(lt, 0.9, 1.4); if (sink >= 1) return; ctx.save(); ctx.translate(540 + (i - 1.5)*90 + sh, BOWL.y - 30 - off + sink*140); ctx.rotate((rnd(i) - .5)*0.6*Math.min(1, off/500)); ctx.globalAlpha = 1 - sink; g.draw(ctx); ctx.restore(); });
  // bowl
  ctx.save(); ctx.translate(sh, 0); ctx.rotate(mix*0.5);
  ctx.fillStyle = '#3A3842'; ctx.beginPath(); ctx.ellipse(BOWL.x, BOWL.y, BOWL.w/2, BOWL.h/2, 0, 0, Math.PI); ctx.lineTo(BOWL.x - BOWL.w/2, BOWL.y); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(BOWL.x, BOWL.y, BOWL.w/2, BOWL.h/2, 0, Math.PI, TAU); ctx.fill(); ctx.fillStyle = '#2A2830'; ctx.beginPath(); ctx.ellipse(BOWL.x, BOWL.y, BOWL.w/2 - 30, BOWL.h/2 - 20, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = C.dark; ctx.font = DISP(44); ctx.textAlign = 'center'; ctx.fillStyle = '#8E8C97'; ctx.fillText('HORST', BOWL.x, BOWL.y + 160); ctx.restore();
  // spoon while mixing
  if (T > MIX_T && T < OUT_T){ ctx.save(); ctx.translate(540 + Math.cos(T*14)*120, BOWL.y - 40); ctx.rotate(Math.sin(T*14)*0.5); ctx.fillStyle = '#C9A06A'; ctx.fillRect(-14, -420, 28, 420); ctx.beginPath(); ctx.ellipse(0, 0, 40, 26, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  const l2 = eo(seg(T, MIX_T, MIX_T + 0.3))*(1 - seg(T, OUT_T - 0.2, OUT_T)); ctx.save(); ls(ctx, 5); text('UMRÜHREN.', 540, 1700, LAB(32), C.red, 'center', l2, 5); ctx.restore();
  if (T >= OUT_T + 0.8){ slamWord('EINE MONSTERIDEE.', fitDisp('EINE MONSTERIDEE.', 940, 110), 'center', 1660, C.red, OUT_T + 0.8, 0.035, 4); const b = eo(seg(T, OUT_T + 1.5, OUT_T + 1.9)); text('So machen wir es. Im Kleinen und im Großen.', 540, 1780 + (1-b)*16, F(700, 40), C.dark, 'center', b, -1); }
}
function audio2(add){
  add(0.2, (d,w) => tone(d, w, 'triangle', 660, 0.07, 0.5));
  ING.forEach((g, i) => { add(g.t - 0.5, (d,w) => noise(d, w, 'highpass', 5000, 0.6, 0.08, 0.03)); const tf = Math.sqrt(2*(1100 + i*80)/5200); add(g.t + tf, (d,w) => { kick(d, w, 0.8); noise(d, w, 'lowpass', 1400, 0.8, 0.35, 0.1); }); add(g.t + tf + 0.6, (d,w) => tone(d, w, 'sine', 700 + i*120, 0.06, 0.25)); });
  for (let k = 0; k < 17; k++) add(k*0.5, (d,w) => { kick(d, w, 0.4); hat(d, w, 0.06); });
  for (let i = 0; i < 22; i++) add(MIX_T + i*0.075, (d,w) => noise(d, w, 'bandpass', 1500 + (i % 2)*800, 1.5, 0.2, 0.05));
  add(OUT_T - 0.4, (d,w) => riser(d, w, 0.4, 0.3)); add(OUT_T, (d,w) => { kick(d, w, 1.3); crash(d, w); }); for (let i = 0; i < 8; i++) add(OUT_T + 0.2 + i*0.075, (d,w) => tone(d, w, 'square', 260 + rnd(i*17)*260, 0.05, 0.06, 0.004, 1600));
  for (let k = 21; k < 27; k++){ add(k*0.5, (d,w) => kick(d, w, 0.9)); add(k*0.5 + 0.25, (d,w) => hat(d, w)); if (k % 2) add(k*0.5, (d,w) => clap(d, w)); add(k*0.5 + 0.25, (d,w) => tone(d, w, 'sawtooth', [55, 65.41, 49, 73.42][k % 4]*2, 0.22, 0.2, 0.004, 650)); }
  add(OUT_T + 0.8, (d,w) => { kick(d, w, 1.2); clap(d, w); });
  add(13.2, (d,w) => kick(d, w, 1.2)); add(13.2, (d,w) => crash(d, w)); add(13.2, (d,w) => tone(d, w, 'sawtooth', 55, 0.3, 1.9, 0.01, 300));
  [220, 261.63, 329.63, 493.88].forEach(f => add(13.2, (d,w) => tone(d, w, 'triangle', f, 0.07, 1.9, 0.06)));
}

// =====================================================================
// REEL 3 · UM DIE ECKE GEDACHT. (5-s loop)
// =====================================================================
function arrow(x, y, ang, col, len = 150){ ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col; ctx.fillRect(-len, -14, len - 30, 28); ctx.beginPath(); ctx.moveTo(-40, -44); ctx.lineTo(20, 0); ctx.lineTo(-40, 44); ctx.closePath(); ctx.fill(); ctx.restore(); }
function reel3(){
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  const lt = T % 5, WALL = 760;
  ctx.fillStyle = C.dark; ctx.fillRect(WALL, 380, 70, 1100);
  // grey arrows run at the wall and bounce back
  for (let k = 0; k < 5; k++){ const y = 520 + k*230, t0 = 0.2 + k*0.18, p = clamp((lt - t0)/1.4, 0, 1); if (p <= 0) continue; const hit = p < 0.5 ? p/0.5 : 1, back = p > 0.5 ? (p - 0.5)/0.5 : 0; const x = lerp(-150, WALL - 30, hit) - back*220, sq = p > 0.5 && p < 0.62 ? 0.6 : 1; ctx.save(); ctx.translate(x, y); ctx.scale(sq, 1); arrow(0, 0, back > 0 ? Math.PI + 0.2*back : 0, '#B9B7C2'); ctx.restore(); if (p > 0.5 && p < 0.6){ ctx.fillStyle = 'rgba(32,28,37,.2)'; ctx.beginPath(); ctx.arc(WALL - 10, y, 60, 0, TAU); ctx.fill(); } }
  // the red one goes around the corner: a bezier past the wall's top
  const p = clamp((lt - 0.6)/2.6, 0, 1), P0 = [-150, 1100], P1 = [700, 1100], P2 = [740, 300], P3 = [1250, 300];
  const bz = (t, a, b, c, d) => (1-t)**3*a + 3*(1-t)**2*t*b + 3*(1-t)*t*t*c + t**3*d, u = eio(p);
  const x = bz(u, P0[0], P1[0], P2[0], P3[0]), y = bz(u, P0[1], P1[1], P2[1], P3[1]), dx = bz(Math.min(1, u + 0.01), P0[0], P1[0], P2[0], P3[0]) - x, dy = bz(Math.min(1, u + 0.01), P0[1], P1[1], P2[1], P3[1]) - y;
  if (p > 0 && p < 1){ ctx.save(); ctx.strokeStyle = 'rgba(255,66,85,.35)'; ctx.lineWidth = 10; ctx.setLineDash([24, 18]); ctx.beginPath(); for (let k = 0; k <= 40; k++){ const uu = u*k/40; const px = bz(uu, P0[0], P1[0], P2[0], P3[0]), py = bz(uu, P0[1], P1[1], P2[1], P3[1]); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); arrow(x, y, Math.atan2(dy, dx), C.red); }
  const a = eo(seg(lt, 3.0, 3.4))*(1 - seg(lt, 4.6, 4.95)); ctx.save(); ctx.globalAlpha = a; ctx.font = DISP(fitDisp('UM DIE ECKE', 900, 120)); ctx.fillStyle = C.dark; ctx.textAlign = 'center'; ctx.fillText('IMMER', 540, 1620); ctx.fillStyle = C.red; ctx.fillText('UM DIE ECKE', 540, 1750); ctx.fillStyle = C.dark; ctx.font = F(700, 48); ctx.fillText('gedacht.', 540, 1830); ctx.restore();
}
function audio3(add){ for (let k = 0; k < 5; k++) add(0.2 + k*0.18 + 0.7, (d,w) => noise(d, w, 'lowpass', 1200, 0.8, 0.25, 0.08)); add(0.6, (d,w) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(300, w); o.frequency.exponentialRampToValueAtTime(900, w + 2.4); env(g, w, 0.07, 2.4, 0.2); o.connect(g); g.connect(d); o.start(w); o.stop(w + 2.6); }); add(3.0, (d,w) => { kick(d, w, 1.1); clap(d, w); }); for (let k = 0; k < 10; k++){ add(k*0.5, (d,w) => kick(d, w, 0.5)); add(k*0.5 + 0.25, (d,w) => hat(d, w, 0.1)); } }

// ---------- the set ----------
const REELS = [
  { id:'tag',    name:'Jeder Tag',     tech:'Stempel-Uhr',    dur:15, render:reel1, audio:audio1, hud:'HELDENTATEN', hudColor:() => C.dark, file:'horst-heldentaten', still:8.0,
    desc:'Eine Uhr springt durch den Tag: 06:30, 08:05, 09:15 … Bei jeder Zeit <b>knallt ein Stempel</b> mit einer kleinen Heldentat. Am Ende landet der echte Stempel „Thatendrang und Heldenthaten · seit 2004“ auf allem. „Jeder Tag braucht Heldentaten.“' },
  { id:'rezept', name:'Das Rezept',    tech:'Zutaten + Schüssel', dur:15, render:reel2, audio:audio2, hud:'REZEPT', hudColor:() => C.dark, file:'horst-rezept', still:7.0,
    desc:'Rezept für Heldentaten: 1 Kopf voller Ideale, 1 Prise Mut, 1 satte Portion Einsatz, fester Glaube an Erfolg. Alles <b>fällt in die Schüssel</b>, wird umgerührt, und raus kommt eine Monsteridee. „So machen wir es. Im Kleinen und im Großen.“' },
  { id:'ecke',   name:'Um die Ecke',   tech:'Loop 5 s',       dur:5,  render:reel3, audio:audio3, hud:'LOOP', hudColor:() => C.dark, file:'horst-um-die-ecke', still:2.4,
    desc:'Graue Pfeile rennen gegen die Wand und prallen ab. Der rote <b>biegt um die Ecke</b>. „Immer um die Ecke gedacht.“ Fünf Sekunden, als Loop.' },
];
