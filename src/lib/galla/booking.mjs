import {getPlan,getSeatGroups,PLAN_VERSION} from './seating.mjs';
export const PRICES=Object.freeze({adult:950,child:650});
export function calculateTotal(adults,children){return adults*PRICES.adult+children*PRICES.child;}
export function validateBooking(input){
 if(!input||typeof input!=='object')return {error:'Formular invalid.'};
 const d=input;
 if(typeof d.requestKey!=='string'||!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(d.requestKey))return {error:'Reîncarcă formularul și încearcă din nou.'};
 if(typeof d.name!=='string'||d.name.trim().length<2||d.name.trim().length>100)return {error:'Completează numele (2-100 caractere).',field:'name'};
 if(typeof d.phone!=='string'||!/^\+?[0-9 ()-]{8,24}$/.test(d.phone)||d.phone.replace(/\D/g,'').length<8)return {error:'Completează un telefon valid.',field:'phone'};
 if(typeof d.email!=='string'||d.email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))return {error:'Completează un email valid.',field:'email'};
 const plan=typeof d.restaurant==='string'?getPlan(d.restaurant):null;
 if(!plan)return {error:'Alege un restaurant.',field:'restaurant'};
 if(d.planVersion!==PLAN_VERSION)return {error:'Planul meselor a fost actualizat. Reîncarcă pagina și alege din nou locurile.',field:'seats'};
 if(!Number.isInteger(d.adults)||!Number.isInteger(d.children)||d.adults<0||d.children<0||d.adults+d.children<1||d.adults+d.children>plan.capacity)return {error:`Alege între 1 și ${plan.capacity} de persoane pentru acest restaurant.`,field:'guests'};
 const allowed=new Set(plan.tables.flatMap(t=>t.seats));
 if(!Array.isArray(d.seatIds)||d.seatIds.length<1||d.seatIds.length>plan.capacity||d.seatIds.some(s=>typeof s!=='string'||!allowed.has(s))||new Set(d.seatIds).size!==d.seatIds.length)return {error:'Alege locuri distincte din planul restaurantului selectat.',field:'seats'};
 if(d.seatIds.length!==d.adults+d.children)return {error:'Numărul de persoane trebuie să fie egal cu numărul de locuri alese.',field:'seats'};
 if(typeof d.tablePreference!=='string'||d.tablePreference.length>300)return {error:'Preferința poate avea maximum 300 de caractere.',field:'tablePreference'};
 if(d.consent!==true)return {error:'Confirmă acordul pentru prelucrarea solicitării.',field:'consent'};
 if(d.website)return {error:'Solicitare invalidă.'};
 const seatSelection=getSeatGroups(d.restaurant,d.seatIds),total=calculateTotal(d.adults,d.children);
 return {data:{requestKey:d.requestKey,name:d.name.trim(),phone:d.phone.trim(),email:d.email.trim().toLowerCase(),restaurant:d.restaurant,adults:d.adults,children:d.children,tables:seatSelection.map(t=>t.capacity),seatSelection,planVersion:PLAN_VERSION,tablePreference:d.tablePreference.trim(),consentVersion:'2027-v1',total,amountMinor:total*100,currency:'ron',paymentStatus:'not_started'}};
}
