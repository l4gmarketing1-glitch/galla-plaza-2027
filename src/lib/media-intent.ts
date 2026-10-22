/** Avoid starting a video while the browser scrolls past it to a deep link. */
export function observeMediaIntent(section:string,notify:()=>void){
 let destination=location.hash.slice(1),manual=false;
 const change=()=>{destination=location.hash.slice(1);manual=false;notify();};
 const release=()=>{if(!manual){manual=true;notify();}};
 const key=(event:KeyboardEvent)=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))release();};
 const click=(event:MouseEvent)=>{
  const a=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
  if(!a)return;
  const url=new URL(a.href,location.href);
  if(url.origin===location.origin&&url.pathname===location.pathname){destination=url.hash.slice(1);manual=false;notify();}
 };
 window.addEventListener('hashchange',change);
 window.addEventListener('wheel',release,{passive:true});
 window.addEventListener('touchstart',release,{passive:true});
 window.addEventListener('keydown',key);
 document.addEventListener('click',click,true);
 return {allows:()=>manual||!destination||destination==='inceput'||destination==='continut'||destination===section,dispose:()=>{
  window.removeEventListener('hashchange',change);window.removeEventListener('wheel',release);window.removeEventListener('touchstart',release);window.removeEventListener('keydown',key);document.removeEventListener('click',click,true);
 }};
}
