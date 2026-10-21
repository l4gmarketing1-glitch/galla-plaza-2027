import { createRequire } from 'node:module';
import { mkdir,writeFile,readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
await mkdir('qa',{recursive:true});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.screenshot({path:'qa/revision-hero.png'});
const jump=async p=>{await page.locator('#harta').evaluate((el,p)=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top+(el.offsetHeight-innerHeight)*p,behavior:'instant'}),p);await page.waitForTimeout(950);};
const names=['CIORBAR','EL TAJINE','GAME ON','ROSSA'];
for(let i=0;i<4;i++){
 await jump((i+.25)/4);
 assert.equal(await page.locator('.tour-menu:visible h3').innerText(),names[i]);
 assert.equal(await page.locator('.tour-route button').count(),4);assert.ok(await page.locator('.tour-pin.is-active').isVisible());
 for(const pin of await page.locator('.tour-pin.is-active').all()){
  const box=await pin.boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=1440&&box.y+box.height<=1000,'Pin outside viewport');
 }
 if(i===0||i===3)await page.screenshot({path:`qa/revision-tour-${i}.png`});
}
const transforms=await page.locator('.tour-plane').evaluate(e=>getComputedStyle(e).transform);
const forward=await page.locator('.tour-video').evaluate(v=>v.currentTime);
await jump(.04);await page.waitForTimeout(300);const reverse=await page.locator('.tour-video').evaluate(v=>v.currentTime);assert.ok(forward>reverse&&forward>10,'Full video must scrub in both directions');assert.equal(await page.locator('.tour-plane').evaluate(e=>getComputedStyle(e).transform),transforms,'Camera framing must not pan sideways');assert.equal(await page.locator('.pin-2').getAttribute('data-visible'),'false');assert.equal(await page.locator('.pin-3').getAttribute('data-visible'),'false');
await page.locator('.tour-route').getByRole('button',{name:/04 ROSSA/}).click();await page.waitForTimeout(1400);assert.equal(await page.locator('.tour-menu:visible h3').innerText(),'ROSSA');
await page.locator('.tour-menu:visible').getByRole('button',{name:'Vezi meniul complet'}).click();assert.ok(await page.locator('dialog').isVisible());assert.equal(await page.locator('#dialog-title').innerText(),'ROSSA');await page.keyboard.press('Escape');assert.ok(!await page.locator('dialog').isVisible());
await page.locator('.tour-menu:visible').getByRole('button',{name:'Alege masa aici'}).click();await page.waitForTimeout(600);assert.equal(await page.locator('input[name=restaurant]:checked').inputValue(),'rosa');
await page.locator('#group-size').fill('40');await page.locator('.quick-group-action button').click();assert.equal(await page.locator('.seat-chair.is-selected').count(),40);assert.ok((await page.locator('.ticket-total').innerText()).includes('38.000'));
for(const width of [375,768,1440]){
 await page.setViewportSize({width,height:900});
 for(let i=0;i<4;i++){await jump((i+.25)/4);for(const pin of await page.locator('.tour-pin.is-active').all()){const box=await pin.boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width&&box.y+box.height<=900,`Pin not visible: ${width}, stop ${i}`);}}
 await jump(.32);assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Horizontal overflow');
 await page.screenshot({path:`qa/revision-tour-${width}.png`});
}
await page.setViewportSize({width:1440,height:1000});await page.locator('#experiente').screenshot({path:'qa/revision-experiences.png'});
const reduced=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});const requests=[];reduced.on('request',r=>{if(/\.mp4/.test(r.url()))requests.push(r.url());});await reduced.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await reduced.locator('#harta').scrollIntoViewIfNeeded();await reduced.getByRole('button',{name:'Explorează 03 GAME ON'}).click();assert.equal(await reduced.locator('.tour-menu:visible h3').innerText(),'GAME ON');assert.equal(requests.length,0);
await reduced.setViewportSize({width:844,height:390});await reduced.getByRole('button',{name:'Explorează 04 ROSSA'}).click();assert.equal(await reduced.locator('.tour-menu:visible h3').innerText(),'ROSSA');
const html=await readFile('dist/index.html','utf8');assert.equal((html.match(/<h1\b/g)||[]).length,1);for(const text of ['Vitello tonnato','Harira vegetariană','950','650'])assert.ok(html.includes(text));assert.ok(!html.includes('De la primul dans.'));JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
const result={passed:true,sequence:names,video:{forward,reverse},directNavigation:true,progressiveReveal:true,staticCameraFraming:true,menuDialog:true,reservationPrefill:true,group40:true,viewports:[375,768,1440],reducedMotionNoVideo:requests.length===0,ssr:true,errors,failed};
await writeFile('qa/revision-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();assert.equal(errors.length,0);assert.equal(failed.length,0);
