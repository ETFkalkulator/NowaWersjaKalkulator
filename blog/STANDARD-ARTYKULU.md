# STANDARD WDRAZANIA NOWEGO ARTYKULU

Ten plik jest instrukcja operacyjna do wdrazania nowych wpisow blogowych w tym projekcie.
Cel: spojnosc layoutu, poprawne podpiecie SEO i brak regresji.

## 1. Zasada glowna

- Nie zmieniaj tresci merytorycznej artykulu bez wyraznej prosby.
- Nie ruszaj: meta/Schema/GA4/nav/cookie/newsletter/footer, chyba ze trzeba dopasowac do standardu i jest to jawnie wskazane.
- Dzialaj ostroznie: najpierw analiza, potem male i kontrolowane zmiany.

## 2. Pliki referencyjne (zawsze sprawdz)

- `blog/_article-template.html` - wzorzec layoutu i JS.
- `blog/jak-zaczac-inwestowac-w-etf.html` - aktualny wzorzec wdrozenia.
- `blog/podatek-belki-etf-jak-rozliczyc.html` - aktualny wzorzec wdrozenia.
- `blog/index.html` - listing bloga.
- `index.html` - sekcja "Najnowsze artykuly" na stronie glownej.
- `sitemap.xml` - indeksacja URL.

## 3. Standard layoutu artykulu

Nowy artykul musi miec:

- Top progress bar:
  - `#reading-progress` fixed `top-0`, `z-[200]`.
- Main 2-kolumnowy:
  - lewa: `<article id="main" ...>`
  - prawa: sticky `<aside>` z 3 kartami.
- Sidebar:
  - karta 1: TOC (`.sidebar-toc`) z linkami do `h2[id]`.
  - karta 2: CTA do odpowiedniego kalkulatora.
  - karta 3: 3 powiazane artykuly.
- Mobile bottom bar:
  - `#reading-progress-mobile` + `#reading-pct`
  - mobilny przycisk CTA do odpowiedniego kalkulatora.
- Top nav CTA:
  - przycisk `Zapisz sie` z linkiem `#newsletter-section` (nie `../index.html#newsletter`).

## 4. Standard typografii i interakcji

W `<style>` musza byc:

- `article p { line-height: 1.8; }`
- `article h2 { scroll-margin-top: 5rem; }`
- `article h3 { scroll-margin-top: 5rem; }`
- `@keyframes fadeInUp` + animacja dla `article h2`
- FAQ:
  - `details summary { user-select: none; }`
  - rotacja ikony expand przy `details[open]`
- aktywny TOC:
  - `.sidebar-toc a.toc-active { ... }`

## 5. Standard JS (pod koniec pliku)

Wymagane:

- progress desktop + mobile:
  - `const bar = document.getElementById('reading-progress')`
  - `const mobileBar = document.getElementById('reading-progress-mobile')`
  - `const pctLabel = document.getElementById('reading-pct')`
  - `updateProgress()` podpięte pod scroll.
- TOC highlight:
  - `IntersectionObserver` dla `article h2[id]`
  - aktywacja klasy `toc-active`.

## 6. Integracja nowego artykulu w serwisie

Po dodaniu/aktualizacji pliku artykulu zrob:

1. `blog/index.html`
- licznik artykulow (np. `6 artykulow` -> `7 artykulow`).
- ustaw najnowszy wpis jako featured.
- poprzedni featured przenies do siatki "Opublikowane".

2. `index.html`
- zaktualizuj sekcje "Najnowsze artykuly" (3 karty).
- minimum: podmien 1 karte na nowy wpis (tytul, opis, czas, link).

3. `sitemap.xml`
- dodaj URL:
  - `https://etfkalkulator.pl/blog/<slug>.html`
- ustaw `lastmod` na dzien wdrozenia.

## 7. Kodowanie polskich znakow

- Trzymaj pliki w UTF-8.
- Nie "naprawiaj" znakow na slepo po samym podgladzie terminala.
- Jesli terminal pokazuje krzaki, sprawdz bajty/odczyt UTF-8 zanim cokolwiek konwertujesz.
- Gdy trzeba, stosuj encje HTML tylko lokalnie i celowo.

## 8. Kontrola po wdrozeniu (obowiazkowa)

Uruchom szybki check:

- czy sa:
  - `#reading-progress`
  - `#reading-progress-mobile`
  - `.sidebar-toc`
  - `const bar = document.getElementById('reading-progress')`
- czy nav ma:
  - `href="#newsletter-section"` i tekst `Zapisz sie`
- czy struktura HTML jest domknieta:
  - 1x `<main>...</main>`
  - 1x `<article>...</article>`
  - 1x `<aside>...</aside>` (dla desktop sidebar)
- czy linki do nowych artykulow sa w:
  - `blog/index.html`
  - `index.html`
  - `sitemap.xml`

## 9. Gotowy prompt do nowej sesji (wklej 1:1)

```text
Wdrazamy nowy artykul do projektu. Pracuj zgodnie z plikiem:
blog/STANDARD-ARTYKULU.md

Zakres:
1) Dostosuj layout artykulu do standardu projektu (jak w blog/_article-template.html i najnowszych wdrozeniach).
2) Nie zmieniaj tresci merytorycznej.
3) Upewnij sie, ze top nav ma przycisk "Zapisz sie" do #newsletter-section.
4) Zaktualizuj powiazane miejsca: blog/index.html, index.html, sitemap.xml.
5) Na koniec podaj liste zmienionych plikow i krotki check techniczny.

Plik artykulu:
<TUTAJ_WKLEJ_SCIEZKE_DO_ARTYKULU>
```

