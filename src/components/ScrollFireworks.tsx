import { useEffect, useRef } from 'react';
import './scroll-fireworks.css';

type FireworkStyle='bloom'|'rings'|'willow'|'stars'|'fan';
type Props={count?:2|3|4;variant?:FireworkStyle;tone?:'dark'|'light';placement?:'opening'|'header'};

/** Each section gets two short waves per visit; no animation loop while idle. */
export function ScrollFireworks({count=4,variant='bloom',tone='dark',placement='opening'}:Props){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const element=canvas.current!;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches||!('IntersectionObserver' in window))return;
  let consumed=false,visible=false,frame=0,timer=0;
  const stop=()=>{
   consumed=true;clearTimeout(timer);cancelAnimationFrame(frame);
   observer.disconnect();window.removeEventListener('scroll',schedule);
   document.removeEventListener('visibilitychange',hide);motion.removeEventListener('change',reduce);
   element.dataset.state='done';element.width=1;element.height=1;
  };
  const start=()=>{
   if(consumed||!visible||document.hidden||motion.matches||window.scrollY<80)return;
   const bounds=element.getBoundingClientRect();
   if(bounds.top>innerHeight*.84||bounds.bottom<(placement==='header'?0:innerHeight*.1))return;
   consumed=true;window.removeEventListener('scroll',schedule);
   const context=element.getContext('2d');if(!context){stop();return;}
   const width=bounds.width,height=bounds.height,small=innerWidth<=860;
   const ratio=Math.min(devicePixelRatio||1,1.5);
   element.width=Math.round(width*ratio);element.height=Math.round(height*ratio);
   context.scale(ratio,ratio);context.lineCap='round';
   element.dataset.state='playing';
   const colors=tone==='light'?['#a16c24','#b58032','#866023','#be9041']:['#f5d99a','#dcb96d','#fff1ce','#c99a48'];
   const bursts=placement==='header'?Array.from({length:count},(_,i)=>({
    x:width*(count===2?(i===0?.28:.72):(.18+i*.64/(count-1))),
    y:height*(variant==='fan'?.78:.43),delay:i*220,radius:small?16:24,
   })):[
    {x:width*.32,y:height*.48,delay:0,radius:small?40:52},
    {x:width*.73,y:height*.38,delay:180,radius:small?30:40},
    {x:width*.13,y:height*.40,delay:360,radius:small?22:30},
    {x:width*.52,y:height*.30,delay:540,radius:small?24:32},
   ].slice(0,count);
   const particles=bursts.flatMap((burst,b)=>Array.from({length:small?24:36},(_,i)=>{
    const n=small?24:36;
    const angle=variant==='fan'?-(Math.PI*.12+i/(n-1)*Math.PI*.76):i*Math.PI*2/n+b*.3;
    const spread=variant==='rings'?(i%2?.62:1):variant==='stars'?(.42+.58*Math.pow((1+Math.cos(angle*5))/2,3)):(.68+((i*17)%11)/32);
    const radius=burst.radius*spread;
    return {...burst,dx:Math.cos(angle)*radius,dy:Math.sin(angle)*radius*(variant==='willow'?.65:1),color:colors[i%colors.length],life:1450+(i%5)*80};
   }));
   const fall=variant==='willow'?(small?14:22):variant==='fan'?4:8;
   const trail=variant==='willow'?.14:variant==='rings'?.022:variant==='fan'?.1:.055;
   const origin=performance.now();let previous=-Infinity;
   const draw=(now:number)=>{
    const elapsed=now-origin;
    if(elapsed>=4900){stop();return;}
    frame=requestAnimationFrame(draw);
    if(now-previous<32)return;previous=now;
    const wave=Math.floor(elapsed/2500);
    if(element.dataset.wave!==String(wave+1))element.dataset.wave=String(wave+1);
    context.clearRect(0,0,width,height);
    for(const p of particles){
     const age=elapsed-wave*2500-p.delay;if(age<0||age>p.life)continue;
     const t=age/p.life,ease=1-Math.pow(1-t,3);
     const tail=Math.max(0,t-trail),tailEase=1-Math.pow(1-tail,3);
     const x=p.x+p.dx*ease,y=p.y+p.dy*ease+fall*t*t;
     context.globalAlpha=Math.min(1,age/65)*Math.pow(1-t,1.15)*.9;
     context.strokeStyle=p.color;context.lineWidth=1.35;
     context.beginPath();context.moveTo(p.x+p.dx*tailEase,p.y+p.dy*tailEase+fall*tail*tail);context.lineTo(x,y);context.stroke();
     if(variant==='stars'){
      const size=1.8*(1-t)+.3;
      context.beginPath();context.moveTo(x-size,y);context.lineTo(x+size,y);context.moveTo(x,y-size);context.lineTo(x,y+size);context.stroke();
     }else{context.fillStyle=p.color;context.beginPath();context.arc(x,y,1.25*(1-t)+.25,0,Math.PI*2);context.fill();}
    }
   };
   frame=requestAnimationFrame(draw);
  };
  function schedule(){
   if(consumed)return;clearTimeout(timer);
   // Let a fast anchor jump pass without playing an off-screen decoration.
   if(visible)timer=window.setTimeout(start,140);
  }
  function hide(){if(document.hidden){if(consumed)stop();else clearTimeout(timer);}else schedule();}
  function reduce(){if(motion.matches)stop();}
  const observer=new IntersectionObserver(entries=>{
   visible=entries.some(entry=>entry.isIntersecting);
   if(!visible&&consumed)stop();else schedule();
  },{rootMargin:placement==='header'?'0px 0px -16% 0px':'-10% 0px -16% 0px',threshold:.12});
  observer.observe(element);
  window.addEventListener('scroll',schedule,{passive:true});
  document.addEventListener('visibilitychange',hide);motion.addEventListener('change',reduce);
  return stop;
 },[count,variant,tone,placement]);
 return <canvas ref={canvas} className={`scroll-fireworks scroll-fireworks--${placement}`} width="1" height="1" aria-hidden="true" data-state="waiting" data-pattern={variant} data-bursts={count}/>;
}
