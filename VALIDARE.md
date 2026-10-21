# Verificarea livrării

- Build TypeScript și Vite reușit, cu HTML prerandat în română.
- Un singur H1; meniurile, adresa, prețurile și informațiile principale sunt în HTML înainte de JavaScript.
- JSON-LD Event și Organization parsate; datele folosesc 31.12.2026 și 01.01.2027, fără oră inventată.
- Teste automate pentru prețuri și toate dimensiunile de grup până la capacitatea fiecărui restaurant (maximum 300); validare server, suficiența locurilor, respingerea datelor invalide, stocare SQLite, idempotență și limitarea abuzurilor.
- Browser Edge/Chromium: harta deschide meniul corect, dialogul se închide cu Escape, 40 adulți selectează exact 40 de locuri și total 38.000 lei, formularul persistă cererea și afișează referința.
- Fără depășire orizontală la 375, 768 și 1440 px.
- Turul a avansat la aproximativ 12,13 secunde după scroll și a revenit la aproximativ 0,63 secunde la scroll invers.
- Zero fișiere lipsă și zero erori JavaScript în testul buildului.
- Preferința de mișcare redusă: zero cereri pentru MP4. Data Saver și conexiunile 2G folosesc de asemenea posterul static.
- Cadrele de început sunt extrase din videoclipurile optimizate finale.
- Media activă: tur desktop 4.793.409 bytes; tur mobil 3.076.021 bytes; poster 36.802 bytes. Filmul complet are aproximativ 15 secunde și se încarcă la apropierea de tur. Hero-ul folosește un colaj separat, descris mai jos. Butonul separat pentru filmul culinar a fost eliminat; meniurile restaurantelor rămân disponibile.
- JavaScript client ~84,8 KB gzip; CSS ~11,7 KB gzip. Nu sunt valori Lighthouse sau măsurători pe conexiunea reală a clienților.
- Nu a fost efectuată nicio publicare. Buildul curent are noindex și robots de previzualizare.

## Limite care țin de lansare

API-ul Vercel și schema Supabase sunt pregătite, dar serviciul de producție nu este conectat la un cont Supabase și nu a fost publicat. Formularul este funcțional local, cu salvare reală în SQLite. Emailurile/SMS-urile automate nu sunt configurate. Google Rich Results și Search Console se verifică pe domeniul real după publicare; nu se garantează clasări sau apariții speciale. Planul meselor este o propunere, conform solicitării organizatorului.

## Revizia verificată

`node scripts/tour-qa.mjs` verifică toate cele patru opriri în ordinea Ciorbar → El Tajine → Game On → Rossa, punctul activ vizibil pe desktop și mobil, dezvăluirea progresivă și încadrarea fără deplasări laterale, derulare înainte/înapoi, acces direct la oprire, dialog și Escape, preselectarea restaurantului în formular și configurarea a 40 de adulți. Testează și navigarea fără mișcare, zero cereri video în acel mod, lipsa depășirilor orizontale, HTML prerandat, un singur H1 și JSON-LD valid. Capturile și rezultatele locale sunt în `qa/`.

Revizia curentă folosește filmul cu mașini în parcare, invitați în curte, formație în stânga și invitați pe balconul central din spate. `qa/revision-results.json` conține rezultatele pentru navigarea lină, traseul complet și apariția treptată a punctelor.


Revizia media cu mașini și scenă: cadrele sursei la 0, 5, 10, 11 și 14 secunde au fost verificate vizual. Parcarea are mașini; mesele și invitații sunt în curte, iar formația este în stânga. Compararea SHA-256 pentru cele 17 fișiere din src/api/server confirmă că singura diferență de cod este adresa posterului din RestaurantTour.tsx. Stilurile, meniurile, formularul și logica derulării sunt identice cu versiunea aprobată.

Revizia balconului: cadrele noii surse la 0, 5, 10 și 11 secunde au fost inspectate vizual. Invitații apar în balconul cu arcade indicat în referință. Compararea SHA-256 cu starea aprobată anterioară confirmă zero modificări în src/api/server și exact trei materiale înlocuite în public: cele două videoclipuri walkthrough și posterul lor.

Corecția luminii balconului: comparații vizuale înainte/după la 0, 6 și 11 secunde sursă; cadre finale inspectate la 3, 8, 12 și 14,8 secunde. Corecția reduce strălucirea albă și produce o lumină caldă, discretă. Verificarea celor 264 de cadre confirmă că editarea se limitează la zona balconului înainte de compresie. Previzualizarea locală pe portul 4173 a fost repornită.

## Planuri interactive · 21 octombrie 2026

Șase teste Node verificate: capacități 100/100/150/300, combinații pentru fiecare mărime de grup, locuri valide și unice, versiune de plan, preț calculat pe server, migrare aditivă a unei cereri vechi, persistență, retry idempotent și rate limiting.

`qa/seating-results.json`: scaune individuale, mese întregi, 300 de locuri Rossa în trei zone, păstrarea separată a selecțiilor, adulți/copii, deplasarea planului pe mobil, sumar înaintea contactului pe mobil și salvare SQLite reală pentru 38 adulți + 2 copii = 37.400 lei. Cererea QA este eliminată la final. Zero erori JavaScript și zero resurse lipsă. Turul cinematic și navigarea în meniuri au trecut testele existente.

Planurile nu sunt inventar live. Plata Stripe este documentată pentru etapa următoare, fără încasări sau blocări de locuri în această versiune. Migrarea Supabase este pregătită în SQL, dar nu a fost executată pe un serviciu de producție.

## Colaj hero · 21 octombrie 2026

Build reușit. `scripts/hero-qa.mjs` și `qa/hero-results.json`: autoplay fără sunet, buclă, playsInline, versiune mobilă, pauză manuală păstrată după revenirea în secțiune, reluare manuală și pauză în afara ecranului. Zero cereri video hero pentru mișcare redusă și Data Saver. Zero erori JavaScript și zero depășire orizontală la 375/1440 px. Capturile desktop/mobil au fost inspectate vizual pentru contrast și poziționarea butonului. Compararea cu arhiva aprobată confirmă că materialele anterioare, turul, formularul și codul serverului sunt identice.

## Simplificarea interfeței · 21 octombrie 2026

Eliminate: butonul „O privire în meniu” și panoul său video, etichetele decorative de la capătul planurilor, legenda „Loc în plan / Ales de tine / Mese de 2 · 4 · 6 · 8” și nota „Nu se încasează bani acum…”. Build reușit; verificare în browser la 375/1440 px pentru toate cele patru restaurante: selecția scaunelor funcționează, fără depășiri orizontale sau erori JavaScript.

## Fotografii și acces restaurant · 21 octombrie 2026

Build TypeScript/Vite reușit. Verificate în browser cele patru imagini noi, decodarea lor, referințele din tur și eticheta „Acces restaurant” pentru fiecare plan. Fără erori JavaScript sau depășire orizontală la 375/1440 px. Capturile cardurilor pe mobil au fost inspectate vizual.
