import { asset } from '../lib/asset';
import { observeMediaIntent } from '../lib/media-intent';
import {useEffect,useRef,useState} from 'react';
import './hero-background.css';

export function HeroBackground(){
 const video=useRef<HTMLVideoElement>(null),root=useRef<HTMLDivElement>(null),manualPause=useRef(false);
 const [ready,setReady]=useState(false),[playing,setPlaying]=useState(false),[available,setAvailable]=useState(false);
 useEffect(()=>{
  const film=video.current!,element=root.current!,mq=matchMedia('(prefers-reduced-motion: reduce)');
  const connection=(navigator as Navigator & {connection?:EventTarget & {saveData?:boolean;effectiveType?:string}}).connection;
  let visible=false,disposed=false,startTimer=0;
  const economical=()=>mq.matches||!!connection?.saveData||/2g/.test(connection?.effectiveType??'');
  const sync=()=>{
   if(disposed)return;
   if(economical()){film.pause();film.removeAttribute('src');film.load();setAvailable(false);setReady(false);return;}
   if(!visible||document.hidden||manualPause.current||document.readyState!=='complete'||!intent.allows()){film.pause();return;}
   const bounds=element.getBoundingClientRect();
   if(bounds.bottom<=0||bounds.top>=innerHeight){film.pause();return;}
   if(!film.hasAttribute('src')){film.src=innerWidth<700?asset('/assets/world/hero-montage-mobile-fast.mp4'):asset('/assets/world/hero-montage-fast.mp4');film.load();setAvailable(true);}
   film.muted=true;void film.play().catch(()=>{if(!disposed)setPlaying(false);});
  };
  const schedule=()=>{clearTimeout(startTimer);startTimer=window.setTimeout(sync,300);};
  const intent=observeMediaIntent('inceput',schedule);
  const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(!visible)film.pause();schedule();},{threshold:0.08});
  observer.observe(element);mq.addEventListener('change',sync);connection?.addEventListener('change',sync);document.addEventListener('visibilitychange',schedule);window.addEventListener('load',schedule);
  return()=>{disposed=true;intent.dispose();clearTimeout(startTimer);observer.disconnect();mq.removeEventListener('change',sync);connection?.removeEventListener('change',sync);document.removeEventListener('visibilitychange',schedule);window.removeEventListener('load',schedule);film.pause();film.removeAttribute('src');film.load();};
 },[]);
 function toggle(){const film=video.current!;if(!film.paused){manualPause.current=true;film.pause();}else{manualPause.current=false;film.muted=true;void film.play().catch(()=>setPlaying(false));}}
 return <>
  <div ref={root} className="hero-background" aria-hidden="true">
   <img className="hero-montage-poster" src={asset('/assets/world/hero-montage.webp')} alt="" width="1280" height="720" fetchPriority="high"/>
   <video ref={video} className={`hero-montage-video ${ready?'is-ready':''}`} autoPlay muted playsInline loop preload="none" tabIndex={-1} onPlaying={()=>{setReady(true);setPlaying(true);}} onPause={()=>setPlaying(false)} onError={()=>{setReady(false);setAvailable(false);}}/>
  </div>
  {available&&<button type="button" className="hero-video-toggle" onClick={toggle} aria-label={playing?'Pune videoclipul pe pauză':'Pornește videoclipul de fundal'}><span aria-hidden="true">{playing?'Ⅱ':'▷'}</span>{playing?'Pauză video':'Redă video'}</button>}
 </>;
}
