// ---------- Statements: six themes, each 12 s, texts from content-pool/01-ideen-haltung/statements ----------
const M = {};
function loadImg(key, src){ return new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; M[key] = i; }); }
const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const mediaP = Promise.race([loadImg('logo', svgURL(SVG_LOGO_W)), new Promise(r => setTimeout(r, 8000))]).then(() => { dirty = true; });
const ready = el => el && el.complete && el.naturalWidth > 0;
function syncVideos(){}
const GREY = '#3A3540';
function bg(c){ ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); }
function sig(color, t0 = 0){ drawSignet(540, 300, 120, color, seg(T, t0, t0 + 0.8)); }
function lines(arr, font, color, x, y, lh, tIn, step, align = 'left'){
  arr.forEach((s, i) => { const a = eo(seg(T, tIn + i*step, tIn + i*step + 0.3)); text(s, x, y + i*lh + (1 - a)*30, font, color, align, a, -2); });
}
// shared end card: red curtain lifts, logo wipes in, claim, URL
function endcard(t0, l1 = 'Monsterideen® für', l2 = 'mutige Marken.'){
  bg(C.dark);
  const lg = M.logo;
  if (ready(lg)){
    const lw = 860, lh = lw*lg.naturalHeight/lg.naturalWidth, x0 = 540 - lw/2, y0 = 780 - lh/2, wp = eio(seg(T, t0 + 0.15, t0 + 0.7));
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0 - 10, lw*wp, lh + 20); ctx.clip(); ctx.drawImage(lg, x0, y0, lw, lh); ctx.restore();
    if (wp > 0 && wp < 1){ ctx.fillStyle = C.red; ctx.fillRect(x0 + lw*wp, y0 - 20, 26, lh + 40); }
  }
  const a = eo(seg(T, t0 + 0.6, t0 + 0.95));
  text(l1, 540, 1110 + (1-a)*24, F(700, 76), C.white, 'center', a, -2);
  text(l2, 540, 1200 + (1-a)*24, F(700, 76), C.white, 'center', a, -2);
  pill('studio-horst.de', 540, 1360, C.red, C.white, eo(seg(T, t0 + 0.9, t0 + 1.25)));
  ctx.save(); ls(ctx, 4); text('SALLI@STUDIO-HORST.DE', 540, 1590, LAB(30), C.white, 'center', eo(seg(T, t0 + 1.1, t0 + 1.4))*0.9, 4); ctx.restore();
  const cp = eio(seg(T, t0, t0 + 0.45));
  if (cp < 1){ ctx.fillStyle = C.red; ctx.fillRect(0, -H*cp, W, H); }
}

// 01 Sichtbarkeit — a spotlight finds the substance that was there all along
function vSicht(){
  if (T < 4.6){
    bg(C.dark); sig(C.white);
    const f = F(800, 112), list = layoutWords('Viele Unternehmen hier haben Substanz.', f, 940, 128, 62, 760);
    ctx.save(); ctx.font = f; ls(ctx, -2); ctx.fillStyle = '#2B2631'; list.forEach(o => ctx.fillText(o.w, o.x, o.y)); ctx.restore();
    const p = seg(T, 0.5, 3.5), cx = 540 + Math.cos(p*TAU*1.25 + Math.PI)*400, cy = lerp(690, 1010, eio(p));
    const R = lerp(230, 1500, eio(seg(T, 3.5, 4.2)));
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.font = f; ls(ctx, -2); list.forEach((o, j) => { ctx.fillStyle = j === 4 ? C.red : C.white; ctx.fillText(o.w, o.x, o.y); });
    ctx.restore();
    ctx.save(); ls(ctx, 6); text('SICHTBARKEIT', 540, 1400, LAB(30), C.red, 'center', eo(seg(T, 3.9, 4.2)), 6); ctx.restore();
    return;
  }
  if (T < 7.6){
    bg(C.dark); sig(C.white);
    const f = F(800, 128), list = layoutWords('Sie zeigen sie nur nicht.', f, 940, 144, 62, 820);
    wordsIn(list, f, C.white, 4.7, 0.22, [4]);
    const n = list[4]; if (n){ ctx.save(); ctx.font = f; const w = ctx.measureText(n.w).width; ctx.restore();
      ctx.fillStyle = C.red; ctx.fillRect(n.x, n.y + 30, w*eio(seg(T, 6.0, 6.5)), 14); }
    return;
  }
  if (T < 10){
    bg(C.red); sig(C.white, 99);
    lines(['Wer hier verwurzelt ist,', 'darf auch'], F(700, 72), C.dark, 540, 640, 88, 7.6, 0.15, 'center');
    const size = fitDisp('SICHTBAR', 960, 270);
    slamWord('SICHTBAR', size, 'center', 1020, C.white, 7.95, 0.06, 3);
    slamWord('WACHSEN.', size, 'center', 1020 + size*1.05, C.dark, 8.55, 0.06, 40);
    return;
  }
  endcard(10);
}

// 02 Bekanntheit — thirty tidy look-alikes, one dares to be red
const GRID = { cols:6, rows:5, cell:120, gap:24, x0:120, y0:1000, hero:15 };
function cellRect(i){ const c = i % GRID.cols, r = Math.floor(i/GRID.cols); return [GRID.x0 + c*(GRID.cell + GRID.gap), GRID.y0 + r*(GRID.cell + GRID.gap), GRID.cell, GRID.cell]; }
function vBekannt(){
  if (T < 6.9){
    bg(C.light); sig(C.dark);
    const f = F(800, 96);
    if (T < 3.5){
      const a = 1 - seg(T, 3.2, 3.45);
      ctx.save(); ctx.globalAlpha = a; wordsIn(layoutWords('Viele Marken sehen ordentlich aus.', f, 940, 110, 62, 600), f, C.dark, 0.4, 0.18, []); ctx.restore();
    } else wordsIn(layoutWords('Aber fühlen sie sich nach etwas an?', f, 940, 110, 62, 600), f, C.dark, 3.5, 0.18, [5]);
    for (let i = 0; i < GRID.cols*GRID.rows; i++){
      const p = eback(seg(T, 0.5 + i*0.035, 0.85 + i*0.035)); if (p <= 0) continue;
      let [x, y, w, h] = cellRect(i);
      const hero = i === GRID.hero, grow = hero ? eio(seg(T, 6.1, 6.9)) : 0;
      if (hero && grow > 0){ x = lerp(x, 0, grow); y = lerp(y, 0, grow); w = lerp(w, W, grow); h = lerp(h, H, grow); }
      ctx.save(); ctx.translate(x + w/2, y + h/2); ctx.scale(p, p);
      ctx.fillStyle = hero && T > 5.6 ? C.red : '#DCDADF'; rrect(ctx, -w/2, -h/2, w, h, lerp(18, 0, grow)); ctx.fill();
      if (!(hero && T > 5.6)){ ctx.fillStyle = '#C3C0C8'; ctx.beginPath(); ctx.arc(-w*0.18, -h*0.08, w*0.16, 0, TAU); ctx.fill(); ctx.fillRect(-w*0.34, h*0.18, w*0.68, h*0.08); }
      ctx.restore();
    }
    if (T > 5.6 && T < 6.1){ const [x, y, w] = cellRect(GRID.hero); const k = eo(seg(T, 5.6, 6.0));
      ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.globalAlpha = 1 - k; ctx.strokeRect(x - 30*k, y - 30*k, w + 60*k, w + 60*k); ctx.restore(); }
    return !(T > 6.5);
  }
  if (T < 10){
    bg(C.red); sig(C.white, 99);
    lines(['Nicht austauschbar.', 'Nicht beliebig.'], F(800, 96), C.white, 62, 640, 116, 6.95, 0.45);
    lines(['Sondern mit erkennbarem'], F(700, 66), C.dark, 62, 1000, 0, 7.9, 0);
    slamWord('CHARAKTER.', fitDisp('CHARAKTER.', 960, 240), 62, 1230, C.white, 8.2, 0.06, 9);
    return;
  }
  endcard(10);
}

// 03 Mut — loud first, then clear
const LOUD = ['MUT', 'HEISST', 'NICHT', 'LAUT', 'SEIN.'];
function vMut(){
  if (T < 2.8){
    const k = clamp(Math.floor(T/0.5), 0, 4), b = k % 2 ? C.red : C.dark;
    bg(b); const w = LOUD[k], size = fitDisp(w, 980, 400), st = k*0.5, sc = lerp(1.6, 1, eo(seg(T, st, st + 0.12)));
    const sh = T - st < 0.25 ? (rnd(Math.floor(T*60)) - .5)*28 : 0;
    ctx.save(); ctx.font = DISP(size); const tw = ctx.measureText(w).width;
    ctx.translate(W/2 + sh, 1000 + sh*0.6); ctx.scale(sc, sc); ctx.fillStyle = k % 2 ? C.dark : C.white; ctx.fillText(w, -tw/2, size*0.36); ctx.restore();
    return;
  }
  if (T < 4.0){
    bg(C.dark); sig(C.white, 99);
    const f = F(800, 100); ctx.save(); ctx.globalAlpha = 1 - seg(T, 3.6, 3.95);
    text('Mut heißt', 540, 900, f, C.white, 'center', 1, -2); text('nicht laut sein.', 540, 1020, f, C.white, 'center', 1, -2);
    ctx.fillStyle = C.red; ctx.fillRect(540 - 380, 985, 760*eio(seg(T, 3.0, 3.35)), 16);
    ctx.restore(); return;
  }
  if (T < 7.2){
    bg(C.light); sig(C.dark, 4.0);
    const f = F(800, 132);
    const a1 = eo(seg(T, 4.25, 4.6)), a2 = eo(seg(T, 4.55, 4.9));
    text('Mut heißt', 540, 900 + (1-a1)*30, f, C.dark, 'center', a1, -3);
    ctx.save(); ctx.font = f; ls(ctx, -3); const wk = ctx.measureText('klar '), ws = ctx.measureText('sein.'); ctx.restore();
    const x0 = 540 - (wk.width + ws.width)/2;
    text('klar', x0, 1050 + (1-a2)*30, f, C.red, 'left', a2, -3);
    text('sein.', x0 + wk.width, 1050 + (1-a2)*30, f, C.dark, 'left', a2, -3);
    ctx.fillStyle = C.red; ctx.fillRect(x0, 1085, (wk.width - 30)*eio(seg(T, 5.4, 5.9)), 12);
    return true;
  }
  if (T < 10){
    bg(C.dark); sig(C.white, 7.2);
    const f = F(800, 100), list = layoutWords('Der Schwarzwald kann mehr als', f, 940, 116, 62, 760);
    wordsIn(list, f, C.white, 7.3, 0.16, [1]);
    const a = eo(seg(T, 8.3, 8.6));
    text('„ordentlich“.', 62, 760 + 2*116 + 20 + (1-a)*30, F(800, 124), GREY, 'left', a, -3);
    ctx.save(); ctx.font = F(800, 124); ls(ctx, -3); const w = ctx.measureText('„ordentlich“.').width; ctx.restore();
    ctx.fillStyle = C.red; ctx.fillRect(56, 760 + 2*116 - 20, (w + 12)*eio(seg(T, 9.0, 9.35)), 14);
    return;
  }
  endcard(10);
}

// 04 Design — a construction grid; the signet gets built on it
function grid(a){
  ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 2;
  for (let i = 0; i <= 6; i++){ const p = eio(seg(T, 0.1 + i*0.06, 0.9 + i*0.06)); const x = 62 + i*(W - 124)/6;
    ctx.globalAlpha = 0.12*a; ctx.beginPath(); ctx.moveTo(x, 200); ctx.lineTo(x, 200 + (H - 320)*p); ctx.stroke(); }
  for (let j = 0; j <= 13; j++){ const p = eio(seg(T, 0.3 + j*0.04, 1.1 + j*0.04)); const y = 240 + j*120;
    ctx.globalAlpha = 0.12*a; ctx.beginPath(); ctx.moveTo(62, y); ctx.lineTo(62 + (W - 124)*p, y); ctx.stroke(); }
  ctx.restore();
}
function cross(x, y, a){ ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.red; ctx.fillRect(x - 14, y - 2, 28, 4); ctx.fillRect(x - 2, y - 14, 4, 28); ctx.restore(); }
function vDesign(){
  if (T < 10){
    bg(C.dark); grid(1 - 0.5*seg(T, 8.3, 8.6));
    if (T < 5.2){
      sig(C.white, 0.3);
      const a = 1 - seg(T, 4.9, 5.15);
      ctx.save(); ctx.globalAlpha = a;
      lines(['Gestaltung ist', 'kein Selbstzweck.'], F(800, 112), C.white, 62, 840, 120, 1.4, 0.35);
      cross(62, 720, eo(seg(T, 2.2, 2.4))); cross(62 + 5*(W - 124)/6, 960, eo(seg(T, 2.35, 2.55)));
      ctx.save(); ls(ctx, 4); text('KEINE DEKO', 62, 1140, LAB(26), C.red, 'left', eo(seg(T, 2.8, 3.1)), 4); ctx.restore();
      ctx.restore(); return;
    }
    if (T < 8.4){
      sig(C.white);
      const f = F(800, 104), list = layoutWords('Sie ist das sichtbare Ergebnis einer klaren Idee.', f, 940, 120, 62, 720);
      wordsIn(list, f, C.white, 5.3, 0.17, [7]);
      return;
    }
    const p = seg(T, 8.4, 9.6), s = 520, x0 = 540 - s/2, y0 = 980 - 183.3*s/184.7/2, h = 183.3*s/184.7;
    ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.setLineDash([14, 10]); ctx.globalAlpha = eo(seg(T, 8.4, 8.7));
    ctx.strokeRect(x0 - 30, y0 - 30, s + 60, h + 60); ctx.restore();
    drawSignet(540, 980, s, C.white, p);
    ctx.save(); ls(ctx, 3); const la = eo(seg(T, 8.6, 8.9));
    text('184,7', 540, y0 - 56, LAB(26), C.red, 'center', la, 3); text('183,3', x0 + s + 60, 990, LAB(26), C.red, 'left', la, 3); ctx.restore();
    lines(['Erst denken. Dann gestalten.'], F(700, 60), C.white, 540, 1460, 0, 9.0, 0, 'center');
    return;
  }
  endcard(10);
}

// 05 Kreativität — a scribble straightens into a method
const SCRIB = (() => { const pts = []; let x = 140, y = 1250, a = 0;
  for (let i = 0; i < 260; i++){ a += (rnd(i*3.1) - .5)*1.6; x = clamp(x + Math.cos(a)*34, 100, 980); y = clamp(y + Math.sin(a)*34, 900, 1650); pts.push([x, y]); }
  return pts; })();
function vKreativ(){
  if (T < 4.6){
    bg(C.dark); sig(C.white);
    const f = F(800, 96), list = layoutWords('Eine Monsteridee entsteht nicht aus dem Bauch.', f, 940, 110, 62, 520);
    wordsIn(list, f, C.white, 0.3, 0.16, [3]);
    const n = Math.floor(SCRIB.length*seg(T, 0.8, 3.3)), m = eio(seg(T, 3.6, 4.4));
    if (n > 1){
      ctx.save(); ctx.strokeStyle = m > 0.5 ? C.red : C.white; ctx.lineWidth = lerp(9, 14, m); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let i = 0; i < n; i++){ const [px, py] = SCRIB[i]; const tx = 100 + i/(SCRIB.length - 1)*880, ty = 1250;
        const x = lerp(px, tx, m), y = lerp(py, ty, m); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.restore();
    }
    return;
  }
  if (T < 8.4){
    bg(C.dark); sig(C.white);
    lines(['Sondern aus'], F(700, 70), C.white, 62, 600, 0, 4.6, 0);
    [['VERSTEHEN,', C.white, C.dark], ['EINORDNEN,', C.white, C.dark], ['ZUSPITZEN.', C.red, C.white]].forEach(([w, b, fg], i) => {
      const t0 = 5.0 + i*0.7, y = 700 + i*230, p = eio(seg(T, t0, t0 + 0.3)), bw = 956;
      if (p <= 0) return;
      ctx.fillStyle = b; ctx.beginPath(); ctx.moveTo(62, y); ctx.lineTo(62 + bw*p - (i === 2 ? 0 : 0), y);
      if (i === 2){ ctx.lineTo(62 + bw*p + 90*p, y + 95); ctx.lineTo(62 + bw*p, y + 190); } else ctx.lineTo(62 + bw*p, y + 190);
      ctx.lineTo(62, y + 190); ctx.closePath(); ctx.fill();
      slamWord(w, fitDisp(w, 820, 150), 100, y + 150, fg, t0 + 0.15, 0.04, 11 + i*20);
    });
    return;
  }
  if (T < 10){
    bg(C.red); sig(C.white, 99);
    const size = fitDisp('IS THE KEY.', 960, 230);
    slamWord('THE IDEA', size, 'center', 900, C.white, 8.45, 0.06, 5);
    slamWord('IS THE KEY.', size, 'center', 900 + size*1.08, C.dark, 8.95, 0.06, 25);
    return;
  }
  endcard(10);
}

// 06 KI — a thousand look-alike variants, then one human idea
function tileShape(i, seed, x, y, s){
  const h = Math.floor(rnd(seed + i)*360), kind = Math.floor(rnd(seed + i + 7)*3);
  ctx.fillStyle = `hsl(${h} 14% ${30 + rnd(seed + i + 3)*25}%)`; ctx.fillRect(x, y, s, s);
  ctx.fillStyle = `hsl(${(h + 40) % 360} 18% ${55 + rnd(seed + i + 5)*20}%)`;
  ctx.beginPath();
  if (kind === 0) ctx.arc(x + s/2, y + s/2, s*0.28, 0, TAU);
  else if (kind === 1) ctx.rect(x + s*0.22, y + s*0.22, s*0.56, s*0.56);
  else { ctx.moveTo(x + s/2, y + s*0.2); ctx.lineTo(x + s*0.8, y + s*0.78); ctx.lineTo(x + s*0.2, y + s*0.78); ctx.closePath(); }
  ctx.fill();
}
function vKI(){
  if (T < 7.2){
    bg(C.dark); sig(C.white);
    const f = F(800, 104);
    if (T < 4.3) wordsIn(layoutWords('KI kann Design generieren.', f, 940, 120, 62, 560), f, C.white, 0.3, 0.2, []);
    else wordsIn(layoutWords('Aber nur Menschen haben Ideen.', f, 940, 120, 62, 560), f, C.white, 4.4, 0.2, [4]);
    const frozen = T >= 4.2, seed = frozen ? Math.floor(4.2/0.12)*31 : Math.floor(T/0.12)*31, gone = eio(seg(T, 4.6, 5.3));
    for (let i = 0; i < 16; i++){
      const a = eo(seg(T, 0.6 + i*0.03, 0.9 + i*0.03)); if (a <= 0) continue;
      const s = 200*(1 - gone), x = 110 + (i % 4)*220 + (200 - s)/2, y = 880 + Math.floor(i/4)*220 + (200 - s)/2;
      if (s <= 1) continue;
      ctx.save(); ctx.globalAlpha = a*(frozen ? 0.5 : 1); tileShape(i, seed, x, y, s); ctx.restore();
    }
    const cnt = Math.floor(Math.pow(seg(T, 0.6, 4.2), 2)*9999);
    ctx.save(); ls(ctx, 4); text(`VARIANTE ${String(cnt).padStart(4, '0')}`, 540, 1790, LAB(28), C.red, 'center', eo(seg(T, 0.6, 0.9))*(1 - seg(T, 4.6, 5.0)), 4); ctx.restore();
    return;
  }
  if (T < 10){
    bg(C.dark); sig(C.white, 99);
    const size = fitDisp('SCHLÜSSEL.', 960, 210);
    slamWord('KI ALS', size, 62, 720, C.white, 7.25, 0.05, 2);
    slamWord('WERKZEUG.', size, 62, 720 + size*1.05, C.white, 7.55, 0.05, 12);
    slamWord('IDEE ALS', size, 62, 720 + size*2.35, C.red, 8.3, 0.05, 32);
    slamWord('SCHLÜSSEL.', size, 62, 720 + size*3.4, C.red, 8.6, 0.05, 52);
    return;
  }
  endcard(10);
}

const VARIANTS = [
  { slug:'sichtbarkeit', name:'Sichtbarkeit', dur:12, end:10, draw:vSicht,   hits:[3.5, 4.7, 7.95, 8.55] },
  { slug:'bekanntheit',  name:'Bekanntheit',  dur:12, end:10, draw:vBekannt, hits:[5.6, 6.1, 6.95, 7.4, 8.2] },
  { slug:'mut',          name:'Mut',          dur:12, end:10, draw:vMut,     hits:[0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.25, 9.0] },
  { slug:'design',       name:'Design',       dur:12, end:10, draw:vDesign,  hits:[2.2, 2.35, 8.4, 9.6] },
  { slug:'kreativitaet', name:'Kreativität',  dur:12, end:10, draw:vKreativ, hits:[3.6, 5.15, 5.85, 6.55, 8.45, 8.95] },
  { slug:'ki',           name:'KI',           dur:12, end:10, draw:vKI,      hits:[4.2, 7.25, 7.55, 8.3, 8.6] },
];
let cur = Math.max(0, VARIANTS.findIndex(v => '#' + v.slug === location.hash));
function soundFor(add){
  const v = VARIANTS[cur], roots = [55, 43.65, 65.41, 49];
  [0.05, 0.2].forEach((t, i) => add(t, (d,w) => tone(d, w, 'square', 392*Math.pow(1.26, i), 0.05, 0.08, 0.003, 2000)));
  for (let tb = 0.5; tb < v.end - 0.4; tb += 0.5){
    add(tb, (d,w) => kick(d, w, 0.85)); add(tb + 0.25, (d,w) => hat(d, w));
    if (Math.round(tb*2) % 2) add(tb, (d,w) => clap(d, w));
    const f = roots[Math.floor(tb/2) % 4]*2; add(tb + 0.25, (d,w) => tone(d, w, 'sawtooth', f, 0.2, 0.2, 0.004, 600));
  }
  v.hits.forEach(t => { add(t, (d,w) => noise(d, w, 'bandpass', 2400, 1.2, 0.3, 0.06)); add(t, (d,w) => kick(d, w, 0.7)); });
  add(v.end - 0.5, (d,w) => riser(d, w, 0.5, 0.3));
  add(v.end, (d,w) => kick(d, w, 1.2)); add(v.end, (d,w) => crash(d, w));
  add(v.end, (d,w) => tone(d, w, 'sawtooth', 55, 0.3, 1.9, 0.01, 300));
  [220, 261.63, 329.63, 493.88].forEach(f => add(v.end, (d,w) => tone(d, w, 'triangle', f, 0.07, 1.9, 0.06)));
}
function render(t){
  T = clamp(t, 0, DUR - 1e-4);
  ctx.textBaseline = 'alphabetic';
  syncVideos();
  const light = VARIANTS[cur].draw();
  hudBase(light ? C.dark : C.white, VARIANTS[cur].name.toUpperCase());
  return cur;
}
