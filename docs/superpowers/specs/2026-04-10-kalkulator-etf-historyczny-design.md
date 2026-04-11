# Design Spec — Kalkulator ETF Historyczny

**Data:** 2026-04-10  
**Status:** Zaakceptowany — gotowy do implementacji  
**Strona docelowa:** `/pages/kalkulator-etf-historyczny.html`

---

## 1. Cel i kontekst

Nowy kalkulator zaawansowany jako osobna strona — uzupełnienie prostego kalkulatora ETF. Skierowany do bardziej świadomych inwestorów którzy chcą zobaczyć wyniki historyczne, nie tylko projekcje. Obecny kalkulator (`kalkulator-etf.html`) pozostaje bez zmian.

**Linkowanie:** z obecnego kalkulatora ETF dodać CTA "Chcesz zobaczyć wyniki historyczne? →" prowadzące do nowej strony.

---

## 2. Struktura — 3 zakładki

| Zakładka | Ikona Material | Opis |
|---|---|---|
| Backtesting | `history` | Ile byś miał dziś, gdybyś zainwestował X w ETF Y od daty Z |
| Porównanie ETF | `compare_arrows` | Dwa ETF-y side-by-side na jednym wykresie |
| Koszt TER | `payments` | Ile opłata roczna zjada przez 10/20/30 lat |

Zakładki scrollowalne poziomo na mobile (overflow-x: auto).

---

## 3. Dane historyczne

### Plik: `js/etf-data.json`

Format:
```json
{
  "IWDA": {
    "name": "iShares Core MSCI World",
    "ter": 0.20,
    "type": "Acc",
    "index": "MSCI World",
    "start": "2009-10",
    "returns": {
      "2009-10": 0.0, 
      "2009-11": 0.032,
      "2024-12": 0.018
    }
  }
}
```

- Miesięczne stopy zwrotu (nie ceny absolutne) — łatwiejsze do aktualizacji
- Stopy w USD (IWDA, CSPX, VWCE notowane w USD/EUR — przyjmujemy USD jako bazę)
- Kursy USD/PLN: osobny obiekt `"usdpln"` z miesięcznymi kursami NBP
- Aktualizacja przez właściciela raz w miesiącu (~5 min)

### 8 ETF-ów

| Ticker | Nazwa | TER | Typ | Dostępne od |
|---|---|---|---|---|
| IWDA | iShares Core MSCI World | 0,20% | Acc | 2009-10 |
| VWCE | Vanguard FTSE All-World | 0,19% | Acc | 2019-07 |
| CSPX | iShares Core S&P 500 | 0,07% | Acc | 2010-05 |
| EQQQ | Invesco Nasdaq-100 | 0,30% | Acc | 2002-10 |
| EIMI | iShares Core MSCI EM IMI | 0,18% | Acc | 2012-05 |
| FWRA | Invesco FTSE All-World | 0,15% | Acc | 2022-01 |
| VUSA | Vanguard S&P 500 | 0,07% | Dist | 2012-05 |
| AGGH | iShares Global Aggregate Bond | 0,10% | Acc | 2017-11 |

---

## 4. UI / Styl

**Zasada:** identyczny styl jak `kalkulator-etf.html`. Zero nowych wzorców wizualnych.

| Element | Klasy / styl |
|---|---|
| Karta | `glass-effect p-8 rounded-[2rem] border border-white/50` |
| Input | `w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-lg font-bold` |
| Label | `text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300` |
| Badge jednostki | `text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md` |
| INFO button | `bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded-md` |
| Grid desktop | `grid-cols-1 lg:grid-cols-12` — formularz `lg:col-span-4`, wyniki `lg:col-span-8` |
| Wykres | Chart.js 4.4.1 (już w projekcie), linia z gradientem fill |

**ETF Selector:** siatka kart 2×N (nie dropdown) — touch-friendly na mobile. Każda karta: ticker (bold), skrócona nazwa, TER + typ.

**Preset daty:** 4 przyciski pod polami Od/Do: "5 lat", "10 lat", "Od COVID", "Max historia"

**IKE toggle:** identyczny jak w obecnym kalkulatorze (checkbox styled as slider)

**Mobile-first:** formularz pełna szerokość → wyniki pełna szerokość. Na lg: 4/12 + 8/12.

---

## 5. Zakładka 1 — Backtesting (szczegóły)

**Inputy:**
- ETF (siatka kart, single-select)
- Kapitał startowy (text input, PLN)
- Miesięczna dopłata (text input, PLN, może być 0)
- Okres: Od (MM/RRRR) + Do (MM/RRRR) + 4 presety
- IKE toggle (0% Belki)

**Logika JS:**
1. Pobierz tablicę miesięcznych stóp zwrotu dla wybranego ETF w podanym okresie
2. Symuluj portfel miesiąc po miesiącu: `kapital = (kapital + doplata) * (1 + stopa_miesiaca - ter/12)`
3. Przelicz USD→PLN każdego miesiąca
4. Jeśli IKE=false, na końcu odejmij podatek Belki 19% od zysku
5. Wyniki: kapitał końcowy, wpłacony kapitał, zysk netto, % zwrotu

**Wyniki UI:**
- 4 kafelki (2×2): Kapitał końcowy (niebieski), Wpłacony kapitał, Zysk netto (zielony), Zwrot %
- Wykres Chart.js: linia kapitału + linia wpłaconego kapitału (szara przerywana)
- Disclaimer o danych historycznych

---

## 6. Zakładka 2 — Porównanie ETF (szczegóły)

**Inputy:** 2 selektory ETF (ETF A i ETF B), wspólne: kapitał, dopłata, okres, IKE

**Wyniki:** jeden wykres z dwiema liniami (kolor ETF A = primary #0d7ff2, ETF B = #f59e0b), tabela porównawcza wyników

---

## 7. Zakładka 3 — Koszt TER (szczegóły)

**Inputy:** kapitał, dopłata, horyzont (lata), TER A (np. 0,07%), TER B (np. 0,50%)

**Wyniki:** różnica w kapitale końcowym, wykres dwóch linii, "Kosztuje Cię X zł przez Y lat"

*Uwaga: ta zakładka nie wymaga danych historycznych — to projekcja, jak obecny kalkulator.*

---

## 8. Pliki do stworzenia / zmodyfikowania

| Akcja | Plik |
|---|---|
| NOWY | `pages/kalkulator-etf-historyczny.html` |
| NOWY | `js/kalkulator-etf-historyczny.js` |
| NOWY | `js/etf-data.json` (dane historyczne) |
| NOWY | `js/etf-usdpln.json` (kursy walut) |
| EDYCJA | `pages/kalkulator-etf.html` (dodać link CTA do nowej strony) |
| EDYCJA | `sitemap.xml` (dodać nowy URL) |
| EDYCJA | `index.html` (dodać kartę nowego kalkulatora) |
| EDYCJA | `manifest.json` (dodać shortcut PWA) |
| EDYCJA | `blog/index.html` (opcjonalnie — jeśli będzie artykuł powiązany) |
| KOMPILACJA | `npm run build:css` (jeśli użyte nowe klasy Tailwind) |

---

## 9. SEO nowej strony

- **Title:** `Kalkulator ETF Historyczny — Backtesting IWDA, VWCE, CSPX | ETFkalkulator.pl` (68 zn. — skrócić)
- **Title (poprawiony):** `Backtesting ETF 2026 — ile byś zarobił na IWDA, VWCE?` (57 zn.) ✓
- **Description:** `Sprawdź ile byś zarobił inwestując w IWDA, VWCE lub CSPX. Backtesting z rzeczywistymi danymi miesięcznymi. Uwzględnia TER, inflację i IKE.` (147 zn.) ✓
- **Schema:** `FinancialProduct` + `BreadcrumbList`
- **Canonical:** `https://etfkalkulator.pl/pages/kalkulator-etf-historyczny.html`

---

## 10. Ograniczenia i decyzje

- ETF-y z krótką historią (FWRA od 2022, VWCE od 2019): selector pokazuje "Dane od MM/RRRR", presety "10 lat" wyszarzają się jeśli ETF jest młodszy
- Dane w USD przeliczane na PLN: uproszczenie — kurs miesięczny (nie dzienny)
- Brak danych rzeczywistych dla dat sprzed startu ETF: brak extrapolacji, użytkownik widzi błąd jeśli wybierze zbyt wczesną datę
- Nie używamy zewnętrznych API — zero zależności runtime
- Chart.js 4.4.1 już w projekcie — nie podnosić wersji
