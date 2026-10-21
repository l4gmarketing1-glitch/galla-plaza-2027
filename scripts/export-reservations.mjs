// Local owner-only tool. Never expose as an HTTP endpoint.
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';
const db=new DatabaseSync('data/reservations.sqlite',{readOnly:true});
const keys=['id','name','phone','email','restaurant','adults','children','tables_json','seat_selection_json','plan_version','table_preference','total','currency','amount_minor','payment_status','status','created_at'];
const rows=db.prepare(`SELECT ${keys.join(',')} FROM reservations ORDER BY created_at DESC`).all();
const escape=v=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
writeFileSync('data/rezervari.csv','\uFEFF'+[keys,...rows.map(r=>keys.map(k=>r[k]))].map(r=>r.map(escape).join(',')).join('\r\n'));
console.log(`Exported ${rows.length} requests to private data/rezervari.csv`);db.close();
