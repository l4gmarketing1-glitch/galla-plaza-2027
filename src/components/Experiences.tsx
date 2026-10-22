import { asset } from '../lib/asset';
import './experiences.css';

const generalActivities = [
 { image:'music', label:'MUZICĂ & SPECTACOL', title:<>Încă o piesă.<br/>Încă un dans.</>, alt:'Cupluri dansând în fața unei formații live, imagine ilustrativă', description:'DJ, muzică live, taraf și lăutari. Tarabane, dansatoare și dans oriental, pentru o noapte care ține ringul plin.', detail:'Animație · Jocuri competitive' },
 { image:'fireworks', label:'SUB CERUL DE REVELION', title:<>Ne întâlnim<br/>sub artificii.</>, alt:'Invitați admirând artificii aurii într-o curte festivă, imagine ilustrativă', description:'Numărăm împreună ultimele secunde. Apoi rămânem la povești, lângă focul de tabără, cu un vin fiert în mână.', detail:'Artificii · Foc de tabără · Stație de vin fiert' },
 { image:'desserts', label:'MICILE PLĂCERI ALE NOPȚII', title:<>Ceva dulce.<br/>O amintire în plus.</>, alt:'Candy bar cu tarte, macarons și prăjituri festive, imagine ilustrativă', description:'Un candy bar imens, băuturi de sărbătoare și o oprire la selfie spot. Pleci și cu o caricatură, și cu povești de spus.', detail:'Candy bar · Stație de băuturi · Selfie spot · Caricaturi' },
];

// Add confirmed activities here; the photo grid adapts to additional cards.
const kidsActivities = [
 { image:'face-painting', title:'Pictură pe față', description:'Un strop de culoare. O lume de personaje.', alt:'Copil cu un fluture pictat pe obraz de o artistă, imagine ilustrativă' },
 { image:'hair-styling', title:'Aranjarea părului', description:'Împletituri și mici detalii de sărbătoare.', alt:'Coafură cu împletituri și panglică aurie pentru un copil, imagine ilustrativă' },
 { image:'games', title:'Sală de jocuri', description:'Râsete, joacă și încă o rundă împreună.', alt:'Doi copii jucând fotbal de masă, imagine ilustrativă' },
 { image:'workshops', title:'Ateliere', description:'Mâini creative. Idei care prind culoare.', alt:'Copii realizând decorațiuni din hârtie la un atelier, imagine ilustrativă' },
];

function ActivityPhoto({name,alt,kids=false}:{name:string;alt:string;kids?:boolean}){
 const path='/assets/activity-'+name;
 return <img src={asset(path+'.webp')} srcSet={asset(path+'-small.webp')+' 600w, '+asset(path+'.webp')+' 1200w'} sizes={kids?'(max-width: 600px) 88vw, (max-width: 1000px) 43vw, 22vw':'(max-width: 760px) 88vw, 29vw'} alt={alt} width="1200" height="900" loading="lazy" decoding="async"/>;
}

export function Experiences(){
 return <>
  <section id="experiente" className="galla-experiences section-wrap" aria-labelledby="experiences-title">
   <div className="experience-heading">
    <div><p className="eyebrow">MUZICĂ. SPECTACOL. BUCURIE.</p><h2 id="experiences-title">Toată Galla.<br/>Toată noaptea.</h2></div>
    <p>De pe ringul de dans, sub cerul cu artificii.<br/>O noapte de trăit cu toți ai tăi.</p>
   </div>
   <div className="experience-stories">
    {generalActivities.map(activity=><article className="experience-story" key={activity.image}>
     <div className="experience-photo"><ActivityPhoto name={activity.image} alt={activity.alt}/></div>
     <div className="experience-story-copy"><p className="eyebrow">{activity.label}</p><h3>{activity.title}</h3><p>{activity.description}</p><p className="experience-detail">{activity.detail}</p></div>
    </article>)}
   </div>
  </section>
  <section id="copii" className="galla-kids section-wrap" aria-labelledby="children-title">
   <div className="experience-heading kids-heading">
    <div><p className="eyebrow">PROPRIUL LOR REVELION</p><h2 id="children-title">Și cei mici.<br/><em>Mai ales cei mici.</em></h2></div>
    <p>O lume de joacă, culoare și descoperiri.<br/>Pentru ei, distracția are propriul program.</p>
   </div>
   <div className="kids-activities">
    {kidsActivities.map(activity=><article className="kids-activity" key={activity.image}>
     <div className="experience-photo"><ActivityPhoto name={activity.image} alt={activity.alt} kids/></div>
     <div className="kids-activity-copy"><h3>{activity.title}</h3><p>{activity.description}</p></div>
    </article>)}
   </div>
   <div className="experience-footer"><p>Programul final și accesul la activități se confirmă cu echipa.</p><a href="#rezervare">Venim cu toții <span aria-hidden="true">↗</span></a></div>
  </section>
 </>;
}

