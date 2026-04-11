# Kalkulator ETF Historyczny — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zbudować nową stronę `/pages/kalkulator-etf-historyczny.html` z 3 zakładkami: Backtesting, Porównanie ETF, Koszt TER — opartą na statycznych danych miesięcznych dla 8 ETF-ów.

**Architecture:** Statyczna strona HTML + Vanilla JS, dane historyczne w `js/etf-data.json` (miesięczne stopy zwrotu) i `js/etf-usdpln.json` (kursy NBP). Cała logika w `js/kalkulator-etf-historyczny.js`. Styl identyczny z `kalkulator-etf.html` — te same klasy Tailwind, glass-effect, h-14 inputy.

**Tech Stack:** HTML5, Tailwind CSS (lokalny build), Vanilla JS ES6, Chart.js 4.4.1 (już w projekcie), bez zewnętrznych API runtime.

**Spec:** `docs/superpowers/specs/2026-04-10-kalkulator-etf-historyczny-design.md`

---

## Mapa plików

| Akcja | Plik | Odpowiedzialność |
|---|---|---|
| NOWY | `js/etf-data.json` | Miesięczne stopy zwrotu dla 8 ETF-ów |
| NOWY | `js/etf-usdpln.json` | Miesięczne kursy USD/PLN (NBP) |
| NOWY | `pages/kalkulator-etf-historyczny.html` | HTML strony, head, nav, struktura zakładek |
| NOWY | `js/kalkulator-etf-historyczny.js` | Cała logika: zakładki, backtesting, porównanie, TER |
| EDYCJA | `pages/kalkulator-etf.html` | Dodać 1 blok CTA linkujący do nowej strony |
| EDYCJA | `sitemap.xml` | Dodać nowy URL |
| EDYCJA | `index.html` | Dodać kartę kalkulatora w sekcji narzędzi |
| EDYCJA | `manifest.json` | Dodać shortcut PWA |
| KOMPILACJA | `css/tailwind.css` | `npm run build:css` jeśli nowe klasy Tailwind |

---

## Task 1: Dane — etf-data.json (szkielet)

**Files:**
- Create: `js/etf-data.json`

- [ ] **Krok 1: Stwórz plik z metadanymi 8 ETF-ów i przykładowymi danymi dla IWDA (2 lata)**

Utwórz `js/etf-data.json`:

```json
{
  "IWDA": {
    "name": "iShares Core MSCI World",
    "fullName": "iShares Core MSCI World UCITS ETF USD (Acc)",
    "ter": 0.0020,
    "type": "Acc",
    "index": "MSCI World",
    "currency": "USD",
    "start": "2009-10",
    "returns": {
      "2009-10": 0.0000,
      "2009-11": 0.0401,
      "2009-12": 0.0183,
      "2010-01": -0.0382,
      "2010-02": 0.0285,
      "2010-03": 0.0584
    }
  },
  "VWCE": {
    "name": "Vanguard FTSE All-World",
    "fullName": "Vanguard FTSE All-World UCITS ETF USD Accumulating",
    "ter": 0.0019,
    "type": "Acc",
    "index": "FTSE All-World",
    "currency": "USD",
    "start": "2019-07",
    "returns": {
      "2019-07": 0.0000,
      "2019-08": -0.0210,
      "2019-09": 0.0262
    }
  },
  "CSPX": {
    "name": "iShares Core S&P 500",
    "fullName": "iShares Core S&P 500 UCITS ETF USD (Acc)",
    "ter": 0.0007,
    "type": "Acc",
    "index": "S&P 500",
    "currency": "USD",
    "start": "2010-05",
    "returns": {
      "2010-05": -0.0797,
      "2010-06": -0.0534,
      "2010-07": 0.0688
    }
  },
  "EQQQ": {
    "name": "Invesco Nasdaq-100",
    "fullName": "Invesco NASDAQ-100 UCITS ETF Acc",
    "ter": 0.0030,
    "type": "Acc",
    "index": "Nasdaq-100",
    "currency": "USD",
    "start": "2010-01",
    "returns": {
      "2010-01": -0.0059,
      "2010-02": 0.0409,
      "2010-03": 0.0726
    }
  },
  "EIMI": {
    "name": "iShares Core MSCI EM IMI",
    "fullName": "iShares Core MSCI EM IMI UCITS ETF USD (Acc)",
    "ter": 0.0018,
    "type": "Acc",
    "index": "MSCI Emerging Markets IMI",
    "currency": "USD",
    "start": "2012-05",
    "returns": {
      "2012-05": -0.0119,
      "2012-06": 0.0373,
      "2012-07": 0.0126
    }
  },
  "FWRA": {
    "name": "Invesco FTSE All-World",
    "fullName": "Invesco FTSE All-World UCITS ETF Accumulating",
    "ter": 0.0015,
    "type": "Acc",
    "index": "FTSE All-World",
    "currency": "USD",
    "start": "2022-01",
    "returns": {
      "2022-01": -0.0548,
      "2022-02": -0.0272,
      "2022-03": 0.0250
    }
  },
  "VUSA": {
    "name": "Vanguard S&P 500",
    "fullName": "Vanguard S&P 500 UCITS ETF (USD) Distributing",
    "ter": 0.0007,
    "type": "Dist",
    "index": "S&P 500",
    "currency": "USD",
    "start": "2012-05",
    "returns": {
      "2012-05": -0.0048,
      "2012-06": 0.0394,
      "2012-07": 0.0131
    }
  },
  "AGGH": {
    "name": "iShares Global Aggregate Bond",
    "fullName": "iShares Core Global Aggregate Bond UCITS ETF USD Hedged (Acc)",
    "ter": 0.0010,
    "type": "Acc",
    "index": "Bloomberg Global Aggregate",
    "currency": "USD",
    "start": "2017-11",
    "returns": {
      "2017-11": 0.0007,
      "2017-12": 0.0042,
      "2018-01": 0.0005
    }
  }
}
```

- [ ] **Krok 2: Stwórz `js/etf-usdpln.json` z przykładowymi kursami**

```json
{
  "2009-10": 2.87,
  "2009-11": 2.81,
  "2009-12": 2.85,
  "2010-01": 2.91,
  "2010-02": 2.95,
  "2010-03": 2.86
}
```

Format: klucz `"RRRR-MM"`, wartość = średni miesięczny kurs USD/PLN z NBP.

- [ ] **Krok 3: Zweryfikuj JSON w konsoli przeglądarki**

Otwórz dowolną stronę projektu, w konsoli wpisz:
```javascript
fetch('../js/etf-data.json').then(r=>r.json()).then(d=>console.log(Object.keys(d)))
// Oczekiwany wynik: ["IWDA", "VWCE", "CSPX", "EQQQ", "EIMI", "FWRA", "VUSA", "AGGH"]
```

---

## Task 2: HTML — szkielet strony

**Files:**
- Create: `pages/kalkulator-etf-historyczny.html`
- Reference: `pages/kalkulator-etf.html` (kopiuj head, nav, footer pattern)

- [ ] **Krok 1: Skopiuj head z `kalkulator-etf.html` i dostosuj meta tagi**

Utwórz `pages/kalkulator-etf-historyczny.html`. Head identyczny jak `kalkulator-etf.html` z wyjątkiem:

```html
<title>Backtesting ETF 2026 — ile byś zarobił na IWDA, VWCE? | ETFkalkulator.pl</title>
<link rel="canonical" href="https://etfkalkulator.pl/pages/kalkulator-etf-historyczny.html">
<meta name="description" content="Sprawdź ile byś zarobił inwestując w IWDA, VWCE lub CSPX. Backtesting z rzeczywistymi danymi miesięcznymi. Uwzględnia TER, inflację i IKE.">
```

Schema.org:
```json
{
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Kalkulator ETF Historyczny — Backtesting",
  "description": "Narzędzie do backtestingu inwestycji w fundusze ETF na podstawie rzeczywistych danych miesięcznych.",
  "url": "https://etfkalkulator.pl/pages/kalkulator-etf-historyczny.html"
}
```

BreadcrumbList:
```json
[
  {"position": 1, "name": "Strona główna", "item": "https://etfkalkulator.pl/"},
  {"position": 2, "name": "Kalkulator ETF Historyczny", "item": "https://etfkalkulator.pl/pages/kalkulator-etf-historyczny.html"}
]
```

Na końcu `</head>` dodaj:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js" defer></script>
<script src="../js/charts-config.js" defer></script>
<script src="../js/kalkulator-etf-historyczny.js" defer></script>
```

- [ ] **Krok 2: Dodaj hero + breadcrumbs (identyczny pattern)**

```html
<main id="main" class="pt-20 pb-20 px-6 min-h-screen bg-stitch-bg dark:bg-slate-950 transition-colors duration-300">
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <nav class="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
        <a href="../index.html" class="hover:text-primary transition-colors">ETFkalkulator.pl</a>
        <span class="material-symbols-outlined text-[14px]">chevron_right</span>
        <span class="text-slate-600 dark:text-slate-300">Kalkulator ETF Historyczny</span>
      </nav>
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-stitch-text mb-4">
        Backtesting <span class="text-primary" style="color:#0d7ff2;">ETF</span>
      </h1>
      <p class="text-lg text-stitch-muted max-w-2xl leading-relaxed">
        Ile byś zarobił inwestując regularnie w IWDA, VWCE lub CSPX? Sprawdź wyniki historyczne oparte na rzeczywistych danych miesięcznych.
      </p>
    </div>
```

- [ ] **Krok 3: Dodaj zakładki (tabs)**

```html
    <!-- TABS -->
    <div class="overflow-x-auto -mx-2 px-2 mb-8">
      <div class="flex gap-0 border-b-2 border-slate-200 dark:border-slate-700 min-w-max">
        <button id="tab-backtesting" onclick="switchTab('backtesting')"
          class="tab-btn flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider text-slate-400 border-b-2 border-transparent -mb-[2px] transition-colors whitespace-nowrap"
          data-active="true">
          <span class="material-symbols-outlined text-[18px]">history</span>
          Backtesting
        </button>
        <button id="tab-porownanie" onclick="switchTab('porownanie')"
          class="tab-btn flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider text-slate-400 border-b-2 border-transparent -mb-[2px] transition-colors whitespace-nowrap">
          <span class="material-symbols-outlined text-[18px]">compare_arrows</span>
          Porównanie ETF
        </button>
        <button id="tab-ter" onclick="switchTab('ter')"
          class="tab-btn flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider text-slate-400 border-b-2 border-transparent -mb-[2px] transition-colors whitespace-nowrap">
          <span class="material-symbols-outlined text-[18px]">payments</span>
          Koszt TER
        </button>
      </div>
    </div>
```

- [ ] **Krok 4: Dodaj kontenery zakładek**

```html
    <!-- PANEL: BACKTESTING -->
    <div id="panel-backtesting" class="tab-panel">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside class="lg:col-span-4 space-y-6" id="form-backtesting">
          <!-- formularz — Task 3 -->
        </aside>
        <section class="lg:col-span-8" id="wyniki-backtesting">
          <!-- wyniki — Task 4 -->
        </section>
      </div>
    </div>

    <!-- PANEL: PORÓWNANIE -->
    <div id="panel-porownanie" class="tab-panel hidden">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside class="lg:col-span-4 space-y-6" id="form-porownanie">
          <!-- formularz — Task 5 -->
        </aside>
        <section class="lg:col-span-8" id="wyniki-porownanie">
          <!-- wyniki — Task 5 -->
        </section>
      </div>
    </div>

    <!-- PANEL: TER -->
    <div id="panel-ter" class="tab-panel hidden">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside class="lg:col-span-4 space-y-6" id="form-ter">
          <!-- formularz — Task 6 -->
        </aside>
        <section class="lg:col-span-8" id="wyniki-ter">
          <!-- wyniki — Task 6 -->
        </section>
      </div>
    </div>

  </div><!-- /.max-w-7xl -->
</main>
```

Zamknij stronę identycznie jak `kalkulator-etf.html` (nav-root, cookie-consent, shared.js).

- [ ] **Krok 5: Otwórz stronę w przeglądarce — sprawdź że nav i layout się ładują**

Otwórz `pages/kalkulator-etf-historyczny.html` lokalnie. Powinny być widoczne: nawigacja, hero z tytułem, 3 zakładki (Backtesting aktywna), reszta pusta.

---

## Task 3: HTML — formularz Backtesting

**Files:**
- Modify: `pages/kalkulator-etf-historyczny.html` — sekcja `#form-backtesting`

- [ ] **Krok 1: Dodaj kartę selektora ETF**

Wewnątrz `<aside id="form-backtesting">`:

```html
<div class="glass-effect p-8 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-stitch-soft shadow-slate-200/50 dark:shadow-none">
  <h3 class="text-lg font-bold text-stitch-text mb-6 flex items-center gap-3">
    <span class="material-symbols-outlined text-primary" style="color:#0d7ff2;">search_insights</span>
    Wybierz ETF
  </h3>
  <div class="grid grid-cols-2 gap-3" id="etf-selector-backtesting">
    <!-- wypełniane przez JS z etf-data.json -->
  </div>
</div>
```

- [ ] **Krok 2: Dodaj kartę parametrów**

```html
<div class="glass-effect p-8 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-stitch-soft shadow-slate-200/50 dark:shadow-none">
  <h3 class="text-lg font-bold text-stitch-text mb-8 flex items-center gap-3">
    <span class="material-symbols-outlined text-primary" style="color:#0d7ff2;">tune</span>
    Parametry inwestycji
  </h3>
  <div class="space-y-8">

    <!-- Kapitał startowy -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Kapitał startowy</label>
        <span class="text-xs font-bold text-primary bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-md" style="color:#0d7ff2;">PLN</span>
      </div>
      <input type="text" inputmode="decimal" id="bt-kapital"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="10000" autocomplete="off">
      <p class="text-[11px] text-slate-400">Kwota zainwestowana na starcie.</p>
    </div>

    <!-- Miesięczna dopłata -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Miesięczna dopłata</label>
        <span class="text-xs font-bold text-primary bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-md" style="color:#0d7ff2;">PLN</span>
      </div>
      <input type="text" inputmode="decimal" id="bt-doplata"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="500" autocomplete="off">
      <p class="text-[11px] text-slate-400">Regularna dopłata każdego miesiąca (DCA).</p>
    </div>

    <hr class="border-slate-100 dark:border-slate-800">

    <!-- Okres -->
    <div class="space-y-3">
      <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Okres backtestingu</label>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <p class="text-[11px] text-slate-400 mb-1.5 uppercase tracking-wider font-semibold">Od (MM/RRRR)</p>
          <input type="text" id="bt-od" placeholder="01/2015"
            class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            autocomplete="off">
        </div>
        <div>
          <p class="text-[11px] text-slate-400 mb-1.5 uppercase tracking-wider font-semibold">Do (MM/RRRR)</p>
          <input type="text" id="bt-do" placeholder="04/2026"
            class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            autocomplete="off">
        </div>
      </div>
      <!-- Presety -->
      <div class="grid grid-cols-2 gap-2">
        <button onclick="setPreset('5lat')" class="preset-period-btn py-2.5 rounded-stitch border border-stitch-border bg-stitch-surface text-[10px] font-bold uppercase tracking-tight text-stitch-muted hover:border-primary/50 transition-all text-center leading-tight">
          Ostatnie 5 lat<span class="block font-normal opacity-70 normal-case">2021–2026</span>
        </button>
        <button onclick="setPreset('10lat')" class="preset-period-btn py-2.5 rounded-stitch border-2 border-primary/50 bg-primary/5 text-[10px] font-bold uppercase tracking-tight text-primary hover:border-primary transition-all text-center leading-tight" style="color:#0d7ff2;">
          Ostatnie 10 lat<span class="block font-normal opacity-70 normal-case">2016–2026</span>
        </button>
        <button onclick="setPreset('covid')" class="preset-period-btn py-2.5 rounded-stitch border border-stitch-border bg-stitch-surface text-[10px] font-bold uppercase tracking-tight text-stitch-muted hover:border-primary/50 transition-all text-center leading-tight">
          Od COVID<span class="block font-normal opacity-70 normal-case">2020–2026</span>
        </button>
        <button onclick="setPreset('max')" class="preset-period-btn py-2.5 rounded-stitch border border-stitch-border bg-stitch-surface text-[10px] font-bold uppercase tracking-tight text-stitch-muted hover:border-primary/50 transition-all text-center leading-tight">
          Max historia<span class="block font-normal opacity-70 normal-case">od startu ETF</span>
        </button>
      </div>
    </div>

    <!-- IKE Toggle -->
    <label class="flex items-start gap-4 p-4 rounded-stitch border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer">
      <div class="relative flex items-center mt-0.5">
        <input type="checkbox" id="bt-ike" class="peer sr-only" checked>
        <div class="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary transition-colors" style="--tw-bg-opacity:1;"></div>
        <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-sm"></div>
      </div>
      <div class="flex-1">
        <span class="block text-sm font-bold text-stitch-text mb-1">Konto IKE (0% podatku Belki)</span>
        <span class="block text-xs text-stitch-muted leading-normal">Zaznacz jeśli inwestujesz w ramach limitu IKE.</span>
      </div>
    </label>

    <button onclick="obliczBacktesting()"
      class="w-full py-4 bg-primary text-white rounded-stitch font-extrabold text-lg hover:bg-primary/90 transition-colors shadow-lg"
      style="background:#0d7ff2;">
      Oblicz wynik historyczny
    </button>

  </div>
</div>
```

- [ ] **Krok 3: Sprawdź w przeglądarce — formularz widoczny, styled prawidłowo na mobile i desktop**

---

## Task 4: HTML — wyniki Backtesting

**Files:**
- Modify: `pages/kalkulator-etf-historyczny.html` — sekcja `#wyniki-backtesting`

- [ ] **Krok 1: Dodaj placeholder wyników (widoczny przed pierwszym obliczeniem)**

Wewnątrz `<section id="wyniki-backtesting">`:

```html
<!-- Stan: przed obliczeniem -->
<div id="bt-placeholder" class="glass-effect p-8 rounded-[2rem] border border-white/50 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[300px] text-center">
  <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">bar_chart</span>
  <p class="text-stitch-muted font-medium">Wybierz ETF i parametry, a następnie kliknij<br><strong class="text-stitch-text">Oblicz wynik historyczny</strong></p>
</div>

<!-- Stan: wyniki (ukryty domyślnie) -->
<div id="bt-wyniki" class="hidden space-y-6">

  <!-- Kafelki wyników -->
  <div class="grid grid-cols-2 gap-4">
    <div class="glass-effect p-6 rounded-[1.5rem] border border-white/50 dark:border-slate-700/50">
      <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kapitał końcowy</p>
      <p id="bt-kapital-koncowy" class="text-2xl font-extrabold text-primary" style="color:#0d7ff2;">—</p>
    </div>
    <div class="glass-effect p-6 rounded-[1.5rem] border border-white/50 dark:border-slate-700/50">
      <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Wpłacony kapitał</p>
      <p id="bt-wklad" class="text-2xl font-extrabold text-stitch-text">—</p>
    </div>
    <div class="glass-effect p-6 rounded-[1.5rem] border border-white/50 dark:border-slate-700/50">
      <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Zysk netto</p>
      <p id="bt-zysk" class="text-2xl font-extrabold text-green-600 dark:text-green-400">—</p>
    </div>
    <div class="glass-effect p-6 rounded-[1.5rem] border border-white/50 dark:border-slate-700/50">
      <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Całkowity zwrot</p>
      <p id="bt-zwrot" class="text-2xl font-extrabold text-green-600 dark:text-green-400">—</p>
    </div>
  </div>

  <!-- Wykres -->
  <div class="glass-effect p-6 rounded-[2rem] border border-white/50 dark:border-slate-700/50">
    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Wartość portfela w czasie</p>
    <div class="relative" style="height:300px;">
      <canvas id="bt-chart"></canvas>
    </div>
  </div>

  <!-- Disclaimer -->
  <div class="bg-slate-50 dark:bg-slate-800/50 rounded-stitch p-4">
    <p id="bt-disclaimer" class="text-xs text-slate-400 leading-relaxed">
      📌 Dane oparte na rzeczywistych miesięcznych stopach zwrotu. Kurs USD/PLN według NBP. Uwzględniono TER funduszu. Wyniki historyczne nie gwarantują przyszłych zysków.
    </p>
  </div>
</div>
```

---

## Task 5: JS — logika podstawowa (dane + zakładki + ETF selector)

**Files:**
- Create: `js/kalkulator-etf-historyczny.js`

- [ ] **Krok 1: Inicjalizacja — załaduj dane i wyrenderuj selektor ETF**

Utwórz `js/kalkulator-etf-historyczny.js`:

```javascript
// ============================================================
// Kalkulator ETF Historyczny — ETFkalkulator.pl
// ============================================================

let ETF_DATA = {};
let USDPLN_DATA = {};
let activeTab = 'backtesting';
let selectedEtf = 'IWDA';
let btChart = null;

// --- Inicjalizacja ---
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [etfRes, fxRes] = await Promise.all([
      fetch('../js/etf-data.json'),
      fetch('../js/etf-usdpln.json')
    ]);
    ETF_DATA = await etfRes.json();
    USDPLN_DATA = await fxRes.json();
    renderEtfSelector('etf-selector-backtesting', 'IWDA');
    setPreset('10lat');
  } catch (e) {
    console.error('Błąd ładowania danych ETF:', e);
  }
});

// --- Zakładki ---
function switchTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById('panel-' + tabName).classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('text-primary', 'border-primary');
    btn.classList.add('text-slate-400', 'border-transparent');
    btn.style.color = '';
  });
  const activeBtn = document.getElementById('tab-' + tabName);
  activeBtn.classList.remove('text-slate-400', 'border-transparent');
  activeBtn.classList.add('border-primary');
  activeBtn.style.color = '#0d7ff2';
}

// --- ETF Selector ---
function renderEtfSelector(containerId, defaultTicker) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  Object.entries(ETF_DATA).forEach(([ticker, etf]) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.dataset.ticker = ticker;
    card.onclick = () => selectEtf(containerId, ticker);
    card.className = [
      'etf-card-btn text-left p-3 rounded-2xl border-2 transition-all',
      ticker === defaultTicker
        ? 'border-primary bg-primary/5'
        : 'border-slate-200 dark:border-slate-700 bg-stitch-surface hover:border-primary/40'
    ].join(' ');
    card.innerHTML = `
      <span class="block text-sm font-extrabold text-stitch-text">${ticker}</span>
      <span class="block text-[11px] text-stitch-muted leading-tight mt-0.5">${etf.name}</span>
      <span class="block text-[11px] font-bold mt-1.5" style="color:#0d7ff2;">TER ${(etf.ter * 100).toFixed(2)}% · ${etf.type}</span>
    `;
    container.appendChild(card);
  });
  selectedEtf = defaultTicker;
}

function selectEtf(containerId, ticker) {
  selectedEtf = ticker;
  document.querySelectorAll(`#${containerId} .etf-card-btn`).forEach(btn => {
    const isSelected = btn.dataset.ticker === ticker;
    btn.className = [
      'etf-card-btn text-left p-3 rounded-2xl border-2 transition-all',
      isSelected
        ? 'border-primary bg-primary/5'
        : 'border-slate-200 dark:border-slate-700 bg-stitch-surface hover:border-primary/40'
    ].join(' ');
  });
}

// --- Presety dat ---
function setPreset(preset) {
  const now = new Date();
  const todayKey = `${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;
  const presets = {
    '5lat':  { od: `01/${now.getFullYear()-5}`, do: todayKey },
    '10lat': { od: `01/${now.getFullYear()-10}`, do: todayKey },
    'covid': { od: '03/2020', do: todayKey },
    'max':   { od: ETF_DATA[selectedEtf]?.start.replace('-', '/').split('/').reverse().join('/') || '01/2010', do: todayKey }
  };
  if (!presets[preset]) return;
  const odEl = document.getElementById('bt-od');
  const doEl = document.getElementById('bt-do');
  if (odEl) odEl.value = presets[preset].od;
  if (doEl) doEl.value = presets[preset].do;

  // Aktualizuj styl aktywnego presetu
  document.querySelectorAll('.preset-period-btn').forEach(btn => {
    btn.className = btn.className
      .replace('border-2 border-primary/50 bg-primary/5 text-primary', '')
      .replace('border border-stitch-border bg-stitch-surface text-stitch-muted', '')
      .trim();
    btn.style.color = '';
  });
}

// --- Helpers ---
function parseDateKey(str) {
  // "01/2015" → "2015-01"
  if (!str || !str.includes('/')) return null;
  const [mm, yyyy] = str.split('/');
  return `${yyyy}-${mm.padStart(2, '0')}`;
}

function formatPLN(val) {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);
}

function formatPct(val) {
  return (val >= 0 ? '+' : '') + (val * 100).toFixed(1) + '%';
}
```

- [ ] **Krok 2: Otwórz stronę — sprawdź w konsoli że ETF_DATA jest załadowany, selektor ETF widoczny z 8 kartami**

---

## Task 6: JS — logika backtestingu

**Files:**
- Modify: `js/kalkulator-etf-historyczny.js` — dodaj na końcu

- [ ] **Krok 1: Dodaj funkcję obliczBacktesting()**

```javascript
function obliczBacktesting() {
  const etf = ETF_DATA[selectedEtf];
  if (!etf) return;

  const kapitalStart = parseFloat(document.getElementById('bt-kapital').value.replace(/\s/g, '').replace(',', '.')) || 0;
  const doplata = parseFloat(document.getElementById('bt-doplata').value.replace(/\s/g, '').replace(',', '.')) || 0;
  const odKey = parseDateKey(document.getElementById('bt-od').value);
  const doKey = parseDateKey(document.getElementById('bt-do').value);
  const ike = document.getElementById('bt-ike').checked;

  if (!odKey || !doKey) {
    alert('Wprowadź poprawny zakres dat w formacie MM/RRRR');
    return;
  }

  // Filtruj dostępne miesiące
  const allKeys = Object.keys(etf.returns).sort();
  const filteredKeys = allKeys.filter(k => k >= odKey && k <= doKey);

  if (filteredKeys.length < 2) {
    alert(`Brak danych dla ${selectedEtf} w podanym okresie. Dostępne dane od: ${etf.start}`);
    return;
  }

  // Symulacja portfela miesiąc po miesiącu
  const terMiesieczny = etf.ter / 12;
  let kapital = kapitalStart; // w USD
  const historiaKapital = [];   // PLN
  const historiaWklad = [];     // PLN
  let wkladLaczny = kapitalStart;

  filteredKeys.forEach((key, i) => {
    const stopaMsc = etf.returns[key];
    const kursNBP = USDPLN_DATA[key] || USDPLN_DATA[Object.keys(USDPLN_DATA).sort().at(-1)];

    if (i > 0) {
      kapital = kapital * (1 + stopaMsc - terMiesieczny) + doplata / kursNBP;
      wkladLaczny += doplata;
    }

    historiaKapital.push(Math.round(kapital * kursNBP));
    historiaWklad.push(Math.round(wkladLaczny));
  });

  const kapitalKoncowy = historiaKapital.at(-1);
  let zysk = kapitalKoncowy - wkladLaczny;

  // Podatek Belki jeśli nie IKE
  if (!ike && zysk > 0) {
    zysk = zysk * 0.81; // po odliczeniu 19%
  }

  const kapitalNetto = Math.round(wkladLaczny + zysk);
  const zwrot = wkladLaczny > 0 ? zysk / wkladLaczny : 0;

  // Wyświetl wyniki
  document.getElementById('bt-placeholder').classList.add('hidden');
  document.getElementById('bt-wyniki').classList.remove('hidden');
  document.getElementById('bt-kapital-koncowy').textContent = formatPLN(kapitalNetto);
  document.getElementById('bt-wklad').textContent = formatPLN(wkladLaczny);
  document.getElementById('bt-zysk').textContent = formatPLN(zysk);
  document.getElementById('bt-zwrot').textContent = formatPct(zwrot);
  document.getElementById('bt-disclaimer').textContent =
    `📌 Dane: ${selectedEtf} (${etf.name}), ${filteredKeys[0]} – ${filteredKeys.at(-1)}. ` +
    `TER ${(etf.ter*100).toFixed(2)}%/rok uwzględniony. Kurs USD/PLN: NBP. ` +
    (ike ? 'Konto IKE — brak podatku Belki.' : 'Podatek Belki 19% od zysku uwzględniony.') +
    ' Wyniki historyczne nie gwarantują przyszłych zysków.';

  renderBtChart(filteredKeys, historiaKapital, historiaWklad);

  // Scroll do wyników na mobile
  if (window.innerWidth < 1024) {
    document.getElementById('bt-wyniki').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
```

- [ ] **Krok 2: Dodaj funkcję renderBtChart()**

```javascript
function renderBtChart(labels, kapitalData, wkladData) {
  const ctx = document.getElementById('bt-chart').getContext('2d');
  if (btChart) btChart.destroy();

  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  btChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Wartość portfela (PLN)',
          data: kapitalData,
          borderColor: '#0d7ff2',
          backgroundColor: 'rgba(13,127,242,0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4
        },
        {
          label: 'Wpłacony kapitał (PLN)',
          data: wkladData,
          borderColor: '#94a3b8',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [5, 3],
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Inter', size: 12 }, boxWidth: 16 } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${formatPLN(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { size: 11 }, maxTicksLimit: 8, maxRotation: 0 },
          grid: { color: gridColor }
        },
        y: {
          ticks: {
            color: textColor, font: { size: 11 },
            callback: v => v >= 1000 ? (v/1000).toFixed(0) + 'k zł' : v + ' zł'
          },
          grid: { color: gridColor }
        }
      }
    }
  });
}
```

- [ ] **Krok 3: Przetestuj backtesting manualnie**

1. Otwórz stronę w przeglądarce
2. Wybierz IWDA, wpisz 10000 kapitał, 500 dopłata, preset "10 lat", IKE włączone
3. Kliknij "Oblicz wynik historyczny"
4. Sprawdź: kafelki wyników wypełnione, wykres widoczny z dwiema liniami
5. Sprawdź mobile (DevTools → iPhone SE): formularz → wyniki w jednej kolumnie, scroll do wyników działa

---

## Task 7: JS + HTML — zakładka Porównanie ETF

**Files:**
- Modify: `pages/kalkulator-etf-historyczny.html` — sekcja `#form-porownanie` i `#wyniki-porownanie`
- Modify: `js/kalkulator-etf-historyczny.js` — dodaj na końcu

- [ ] **Krok 1: Dodaj HTML formularza porównania**

Wewnątrz `<aside id="form-porownanie">`:

```html
<div class="glass-effect p-8 rounded-[2rem] border border-white/50 dark:border-slate-700/50">
  <h3 class="text-lg font-bold text-stitch-text mb-6 flex items-center gap-3">
    <span class="material-symbols-outlined text-primary" style="color:#0d7ff2;">compare_arrows</span>
    ETF A vs ETF B
  </h3>

  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ETF A <span class="inline-block w-3 h-3 rounded-full ml-1" style="background:#0d7ff2;vertical-align:middle"></span></p>
  <div class="grid grid-cols-2 gap-2 mb-6" id="etf-selector-a"></div>

  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ETF B <span class="inline-block w-3 h-3 rounded-full ml-1" style="background:#f59e0b;vertical-align:middle"></span></p>
  <div class="grid grid-cols-2 gap-2 mb-6" id="etf-selector-b"></div>

  <hr class="border-slate-100 dark:border-slate-800 mb-6">

  <div class="space-y-6">
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Kapitał startowy</label>
        <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md" style="color:#0d7ff2;">PLN</span>
      </div>
      <input type="text" inputmode="decimal" id="por-kapital"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="10000" autocomplete="off">
    </div>
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Miesięczna dopłata</label>
        <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md" style="color:#0d7ff2;">PLN</span>
      </div>
      <input type="text" inputmode="decimal" id="por-doplata"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="500" autocomplete="off">
    </div>
    <div class="space-y-3">
      <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Okres</label>
      <div class="grid grid-cols-2 gap-3">
        <input type="text" id="por-od" placeholder="01/2019"
          class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none">
        <input type="text" id="por-do" placeholder="04/2026"
          class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none">
      </div>
    </div>
  </div>

  <button onclick="obliczPorownanie()"
    class="w-full mt-8 py-4 bg-primary text-white rounded-stitch font-extrabold text-lg hover:bg-primary/90 transition-colors shadow-lg"
    style="background:#0d7ff2;">
    Porównaj ETF-y
  </button>
</div>
```

Wewnątrz `<section id="wyniki-porownanie">` — analogiczny placeholder i wyniki jak w backtesting, z `id="por-chart"`, `id="por-wyniki"`, `id="por-placeholder"`, plus tabela porównawcza z id `por-tabela`.

- [ ] **Krok 2: Dodaj JS dla porównania**

```javascript
let selectedEtfA = 'IWDA';
let selectedEtfB = 'CSPX';
let porChart = null;

function initPorownanie() {
  renderEtfSelector2('etf-selector-a', selectedEtfA, 'A');
  renderEtfSelector2('etf-selector-b', selectedEtfB, 'B');
  document.getElementById('por-od').value = '01/2019';
  document.getElementById('por-do').value = `${String(new Date().getMonth()+1).padStart(2,'0')}/${new Date().getFullYear()}`;
}

function renderEtfSelector2(containerId, defaultTicker, slot) {
  const color = slot === 'A' ? '#0d7ff2' : '#f59e0b';
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  Object.entries(ETF_DATA).forEach(([ticker, etf]) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.dataset.ticker = ticker;
    card.onclick = () => {
      if (slot === 'A') selectedEtfA = ticker;
      else selectedEtfB = ticker;
      renderEtfSelector2(containerId, ticker, slot);
    };
    const isSelected = ticker === defaultTicker;
    card.className = `etf-card-btn text-left p-3 rounded-2xl border-2 transition-all ${isSelected ? 'bg-opacity-5' : 'border-slate-200 dark:border-slate-700 bg-stitch-surface hover:border-opacity-40'}`;
    card.style.borderColor = isSelected ? color : '';
    card.style.background = isSelected ? color + '10' : '';
    card.innerHTML = `
      <span class="block text-sm font-extrabold text-stitch-text">${ticker}</span>
      <span class="block text-[11px] text-stitch-muted leading-tight mt-0.5">${etf.name}</span>
    `;
    container.appendChild(card);
  });
}

function symulujPortfel(ticker, odKey, doKey, kapitalStart, doplata) {
  const etf = ETF_DATA[ticker];
  const allKeys = Object.keys(etf.returns).sort();
  const filteredKeys = allKeys.filter(k => k >= odKey && k <= doKey);
  if (filteredKeys.length < 2) return null;
  const terMsc = etf.ter / 12;
  let kapital = kapitalStart;
  let wkladLaczny = kapitalStart;
  const historiaKapital = [];
  filteredKeys.forEach((key, i) => {
    const stopaMsc = etf.returns[key];
    const kursNBP = USDPLN_DATA[key] || USDPLN_DATA[Object.keys(USDPLN_DATA).sort().at(-1)];
    if (i > 0) { kapital = kapital * (1 + stopaMsc - terMsc) + doplata / kursNBP; wkladLaczny += doplata; }
    historiaKapital.push(Math.round(kapital * kursNBP));
  });
  return { filteredKeys, historiaKapital, wkladLaczny };
}

function obliczPorownanie() {
  const kapitalStart = parseFloat(document.getElementById('por-kapital').value.replace(/\s/g,'').replace(',','.')) || 0;
  const doplata = parseFloat(document.getElementById('por-doplata').value.replace(/\s/g,'').replace(',','.')) || 0;
  const odKey = parseDateKey(document.getElementById('por-od').value);
  const doKey = parseDateKey(document.getElementById('por-do').value);
  if (!odKey || !doKey) { alert('Wprowadź poprawny zakres dat'); return; }

  const resA = symulujPortfel(selectedEtfA, odKey, doKey, kapitalStart, doplata);
  const resB = symulujPortfel(selectedEtfB, odKey, doKey, kapitalStart, doplata);
  if (!resA || !resB) { alert('Brak wystarczających danych dla wybranego okresu'); return; }

  document.getElementById('por-placeholder').classList.add('hidden');
  document.getElementById('por-wyniki').classList.remove('hidden');

  // Wspólne etykiety (przecięcie zakresów)
  const commonKeys = resA.filteredKeys.filter(k => resB.filteredKeys.includes(k));
  const dataA = commonKeys.map(k => resA.historiaKapital[resA.filteredKeys.indexOf(k)]);
  const dataB = commonKeys.map(k => resB.historiaKapital[resB.filteredKeys.indexOf(k)]);

  const ctx = document.getElementById('por-chart').getContext('2d');
  if (porChart) porChart.destroy();
  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  porChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: commonKeys,
      datasets: [
        { label: selectedEtfA, data: dataA, borderColor: '#0d7ff2', backgroundColor: 'rgba(13,127,242,0.06)', borderWidth: 2.5, fill: true, tension: 0.3, pointRadius: 0 },
        { label: selectedEtfB, data: dataB, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.06)', borderWidth: 2.5, fill: true, tension: 0.3, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Inter', size: 12 }, boxWidth: 16 } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatPLN(ctx.parsed.y)}` } }
      },
      scales: {
        x: { ticks: { color: textColor, font: { size: 11 }, maxTicksLimit: 8, maxRotation: 0 }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, font: { size: 11 }, callback: v => v >= 1000 ? (v/1000).toFixed(0)+'k zł' : v+' zł' }, grid: { color: gridColor } }
      }
    }
  });

  // Tabela
  const kA = resA.historiaKapital.at(-1);
  const kB = resB.historiaKapital.at(-1);
  document.getElementById('por-tabela').innerHTML = `
    <table class="w-full text-sm">
      <thead><tr class="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
        <th class="text-left pb-3">ETF</th><th class="text-right pb-3">Kapitał końcowy</th><th class="text-right pb-3">Zysk</th>
      </tr></thead>
      <tbody>
        <tr class="border-b border-slate-50 dark:border-slate-800">
          <td class="py-3 font-bold" style="color:#0d7ff2">${selectedEtfA}</td>
          <td class="py-3 text-right font-extrabold text-stitch-text">${formatPLN(kA)}</td>
          <td class="py-3 text-right font-bold text-green-600">${formatPLN(kA - resA.wkladLaczny)}</td>
        </tr>
        <tr>
          <td class="py-3 font-bold" style="color:#f59e0b">${selectedEtfB}</td>
          <td class="py-3 text-right font-extrabold text-stitch-text">${formatPLN(kB)}</td>
          <td class="py-3 text-right font-bold text-green-600">${formatPLN(kB - resB.wkladLaczny)}</td>
        </tr>
      </tbody>
    </table>
  `;
}
```

- [ ] **Krok 3: Dodaj wywołanie `initPorownanie()` w switchTab**

W funkcji `switchTab`, po `document.getElementById('panel-' + tabName).classList.remove('hidden')`, dodaj:
```javascript
if (tabName === 'porownanie' && Object.keys(ETF_DATA).length > 0) initPorownanie();
```

---

## Task 8: JS + HTML — zakładka Koszt TER

**Files:**
- Modify: `pages/kalkulator-etf-historyczny.html` — sekcja `#form-ter` i `#wyniki-ter`
- Modify: `js/kalkulator-etf-historyczny.js` — dodaj na końcu

- [ ] **Krok 1: Dodaj HTML formularza TER**

```html
<div class="glass-effect p-8 rounded-[2rem] border border-white/50 dark:border-slate-700/50">
  <h3 class="text-lg font-bold text-stitch-text mb-8 flex items-center gap-3">
    <span class="material-symbols-outlined text-primary" style="color:#0d7ff2;">payments</span>
    Porównaj koszty TER
  </h3>
  <div class="space-y-8">
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Kapitał startowy</label>
        <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md" style="color:#0d7ff2;">PLN</span>
      </div>
      <input type="text" inputmode="decimal" id="ter-kapital"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="50000" autocomplete="off">
    </div>
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Miesięczna dopłata</label>
        <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md" style="color:#0d7ff2;">PLN</span>
      </div>
      <input type="text" inputmode="decimal" id="ter-doplata"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="1000" autocomplete="off">
    </div>
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Horyzont inwestycji</label>
        <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md" style="color:#0d7ff2;">LATA</span>
      </div>
      <input type="text" inputmode="decimal" id="ter-lata"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="20" autocomplete="off">
      <div class="grid grid-cols-3 gap-2">
        <button onclick="document.getElementById('ter-lata').value=10" class="py-2.5 rounded-stitch border border-stitch-border bg-stitch-surface text-[10px] font-bold uppercase tracking-tight text-stitch-muted hover:border-primary/50 transition-all">10 lat</button>
        <button onclick="document.getElementById('ter-lata').value=20" class="py-2.5 rounded-stitch border-2 border-primary/50 bg-primary/5 text-[10px] font-bold uppercase tracking-tight hover:border-primary transition-all" style="color:#0d7ff2;">20 lat</button>
        <button onclick="document.getElementById('ter-lata').value=30" class="py-2.5 rounded-stitch border border-stitch-border bg-stitch-surface text-[10px] font-bold uppercase tracking-tight text-stitch-muted hover:border-primary/50 transition-all">30 lat</button>
      </div>
    </div>
    <hr class="border-slate-100 dark:border-slate-800">
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">TER A (tani ETF) <span class="inline-block w-2 h-2 rounded-full ml-1" style="background:#0d7ff2;vertical-align:middle"></span></label>
        <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md" style="color:#0d7ff2;">%</span>
      </div>
      <input type="text" inputmode="decimal" id="ter-a"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="0.07" autocomplete="off">
      <p class="text-[11px] text-slate-400">Np. CSPX lub VUSA (0,07%)</p>
    </div>
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">TER B (droższy ETF) <span class="inline-block w-2 h-2 rounded-full ml-1" style="background:#f59e0b;vertical-align:middle"></span></label>
        <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">%</span>
      </div>
      <input type="text" inputmode="decimal" id="ter-b"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="0.50" autocomplete="off">
      <p class="text-[11px] text-slate-400">Np. aktywny fundusz lub drogi ETF</p>
    </div>
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Zakładana stopa zwrotu</label>
        <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">%</span>
      </div>
      <input type="text" inputmode="decimal" id="ter-stopa"
        class="w-full h-14 px-5 rounded-stitch bg-stitch-surface border-2 border-slate-100 text-stitch-text text-lg font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
        value="7" autocomplete="off">
    </div>
    <button onclick="obliczTER()"
      class="w-full py-4 bg-primary text-white rounded-stitch font-extrabold text-lg hover:bg-primary/90 transition-colors shadow-lg"
      style="background:#0d7ff2;">
      Oblicz koszt opłat
    </button>
  </div>
</div>
```

- [ ] **Krok 2: Dodaj JS dla TER**

```javascript
let terChart = null;

function obliczTER() {
  const kapital = parseFloat(document.getElementById('ter-kapital').value.replace(/\s/g,'').replace(',','.')) || 0;
  const doplata = parseFloat(document.getElementById('ter-doplata').value.replace(/\s/g,'').replace(',','.')) || 0;
  const lata = parseInt(document.getElementById('ter-lata').value) || 20;
  const terA = parseFloat(document.getElementById('ter-a').value.replace(',','.')) / 100 || 0.0007;
  const terB = parseFloat(document.getElementById('ter-b').value.replace(',','.')) / 100 || 0.005;
  const stopa = parseFloat(document.getElementById('ter-stopa').value.replace(',','.')) / 100 || 0.07;

  const miesiecy = lata * 12;
  const stopaMsc = stopa / 12;

  function symulujTER(ter) {
    const netMsc = stopaMsc - ter / 12;
    let k = kapital;
    const historia = [Math.round(k)];
    for (let i = 1; i <= miesiecy; i++) {
      k = k * (1 + netMsc) + doplata;
      if (i % 12 === 0) historia.push(Math.round(k));
    }
    return historia;
  }

  const histA = symulujTER(terA);
  const histB = symulujTER(terB);
  const labels = Array.from({ length: lata + 1 }, (_, i) => i === 0 ? 'Start' : `Rok ${i}`);
  const roznica = histA.at(-1) - histB.at(-1);

  document.getElementById('ter-placeholder').classList.add('hidden');
  document.getElementById('ter-wyniki').classList.remove('hidden');
  document.getElementById('ter-kapital-a').textContent = formatPLN(histA.at(-1));
  document.getElementById('ter-kapital-b').textContent = formatPLN(histB.at(-1));
  document.getElementById('ter-roznica').textContent = formatPLN(roznica);
  document.getElementById('ter-info').textContent =
    `Przez ${lata} lat TER ${(terB*100).toFixed(2)}% kosztuje Cię ${formatPLN(roznica)} więcej niż TER ${(terA*100).toFixed(2)}%.`;

  const ctx = document.getElementById('ter-chart').getContext('2d');
  if (terChart) terChart.destroy();
  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  terChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: `TER ${(terA*100).toFixed(2)}%`, data: histA, borderColor: '#0d7ff2', backgroundColor: 'rgba(13,127,242,0.06)', borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 0 },
        { label: `TER ${(terB*100).toFixed(2)}%`, data: histB, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.06)', borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Inter', size: 12 }, boxWidth: 16 } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatPLN(ctx.parsed.y)}` } }
      },
      scales: {
        x: { ticks: { color: textColor, font: { size: 11 }, maxRotation: 0 }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, font: { size: 11 }, callback: v => v >= 1000 ? (v/1000).toFixed(0)+'k zł' : v+' zł' }, grid: { color: gridColor } }
      }
    }
  });
}
```

Dodaj HTML wyników TER (`#ter-placeholder`, `#ter-wyniki`, `#ter-chart`, `#ter-kapital-a`, `#ter-kapital-b`, `#ter-roznica`, `#ter-info`) analogicznie do wzorca z backtesting.

---

## Task 9: Integracja — linki, sitemap, manifest, index.html

**Files:**
- Modify: `pages/kalkulator-etf.html`
- Modify: `sitemap.xml`
- Modify: `manifest.json`
- Modify: `index.html`

- [ ] **Krok 1: Dodaj CTA w kalkulator-etf.html**

Po przycisku "Oblicz" w formularzu (przed zamknięciem `</aside>`), dodaj:

```html
<div class="mt-4 p-4 rounded-stitch bg-primary/5 border border-primary/20 text-center">
  <p class="text-xs text-stitch-muted mb-2">Chcesz sprawdzić wyniki historyczne?</p>
  <a href="kalkulator-etf-historyczny.html" class="text-sm font-bold hover:underline" style="color:#0d7ff2;">
    Backtesting ETF — ile byś zarobił? →
  </a>
</div>
```

- [ ] **Krok 2: Dodaj URL do sitemap.xml**

```xml
<url>
  <loc>https://etfkalkulator.pl/pages/kalkulator-etf-historyczny.html</loc>
  <lastmod>2026-04-10</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

- [ ] **Krok 3: Dodaj shortcut do manifest.json**

W tablicy `shortcuts` dodaj:

```json
{
  "name": "Backtesting ETF",
  "short_name": "Backtesting",
  "description": "Kalkulator historyczny ETF",
  "url": "/pages/kalkulator-etf-historyczny.html",
  "icons": [{"src": "/images/favicon.png", "sizes": "192x192"}]
}
```

- [ ] **Krok 4: Dodaj kartę na index.html**

Znajdź sekcję z kartami kalkulatorów na stronie głównej i dodaj kartę analogiczną do istniejących (zachowaj identyczny HTML pattern karty).

- [ ] **Krok 5: Kompilacja CSS**

```bash
npm run build:css
```

Sprawdź czy nowe klasy (jeśli użyte) są w skompilowanym `css/tailwind.css`.

---

## Task 10: Dane historyczne — uzupełnienie do pełnego zakresu

**Files:**
- Modify: `js/etf-data.json`
- Modify: `js/etf-usdpln.json`

- [ ] **Krok 1: Uzupełnij etf-data.json o rzeczywiste dane**

To krok manualny — uzupełnij miesięczne stopy zwrotu dla wszystkich 8 ETF-ów za cały dostępny okres. Źródła:
- **stooq.pl** — wyszukaj ticker (np. IWDA.UK), pobierz dane miesięczne
- **justetf.com** — zakładka "Performance" → dane miesięczne
- Oblicz stopę zwrotu miesięczną: `(cena_koniec - cena_start) / cena_start`

Minimalne wymaganie przed launchem: IWDA od 2015, CSPX od 2015, VWCE od 2019, EQQQ od 2015.

- [ ] **Krok 2: Uzupełnij etf-usdpln.json**

Pobierz miesięczne średnie kursy USD/PLN z **nbp.pl** → Kursy → Archiwum → tabela A, waluta USD.

- [ ] **Krok 3: Zweryfikuj dane — backtesting IWDA 2015-2026 daje rozsądny wynik**

Otwórz stronę, wybierz IWDA, preset "10 lat", 10000 zł, 500 zł dopłata, IKE.
Oczekiwany rzędu wielkości: 180 000 – 250 000 zł (IWDA wzrósł ok. 3x+ w tym okresie).

---

## Notatki końcowe

**Nie ruszaj** podczas implementacji:
- `js/shared.js` — nawigacja i dark mode
- `js/kalkulator-etf.js` — logika obecnego kalkulatora
- `css/tailwind-input.css` — chyba że dodajesz nową klasę custom

**Dark mode:** działa automatycznie przez klasy `dark:*` Tailwind — testuj oba tryby.

**Kolejność implementacji jest ważna:** Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8 → Task 9 → Task 10. Każdy task można commitować osobno.
