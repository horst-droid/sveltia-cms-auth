const { chromium } = require('playwright');
(async () => {
  const [url,out,reel,ts,cols='5'] = process.argv.slice(2);
  const b = await chromium.launch({ args:['--proxy-server='+process.env.HTTPS_PROXY, '--proxy-bypass-list=localhost;127.0.0.1', '--ignore-certificate-errors'] }); const p = await b.newPage({ viewport:{width:1280,height:1100} });
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  await p.goto(url); await p.waitForTimeout(4000); await p.keyboard.press(reel); await p.waitForTimeout(600);
  const shots=[];
  for (const tt of ts.split(',').map(Number)){ await p.evaluate(v=>{const s=document.getElementById('scrub'); s.value=v*1000; s.dispatchEvent(new Event('input'))}, tt); await p.waitForTimeout(120);
    shots.push((await p.locator('#cv').screenshot()).toString('base64')); }
  const q = await b.newPage({viewport:{width:300*+cols,height:600}});
  await q.setContent(`<body style="margin:0;display:grid;grid-template-columns:repeat(${cols},300px)">`+shots.map(s=>`<img style="width:300px" src="data:image/png;base64,${s}">`).join('')+'</body>');
  await q.screenshot({path:out,fullPage:true}); console.log('errors',errs); await b.close();
})();
