import { asset } from '../lib/asset';
import { observeMediaIntent } from '../lib/media-intent';
import { MediaImage } from './MediaImage';
import { useEffect, useRef, useState } from 'react';
import { restaurants, type Restaurant } from '../lib/galla/content';
import './restaurant-tour.css';

export const tourRestaurants = ['ciorbar','mamas-tajine','game-on','rosa'].map(id=>restaurants.find(r=>r.id===id)!);
const stops = [
 {side:'În dreapta · prima oprire', dishes:['Salată de boeuf & piftie','Ceafă de porc în sos de vin roșu','Saramură la ceaun & mămăligă'], x:58,y:50},
 {side:'În dreapta · mai departe în curte', dishes:['Selecție de salate marocane','Tajine de miel în sos de caise','Vită cu prune, migdale și miere'], x:57,y:40},
 {side:'În stânga · dincolo de El Tajine', dishes:['Mini burgeri & coșuri tortilla','Frigărui seafood și pui asiatic','Coaste glazurate cu miere'], x:47,y:37},
 {side:'În stânga · după Game On, în capătul curții', dishes:['Vitello tonnato & burrata','Risotto cu trufe','Conchiglie cu ricotta și spanac'], x:50,y:29},
];
const clamp=(x:number)=>Math.min(1,Math.max(0,x));
// The full original approach: courtyard facades tracked at 0, 5, 10 and 15 seconds.
// Game On is deeper than El Tajine; Rossa is the final destination beyond Game On.
const pinTimes=[0,5,10,15];
const pinFrames=[
 [[58,50],[57,41],[47,37],[50,29]],
 [[62,57],[61,45],[46,36],[49,28]],
 [[85,78],[76,49],[42,36],[47,25]],
 [[115,110],[96,70],[38,35],[44,20]],
];
const revealAt=[0,.16,.44,.68];

export function RestaurantTour({onMenu,onChoose}:{onMenu:(r:Restaurant)=>void;onChoose:(id:string)=>void}){
 const root=useRef<HTMLElement>(null), plane=useRef<HTMLDivElement>(null), video=useRef<HTMLVideoElement>(null);
 const [active,setActive]=useState(0),[economical,setEconomical]=useState(false),[loaded,setLoaded]=useState(false);
 const activeRef=useRef(0), progress=useRef(0), economicalRef=useRef(false);
 useEffect(()=>{
  const section=root.current!,film=video.current!,layer=plane.current!;
  const mq=matchMedia('(prefers-reduced-motion: reduce)'),shortViewport=matchMedia('(max-height: 620px)');
  const connection=(navigator as Navigator & {connection?:{saveData?:boolean;effectiveType?:string}}).connection;
  let raf=0,lastFrame=0,loadTimer=0;
  const pins=Array.from(layer.querySelectorAll<HTMLButtonElement>('.tour-pin'));
  const trackPins=()=>{
   const time=economicalRef.current?0:film.currentTime;
   const a=time<5?0:time<10?1:2,f=clamp((time-pinTimes[a])/(pinTimes[a+1]-pinTimes[a]));
   const viewport=section.querySelector('.tour-visual')!.getBoundingClientRect();
   for(let i=0;i<4;i++){
    const start=pinFrames[a][i],end=pinFrames[a+1][i];
    pins[i].style.left=`${start[0]+(end[0]-start[0])*f}%`;pins[i].style.top=`${start[1]+(end[1]-start[1])*f}%`;
    const bounds=pins[i].getBoundingClientRect();
    pins[i].dataset.labelLeft=String(i<2&&bounds.right+100>viewport.right);
    const visible=(economicalRef.current||progress.current>=revealAt[i])&&bounds.left>=viewport.left+4&&bounds.right<=viewport.right-4&&bounds.top>=viewport.top+4&&bounds.bottom<=viewport.bottom-4;
    pins[i].dataset.visible=String(visible);pins[i].tabIndex=visible?0:-1;pins[i].setAttribute('aria-hidden',String(!visible));
   }
  };
  const preferences=()=>{const value=mq.matches||shortViewport.matches||!!connection?.saveData||/2g/.test(connection?.effectiveType||'');economicalRef.current=value;setEconomical(value);if(value){clearTimeout(loadTimer);film.removeAttribute('src');film.load();setLoaded(false);trackPins();}else observer.observe(section);schedule();};
  const seek=()=>{if(!economicalRef.current&&Number.isFinite(film.duration)&&!film.seeking){const target=progress.current*Math.max(0,film.duration-.08);if(Math.abs(film.currentTime-target)>.04)film.currentTime=target;}};
  const update=(now:number)=>{
   raf=0;if(economicalRef.current){trackPins();return;}
   const rect=section.getBoundingClientRect(),target=clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight));
   const dt=Math.min(64,lastFrame?now-lastFrame:16);lastFrame=now;
   // Time-based damping follows wheel/touch input without moving the camera sideways.
   progress.current+=(target-progress.current)*(1-Math.exp(-dt/95));
   if(Math.abs(target-progress.current)<.00025)progress.current=target;
   const p=progress.current,index=Math.min(3,Math.floor(p*4));
   if(index!==activeRef.current){activeRef.current=index;setActive(index);}
   section.style.setProperty('--tour-progress',String(p));seek();trackPins();
   if(p!==target)raf=requestAnimationFrame(update);
  };
  function schedule(){if(!raf){lastFrame=0;raf=requestAnimationFrame(update);}}
  const observer=new IntersectionObserver(entries=>{
   clearTimeout(loadTimer);
   if(!entries.some(e=>e.isIntersecting)||economicalRef.current||film.hasAttribute('src')||!intent.allows())return;
   // Dwell avoids downloading the tour when an anchor jump passes over it.
   loadTimer=window.setTimeout(()=>{
    const bounds=section.getBoundingClientRect();
    if(economicalRef.current||bounds.bottom<0||bounds.top>innerHeight+300||!intent.allows())return;
    // Native HTTP range requests can display and seek before the whole file arrives.
    film.preload='auto';
    film.src=innerWidth<700?asset('/assets/world/walkthrough-mobile-fast.mp4'):asset('/assets/world/walkthrough-fast.mp4');
    film.load();observer.unobserve(section);
   },350);
  },{rootMargin:'300px'});
  const intent=observeMediaIntent('harta',()=>{observer.unobserve(section);observer.observe(section);});
  const ready=()=>{setLoaded(true);seek();};
  const sought=()=>{trackPins();seek();};
  film.addEventListener('loadeddata',ready);film.addEventListener('seeked',sought);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);mq.addEventListener('change',preferences);shortViewport.addEventListener('change',preferences);
  preferences();schedule();
  return()=>{intent.dispose();clearTimeout(loadTimer);observer.disconnect();cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);mq.removeEventListener('change',preferences);shortViewport.removeEventListener('change',preferences);film.removeEventListener('loadeddata',ready);film.removeEventListener('seeked',sought);film.removeAttribute('src');film.load();};
 },[]);
 function jump(i:number){
  if(economical){activeRef.current=i;setActive(i);return;}
  const section=root.current!;
  window.scrollTo({top:window.scrollY+section.getBoundingClientRect().top+(section.offsetHeight-innerHeight)*(i+.24)/4,behavior:'smooth'});
 }
 return <section id="harta" ref={root} className="restaurant-tour" data-economical={economical} aria-label="Turul celor patru restaurante">
  <div className="tour-sticky">
   <header className="tour-heading"><div><p className="eyebrow">PATRU OPRIRI. O SINGURĂ NOAPTE.</p><h2>Intră în lumea Galla.</h2></div><p>Derulează pentru a explora <span aria-hidden="true">↓</span><small>sau alege un număr de pe hartă</small></p></header>
   <div className="tour-main">
    <div className="tour-visual">
     <div className="tour-plane" ref={plane}>
      <img className="tour-poster" src={asset('/assets/world/walkthrough.webp')} alt="Curtea Galla Plaza, cu restaurantele în dreapta și în stânga aleii" width="1440" height="810" loading="lazy"/>
      <video ref={video} className={loaded?'tour-video is-ready':'tour-video'} muted playsInline preload="none" aria-hidden="true"/>
      <div className="tour-map-pins">{tourRestaurants.map((r,i)=><button key={r.id} data-visible={i===0||economical} className={`tour-pin pin-${i}${active===i?' is-active':''}`} style={{left:`${stops[i].x}%`,top:`${stops[i].y}%`}} aria-label={`Explorează ${String(i+1).padStart(2,'0')} ${r.name}`} aria-pressed={active===i} onClick={()=>jump(i)}><span>0{i+1}</span><strong>{r.name}</strong></button>)}</div>
     </div>
     <div className="tour-location"><span>GALLA PLAZA</span><p>Ștefăneștii de Jos · Ilfov</p></div>
     <span className="tour-map-note">Vizualizare ilustrativă · poziții orientative</span>
    </div>
    <div className="tour-menus" aria-live="polite" aria-atomic="true">
     {tourRestaurants.map((r,i)=><article key={r.id} className="tour-menu" hidden={active!==i} aria-label={`Meniul ${r.name}`}>
      <div className="tour-menu-top"><span>RESTAURANTUL</span><span>0{i+1} / 04</span></div>
      <div className="tour-menu-title"><span aria-hidden="true">0{i+1}</span><h3>{r.name}</h3></div>
      <p className="tour-side">{stops[i].side}</p>
      <p className="tour-intro">{r.intro}</p>
      <div className="tour-food"><MediaImage src={r.image} alt={r.imageAlt} sizes="(max-width: 700px) 50vw, 30vw"/><p>{r.cuisine}</p></div>
      <div className="tour-tasting"><h4>Din meniul serii</h4><ul>{stops[i].dishes.map(d=><li key={d}>{d}</li>)}</ul></div>
      <div className="tour-actions"><button onClick={()=>onMenu(r)}>Vezi meniul complet <span aria-hidden="true">↗</span></button><button onClick={()=>onChoose(r.id)}>Alege masa aici <span aria-hidden="true">→</span></button></div>
     </article>)}
    </div>
   </div>
   <nav className="tour-route" aria-label="Opririle turului">{tourRestaurants.map((r,i)=><button key={r.id} aria-current={active===i?'step':undefined} onClick={()=>jump(i)}><span>0{i+1}</span><strong>{r.name}</strong><small>{i===0||i===1?'DREAPTA':'STÂNGA'}</small></button>)}</nav>
  </div>
 </section>;
}
