// ---------- Website-Showreel: the studio-horst.de story in 12 bars at 90 BPM, every cut on the beat ----------
// Material from VON-THATEN/website: hero-slider (references), forest background (clean layer of fog-cover-the-forest.psd), client logos, HORST video
const BPM = 90, BEAT = 60/BPM, BAR = 4*BEAT, bt = n => n*BEAT;
const REFS = Array.from({ length:16 }, (_, i) => `r${String(i + 1).padStart(2, '0')}.jpg`);
const LOGOS = Array.from({ length:15 }, (_, i) => `l${String(i + 1).padStart(2, '0')}.png`);
const CLIPS = [{ k:'v-jacob', name:'JACOB Messtechnik' }, { k:'v-gh', name:'green hornets' }, { k:'v-riva', name:'Riva' }, { k:'v-goth', name:'GOTH' }];
const FILMS = [{ k:'v-evofilm', name:'FILM · EVOMOTIV', at:0.4 }, { k:'v-wett', name:'FILM · WETTERAUER IMMOBILIEN', at:0.2 }];
const MEDIA = ['wald.jpg', 'v-monster', 'v-prozess', ...CLIPS.map(c => c.k), ...FILMS.map(f => f.k), ...REFS, ...LOGOS];
const LEIST = ['Branding & Markenauftritt', 'Logo & Markenzeichen', 'Visuelle Systeme', 'Kampagnen & Leitmotive'];
const LEIST_BIG = ['BRANDING', 'LOGOS', 'SYSTEME', 'KAMPAGNEN'];

function wald(cx, cy, zoom, dark){
  const el = M['wald.jpg']; bg(C.dark); if (!ready(el)) return;
  const [iw, ih] = dims(el), s = Math.max(W/iw, H/ih)*zoom, dw = iw*s, dh = ih*s;
  ctx.drawImage(el, clamp(W/2 - cx*dw, W - dw, 0), clamp(H/2 - cy*dh, H - dh, 0), dw, dh);
  if (dark){ ctx.fillStyle = `rgba(32,28,37,${dark})`; ctx.fillRect(0, 0, W, H); }
}
function monster(at){
  bg('#2B2621'); const el = M['v-monster']; if (!ready(el)) return;
  const [iw, ih] = dims(el), h = 1240, w = iw*h/ih, x = (W - w)/2, y = 640;
  ctx.drawImage(el, x, y, w, h);
  const g = ctx.createLinearGradient(0, y - 1, 0, y + 220); g.addColorStop(0, 'rgba(43,38,33,1)'); g.addColorStop(1, 'rgba(43,38,33,0)');
  ctx.fillStyle = g; ctx.fillRect(0, y - 1, W, 221);
}
function bubble(lines_, cx, y, p){
  if (p <= 0) return;
  const f = F(800, 72), lh = 84; ctx.save(); ctx.font = f; const w = Math.max(...lines_.map(s => ctx.measureText(s).width)) + 100; ctx.restore();
  const h = lines_.length*lh + 70, s = eback(p);
  ctx.save(); ctx.translate(cx, y + h); ctx.scale(s, s); ctx.translate(-cx, -(y + h));
  ctx.fillStyle = C.white; rrect(ctx, cx - w/2, y, w, h, 40); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - 30, y + h - 2); ctx.lineTo(cx + 40, y + h - 2); ctx.lineTo(cx + 10, y + h + 60); ctx.closePath(); ctx.fill();
  lines_.forEach((s_, i) => text(s_, cx, y + 92 + i*lh, f, i === lines_.length - 1 ? C.red : C.dark, 'center', 1, -2));
  ctx.restore();
}
// kinetic line: words snap up out of a mask on tIn, leave upwards on tOut
function kline(str, font, x, y, color, tIn, tOut, accent = []){
  ctx.save(); ctx.font = font; ls(ctx, -2); const size = parseInt(font.match(/(\d+)px/)[1]);
  ctx.beginPath(); ctx.rect(0, y - size*1.0, W, size*1.3); ctx.clip();
  let x0 = x; const sp = ctx.measureText(' ').width;
  str.split(' ').forEach((w, j) => {
    const pin = eo(seg(T, tIn + j*0.04, tIn + j*0.04 + 0.22)), pout = tOut == null ? 0 : ein(seg(T, tOut + j*0.02, tOut + j*0.02 + 0.16));
    ctx.fillStyle = accent.includes(j) ? C.red : color;
    ctx.fillText(w, x0, y + (1 - pin)*size*1.2 - pout*size*1.2);
    x0 += ctx.measureText(w).width + sp;
  });
  ctx.restore();
}
function marquee(word, y, size, speed, alpha, outline){
  ctx.save(); ctx.font = DISP(size); const w = ctx.measureText(word + '  ').width; let x = -((T*speed) % w + w) % w - w*0.0;
  ctx.globalAlpha = alpha; ctx.fillStyle = C.white; ctx.strokeStyle = C.white; ctx.lineWidth = 3;
  for (; x < W; x += w) outline ? ctx.strokeText(word, x, y) : ctx.fillText(word, x, y);
  ctx.restore();
}
const punch = (n0, n1, k = 0.04) => { // tiny zoom kick on every snare (beats 2 and 4) inside [n0, n1)
  let z = 1; for (let n = n0 + 1; n < n1; n += 2) z += k*(1 - eo(seg(T, bt(n), bt(n) + 0.25)))*(T >= bt(n) ? 1 : 0); return z;
};

function vWeb(){
  const b = T/BEAT;
  // bar 1 · Irgendwo im Schwarzwald
  if (b < 4){
    wald(lerp(0.30, 0.42, T/BAR), 0.5, lerp(1.12, 1.05, T/BAR), 0.25);
    kline('Irgendwo im', F(800, 96), 62, 820, C.white, bt(0.5), null);
    kline('Schwarzwald …', F(800, 96), 62, 930, C.white, bt(1.5), null);
    ctx.save(); ls(ctx, 5); text('47,96° N · 7,95° E · KIRCHZARTEN', 62, 1020, LAB(26), C.red, 'left', eo(seg(T, bt(2.5), bt(3))), 5); ctx.restore();
    return;
  }
  // bar 2 · drop: Salli, ich bin HORST
  if (b < 8){
    monster(0);
    const size = fitDisp('SALLI.', 700, 230);
    if (b < 6) slamWord('SALLI.', size, 'center', 470, C.white, bt(4), 0.05, 3);
    else { const s2 = fitDisp('ICH BIN', 700, 170); slamWord('ICH BIN', s2, 'center', 330, C.white, bt(6), 0.04, 13); slamWord('HORST.', s2*1.15, 'center', 330 + s2*1.15, C.red, bt(6.5), 0.05, 23); }
    const fl = 1 - seg(T, bt(4), bt(4) + 0.15); if (fl > 0){ ctx.fillStyle = `rgba(255,66,85,${fl})`; ctx.fillRect(0, 0, W, H); }
    return;
  }
  // bar 3 · die ehrliche Einordnung (website copy)
  if (b < 12){
    wald(lerp(0.62, 0.7, (T - bt(8))/BAR), 0.62, 1.45*punch(8, 12, 0.03), 0.62);
    const f = F(800, 100), Q = [['Wo steht deine', 'Marke heute?'], ['Was hält', 'sie zurück?'], ['Was soll sich', 'verändern?']];
    Q.forEach((q, i) => { const tIn = bt(8 + i), tOut = bt(9 + i) - 0.12; if (T < tIn - 0.05 || T > tOut + 0.3) return;
      kline(q[0], f, 62, 840, C.white, tIn, tOut); kline(q[1], f, 62, 956, C.white, tIn + 0.06, tOut, [q[1].split(' ').length - 1]); });
    if (b >= 11){ const p = eback(seg(T, bt(11), bt(11) + 0.3)); ctx.save(); ctx.translate(540, 960); ctx.scale(p, p); text('?', 0, 160, DISP(520), C.red, 'center', 1, 0); ctx.restore(); }
    return;
  }
  // bar 4 · Monsteridee
  if (b < 16){
    bg(C.red);
    kline('Daraus entsteht die', F(700, 70), 62, 700, C.dark, bt(12), null);
    const size = fitDisp('MONSTER-', 960, 260), z = punch(12, 16, 0.05);
    ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960);
    slamWord('MONSTER-', size, 62, 940, C.white, bt(13), 0.05, 7);
    slamWord('IDEE.', size, 62, 940 + size*1.02, C.dark, bt(14), 0.06, 27);
    ctx.restore();
    ctx.save(); ls(ctx, 5); text('UND AUS IHR ALLES WEITERE.', 62, 1500, LAB(28), C.white, 'left', eo(seg(T, bt(15), bt(15.5))), 5); ctx.restore();
    return;
  }
  // bars 5–8 · Referenzen: one per beat, Leistungen marquee behind
  if (b < 32){
    const n = Math.floor(b - 16), t0 = bt(16 + n), k = Math.floor(n/4);
    wald(0.2 + n*0.04, 0.35 + (n % 4)*0.08, 1.6, 0.78);
    marquee(LEIST_BIG[k], 470, 260, 260, 0.14, true);
    marquee(LEIST_BIG[k], 1560, 260, -200, 0.1, false);
    const el = M[REFS[n]], dir = n % 2 ? 1 : -1, p = eo(seg(T, t0, t0 + 0.14)), z = lerp(1.0, 1.04, seg(T, t0, t0 + BEAT));
    const cw = 980*z, ch = 612*z, rot = dir*0.025;
    ctx.save(); ctx.translate(540 + (1 - p)*dir*-900, 960); ctx.rotate(rot*(0.5 + 0.5*p));
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
    ctx.fillStyle = C.white; ctx.fillRect(-cw/2 - 10, -ch/2 - 10, cw + 20, ch + 20); ctx.shadowColor = 'transparent';
    if (ready(el)) drawCover(el, -cw/2, -ch/2, cw, ch);
    ctx.restore();
    if (n % 4 === 0 || n % 4 === 1 || n % 4 === 2 || n % 4 === 3){
      kline(LEIST[k], F(800, 58), 62, 1380, C.white, bt(16 + k*4), bt(20 + k*4) - 0.1);
    }
    ctx.save(); ls(ctx, 5); text(`REFERENZ ${String(n + 1).padStart(2, '0')} / 16`, 62, 1440, LAB(24), C.red, 'left', 1, 5); ctx.restore();
    return;
  }
  // bar 9 · Prozess: screen recording, green hornets logo in 12× time-lapse
  if (b < 36){
    wald(0.5, 0.3, 1.5, 0.8);
    kline('Vom ersten Punkt', F(800, 92), 62, 560, C.white, bt(32), null);
    kline('zum Zeichen.', F(800, 92), 62, 668, C.white, bt(32.5), null, [1]);
    const el = M['v-prozess'], w = 1000, h = 646, x = 40, y = 820, p = eo(seg(T, bt(32), bt(32) + 0.3));
    ctx.save(); ctx.translate(0, (1 - p)*300); ctx.globalAlpha = p;
    ctx.fillStyle = '#111014'; rrect(ctx, x - 18, y - 18, w + 36, h + 36, 22); ctx.fill();
    if (ready(el)) drawCover(el, x, y, w, h);
    ctx.fillStyle = '#111014'; ctx.fillRect(470, y + h + 18, 140, 60); rrect(ctx, 380, y + h + 74, 320, 16, 8); ctx.fill();
    ctx.restore();
    ctx.save(); ls(ctx, 5); text('BILDSCHIRMAUFNAHME · GREEN HORNETS · 12× SCHNELLER', 540, 1640, LAB(22), C.red, 'center', eo(seg(T, bt(33), bt(33.5))), 5); ctx.restore();
    return;
  }
  // bars 10–11 · Logos in Bewegung: one animation every two beats
  if (b < 44){
    const i = Math.floor((b - 36)/2), c = CLIPS[i], t0 = bt(36 + i*2);
    bg(C.white); const el = M[c.k]; if (ready(el)) drawContain(el, 0, 285, W, 1350);
    ctx.save(); ls(ctx, 6); text('LOGOS IN BEWEGUNG', 540, 1690, LAB(26), C.red, 'center', 1, 6); ctx.restore();
    kline(c.name, F(800, 62), 540 - (() => { ctx.save(); ctx.font = F(800, 62); ls(ctx, -2); const w = ctx.measureText(c.name).width; ctx.restore(); return w/2; })(), 1772, C.dark, t0 + 0.1, null);
    const wp = eio(seg(T, t0, t0 + 0.16)); if (wp < 1){ ctx.fillStyle = C.red; ctx.fillRect(0, 0, W, H*(1 - wp)); }
    return true;
  }
  // bar 12 · Film: EVOMOTIV and Wetterauer, two beats each
  if (b < 48){
    const i = b < 46 ? 0 : 1, f = FILMS[i], t0 = bt(44 + i*2);
    wald(0.3 + i*0.3, 0.5, 1.4, 0.82);
    kline('Marken, die sich bewegen.', F(800, 70), 62, 330, C.white, bt(44), null, [3]);
    const el = M[f.k], z = lerp(1.06, 1.0, eo(seg(T, t0, t0 + 2*BEAT)));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 420, W, W); ctx.clip(); if (ready(el)) drawCover(el, 0, 420, W, W, z); ctx.restore();
    ctx.save(); ls(ctx, 5); text(f.name, 62, 1590, LAB(26), C.red, 'left', 1, 5); ctx.restore();
    const wp = eio(seg(T, t0, t0 + 0.16)); if (wp < 1){ ctx.fillStyle = C.red; ctx.fillRect(W*wp, 420, W*(1 - wp), W); }
    return;
  }
  // bar 13 · breakdown: Werkzeuge vs. Idee
  if (b < 52){
    wald(lerp(0.55, 0.45, (T - bt(48))/BAR), 0.45, lerp(1.25, 1.35, (T - bt(48))/BAR), 0.55);
    const f = F(800, 96);
    kline('Die Werkzeuge', f, 62, 760, C.white, bt(48), bt(50) - 0.15);
    kline('sind zweitrangig.', f, 62, 870, C.white, bt(48.5), bt(50) - 0.15);
    kline('Entscheidend ist', f, 62, 760, C.white, bt(50), null);
    kline('die Idee dahinter.', f, 62, 870, C.white, bt(50.5), null, [1]);
    ctx.save(); ls(ctx, 5); text('ANALOG · DIGITAL · KI', 62, 960, LAB(26), C.red, 'left', eo(seg(T, bt(51), bt(51.5))), 5); ctx.restore();
    return;
  }
  // bar 14 · Markenidentitäten: logos pop on 16ths
  if (b < 56){
    bg(C.dark); sig(C.white, 99);
    ctx.save(); ls(ctx, 6); text('AUSGEWÄHLTE MARKENIDENTITÄTEN', 540, 520, LAB(28), C.red, 'center', eo(seg(T, bt(52), bt(52.5))), 6); ctx.restore();
    LOGOS.forEach((k, i) => {
      const t0 = bt(52) + i*BEAT/4, p = eback(seg(T, t0, t0 + 0.2)); if (p <= 0) return;
      const el = M[k], c = i % 3, r = Math.floor(i/3), cx = 220 + c*320, cy = 700 + r*190;
      if (!ready(el)) return; ctx.save(); ctx.translate(cx, cy); ctx.scale(p, p); drawContain(el, -130, -70, 260, 140); ctx.restore();
    });
    return;
  }
  // bar 15 · HORST asks
  if (b < 60){
    monster(0);
    bubble(b < 58 ? ['Und', 'deine Marke?'] : ['Lass uns', 'drüber reden.'], 540, 300, seg(T, bt(b < 58 ? 56 : 58), bt(b < 58 ? 56 : 58) + 0.3));
    pill('Monsterideen® für mutige Marken.', 540, 1560, C.red, C.white, eo(seg(T, bt(59), bt(59.5))));
    return;
  }
  // bar 16 · Abspann
  endcard(bt(60));
  ctx.save(); ls(ctx, 4); text('HAUPTSTR. 24 · 79199 KIRCHZARTEN', 540, 1650, LAB(26), C.white, 'center', 0.7*eo(seg(T, bt(62), bt(62.5))), 4); ctx.restore();
}

// laid-back boom-bap: swung hats, late snare, Rhodes-ish chords, vinyl crackle
function hiphop(add){
  const swing = BEAT*0.09, late = 0.018;
  const CH = [[220, 261.63, 329.63, 392, 493.88], [174.61, 220, 261.63, 329.63], [146.83, 174.61, 220, 261.63, 329.63], [164.81, 196, 246.94, 293.66]];
  const ROOT = [55, 43.65, 73.42, 41.2];
  const snare = (d, w) => { noise(d, w, 'bandpass', 1900, 0.7, 0.42, 0.2); tone(d, w, 'triangle', 190, 0.28, 0.09); };
  const BRK = 12, LAST = 15;
  for (let bar = 0; bar < 16; bar++){
    const t0 = bar*BAR, c = CH[bar % 4], drums = bar >= 1 && bar !== BRK && bar !== LAST, lp = bar === 0 ? 520 : bar === BRK ? 900 : 1500;
    c.forEach(f => { add(t0, (d,w) => tone(d, w, 'triangle', f, 0.055, BAR*0.95, 0.03, lp)); add(t0, (d,w) => tone(d, w, 'sine', f*2, 0.02, BAR*0.6, 0.03)); });
    if (bar !== 0) c.slice(1).forEach(f => add(t0 + bt(2.5), (d,w) => tone(d, w, 'triangle', f, 0.035, 0.35, 0.01, lp)));
    if (bar >= 1 && bar !== BRK){ add(t0, (d,w) => tone(d, w, 'triangle', ROOT[bar % 4], 0.5, 0.9, 0.01, 280)); add(t0 + bt(2.25), (d,w) => tone(d, w, 'triangle', ROOT[bar % 4], 0.38, 0.5, 0.01, 280)); }
    if (drums){
      [0, 1.75, 2.25].forEach(x => add(t0 + bt(x), (d,w) => kick(d, w, x ? 0.75 : 1.0)));
      [1, 3].forEach(x => add(t0 + bt(x) + late, snare));
    }
    if (bar >= 1 && bar !== LAST) for (let e = 0; e < 8; e++){
      const tt = t0 + bt(e/2) + (e % 2 ? swing : 0); add(tt, (d,w) => noise(d, w, 'highpass', 8500, 0.7, e % 2 ? 0.07 : 0.12, bar === BRK ? 0.03 : 0.04));
    }
    if (bar >= 4 && bar <= 11 && bar % 2) add(t0 + bt(3.5) + swing, (d,w) => noise(d, w, 'highpass', 7000, 0.6, 0.09, 0.28));
  }
  add(bt(15), (d,w) => riser(d, w, BEAT, 0.22));
  add(bt(60), (d,w) => kick(d, w, 1.1)); add(bt(60), (d,w) => crash(d, w));
  [36, 38, 40, 42, 44, 46].forEach(n => add(bt(n), (d,w) => noise(d, w, 'bandpass', 2600, 1.1, 0.22, 0.05)));
  for (let i = 0; i < 260; i++){ const tt = rnd(i*4.7)*16*BAR; add(tt, (d,w) => noise(d, w, 'highpass', 2500 + rnd(i)*3000, 0.5, 0.02 + rnd(i*2.3)*0.06, 0.008)); }
}

const VARIANTS = [
  { slug:'showreel', name:'Showreel', dur:Math.round(16*BAR*100)/100, end:bt(60), draw:vWeb, sound:hiphop, hits:[],
    video:() => { const b = T/BEAT;
      if (b >= 4 && b < 8) return { k:'v-monster', at:0.6 + (T - bt(4)) };
      if (b >= 32 && b < 36) return { k:'v-prozess', at:T - bt(32) };
      if (b >= 36 && b < 44){ const i = Math.floor((b - 36)/2); return { k:CLIPS[i].k, at:1.3 + (T - bt(36 + i*2)) }; }
      if (b >= 44 && b < 48){ const i = b < 46 ? 0 : 1; return { k:FILMS[i].k, at:FILMS[i].at + (T - bt(44 + i*2)) }; }
      if (b >= 56 && b < 60) return { k:'v-monster', at:2.6 + (T - bt(56)) };
      if (b < 32) return { pre:{ k:'v-prozess', at:0 } };
      if (b < 44){ const i = Math.min(3, Math.floor((b - 36)/2) + 1); return { pre:{ k:b < 36 ? CLIPS[0].k : CLIPS[i].k, at:1.3 } }; }
      return { pre:{ k:'v-monster', at:2.6 } }; } },
];
