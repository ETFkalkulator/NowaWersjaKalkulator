# ETFkalkulator.pl — Audyt Projektu
**Data:** 2026-03-22

## ✅ Co działa poprawnie
- Wszystkie produkcyjne strony HTML mają działający cookie banner (`id="cookie-consent"`), GA4 (`G-GZECMECQ15`) i Consent Mode (`gtag('consent','default',...)`).
- Na wszystkich głównych stronach istnieje toggle trybu (`przelaczTryb`) oraz inicjalizacja dark mode w `<head>`.
- Canonical URL jest obecny na wszystkich stronach produkcyjnych (wyjątek: plik testowy `test_tailwind.html`).
- Open Graph i Twitter Card są wdrożone na stronach produkcyjnych.
- Wszystkie strony produkcyjne mają dokładnie jedno `<h1>` (wyjątek: plik testowy).
- Nie wykryto brakujących lokalnych plików JS/CSS ładowanych przez HTML.
- Nie wykryto brakujących `alt` w `<img>`.
- Nie wykryto zewnętrznych linków `target="_blank"` bez `rel="noopener"`.
- Footer 3-kolumnowy jest wdrożony i zasadniczo spójny.
- Disclaimery są obecne na kalkulatorach i artykułach blogowych.

## 🔴 Krytyczne problemy (napraw natychmiast)
1. Niespójna logika porównywarki (duplikacja warstw JS i ryzyko nadpisywania funkcji):
- `pages/porownywarka.html` ładuje jednocześnie `js/calculators/porownywarka.js` i `js/porownywarka.js`.
- Funkcje o tych samych nazwach są definiowane równolegle (ryzyko regresji i trudny debugging).
2. Niespójność klas dark mode (`dark` vs `dark-mode`) + `charts-config.js` zależny od `dark-mode`.
- Tailwind działa na `dark`, ale część kodu i stron opiera się dodatkowo o `dark-mode`.

## 🟡 Ważne usprawnienia (napraw wkrótce)
1. Część stron nie ładuje `shared.js`/`utils.js` (strony prawne i `o-projekcie`) — nie jest to błąd krytyczny, ale obniża spójność wspólnych zachowań.
2. Duplikowane ładowanie skryptu MailerLite:
- `pages/kalkulator-etf.html`
- `pages/kalkulator-obligacji.html`
3. `charts-config.js` ładowany tam, gdzie nie jest faktycznie używany (np. kalkulator ETF).
4. Brak preconnect do Google Fonts na większości stron (jest tylko na homepage).
5. `blog/index.html` ma semantyczną niespójność: sekcja "Wkrótce" zawiera karty oznaczone jako "Opublikowano".
6. `meta description` jest zbyt długie (>160 znaków) na kilku stronach (SEO snippet może być ucinany):
- `index.html`
- `blog/edo-vs-etf-2026.html`
- `blog/obligacje-edo-poradnik.html`
- `pages/kalkulator-etf.html`
- `pages/kalkulator-obligacji.html`

## 🟢 Sugestie (opcjonalne)
1. Dodać `WebSite` schema na homepage.
2. Rozważyć `HowTo` lub dodatkowe `FAQPage` na stronach kalkulatorów.
3. Ujednolicić aktywny stan linków nav na wszystkich podstronach (szczególnie strony prawne/home).
4. Uporządkować kolejność ładowania `shared.js` i `utils.js` (jednolity standard w całym projekcie).

## 📊 Tabela — stan wszystkich stron
| Strona | cookie | GA4 | canonical | schema | dark mode | mobile nav | newsletter |
|---|---|---|---|---|---|---|---|
| `/index.html` | ✅ | ✅ | ✅ | ✅ (WebPage/Breadcrumb) | ✅ | ⚠️ (brak `mobile-nav-bar`, jest własny pasek mobile) | ✅ |
| `/pages/kalkulator-etf.html` | ✅ | ✅ | ✅ | ✅ (WebPage/Breadcrumb) | ✅ | ⚠️ (jw.) | ✅ (formularz + reCAPTCHA) |
| `/pages/kalkulator-obligacji.html` | ✅ | ✅ | ✅ | ✅ (WebPage/Breadcrumb) | ✅ | ⚠️ | ✅ (formularz + reCAPTCHA) |
| `/pages/kalkulator-wolnosci.html` | ✅ | ✅ | ✅ | ✅ (WebPage/Breadcrumb) | ✅ | ⚠️ | ✅ (formularz + reCAPTCHA) |
| `/pages/porownywarka.html` | ✅ | ✅ | ✅ | ✅ (WebPage/Breadcrumb) | ✅ | ⚠️ | ✅ (formularz + reCAPTCHA) |
| `/pages/o-projekcie.html` | ✅ | ✅ | ✅ | ✅ (WebPage/Breadcrumb) | ✅ | ⚠️ | ✅ (formularz obecny) |
| `/pages/polityka-prywatnosci.html` | ✅ | ✅ | ✅ | ✅ (WebPage/Breadcrumb) | ✅ | ⚠️ | ⚠️ (sekcja newsletter obecna; wg założeń docelowo link-only) |
| `/pages/regulamin.html` | ✅ | ✅ | ✅ | ✅ (WebPage/Breadcrumb) | ✅ | ⚠️ | ⚠️ (sekcja newsletter obecna; wg założeń docelowo link-only) |
| `/blog/index.html` | ✅ | ✅ | ✅ | ✅ (`Blog` + `BreadcrumbList`) | ✅ | ⚠️ | ✅ |
| `/blog/kalkulator-etf-jak-obliczyc-realny-zysk.html` | ✅ | ✅ | ✅ | ✅ (`Article` + `BreadcrumbList`) | ✅ | ⚠️ | ✅ (formularz + reCAPTCHA) |
| `/blog/obligacje-edo-poradnik.html` | ✅ | ✅ | ✅ | ✅ (`Article` + `BreadcrumbList` + FAQ) | ✅ | ⚠️ | ✅ (formularz + reCAPTCHA) |
| `/blog/edo-vs-etf-2026.html` | ✅ | ✅ | ✅ | ✅ (`Article` + `BreadcrumbList` + FAQ) | ✅ | ⚠️ | ✅ (formularz + reCAPTCHA) |
| `/blog/_article-template.html` | ✅ | ✅ | ✅ | ✅ (template schema) | ✅ | ⚠️ | ✅ |
| `/test_tailwind.html` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 🗺️ Sitemap — brakujące strony
Stan po auto-fix: brak brakujących stron publicznych.

Wcześniej brakowało:
- `/blog/edo-vs-etf-2026.html`
- `/blog/obligacje-edo-poradnik.html`
- `/blog/index.html`

## 🔧 Auto-naprawione
1. `sitemap.xml`
- dodano brakujące strony blogowe,
- ustawiono `lastmod` na `2026-03-22` dla wszystkich wpisów.

2. `robots.txt`
- ujednolicono do wymaganej postaci:
  - `User-agent: *`
  - `Allow: /`
  - `Sitemap: https://etfkalkulator.pl/sitemap.xml`

3. `img` bez `alt`
- brak wykrytych przypadków (0 zmian).

4. External links bez `rel="noopener"`
- brak wykrytych przypadków (0 zmian).

5. `© 2025 -> © 2026`
- brak wykrytych przypadków (0 zmian).

## 📈 Rekomendacje SEO
1. Skrócić opisy `meta description` na stronach przekraczających 160 znaków.
2. Dodać `WebSite` schema na homepage (`index.html`) dla lepszego sygnału brand/search box.
3. Rozważyć `FAQPage` na stronach kalkulatorów, gdzie i tak występują sekcje edukacyjne i pytania.
4. Ujednolicić breadcrumbs i słownictwo tytułów w blogu, aby redukować kanibalizację intencji (ETF vs EDO).
5. Dodać monitoring broken links w CI (prosty crawler statyczny) oraz walidację sitemap podczas release.

## 🛠️ Aktualizacja wdrożenia (2026-03-22)
- [x] Uporządkowano porównywarkę: usunięto duplikaty definicji ustawScenariusz, ysujTabele, ysujWykresPorown między plikami JS.
- [x] js/calculators/porownywarka.js: ustawScenariusz wywołuje pojedynczo obliczPorownanie() i opcjonalnie updateUrlParams().
- [x] js/porownywarka.js: usunięto konfliktujące nadpisania oraz wywołanie nieistniejącego updateWinnerBanner().
- [x] Usunięto duplikaty skryptu MailerLite (webforms.min.js) w kalkulatorach ETF i Obligacji.
- [x] Ujednolicono dark-mode dla wykresów (js/charts-config.js wspiera dark i dark-mode).
- [x] Dodano preconnect do Google Fonts na stronach pages/* i log/* korzystających z fontów.
- [x] Skrócono zbyt długie meta description na stronach wskazanych w audycie.
- [x] Semantyka blog index: sekcja Opublikowane zamiast mylącego Wkrótce.

- [x] Naprawiono uszkodzone kodowanie znaków (UTF-8/mojibake) w plikach HTML/JS — usunięto sekwencje typu `Ä…`, `Ĺ‚`, `Â©`, `â€”` i pokrewne.
- [x] Dodano `shared.js` i `utils.js` na stronach informacyjnych: `pages/o-projekcie.html`, `pages/polityka-prywatnosci.html`, `pages/regulamin.html`.
- [x] Finalny pass spójności NAV/FOOTER: ujednolicono link `Blog` (dodane `href="index.html"` w aktywnych pozycjach) oraz wyrównano kolejność linków w nawigacji między stronami.
- [x] Finalny cleanup znaków w plikach produkcyjnych (`index.html`, `pages/*`, `blog/*` poza `_article-template.html`) — usunięto pozostałe artefakty emoji/mojibake i naprawiono symbole typu `×`.
