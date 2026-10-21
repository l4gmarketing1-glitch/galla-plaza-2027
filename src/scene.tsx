import type { ScrollScrubScene } from './components/scroll-scrub/scroll-scrub';
export const theme={background:'#101f1c',ink:'#f1f5f1',muted:'#cad4ce',accent:'#bfcac5'};
export const scenes:ScrollScrubScene[]=[{
 id:'inceput',label:'Galla Plaza',kicker:'REVELION 2027 · GALLA PLAZA',
 title:'O noapte. Patru lumi.',body:'Patru restaurante. Muzică, spectacol și bucurie pentru toate vârstele. Intrăm în 2027 împreună.',
 clip:'/assets/world/hero.mp4',mobileClip:'/assets/world/hero-mobile.mp4',poster:'/assets/world/hero.webp',mobilePoster:'/assets/world/hero-mobile.webp',scroll:2.1,linger:0.12,
 actions:<><a className="hero-cta" href="#rezervare">Rezervă experiența <span aria-hidden="true">↗</span></a><a className="hero-explore" href="#harta">Descoperă locația</a></>
}];
