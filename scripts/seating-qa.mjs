import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[],failed=[];let payload;
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
page.on('request',r=>{if(r.url().endsWith('/api/reservations')&&r.method()==='POST')payload=r.postDataJSON();});
const choose=async id=>page.locator(`input[name=restaurant][value="${id}"]`).check({force:true});
const group=async n=>{await page.locator('#group-size').fill(String(n));await page.locator('.quick-group-action button').click();};
try{
 await page.goto('http://127.0.0.1:4173/?rev=7#rezervare',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.seat-chair.is-selected').count(),0);
 assert.ok(await page.locator('.submit-reservation').isDisabled());
 await page.getByRole('button',{name:'Selectează masa G01, 8 locuri',exact:true}).click();
 assert.equal(await page.locator('.seat-chair.is-selected').count(),8);
 await page.getByRole('button',{name:'Masa G01, locul 1',exact:true}).click();
 assert.equal(await page.locator('.seat-chair.is-selected').count(),7);
 await page.locator('#children').fill('2');assert.ok((await page.locator('.ticket-total').innerText()).includes('6.050'));
 await group(40);assert.ok((await page.locator('.ticket-total').innerText()).includes('37.400'));
 await choose('ciorbar');assert.equal(await page.locator('.seat-chair').count(),100);await group(2);
 await choose('game-on');assert.equal(await page.locator('.seat-chair.is-selected').count(),40);assert.equal(await page.locator('#children').inputValue(),'2');
 await choose('mamas-tajine');assert.equal(await page.locator('.seat-chair').count(),100);
 await choose('rosa');assert.equal(await page.locator('.seat-zone-nav button').count(),3);await group(300);
 for(const name of ['Salon A','Salon B','Salon C']){await page.locator('.seat-zone-nav button').filter({hasText:name}).click();assert.equal(await page.locator('.seat-chair.is-selected').count(),100);}
 assert.ok((await page.locator('.ticket-total').innerText()).includes('285.000'));
 await page.getByRole('button',{name:'Golește selecția',exact:true}).click();assert.ok(await page.locator('.submit-reservation').isDisabled());
 await choose('ciorbar');await group(8);
 for(const width of [1440,768,375]){
  await page.setViewportSize({width,height:1000});await page.locator('.seat-restaurant-choice').scrollIntoViewIfNeeded();
  assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`Overflow ${width}`);
  await page.screenshot({path:`qa/seating-${width}.png`});
  const floor=page.locator('.floor-scroll');await floor.evaluate(e=>e.scrollLeft=e.scrollWidth);await page.getByRole('button',{name:'Masa C04, locul 1',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Masa C04, locul 1',exact:true}).getAttribute('aria-pressed'),width===768?'false':'true');
  await floor.evaluate(e=>e.scrollLeft=0);
  const input=page.locator('#children');await input.fill('300');assert.equal(await input.inputValue(),await page.locator('.selection-status strong').innerText());
  if(width===375){const ticket=await page.locator('.seat-summary').boundingBox(),contact=await page.locator('.seat-contact').boundingBox();assert.ok(ticket.y<contact.y,'Mobile summary should precede contact');await page.locator('.seat-contact').scrollIntoViewIfNeeded();await page.screenshot({path:'qa/seating-contact-mobile.png'});}
 }
 await page.setViewportSize({width:1440,height:1000});await choose('game-on');await group(40);await page.locator('#children').fill('2');
 await page.locator('input[name=name]').fill('QA Plan Locuri');await page.locator('input[name=phone]').fill('0700000000');await page.locator('input[name=email]').fill('seating-qa@example.invalid');await page.locator('input[name=consent]').check();
 const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/reservations')&&r.request().method()==='POST');await page.locator('.submit-reservation').click();const response=await responsePromise;assert.equal(response.status(),200);await page.locator('.seat-receipt').waitFor();
 const db=new DatabaseSync('data/reservations.sqlite',{readOnly:true});const row=db.prepare('SELECT seat_selection_json,adults,children,total,amount_minor,payment_status FROM reservations WHERE request_key=?').get(payload.requestKey);db.close();
 assert.equal(row.adults,38);assert.equal(row.children,2);assert.equal(row.total,37400);assert.equal(row.amount_minor,3740000);assert.equal(row.payment_status,'not_started');assert.equal(JSON.parse(row.seat_selection_json).reduce((n,t)=>n+t.seats.length,0),40);
 assert.ok((await page.locator('.seat-receipt').innerText()).includes('nu blochează locurile'));
 await page.locator('.seat-receipt').screenshot({path:'qa/seating-success.png'});
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const result={passed:true,capacities:{ciorbar:100,tajine:100,gameOn:150,rossa:300},individualSeats:true,wholeTables:true,multiZone300:true,separateRestaurantDrafts:true,adultChildPricing:true,mobilePan:true,mobileSummaryBeforeContact:true,persistence:true,noAutomaticPayment:true,viewports:[1440,768,375],errors,failed};await writeFile('qa/seating-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{
 await browser.close();if(payload){const db=new DatabaseSync('data/reservations.sqlite');db.prepare('DELETE FROM reservations WHERE request_key=? AND email=?').run(payload.requestKey,'seating-qa@example.invalid');db.close();}
}
