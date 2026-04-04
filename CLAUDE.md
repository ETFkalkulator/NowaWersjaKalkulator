# CLAUDE.md — ETFkalkulator.pl

Plik instrukcji dla asystenta AI. Wczytywany automatycznie na początku każdej sesji.

---

## Projekt

**ETFkalkulator.pl** — bezpłatny serwis z kalkulatorami finansowymi dla polskich inwestorów detalicznych. Priorytet: SEO, mobile, Lighthouse.

---

## Stack technologiczny

- HTML + **Tailwind CSS** (Play CDN) + **Vanilla JS**
- **Chart.js** przypięty do wersji `@4.4.1` (nie podnosić!)
- **GA4** z Consent Mode v2
- **MailerLite** — newsletter
- **PWA** — `manifest.json` z shortcuts

---

## Kluczowe wartości / stałe

| Zmienna | Wartość |
|---|---|
| Kolor primary | `#0d7ff2` |
| Dark mode | klasa `dark` na `<html>`, localStorage: `etf-tryb` |
| Cookie consent | localStorage: `etf-cookie-consent` |
| IKE limit 2026 | 28 260 zł |
| IKZE limit 2026 | 11 304 zł |
| Stawki obligacji (kwiecień 2026) | ROR 4.00%, TOS 4.40%, COI 4.75% yr1, ROS 5.00% yr1, EDO 5.35% yr1, ROD 5.60% yr1 |
| Stała w JS | `BOND_RATES_DATE = 'kwiecień 2026'` |

---

## Struktura plików

```
index.html                        — strona główna (wykres porównawczy, sekcja artykułów)
pages/
  kalkulator-etf.html             — kalkulator ETF
  kalkulator-obligacji.html       — kalkulator obligacji EDO/COI/TOS
  kalkulator-wolnosci.html        — kalkulator wolności finansowej FIRE
  kalkulator-podatku-belki.html   — kalkulator podatku Belki
  porownywarka.html               — porównywarka ETF vs obligacje vs lokata
  o-projekcie.html
  polityka-prywatnosci.html
  regulamin.html
blog/
  index.html                      — listing bloga
  _article-template.html          — WZORZEC layoutu nowego artykułu
  STANDARD-ARTYKULU.md            — instrukcja wdrażania artykułów (czytaj przed każdą pracą z blogiem)
  [10 artykułów .html]
js/
  shared.js                       — nawigacja, dark mode, cookie consent
  tailwind-config.js              — konfiguracja Tailwind (kolory, breakpointy)
  charts-config.js                — globalna konfiguracja Chart.js
  kalkulator-etf.js
  kalkulator-obligacji.js
  kalkulator-wolnosci.js
  porownywarka.js
  cookie-consent.js
  tooltips.js
  utils.js
  calculators/                    — podkatalog z JS kalkulatorów
css/
  reset.css / main.css / variables.css / mailerlite.css / print.css
images/                           — favicon.png (favicon + apple-touch-icon + og:image)
manifest.json
sitemap.xml                       — 20 URL-i
robots.txt
thumbnail-style-guide.md         — styl graficzny miniatur (czytaj przy tworzeniu grafik)
```

---

## Zasady pracy (WAŻNE)

1. **Minimalne zmiany** — rób tylko to, o co proszę. Nie refaktoruj, nie dodawaj, nie "ulepszaj" przy okazji.
2. **Czytaj plik przed edycją** — zawsze najpierw Read, potem Edit.
3. **Nie ruszaj logiki JS** bez wyraźnej prośby.
4. **Nie ruszaj** meta/Schema/GA4/nav/cookie/newsletter/footer bez wyraźnej prośby.
5. **UTF-8** — nie "naprawiaj" polskich znaków na ślepo po podglądzie terminala.
6. Po każdym wdrożeniu artykułu zaktualizuj: `blog/index.html`, `index.html`, `sitemap.xml`.

---

## Blog — instrukcja wdrożenia

Szczegółowy standard w `blog/STANDARD-ARTYKULU.md`. Przed każdą pracą z blogiem czytaj ten plik.

**Gotowy prompt startowy:**
```
Wdrażamy nowy artykuł. Pracuj zgodnie z blog/STANDARD-ARTYKULU.md.
Plik: <ścieżka>
```

---

## Grafiki / miniaturki

Styl: glassmorphism, dark background, neony. Szczegóły w `thumbnail-style-guide.md`.

---

## SEO — standardy

- Tytuły: 55–62 znaki, keyword-first
- Meta description: 120–155 znaków z CTA
- Schema.org: `Article` + `BreadcrumbList` (blog), `FinancialProduct` + `BreadcrumbList` (kalkulatory)
- `preconnect` + `dns-prefetch` na każdej stronie
- Lazy loading obrazków
- Web App Manifest + `apple-touch-icon` na wszystkich stronach

---

## Co zostało wdrożone (ostatnie sesje)

- **2026-03-29** — kalkulator obligacji (badge, toggle, ROS/ROD), FIRE (Fisher eq.), print-only fix, blog fixes, sitemap, robots.txt
- **2026-03-30** — index.html wykres (inflacja realna, karty stat dynamiczne, dataset "Wpłacony kapitał", tooltip, dark mode kart), blog fixes (IKE/IKZE limity, orkespl→zakup.obligacjeskarbowe.pl)
- **2026-03-31** — nowy kalkulator `kalkulator-podatku-belki.html`, sitemap + manifest PWA

---

## Plan (od 2026-03-29)

- 4+ nowe artykuły blogowe
- Promocja: Wykop / Reddit / Facebook, shorty TikTok/YouTube
- Następnie: afiliacja (XTB, Freedom24, IKE), newsletter

---

## Shorty video — format

- Styl: Bareja, ~10 sekund, bez nagrywania twarzy/głosu
- Narzędzia: Google Flow (generowanie scen) + CapCut (montaż + napisy) + ElevenLabs (PL voice opcjonalnie)
- CTA: "Bo słoik to nie inwestycja. etfkalkulator.pl"
