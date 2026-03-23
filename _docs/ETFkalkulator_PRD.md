# ETFkalkulator.pl — Product Requirements Document (PRD)
**Wersja:** 1.0 | **Data:** Luty 2025 | **Status:** DRAFT

---

## 1. Wizja i cel projektu

### 1.1 Problem który rozwiązujemy
Miliony Polaków chce inwestować, ale brakuje im prostych narzędzi uwzględniających polskie realia: podatek Belki, inflację GUS, specyfikę obligacji EDO/ROS/ROD i polskie ETFy dostępne przez XTB czy Bossa. Istniejące kalkulatory są albo zbyt ogólne, albo zbyt skomplikowane dla początkujących.

### 1.2 Misja
ETFkalkulator.pl to bezpłatne narzędzie edukacyjne dla polskich inwestorów-amatorów. Pomagamy zrozumieć REALNY zysk z inwestycji — po inflacji, podatkach i opłatach — w prosty i przystępny sposób.

> ⚠️ **WAŻNE — DISCLAIMER:** Serwis nie świadczy usług doradztwa inwestycyjnego. Wszystkie kalkulacje mają charakter wyłącznie edukacyjny i informacyjny. Nie stanowią rekomendacji inwestycyjnej w rozumieniu Ustawy o obrocie instrumentami finansowymi.

### 1.3 Ekosystem projektu
```
ETFkalkulator.pl  →  Newsletter tygodniowy  →  Automatyzacje ETF (freelance)  →  SaaS monitoring ETF
     (ruch SEO)         (zaufanie + lista)          (przychód bieżący)              (produkt docelowy)
```

---

## 2. Docelowi użytkownicy

### 2.1 Persona główna — Bartek
| Cecha | Opis |
|-------|------|
| Wiek | 28–45 lat |
| Doświadczenie | Początkujący inwestor, 0–3 lata |
| Inwestuje w | ETFy (XTB, Bossa) + obligacje EDO/ROS |
| Problem | Nie wie ile REALNIE zarobi po podatkach i inflacji |
| Cel | Wolność finansowa, zastąpienie etatu pasywnym dochodem |
| Urządzenie | Głównie telefon, czasem laptop |

### 2.2 Persony dodatkowe
- Oszczędzający przed emeryturą (45–60 lat) — porównanie IKE/IKZE vs obligacje
- Student ekonomii — narzędzie do nauki i ćwiczeń
- Bloger/youtuber finansowy — embed kalkulatora na swojej stronie

---

## 3. Zakres MVP — 3 moduły kalkulatora

> 📌 **Strategia:** Budujemy wszystkie 3 moduły, ale wdrażamy je po kolei: M1 → M2 → M3. Każdy moduł to osobna podstrona z własnym SEO.

---

### Moduł 1: Kalkulator Obligacji Skarbowych
**Priorytet: PIERWSZY** — największy potencjał SEO

Obsługiwane typy: EDO (10-lat), ROS (6-lat), ROD (12-lat), COI (4-lat), OFZ (3-miesięczne)

**Dane wejściowe (input):**
- Kwota inwestycji (zł)
- Typ obligacji (EDO / ROS / ROD / COI)
- Aktualna stawka procentowa (pobrana automatycznie lub wpisana ręcznie)
- Oczekiwana inflacja (domyślnie: aktualna inflacja GUS)
- Czy obligacje w IKE/IKZE (tak/nie — wpływa na podatek Belki)

**Dane wyjściowe (wyniki):**
- Zysk nominalny (zł i %)
- Podatek Belki do zapłacenia (zł)
- Zysk po opodatkowaniu (zł)
- Zysk realny po inflacji (zł i %)
- Porównanie: lokata bankowa vs obligacje
- Wykres słupkowy: rok po roku przez cały okres inwestycji

---

### Moduł 2: Kalkulator Wolności Finansowej
**Priorytet: DRUGI** — emocjonalny, viralowy potencjał

Cel: Odpowiedź na pytanie *"Ile muszę odkładać miesięcznie żeby móc żyć z pasywnego dochodu?"*

**Dane wejściowe:**
- Obecny wiek
- Docelowy wiek wolności finansowej
- Miesięczne wydatki docelowe (zł)
- Obecne oszczędności / kapitał startowy (zł)
- Oczekiwana średnia stopa zwrotu (domyślnie 7% rocznie dla ETF globalny)
- Oczekiwana inflacja (domyślnie 3.5%)

**Dane wyjściowe:**
- Wymagany kapitał docelowy (reguła 4% SWR)
- Miesięczna kwota do odkładania
- Postęp jeśli już oszczędzasz (ile % drogi za tobą)
- Wykres liniowy: wzrost kapitału rok do roku
- Podział: ile z inwestycji, ile z procentu składanego

---

### Moduł 3: Porównywarka ETF vs Obligacje
**Priorytet: TRZECI** — łączy oba poprzednie moduły

**Dane wejściowe:**
- Kwota inwestycji (zł)
- Horyzont czasowy (lata)
- Typ obligacji do porównania
- ETF do porównania (wybór z listy najpopularniejszych w Polsce)
- Oczekiwana stopa zwrotu ETF (domyślnie historyczna)

**Dane wyjściowe:**
- Tabela porównawcza: zysk nominalny, po podatkach, po inflacji
- Wykres: dwie linie — ETF vs Obligacje przez lata
- Wniosek edukacyjny (nie jako porada inwestycyjna)

---

## 4. Wygląd i UX

### 4.1 Styl wizualny
| Element | Decyzja |
|---------|---------|
| Charakter | Profesjonalny, przejrzysty, zaufany — jak GOV.pl, nie jak kasyno |
| Paleta kolorów | Granat `#1A56A0` + biel + akcenty zielone i pomarańczowe |
| Font | Inter lub Lato (Google Fonts, bezpłatny) |
| Ikony | Phosphor Icons lub Heroicons (open source) |
| Wykresy | Chart.js (bezpłatny, lekki, JS) |
| Responsywność | Mobile-first — większość ruchu z telefonu |

### 4.2 Mapa serwisu
```
/                                → Strona główna
/kalkulator-obligacji            → Moduł 1
/kalkulator-wolnosci-finansowej  → Moduł 2
/porownywarka-etf-obligacje      → Moduł 3
/newsletter                      → Zapisy na newsletter
/o-projekcie                     → Kim jesteś, co tu robisz
/blog                            → Artykuły SEO (na później)
/polityka-prywatnosci            → RODO
/polityka-cookies                → Cookies
/regulamin                       → Regulamin
```

### 4.3 Zasady UX
- Maksymalnie 5 pól input na kalkulator — nie przytłaczamy
- Wyniki widoczne od razu (live update bez przycisku "Oblicz")
- Każde pole ma tooltip z wyjaśnieniem co wpisać
- Wykresy interaktywne — hover pokazuje wartości
- Przycisk "Udostępnij wynik" generuje link z parametrami w URL
- Wersja do druku / eksport jako obraz

---

## 5. Stack techniczny

### 5.1 Frontend
| Technologia | Zastosowanie |
|-------------|-------------|
| HTML5 + CSS3 | Bazowa struktura |
| JavaScript (Vanilla JS) | Logika kalkulatorów — bez frameworków na start |
| Chart.js | Wykresy — bezpłatny |
| Google Fonts (Inter/Lato) | Typografia |
| Phosphor Icons | Ikony — open source |

### 5.2 Backend
| Technologia | Zastosowanie |
|-------------|-------------|
| PHP | Formularze, wysyłka do newslettera |
| MySQL / SQLite | Opcjonalnie — zapis zapisów do newslettera |
| Make (Integromat) | Automatyzacja newslettera — już masz! |
| MailerLite | Wysyłka newslettera — darmowy do 1000 subskrybentów |

### 5.3 Koszty startu
| Element | Koszt |
|---------|-------|
| Domena ETFkalkulator.pl | ~50–80 zł/rok |
| Hosting współdzielony | ~100–200 zł/rok |
| Alternatywa darmowa | GitHub Pages — 0 zł (brak PHP) |
| SSL (HTTPS) | Bezpłatny — Let's Encrypt |
| **ŁĄCZNIE** | **150–280 zł/rok** |

> 💡 **Rekomendacja:** Zacznij od GitHub Pages (0 zł) z czystym HTML/CSS/JS. Przenieś na płatny hosting gdy będziesz potrzebować PHP do newslettera.

---

## 6. Wymagania prawne i compliance

### 6.1 Disclaimer inwestycyjny
Obowiązkowy na każdej podstronie kalkulatora — widoczna stopka i/lub baner:

> *Serwis ETFkalkulator.pl ma charakter wyłącznie edukacyjny i informacyjny. Prezentowane obliczenia nie stanowią rekomendacji inwestycyjnej, porady finansowej ani doradztwa podatkowego w rozumieniu obowiązujących przepisów prawa. Przed podjęciem decyzji inwestycyjnej skonsultuj się z licencjonowanym doradcą finansowym. Inwestowanie wiąże się z ryzykiem utraty części lub całości zainwestowanego kapitału.*

### 6.2 RODO i Cookies
- Polityka prywatności — `/polityka-prywatnosci`
- Polityka cookies — `/polityka-cookies`
- Banner cookie consent przy pierwszej wizycie (wymagany przez prawo UE)
- Google Analytics — wymaga zgody użytkownika (kategoria: analityczne)
- Formularz newslettera — zgoda na przetwarzanie danych osobowych (checkbox)

### 6.3 Regulamin
- Regulamin serwisu — `/regulamin`
- Zawiera: zakres usług, ograniczenie odpowiedzialności, prawa autorskie
- Szablon: legaldesk.pl lub prawnik-online.pl (~200 zł)

### 6.4 Dostępność (WCAG)
- Kontrast tekstu min. 4.5:1 (sprawdzaj: contrast-ratio.com)
- Alt text dla wszystkich wykresów
- Etykiety dla pól formularzy (`<label for="...">`)

---

## 7. Strategia SEO

### 7.1 Słowa kluczowe
| Fraza | Potencjał | Moduł |
|-------|-----------|-------|
| kalkulator obligacji skarbowych | Wysoka — mało konkurencji | M1 |
| kalkulator EDO obligacje | Średnia | M1 |
| podatek Belki obligacje kalkulator | Wysoka | M1 |
| kalkulator wolności finansowej | Średnia | M2 |
| ile odkładać na wolność finansową | Niska — long tail | M2 |
| ETF vs obligacje Polska porównanie | Niska — long tail | M3 |
| realna stopa zwrotu ETF Polska | Średnia | M3 |

### 7.2 Wymagania techniczne SEO
- Meta title i description unikalne dla każdej podstrony
- Structured data (Schema.org) — typ: WebApplication, FAQPage
- Sitemap.xml
- robots.txt
- Core Web Vitals — LCP < 2.5s, CLS < 0.1 (mierz: PageSpeed Insights)
- Open Graph tags — dla udostępniania w social media
- Kanoniczne URL (`rel=canonical`)

### 7.3 Google Analytics 4
- Konto GA4 — bezpłatne
- Zdarzenia: `oblicz_wynik`, `zapis_newsletter`, `udostepnij`
- Consent Mode v2 — wymagane dla użytkowników z UE
- Google Search Console — połącz z GA4

---

## 8. Newsletter

### 8.1 Platforma
- **MailerLite** — do 1000 subskrybentów za darmo, RODO-compliant, integracja z Make
- Alternatywa: Substack — łatwiejszy start, wbudowana strona, możliwość płatności

### 8.2 Automatyzacja przez Make
- Cotygodniowy raport ETF — masz już gotowy silnik!
- Krótki komentarz od Ciebie (10 min pisania)
- Tip inwestycyjny dla początkujących
- Link do aktualnych stóp procentowych obligacji MF

> ⚡ Twoja automatyzacja Make to przewaga konkurencyjna — inni piszą newsletter ręcznie, Ty masz 80% zautomatyzowane.

### 8.3 Lead magnet
- "Bezpłatny PDF: 5 błędów polskich inwestorów przy obligacjach EDO"
- Lub: "Ściągawka: Jak wybrać ETF do IKZE w 15 minut"

---

## 9. Monetyzacja

| Źródło | Typ | Potencjał |
|--------|-----|-----------|
| Afiliacja XTB / Bossa | Szybki zarobek przy małym ruchu | 100–500 zł/rejestracja |
| Reklamy AdSense | Pasywne, wymaga ruchu | 500–1000 zł/mies. przy 10k odsłon |
| Newsletter Premium | Substack Paid | 29–49 zł/mies./subskrybent |
| Automatyzacje na zlecenie | Usługa freelance | 500–3000 zł/projekt |
| SaaS — monitoring ETF | Produkt docelowy | 19–49 zł/mies./użytkownik |

> 🎯 **Kolejność:** Afiliacja → AdSense → Automatyzacje freelance → SaaS

---

## 10. Roadmap

### Faza 1 — Fundament (Miesiąc 1-2)
- [ ] Rejestracja domeny ETFkalkulator.pl
- [ ] Setup hostingu + SSL
- [ ] Design systemu (kolory, fonty, komponenty)
- [ ] Moduł 1: Kalkulator obligacji (MVP)
- [ ] Strona główna + /o-projekcie
- [ ] Polityka prywatności, cookies, regulamin, disclaimer
- [ ] Google Analytics 4 + Search Console
- [ ] Cookie consent banner

### Faza 2 — Wzrost (Miesiąc 3-4)
- [ ] Moduł 2: Kalkulator wolności finansowej
- [ ] Formularz zapisu na newsletter + MailerLite
- [ ] Automatyzacja Make → newsletter
- [ ] Lead magnet (PDF)
- [ ] Pierwsze artykuły blogowe (SEO)
- [ ] Afiliacja XTB / Bossa — rejestracja w programach

### Faza 3 — Ekosystem (Miesiąc 5-6)
- [ ] Moduł 3: Porównywarka ETF vs obligacje
- [ ] Oferta automatyzacji freelance (landing page)
- [ ] Newsletter Premium
- [ ] Analiza ruchu i optymalizacja SEO
- [ ] Pierwsze przychody — raport i iteracja

---

## 11. Struktura projektu (Windsurf)

```
etfkalkulator/
├── index.html
├── css/
│   ├── reset.css
│   ├── variables.css         ← kolory, fonty, spacing
│   └── main.css
├── js/
│   ├── calculators/
│   │   ├── obligacje.js      ← logika Modułu 1
│   │   ├── wolnosc.js        ← logika Modułu 2
│   │   └── porownywarka.js   ← logika Modułu 3
│   ├── charts.js             ← Chart.js wrapper
│   └── utils.js              ← formatowanie zł, %
├── pages/
│   ├── kalkulator-obligacji.html
│   ├── kalkulator-wolnosci.html
│   └── porownywarka.html
├── php/
│   └── newsletter.php
├── assets/
│   ├── img/
│   └── favicon/
└── PRD.md                    ← ten plik
```

### Zasady kodowania (dobre nawyki od początku)
- Każda funkcja kalkulatora w osobnym pliku JS — łatwe testowanie
- CSS Variables dla kolorów — zmiana motywu w jednym miejscu
- Komentarze w kodzie po polsku — Ty wracasz do tego za miesiąc
- Git + GitHub — commit po każdej działającej funkcji
- Mobile-first CSS — zacznij od małego ekranu
- Semantic HTML — używaj `<main>`, `<section>`, `<article>`, `<label>`

---

## 12. Definicja sukcesu (KPI po 6 miesiącach)

| Wskaźnik | Cel |
|----------|-----|
| Ruch organiczny | 1000+ unikalnych użytkowników / miesiąc |
| Lista newslettera | 200+ subskrybentów |
| Przychody miesięczne | 500+ zł (afiliacja + AdSense) |
| Pierwsze zlecenie freelance | 1 automatyzacja sprzedana |
| Core Web Vitals | Wszystkie zielone w PageSpeed |
| Pozycja SEO | Top 10 dla "kalkulator obligacji skarbowych" |

---

*ETFkalkulator.pl — PRD v1.0 | Ten dokument jest żywym dokumentem — aktualizuj go wraz z rozwojem projektu.*
