import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[];
try{
 for(const width of [1440,375]){
  const page=await browser.newPage({viewport:{width,height:900}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?rev=8',{waitUntil:'networkidle'});
  const v=page.locator('.hero-montage-video');await page.waitForFunction(()=>{const v=document.querySelector('.hero-montage-video');return v.currentTime>.1&&!v.paused;});
  const props=await v.evaluate(v=>({src:v.currentSrc,muted:v.muted,loop:v.loop,inline:v.playsInline}));assert.ok(props.src.includes(width<700?'hero-montage-mobile.mp4':'hero-montage.mp4'));assert.ok(props.muted&&props.loop&&props.inline);
  await page.getByRole('button',{name:'Pune videoclipul pe pauză'}).click();assert.ok(await v.evaluate(v=>v.paused));
  await v.evaluate(v=>v.currentTime=1.3);await page.waitForTimeout(200);await page.screenshot({path:`qa/hero-montage-${width}.png`});
  await page.locator('#rezervare').scrollIntoViewIfNeeded();await page.locator('#inceput').scrollIntoViewIfNeeded();await page.waitForTimeout(200);assert.ok(await v.evaluate(v=>v.paused),'Manual pause must persist');
  await page.getByRole('button',{name:'Pornește videoclipul de fundal'}).click();await page.waitForTimeout(200);assert.ok(!await v.evaluate(v=>v.paused));
  await page.locator('#rezervare').scrollIntoViewIfNeeded();await page.waitForTimeout(300);assert.ok(await v.evaluate(v=>v.paused),'Offscreen video must pause');
  assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await page.close();
 }
 for(const mode of ['reduced','data']){
  const page=await browser.newPage({reducedMotion:mode==='reduced'?'reduce':'no-preference'});const videos=[];page.on('request',r=>{if(r.url().includes('hero-montage')&&r.url().endsWith('.mp4'))videos.push(r.url());});
  if(mode==='data')await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'4g',addEventListener(){},removeEventListener(){}}}));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});assert.equal(videos.length,0);assert.equal(await page.locator('.hero-montage-video').getAttribute('src'),null);assert.ok(await page.locator('.hero-montage-poster').isVisible());await page.close();
 }
 const result={passed:true,autoplay:true,muted:true,loop:true,mobileSource:true,manualPausePersists:true,offscreenPause:true,reducedMotionNoVideo:true,dataSaverNoVideo:true,viewports:[1440,375],errors};assert.deepEqual(errors,[]);await writeFile('qa/hero-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
