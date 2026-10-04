// ---------- Ideenatlas: A12, A04, C14 and the E06 end card (cards from content-pool/04-horst-felix/chatgpt-ideenatlas) ----------
const MEDIA = ['v-evo', 'v-monster', 'evo-a.jpg', 'evo-b.jpg', 'evo-c.jpg', 'evo-screens.jpg', 'evo-web.jpg'];

// A12 — Eine Idee. Viele Auftritte. One sign (EVOMOTIV) carried through real applications
const DECK = [
  { k:'evo-a.jpg',       label:'Auf Papier.' },
  { k:'evo-b.jpg',       label:'Im Alltag.' },
  { k:'evo-c.jpg',       label:'In der Zeitung.' },
  { k:'evo-screens.jpg', label:'In der Präsentation.' },
  { k:'evo-web.jpg',     label:'Und auf dem Bildschirm.' },
];
const A12 = { logo:3.0, step:1.15 };
A12.deckEnd = A12.logo + DECK.length*A12.step;
function vA12(){
  if (T < A12.logo){
    bg(C.white);
    const el = M['v-evo']; if (ready(el)) drawContain(el, 90, 520, 900, 1125);
    lines(['Eine gute Idee …'], F(800, 92), C.dark, 540, 460, 0, 0.2, 0, 'center');
    lines(['erkennt man.'], F(800, 92), C.red, 540, 570, 0, 1.2, 0, 'center');
    const wp = eio(seg(T, 2.7, 3.0)); if (wp > 0){ ctx.fillStyle = C.dark; ctx.fillRect(0, H*(1 - wp), W, H*wp); }
    return true;
  }
  if (T < A12.deckEnd){
    bg(C.dark); sig(C.white, 99);
    const n = Math.min(DECK.length - 1, Math.floor((T - A12.logo)/A12.step));
    for (let i = 0; i <= n; i++){
      const t0 = A12.logo + i*A12.step, p = eo(seg(T, t0, t0 + 0.45)), el = M[DECK[i].k];
      const depth = n - i, rot = (rnd(i*7 + 3) - .5)*0.12 + (1 - p)*0.35*(i % 2 ? 1 : -1);
      const cw = 900 - depth*30, ch = 1000 - depth*34, cx = 540 + (rnd(i*5) - .5)*40, cy = lerp(1900 + ch/2, 860 - depth*26, p);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
      ctx.fillStyle = C.white; rrect(ctx, -cw/2 - 14, -ch/2 - 14, cw + 28, ch + 28, 10); ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.beginPath(); ctx.rect(-cw/2, -ch/2, cw, ch); ctx.clip();
      if (ready(el)) drawCover(el, -cw/2, -ch/2, cw, ch);
      if (depth > 0){ ctx.fillStyle = `rgba(32,28,37,${Math.min(0.6, depth*0.25)})`; ctx.fillRect(-cw/2, -ch/2, cw, ch); }
      ctx.restore();
    }
    const t0 = A12.logo + n*A12.step;
    pill(DECK[n].label, 540, 1480, n === DECK.length - 1 ? C.red : C.white, n === DECK.length - 1 ? C.white : C.dark, eo(seg(T, t0 + 0.25, t0 + 0.5)));
    return;
  }
  if (T < 11.6){
    bg(C.dark); sig(C.white, A12.deckEnd);
    lines(['Ich entwickle', 'die Idee dahinter.'], F(800, 96), C.white, 62, 760, 110, A12.deckEnd + 0.1, 0.2);
    lines(['Und gestalte,', 'was daraus wird.'], F(800, 96), C.red, 62, 1040, 110, A12.deckEnd + 0.8, 0.2);
    ctx.save(); ls(ctx, 4); text('BEISPIEL: EVOMOTIV · AUS MEINER ZEIT BEI JUNG & HUNGRIG', 62, 1400, LAB(22), C.white, 'left', 0.55*eo(seg(T, A12.deckEnd + 1.2, A12.deckEnd + 1.5)), 4); ctx.restore();
    return;
  }
  endcard(11.6);
}

// A04 — Kirchzarten hast vergessen
const CITIES = [
  { pre:'Große Ideen kommen aus', name:'BERLIN.',   geo:'52,52° N · 13,40° E', t:0.2, b:C.dark,  fg:C.white },
  { pre:'Aus',                    name:'LONDON.',   geo:'51,51° N · 0,13° W',  t:1.8, b:C.light, fg:C.dark },
  { pre:'Aus',                    name:'NEW YORK.', geo:'40,71° N · 74,01° W', t:3.2, b:C.dark,  fg:C.white },
];
const A04 = { cut:4.7, bubble:5.4, end:9.4 };
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
function vA04(){
  if (T < A04.cut){
    const i = T < CITIES[1].t ? 0 : T < CITIES[2].t ? 1 : 2, c = CITIES[i];
    bg(c.b); sig(c.fg, 99);
    ctx.save(); ctx.strokeStyle = c.fg; ctx.globalAlpha = 0.08; ctx.lineWidth = 2;
    for (let k = 0; k < 9; k++){ const x = 62 + k*119.5; ctx.beginPath(); ctx.moveTo(x, 200); ctx.lineTo(x, H - 140); ctx.stroke(); }
    ctx.restore();
    lines([c.pre], F(700, 64), c.fg, 540, 780, 0, c.t, 0, 'center');
    slamWord(c.name, fitDisp(c.name, 940, 300), 'center', 1020, c.fg, c.t + 0.2, 0.05, 5 + i*20);
    ctx.save(); ls(ctx, 5); text(c.geo, 540, 1150, LAB(30), C.red, 'center', eo(seg(T, c.t + 0.5, c.t + 0.75)), 5); ctx.restore();
    return c.b === C.light;
  }
  if (T < A04.end){
    bg('#2B2621');
    const el = M['v-monster'];
    if (ready(el)){
      const [iw, ih] = dims(el), h = 1240, w = iw*h/ih, x = (W - w)/2, y = 640;
      ctx.drawImage(el, x, y, w, h);
      const fade = (y0, y1, a0, a1) => { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a0); g.addColorStop(1, a1); ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0); };
      fade(y - 1, y + 220, 'rgba(43,38,33,1)', 'rgba(43,38,33,0)');
    }
    bubble(['Kirchzarten', 'hast vergessen.'], 540, 300, seg(T, A04.bubble, A04.bubble + 0.35));
    pill('47,96° N · 7,95° E', 540, 1560, C.red, C.white, eo(seg(T, A04.bubble + 1.0, A04.bubble + 1.3)));
    const fl = 1 - seg(T, A04.cut, A04.cut + 0.2); if (fl > 0){ ctx.fillStyle = `rgba(255,66,85,${fl})`; ctx.fillRect(0, 0, W, H); }
    return;
  }
  endcard(A04.end, 'Monsterideen®.', 'Aus Kirchzarten.');
}

// C14 — Zettelberge: many ideas, one stays
const NOTES = ['Maskottchen?', 'Mehr Rot!', 'Kampagne im Wald', 'Logo in Bewegung', 'Neuer Claim?', 'Plakat 18/1', 'Dose mit Gesicht', 'Nur Typo?', 'Film mit Kuh', 'Riso-Look', 'Kleinstes Fest der Welt', 'Alles neu?', 'Website zuerst', 'Ein Wort. Groß.', 'Stempel?', 'Hörner dran', 'Zine!', 'Mehr Weißraum', 'Tour durchs Dorf', 'Sticker'];
const PAPER = ['#FFF4BF', '#FFFFFF', '#FDE2E5', '#E6EEF9', '#F2F0EA'];
const KEEP = { label:'Die Idee, die bleibt.', t:4.2 };
function note(x, y, w, h, rot, s, label, color, ring){
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.shadowColor = 'rgba(32,28,37,.25)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
  ctx.fillStyle = color; ctx.fillRect(-w/2, -h/2, w, h); ctx.shadowColor = 'transparent';
  if (ring){ ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.strokeRect(-w/2 + 5, -h/2 + 5, w - 10, h - 10); }
  const f = F(800, 38); layoutWords(label, f, w - 50, 46, -w/2 + 26, -h/2 + 70).forEach(o => text(o.w, o.x, o.y, f, ring ? C.red : C.dark, 'left', 1, -1));
  ctx.restore();
}
function vC14(){
  if (T >= 9.8){ endcard(9.8); return; }
  bg(C.light); sig(C.dark);
  const sweep = seg(T, 5.6, 6.6);
  NOTES.forEach((s, i) => {
    const t0 = 0.6 + i*0.17, p = seg(T, t0, t0 + 0.3); if (p <= 0) return;
    const x = 160 + rnd(i*3.3)*760, y = 700 + rnd(i*7.1)*900, rot = (rnd(i*1.9) - .5)*0.5;
    const out = eio(clamp((sweep - (i % 5)*0.06)/0.7, 0, 1)), dir = rnd(i*2.7) < .5 ? -1 : 1;
    note(x + dir*out*1300, y - out*200, 300, 230, rot + dir*out*0.8, lerp(1.5, 1, eback(p)), s, PAPER[i % PAPER.length], false);
  });
  const kp = seg(T, KEEP.t, KEEP.t + 0.3);
  if (kp > 0){ const g = eio(seg(T, 6.0, 6.9));
    note(lerp(560, 540, g), lerp(1150, 1080, g), 300, 230, lerp(-0.12, 0, g), lerp(1.5, 1, eback(kp))*lerp(1, 2.1, g), KEEP.label, C.white, T > 6.2); }
  if (T < 4.4) lines(['Ideen habe ich viele.'], F(800, 84), C.dark, 62, 560, 0, 0.2, 0);
  else if (T < 7.2){ const f = F(800, 62); wordsIn(layoutWords('Meine Arbeit ist, mit dir die eine zu finden, die deine Marke weiterbringt.', f, 950, 74, 62, 500), f, C.dark, 4.5, 0.08, [5, 6]); }
  else { const size = fitDisp('DIE BEHALTEN WIR.', 950, 150); slamWord('DIE BEHALTEN WIR.', size, 'center', 1640, C.red, 7.3, 0.04, 17); }
  return true;
}

// E06 — end card to append to "Mein schwierigster Kunde" (Atlas S. 4: „Studio HORST. Jetzt auch mit Gesicht.“)
function vE06(){
  bg(C.dark);
  drawSignet(540, 700, 300, C.white, seg(T, 0, 0.7));
  lines(['Studio HORST.'], F(800, 86), C.white, 540, 1060, 0, 0.55, 0, 'center');
  lines(['Jetzt auch mit Gesicht.'], F(800, 86), C.red, 540, 1180, 0, 0.85, 0, 'center');
  pill('studio-horst.de', 540, 1320, C.white, C.dark, eo(seg(T, 1.3, 1.6)));
}

const VARIANTS = [
  { slug:'a12-eine-idee', name:'A12 Eine Idee', dur:14, end:11.6, draw:vA12, hits:[1.2, ...DECK.map((_, i) => A12.logo + i*A12.step), A12.deckEnd + 0.8],
    video:() => T < A12.logo ? { k:'v-evo', at:0.4 + T } : null },
  { slug:'a04-kirchzarten', name:'A04 Kirchzarten', dur:12, end:A04.end, draw:vA04, hits:[0.4, 2.0, 3.4, A04.cut, A04.bubble],
    video:() => T >= A04.cut && T < A04.end ? { k:'v-monster', at:0.6 + (T - A04.cut) } : { pre:{ k:'v-monster', at:0.6 } } },
  { slug:'c14-zettelberge', name:'C14 Zettel', dur:12, end:9.8, draw:vC14, hits:[KEEP.t, 5.6, 6.2, 7.3] },
  { slug:'e06-endkarte', name:'E06 Endkarte', dur:3.5, end:0.85, draw:vE06, hits:[0.55] },
];
