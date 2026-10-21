const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const M = {};
const ok = el => el && (el.tagName === 'VIDEO' ? el.videoWidth > 0 && el.readyState >= 1 : el.complete && el.naturalWidth > 0);
function loadImg(key, src){ return new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = src; M[key] = i; }); }
function loadVid(key, src){ return new Promise(res => { const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.loop = true; v.preload = 'auto';
  v.addEventListener('loadeddata', () => res(), { once:true }); v.addEventListener('error', () => res(), { once:true }); v.src = src; M[key] = v; }); }
const mediaP = Promise.race([Promise.all([loadImg('logo', svgURL(SVG_LOGO_W)), loadImg('still', 'media/horst-still.jpg'), loadVid('v', 'media/horst-monster.mp4')]), new Promise(r => setTimeout(r, 9000))]).then(() => { dirty = true; });
// the monster video runs only inside the VHS reel, from V_T0 on
let V_T0 = 0;
function syncV(){
  const v = M.v; if (!v || !ok(v)) return;
  const d = v.duration || 7.13, want = Math.max(0, T - V_T0) % d;
  if (playing && cur.id === 'vhs' && T >= V_T0 && T < 11.6){ if (v.paused) v.play().catch(() => {}); const diff = Math.abs(v.currentTime - want); if (diff > 0.3 && diff < d - 0.3) v.currentTime = want; }
  else { if (!v.paused) v.pause(); if (Math.abs(v.currentTime - want) > 0.04) v.currentTime = want; }
}
// HORST's head, cut out of the still with a soft ellipse (video coords: center 640,250, radii 250×270)
const head = document.createElement('canvas'); head.width = 520; head.height = 560; let headReady = false;
function buildHead(){
  if (headReady || !ok(M.still)) return; const c = head.getContext('2d');
  const g = c.createRadialGradient(260, 270, 165, 260, 270, 225); g.addColorStop(0, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.save(); c.scale(1, 560/520); c.fillStyle = g; c.beginPath(); c.arc(260, 250, 225, 0, TAU); c.fill(); c.restore();
  c.globalCompositeOperation = 'source-in'; c.drawImage(M.still, 380, -30, 520, 560, 0, 0, 520, 560); headReady = true;
}
function drawHead(cx, cy, w, rot = 0, alpha = 1){ buildHead(); if (!headReady) return; const h = w*560/520; ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.drawImage(head, -w/2, -h/2, w, h); ctx.restore(); }
// 8-bit HORST: the head sampled down to a few dozen pixels and blown up again without smoothing
const pix = document.createElement('canvas'); let pixN = 0;
function drawPixHead(cx, cy, w, n, alpha = 1){
  buildHead(); if (!headReady) return;
  if (pixN !== n){ pix.width = n; pix.height = Math.round(n*560/520); const c = pix.getContext('2d'); c.clearRect(0, 0, pix.width, pix.height); c.drawImage(head, 0, 0, pix.width, pix.height); pixN = n; }
  const h = w*pix.height/pix.width; ctx.save(); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = alpha; ctx.drawImage(pix, cx - w/2, cy - h/2, w, h); ctx.restore();
}
function dropY(lt, h, G = 5200, REST = 0.35){ if (lt <= 0) return h; let v = Math.sqrt(2*G*h), tt = lt; const tf = v/G; if (tt < tf) return h - 0.5*G*tt*tt; tt -= tf; v *= REST; for (let b = 0; b < 4; b++){ const dur = 2*v/G; if (tt < dur) return Math.max(0, v*tt - 0.5*G*tt*tt); tt -= dur; v *= REST; } return 0; }
const MONO = s => `700 ${s}px "Courier New", Courier, monospace`;

// =====================================================================
// REEL 1 · VHS · "HORST – DAS ORIGINAL. SEIT 1984." (the tape look)
// =====================================================================
const vhsC = document.createElement('canvas'); vhsC.width = W; vhsC.height = H; const vctx = vhsC.getContext('2d');
function vhsFrame(){ // draws the raw picture into vhsC: the monster video, scaled to fill, slightly blown out
  vctx.fillStyle = '#0A0A0C'; vctx.fillRect(0, 0, W, H);
  const v = M.v;
  if (ok(v)){ const s = Math.max(W/1500, 1300/844)*1.0, dw = 1500*s, dh = 844*s; vctx.drawImage(v, 540 - dw/2 - 120, 1000 - dh/2, dw, dh); }
  else if (ok(M.still)){ const s = 1300/720, dw = 1280*s, dh = 720*s; vctx.drawImage(M.still, 540 - dw/2 - 120, 1000 - dh/2, dw, dh); }
}
function reel1(){
  if (T >= 11.6){ endCard(11.6); return; }
  const f = Math.floor(T*30);
  // snow / blue screen for the first moments, then the picture catches
  if (T < 0.55){ ctx.fillStyle = '#0B1FA8'; ctx.fillRect(0, 0, W, H); if (T > 0.25){ ctx.fillStyle = '#FFFFFF'; for (let k = 0; k < 900; k++){ ctx.globalAlpha = rnd(k + f*7)*0.9; ctx.fillRect(rnd(k*3 + f)*W, rnd(k*5 + f)*H, 6, 3); } ctx.globalAlpha = 1; }
    ctx.save(); ls(ctx, 8); text('PLAY ▶', 90, 230, MONO(64), '#FFFFFF', 'left', 1, 8); ctx.restore(); return; }
  vhsFrame();
  // chroma split: red and cyan copies shifted, picture in between
  const wob = Math.sin(T*9)*2 + (rnd(f) > 0.93 ? 14 : 0);
  ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(vhsC, 0, 0);
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.35; ctx.filter = 'saturate(3) hue-rotate(-20deg)'; ctx.drawImage(vhsC, -6 - wob, 0); ctx.filter = 'saturate(3) hue-rotate(160deg)'; ctx.drawImage(vhsC, 6 + wob, 0); ctx.restore();
  // tracking band rolling through
  const by = ((T*260) % (H + 400)) - 200; ctx.save(); ctx.globalAlpha = 0.5; ctx.drawImage(vhsC, 0, by, W, 46, 18 + wob*2, by, W, 46); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(0, by, W, 46); ctx.restore();
  if (rnd(f + 11) > 0.9){ const ty = rnd(f)*H; ctx.save(); ctx.globalAlpha = 0.8; ctx.drawImage(vhsC, 0, ty, W, 120, 60, ty, W, 120); ctx.restore(); }
  // scanlines + vignette + tint
  ctx.fillStyle = 'rgba(0,0,0,.28)'; for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
  ctx.fillStyle = 'rgba(255,150,60,.08)'; ctx.fillRect(0, 0, W, H);
  const vg = ctx.createRadialGradient(540, 960, 500, 540, 960, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.85)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  // noise
  ctx.fillStyle = '#FFFFFF'; for (let k = 0; k < 160; k++){ ctx.globalAlpha = rnd(k + f*3)*0.25; ctx.fillRect(rnd(k*7 + f)*W, rnd(k*11 + f)*H, 3 + rnd(k)*8, 2); } ctx.globalAlpha = 1;
  // OSD: PLAY, counter, date, SP
  const blink = (T*2 % 1) < 0.7;
  ctx.save(); ls(ctx, 6); text('PLAY ▶', 90, 230, MONO(64), '#FFFFFF', 'left', 1, 6);
  const sec = Math.floor(T*1.0 + 12), cnt = `0:${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; text(cnt, W - 90, 230, MONO(64), '#FFFFFF', 'right', 1, 6);
  text('SP', W - 90, 310, MONO(44), '#FFFFFF', 'right', 1, 6); text('12. 8. 1984', 90, H - 150, MONO(52), '#FFFFFF', 'left', 1, 4); text('PM 7:04', W - 90, H - 150, MONO(52), '#FFFFFF', 'right', blink ? 1 : 0.4, 4); ctx.restore();
  // lower-third title like a camcorder caption, then the punchline
  if (T >= 2.0){ const a = eo(seg(T, 2.0, 2.3)); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 1310, W, 190); ctx.restore(); text('HORST', 540, 1400, MONO(96), '#FFF2A8', 'center', a, 10); text('DAS ORIGINAL.', 540, 1470, MONO(44), '#FFFFFF', 'center', a, 8); }
  if (T >= 5.0){ slamWord('SEIT 1984', fitDisp('SEIT 1984', 880, 170), 'center', 560, '#FFF2A8', 5.0, 0.06, 3); }
  if (T >= 6.4){ const a = eo(seg(T, 6.4, 6.7)); ctx.save(); ctx.translate(540, 700); ctx.rotate(-0.06); ctx.fillStyle = C.red; ctx.globalAlpha = a; ctx.fillRect(-300, -46, 600, 92); ctx.restore(); text('ÄH … SEIT 2004.', 540, 718, F(800, 50), C.white, 'center', a, -1); }
  if (T >= 8.4){ const a = eo(seg(T, 8.4, 8.8)); text('Zurückspulen lohnt sich nicht.', 540, 1560 + (1-a)*20, F(700, 56), C.white, 'center', a, -1.5); text('Monsterideen gibt es nur vorwärts.', 540, 1635 + (1-a)*20, F(700, 56), '#FFF2A8', 'center', a, -1.5); }
}
function audio1(add){
  add(0, (d,w) => noise(d, w, 'lowpass', 900, 0.5, 0.12, 0.55));            // tape clunk
  add(0.25, (d,w) => noise(d, w, 'highpass', 3000, 0.3, 0.18, 0.35));
  add(0.55, (d,w) => noise(d, w, 'bandpass', 2600, 0.4, 0.035, 11.0, 0.05)); // hiss bed
  add(0.55, (d,w) => tone(d, w, 'sine', 50, 0.05, 11.0, 0.3));              // hum
  // 80s drum machine at 108 BPM with gated-reverb snare
  const b = 60/108;
  for (let k = 0; k < 20; k++){ const tb = 0.55 + k*b; add(tb, (d,w) => kick(d, w, 0.9)); add(tb + b/2, (d,w) => hat(d, w, 0.12)); if (k % 2 === 1){ add(tb, (d,w) => noise(d, w, 'bandpass', 1100, 0.6, 0.5, 0.42)); add(tb, (d,w) => clap(d, w)); } }
  for (let k = 0; k < 20; k++){ const tb = 0.55 + k*b, n = [55, 55, 65.4, 49][Math.floor(k/4) % 4]; add(tb, (d,w) => tone(d, w, 'sawtooth', n, 0.14, 0.25, 0.004, 500)); add(tb + b/2, (d,w) => tone(d, w, 'sawtooth', n*2, 0.08, 0.14, 0.004, 700)); }
  for (let c = 0; c < 5; c++) add(0.55 + c*b*4, (d,w) => [1, 1.2, 1.5, 2].forEach(m => tone(d, w, 'square', 220*m*[1, 1, 1.19, 0.89][c % 4], 0.03, 1.6, 0.25, 1600)));
  add(5.0, (d,w) => { kick(d, w, 1.3); crash(d, w); }); add(6.4, (d,w) => noise(d, w, 'lowpass', 400, 0.6, 0.6, 0.12)); // tape stop
  add(6.4, (d,w) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(220, w); o.frequency.exponentialRampToValueAtTime(30, w + 0.7); env(g, w, 0.18, 0.7, 0.01); o.connect(g); g.connect(d); o.start(w); o.stop(w + 0.8); });
  add(11.6, (d,w) => { kick(d, w, 1.2); crash(d, w); }); [220, 261.63, 329.63, 493.88].forEach(f => add(11.6, (d,w) => tone(d, w, 'triangle', f, 0.07, 1.9, 0.06)));
}

// =====================================================================
// REEL 2 · ARCADE · "INSERT COIN" – 8-bit HORST vs. boring brand
// =====================================================================
const ARC = { bg:'#0D0A1E', grid:'#1E1650', ink:'#FFFFFF', y:'#FFE600', c:'#00E5FF', m:'#FF2BD6', g:'#39FF14' };
function pixText(s, x, y, size, col, align = 'center', a = 1){ ctx.save(); ctx.font = MONO(size); ctx.textAlign = align; ctx.fillStyle = col; ctx.globalAlpha = a; ls(ctx, size*0.12); ctx.fillText(s, x, y); ctx.restore(); }
function pixRect(x, y, w, h, col){ ctx.fillStyle = col; ctx.fillRect(Math.round(x/8)*8, Math.round(y/8)*8, Math.round(w/8)*8, Math.round(h/8)*8); }
const HIT_T = 6.6, WIN_T = 8.2;
function reel2(){
  if (T >= 11.6){ endCard(11.6); return; }
  ctx.fillStyle = ARC.bg; ctx.fillRect(0, 0, W, H);
  // starfield
  for (let k = 0; k < 90; k++){ const sp = 60 + rnd(k)*200, y = ((rnd(k*3)*H + T*sp) % H); pixRect(rnd(k*7)*W, y, 8, 8, k % 3 ? '#3C3570' : '#8C84D0'); }
  const f = Math.floor(T*30), blink = (T*2 % 1) < 0.6;
  // top bar
  pixText('1UP', 90, 250, 40, ARC.c, 'left'); const score = Math.min(999999, Math.floor(Math.max(0, T - 3.4)*5890 + (T > WIN_T ? 420000 : 0)));
  pixText(String(score).padStart(6, '0'), 90, 305, 40, ARC.ink, 'left'); pixText('HI 200400', W - 90, 250, 40, ARC.m, 'right'); pixText('LVL 1', W - 90, 305, 40, ARC.ink, 'right');
  if (T < 2.6){ // attract mode
    pixText('HORST', 540, 760, 200, ARC.y); pixText('ARCADE', 540, 900, 100, ARC.c);
    if (blink) pixText('INSERT COIN', 540, 1200, 64, ARC.ink);
    pixText('© 2004 STUDIO HORST', 540, 1700, 30, '#8C84D0');
    if (T > 1.5){ // coin drops
      const cy = 1080 + dropY(T - 1.5, 900, 6000, 0.3)*-1 + 0; pixRect(520, cy - 40, 40, 40, ARC.y);
    }
    return;
  }
  // level: ground + boring brand enemy + pixel HORST
  pixRect(0, 1500, W, 420, ARC.grid); for (let x = 0; x < W; x += 80) pixRect(x, 1500, 40, 16, '#3C3570');
  if (T < 3.4){ if (blink) pixText('PLAYER 1 READY', 540, 700, 60, ARC.g); pixText('STAGE 1', 540, 800, 44, ARC.ink); pixText('LANGWEILIGE MARKE', 540, 870, 44, ARC.ink); }
  // enemy: grey box with "MARKE" label, bobbing, explodes at HIT_T
  const ex = 780, ey = 1420 + Math.sin(T*6)*12;
  if (T < HIT_T){ pixRect(ex - 170, ey - 300, 340, 300, '#8E8E96'); pixRect(ex - 110, ey - 240, 56, 56, '#1E1650'); pixRect(ex + 54, ey - 240, 56, 56, '#1E1650'); pixRect(ex - 90, ey - 120, 180, 20, '#1E1650'); pixText('LANGWEILIG', ex, ey + 50, 30, '#8E8E96'); }
  else { const p = seg(T, HIT_T, HIT_T + 0.9); for (let k = 0; k < 26; k++){ const ang = rnd(k)*TAU, r = p*(300 + rnd(k + 9)*500); if (p < 1) pixRect(ex + Math.cos(ang)*r, ey - 100 + Math.sin(ang)*r + p*p*600, 24, 24, k % 2 ? '#8E8E96' : ARC.y); }
    if (T < HIT_T + 1.2) pixText('+1000', ex, ey - 260 - (T - HIT_T)*120, 44, ARC.y); }
  // HORST walks in from the left, jumps and lands on the enemy
  const hx = lerp(-260, 300, eo(seg(T, 3.4, 5.0))), jump = T >= 5.6 && T < HIT_T ? Math.sin(seg(T, 5.6, HIT_T)*Math.PI)*640 : 0;
  const hop = T >= 3.4 && T < 5.0 ? Math.abs(Math.sin(T*14))*18 : 0;
  const hxx = T >= 5.6 ? lerp(300, ex - 20, seg(T, 5.6, HIT_T)) : hx;
  drawPixHead(hxx, 1300 - jump - hop + (T >= HIT_T ? Math.abs(Math.sin((T - HIT_T)*10))*-30*Math.exp(-(T - HIT_T)*3) : 0), 440, 26);
  pixText('HORST', hxx, 1580, 30, ARC.y);
  // fire shots while walking (red pixel ideas)
  if (T >= 4.0 && T < 5.6){ for (let k = 0; k < 3; k++){ const st = 4.0 + k*0.5, p = seg(T, st, st + 0.45); if (p > 0 && p < 1) pixRect(hx + 220 + p*600, 1220 + k*40, 40, 16, C.red); } }
  if (T >= WIN_T){
    const a = eo(seg(T, WIN_T, WIN_T + 0.3));
    pixRect(80, 520, W - 160, 560, '#000000'); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = ARC.y; ctx.lineWidth = 8; ctx.strokeRect(96, 536, W - 192, 528); ctx.restore();
    pixText('STAGE CLEAR', 540, 680, 84, ARC.g, 'center', a);
    pixText('MARKE GERETTET', 540, 790, 48, ARC.ink, 'center', a);
    pixText('BONUS: MONSTERIDEE', 540, 870, 40, ARC.y, 'center', a);
    if (T >= WIN_T + 0.8 && blink) pixText('PRESS START', 540, 1000, 44, ARC.c);
  }
  if (T >= 9.8){ const a = eo(seg(T, 9.8, 10.2)); text('Game over für langweilige Marken.', 540, 1760 + (1-a)*20, F(700, 52), C.white, 'center', a, -1.5); }
}
function bleep(d, w, f, dur = 0.08, g = 0.12){ tone(d, w, 'square', f, g, dur, 0.002); }
function audio2(add){
  // attract jingle (square arpeggio), coin, then chip-tune groove
  [0, 0.12, 0.24, 0.36].forEach((o, i) => add(0.1 + o, (d,w) => bleep(d, w, [523, 659, 784, 1047][i], 0.1)));
  add(1.5, (d,w) => { bleep(d, w, 988, 0.08, 0.14); }); add(1.6, (d,w) => bleep(d, w, 1319, 0.35, 0.14)); // coin
  add(2.6, (d,w) => [523, 659, 784].forEach((f, i) => tone(d, w + i*0.1, 'square', f, 0.1, 0.2, 0.002)));
  const b = 60/150;
  for (let k = 0; k < 24; k++){ const tb = 3.4 + k*b; if (tb > 11.4) break; add(tb, (d,w) => kick(d, w, 0.7)); add(tb + b/2, (d,w) => hat(d, w, 0.1)); if (k % 2) add(tb, (d,w) => noise(d, w, 'bandpass', 2000, 0.7, 0.25, 0.08));
    const n = [130.8, 130.8, 174.6, 196][Math.floor(k/4) % 4]; add(tb, (d,w) => tone(d, w, 'square', n, 0.1, 0.18, 0.002)); add(tb + b/2, (d,w) => tone(d, w, 'square', n*1.5, 0.07, 0.1, 0.002));
    add(tb + b/4, (d,w) => bleep(d, w, [523, 659, 784, 659, 523, 440, 523, 659][k % 8]*(k >= 16 ? 1.5 : 1), 0.09, 0.06)); }
  for (let k = 0; k < 3; k++) add(4.0 + k*0.5, (d,w) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'square'; o.frequency.setValueAtTime(1200, w); o.frequency.exponentialRampToValueAtTime(300, w + 0.15); env(g, w, 0.1, 0.15, 0.002); o.connect(g); g.connect(d); o.start(w); o.stop(w + 0.2); });
  add(5.6, (d,w) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'square'; o.frequency.setValueAtTime(300, w); o.frequency.exponentialRampToValueAtTime(900, w + 0.25); env(g, w, 0.12, 0.3, 0.002); o.connect(g); g.connect(d); o.start(w); o.stop(w + 0.35); }); // jump
  add(HIT_T, (d,w) => { noise(d, w, 'lowpass', 600, 0.5, 0.6, 0.5); const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(200, w); o.frequency.exponentialRampToValueAtTime(40, w + 0.5); env(g, w, 0.25, 0.5, 0.002); o.connect(g); g.connect(d); o.start(w); o.stop(w + 0.6); });
  [523, 659, 784, 1047, 1319].forEach((f, i) => add(WIN_T + i*0.09, (d,w) => bleep(d, w, f, 0.25, 0.12)));
  add(11.6, (d,w) => { kick(d, w, 1.2); crash(d, w); }); [220, 261.63, 329.63, 493.88].forEach(f => add(11.6, (d,w) => tone(d, w, 'triangle', f, 0.07, 1.9, 0.06)));
}

// =====================================================================
// REEL 3 · MEMPHIS 90s · "TOTAL KRASS." sitcom-intro energy
// =====================================================================
const MEM = ['#00C2B2', '#FF2BD6', '#FFE600', '#6A5CFF', '#FF6A3D'];
const SHAPES = Array.from({ length: 70 }, (_, k) => ({ x: rnd(k)*W, y: rnd(k + 100)*H, s: 30 + rnd(k + 200)*70, kind: k % 4, col: MEM[k % 5], rot: rnd(k + 300)*TAU, sp: 0.4 + rnd(k + 400) }));
function squiggle(x, y, s, col, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = col; ctx.lineWidth = s*0.18; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 12; i++){ const px = -s + i*s/6, py = Math.sin(i*1.4)*s*0.35; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); }
function shape(sh, t){
  const x = sh.x, y = (sh.y + t*sh.sp*40) % (H + 100) - 50, r = sh.rot + t*sh.sp;
  ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.fillStyle = sh.col; ctx.strokeStyle = sh.col;
  if (sh.kind === 0){ ctx.beginPath(); ctx.moveTo(0, -sh.s/2); ctx.lineTo(sh.s/2, sh.s/2); ctx.lineTo(-sh.s/2, sh.s/2); ctx.closePath(); ctx.fill(); }
  else if (sh.kind === 1){ ctx.beginPath(); ctx.arc(0, 0, sh.s/2, 0, TAU); ctx.fill(); }
  else if (sh.kind === 2){ ctx.translate(-x, -y); squiggle(x, y, sh.s, sh.col, r); }
  else { ctx.lineWidth = sh.s*0.16; ctx.strokeRect(-sh.s/2, -sh.s/2, sh.s, sh.s); }
  ctx.restore();
}
const CARDS = [['TOTAL', 'KRASS.'], ['VOLL', 'FETT.'], ['ECHT', 'GEIL.']];
function reel3(){
  if (T >= 11.6){ endCard(11.6); return; }
  ctx.fillStyle = '#FFF7E8'; ctx.fillRect(0, 0, W, H);
  // dotted + grid background à la Memphis
  ctx.fillStyle = '#201C25'; for (let y = 60; y < H; y += 90) for (let x = 60; x < W; x += 90) ctx.fillRect(x + ((y/90) % 2)*45, y, 10, 10);
  SHAPES.forEach(sh => shape(sh, T));
  // a TV-show title card slams in every 1.6 s: colored block, rotated, with two words
  const i = Math.min(2, Math.floor(seg(T, 0.6, 5.4)*3)), st = 0.6 + i*1.6, p = T >= 0.6 ? eback(seg(T, st, st + 0.35)) : 0;
  if (T >= 0.6 && T < 5.4){ const [w1, w2] = CARDS[i]; ctx.save(); ctx.translate(540, 900); ctx.rotate(-0.08 + i*0.05); ctx.scale(p, p); ctx.fillStyle = MEM[i]; ctx.fillRect(-440, -280, 880, 560); ctx.fillStyle = '#201C25'; ctx.fillRect(-400, -240, 880, 560); ctx.fillStyle = MEM[(i + 2) % 5]; ctx.fillRect(-440, -280, 880, 560);
    ctx.fillStyle = '#201C25'; ctx.font = DISP(200); ctx.textAlign = 'center'; ctx.fillText(w1, 0, -40); ctx.fillText(w2, 0, 170); ctx.restore(); }
  // HORST pops in with a 90s halo of rays
  if (T >= 5.4){ const p = eback(seg(T, 5.4, 5.9)); ctx.save(); ctx.translate(540, 900); ctx.rotate(T*0.4); ctx.globalAlpha = 0.9*p; for (let k = 0; k < 16; k++){ ctx.fillStyle = k % 2 ? '#FFE600' : '#FF2BD6'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 700, k*TAU/16, (k + 0.5)*TAU/16); ctx.closePath(); ctx.fill(); } ctx.restore();
    drawHead(540, 900, 640*p, Math.sin(T*3)*0.06);
    const a = eo(seg(T, 6.0, 6.3)); ctx.save(); ctx.translate(540, 1300); ctx.rotate(-0.06); ctx.scale(a, a); ctx.fillStyle = '#201C25'; ctx.fillRect(-420, -70, 840, 140); ctx.fillStyle = '#FFE600'; ctx.font = DISP(120); ctx.textAlign = 'center'; ctx.fillText('HORST', 0, 42); ctx.restore(); }
  if (T >= 7.2){ slamWord('DIE 90ER', fitDisp('DIE 90ER', 900, 150), 'center', 330, '#201C25', 7.2, 0.05, 5); slamWord('WOLLEN IHRE IDEEN', fitDisp('WOLLEN IHRE IDEEN', 940, 100), 'center', 450, '#201C25', 7.5, 0.03, 6); }
  if (T >= 8.6){ ctx.save(); ctx.translate(540, 1580); ctx.rotate(0.04); const p = eback(seg(T, 8.6, 8.95)); ctx.scale(p, p); ctx.fillStyle = C.red; ctx.fillRect(-470, -90, 940, 180); ctx.fillStyle = C.white; ctx.font = DISP(fitDisp('ZURÜCK. KRIEGEN SIE NICHT.', 880, 84)); ctx.textAlign = 'center'; ctx.fillText('ZURÜCK. KRIEGEN SIE NICHT.', 0, 30); ctx.restore(); }
  if (T >= 10.0){ const a = eo(seg(T, 10.0, 10.4)); text('Monsterideen. Frisch seit 2004.', 540, 1790 + (1-a)*20, F(700, 52), '#201C25', 'center', a, -1.5); }
}
function audio3(add){
  // eurodance 132 BPM: four-on-the-floor, open hat on the off, piano stabs, bass octave
  const b = 60/132; let k = 0;
  for (let tb = 0.0; tb < 11.4; tb += b, k++){ add(tb, (d,w) => kick(d, w, 1.0)); add(tb + b/2, (d,w) => noise(d, w, 'highpass', 7000, 0.5, 0.2, 0.18)); if (k % 2) add(tb, (d,w) => clap(d, w));
    const root = [110, 110, 87.3, 98][Math.floor(k/4) % 4]; add(tb, (d,w) => tone(d, w, 'sawtooth', root, 0.16, 0.2, 0.003, 900)); add(tb + b/2, (d,w) => tone(d, w, 'sawtooth', root*2, 0.1, 0.12, 0.003, 1200));
    if (k % 4 === 1 || k % 4 === 3 || (k % 8 === 6)) add(tb + (k % 4 === 3 ? b/2 : 0), (d,w) => [1, 1.26, 1.5, 2].forEach(m => tone(d, w, 'triangle', root*4*m, 0.07, 0.3, 0.004, 4000))); }
  [0.6, 2.2, 3.8].forEach(t0 => add(t0, (d,w) => { crash(d, w); noise(d, w, 'bandpass', 2500, 0.5, 0.4, 0.18); }));
  add(5.4, (d,w) => { crash(d, w); [261.6, 329.6, 392, 523.3].forEach((f, i) => tone(d, w + i*0.05, 'square', f, 0.08, 0.6, 0.004, 3000)); });
  add(8.6, (d,w) => { kick(d, w, 1.4); crash(d, w); });
  add(11.6, (d,w) => { kick(d, w, 1.2); crash(d, w); }); [220, 261.63, 329.63, 493.88].forEach(f => add(11.6, (d,w) => tone(d, w, 'triangle', f, 0.07, 1.9, 0.06)));
}

// =====================================================================
// REEL 4 · MIXTAPE · 5-s loop: a cassette turning, "HORST MIXTAPE VOL. 04"
// =====================================================================
function reel(cx, cy, r, ang, col){ ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.fillStyle = '#F8F7F8'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.fillStyle = col; for (let k = 0; k < 6; k++){ ctx.save(); ctx.rotate(k*TAU/6); ctx.fillRect(r*0.45, -8, r*0.5, 16); ctx.restore(); } ctx.fillStyle = '#201C25'; ctx.beginPath(); ctx.arc(0, 0, r*0.42, 0, TAU); ctx.fill(); ctx.restore(); }
function reel4(){
  const bg = ctx.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#1A0B3A'); bg.addColorStop(1, '#3B0F4A'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // confetti stripes (90s)
  for (let k = 0; k < 40; k++){ const x = (rnd(k)*W + T*30*(k % 3 + 1)) % (W + 200) - 100, y = rnd(k + 50)*H; ctx.save(); ctx.translate(x, y); ctx.rotate(rnd(k + 70)*TAU); ctx.fillStyle = MEM[k % 5]; ctx.globalAlpha = 0.7; ctx.fillRect(-30, -6, 60, 12); ctx.restore(); }
  // cassette body
  const cx = 540, cy = 860, bw = 900, bh = 580; ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.04);
  ctx.fillStyle = '#2A2630'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-bw/2, -bh/2, bw, bh, 36) : ctx.rect(-bw/2, -bh/2, bw, bh); ctx.fill();
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-bw/2 + 40, -bh/2 + 40, bw - 80, 330, 20) : ctx.rect(-bw/2 + 40, -bh/2 + 40, bw - 80, 330); ctx.fill();
  ctx.fillStyle = '#F8F7F8'; ctx.fillRect(-bw/2 + 40, -bh/2 + 40, bw - 80, 90);
  ctx.font = DISP(46); ctx.textAlign = 'left'; ctx.fillStyle = '#201C25'; ctx.fillText('HORST MIXTAPE', -bw/2 + 70, -bh/2 + 104); ctx.textAlign = 'right'; ctx.fillStyle = C.red; ctx.fillText('VOL. 04', bw/2 - 70, -bh/2 + 104);
  ctx.fillStyle = '#201C25'; ctx.fillRect(-300, -60, 600, 180); // window
  // tape wound: left reel shrinks, right grows over the loop
  const p = (T % 5)/5, ang = T*6;
  ctx.fillStyle = '#5A3A2A'; ctx.beginPath(); ctx.arc(-170, 30, 70 + (1 - p)*50, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(170, 30, 70 + p*50, 0, TAU); ctx.fill();
  reel(-170, 30, 62, ang, C.red); reel(170, 30, 62, ang, C.red);
  ctx.fillStyle = '#5A3A2A'; ctx.fillRect(-170, 95, 340, 10);
  ctx.fillStyle = '#F8F7F8'; ctx.font = LAB(26); ctx.textAlign = 'center'; ls(ctx, 6); ctx.fillText('A · MONSTERIDEEN · 60 MIN', 0, 200); ctx.fillText('SEIT 2004', 0, 250);
  ctx.restore();
  // VU meter bars
  for (let k = 0; k < 18; k++){ const v = 0.3 + 0.7*Math.abs(Math.sin(T*9 + k*0.8))*(0.5 + 0.5*rnd(k + Math.floor(T*12))), hgt = v*300; const col = k > 14 ? C.red : k > 10 ? '#FFE600' : '#39FF14'; ctx.fillStyle = col; ctx.fillRect(120 + k*48, 1500 - hgt, 34, hgt); }
  ctx.save(); ls(ctx, 6); text('REC ●', 120, 1580, LAB(30), (T % 1) < 0.5 ? C.red : '#F8F7F8', 'left', 1, 6); text('SIDE A', W - 120, 1580, LAB(30), '#F8F7F8', 'right', 1, 6); ctx.restore();
  text('Alte Schule. Neue Ideen.', 540, 1760, F(700, 56), C.white, 'center', 1, -1.5);
}
function audio4(add){
  // 90 BPM boom-bap with cassette hiss, 5 s = 7.5 beats, written for a seamless loop
  add(0, (d,w) => noise(d, w, 'bandpass', 3000, 0.4, 0.03, 5.0, 0.01));
  const b = 60/90;
  for (let k = 0; k < 8; k++){ const tb = k*b; if (tb >= 5) break; add(tb, (d,w) => kick(d, w, 1.0)); if (k % 2) add(tb, (d,w) => noise(d, w, 'bandpass', 1400, 0.6, 0.5, 0.2)); add(tb + b/2, (d,w) => hat(d, w, 0.12)); if (k % 2 === 0) add(tb + b*0.75, (d,w) => kick(d, w, 0.6));
    add(tb, (d,w) => tone(d, w, 'sine', [55, 55, 65.4, 49][Math.floor(k/2) % 4], 0.2, 0.4, 0.01)); }
  add(0, (d,w) => [1, 1.19, 1.5, 1.78].forEach(m => tone(d, w, 'triangle', 220*m, 0.05, 1.8, 0.1, 2500))); add(2.67, (d,w) => [1, 1.19, 1.5, 1.78].forEach(m => tone(d, w, 'triangle', 196*m, 0.05, 1.8, 0.1, 2500)));
}

// =====================================================================
// REEL 5 · ES WAR EINMAL · Herr Thaten reist um die Welt (Bilderbuch-Panorama)
// =====================================================================
const PAPER = '#F3E9D2', INK = '#2B2420';
const STATIONS = [
  { name:'Zuhause im Schwarzwald', line:'Mit einem Rucksack voller Skizzenbücher …', kind:'wald' },
  { name:'Ein Dorf am Meer',       line:'… ein Logo für die Fischer. Stand sogar in der Zeitung.', kind:'meer' },
  { name:'Die große Stadt',        line:'… bunte Muster für den Spielplatz der Kinder.', kind:'stadt' },
  { name:'Asien',                  line:'… schönere Taschen für die Handwerker.', kind:'asien' },
  { name:'Die Savanne',            line:'… alte Muster, neue Designs für die Maasai.', kind:'savanne' },
  { name:'Wieder zuhause',         line:'… ein Kopf voller Ideen. Und eine kleine Firma.', kind:'heim' },
];
const ST_T0 = 1.8, ST_D = 1.65, ST_END = ST_T0 + STATIONS.length*ST_D; // 11.7
function fir(x, y, h, col){ ctx.fillStyle = col; for (let k = 0; k < 3; k++){ const w = h*(0.55 - k*0.12), yy = y - k*h*0.28; ctx.beginPath(); ctx.moveTo(x, yy - h*0.5); ctx.lineTo(x + w/2, yy); ctx.lineTo(x - w/2, yy); ctx.closePath(); ctx.fill(); } ctx.fillRect(x - h*0.05, y, h*0.1, h*0.14); }
function station(i, x0){ // draws one 1080-wide panel starting at x0, ground at y=1400
  const s = STATIONS[i], g = 1400; ctx.save(); ctx.translate(x0, 0); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineJoin = 'round';
  if (s.kind === 'wald' || s.kind === 'heim'){ for (let k = 0; k < 7; k++) fir(120 + k*140 + (k % 2)*40, g - 20 - (k % 3)*30, 220 + rnd(k + i*9)*120, k % 2 ? '#2F4A35' : '#3E6245');
    ctx.fillStyle = '#C9553D'; ctx.fillRect(760, g - 220, 220, 200); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(730, g - 220); ctx.lineTo(870, g - 340); ctx.lineTo(1010, g - 220); ctx.closePath(); ctx.fill();
    if (s.kind === 'heim'){ ctx.fillStyle = PAPER; ctx.fillRect(790, g - 190, 160, 70); ctx.font = DISP(40); ctx.textAlign = 'center'; ctx.fillStyle = INK; ctx.fillText('horst.', 870, g - 140); } }
  if (s.kind === 'meer'){ ctx.fillStyle = '#4F8FB3'; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.moveTo(0, g - 40 + k*22); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, g - 40 + k*22 + Math.sin(x*0.03 + T*3 + k)*14); ctx.lineTo(W, g + 10); ctx.lineTo(0, g + 10); ctx.closePath(); ctx.globalAlpha = 0.6; ctx.fill(); } ctx.globalAlpha = 1;
    ctx.fillStyle = '#C9553D'; ctx.beginPath(); ctx.moveTo(300, g - 80); ctx.lineTo(620, g - 80); ctx.lineTo(560, g - 10); ctx.lineTo(360, g - 10); ctx.closePath(); ctx.fill(); ctx.fillStyle = INK; ctx.fillRect(455, g - 320, 10, 240); ctx.fillStyle = PAPER; ctx.beginPath(); ctx.moveTo(470, g - 310); ctx.lineTo(620, g - 120); ctx.lineTo(470, g - 120); ctx.closePath(); ctx.fill(); ctx.stroke();
    // the fish logo on a sign
    ctx.fillStyle = PAPER; ctx.fillRect(740, g - 420, 280, 200); ctx.strokeRect(740, g - 420, 280, 200); ctx.fillStyle = INK; ctx.fillRect(870, g - 220, 14, 220);
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.ellipse(870, g - 330, 80, 42, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(945, g - 330); ctx.lineTo(990, g - 370); ctx.lineTo(990, g - 290); ctx.closePath(); ctx.fill(); ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(830, g - 340, 8, 0, TAU); ctx.fill();
    ctx.font = LAB(18); ctx.textAlign = 'center'; ctx.fillStyle = INK; ls(ctx, 3); ctx.fillText('FISCHER-KOOPERATIVE', 880, g - 240); }
  if (s.kind === 'stadt'){ [[60, 560], [200, 420], [330, 700], [520, 500], [660, 640], [820, 380], [940, 580]].forEach(([x, h], k) => { ctx.fillStyle = k % 2 ? '#8C8A93' : '#6F6D78'; ctx.fillRect(x, g - h, 120, h); ctx.fillStyle = '#FFE37A'; for (let r = 0; r < h/60 - 1; r++) for (let c = 0; c < 2; c++) if (rnd(x + r*7 + c) > 0.4) ctx.fillRect(x + 22 + c*52, g - h + 30 + r*60, 24, 30); });
    // playground wall with painted pattern + swing
    ctx.fillStyle = '#F8F7F8'; ctx.fillRect(300, g - 260, 520, 240); MEM.forEach((col, k) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(360 + k*105, g - 140, 40, 0, TAU); ctx.fill(); ctx.fillRect(330 + k*105, g - 70, 60, 28); });
    ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(880, g); ctx.lineTo(940, g - 300); ctx.lineTo(1000, g); ctx.stroke(); const sw = Math.sin(T*2.6)*40; ctx.beginPath(); ctx.moveTo(940, g - 300); ctx.lineTo(940 + sw, g - 80); ctx.stroke(); ctx.fillStyle = C.red; ctx.fillRect(910 + sw, g - 90, 60, 16); }
  if (s.kind === 'asien'){ ctx.fillStyle = '#B8362F'; ctx.beginPath(); ctx.moveTo(380, g - 320); ctx.quadraticCurveTo(540, g - 300, 700, g - 320); ctx.lineTo(640, g - 420); ctx.quadraticCurveTo(540, g - 400, 440, g - 420); ctx.closePath(); ctx.fill(); ctx.fillRect(420, g - 420, 240, 10); ctx.fillStyle = '#7A2A22'; ctx.fillRect(440, g - 320, 200, 320); ctx.fillStyle = '#B8362F'; ctx.beginPath(); ctx.moveTo(340, g - 520); ctx.quadraticCurveTo(540, g - 490, 740, g - 520); ctx.lineTo(660, g - 600); ctx.quadraticCurveTo(540, g - 580, 420, g - 600); ctx.closePath(); ctx.fill();
    for (let k = 0; k < 3; k++){ const lx = 150 + k*110, ly = g - 500 + Math.sin(T*2 + k)*10; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx, g - 700); ctx.lineTo(lx, ly - 60); ctx.stroke(); ctx.fillStyle = C.red; ctx.beginPath(); ctx.ellipse(lx, ly, 42, 58, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFE37A'; ctx.fillRect(lx - 10, ly + 58, 20, 30); }
    // handbag + jewellery on a market table
    ctx.fillStyle = '#8B5A2B'; ctx.fillRect(760, g - 120, 280, 20); ctx.fillRect(790, g - 100, 16, 100); ctx.fillRect(994, g - 100, 16, 100);
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(800, g - 260, 150, 140, 18) : ctx.rect(800, g - 260, 150, 140); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(875, g - 260, 46, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#FFE37A'; ctx.beginPath(); ctx.arc(875, g - 200, 14, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#FFE37A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(1000, g - 180, 34, 0, TAU); ctx.stroke(); }
  if (s.kind === 'savanne'){ ctx.fillStyle = '#F2A33A'; ctx.beginPath(); ctx.arc(760, g - 560, 190, 0, TAU); ctx.fill(); ctx.fillStyle = '#C98B3A'; ctx.fillRect(0, g - 30, W, 30);
    [[200, 1.0], [560, 0.7]].forEach(([x, sc]) => { ctx.fillStyle = INK; ctx.fillRect(x - 10*sc, g - 360*sc, 20*sc, 360*sc); ctx.beginPath(); ctx.moveTo(x, g - 300*sc); ctx.lineTo(x + 120*sc, g - 420*sc); ctx.moveTo(x, g - 300*sc); ctx.lineTo(x - 140*sc, g - 400*sc); ctx.lineWidth = 14*sc; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = '#4B5A2E'; ctx.beginPath(); ctx.ellipse(x, g - 430*sc, 230*sc, 60*sc, 0, 0, TAU); ctx.fill(); });
    // a shuka cloth with pattern, old and new
    ctx.fillStyle = '#B8362F'; ctx.fillRect(820, g - 330, 220, 300); ctx.strokeStyle = INK; ctx.lineWidth = 6; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(820, g - 300 + k*70); ctx.lineTo(1040, g - 300 + k*70); ctx.stroke(); ctx.beginPath(); ctx.moveTo(840 + k*55, g - 330); ctx.lineTo(840 + k*55, g - 30); ctx.stroke(); }
    ctx.fillStyle = '#F8F7F8'; ctx.fillRect(840, g - 230, 180, 90); ctx.font = DISP(40); ctx.textAlign = 'center'; ctx.fillStyle = INK; ctx.fillText('NEU', 930, g - 170); }
  ctx.restore();
}
function reel5(){
  if (T >= ST_END){ endCard(ST_END); return; }
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  // paper grain + vignette
  ctx.fillStyle = 'rgba(43,36,32,.06)'; for (let k = 0; k < 500; k++) ctx.fillRect(rnd(k)*W, rnd(k + 900)*H, 3, 3);
  if (T < ST_T0){ // book cover
    const a = eo(seg(T, 0.1, 0.6)); ctx.save(); ctx.translate(540, 900); ctx.rotate(-0.02); ctx.fillStyle = '#B8362F'; ctx.fillRect(-400, -560, 800, 1120); ctx.fillStyle = '#8F2A24'; ctx.fillRect(-400, -560, 60, 1120); ctx.strokeStyle = '#FFE37A'; ctx.lineWidth = 6; ctx.strokeRect(-310, -480, 640, 960); ctx.restore();
    text('Es war einmal …', 580, 640 + (1-a)*20, `italic 700 72px Georgia, "Times New Roman", serif`, '#FFE37A', 'center', a);
    const b = eo(seg(T, 0.6, 1.1)); text('ein Mann namens', 580, 800 + (1-b)*20, F(700, 54), PAPER, 'center', b, -1); ctx.save(); ctx.font = DISP(fitDisp('HERR THATEN.', 560, 120)); ctx.textAlign = 'center'; ctx.fillStyle = PAPER; ctx.globalAlpha = b; ctx.fillText('HERR THATEN.', 580, 960); ctx.restore();
    drawSignet(ctx, 580, 1200, 180*b, '#FFE37A');
    text('Eine wahre Geschichte. Fast.', 580, 1330, `italic 600 40px Georgia, "Times New Roman", serif`, PAPER, 'center', eo(seg(T, 1.2, 1.6)));
    return;
  }
  // panorama: camera moves one panel per station, eased, HORST walks ahead
  const k = Math.min(STATIONS.length - 1, Math.floor((T - ST_T0)/ST_D)), lt = T - ST_T0 - k*ST_D, p = eio(seg(lt, 0, 0.7));
  const cam = (k + p)*W*(k < STATIONS.length - 1 ? 1 : 0) + (k === STATIONS.length - 1 ? k*W : 0);
  const camX = k < STATIONS.length - 1 ? lerp(k*W, (k + 1)*W, p) - W*0 : k*W; // camera left edge
  ctx.save(); ctx.translate(-camX + W*0, 0);
  // sky band + ground path through all panels
  ctx.fillStyle = '#E7D9B8'; ctx.fillRect(0, 1400, STATIONS.length*W, 520);
  for (let i = 0; i < STATIONS.length; i++) if (Math.abs(i*W - camX) < W*1.2) station(i, i*W);
  ctx.setLineDash([24, 26]); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 1480); ctx.lineTo(STATIONS.length*W, 1480); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  // HORST walks (head + backpack straps), bouncing while the camera moves
  const walking = p < 1 && k < STATIONS.length - 1, bob = walking ? Math.abs(Math.sin(T*16))*22 : Math.sin(T*3)*4;
  const hx = 300, hy = 1300 - bob;
  ctx.fillStyle = '#5A3A2A'; ctx.fillRect(hx - 60, hy + 60, 120, 160); ctx.fillStyle = INK; ctx.fillRect(hx - 44, hy + 60, 14, 160); ctx.fillRect(hx + 30, hy + 60, 14, 160); // backpack body + straps
  drawHead(hx, hy, 340, walking ? Math.sin(T*16)*0.05 : 0);
  if (!walking || k === STATIONS.length - 1){ ctx.fillStyle = INK; ctx.font = F(800, 30); ctx.textAlign = 'center'; ctx.fillText('✎', hx + 150, hy - 120); }
  // caption: station name + line, in the top third like a picture-book page
  const ca = eio(seg(lt, 0.55, 0.95)) * (k < STATIONS.length - 1 ? 1 - seg(lt, ST_D - 0.25, ST_D) : 1);
  ctx.save(); ls(ctx, 5); text(`KAPITEL ${k + 1}`, 540, 300, LAB(30), '#B8362F', 'center', ca, 5); ctx.restore();
  ctx.save(); ctx.font = DISP(fitDisp(STATIONS[k].name.toUpperCase(), 920, 96)); ctx.textAlign = 'center'; ctx.fillStyle = INK; ctx.globalAlpha = ca; ctx.fillText(STATIONS[k].name.toUpperCase(), 540, 420 + (1 - ca)*16); ctx.restore();
  text(STATIONS[k].line, 540, 520 + (1 - ca)*16, `italic 600 42px Georgia, "Times New Roman", serif`, INK, 'center', ca);
  if (k === STATIONS.length - 1 && lt > 0.9){ const a = eo(seg(lt, 0.9, 1.3)); ctx.save(); ctx.translate(540, 1700); ctx.rotate(-0.05); ctx.scale(lerp(1.6, 1, a), lerp(1.6, 1, a)); ctx.globalAlpha = a; ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.strokeRect(-430, -70, 860, 140); ctx.fillStyle = C.red; ctx.font = DISP(44); ctx.textAlign = 'center'; ctx.fillText('THATENDRANG UND HELDENTHATEN.', 0, -4); ctx.font = LAB(28); ls(ctx, 6); ctx.fillText('SEIT 2004', 0, 46); ctx.restore(); }
}
function audio5(add){
  // music box: triangle melody over a soft 100 BPM brush beat, page flips at each chapter
  const mel = [523.3, 659.3, 784, 659.3, 587.3, 523.3, 440, 523.3], b = 60/100;
  for (let k = 0; k*b/2 < ST_END; k++){ const tb = k*b/2; add(tb, (d,w) => tone(d, w, 'triangle', mel[k % 8]*(k % 16 >= 8 ? 0.75 : 1), 0.07, 0.5, 0.004)); add(tb, (d,w) => tone(d, w, 'sine', mel[k % 8]*2*(k % 16 >= 8 ? 0.75 : 1), 0.02, 0.3, 0.004)); }
  for (let k = 0; k*b < ST_END; k++){ const tb = k*b; add(tb, (d,w) => kick(d, w, 0.45)); add(tb + b/2, (d,w) => noise(d, w, 'highpass', 6000, 0.5, 0.08, 0.12)); add(tb, (d,w) => tone(d, w, 'sine', [130.8, 110, 87.3, 98][Math.floor(k/4) % 4], 0.14, 0.5, 0.01)); }
  add(0.1, (d,w) => noise(d, w, 'bandpass', 1800, 0.5, 0.25, 0.3));
  for (let i = 0; i < STATIONS.length; i++) add(ST_T0 + i*ST_D, (d,w) => { noise(d, w, 'bandpass', 2200, 0.4, 0.3, 0.25); tone(d, w, 'triangle', 1046.5, 0.08, 0.6, 0.004); });
  add(ST_T0 + 5*ST_D + 0.9, (d,w) => { kick(d, w, 1.1); clap(d, w); });
  add(ST_END, (d,w) => { kick(d, w, 1.2); crash(d, w); }); [220, 261.63, 329.63, 493.88].forEach(f => add(ST_END, (d,w) => tone(d, w, 'triangle', f, 0.07, 1.9, 0.06)));
}

// =====================================================================
// REEL 6 · GEH ZUM FELIX · word of mouth, three voices from the village, HORST tags along
// =====================================================================
function wrap(s, maxW, font){ ctx.save(); ctx.font = font; const out = []; let line = ''; s.split(' ').forEach(w => { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line){ out.push(line); line = w; } else line = t; }); if (line) out.push(line); ctx.restore(); return out; }
const VOICES = [
  { q:'„Wenn ich ein besonderes Design will, geh ich zum Felix.“', who:'Bäckerin, Kirchzarten', col:'#F2A33A', x:300, y:620, side:'left', hat:'cap' },
  { q:'„Wenn ich was richtig Kreatives brauche: zum Felix.“', who:'Geschäftsführer, Freiburg', col:'#4F8FB3', x:780, y:1000, side:'right', hat:'glasses' },
  { q:'„Und wenn die Marke mal Mut braucht … auch zum Felix.“', who:'Gründerin, Schwarzwald', col:'#7CB36A', x:300, y:1380, side:'left', hat:'bun' },
];
const V_T = [0.6, 2.6, 4.6], OUT6 = 7.0, H6 = 7.3;
function face(x, y, r, col, hat, talk){
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-r*0.3, -r*0.1, r*0.09, 0, TAU); ctx.arc(r*0.3, -r*0.1, r*0.09, 0, TAU); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = r*0.08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, r*0.15, r*0.4, 0.15*Math.PI, 0.85*Math.PI); ctx.stroke();
  if (talk){ ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, r*0.45, r*0.16, r*0.1*(0.6 + 0.4*Math.abs(Math.sin(T*22))), 0, 0, TAU); ctx.fill(); }
  if (hat === 'cap'){ ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, -r*0.35, r*0.8, Math.PI, 0); ctx.fill(); ctx.fillRect(-r*0.9, -r*0.4, r*1.3, r*0.14); }
  if (hat === 'glasses'){ ctx.strokeStyle = INK; ctx.lineWidth = r*0.07; ctx.strokeRect(-r*0.55, -r*0.32, r*0.46, r*0.4); ctx.strokeRect(r*0.09, -r*0.32, r*0.46, r*0.4); }
  if (hat === 'bun'){ ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, -r*0.95, r*0.32, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0, -r*0.3, r*0.85, Math.PI*1.1, Math.PI*1.9); ctx.fill(); }
  ctx.restore();
}
function bubble(v, t0, i){
  const p = eback(seg(T, t0, t0 + 0.4)), outp = seg(T, OUT6 + i*0.08, OUT6 + 0.35 + i*0.08); if (p <= 0 || outp >= 1) return;
  const font = `italic 600 44px Georgia, "Times New Roman", serif`, lines = wrap(v.q, 560, font), bw = 660, bh = lines.length*56 + 120;
  const left = v.side === 'left', bx = left ? 250 : W - 250 - bw, by = v.y - bh/2, fx = left ? 130 : W - 130;
  ctx.save(); ctx.globalAlpha = 1 - outp; ctx.translate(left ? -outp*500 : outp*500, 0);
  face(fx, v.y + bh/2 - 60, 70, v.col, v.hat, T < t0 + 2.2);
  ctx.save(); ctx.translate(bx + bw/2, by + bh/2); ctx.scale(p, p); ctx.translate(-(bx + bw/2), -(by + bh/2));
  ctx.fillStyle = C.white; ctx.shadowColor = 'rgba(32,28,37,.18)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 36) : ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.beginPath(); if (left){ ctx.moveTo(bx + 40, by + bh - 70); ctx.lineTo(bx - 30, by + bh - 20); ctx.lineTo(bx + 40, by + bh - 30); } else { ctx.moveTo(bx + bw - 40, by + bh - 70); ctx.lineTo(bx + bw + 30, by + bh - 20); ctx.lineTo(bx + bw - 40, by + bh - 30); } ctx.closePath(); ctx.fill();
  lines.forEach((l, k) => { const parts = l.split('Felix'); let x = bx + 50; ctx.font = font; ctx.textAlign = 'left'; parts.forEach((pt, j) => { ctx.fillStyle = INK; ctx.fillText(pt, x, by + 86 + k*56); x += ctx.measureText(pt).width; if (j < parts.length - 1){ ctx.fillStyle = C.red; ctx.font = `700 44px Georgia, "Times New Roman", serif`; ctx.fillText('Felix', x, by + 86 + k*56); x += ctx.measureText('Felix').width; ctx.font = font; } }); });
  ctx.save(); ls(ctx, 3); text(v.who.toUpperCase(), bx + 50, by + bh - 40, LAB(22), '#6F717A', 'left', 1, 3); ctx.restore();
  ctx.restore(); ctx.restore();
}
function reel6(){
  if (T >= 11.6){ endCard(11.6); return; }
  ctx.fillStyle = C.light; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(32,28,37,.05)'; for (let y = 60; y < H; y += 60) for (let x = 60; x < W; x += 60) ctx.fillRect(x, y, 4, 4);
  const a0 = eo(seg(T, 0.1, 0.5)); ctx.save(); ls(ctx, 6); text('MAN HÖRT SO EINIGES', 540, 300, LAB(30), C.red, 'center', a0*(1 - seg(T, OUT6, OUT6 + 0.3)), 6); ctx.restore();
  VOICES.forEach((v, i) => bubble(v, V_T[i], i));
  if (T >= H6){
    const p = eback(seg(T, H6, H6 + 0.5)); drawHead(540, 880, 560*p, Math.sin(T*2.5)*0.05);
    const a = eo(seg(T, H6 + 0.4, H6 + 0.7)); text('Sagt man so, hier bei uns.', 540, 1280 + (1-a)*20, `italic 600 54px Georgia, "Times New Roman", serif`, INK, 'center', a);
    if (T >= 8.9){ const b = eback(seg(T, 8.9, 9.3)); ctx.save(); ctx.translate(540, 1440); ctx.rotate(-0.04); ctx.scale(b, b); ctx.fillStyle = C.red; ctx.fillRect(-460, -70, 920, 140); ctx.fillStyle = C.white; ctx.font = DISP(fitDisp('UND DER HORST KOMMT MIT.', 860, 70)); ctx.textAlign = 'center'; ctx.fillText('UND DER HORST KOMMT MIT.', 0, 26); ctx.restore(); }
    if (T >= 10.0){ const c = eo(seg(T, 10.0, 10.4)); text('Felix Thatenhorst', 540, 1640 + (1-c)*20, F(800, 64), INK, 'center', c, -2); ctx.save(); ls(ctx, 5); text('STUDIO HORST · KIRCHZARTEN', 540, 1710 + (1-c)*20, LAB(28), '#6F717A', 'center', c, 5); ctx.restore(); }
  }
}
function audio6(add){
  // warm ukulele-ish plucks at 96 BPM, snaps on 2 and 4, a pop for every bubble
  const b = 60/96, chords = [[261.6, 329.6, 392], [220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7]];
  for (let k = 0; k*b/2 < 11.4; k++){ const tb = k*b/2, ch = chords[Math.floor(k/8) % 4], n = ch[k % 3]; add(tb, (d,w) => tone(d, w, 'triangle', n*(k % 2 ? 2 : 1), 0.08, 0.35, 0.003, 3000)); }
  for (let k = 0; k*b < 11.4; k++){ const tb = k*b; add(tb, (d,w) => kick(d, w, 0.4)); if (k % 2) add(tb, (d,w) => noise(d, w, 'bandpass', 2400, 1.2, 0.3, 0.07)); add(tb + b/2, (d,w) => hat(d, w, 0.06)); }
  V_T.forEach(t0 => add(t0, (d,w) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(500, w); o.frequency.exponentialRampToValueAtTime(900, w + 0.08); env(g, w, 0.18, 0.12, 0.002); o.connect(g); g.connect(d); o.start(w); o.stop(w + 0.15); }));
  add(OUT6, (d,w) => riser(d, w, 0.3, 0.15)); add(H6, (d,w) => { kick(d, w, 1.0); [261.6, 329.6, 392, 523.3].forEach((f, i) => tone(d, w + i*0.04, 'triangle', f, 0.08, 0.8, 0.004)); });
  add(8.9, (d,w) => { kick(d, w, 1.2); clap(d, w); });
  add(11.6, (d,w) => { kick(d, w, 1.2); crash(d, w); }); [220, 261.63, 329.63, 493.88].forEach(f => add(11.6, (d,w) => tone(d, w, 'triangle', f, 0.07, 1.9, 0.06)));
}

// ---------- the set ----------
const REELS = [
  { id:'vhs',     name:'VHS 1984',      tech:'Tape-Look + Video', dur:15, render:reel1, audio:audio1, hud:'RETRO', hudColor:() => C.white, file:'horst-vhs', still:5.6,
    desc:'Blauer Bildschirm, PLAY ▶, dann rauscht HORST ins Bild: echtes Monster-Video mit <b>Tracking-Streifen, Farbsaum und Scanlines</b>. „HORST – Das Original. SEIT 1984.“ Rotes Korrektur-Etikett: „Äh … seit 2004.“ Zurückspulen lohnt sich nicht.' },
  { id:'arcade',  name:'Arcade',        tech:'8-Bit-HORST',       dur:15, render:reel2, audio:audio2, hud:'INSERT COIN', hudColor:() => C.white, file:'horst-arcade', still:6.0,
    desc:'Münze rein. Stage 1: Langweilige Marke. <b>Pixel-HORST</b> (der echte Kopf, auf 26 Pixel geschrumpft) läuft ein, schießt rote Ideen, springt und zerlegt den grauen Gegner. STAGE CLEAR, Bonus: Monsteridee. Mit Chiptune.' },
  { id:'memphis', name:'Total krass',   tech:'90er-Memphis',      dur:15, render:reel3, audio:audio3, hud:'90ER', hudColor:() => C.dark, file:'horst-90er', still:6.2,
    desc:'Memphis-Muster, Konfetti, Title-Cards wie im Sitcom-Intro: TOTAL KRASS, VOLL FETT, ECHT GEIL. Dann <b>HORST im Strahlenkranz</b>. „Die 90er wollen ihre Ideen zurück. Kriegen sie nicht.“ Eurodance 132 BPM.' },
  { id:'mixtape', name:'Mixtape',       tech:'Loop 5 s',          dur:5,  render:reel4, audio:audio4, hud:'LOOP', hudColor:() => C.white, file:'horst-mixtape', still:2.0,
    desc:'Kassette „HORST MIXTAPE VOL. 04“, Spulen drehen, Band wandert von links nach rechts, VU-Meter tanzt. <b>Boom-Bap mit Bandrauschen</b>, nahtlos als Loop. „Alte Schule. Neue Ideen.“' },
  { id:'maerchen', name:'Es war einmal', tech:'Bilderbuch-Panorama', dur:15, render:reel5, audio:audio5, hud:'KAPITEL', hudColor:() => INK, file:'horst-es-war-einmal', still:5.5,
    desc:'Die Geschichte von Herrn Thaten als Bilderbuch: Buchdeckel, dann wandert HORST mit Rucksack durch sechs Kapitel: <b>Schwarzwald, Dorf am Meer, große Stadt, Asien, Savanne, wieder zuhause</b>. Jedes Kapitel ein gezeichnetes Panorama mit einer Zeile aus der Geschichte. Am Ende der Stempel „Thatendrang und Heldenthaten. Seit 2004.“ Spieluhr-Melodie.' },
  { id:'felix', name:'Geh zum Felix', tech:'Mundpropaganda', dur:15, render:reel6, audio:audio6, hud:'MAN SAGT', hudColor:() => C.dark, file:'horst-geh-zum-felix', still:5.2,
    desc:'Drei Stimmen aus dem Dorf in Sprechblasen: „Wenn ich ein besonderes Design will, geh ich zum <b>Felix</b>.“ „Wenn ich was richtig Kreatives brauche: zum Felix.“ „Und wenn die Marke mal Mut braucht … auch zum Felix.“ Dann HORST: „Sagt man so, hier bei uns. Und der HORST kommt mit.“ Felix Thatenhorst, Studio HORST, Kirchzarten. Ukulele-Plucks und Fingerschnipsen.' },
];
