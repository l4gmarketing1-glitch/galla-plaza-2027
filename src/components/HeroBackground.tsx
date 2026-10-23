import { asset } from '../lib/asset';
import { observeMediaIntent } from '../lib/media-intent';
import {useEffect,useRef,useState} from 'react';
import './hero-background.css';

export function HeroBackground(){
 const video=useRef<HTMLVideoElement>(null),root=useRef<HTMLDivElement>(null);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const film=video.current!,element=root.current!,mq=matchMedia('(prefers-reduced-motion: reduce)');
  const connection=(navigator as Navigator & {connection?:EventTarget & {saveData?:boolean;effectiveType?:string}}).connection;
  let visible=false,disposed=false,startTimer=0;
  const economical=()=>mq.matches||!!connection?.saveData||/2g/.test(connection?.effectiveType??'');
  const sync=()=>{
   if(disposed)return;
   if(economical()){film.pause();film.removeAttribute('src');film.load();setReady(false);return;}
   if(!visible||document.hidden||document.readyState!=='complete'||!intent.allows()){film.pause();return;}
   const bounds=element.getBoundingClientRect();
   if(bounds.bottom<=0||bounds.top>=innerHeight){film.pause();return;}
   if(!film.hasAttribute('src')){film.src=innerWidth<700?asset('/assets/world/hero-montage-mobile-fast.mp4'):asset('/assets/world/hero-montage-fast.mp4');film.load();}
   film.muted=true;void film.play().catch(()=>{});
  };
  const schedule=()=>{clearTimeout(startTimer);startTimer=window.setTimeout(sync,300);};
  const intent=observeMediaIntent('inceput',schedule);
  const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(!visible)film.pause();schedule();},{threshold:0.08});
  observer.observe(element);mq.addEventListener('change',sync);connection?.addEventListener('change',sync);document.addEventListener('visibilitychange',schedule);window.addEventListener('load',schedule);
  return()=>{disposed=true;intent.dispose();clearTimeout(startTimer);observer.disconnect();mq.removeEventListener('change',sync);connection?.removeEventListener('change',sync);document.removeEventListener('visibilitychange',schedule);window.removeEventListener('load',schedule);film.pause();film.removeAttribute('src');film.load();};
 },[]);
 return <>
  <div ref={root} className="hero-background" aria-hidden="true">
   <img className="hero-montage-poster" src={asset('/assets/world/hero-montage.webp')} alt="" width="1280" height="720" fetchPriority="high"/>
   <video ref={video} className={`hero-montage-video ${ready?'is-ready':''}`} autoPlay muted playsInline loop preload="none" tabIndex={-1} onPlaying={()=>setReady(true)} onError={()=>setReady(false)}/>
  </div>
 </>;
}
