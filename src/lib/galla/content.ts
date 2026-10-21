import { asset } from '../asset';
export type MenuGroup = { title: string; items: string[] };
export type Restaurant = { id: string; name: string; cuisine: string; intro: string; image: string; imageAlt: string; signature: string; groups: MenuGroup[]; x: number; y: number };
export const restaurants: Restaurant[] = [
{ id:'game-on', name:'GAME ON', cuisine:'Gusturi îndrăznețe. Bucuria de a împărți.', intro:'Brânză cremoasă, smochine și nuci, alături de pâine rumenită. Un început generos, de împărțit cu prietenii, pentru o noapte plină de energie.', image:asset('/assets/game-on-revelion.webp'), imageAlt:'Brânză cremoasă cu smochine, nuci și felii de pâine rumenită', signature:'Mini burgeri, seafood și coaste glazurate', x:60,y:26,
 groups:[
 {title:'Bufet rece',items:['Salată grecească','Foi de brânză cu somon','Confit de roșii cherry și usturoi pe pat de brânză tzatziki','Tricolor de salate de vinete pe pâine de casă','Grisine grecești cu măsline','Ciuperci umplute']},
 {title:'Coșuri tortilla',items:['Creveți','Mousse de ficăței','Salată de ton','Somon afumat cu icre negre']},
 {title:'Supe cremă în cești espresso',items:['Dovleac','Ciuperci','Broccoli']},
 {title:'Stație de mini frigărui',items:['Mix seafood','Pui asiatic','Vită colorată','Rulouri kebab','Curcubeu de legume']},
 {title:'Spring rolls',items:['Vegetarian','Vietnamez cu porc și creveți','Pui thailandez','Selecție de sosuri']},
 {title:'Mini burgeri',items:['Classic','Crab burger','Cheeseburger']},
 {title:'Vedetele serii',items:['Wrap cu pui crispy și sos Bang Bang','Coaste de porc cu glazură de miere și usturoi']},
 {title:'Coperto',items:['Selecția casei, detalii la confirmarea rezervării']}
 ]},
{ id:'ciorbar',name:'CIORBAR',cuisine:'Gust bogat. Suflet de petrecere.',intro:'Aluat rumenit, umplutură generoasă de carne, sos cremos și verdețuri proaspete. Gusturi bogate și o masă în jurul căreia se adună toată gașca.',image:asset('/assets/ciorbar-revelion.webp'),imageAlt:'Aluat rumenit în formă de bărcuță, cu carne, sos cremos, ceapă roșie și verdețuri',signature:'Bufet românesc, ceaune și preparate tradiționale',x:85,y:41,
 groups:[
 {title:'Bufet rece',items:['Salată de boeuf','Piftie','Bufet rece cu prezentare artistică','Twisted bacon','Bărcuțe cu ouă umplute','Salată de pui']},
 {title:'Preparate calde',items:['Ceafă de porc cu cârnați în sos de vin roșu','Cordon bleu','Piure de cartofi','Scoici la ceaun în sos de vin']},
 {title:'La ceaun, afară',items:['Ciorbă la începutul nopții','Saramură de pui sau pește','Mămăligă „Taci și înghite”']},
 {title:'Pe masă',items:['Platou cu prezentare artistică','Țuică','Vișinată']}
 ]},
{ id:'mamas-tajine',name:'EL TAJINE',cuisine:'Maroc autentic. O lume de arome.',intro:'Pui rumenit, măsline și lămâie, învăluite în mirodenii și servite în tajine. Arome marocane care te invită să savurezi fiecare moment al serii.',image:asset('/assets/tajine-revelion.webp'),imageAlt:'Tajine cu pui rumenit, măsline verzi și felii de lămâie',signature:'Tajine de miel, vită și pește marocan',x:88,y:25,
 groups:[
 {title:'Selecția de pe masă',items:['Matbuha','Zaalouk de vinete marocane','Salată de dovleac marocan','Salată de sfeclă','Măsline în sos roșu','Tricolor de ardei copți','Charmoula de vinete prăjite','Salată de morcovi cu fenicul','Salată de cartofi Maakouda','Salată arăbească','Hummus cu legume la cuptor','Salată de vinete cu usturoi','Salată de varză roșie','Pâine marocană']},
 {title:'Supă',items:['Harira vegetariană']},
 {title:'Cigars umplute',items:['Vițel și migdale','Ciuperci cu cartofi','Pește']},
 {title:'Tajine',items:['Vită asado cu prune uscate și migdale în sos de miere','Miel în sos de caise','Pește marocan cu măsline','Pui cu ciuperci','Vită cu miel și năut']}
 ]},
{ id:'rosa',name:'ROSSA',cuisine:'Accent italian. Eleganță în farfurie.',intro:'Conchiglie umplute cu ricotta și spanac, în sos de roșii, gratinate la cuptor. Căldura unei mese italiene, cu gusturi delicate și bucuria de a fi împreună.',image:asset('/assets/rossa-revelion.webp'),imageAlt:'Conchiglie cu ricotta și spanac, gratinate în sos de roșii',signature:'Burrata, risotto cu trufe și vitello tonnato',x:64,y:14,
 groups:[
 {title:'Aperitive',items:['Vitello tonnato reinventat','Carpaccio de roșii','Salată Caprese','Pere cu mix de salate și nuci caramelizate','Ruladă de speck cu burrata pe pat de rucola']},
 {title:'Expoziție de macarons sărați',items:['Somon afumat','Creveți','Ficat de gâscă','Icre negre']},
 {title:'La cuptor',items:['Cartoccio cu roșii, usturoi, măsline și capere','Cartofi smashed cu rozmarin']},
 {title:'Feluri principale',items:['Beef braciole','Caesar chicken cu cremă de parmezan','Risotto cu trufe']},
 {title:'Conchiglie cu ricotta și spanac',items:['Mix de ciuperci','Ragù de vițel']},
 {title:'Coperto',items:['Unt','Olive dip','Pâine de casă și focaccia']}
 ]}
];
// The supplied text contains unclear handwritten entries. They are not invented.
export const music=['DJ','Tarabane','Dansatoare','Taraf','Dansatoare din buric','Muzică live','Lăutari'];
export const experiences=['Artificii','Animație','Jocuri competitive','Caricaturi','Selfie spot','Foc de tabără','Candy bar imens','Stație de vin fiert','Stație de băuturi'];
export const childrenActivities=['Pictură pe față','Aranjarea părului','Sală de jocuri','Ateliere'];
export const faq=[
 ['Cum rezerv?', 'Alegi restaurantul și locurile pe plan, indici câți invitați sunt copii și completezi datele de contact în același formular. Echipa revine pentru disponibilitate și confirmare. Solicitarea nu blochează locurile și nu reprezintă un bilet achitat.'],
 ['Pot să aleg o masă anume?', 'Da. Apasă pe scaune pentru locuri individuale sau pe numărul unei mese pentru toate locurile ei. Poți combina mese pentru grupuri mari. Schițele sunt orientative; amplasarea finală și disponibilitatea se confirmă cu organizatorul.'],
 ['Există activități pentru copii?', 'Da. Sunt pregătite pictură pe față, aranjarea părului, sală de jocuri și ateliere. Detaliile de acces și grupele de vârstă se confirmă la rezervare.'],
 ['Care este prețul și ce include?', 'Tariful este de 950 lei pentru un adult și 650 lei pentru un copil. Serviciile incluse, limita de vârstă pentru copii și condițiile finale se confirmă cu organizatorul.'],
 ['Pot anunța alergii sau preferințe alimentare?', 'Da. Solicită echipei informații despre ingrediente, alergeni și opțiuni alimentare înainte de confirmarea rezervării. Meniurile prezentate sunt propunerile pentru eveniment.'],
 ['Când are loc evenimentul?', 'Revelion 2027: noaptea de 31 decembrie 2026 spre 1 ianuarie 2027. Ora de acces și programul final vor fi comunicate de organizator.']
];

