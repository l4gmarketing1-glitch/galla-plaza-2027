import { randomUUID, createHash } from 'node:crypto';
import { validateBooking } from '../src/lib/galla/booking.mjs';

export async function processReservation({input,ip,store}){
 const parsed=validateBooking(input);
 if(parsed.error)return {status:400,body:{error:parsed.error,field:parsed.field}};
 if(!store)return {status:503,body:{error:'Formularul online nu este încă activ. Contactează echipa la 0755 436 284 sau office@gallaplaza.ro.'}};
 const bucket=createHash('sha256').update(`${Math.floor(Date.now()/3600000)}:${ip}`).digest('hex');
 try{
  const result=await store.save({...parsed.data,id:randomUUID()},bucket);
  if(result.rateLimited)return {status:429,body:{error:'Ai trimis prea multe solicitări. Reîncearcă mai târziu sau contactează echipa.'}};
  return {status:200,body:{ok:true,reference:result.id.slice(0,8).toUpperCase(),reservationStatus:'pending',paymentStatus:'not_started'}};
 }catch{return {status:503,body:{error:'Solicitarea nu a putut fi salvată. Reîncearcă sau sună la 0755 436 284.'}};}
}

export function supabaseStore(){
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return null;
 const parsed=new URL(url);if(parsed.protocol!=='https:')throw new Error('SUPABASE_URL must use HTTPS.');
 return {async save(data,bucket){
  const response=await fetch(`${url.replace(/\/$/,'')}/rest/v1/rpc/submit_galla_reservation`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({payload:data,rate_bucket:bucket}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('Storage unavailable');
  return await response.json();
 }};
}

export async function readJson(req){
 if(req.body && typeof req.body==='object'){if(Buffer.byteLength(JSON.stringify(req.body))>8192)throw new Error('size');return req.body;}
 if(typeof req.body==='string'){if(Buffer.byteLength(req.body)>8192)throw new Error('size');return JSON.parse(req.body);}
 let total=0;const chunks=[];for await(const part of req){total+=part.length;if(total>8192)throw new Error('size');chunks.push(part);}return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function reservationEndpoint(req,res,store,{local=false}={}){
 const reply=(status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));};
 const origin=req.headers.origin;
 const allowed=[process.env.SITE_URL,process.env.ALLOWED_ORIGIN].filter(Boolean).map(u=>new URL(u).origin);
 if(local)allowed.push(`http://${req.headers.host}`);
 if(origin&&allowed.includes(origin)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
 if(req.method==='OPTIONS'){if(!origin||!allowed.includes(origin))return reply(403,{error:'Origine nepermisă.'});res.setHeader('Access-Control-Allow-Methods','POST');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.statusCode=204;return res.end();}
 if(req.method!=='POST')return reply(405,{error:'Metodă nepermisă.'});
 if(!origin||!allowed.includes(origin))return reply(403,{error:'Origine nepermisă.'});
 if(!req.headers['content-type']?.includes('application/json'))return reply(415,{error:'Format nepermis.'});
 let input;try{input=await readJson(req);}catch{return reply(400,{error:'Formular invalid sau prea mare.'});}
 const ip=local?(req.socket.remoteAddress||'local'):String(req.headers['x-forwarded-for']||'unknown').split(',')[0];
 const result=await processReservation({input,ip,store});return reply(result.status,result.body);
}
