import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { calculateTotal,validateBooking } from '../src/lib/galla/booking.mjs';
import { SEATING_PLANS,PLAN_VERSION,suggestSeats,getPlan } from '../src/lib/galla/seating.mjs';
import { createSqliteStore } from '../server/sqlite-store.mjs';
import { processReservation } from '../server/reservation-handler.mjs';
const data=()=>({requestKey:randomUUID(),name:'Test QA',phone:'0700000000',email:'qa@example.invalid',restaurant:'game-on',adults:2,children:1,seatIds:['G01-S1','G01-S2','G01-S3'],planVersion:PLAN_VERSION,tablePreference:'Test automat',consent:true,website:''});
test('capacități exacte, identități unice și toate dimensiunile de grup',()=>{
 for(const [id,capacity] of Object.entries({ciorbar:100,'mamas-tajine':100,'game-on':150,rosa:300})){
  const plan=getPlan(id),ids=plan.tables.flatMap(t=>t.seats);
  assert.equal(plan.capacity,capacity);assert.equal(ids.length,capacity);assert.equal(new Set(ids).size,capacity);
  assert.deepEqual([...new Set(plan.tables.map(t=>t.capacity))].sort((a,b)=>a-b),[2,4,6,8]);
  for(const z of plan.zones){const tables=plan.tables.filter(t=>t.zone===z.id);assert.equal(new Set(tables.map(t=>`${t.row}/${t.col}`)).size,tables.length);}
  for(let n=1;n<=capacity;n++){const result=suggestSeats(id,n,plan.zones[0].id);assert.equal(result.length,n);assert.equal(new Set(result).size,n);assert.ok(result.every(s=>ids.includes(s)));}
 }
 assert.equal(getPlan('__proto__'),null);assert.throws(()=>suggestSeats('ciorbar',101,'salon'));
});
test('respinge locuri duplicate, străine, inexistente, plan vechi și număr inegal de persoane',()=>{
 for(const patch of [{seatIds:['G01-S1','G01-S1','G01-S2']},{seatIds:['C01-S1','G01-S2','G01-S3']},{seatIds:['G01-S99','G01-S2','G01-S3']},{planVersion:'old'},{adults:3},{adults:-1},{email:'x'},{consent:false},{restaurant:'inventat'},{website:'spam'}])assert.ok(validateBooking({...data(),...patch}).error,JSON.stringify(patch));
 const parsed=validateBooking({...data(),total:1,amountMinor:1,currency:'usd',paymentStatus:'paid',tables:[20]});
 assert.equal(parsed.data.total,2550);assert.equal(parsed.data.amountMinor,255000);assert.equal(parsed.data.currency,'ron');assert.equal(parsed.data.paymentStatus,'not_started');assert.deepEqual(parsed.data.tables,[8]);assert.deepEqual(parsed.data.seatSelection,[{tableId:'G01',zone:'a',capacity:8,seats:[1,2,3]}]);
});
test('300 locuri Rossa și grup mixt de 40',()=>{
 const input={...data(),restaurant:'rosa',adults:300,children:0,seatIds:suggestSeats('rosa',300,'a')};assert.equal(validateBooking(input).data.total,285000);
 assert.equal(calculateTotal(38,2),37400);assert.ok(validateBooking({...input,restaurant:'ciorbar'}).error);
});
test('persistență exactă a locurilor, preț și stare de plată; retry idempotent',async()=>{
 const store=createSqliteStore(':memory:');try{const d=data();const first=await processReservation({input:d,ip:'qa-1',store});const second=await processReservation({input:d,ip:'qa-1',store});assert.equal(first.status,200);assert.deepEqual(first,second);
 const row=store.db.prepare('SELECT seat_selection_json,total,amount_minor,payment_status,plan_version FROM reservations').get();assert.equal(row.total,2550);assert.equal(row.amount_minor,255000);assert.equal(row.payment_status,'not_started');assert.equal(row.plan_version,PLAN_VERSION);assert.deepEqual(JSON.parse(row.seat_selection_json)[0].seats,[1,2,3]);assert.equal(store.db.prepare('SELECT COUNT(*) AS n FROM reservations').get().n,1);assert.ok(!JSON.stringify(first).includes(d.email));}finally{store.db.close();}
});
test('migrarea aditivă păstrează o cerere veche',()=>{
 const dir=mkdtempSync(join(tmpdir(),'galla-migration-')),path=join(dir,'test.sqlite');
 try{const old=new DatabaseSync(path);old.exec(`CREATE TABLE reservations(id TEXT PRIMARY KEY,request_key TEXT UNIQUE NOT NULL,name TEXT NOT NULL,phone TEXT NOT NULL,email TEXT NOT NULL,restaurant TEXT NOT NULL,adults INTEGER NOT NULL,children INTEGER NOT NULL,tables_json TEXT NOT NULL,table_preference TEXT NOT NULL,total INTEGER NOT NULL,consent_version TEXT NOT NULL,status TEXT DEFAULT 'pending',created_at TEXT DEFAULT CURRENT_TIMESTAMP,expires_at TEXT NOT NULL); INSERT INTO reservations(id,request_key,name,phone,email,restaurant,adults,children,tables_json,table_preference,total,consent_version,expires_at) VALUES('legacy','legacy','QA','0700000000','qa@example.invalid','game-on',2,0,'[2]','',1900,'2027-v1','2027-04-01');`);old.close();const store=createSqliteStore(path);const row=store.db.prepare('SELECT * FROM reservations WHERE id=?').get('legacy');assert.equal(row.tables_json,'[2]');assert.equal(row.seat_selection_json,'[]');assert.equal(row.amount_minor,190000);store.db.close();}finally{rmSync(dir,{recursive:true,force:true});}
});
test('rate limiting și indisponibilitatea bazei de date',async()=>{const store=createSqliteStore(':memory:');try{for(let i=0;i<10;i++)assert.equal((await processReservation({input:data(),ip:'qa-2',store})).status,200);assert.equal((await processReservation({input:data(),ip:'qa-2',store})).status,429);assert.equal((await processReservation({input:data(),ip:'qa-3',store:null})).status,503);}finally{store.db.close();}});
