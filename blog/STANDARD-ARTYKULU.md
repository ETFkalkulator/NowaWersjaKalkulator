# Standard artykulu blogowego

## Cel

Kazdy artykul ma:
- rozwiazywac jeden konkretny problem czytelnika,
- prowadzic do decyzji lub kolejnego kroku,
- zachowywac spojnosc z reszta serwisu,
- wspierac SEO bez lania wody.

## Struktura

- Jeden `h1` z jasna obietnica wartosci.
- Lead 2-3 zdania: problem, stawka, czego czytelnik sie dowie.
- Spis tresci z kotwicami do sekcji.
- 3-7 sekcji `h2` z logiczna kolejnoscia.
- Przynajmniej jeden konkretny przyklad liczbowy lub porownanie.
- Jedno glowne CTA w tresci.
- Lokalna sekcja newslettera z `#newsletter-section`.
- Disclaimer na koncu.

## SEO i semantyka

- Uzupeij `title`, `meta description`, `canonical`.
- Ustaw `og:title`, `og:description`, `og:url`, `twitter:*`.
- Uzupeij `Article` JSON-LD.
- Uzupeij `BreadcrumbList` JSON-LD.
- Adres URL i slug musza odpowiadac tematowi artykulu.
- Nie zmieniaj sensu merytorycznego tylko po to, by dodac frazy SEO.

## UX i styl

- Pisz prostym jezykiem, bez zbednego zargonu.
- Akapity trzymaj raczej krotkie.
- Dla trudniejszych fragmentow dodawaj ramki z wnioskiem, ostrzezeniem albo przykladem.
- Uzywaj komponentow z `_article-template.html`.
- Nie mieszaj starego i nowego stylu wizualnego.

## Integracje techniczne

- CTA w top nav ma prowadzic do `#newsletter-section`.
- Zachowaj pelny formularz MailerLite z checkboxem GDPR i reCAPTCHA.
- Zachowaj dark mode oparty o klasy `dark`, `dark-mode`, `light`, `light-mode`.
- Nie dodawaj drugiego bannera cookies ani duplikatow skryptow.

## Checklista przed publikacja

- Artykul ma poprawny slug i metadane.
- Wszystkie linki i kotwice dzialaja.
- Formularz newslettera ma checkbox i reCAPTCHA.
- Widok light/dark jest spojny.
- Nie ma placeholderow typu `ARTICLE_TITLE`, `SECTION 1`, `MONTH YEAR`.
- Nie ma literowek, zlych zawijan tekstu ani starych CTA.
- Tresc pozostaje merytorycznie zgodna z zamierzeniem autora.
