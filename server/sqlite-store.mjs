import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
export function createSqliteStore(path='data/reservations.sqlite'){
 if(path!==':memory:')mkdirSync(dirname(path),{recursive:true});
 const db=new DatabaseSync(path);
 db.exec(`PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS reservations(id TEXT PRIMARY KEY, request_key TEXT UNIQUE NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, restaurant TEXT NOT NULL, adults INTEGER NOT NULL, children INTEGER NOT NULL, tables_json TEXT NOT NULL, table_preference TEXT NOT NULL, total INTEGER NOT NULL, consent_version TEXT NOT NULL, status TEXT DEFAULT 'pending', created_at TEXT DEFAULT CURRENT_TIMESTAMP, expires_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS rate_limits(bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at INTEGER NOT NULL);`);
 // Additive migration preserves all earlier contact requests and table preferences.
 const columns=new Set(db.prepare('PRAGMA table_info(reservations)').all().map(c=>c.name));
 for(const [name,type] of [['seat_selection_json',"TEXT NOT NULL DEFAULT '[]'"],['plan_version',"TEXT NOT NULL DEFAULT ''"],['currency',"TEXT NOT NULL DEFAULT 'ron'"],['amount_minor','INTEGER NOT NULL DEFAULT 0'],['payment_status',"TEXT NOT NULL DEFAULT 'not_started'"]]){
  if(!columns.has(name))db.exec(`ALTER TABLE reservations ADD COLUMN ${name} ${type}`);
 }
 db.exec('UPDATE reservations SET amount_minor=total*100 WHERE amount_minor=0');
 return {db,async save(d,bucket){
  db.exec('BEGIN IMMEDIATE');
  try{
   db.prepare('DELETE FROM reservations WHERE expires_at < ? AND status = ?').run(new Date().toISOString(),'pending');
   db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').run(Date.now());
   const count=db.prepare('INSERT INTO rate_limits(bucket,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1 RETURNING attempts').get(bucket,Date.now()+7200000);
   if(count.attempts>10){db.exec('COMMIT');return {rateLimited:true};}
   db.prepare('INSERT INTO reservations(id,request_key,name,phone,email,restaurant,adults,children,tables_json,table_preference,total,consent_version,expires_at,seat_selection_json,plan_version,currency,amount_minor,payment_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(request_key) DO NOTHING').run(d.id,d.requestKey,d.name,d.phone,d.email,d.restaurant,d.adults,d.children,JSON.stringify(d.tables),d.tablePreference,d.total,d.consentVersion,'2027-04-01T00:00:00.000Z',JSON.stringify(d.seatSelection),d.planVersion,d.currency,d.amountMinor,d.paymentStatus);
   const row=db.prepare('SELECT id FROM reservations WHERE request_key=?').get(d.requestKey);
   db.exec('COMMIT');return {id:row.id};
  }catch(e){db.exec('ROLLBACK');throw e;}
 }};
}
