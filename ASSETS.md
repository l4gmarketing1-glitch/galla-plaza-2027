# Proveniența materialelor

- Imaginea hărții: imaginea utilizatorului „WhatsApp Image 2026-10-13 at 01.48.00.jpeg”, optimizată în WebP.
- Filmul arhitectural și cadrele hero/night/cover: Higgsfield Seedance 2.5, job `ce2874dc-4b1b-4f72-bcc6-e633d8d2b0c4`, 15 secunde, referința locației furnizată de utilizator.
- Filmul culinar și imaginile celor patru restaurante: Higgsfield Seedance 2.5, job `b4fbb1e9-f959-4d41-a4dd-7bd5d258500f`, 12 secunde. Cadre la 1,5 / 4,5 / 7,5 / 10,5 secunde.
- Posterele hero sunt extrase din videoclipurile finale optimizate, pentru continuitatea primului cadru.
- Harta rămâne orientativă; vizualurile video și culinare sunt prezentări de atmosferă, nu fotografii documentare ale evenimentului viitor.
- Tipografia paginii: Outfit, găzduit local, licență SIL Open Font License în `public/assets/fonts/OFL.txt`.
- Coperta socială: scenă Seedance cu tipografie compusă în Higgsfield; iconurile și interfața sunt desenate în cod.

Niciun alt model generativ nu a fost folosit. Site-ul nu face apeluri de generare AI la vizitatori și nu depinde de serviciile Higgsfield la rulare.

## Revizia turului cinematic · 15 octombrie 2026

- Filmul cu mai multe mese și invitați: Higgsfield Seedance 2.5, editare video a filmului arhitectural, job `5d638913-e9e2-4ab9-962d-1f25af92639d`, original 15,042 secunde.
- Turul folosește primele 6 secunde, intervalul în care toate cele patru zone pot rămâne vizibile în același cadru. Restul mișcării de focalizare este realizat în interfață. Punctele au poziții interpolate la 0 / 3 / 6 secunde, pentru a urmări aproximativ fațadele.
- `tour.mp4`: H.264 1440×810, 24 fps, GOP 6, 1.593.095 bytes. `tour-mobile.mp4`: H.264 960×540, 24 fps, GOP 4, 1.024.037 bytes. Versiunile păstrează același cadru pentru aceeași geometrie a punctelor.
- `tour.webp`: primul cadru decodat din filmul optimizat, 44.316 bytes. Încărcare video la apropierea de secțiune; poster pentru mișcare redusă, Data Saver, 2G și ecrane foarte scunde.
- Imaginea inițială a hero-ului este păstrată ca invitație statică; filmul interactiv este mutat în „Intră în lumea Galla”.
- Imaginile noii secțiuni de divertisment: Higgsfield Seedance 2.5, job `831e0187-0fc9-4aa9-a153-2f7a436f8383`, film cu trei scene, 12 secunde. Cadre extrase la 1,5 / 6 / 10 secunde, exportate WebP la 1200 px. Cele trei imagini însumează aproximativ 150 KB. Sunt reprezentări ilustrative ale atmosferei propuse.

## Revizia traseului final · 15 octombrie 2026

Versiunea activă folosește din nou filmul original Seedance 2.5 (`ce2874dc-4b1b-4f72-bcc6-e633d8d2b0c4`), integral, aproximativ 15 secunde. Acesta are parcarea liberă. Randarea suplimentară 1080p a fost respinsă pentru credite insuficiente; nu a fost creat niciun job nou.

`walkthrough.mp4` este filmul original optimizat pentru desktop (4.150.581 bytes). `walkthrough-mobile.mp4` păstrează cadrul complet la 960×540, 24 fps, GOP 4 (2.963.199 bytes); posterul este `hero.webp`. Fișierele `tour.*` din revizia anterioară nu mai sunt folosite de site. Punctele urmăresc fațadele la 0 / 5 / 10 / 15 secunde, iar destinațiile din spate se dezvăluie în a doua jumătate a turului. Game On precedă Rossa, ambele după El Tajine în adâncimea curții. Încadrarea CSS este fixă; mișcarea vine exclusiv din film.

## Revizia cu mașini, invitați și scenă · 15 octombrie 2026

Materialul activ din tur este editarea Seedance 2.5 `395608b2-292d-4f79-b6cd-da5477c554dc`, realizată prin Higgsfield din filmul arhitectural original. Include mașini în locurile de parcare, invitați și mese în curtea pietonală și formație pe scena din stânga, în dreptul El Tajine. Sursa este 1280×720, 15,042 secunde. Primele 11 secunde sunt redate în 15 secunde pentru o apropiere mai lentă, potrivită derulării existente.

Fișierele active sunt `walkthrough.mp4` (1280×720, 4.898.779 bytes), `walkthrough-mobile.mp4` (960×540, 3.186.818 bytes) și `walkthrough.webp` (35.676 bytes), extras din primul cadru al filmului optimizat. Hero-ul de sus folosește în continuare imaginea sa inițială. Nicio modificare la structura, stilurile sau interacțiunile paginii; în surse s-a schimbat doar adresa posterului turului. Materialele sunt vizualizări ilustrative ale evenimentului.

## Revizia balconului Rossa · 15 octombrie 2026

Materialul activ este editarea Higgsfield Seedance 2.5 `b8abbd35-6939-4e3b-a367-c1ac646871b1`, din jobul `395608b2-292d-4f79-b6cd-da5477c554dc`. Referința utilizatorului, cu balconul încercuit, a fost folosită pentru a adăuga invitați la etajul clădirii centrale din spate, în fața arcadelor și deasupra focului. Cercurile și elementele de interfață din referință nu apar în rezultat.

Se păstrează prelucrarea existentă: primele 11 secunde ale sursei, redate în 15 secunde, 24 fps, fără sunet. Exporturi H.264: `walkthrough.mp4` 1280×720, GOP 6, 4.770.959 bytes; `walkthrough-mobile.mp4` 960×540, GOP 4, 3.047.762 bytes. Posterul `walkthrough.webp`, extras din primul cadru, are 37.064 bytes. Niciun fișier din src/api/server nu a fost modificat; celelalte materiale din public sunt identice cu versiunea anterioară.

## Lumina caldă a balconului · 15 octombrie 2026

Corecție locală de culoare, procesată în sandboxul Higgsfield pe aceeași sursă Seedance 2.5 `b8abbd35-6939-4e3b-a367-c1ac646871b1`, fără regenerare. O mască cu margini estompate urmărește arcadele balconului central. Reduce intensitatea luminilor și componenta albastră, păstrând siluetele invitaților. Toate cele 264 de cadre sursă au fost verificate automat: pixelii din afara zonei urmărite rămân identici înainte de codarea H.264. Camera, durata și derularea sunt neschimbate.

Fișiere active: `walkthrough.mp4` 4.793.409 bytes; `walkthrough-mobile.mp4` 3.076.021 bytes; `walkthrough.webp` 36.802 bytes. Rezoluțiile, 24 fps, GOP 6/4 și încărcarea la apropierea de secțiune sunt păstrate.

## Colaj video hero · 21 octombrie 2026

Montaj din sursele existente Higgsfield Seedance 2.5: atmosferă/trupă `831e0187-0fc9-4aa9-a153-2f7a436f8383` și gastronomie `b4fbb1e9-f959-4d41-a4dd-7bd5d258500f`. Fără generare nouă. Prelucrare FFmpeg în sandboxul Higgsfield: trupă 0,2–3,7 s, mâncare 0,2–2,7 s, curte 4,2–7,7 s, mâncare 9,2–11,7 s, deserturi 8,2–11,7 s. Tranziții de 0,4 s, durată finală aproximativ 13,9 s, fără sunet. Nu include filmul arhitectural al turului.

`hero-montage.mp4`: H.264 1280×720, 24 fps, 2.310.588 bytes. `hero-montage-mobile.mp4`: 854×480, 967.823 bytes. Ambele faststart, GOP 48. `hero-montage.webp`: primul cadru, 25.134 bytes. Redare automată în buclă numai când hero-ul este vizibil; pauză manuală și poster pentru mișcare redusă/Data Saver/2G. Toate materialele anterioare din public sunt păstrate identic.

## Fotografii restaurante · 21 octombrie 2026

Imaginile active din carduri și tur sunt cele patru fotografii furnizate de utilizator: `Rev Game On.jpg`, `Rev Rosa.jpg`, `Rev Ciorbar.jpg`, `Rev Tajine.jpg`. Conversie WebP, calitate 86, fără generare sau retușare, proporțiile originale păstrate. Fișiere: `game-on-revelion.webp` (144.704 bytes), `rossa-revelion.webp` (139.908 bytes), `ciorbar-revelion.webp` (87.154 bytes), `tajine-revelion.webp` (241.600 bytes). Încadrarea vizibilă folosește stilurile existente. Descrierile de prezentare și textele alternative au fost adaptate fotografiilor; meniurile complete nu au fost modificate.
