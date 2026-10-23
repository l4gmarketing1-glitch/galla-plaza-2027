# Galla Plaza · Revelion 2027

Landing page portabil, în română. Prezentare pentru client pe GitHub Pages: https://l4gmarketing1-glitch.github.io/galla-plaza-2027/. Videoclipurile au fost generate cu Seedance 2.5 prin Higgsfield; fotografiile actuale ale restaurantelor și referința hărții sunt furnizate de utilizator.

## Ce conține

- Colaj video în fundalul hero-ului: trupă, dans, mâncare și deserturi, cu redare automată fără sunet, în buclă și buton de pauză. Versiune mobilă sub 1 MB; poster static pentru mișcare redusă și economisirea datelor.
- Tur cinematic controlat de scroll în „Intră în lumea Galla”, poster instant, video adaptat pe telefon și respectarea preferinței de mișcare redusă.
- Patru opriri, în ordine: 01 Ciorbar (dreapta), 02 El Tajine (dreapta, mai departe), 03 Game On (stânga, mai adânc în curte decât El Tajine), 04 Rossa (stânga, după Game On). Punctele se dezvăluie treptat; toate restaurantele rămân accesibile din navigarea de jos. Camera înaintează pe traseul complet de 15 secunde, fără deplasări laterale adăugate. Scrollul este amortizat și schimbă cadrul și meniul; clicul pe punct sau pe navigarea de jos sare direct la oprire. Pozițiile sunt orientative.
- Meniuri în HTML, accesibile fără JavaScript; modaluri utilizabile cu tastatura.
- Planuri interactive distincte: Ciorbar 100 locuri, El Tajine 100, Game On 150 (două zone), Rossa 300 (trei zone). Mese de 2, 4, 6 și 8, scaune numerotate, selecție individuală sau a întregii mese. Adulți 950 lei, copii 650 lei; un loc pentru fiecare persoană.
- Plan propus, fără inventarea disponibilității. Trimiterea este o cerere de rezervare, nu un bilet achitat.
- Formular real cu validare pe server, cheie de idempotență și limitare a solicitărilor. Fără endpoint public pentru datele clienților.
- HTML prerandat, metadata, Open Graph, Event JSON-LD, sitemap, canonical și robots generate pentru domeniul final.

## Pornire locală

Node.js 24 LTS și npm sau pnpm:

```sh
npm install
npm run dev
```

Deschide http://127.0.0.1:5173. Solicitările se salvează local în `data/reservations.sqlite`. Directorul este exclus din Git și din arhiva de livrare. Pentru build:

```sh
npm test
npm run build
npm start
```

Previzualizarea buildului: http://127.0.0.1:4173. Fără `SITE_URL`, buildul are `noindex` și robots blochează crawl-ul intenționat.

## Vercel, după aprobarea publicării

1. Creează un proiect Supabase și rulează `supabase/schema.sql`. Tabelele sunt private; nu adăuga politici publice.
2. Pune sursele într-un repository GitHub și importă-l în Vercel. `vercel.json` configurează buildul și funcția API.
3. Configurează în Vercel: `SITE_URL=https://domeniul-final.ro`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Cheia service role este numai pe server. Nu o prefixa cu `VITE_` și nu o publica în Git.
4. Publică numai când este aprobat. `SITE_URL` activează indexarea și generează URL-urile canonice. Dacă folosești protecția preview Vercel, dezactiveaz-o numai pentru producția aprobată.
5. Configurează ștergerea zilnică a cererilor expirate cu Supabase Cron, folosind comanda de la finalul schemei. Endpointul elimină și el cererile expirate când primește solicitări.
6. Echipa consultă cererile în tabelul privat `galla_reservations` din Supabase. Marcarea `status=confirmed` este o operațiune a organizatorului. Nu există email/SMS automat configurat.
7. Verifică formularul pe domeniul real, Rich Results Test și Search Console. Trimite sitemap-ul după lansare. Ora exactă a evenimentului nu este inventată: datele structurate folosesc data calendaristică, până este confirmată ora.

Funcția de producție returnează un mesaj clar de indisponibilitate dacă nu este configurată baza de date; nu afișează confirmări fictive.

## GitHub Pages și alte găzduiri

GitHub poate păstra întregul cod. Pentru găzduire pe GitHub Pages, folosește domeniu personalizat/rădăcină și fișierele din `dist`. Pages este static: formularul are nevoie de endpointul Vercel separat. La build setează `VITE_RESERVATION_API=https://api-domeniu.ro/api/reservations`, iar pentru API configurează `ALLOWED_ORIGIN` cu originea exactă a paginii. Adaptează CSP `connect-src` pentru acea origine. Nu publica directorul `data`.

Site-ul poate fi previzualizat în browserul Codex/ChatGPT de pe acest calculator. Acest lucru nu reprezintă găzduire publică permanentă. Proiectul este independent de găzduirea Higgsfield.

## De confirmat înaintea campaniei

- Ora de acces și programul, vârsta pentru tariful de copil, serviciile incluse și condițiile de rezervare/plată.
- Planul real al meselor și poziționarea exactă a punctelor de pe hartă.
- Rândurile ambigue din meniurile originale, enumerate în `content-notes.md`.
- Identitatea juridică a organizatorului și textul final de confidențialitate.

Nu sunt instalate analytics sau reclame. Nu se promit poziții Google sau apariție garantată în rezultate speciale.

## Validare

`npm test`: capacități exacte și selecții 1–300 (în limita restaurantului), locuri duplicate/inexistente/străine, plan expirat, egalitate persoane/locuri, prețuri server, persistență, migrarea datelor vechi, idempotență și rate limiting. `scripts/browser-qa.mjs` rulează testele turului și `scripts/seating-qa.mjs` pe preview 4173: interacțiuni, salvare reală a cererii de test (eliminată ulterior), zone și afișare pe 375/768/1440px. Scriptul de browser folosește Playwright și Edge; setează `PLAYWRIGHT_PATH` dacă biblioteca nu este în runtime-ul local Codex.

Surse tehnice: [Google Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event), [Vercel Node.js runtime](https://vercel.com/docs/functions/runtimes/node-js).

## Rezervare și Stripe

Formularul unic include restaurant, scaune exacte, compoziția adulți/copii, contact și sumar. Selecțiile restaurantelor se păstrează separat pe durata vizitei. Cererile sunt preferințe și nu blochează inventarul. Schema salvează deja identificatorii locurilor, versiunea planului, moneda RON, suma în bani și starea de plată; integrarea Stripe și blocarea simultană a locurilor nu sunt încă implementate. Vezi [PAYMENT-PLAN.md](PAYMENT-PLAN.md). Pentru o instalare Supabase existentă, reaplică schema SQL actualizată.

## Prezentare GitHub Pages

Workflow-ul `.github/workflows/pages.yml` construiește și publică automat prezentarea de pe `main`. `pnpm run build:pages` citește domeniul din `CNAME`: pentru `revelion.gallaplaza.ro` folosește rădăcina `/`, iar fără domeniu personalizat folosește prefixul `/galla-plaza-2027/`. Fișierul `CNAME` este inclus și în `dist`. Astfel CSS-ul, JavaScript-ul, imaginile și videoclipurile au căile potrivite pentru domeniul configurat.

În Settings → Pages, domeniul personalizat trebuie să fie `revelion.gallaplaza.ro`. În DNS, înregistrarea CNAME `revelion` indică spre `l4gmarketing1-glitch.github.io` (fără numele repository-ului). Activează Enforce HTTPS după emiterea certificatului. Sursa recomandată pentru acest proiect Vite este GitHub Actions; workflow-ul existent așteaptă și publicarea din branch, dacă aceasta mai este activă, pentru ca artefactul construit să fie publicat ultimul.

Buildul Pages păstrează `noindex` și dezactivează trimiterea rezervărilor. Selecția locurilor și calculul prețului rămân interactive. Versiunea normală pentru Vercel folosește în continuare `pnpm run build` și formularul API.
