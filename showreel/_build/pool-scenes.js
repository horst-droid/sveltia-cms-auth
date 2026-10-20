// ---------- Pool: chronicle, brand myths, checklist, "Finde Felix" — material from content-pool ----------
const MEDIA = ['c-downtown.jpg', 'c-chilli.jpg', 'c-lebensretter.jpg', 'c-jh.jpg', 'c-zbp.jpg', 'c-evo.jpg', 'c-riva.jpg', 'c-ganter.jpg', 'c-rothaus.jpg', 'c-stempel.jpg', 'monsterbad.jpg'];

// 20 Thaten — years from "20 Thaten.docx"; 2006–2018 marked as Jung & Hungrig work (see Gut.docx)
const CHRON = [
  { y:2003, k:'c-downtown.jpg',     t:'Erstes Logo: Downtown Streetparty.', fit:true, bgc:'#FFF7C2' },
  { y:2004, k:'c-chilli.jpg',       t:'chilli Stadtmagazin. Erste Ausgabe.', fit:true, bgc:C.white },
  { y:2005, k:'c-lebensretter.jpg', t:'1000 Lebensretter. Kampagne für Organspende.' },
  { y:2006, k:'c-jh.jpg',           t:'Jung & Hungrig. Büro für Werbung und Design.', fit:true, bgc:'#1D1D1B', jh:true },
  { y:2007, k:'c-zbp.jpg',          t:'Zucker, Brot & Peitsche. Modelabel.', jh:true },
  { y:2008, k:'c-evo.jpg',          t:'EVOMOTIV. Von 4 zu 400 in 15 Jahren.', jh:true },
  { y:2009, k:'c-riva.jpg',         t:'Riva. Das Logo: von Hand gemalt.', fit:true, bgc:C.white, jh:true },
  { y:2012, k:'c-ganter.jpg',       t:'Das kleinste Oktoberfest der Welt.', jh:true },
  { y:2016, k:'c-rothaus.jpg',      t:'Rothaus. Das Jubiläumsjahr.', jh:true },
  { y:2018, big:['PITCH', 'GEWONNEN.'], t:'Landesgartenschau Neuenburg 2022.', jh:true },
  { y:2023, signet:true,            t:'Studio HORST. Zurück zur Idee.' },
  { y:2024, k:'c-stempel.jpg',      t:'20 Jahre Thatendrang und Heldenthaten.', fit:true, bgc:C.white },
];
const CH = { intro:1.3, step:0.95 };
CH.end = CH.intro + CHRON.length*CH.step;
function vChronik(){
  if (T < CH.intro){
    bg(C.dark); sig(C.white);
    const size = fitDisp('THATEN.', 900, 300);
    slamWord('20', size, 'center', 900, C.red, 0.15, 0.08, 3);
    slamWord('THATEN.', size, 'center', 900 + size*1.02, C.white, 0.4, 0.06, 13);
    text('Eine kleine Chronik.', 540, 900 + size*1.02 + 120, F(700, 56), C.white, 'center', eo(seg(T, 0.8, 1.05))*0.85, -1);
    return;
  }
  if (T >= CH.end){ endcard(CH.end, 'Und jetzt:', 'deine Marke?'); return; }
  const i = Math.floor((T - CH.intro)/CH.step), c = CHRON[i], t0 = CH.intro + i*CH.step;
  if (c.big){
    bg(C.red); const size = fitDisp('GEWONNEN.', 940, 260);
    slamWord(c.big[0], size, 'center', 760, C.white, t0 + 0.05, 0.05, 7); slamWord(c.big[1], size, 'center', 760 + size*1.05, C.dark, t0 + 0.25, 0.04, 27);
  } else if (c.signet){
    bg(C.dark); drawSignet(540, 760, 440, C.white, seg(T, t0, t0 + 0.7));
  } else {
    const el = M[c.k];
    if (c.fit){ bg(c.bgc); if (ready(el)) drawContain(el, 90, 260, 900, 900); }
    else { bg(C.dark); if (ready(el)) drawCover(el, 0, 0, W, H, lerp(1.1, 1.0, eo(seg(T, t0, t0 + CH.step)))); }
  }
  const g = ctx.createLinearGradient(0, 1080, 0, H); g.addColorStop(0, 'rgba(32,28,37,0)'); g.addColorStop(0.35, 'rgba(32,28,37,.92)'); g.addColorStop(1, 'rgba(32,28,37,1)');
  ctx.fillStyle = g; ctx.fillRect(0, 1080, W, H - 1080);
  const prev = i ? CHRON[i - 1].y : 2003, yr = Math.round(lerp(prev, c.y, eo(seg(T, t0, t0 + 0.28))));
  text(String(yr), 56, 1480, DISP(280), C.white, 'left', 1, 0);
  ctx.fillStyle = C.red; ctx.fillRect(62, 1512, 120*eio(seg(T, t0 + 0.1, t0 + 0.4)), 10);
  const cl = layoutWords(c.t, F(800, 54), 940, 64, 62, 1600); wordsIn(cl, F(800, 54), C.white, t0 + 0.12, 0.04, []);
  if (c.jh){ ctx.save(); ls(ctx, 5); text('MIT JUNG & HUNGRIG', 62, 1600 + cl[cl.length - 1].y - 1600 + 76, LAB(24), C.white, 'left', 0.6*eo(seg(T, t0 + 0.2, t0 + 0.4)), 5); ctx.restore(); }
  const wp = eio(seg(T, t0, t0 + 0.18)); if (wp < 1){ ctx.fillStyle = C.red; ctx.fillRect(W*wp, 0, W*(1 - wp), H); }
  return c.fit && c.bgc !== '#1D1D1B';
}

// Marken-Irrtümer — from "Free Guide.docx" (Die 5 größten Marken-Irrtümer im Mittelstand)
function lineSpans(list, font){
  ctx.save(); ctx.font = font; ls(ctx, -2);
  const rows = {}; list.forEach(o => { const w = ctx.measureText(o.w).width; const r = rows[o.y] || (rows[o.y] = { y:o.y, x0:o.x, x1:o.x + w }); r.x1 = Math.max(r.x1, o.x + w); });
  ctx.restore(); return Object.values(rows);
}
function irrtum(n, myth, ans, accent, small){
  return () => {
    if (T < 3.9){
      bg(C.light); sig(C.dark);
      ctx.save(); ls(ctx, 6); text(`MARKEN-IRRTUM 0${n}`, 62, 600, LAB(28), C.red, 'left', eo(seg(T, 0.1, 0.4)), 6); ctx.restore();
      const f = F(800, 100), list = layoutWords(myth, f, 950, 116, 62, 740);
      wordsIn(list, f, C.dark, 0.35, 0.16, []);
      lineSpans(list, f).forEach((r, i) => { ctx.fillStyle = C.red; ctx.fillRect(r.x0 - 8, r.y - 34, (r.x1 - r.x0 + 16)*eio(seg(T, 3.0 + i*0.12, 3.3 + i*0.12)), 14); });
      return true;
    }
    if (T < 7.8){
      bg(C.dark); sig(C.white);
      const f = F(800, 104), list = layoutWords(ans, f, 950, 120, 62, 680);
      wordsIn(list, f, C.white, 4.0, 0.15, accent);
      if (small){ const sf = F(600, 50), y0 = list[list.length - 1].y + 140; ctx.save(); ctx.globalAlpha = 0.8; wordsIn(layoutWords(small, sf, 950, 64, 62, y0), sf, C.white, 5.6, 0.06, []); ctx.restore(); }
      return;
    }
    endcard(7.8);
  };
}
const MYTHS = [
  ['„Unsere Qualität spricht für sich.“', 'Tut sie nicht, wenn sie niemand sieht.', [5, 6], 'Sichtbarkeit ist kein Angeben. Sondern Vertrauen aufbauen.'],
  ['„Wir machen das schon immer so.“', 'Tradition ist wertvoll. Aber kein Grund, stehen zu bleiben.', [5, 6, 7], null],
  ['„Ein neues Logo reicht.“', 'Ein Logo ohne Haltung ist nur Deko.', [3, 6], null],
  ['„Wir haben keine Zeit für Marketing.“', 'Dann machen es andere.', [3], 'Und wirken moderner, obwohl sie es nicht sind.'],
  ['„Marke ist nur was für Konzerne.“', 'Im Gegenteil: Für kleine Betriebe ist sie oft der einzige Schutz vor Austauschbarkeit.', [10], null],
];

// Checkliste — Praxis-Box from "Free Guide.docx"
const CHECK = ['Du bekommst mehr Preisvergleiche als früher.', 'Bewerber sagen: „Ich kannte euch gar nicht.“', 'Auf Social Media passiert kaum etwas.', 'Kunden wissen nicht, wofür ihr steht.', 'Deine Website ist älter als dein Handy.'];
function vCheck(){
  if (T < 8.4){
    bg(C.dark); sig(C.white);
    lines(['Deine Marke verliert', 'Aufmerksamkeit, wenn …'], F(800, 84), C.white, 62, 520, 96, 0.2, 0.25);
    CHECK.forEach((s, i) => {
      const t0 = 1.6 + i*1.25, a = eo(seg(T, t0, t0 + 0.3)); if (a <= 0) return;
      const y = 760 + i*190, last = i === CHECK.length - 1;
      ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a)*40, 0);
      ctx.strokeStyle = C.white; ctx.lineWidth = 5; ctx.strokeRect(64, y - 8, 64, 64);
      const k = eback(seg(T, t0 + 0.5, t0 + 0.75));
      if (k > 0){ ctx.fillStyle = C.red; ctx.fillRect(64 + 32 - 32*k, y + 24 - 32*k, 64*k, 64*k);
        ctx.strokeStyle = C.white; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(78, y + 26); ctx.lineTo(92, y + 40); ctx.lineTo(116, y + 8); ctx.stroke(); }
      const f = F(last ? 800 : 700, 50);
      layoutWords(s, f, 860, 60, 166, y + 40).forEach(o => text(o.w, o.x, o.y, f, last ? C.red : C.white, 'left', 1, -1));
      ctx.restore();
    });
    return;
  }
  if (T < 10){
    bg(C.red); sig(C.white, 99);
    lines(['Bei zwei Punkten genickt?'], F(700, 70), C.dark, 540, 760, 0, 8.45, 0, 'center');
    const size = fitDisp('SCHÄRFEN.', 940, 250);
    slamWord('ZEIT ZUM', size, 'center', 1000, C.white, 8.7, 0.05, 4);
    slamWord('SCHÄRFEN.', size, 'center', 1000 + size*1.05, C.dark, 9.1, 0.05, 24);
    return;
  }
  endcard(10);
}

// Finde Felix — Monsterbad (Ideenatlas D01) as a hidden-object reel
const FACE = { x:0.50, y:0.33 };
function camera(){
  const sp = seg(T, 0.6, 4.4), wander = { x:0.5 + Math.sin(T*1.7)*0.16*sp, y:0.55 + Math.cos(T*1.25)*0.14*sp };
  const z1 = lerp(1.0, 1.3, eio(seg(T, 0.4, 1.4))), f = eio(seg(T, 4.4, 6.0));
  return { z:lerp(z1, 2.0, f), x:lerp(wander.x, FACE.x, f), y:lerp(wander.y, FACE.y, f) };
}
function vFelix(){
  if (T >= 9.8){ endcard(9.8); return; }
  bg(C.dark);
  const el = M['monsterbad.jpg'];
  if (ready(el)){
    const [iw, ih] = dims(el), cam = camera(), s = Math.max(W/iw, H/ih)*cam.z, dw = iw*s, dh = ih*s;
    const x = clamp(W/2 - cam.x*dw, W - dw, 0), y = clamp(H/2 - cam.y*dh, H - dh, 0);
    ctx.drawImage(el, x, y, dw, dh);
    const fx = x + FACE.x*dw, fy = y + FACE.y*dh, cp = eio(seg(T, 5.7, 6.3));
    if (cp > 0){ ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.arc(fx, fy, 70*cam.z, -Math.PI/2, -Math.PI/2 + TAU*cp); ctx.stroke(); ctx.restore(); }
  }
  const band = 1 - eio(seg(T, 4.2, 4.6));
  if (band > 0){
    ctx.save(); ctx.globalAlpha = band; ctx.fillStyle = 'rgba(32,28,37,.88)'; ctx.fillRect(0, 170, W, 380);
    const size = fitDisp('FINDE FELIX.', 900, 170); slamWord('FINDE FELIX.', size, 'center', 420, C.white, 0.2, 0.05, 9, C.red);
    text('Na? Siehst du ihn?', 540, 510, F(700, 44), C.white, 'center', eo(seg(T, 2.4, 2.7))*0.85, -1);
    ctx.restore();
  }
  const ta = eo(seg(T, 6.6, 7.0));
  if (ta > 0){
    const g = ctx.createLinearGradient(0, 1000, 0, 1700); g.addColorStop(0, 'rgba(32,28,37,0)'); g.addColorStop(0.4, 'rgba(32,28,37,.9)'); g.addColorStop(1, 'rgba(32,28,37,.95)');
    ctx.save(); ctx.globalAlpha = ta; ctx.fillStyle = g; ctx.fillRect(0, 1000, W, 700); ctx.restore();
    lines(['Ich hab da ein paar Ideen.', 'Welche zu deiner Marke passt?'], F(800, 64), C.white, 62, 1290, 80, 6.7, 0.6);
    lines(['Finden wir gemeinsam raus.'], F(800, 64), C.red, 62, 1290 + 160, 0, 8.0, 0);
  }
}

const VARIANTS = [
  { slug:'chronik', name:'20 Thaten', dur:15, end:CH.end, draw:vChronik, hits:[0.15, 0.4, ...CHRON.map((_, i) => CH.intro + i*CH.step)] },
  ...MYTHS.map((m, i) => ({ slug:`irrtum-${i + 1}`, name:`Irrtum ${i + 1}`, dur:10, end:7.8, draw:irrtum(i + 1, ...m), hits:[3.0, 4.0] })),
  { slug:'checkliste', name:'Checkliste', dur:12, end:10, draw:vCheck, hits:[2.1, 3.35, 4.6, 5.85, 7.1, 8.7, 9.1] },
  { slug:'finde-felix', name:'Finde Felix', dur:12, end:9.8, draw:vFelix, hits:[0.2, 4.4, 5.7, 8.0] },
];
