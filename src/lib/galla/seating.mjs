// Draft layouts: stable seat identities are shared by the UI and server validation.
/** @typedef {{id:string,zone:string,capacity:number,col:number,row:number,seats:string[]}} Table */
/** @typedef {{capacity:number,style:string,subtitle:string,zones:{id:string,name:string,detail:string}[],tables:Table[]}} Plan */
/** @typedef {{tableId:string,zone:string,capacity:number,seats:number[]}} SeatGroup */
export const PLAN_VERSION='galla-2027-draft-1';
const hundred=[2,4,6,8,8,6,4,8,8,4,6,8,8,6,4,8,2];
const tajine=[2,4,6,8,8,6,4,8,2,2,8,6,4,8,8,6,8,2];
const gameA=[8,8,8,8,6,6,4,4,4,8,8,4,4];
const gameB=[8,8,8,8,6,6,4,4,4,4,4,4,2];
function layout(prefix,zone,capacities,omit,offset=0,mirror=false){
 const positions=Array.from({length:20},(_,i)=>i).filter(i=>!omit.includes(i));
 return capacities.map((capacity,i)=>({id:`${prefix}${String(i+1+offset).padStart(2,'0')}`,zone,capacity,col:mirror?3-positions[i]%4:positions[i]%4,row:Math.floor(positions[i]/4),seats:Array.from({length:capacity},(_,s)=>`${prefix}${String(i+1+offset).padStart(2,'0')}-S${s+1}`)}));
}
export const SEATING_PLANS={
 ciorbar:{capacity:100,style:'ciorbar',subtitle:'Mese de familie, în jurul unei alei centrale.',zones:[{id:'salon',name:'Salonul Ciorbar',detail:'100 de locuri'}],tables:layout('C','salon',hundred,[5,6,18])},
 'mamas-tajine':{capacity:100,style:'tajine',subtitle:'O așezare intimă, cu mese în jurul salonului.',zones:[{id:'salon',name:'Salonul El Tajine',detail:'100 de locuri'}],tables:layout('T','salon',tajine,[9,10])},
 'game-on':{capacity:150,style:'game-on',subtitle:'Două zone pentru grupuri mici și seri împreună.',zones:[{id:'a',name:'Zona A',detail:'80 de locuri'},{id:'b',name:'Zona B',detail:'70 de locuri'}],tables:[...layout('G','a',gameA,[5,6,14,15,16,17,18],0),...layout('G','b',gameB,[1,2,14,15,16,17,18],13,true)]},
 rosa:{capacity:300,style:'rossa',subtitle:'Trei zone elegante, fiecare cu propria așezare.',zones:[{id:'a',name:'Salon A',detail:'100 de locuri'},{id:'b',name:'Salon B',detail:'100 de locuri'},{id:'c',name:'Salon C',detail:'100 de locuri'}],tables:[...layout('R','a',hundred,[5,6,18]),...layout('R','b',[...hundred].reverse(),[1,9,10],17,true),...layout('R','c',hundred,[6,13,14],34,true)]}
};
/** @param {string} id @returns {Plan|null} */
export function getPlan(id){return Object.hasOwn(SEATING_PLANS,id)?SEATING_PLANS[id]:null;}
/** @param {string} restaurant @param {string[]} seatIds @returns {SeatGroup[]} */
export function getSeatGroups(restaurant,seatIds){
 const selected=new Set(seatIds);
 return (getPlan(restaurant)?.tables??[]).map(t=>({tableId:t.id,zone:t.zone,capacity:t.capacity,seats:t.seats.filter(s=>selected.has(s)).map(s=>Number(s.split('-S')[1]))})).filter(t=>t.seats.length);
}
/** @param {string} restaurant @param {number} count @param {string} zone @returns {string[]} */
export function suggestSeats(restaurant,count,zone){
 const plan=getPlan(restaurant);
 if(!plan||!Number.isInteger(count)||count<1||count>plan.capacity)throw new Error('Număr invalid de locuri.');
 // Start in the visible zone, take adjacent tables, and never add spare seats.
 const tables=[...plan.tables.filter(t=>t.zone===zone),...plan.tables.filter(t=>t.zone!==zone)];
 return tables.flatMap(t=>t.seats).slice(0,count);
}
