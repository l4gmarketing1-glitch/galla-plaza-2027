# Locuri și viitoarea plată Stripe

## Implementat acum

Planurile sunt propuneri, nu inventar disponibil în timp real. Ciorbar are 100 de locuri, El Tajine 100, Game On 150 în două zone (80/70), Rossa 300 în trei zone (100/100/100). Mesele au 2, 4, 6 sau 8 locuri. Amplasările și zonele trebuie confirmate de organizator înaintea vânzării.

Clientul trimite restaurantul, `planVersion`, lista de `seatIds`, adulții, copiii și datele de contact. Serverul verifică versiunea planului, apartenența locurilor, unicitatea, egalitatea persoane/locuri și capacitatea restaurantului. Numerele meselor, zonele, scaunele și capacitățile sunt deduse din planul serverului. Prețul este recalculat: adult 950 lei, copil 650 lei.

O cerere salvează `seatSelection`, `planVersion`, `total`, `currency=ron`, `amountMinor` în bani și `paymentStatus=not_started`. Datele trimise de client pentru preț sau plată sunt ignorate. SQLite folosește migrare aditivă; cererile vechi se păstrează. Pentru Supabase, rulați din nou `supabase/schema.sql` înaintea activării noii versiuni în producție.

Cererea primește referință, dar NU blochează locuri. Mai multe cereri pot exprima aceeași preferință. Interfața spune explicit acest lucru; nu afișează stări de disponibilitate inventate și nu confirmă automat rezervarea. Nu există apeluri Stripe, chei Stripe sau buton de plată activ.

## De implementat la activarea plății

1. Aprobați planurile reale și publicați o versiune stabilă. Clarificați vârsta pentru tariful de copil, politica locurilor la mese comune și condițiile de anulare/plată.
2. Adăugați inventar în baza de date, cu unicitate pe eveniment + versiune + restaurant + loc. API-ul de disponibilitate expune doar starea locului, fără datele clienților.
3. Într-o tranzacție, verificați și blocați temporar toate locurile unei comenzi. Dacă oricare lipsește, respingeți întregul grup și actualizați planul. Un singur loc nu poate aparține simultan la două comenzi active.
4. Creați sesiunea Stripe Checkout pe server, cu sumele serverului, moneda RON și referința internă. Corelați expirarea sesiunii cu blocarea inventarului. Eliberați locurile la expirare/abandon sau la eșecul inițializării plății. Stripe documentează expirarea sesiunii și evenimentul `checkout.session.expired`: [Manage limited inventory](https://docs.stripe.com/payments/checkout/managing-limited-inventory.md?payment-ui=stripe-hosted).
5. Verificați semnătura webhookului, valoarea, moneda, comanda și rezultatul plății. Confirmați o singură dată, într-o tranzacție, chiar dacă notificarea este repetată sau sosesc cereri simultane. Nu confirmați pe baza redirectului din browser. Urmați [Stripe Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment.md?payment-ui=stripe-hosted), inclusiv tratarea metodelor cu confirmare întârziată dacă sunt activate.
6. Testați în Stripe test mode: succes, anulare, refuz, expirare, două persoane care cer același loc, webhook duplicat/întârziat, restaurare după întrerupere și reconciliere plată/inventar. Activați live doar după configurarea contului, domeniului și condițiilor finale.

Pregătirea datelor actuale nu înlocuiește aceste operațiuni de inventar și plată. Nu activați plata prin simpla schimbare a textului butonului.
