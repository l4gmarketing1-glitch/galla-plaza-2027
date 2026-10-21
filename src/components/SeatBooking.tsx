import { useRef, useState, type FormEvent, type CSSProperties } from 'react';
import { tourRestaurants } from './RestaurantTour';
import { calculateTotal, validateBooking } from '../lib/galla/booking.mjs';
import { getPlan, getSeatGroups, suggestSeats, PLAN_VERSION } from '../lib/galla/seating.mjs';
import './seat-booking.css';

const money=(n:number)=>new Intl.NumberFormat('ro-RO').format(n);
type Draft={seats:string[];children:number;zone:string};
const empty=(id:string):Draft=>({seats:[],children:0,zone:getPlan(id)!.zones[0].id});
const chairPositions=(n:number)=> n===2?[[-8,54],[130,54]]: n===4?[[35,10],[87,10],[35,98],[87,98]]:n===6?[[9,10],[61,10],[113,10],[9,98],[61,98],[113,98]]:[[9,10],[61,10],[113,10],[9,98],[61,98],[113,98],[-8,54],[130,54]];

export function SeatBooking({selected,onRestaurant}:{selected:string;onRestaurant:(id:string)=>void}){
 const [drafts,setDrafts]=useState<Record<string,Draft>>({});
 const draft=drafts[selected]??empty(selected),plan=getPlan(selected)!;
 const restaurant=tourRestaurants.find(r=>r.id===selected)!;
 const seats=draft.seats,children=Math.min(draft.children,seats.length),adults=seats.length-children;
 const groups=getSeatGroups(selected,seats),total=calculateTotal(adults,children);
 const [groupSize,setGroupSize]=useState(2),[announcement,setAnnouncement]=useState('');
 const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
 const [error,setError]=useState(''),[errorField,setErrorField]=useState('');
 const [receipt,setReceipt]=useState<{reference:string;restaurant:string;guests:number;total:number;places:string} | null>(null);
 const request=useRef({signature:'',key:''});
 const update=(patch:Partial<Draft>)=>setDrafts(old=>{const next={...(old[selected]??empty(selected)),...patch};next.children=Math.min(next.children,next.seats.length);return {...old,[selected]:next};});
 function toggleSeat(id:string){update({seats:seats.includes(id)?seats.filter(s=>s!==id):[...seats,id]});}
 function toggleTable(ids:string[]){const all=ids.every(s=>seats.includes(s));update({seats:all?seats.filter(s=>!ids.includes(s)):[...new Set([...seats,...ids])]});}
 function recommend(){const n=Math.min(plan.capacity,Math.max(1,Math.floor(groupSize)||1));setGroupSize(n);update({seats:suggestSeats(selected,n,draft.zone)});setAnnouncement(`${n} locuri selectate. Verifică mesele din sumar; selecția poate include mai multe zone.`);}
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(status==='sending')return;setError('');setErrorField('');
  const fields=new FormData(event.currentTarget);
  const values={name:fields.get('name'),phone:fields.get('phone'),email:fields.get('email'),restaurant:selected,adults,children,seatIds:seats,planVersion:PLAN_VERSION,tablePreference:fields.get('tablePreference')??'',consent:fields.get('consent')==='on',website:fields.get('website')??''};
  const signature=JSON.stringify(values);if(signature!==request.current.signature)request.current={signature,key:crypto.randomUUID()};
  const payload={...values,requestKey:request.current.key},check=validateBooking(payload);
  if(check.error){setError(check.error);setErrorField(check.field??'');setStatus('error');return;}
  setStatus('sending');
  try{
   const response=await fetch(import.meta.env.VITE_RESERVATION_API||'/api/reservations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
   const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||'Solicitarea nu a putut fi trimisă.');
   setReceipt({reference:result.reference,restaurant:restaurant.name,guests:seats.length,total,places:groups.map(g=>`${g.tableId}: ${g.seats.join(', ')}`).join(' · ')});setStatus('success');request.current={signature:'',key:''};
  }catch(err){setError(err instanceof Error?err.message:'Conexiunea a fost întreruptă. Reîncearcă.');setStatus('error');}
 }
 return <section id="rezervare" className="booking section-wrap seat-booking">
  <div className="section-heading"><p className="eyebrow">INVITAȚIA TA PENTRU 2027</p><h2>Fă loc unei<br/>nopți extraordinare.</h2><p>Restaurantul tău. Masa ta. Oamenii tăi.<br/>Alege locurile și trimite-ne totul într-o singură solicitare.</p></div>
  {status==='success'&&receipt?<div className="seat-receipt success-panel" role="status"><span aria-hidden="true">✓</span><p className="eyebrow">SOLICITARE PRIMITĂ · {receipt.reference}</p><h3>Un pas mai aproape de Galla.</h3><p>{receipt.restaurant} · {receipt.guests} persoane · {money(receipt.total)} lei</p><p className="receipt-places">{receipt.places}</p><p>Am primit datele și preferințele pentru locuri. Echipa va confirma amplasarea și disponibilitatea. Solicitarea nu blochează locurile și nu reprezintă un bilet achitat.</p><button type="button" onClick={()=>{update({seats:[],children:0});setReceipt(null);setStatus('idle');}}>O nouă solicitare ↗</button></div>:<form className="seat-reservation-form" aria-label="Solicitare de rezervare" onSubmit={submit}>
   <fieldset className="booking-workspace" disabled={status==='sending'}><legend className="sr-only">Configurează solicitarea de rezervare</legend>
    <div className="seat-main">
     <fieldset className="restaurant-choice seat-restaurant-choice"><legend><span>01</span> Alege restaurantul</legend><div>{tourRestaurants.map(r=><label key={r.id} className={selected===r.id?'choice selected':'choice'}><input type="radio" name="restaurant" value={r.id} checked={selected===r.id} onChange={()=>{onRestaurant(r.id);setAnnouncement('');setError('');}}/><span>{r.name}<small>{getPlan(r.id)!.capacity} locuri în plan</small></span><span aria-hidden="true">{selected===r.id?'✓':'↗'}</span></label>)}</div></fieldset>
     <fieldset className="seat-plan-step"><legend><span>02</span> Alege unde stai</legend>
      <div className="seat-plan-intro"><p>{plan.subtitle}</p><span className="draft-badge">PLAN ORIENTATIV</span></div>
      <p className="seat-plan-note" id="plan-note">Așezarea este propusă. Locurile alese sunt preferințe; disponibilitatea și amplasarea se confirmă cu echipa.</p>
      <div className="seat-zone-nav" aria-label="Zonele restaurantului">{plan.zones.map(z=><button key={z.id} type="button" aria-pressed={draft.zone===z.id} onClick={()=>update({zone:z.id})}>{z.name}<small>{z.detail}{groups.some(g=>g.zone===z.id)?` · ${groups.filter(g=>g.zone===z.id).reduce((n,g)=>n+g.seats.length,0)} alese`:''}</small></button>)}</div>
      <p className="plan-instructions">Apasă pe un scaun pentru un loc sau pe numărul mesei pentru întreaga masă.<span> Pe telefon, deplasează planul lateral.</span></p>
      <div className="floor-scroll" tabIndex={0} role="region" aria-label={`Plan interactiv ${restaurant.name}, ${plan.zones.find(z=>z.id===draft.zone)!.name}`} aria-describedby="plan-note">
       <div className={`floor-plan floor-${plan.style}`} style={{'--floor-rows':Math.max(...plan.tables.filter(t=>t.zone===draft.zone).map(t=>t.row))+1} as CSSProperties}>
        <div className="floor-top"><span>GALLA PLAZA</span><strong>{plan.zones.find(z=>z.id===draft.zone)!.name}</strong><span>REVELION 2027</span></div>
        <div className="floor-tables">{plan.tables.filter(t=>t.zone===draft.zone).map(t=>{const chosen=t.seats.filter(s=>seats.includes(s)).length;return <div key={t.id} className={`floor-table table-capacity-${t.capacity}`} style={{gridColumn:t.col+1,gridRow:t.row+1}} role="group" aria-label={`Masa ${t.id}, ${t.capacity} locuri`}>
         <button className={`table-surface ${chosen?'has-seats':''}`} type="button" onClick={()=>toggleTable(t.seats)} aria-pressed={chosen===t.capacity?'true':chosen?'mixed':'false'} aria-label={`${chosen===t.capacity?'Deselectează':'Selectează'} masa ${t.id}, ${t.capacity} locuri`}><strong>{t.id}</strong><small>{chosen?`${chosen} / ${t.capacity}`:`${t.capacity} locuri`}</small></button>
         {t.seats.map((id,i)=>{const pos=chairPositions(t.capacity)[i];return <button key={id} type="button" className={`seat-chair ${seats.includes(id)?'is-selected':''}`} style={{left:pos[0],top:pos[1]}} onClick={()=>toggleSeat(id)} aria-pressed={seats.includes(id)} aria-label={`Masa ${t.id}, locul ${i+1}`}><span>{i+1}</span></button>;})}
        </div>;})}</div>
        <div className="floor-entrance">Acces restaurant <span>Amplasare ilustrativă · fără scară</span></div>
       </div>
      </div>
      <div className="quick-group"><div><strong>Veniți în grup?</strong><p>Alege rapid numărul exact de locuri, apoi ajustează pe plan.</p></div><div className="quick-group-action"><label className="sr-only" htmlFor="group-size">Număr de locuri pentru grup</label><input id="group-size" type="number" min="1" max={plan.capacity} value={groupSize} onChange={e=>setGroupSize(Number(e.target.value))}/><button type="button" onClick={recommend}>Alege {Math.min(plan.capacity,Math.max(1,Math.floor(groupSize)||1))} locuri ↗</button></div></div>
      <div className="selection-status"><p aria-live="polite"><strong>{seats.length}</strong> {seats.length===1?'loc ales':'locuri alese'} · {groups.length} {groups.length===1?'masă':'mese'}</p><button type="button" disabled={!seats.length} onClick={()=>{update({seats:[],children:0});setAnnouncement('Selecția a fost golită.');}}>Golește selecția</button></div>
      <p className="field-hint">Selecțiile se păstrează separat pentru fiecare restaurant. Trimiți doar selecția restaurantului afișat.</p>
      <p className="sr-only" role="status">{announcement}</p>
     </fieldset>
     <fieldset className="seat-contact"><legend><span>03</span> Invitații și datele tale</legend>
      <div className="party-composition"><div><strong>{seats.length} locuri = {seats.length} persoane</strong><p>{adults} adulți · {children} copii</p></div><label htmlFor="children">Câți dintre invitați sunt copii?<div className="child-counter"><button type="button" aria-label="Mai puțini copii" disabled={!children} onClick={()=>update({children:children-1})}>−</button><input id="children" type="number" min="0" max={seats.length} value={children} onChange={e=>update({children:Math.max(0,Math.min(seats.length,Math.floor(Number(e.target.value))||0))})}/><button type="button" aria-label="Mai mulți copii" disabled={children>=seats.length} onClick={()=>update({children:children+1})}>+</button></div></label></div>
      <p className="field-hint">950 lei / adult · 650 lei / copil. Fiecare persoană ocupă un loc. Limita de vârstă pentru tariful de copil se confirmă cu organizatorul.</p>
      <div className="form-fields"><label>Nume complet<input name="name" autoComplete="name" required minLength={2} maxLength={100} aria-invalid={errorField==='name'} placeholder="Numele tău"/></label><label>Număr de telefon<input name="phone" type="tel" autoComplete="tel" required minLength={8} maxLength={24} aria-invalid={errorField==='phone'} placeholder="07xx xxx xxx"/></label><label className="full-field">Adresă de email<input name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={errorField==='email'} placeholder="nume@exemplu.ro"/></label><label className="full-field">Ce ai vrea să mai știm? <span className="optional">(opțional)</span><textarea name="tablePreference" rows={3} maxLength={300} placeholder="De exemplu: acces facil, scaun pentru copil sau mese apropiate."/></label></div>
      <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className="consent"><input type="checkbox" name="consent" required/><span>Sunt de acord ca datele mele să fie folosite pentru această solicitare, conform <a href="#confidentialitate">informării de confidențialitate</a>.</span></label>
      {error&&<p role="alert" className="form-error">{error}</p>}
      <button className="submit-reservation" type="submit" disabled={!seats.length||status==='sending'}>{status==='sending'?'Se trimite…':'Trimite solicitarea pentru locurile alese'} <span aria-hidden="true">↗</span></button>
      {!seats.length&&<p className="form-note">Alege cel puțin un loc pe plan pentru a trimite solicitarea.</p>}
      <p className="booking-help">Preferi să vorbim? <a href="tel:+40755436284">0755 436 284 ↗</a> <a href="mailto:office@gallaplaza.ro">office@gallaplaza.ro ↗</a></p>
     </fieldset>
    </div>
    <aside className="ticket-aside seat-summary" aria-label="Sumarul selecției"><div className="ticket"><div className="ticket-top"><span>GALLA PLAZA</span><span>31.12.2026</span></div><p className="ticket-label">REVELION</p><div className="ticket-year">2027</div><p className="ticket-restaurant">{restaurant.name}</p><div className="ticket-cut" aria-hidden="true"/><p className="summary-caption">LOCURILE TALE PREFERATE</p>{groups.length?<ul className="chosen-tables">{groups.map(g=><li key={g.tableId}><button type="button" title="Arată zona acestei mese" onClick={()=>{update({zone:g.zone});document.querySelector('.floor-scroll')?.scrollIntoView({behavior:'smooth',block:'center'});}}><strong>{g.tableId}</strong><span>Locuri {g.seats.join(', ')}<small>{plan.zones.find(z=>z.id===g.zone)!.name}</small></span></button><button type="button" className="remove-table" onClick={()=>update({seats:seats.filter(s=>!s.startsWith(`${g.tableId}-`))})} aria-label={`Elimină locurile de la masa ${g.tableId}`}>×</button></li>)}</ul>:<p className="empty-selection">O seară frumoasă începe cu locul potrivit. Alege-l pe plan.</p>}<dl><div><dt>{adults} adulți × 950 lei</dt><dd>{money(adults*950)} lei</dd></div><div><dt>{children} copii × 650 lei</dt><dd>{money(children*650)} lei</dd></div><div><dt>Persoane / locuri alese</dt><dd>{seats.length} / {seats.length}</dd></div></dl><div className="ticket-total" aria-live="polite"><span>Total estimat</span><strong>{money(total)} <small>lei</small></strong></div><div className="ticket-barcode" aria-hidden="true"/><p className="ticket-footnote">Preferință de amplasare.<br/>Confirmarea vine de la Galla Plaza.</p></div></aside>
   </fieldset>
  </form>}
 </section>;
}
