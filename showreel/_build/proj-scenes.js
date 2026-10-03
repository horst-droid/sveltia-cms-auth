// ---------- Projekte: logo animations from the portfolio (content-pool/03-projekte-cases), showreel + one reel per client ----------
const CASES = [
  { slug:'evomotiv',      title:'EVOMOTIV',      tag:'Logo · Corporate Design', v:'v-evo',   imgs:['evo-a.jpg', 'evo-b.jpg', 'evo-c.jpg'] },
  { slug:'jacob',         title:'JACOB',         tag:'Logo · Fahrzeug',         v:'v-jacob', imgs:['jm-van.jpg'], sub:'Messtechnik GmbH' },
  { slug:'green-hornets', title:'green hornets', tag:'Logo · Corporate Design', v:'v-gh',    imgs:['gh-forest.jpg', 'gh-cd.jpg'], sub:'Solartechnik' },
  { slug:'riva',          title:'Riva',          tag:'Logo · Animation',        v:'v-riva',  imgs:[], sub:'Bar · Café · Lounge' },
  { slug:'goth',          title:'GOTH',          tag:'Logo · Animation',        v:'v-goth',  imgs:[] },
];
const VEXT = location.search.includes('webm') ? 'webm' : 'mp4'; // local Playwright tests: Chromium there has no H.264
const M = {};
function loadOne(k){
  return new Promise(res => {
    const done = () => res();
    if (k.startsWith('v-')){
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'auto';
      v.addEventListener('loadeddata', done, { once:true }); v.addEventListener('error', done, { once:true });
      v.src = `media/${k}.${VEXT}`; M[k] = v;
    } else { const i = new Image(); i.onload = done; i.onerror = done; i.src = `media/${k}`; M[k] = i; }
  });
}
function loadImg(key, src){ return new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; M[key] = i; }); }
const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const mediaP = Promise.race([
  Promise.all([loadImg('logo', svgURL(SVG_LOGO_W)), ...CASES.flatMap(c => [c.v, ...c.imgs]).map(loadOne)]),
  new Promise(r => setTimeout(r, 10000)),
]).then(() => { dirty = true; });
const ready = el => el && (el.tagName === 'VIDEO' ? el.videoWidth > 0 : el.complete && el.naturalWidth > 0);
function drawCover(el, x, y, w, h, zoom = 1){
  const iw = el.videoWidth || el.naturalWidth, ih = el.videoHeight || el.naturalHeight; if (!iw || !ih) return;
  const s = Math.max(w/iw, h/ih)*zoom, dw = iw*s, dh = ih*s; ctx.drawImage(el, x + (w-dw)/2, y + (h-dh)/2, dw, dh);
}
function drawContain(el, x, y, w, h){
  const iw = el.videoWidth || el.naturalWidth, ih = el.videoHeight || el.naturalHeight; if (!iw || !ih) return;
  const s = Math.min(w/iw, h/ih), dw = iw*s, dh = ih*s; ctx.drawImage(el, x + (w-dw)/2, y + (h-dh)/2, dw, dh);
}
function bg(c){ ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); }

// which video should show which frame at time T
const SHOW = { intro:2.2, clip:2.0, from:1.1, end:12.2 };
const VID = { t0:2.0, t1:7.0, from:0.4 }; // case reels: video window and start offset
function videoWant(){
  const v = VARIANTS[cur];
  if (v.slug === 'showreel'){
    if (T < SHOW.intro || T >= SHOW.end) return null;
    const i = Math.floor((T - SHOW.intro)/SHOW.clip);
    return { k:CASES[i].v, at:SHOW.from + (T - SHOW.intro - i*SHOW.clip) };
  }
  const c = v.c;
  if (T >= 1.7 && T < VID.t1) return { k:c.v, at:Math.max(VID.from, T - VID.t0 + VID.from) };
  if (!c.imgs.length && T >= VID.t1 && T < 10.2) return { k:c.v, at:3.4 };
  return null;
}
// the clip that comes next, so it can be parked on its first frame before the cut
function videoNext(){
  const v = VARIANTS[cur];
  if (v.slug === 'showreel'){
    const i = T < SHOW.intro ? 0 : Math.floor((T - SHOW.intro)/SHOW.clip) + 1;
    return i < CASES.length ? { k:CASES[i].v, at:SHOW.from } : null;
  }
  return T < 1.7 ? { k:v.c.v, at:VID.from } : null;
}
function syncVideos(){
  const want = videoWant(), next = videoNext();
  CASES.forEach(c => {
    const el = M[c.v]; if (!el) return;
    if (!want || want.k !== c.v){
      if (!el.paused) el.pause();
      if (next && next.k === c.v && Math.abs(el.currentTime - next.at) > 0.04) el.currentTime = next.at;
      return;
    }
    const at = Math.min(want.at, Math.max(0, (el.duration || 6) - 0.05));
    const still = VARIANTS[cur].slug !== 'showreel' && T >= VID.t1;
    if (playing && !still){ if (el.paused) el.play().catch(() => {}); if (Math.abs(el.currentTime - at) > 0.25) el.currentTime = at; }
    else { if (!el.paused) el.pause(); if (Math.abs(el.currentTime - at) > 0.04) el.currentTime = at; }
  });
}
function videoFull(k){
  bg(C.white); const el = M[k];
  if (ready(el)) drawContain(el, 0, 285, W, 1350);
}
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
function wipeOff(t0){ const p = eio(seg(T, t0, t0 + 0.3)); if (p < 1){ ctx.fillStyle = C.red; ctx.fillRect(0, -H*p, W, H); } }

// Showreel: 5 brands, 5 logo builds, hard cuts on the beat
function vShow(){
  if (T < SHOW.intro){
    bg(C.dark); drawSignet(540, 300, 120, C.white, seg(T, 0, 0.7));
    const size = fitDisp('5 MONSTER-', 960, 230), y = 820;
    slamWord('5 MARKEN.', size, 'center', y, C.white, 0.2, 0.06, 1);
    slamWord('5 MONSTER-', size, 'center', y + size*1.05, C.red, 0.85, 0.05, 20);
    slamWord('IDEEN.', size, 'center', y + size*2.1, C.red, 1.35, 0.05, 40);
    const p = eio(seg(T, 1.95, 2.2)); if (p > 0){ ctx.fillStyle = C.red; ctx.fillRect(0, H*(1 - p), W, H*p); }
    return;
  }
  if (T < SHOW.end){
    const i = Math.floor((T - SHOW.intro)/SHOW.clip), c = CASES[i], t0 = SHOW.intro + i*SHOW.clip;
    videoFull(c.v);
    ctx.save(); ls(ctx, 6); text(`0${i + 1} / 05`, 540, 1600, LAB(28), C.red, 'center', 1, 6); ctx.restore();
    const a = eo(seg(T, t0 + 0.2, t0 + 0.5));
    text(c.title, 540, 1700 + (1-a)*20, F(800, 64), C.dark, 'center', a, -1);
    wipeOff(t0);
    return true;
  }
  endcard(SHOW.end);
}

// one client: name → logo animation → in use → end card
function caseReel(){
  const c = VARIANTS[cur].c, n = CASES.indexOf(c) + 1;
  if (T < 2.0){
    bg(C.dark); drawSignet(540, 300, 120, C.white, seg(T, 0, 0.7));
    ctx.save(); ls(ctx, 8); text(`PROJEKT 0${n}`, 540, 700, LAB(30), C.red, 'center', eo(seg(T, 0.1, 0.35)), 8); ctx.restore();
    const size = fit(c.title, 800, 960, 200);
    ctx.save(); ctx.font = F(800, size); ls(ctx, -size*0.035); const tw = ctx.measureText(c.title).width; ctx.restore();
    riseWord(c.title, 800, size, 540 - tw/2, 920, C.white, 0.25, 0.04, 0.45);
    if (c.sub) text(c.sub, 540, 1010, F(600, 48), C.white, 'center', eo(seg(T, 0.6, 0.9))*0.8, 0);
    pill(c.tag, 540, 1110, C.red, C.white, eo(seg(T, 0.8, 1.1)));
    const r = eio(seg(T, 1.7, 2.0))*1200;
    if (r > 0){ ctx.save(); ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(540, 960, r, 0, TAU); ctx.fill(); ctx.restore(); }
    return;
  }
  if (T < VID.t1){
    videoFull(c.v);
    ctx.save(); ls(ctx, 6); text('LOGOANIMATION', 540, 1700, LAB(26), C.dark, 'center', 0.55, 6); ctx.restore();
    return true;
  }
  if (T < 10.2){
    if (c.imgs.length){
      const slot = (10.2 - VID.t1)/c.imgs.length, i = Math.min(c.imgs.length - 1, Math.floor((T - VID.t1)/slot));
      for (let j = 0; j <= i; j++){
        const el = M[c.imgs[j]], t0 = VID.t1 + j*slot, p = eio(seg(T, t0, t0 + 0.28));
        if (!ready(el)) continue;
        ctx.save(); ctx.beginPath(); ctx.rect(0, H*(1 - p), W, H*p); ctx.clip();
        drawCover(el, 0, 0, W, H, lerp(1.14, 1.0, eo(seg(T, t0, t0 + slot + 0.3)))); ctx.restore();
        if (p > 0 && p < 1){ ctx.fillStyle = C.red; ctx.fillRect(0, H*(1 - p) - 18, W, 18); }
      }
      const g = ctx.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, 'rgba(32,28,37,.75)'); g.addColorStop(1, 'rgba(32,28,37,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, 420);
      pill('Im Einsatz', 540, 1560, C.red, C.white, eo(seg(T, VID.t1 + 0.3, VID.t1 + 0.6)));
    } else {
      bg(C.dark);
      const p = eback(seg(T, VID.t1, VID.t1 + 0.4)), cw = 820*p, ch = 1025*p, x = 540 - cw/2, y = 820 - ch/2;
      if (p > 0){ ctx.fillStyle = C.white; rrect(ctx, x, y, cw, ch, 28); ctx.fill();
        const el = M[c.v]; if (ready(el)){ ctx.save(); rrect(ctx, x, y, cw, ch, 28); ctx.clip(); drawContain(el, x, y, cw, ch); ctx.restore(); } }
      const a1 = eo(seg(T, VID.t1 + 0.5, VID.t1 + 0.8)), a2 = eo(seg(T, VID.t1 + 0.7, VID.t1 + 1.0));
      text('Ein Zeichen,', 540, 1480 + (1-a1)*24, F(800, 84), C.white, 'center', a1, -2);
      text('das bleibt.', 540, 1580 + (1-a2)*24, F(800, 84), C.red, 'center', a2, -2);
    }
    return;
  }
  endcard(10.2, 'Deine Marke', 'als Nächstes?');
}

const VARIANTS = [
  { slug:'showreel', name:'Showreel', dur:15, end:SHOW.end, draw:vShow, hits:[0.2, 0.85, 1.35, 2.2, 4.2, 6.2, 8.2, 10.2] },
  ...CASES.map(c => ({ slug:c.slug, name:c.title, c, dur:12, end:10.2, draw:caseReel, hits:[0.25, 0.8, 2.0, VID.t1, ...(c.imgs.length > 1 ? c.imgs.slice(1).map((_, j) => VID.t1 + (j + 1)*(10.2 - VID.t1)/c.imgs.length) : [VID.t1 + 0.5])] })),
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
