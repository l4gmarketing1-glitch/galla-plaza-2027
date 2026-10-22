import { asset } from '../lib/asset';
import { childrenActivities } from '../lib/galla/content';
import './experiences.css';

function ActivityIcon({kind}:{kind:number}){
 const drawings=[
  <><path d="M8 23c-4-1-5-4-4-8C5 8 12 4 19 5c7 1 12 5 12 11 0 4-3 6-7 5-3-1-5 0-5 3 0 5-7 7-11 3"/><circle cx="11" cy="14" r="1"/><circle cx="17" cy="10" r="1"/><circle cx="24" cy="12" r="1"/><path d="m10 31 9-15m-9 15-3 1 1-4"/></>,
  <><path d="m11 29 15-18c2-3 0-6-3-4L8 24c-3 3 0 7 3 5Z"/><path d="m12 21 5 4m-1-8 5 4m-1-8 5 4m-1-8 5 4"/></>,
  <><path d="M12 12h12c5 0 6 4 7 9l1 5c0 4-4 5-6 2l-4-4h-8l-4 4c-2 3-6 2-6-2l1-5c1-5 2-9 7-9Z"/><path d="M12 16v6m-3-3h6m3-7V7"/><circle cx="24" cy="17" r="1"/><circle cx="27" cy="21" r="1"/></>,
  <><path d="m7 24 17-17 5 5-17 17-7 2 2-7Zm13-13 5 5M7 24l5 5"/><path d="M20 24h10m-9 5h9M6 9h7M9.5 5.5v7"/></>,
 ];
 return <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[kind]}</svg>;
}

export function Experiences(){
 return <section id="experiente" className="galla-experiences section-wrap" aria-labelledby="experiences-title">
  <div className="experience-heading">
   <div><p className="eyebrow">O NOAPTE PENTRU TOȚI AI TĂI</p><h2 id="experiences-title">Toată Galla.<br/>Toată noaptea.</h2></div>
   <p>Pe ring, în curte sau în lumea celor mici.<br/>Fiecare își găsește bucuria. Împreună, sărbătorim.</p>
  </div>
  <div className="experience-stories">
   <article className="experience-story experience-music">
    <div className="experience-photo"><img src={asset('/assets/celebration-music.webp')} alt="Atmosferă ilustrativă de muzică live și dans" width="1000" height="750" loading="lazy" decoding="async"/><span>MUZICĂ & SPECTACOL</span></div>
    <div className="experience-story-copy"><h3>Încă o piesă.<br/>Încă un dans.</h3><div><p>DJ, muzică live, taraf și lăutari. Tarabane, dansatoare și dans oriental, pentru o noapte care ține ringul plin.</p><p className="experience-detail">Animație · Jocuri competitive</p></div></div>
   </article>
   <article className="experience-children" aria-labelledby="children-title">
    <p className="eyebrow">JOACĂ & DESCOPERIRI</p>
    <h3 id="children-title">Și cei mici.<br/><em>Mai ales cei mici.</em></h3>
    <p className="children-intro">O seară de joacă, culoare și descoperiri. Propriul lor Revelion de povestit.</p>
    <ul className="children-moments">{childrenActivities.map((activity,i)=><li key={activity}><ActivityIcon kind={i}/><span>{activity}</span></li>)}</ul>
   </article>
   <article className="experience-story experience-outdoors">
    <div className="experience-photo"><img src={asset('/assets/celebration-courtyard.webp')} alt="Familii în jurul unui foc de tabără în curtea festivă, vizualizare ilustrativă" width="1000" height="750" loading="lazy" decoding="async"/><span>SUB CERUL DE REVELION</span></div>
    <div className="experience-story-copy"><h3>Ne întâlnim<br/>sub artificii.</h3><div><p>Numărăm împreună ultimele secunde. Apoi rămânem la povești, lângă focul de tabără, cu un vin fiert în mână.</p><p className="experience-detail">Artificii · Foc de tabără · Stație de vin fiert</p></div></div>
   </article>
   <article className="experience-story experience-treats">
    <div className="experience-photo"><img src={asset('/assets/celebration-dessert.webp')} alt="Prezentare ilustrativă a unui candy bar festiv" width="1000" height="750" loading="lazy" decoding="async"/><span>MICILE PLĂCERI ALE NOPȚII</span></div>
    <div className="experience-story-copy"><h3>Ceva dulce.<br/>O amintire în plus.</h3><div><p>Un candy bar imens, băuturi de sărbătoare și o oprire la selfie spot. Pleci și cu o caricatură, și cu povești de spus.</p><p className="experience-detail">Candy bar · Stație de băuturi · Selfie spot · Caricaturi</p></div></div>
   </article>
  </div>
  <div className="experience-footer"><p>Programul final și accesul la activități se confirmă cu echipa.</p><a href="#rezervare">Vreau să fiu acolo <span aria-hidden="true">↗</span></a></div>
 </section>;
}
