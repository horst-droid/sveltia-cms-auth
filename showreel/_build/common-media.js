// ---------- shared for variant reels with media: loading, drawing, end card, sound, render ----------
// expects MEDIA (file names under media/; "v-*" are videos without extension) and VARIANTS from the scene file
const M = {};
const VEXT = location.search.includes('webm') ? 'webm' : 'mp4'; // local Playwright tests: Chromium there has no H.264
function loadOne(k){
  return new Promise(res => {
    const done = () => res();
    if (k.startsWith('v-')){
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'auto';
      v.addEventListener('loadeddata', done, { once:true }); v.addEventListener('error', done, { once:true });
      v.addEventListener('seeked', () => { dirty = true; }); // paused scrubbing: redraw once the frame is decoded
      v.src = `media/${k}.${VEXT}`; M[k] = v;
    } else { const i = new Image(); i.onload = done; i.onerror = done; i.src = `media/${k}`; M[k] = i; }
  });
}
function loadImg(key, src){ return new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; M[key] = i; }); }
const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const mediaP = Promise.race([
  Promise.all([loadImg('logo', svgURL(SVG_LOGO_W)), ...MEDIA.map(loadOne)]),
  new Promise(r => setTimeout(r, 10000)),
]).then(() => { dirty = true; });
const ready = el => el && (el.tagName === 'VIDEO' ? el.videoWidth > 0 : el.complete && el.naturalWidth > 0);
const dims = el => [el.videoWidth || el.naturalWidth, el.videoHeight || el.naturalHeight];
function drawCover(el, x, y, w, h, zoom = 1){
  const [iw, ih] = dims(el); if (!iw || !ih) return;
  const s = Math.max(w/iw, h/ih)*zoom, dw = iw*s, dh = ih*s; ctx.drawImage(el, x + (w-dw)/2, y + (h-dh)/2, dw, dh);
}
function drawContain(el, x, y, w, h){
  const [iw, ih] = dims(el); if (!iw || !ih) return;
  const s = Math.min(w/iw, h/ih), dw = iw*s, dh = ih*s; ctx.drawImage(el, x + (w-dw)/2, y + (h-dh)/2, dw, dh);
}
function bg(c){ ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); }
function sig(color, t0 = 0){ drawSignet(540, 300, 120, color, seg(T, t0, t0 + 0.8)); }
function lines(arr, font, color, x, y, lh, tIn, step, align = 'left'){
  arr.forEach((s, i) => { const a = eo(seg(T, tIn + i*step, tIn + i*step + 0.3)); text(s, x, y + i*lh + (1 - a)*30, font, color, align, a, -2); });
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
// variant.video() → { k, at, still } for the clip on screen, or { pre:{k, at} } to park the next clip on its first frame
function syncVideos(){
  const v = VARIANTS[cur], want = v.video ? v.video() : null;
  MEDIA.filter(k => k.startsWith('v-')).forEach(k => {
    const el = M[k]; if (!el) return;
    if (!want || want.k !== k){
      if (!el.paused) el.pause();
      if (want && want.pre && want.pre.k === k && Math.abs(el.currentTime - want.pre.at) > 0.04) el.currentTime = want.pre.at;
      return;
    }
    const at = Math.min(want.at, Math.max(0, (el.duration || 6) - 0.05));
    if (playing && !want.still){ if (el.paused) el.play().catch(() => {}); if (Math.abs(el.currentTime - at) > 0.25) el.currentTime = at; }
    else { if (!el.paused) el.pause(); if (Math.abs(el.currentTime - at) > 0.04) el.currentTime = at; }
  });
}
let cur = Math.max(0, VARIANTS.findIndex(v => '#' + v.slug === location.hash));
function soundFor(add){
  if (VARIANTS[cur].sound) return VARIANTS[cur].sound(add);
  const v = VARIANTS[cur], roots = [55, 43.65, 65.41, 49];
  [0.05, 0.2].forEach((t, i) => add(t, (d,w) => tone(d, w, 'square', 392*Math.pow(1.26, i), 0.05, 0.08, 0.003, 2000)));
  for (let tb = 0.5; tb < v.end - 0.4; tb += 0.5){
    add(tb, (d,w) => kick(d, w, 0.85)); add(tb + 0.25, (d,w) => hat(d, w));
    if (Math.round(tb*2) % 2) add(tb, (d,w) => clap(d, w));
    const f = roots[Math.floor(tb/2) % 4]*2; add(tb + 0.25, (d,w) => tone(d, w, 'sawtooth', f, 0.2, 0.2, 0.004, 600));
  }
  v.hits.forEach(t => { add(t, (d,w) => noise(d, w, 'bandpass', 2400, 1.2, 0.3, 0.06)); add(t, (d,w) => kick(d, w, 0.7)); });
  if (v.end > 0.6) add(v.end - 0.5, (d,w) => riser(d, w, 0.5, 0.3));
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
