import { useEffect, useRef, useState } from 'react';
import { asset } from '../lib/asset';
import manifest from '../lib/media-manifest.json';

type Media = { width:number; height:number; placeholder:string; variants:{width:number;avif:string;webp:string}[] };
const media = manifest as Record<string,Media>;

/** A tiny embedded preview paints with the HTML while the responsive photo loads. */
export function MediaImage({src,alt,sizes,className}:{src:string;alt:string;sizes:string;className?:string}){
 const image=useRef<HTMLImageElement>(null);
 const [near,setNear]=useState(false);
 const item=media[src.split('/').pop()!.replace(/\.webp$/,'')];
 useEffect(()=>{
  if(!image.current||!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){setNear(true);observer.disconnect();}
  },{rootMargin:'1000px 0px'});
  observer.observe(image.current);
  return()=>observer.disconnect();
 },[]);
 if(!item)return <img ref={image} src={src} alt={alt} className={className} loading={near?'eager':'lazy'} decoding="async"/>;
 const srcset=(format:'avif'|'webp')=>item.variants.map(v=>asset(v[format])+' '+v.width+'w').join(', ');
 return <picture style={{display:'contents'}}>
  <source type="image/avif" srcSet={srcset('avif')} sizes={sizes}/>
  <img ref={image} className={className} src={asset(item.variants.at(-1)!.webp)} srcSet={srcset('webp')} sizes={sizes} alt={alt} width={item.width} height={item.height} loading={near?'eager':'lazy'} decoding="async" style={{backgroundImage:'url('+item.placeholder+')',backgroundSize:'cover',backgroundPosition:'center'}}/>
 </picture>;
}
