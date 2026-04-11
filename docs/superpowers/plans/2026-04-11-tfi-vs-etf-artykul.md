# Artykuł #5: Fundusze TFI vs ETF — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wdrożyć artykuł `blog/fundusze-tfi-vs-etf-co-wybrac-2026.html` i zaktualizować blog/index.html, index.html, sitemap.xml.

**Architecture:** Nowy plik HTML artykułu wzorowany na `blog/pit-38-etf-jak-rozliczyc-2026.html`. Bez dedykowanej miniatury — hero używa gradientu CSS. Brak sekcji FAQ (spec nie przewiduje). 6 sekcji H2, Schema.org Article + BreadcrumbList.

**Tech Stack:** HTML, Tailwind CSS (lokalny build), Vanilla JS (reading progress + TOC highlight)

**Stan wyjściowy:**
- blog/index.html: "20 artykułów", featured = strategia-dca
- index.html: Artykuł 1 = strategia-dca
- sitemap.xml: ostatni wpis = strategia-dca (2026-04-11)

---

## Task 1: Utwórz plik artykułu

**Pliki:**
- Create: `blog/fundusze-tfi-vs-etf-co-wybrac-2026.html`

- [ ] **Krok 1: Utwórz plik HTML artykułu**

Zapisz poniższy kod jako `blog/fundusze-tfi-vs-etf-co-wybrac-2026.html`:

```html
<!DOCTYPE html>
<html lang="pl" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#f8f7f2" id="meta-theme-color">
  <script>
    (function () {
      const s = localStorage.getItem("etf-tryb");
      const d = s === "ciemny" || (!s && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", d);
      document.documentElement.classList.toggle("light", !d);
    })();
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Fundusze TFI vs ETF 2026 — które naprawdę zarabiają? | ETFkalkulator.pl</title>
  <meta name="description" content="Porównanie kosztów, wyników i podatków: TFI 2–3%/rok vs ETF 0,07–0,20%. Sprawdź kalkulator i policz ile tracisz na prowizjach.">
  <meta name="robots" content="index, follow">
  <meta name="author" content="ETFkalkulator.pl">
  <link rel="canonical" href="https://etfkalkulator.pl/blog/fundusze-tfi-vs-etf-co-wybrac-2026.html">

  <meta property="og:title" content="Fundusze TFI vs ETF 2026 — które naprawdę zarabiają? | ETFkalkulator.pl">
  <meta property="og:description" content="Porównanie kosztów, wyników i podatków: TFI 2–3%/rok vs ETF 0,07–0,20%. Sprawdź kalkulator i policz ile tracisz na prowizjach.">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://etfkalkulator.pl/blog/fundusze-tfi-vs-etf-co-wybrac-2026.html">
  <meta property="og:site_name" content="ETFkalkulator.pl">
  <meta property="og:image" content="https://etfkalkulator.pl/images/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="pl_PL">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Fundusze TFI vs ETF 2026 — które naprawdę zarabiają?">
  <meta name="twitter:description" content="TFI 2–3%/rok vs ETF 0,07–0,20% — policz ile tracisz na opłatach przez 20 lat.">
  <meta name="twitter:image" content="https://etfkalkulator.pl/images/og-image.png">

  <!-- Schema.org BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Strona główna","item":"https://etfkalkulator.pl/"},
      {"@type":"ListItem","position":2,"name":"Blog","item":"https://etfkalkulator.pl/blog/"},
      {"@type":"ListItem","position":3,"name":"Fundusze TFI vs ETF 2026","item":"https://etfkalkulator.pl/blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"}
    ]
  }
  </script>

  <!-- Schema.org Article -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Fundusze TFI vs ETF 2026 — które naprawdę zarabiają?",
    "description": "Porównanie kosztów, wyników i podatków: TFI 2–3%/rok vs ETF 0,07–0,20%. Sprawdź kalkulator i policz ile tracisz na prowizjach.",
    "author": {"@type":"Organization","name":"ETFkalkulator.pl"},
    "publisher": {"@type":"Organization","name":"ETFkalkulator.pl","url":"https://etfkalkulator.pl"},
    "datePublished": "2026-04-11",
    "dateModified": "2026-04-11",
    "url": "https://etfkalkulator.pl/blog/fundusze-tfi-vs-etf-co-wybrac-2026.html",
    "inLanguage": "pl"
  }
  </script>

  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('consent', 'default', {'analytics_storage': 'denied'});
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GZECMECQ15"></script>
  <script>gtag('config', 'G-GZECMECQ15', {'send_page_view': false});</script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://groot.mailerlite.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/tailwind.css">
  <link rel="icon" href="../images/favicon.png">
  <link rel="apple-touch-icon" href="../images/favicon.png">
  <link rel="manifest" href="/manifest.json">

  <style>
    .glass-effect { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
    .dark .glass-effect { background: rgba(15,23,42,0.7); }
    body { font-family: 'Inter', sans-serif; }
    .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-size: 24px; line-height: 1; -webkit-font-smoothing: antialiased; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    article p { line-height: 1.8; }
    article h2 { scroll-margin-top: 5rem; }
    article h3 { scroll-margin-top: 5rem; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    article h2 { animation: fadeInUp 0.4s ease both; }
    details summary { user-select: none; }
    details[open] summary .expand-icon { transform: rotate(180deg); }
    .expand-icon { transition: transform 0.25s ease; }
    .sidebar-toc a.toc-active {
      color: #0d7ff2 !important;
      font-weight: 600;
      background: rgba(13, 127, 242, 0.1);
    }
  </style>
  <link rel="preload" as="style" href="../css/mailerlite.css">
  <link href="../css/mailerlite.css" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="../css/mailerlite.css"></noscript>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-primary">Przejdź do głównej treści</a>

  <div id="reading-progress"
    class="fixed top-0 left-0 h-[3px] z-[200] transition-none rounded-r-full"
    style="width:0%;background-color:#0d7ff2;">
  </div>

  <!-- NAV -->
  <div id="nav-root"></div>
  <script defer src="../js/nav.js"></script>

  <!-- HERO -->
  <section class="relative pt-32 pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden text-white"
    style="background: linear-gradient(135deg, #0f172a 0%, #1a3a5c 45%, #0d4f99 100%);">
    <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 20% 80%, #0d7ff2 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1e40af 0%, transparent 50%);"></div>
    <div class="relative z-10 max-w-3xl mx-auto">
      <nav class="mb-6" aria-label="breadcrumb">
        <ol class="flex items-center gap-2 text-sm text-white/60 flex-wrap">
          <li><a href="../index.html" class="hover:text-white transition-colors" style="text-decoration:none;">ETFkalkulator.pl</a></li>
          <li><span aria-hidden="true" class="material-symbols-outlined text-[14px]">chevron_right</span></li>
          <li><a href="index.html" class="hover:text-white transition-colors" style="text-decoration:none;">Blog</a></li>
          <li><span aria-hidden="true" class="material-symbols-outlined text-[14px]">chevron_right</span></li>
          <li class="text-white font-semibold">TFI vs ETF 2026</li>
        </ol>
      </nav>
      <h1 class="text-2xl md:text-4xl font-black text-white leading-tight mb-4">Fundusze TFI vs ETF 2026 — które naprawdę zarabiają?</h1>
      <p class="text-white/85 text-base md:text-lg leading-relaxed mb-4">Banki sprzedają fundusze TFI jako wygodną i bezpieczną inwestycję. Ale za tą wygodą kryją się opłaty 1,5–3% rocznie, które przez 20 lat potrafią pochłonąć połowę Twoich zysków. Sprawdź twarde liczby i zdecyduj sam.</p>
      <div class="flex flex-wrap gap-4 mt-4 text-white/60 text-sm">
        <span class="flex items-center gap-1.5"><span aria-hidden="true" class="material-symbols-outlined text-[16px]">calendar_today</span> kwiecień 2026</span>
        <span class="flex items-center gap-1.5"><span aria-hidden="true" class="material-symbols-outlined text-[16px]">schedule</span> 10 minut czytania</span>
        <span class="flex items-center gap-1.5"><span aria-hidden="true" class="material-symbols-outlined text-[16px]">person</span> ETFkalkulator.pl</span>
      </div>
    </div>
  </section>

  <!-- MAIN -->
  <main class="bg-white dark:bg-slate-950 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-10 xl:gap-16 items-start">

      <article id="main" class="min-w-0 pt-8 pb-16 lg:pb-20">

        <!-- TOC (mobile/inline) -->
        <div class="glass-effect rounded-[1.5rem] p-6 mb-10 border-l-4 border-primary bg-primary/5 dark:bg-primary/10">
          <p class="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><span aria-hidden="true" class="material-symbols-outlined text-[18px]">format_list_bulleted</span> Spis treści</p>
          <ol class="space-y-2 text-sm list-decimal list-inside">
            <li><a href="#czym-sa-tfi" class="text-primary hover:underline font-medium" style="text-decoration:none;">Czym są fundusze TFI — w pigułce</a></li>
            <li><a href="#koszty" class="text-primary hover:underline font-medium" style="text-decoration:none;">Koszty: gdzie znikają Twoje pieniądze</a></li>
            <li><a href="#wyniki-spiva" class="text-primary hover:underline font-medium" style="text-decoration:none;">Wyniki: ile aktywnych funduszy bije benchmark</a></li>
            <li><a href="#podatek-belki" class="text-primary hover:underline font-medium" style="text-decoration:none;">Podatek Belki — różnica w rozliczeniu</a></li>
            <li><a href="#kiedy-tfi" class="text-primary hover:underline font-medium" style="text-decoration:none;">Kiedy TFI może mieć sens</a></li>
            <li><a href="#jak-przejsc" class="text-primary hover:underline font-medium" style="text-decoration:none;">Jak przejść z TFI na ETF — krok po kroku</a></li>
          </ol>
        </div>

        <!-- SECTION 1 -->
        <h2 id="czym-sa-tfi" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">1</span>
          Czym są fundusze TFI — w pigułce
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg"><strong class="text-slate-900 dark:text-white">TFI</strong> (Towarzystwo Funduszy Inwestycyjnych) to firma, która zbiera pieniądze od wielu inwestorów i zarządza nimi aktywnie — zatrudniając analityków, którzy wybierają akcje i obligacje z zamiarem pobicia rynkowego benchmarku.</p>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-base md:text-lg">Fundusze TFI kupujesz w banku, przez doradcę finansowego lub online. Dostajesz <strong class="text-slate-900 dark:text-white">jednostki uczestnictwa</strong> wyceniane raz dziennie przez fundusz (nie na giełdzie). ETF z kolei to fundusz pasywny — śledzi indeks (np. MSCI World lub S&P 500), jest notowany na giełdzie i kupujesz go przez rachunek maklerski jak akcje.</p>

        <div class="overflow-x-auto rounded-2xl shadow-sm mb-8">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-primary text-white">
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Cecha</th>
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Fundusz TFI</th>
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">ETF</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Styl zarządzania</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Aktywny (zarządzający wybiera)</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Pasywny (śledzi indeks)</td>
              </tr>
              <tr class="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Gdzie kupić</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Bank, doradca finansowy, platforma</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Rachunek maklerski (XTB, mBank, DM BOŚ)</td>
              </tr>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Wycena</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Raz dziennie</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Ciągła, na giełdzie</td>
              </tr>
              <tr class="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Opłata roczna</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">1,5–3,0%</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">0,07–0,20%</td>
              </tr>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Czy bije rynek?</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Próbuje — ale rzadko (patrz sekcja 3)</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Nie próbuje — daje stopę rynku</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECTION 2 -->
        <h2 id="koszty" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">2</span>
          Koszty: gdzie znikają Twoje pieniądze
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg">Największa różnica między TFI a ETF to <strong class="text-slate-900 dark:text-white">opłaty — i to one, nie wyniki zarządzającego, decydują o końcowym zysku</strong>. Opłata za zarządzanie jest pobierana codziennie z wartości funduszu, więc jej efekt jest niewidoczny — ale druzgocący w długim terminie.</p>

        <div class="overflow-x-auto rounded-2xl shadow-sm mb-8">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-primary text-white">
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Rodzaj opłaty</th>
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Fundusz TFI</th>
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">ETF (np. IWDA)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Opłata za zarządzanie (TER)</td>
                <td class="px-4 py-3 text-rose-600 dark:text-rose-400 font-bold">1,5–3,0% / rok</td>
                <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">0,07–0,20% / rok</td>
              </tr>
              <tr class="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Opłata dystrybucyjna</td>
                <td class="px-4 py-3 text-rose-600 dark:text-rose-400">0–4% jednorazowo</td>
                <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400">0%</td>
              </tr>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Prowizja maklerska</td>
                <td class="px-4 py-3 text-slate-500 dark:text-slate-400">brak</td>
                <td class="px-4 py-3 text-slate-500 dark:text-slate-400">ok. 0% – 0,29% (XTB: 0%)</td>
              </tr>
              <tr class="bg-slate-50/50 dark:bg-slate-900/30">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Łączny koszt roczny</td>
                <td class="px-4 py-3 text-rose-600 dark:text-rose-400 font-black">~2–3% / rok</td>
                <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-black">~0,10–0,20% / rok</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="text-lg font-black text-slate-900 dark:text-white mb-4">Przykład: 10 000 zł przez 20 lat</h3>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">Przyjmijmy, że rynek daje 8% brutto rocznie. Różnica polega tylko na opłatach:</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div class="glass-effect rounded-2xl p-6 border-2 border-rose-200 dark:border-rose-900 shadow-sm">
            <p class="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">Fundusz TFI (opłata 2,5%)</p>
            <p class="font-black text-slate-900 dark:text-white text-3xl mb-1">29 178 zł</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Efektywna stopa: 5,5% / rok<br>Zysk: 19 178 zł</p>
          </div>
          <div class="glass-effect rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-900 shadow-sm">
            <p class="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">ETF IWDA (opłata 0,20%)</p>
            <p class="font-black text-slate-900 dark:text-white text-3xl mb-1">44 862 zł</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Efektywna stopa: 7,8% / rok<br>Zysk: 34 862 zł</p>
          </div>
        </div>

        <div class="rounded-2xl p-5 bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 mb-8">
          <p class="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2">💸 Koszt opłat TFI przez 20 lat</p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Różnica wynosi <strong>15 684 zł</strong> — to pieniądze, które zostają w kieszeni zarządzającego, nie Twojej. A to tylko przy jednorazowej wpłacie 10 000 zł. Przy regularnych wpłatach 500 zł/mies. różnica po 20 latach przekracza <strong>100 000 zł</strong>.</p>
        </div>

        <!-- SECTION 3 -->
        <h2 id="wyniki-spiva" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">3</span>
          Wyniki: ile aktywnych funduszy bije benchmark (SPIVA)
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg">Być może myślisz: „opłaty są wyższe, ale przynajmniej fundusz pobija rynek". Niestety, dane mówią coś innego. <strong class="text-slate-900 dark:text-white">SPIVA</strong> (S&P Indices Versus Active) to największe systematyczne badanie porównujące wyniki aktywnych funduszy z ich benchmarkami.</p>

        <div class="rounded-2xl p-5 bg-primary/5 dark:bg-primary/10 border-l-4 border-primary mb-6">
          <p class="text-xs font-black uppercase tracking-wider text-primary mb-2">📊 SPIVA Europe Scorecard (2024)</p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">% aktywnych funduszy akcji europejskich, które <strong>przegrały</strong> ze swoim benchmarkiem:</p>
        </div>

        <div class="overflow-x-auto rounded-2xl shadow-sm mb-8">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-primary text-white">
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Horyzont inwestycyjny</th>
                <th class="px-4 py-3 text-center font-bold text-xs uppercase tracking-wider">% funduszy przegrywających z benchmarkiem</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">1 rok</td>
                <td class="px-4 py-3 text-center text-amber-600 dark:text-amber-400 font-bold">~55%</td>
              </tr>
              <tr class="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">3 lata</td>
                <td class="px-4 py-3 text-center text-orange-600 dark:text-orange-400 font-bold">~65%</td>
              </tr>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">5 lat</td>
                <td class="px-4 py-3 text-center text-rose-600 dark:text-rose-400 font-bold">~73%</td>
              </tr>
              <tr class="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">10 lat</td>
                <td class="px-4 py-3 text-center text-rose-700 dark:text-rose-300 font-black">~84%</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">15 lat</td>
                <td class="px-4 py-3 text-center text-rose-800 dark:text-rose-200 font-black text-base">~90%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">Innymi słowy: przy 15-letnim horyzoncie <strong class="text-slate-900 dark:text-white">9 na 10 aktywnych funduszy daje wyniki gorsze niż pasywny indeks</strong>. A to przed uwzględnieniem podatku od zysków — który pogarsza wynik funduszy TFI jeszcze bardziej (patrz sekcja 4).</p>

        <div class="rounded-2xl p-5 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 mb-8">
          <p class="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">⚠️ Pułapka "dobrego funduszu z przeszłości"</p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Fundusze, które biły rynek w jednym 5-leciu, rzadko powtarzają ten wynik w kolejnym. SPIVA pokazuje, że wyniki historyczne funduszy aktywnych słabo przewidują przyszłość — a opłaty zawsze są pewne.</p>
        </div>

        <!-- SECTION 4 -->
        <h2 id="podatek-belki" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">4</span>
          Podatek Belki — różnica w rozliczeniu
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg">Oba produkty podlegają podatkowi Belki (19% od zysku), ale mechanizm rozliczenia jest inny — i to wpływa na efektywność podatkową.</p>

        <div class="overflow-x-auto rounded-2xl shadow-sm mb-8">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-primary text-white">
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Aspekt podatkowy</th>
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Fundusz TFI</th>
                <th class="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">ETF</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Kto rozlicza podatek</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Fundusz automatycznie przy wykupie</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Ty sam — przez PIT-38 do 30 IV</td>
              </tr>
              <tr class="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">PIT-8C</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Brak — fundusz jest płatnikiem</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Wystawiany przez brokera do 28 II</td>
              </tr>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Konwersja fundusz→fundusz</td>
                <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400">Nie jest zdarzeniem podatkowym!</td>
                <td class="px-4 py-3 text-slate-500 dark:text-slate-400">N/D</td>
              </tr>
              <tr class="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">IKE / IKZE</td>
                <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400">0% podatku przy spełnieniu warunków</td>
                <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400">0% podatku przy spełnieniu warunków</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Kompensata strat</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400">Możliwa — przez PIT-38</td>
                <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400">Możliwa — przez PIT-38 (łącznie z akcjami)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-2xl p-5 bg-primary/5 dark:bg-primary/10 border-l-4 border-primary mb-8">
          <p class="text-xs font-black uppercase tracking-wider text-primary mb-2">🔑 Korzyść konwersji w TFI</p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Jedną realną zaletą funduszy TFI jest możliwość <strong>zamiany jednostek między funduszami tej samej rodziny bez podatku</strong> (np. z funduszu akcji na fundusz obligacji). Przy ETF sprzedaż to zdarzenie podatkowe. Dla IKE/IKZE różnica ta zanika — tam ETF i TFI są tak samo efektywne podatkowo.</p>
        </div>

        <!-- SECTION 5 -->
        <h2 id="kiedy-tfi" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">5</span>
          Kiedy TFI może mieć sens
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-base md:text-lg">Wyższe opłaty i gorsze wyniki nie oznaczają, że TFI jest zawsze złym wyborem. Są trzy sytuacje, w których fundusze TFI mogą się opłacać:</p>

        <div class="space-y-4 mb-8">
          <div class="glass-effect rounded-2xl p-5 border border-white/50 dark:border-slate-800/50 shadow-sm flex gap-4">
            <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <span aria-hidden="true" class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[20px]">savings</span>
            </div>
            <div>
              <p class="font-black text-slate-900 dark:text-white mb-1">PPK — Pracowniczy Plan Kapitałowy</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Pracodawca dopłaca <strong>1,5% Twojego wynagrodzenia brutto</strong> + Skarb Państwa daje 240 zł/rok (plus 250 zł powitalnego). To darmowe pieniądze — nawet przy opłatach TFI rzędu 0,5% (PPK są tańsze niż zwykłe fundusze) ta dopłata w pełni rekompensuje koszty. PPK zdecydowanie warto.</p>
            </div>
          </div>
          <div class="glass-effect rounded-2xl p-5 border border-white/50 dark:border-slate-800/50 shadow-sm flex gap-4">
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <span aria-hidden="true" class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">business_center</span>
            </div>
            <div>
              <p class="font-black text-slate-900 dark:text-white mb-1">PPE — Pracowniczy Program Emerytalny</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Pracodawca sam wpłaca składkę (zwykle 3,5% wynagrodzenia) do funduszu. Pracownik nic nie płaci — to czyste benefity. Nawet nieoptymalne fundusze TFI w PPE są lepsze niż brak PPE.</p>
            </div>
          </div>
          <div class="glass-effect rounded-2xl p-5 border border-white/50 dark:border-slate-800/50 shadow-sm flex gap-4">
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <span aria-hidden="true" class="material-symbols-outlined text-slate-500 text-[20px]">person_off</span>
            </div>
            <div>
              <p class="font-black text-slate-900 dark:text-white mb-1">Brak chęci lub możliwości otwarcia rachunku maklerskiego</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Dla osób, które absolutnie nie chcą zajmować się rachunkiem maklerskim, fundusz TFI jest lepszy niż trzymanie pieniędzy na koncie oszczędnościowym. Jednak otwarcie konta maklerskiego w XTB zajmuje dziś 15 minut online — warto rozważyć.</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl p-5 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 mb-8">
          <p class="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">⚠️ Czego unikać bezwzględnie</p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Fundusze TFI sprzedawane przez bankowych doradców z opłatą dystrybucyjną 3–4% na wejściu <strong>i</strong> opłatą za zarządzanie 2,5%/rok. To podwójny koszt, który niszczy rentowność. Jeśli ktoś poleca Ci fundusz pobierając od Ciebie opłatę — zapytaj ile z tego jest jego prowizją.</p>
        </div>

        <!-- SECTION 6 -->
        <h2 id="jak-przejsc" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">6</span>
          Jak przejść z TFI na ETF — krok po kroku
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-base md:text-lg">Masz już fundusze TFI i chcesz przejść na ETF? Oto konkretne kroki. Uwaga: przy wykupie funduszu płacisz podatek Belki od zysku — warto to zaplanować.</p>

        <div class="space-y-3 mb-8">
          <div class="flex gap-4 p-4 glass-effect rounded-xl border border-white/50 dark:border-slate-800/50">
            <div class="w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shrink-0" style="background-color:#0d7ff2;">1</div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm mb-1">Sprawdź wartość i zysk/stratę</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">Zaloguj się do portalu funduszu/banku. Sprawdź aktualną wartość jednostek i koszt nabycia. Jeśli jesteś na stracie — wykup teraz może pomóc w kompensacie z innymi zyskami w PIT-38.</p>
            </div>
          </div>
          <div class="flex gap-4 p-4 glass-effect rounded-xl border border-white/50 dark:border-slate-800/50">
            <div class="w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shrink-0" style="background-color:#0d7ff2;">2</div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm mb-1">Złóż zlecenie umorzenia jednostek</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">W portalu funduszu wybierz „umorzenie" lub „wykup" wszystkich jednostek. Fundusz wyceni je na najbliższy dzień wyceny (T+1 lub T+3).</p>
            </div>
          </div>
          <div class="flex gap-4 p-4 glass-effect rounded-xl border border-white/50 dark:border-slate-800/50">
            <div class="w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shrink-0" style="background-color:#0d7ff2;">3</div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm mb-1">Poczekaj na przelew (3–7 dni roboczych)</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">Środki trafią na Twoje konto bankowe. Fundusz potrąca podatek Belki automatycznie — dostaniesz kwotę netto.</p>
            </div>
          </div>
          <div class="flex gap-4 p-4 glass-effect rounded-xl border border-white/50 dark:border-slate-800/50">
            <div class="w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shrink-0" style="background-color:#0d7ff2;">4</div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm mb-1">Otwórz rachunek maklerski — najlepiej IKE</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">Rekomendowane: XTB (zerowa prowizja do 100 000 EUR/mies.), mBank lub DM BOŚ. Jeśli nie masz IKE — otwórz IKE maklerskie (limit 2026: 28 260 zł). Na IKE zyski z ETF po spełnieniu warunków są wolne od podatku Belki.</p>
            </div>
          </div>
          <div class="flex gap-4 p-4 glass-effect rounded-xl border border-white/50 dark:border-slate-800/50">
            <div class="w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shrink-0" style="background-color:#0d7ff2;">5</div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm mb-1">Kup ETF i ustaw regularne zlecenia</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">Popularne wybory dla polskiego inwestora: <strong>IWDA</strong> (iShares Core MSCI World, TER 0,20%) lub <strong>CSPX</strong> (iShares Core S&P 500, TER 0,07%). Ustaw stałe zlecenie miesięczne (DCA) — kupisz automatycznie bez emocji.</p>
            </div>
          </div>
          <div class="flex gap-4 p-4 glass-effect rounded-xl border border-white/50 dark:border-slate-800/50">
            <div class="w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shrink-0" style="background-color:#0d7ff2;">6</div>
            <div>
              <p class="font-bold text-slate-900 dark:text-white text-sm mb-1">W lutym następnego roku — sprawdź PIT-8C</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">Fundusz TFI <em>nie</em> wystawia PIT-8C (sam pobiera podatek). Broker wystawia PIT-8C za transakcje ETF — złóż PIT-38 do 30 IV.</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl p-5 bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 mb-8">
          <p class="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">✅ Policz, ile zyskasz na zmianie</p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Użyj <a href="../pages/kalkulator-etf.html" class="text-primary font-bold hover:underline" style="text-decoration:none;">Kalkulatora ETF</a> żeby zobaczyć różnicę między efektywnymi stopami zwrotu przy różnych poziomach opłat. Wpisz kwotę, horyzont i porównaj 2,5% vs 0,20% opłaty rocznej — efekt jest natychmiastowo widoczny.</p>
        </div>

        <!-- Powiązane artykuły CTA -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <a href="jak-zaczac-inwestowac-w-etf.html" class="glass-effect rounded-2xl p-4 border border-white/50 dark:border-slate-800/50 hover:border-primary/30 transition-all group" style="text-decoration:none;">
            <p class="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">ETF · Podstawy</p>
            <p class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Jak zacząć inwestować w ETF? Przewodnik dla początkujących</p>
          </a>
          <a href="podatek-belki-etf-jak-rozliczyc.html" class="glass-effect rounded-2xl p-4 border border-white/50 dark:border-slate-800/50 hover:border-primary/30 transition-all group" style="text-decoration:none;">
            <p class="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Podatek Belki</p>
            <p class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Podatek Belki od ETF — kompletny przewodnik 2026</p>
          </a>
        </div>

        <!-- Disclaimer -->
        <div class="glass-effect rounded-2xl p-5 mt-10 border border-slate-200 dark:border-slate-700 flex items-start gap-4">
          <span aria-hidden="true" class="material-symbols-outlined text-slate-400 shrink-0 mt-0.5">info</span>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
            <strong class="not-italic">Ważna informacja (Disclaimer):</strong> Materiały na stronie mają charakter wyłącznie edukacyjny i poglądowy. Nie stanowią rekomendacji inwestycyjnej ani porady finansowej. Dane SPIVA pochodzą z raportów S&P Global (Europe Scorecard). Opłaty funduszy TFI są przykładowe — sprawdź aktualne prospekty przed podjęciem decyzji. Dane aktualne na kwiecień 2026.
          </p>
        </div>

      </article>

      <!-- SIDEBAR -->
      <aside class="hidden lg:block">
        <div class="sticky top-24 space-y-6">

          <!-- TOC -->
          <div class="glass-effect rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-xl p-5">
            <p class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span aria-hidden="true" class="material-symbols-outlined text-[18px]">format_list_bulleted</span>
              W tym artykule
            </p>
            <nav class="sidebar-toc space-y-1">
              <a href="#czym-sa-tfi" class="block text-sm py-1 px-3 rounded-lg transition-all duration-200 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5">Czym są fundusze TFI</a>
              <a href="#koszty" class="block text-sm py-1 px-3 rounded-lg transition-all duration-200 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5">Koszty — gdzie znikają pieniądze</a>
              <a href="#wyniki-spiva" class="block text-sm py-1 px-3 rounded-lg transition-all duration-200 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5">Wyniki SPIVA</a>
              <a href="#podatek-belki" class="block text-sm py-1 px-3 rounded-lg transition-all duration-200 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5">Podatek Belki</a>
              <a href="#kiedy-tfi" class="block text-sm py-1 px-3 rounded-lg transition-all duration-200 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5">Kiedy TFI ma sens</a>
              <a href="#jak-przejsc" class="block text-sm py-1 px-3 rounded-lg transition-all duration-200 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5">Jak przejść na ETF</a>
            </nav>
          </div>

          <!-- CTA -->
          <div class="bg-gradient-to-br from-blue-700 to-primary rounded-2xl p-5 text-white text-center shadow-xl">
            <span aria-hidden="true" class="material-symbols-outlined text-3xl mb-2 opacity-80">show_chart</span>
            <h3 class="font-black text-white text-base mb-1">Kalkulator ETF</h3>
            <p class="text-white/75 text-xs leading-relaxed mb-4">Policz ile zyskasz zmieniając opłatę z 2,5% na 0,2% rocznie.</p>
            <a href="../pages/kalkulator-etf.html"
              class="bg-white rounded-xl px-4 py-2.5 text-xs font-black hover:scale-[1.02] transition-all inline-flex items-center gap-1.5 shadow-lg"
              style="color:#0d7ff2;text-decoration:none;">
              Otwórz kalkulator
              <span aria-hidden="true" class="material-symbols-outlined text-[15px]">arrow_forward</span>
            </a>
          </div>

          <!-- Related articles -->
          <div class="glass-effect rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-xl p-5">
            <p class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span aria-hidden="true" class="material-symbols-outlined text-[18px]">auto_stories</span>
              Czytaj też
            </p>
            <div class="space-y-3">
              <a href="jak-zaczac-inwestowac-w-etf.html" class="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer" style="text-decoration:none;">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 mt-0.5 bg-blue-100 text-blue-700">ETF</span>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight group-hover:text-primary transition-colors">Jak zacząć inwestować w ETF?</span>
              </a>
              <a href="podatek-belki-etf-jak-rozliczyc.html" class="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer" style="text-decoration:none;">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 mt-0.5 bg-blue-100 text-blue-700">Podatki</span>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight group-hover:text-primary transition-colors">Podatek Belki od ETF — przewodnik</span>
              </a>
              <a href="gdzie-otworzyc-ike-2026-porownanie-brokerow.html" class="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer" style="text-decoration:none;">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 mt-0.5 bg-blue-100 text-blue-700">IKE</span>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight group-hover:text-primary transition-colors">Gdzie otworzyć IKE w 2026?</span>
              </a>
            </div>
          </div>

        </div>
      </aside>

    </div>
  </main>

  <!-- Mobile bottom bar -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div id="reading-progress-mobile" class="h-full bg-primary rounded-full transition-none" style="width:0%;background-color:#0d7ff2;"></div>
      </div>
      <span id="reading-pct" class="text-xs font-bold text-slate-400">0%</span>
    </div>
    <a href="../pages/kalkulator-etf.html"
      class="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 hover:opacity-90"
      style="background-color:#0d7ff2;text-decoration:none;">
      <span aria-hidden="true" class="material-symbols-outlined text-[14px]">show_chart</span>
      Kalkulator ETF
    </a>
  </div>

  <!-- NEWSLETTER -->
  <section id="newsletter-section" class="pt-10 pb-20 px-6 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 transition-colors">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-2xl border border-white/50 dark:border-slate-800/50 relative overflow-hidden group">
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <div class="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>
              Newsletter
            </div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">Bądź na bieżąco z <span class="text-primary">rynkiem ETF</span> i finansami</h2>
            <p class="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xl">Nowe artykuły i aktualizacje kalkulatorów prosto na email. Zero spamu.</p>
          </div>
          <div class="w-full lg:max-w-md mx-auto lg:ml-auto">
            <div id="mlb2-37996059" class="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-37996059">
              <div class="ml-form-embedWrapper embedForm">
                <div class="ml-form-embedBody ml-form-embedBodyDefault row-form">
                  <form class="ml-block-form" action="https://dashboard.mailerlite.com/jsonp/2161270/forms/181031509662107628/subscribe" method="post" target="_blank">
                    <div class="flex flex-col space-y-4">
                      <div class="ml-form-fieldRow">
                        <input aria-label="email" aria-required="true" type="email" class="w-full h-14 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-base font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400" name="fields[email]" placeholder="Twój adres e-mail">
                      </div>
                      <div class="ml-form-embedPermissions">
                        <label class="flex items-start gap-4 cursor-pointer">
                          <input type="checkbox" name="gdpr[]" value="Zgadzam się na otrzymywanie newslettera ETFkalkulator.pl" required class="custom-checkbox mt-1 transition-all">
                          <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Zgadzam się na otrzymywanie newslettera. Możesz się wypisać w każdej chwili.</span>
                        </label>
                      </div>
                      <div class="ml-form-recaptcha ml-validate-required py-2 flex justify-center">
                        <div class="g-recaptcha transform scale-[0.85] origin-center" data-sitekey="6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD"></div>
                      </div>
                      <input type="hidden" name="ml-submit" value="1">
                      <input type="hidden" name="anticsrf" value="true">
                      <button type="submit" class="w-full h-14 md:h-16 rounded-2xl bg-primary text-white font-bold text-sm md:text-base uppercase tracking-widest hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-primary/20" style="background-color:#0d7ff2;">Zapisz się teraz</button>
                      <div class="pt-6 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <p class="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">Zapisując się, akceptujesz <a href="../pages/regulamin.html" class="underline hover:text-primary">Regulamin</a> i <a href="../pages/polityka-prywatnosci.html" class="underline hover:text-primary">Politykę Prywatności</a>.</p>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="ml-form-successBody row-success" style="display:none">
                  <div class="p-10 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-center">
                    <span aria-hidden="true" class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-4xl mb-4 block">verified</span>
                    <h4 class="text-emerald-900 dark:text-emerald-300 font-bold text-xl mb-1">Sukces!</h4>
                    <p class="text-emerald-700 dark:text-emerald-500 text-sm">Sprawdź skrzynkę e-mail, aby potwierdzić zapis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-12 border-b border-slate-200/50 dark:border-slate-800/50 pb-8">
        <div class="flex items-center gap-2">
          <div class="bg-primary p-1.5 rounded-lg text-white" style="background-color:#0d7ff2;"><span aria-hidden="true" class="material-symbols-outlined text-base">account_balance_wallet</span></div>
          <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ETF<span class="font-normal text-slate-500">kalkulator</span>.pl</span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        <div>
          <h5 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Narzędzia</h5>
          <ul class="space-y-4">
            <li><a href="../pages/kalkulator-etf.html" class="text-sm text-slate-500 hover:text-primary transition-colors" style="text-decoration:none;">Kalkulator ETF</a></li>
            <li><a href="../pages/kalkulator-obligacji.html" class="text-sm text-slate-500 hover:text-primary transition-colors" style="text-decoration:none;">Obligacje Skarbowe</a></li>
            <li><a href="../pages/kalkulator-wolnosci.html" class="text-sm text-slate-500 hover:text-primary transition-colors" style="text-decoration:none;">Wolność Finansowa</a></li>
            <li><a href="../pages/porownywarka.html" class="text-sm text-slate-500 hover:text-primary transition-colors" style="text-decoration:none;">Porównywarka ETF</a></li>
          </ul>
        </div>
        <div>
          <h5 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Projekt</h5>
          <ul class="space-y-4">
            <li><a href="index.html" class="text-sm text-slate-500 hover:text-primary transition-colors" style="text-decoration:none;">Blog i Wiedza</a></li>
            <li><a href="../pages/o-projekcie.html" class="text-sm text-slate-500 hover:text-primary transition-colors" style="text-decoration:none;">O projekcie</a></li>
            <li><a href="../pages/regulamin.html" class="text-sm text-slate-500 hover:text-primary transition-colors" style="text-decoration:none;">Regulamin</a></li>
            <li><a href="../pages/polityka-prywatnosci.html" class="text-sm text-slate-500 hover:text-primary transition-colors" style="text-decoration:none;">Polityka prywatności</a></li>
          </ul>
        </div>
        <div>
          <h5 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Kontakt</h5>
          <p class="text-sm text-slate-500 mb-6">Masz pytania? Pisz śmiało:</p>
          <a href="mailto:kontakt@etfkalkulator.pl" class="text-sm font-bold text-slate-900 dark:text-white hover:text-primary transition-colors" style="text-decoration:none;">kontakt@etfkalkulator.pl</a>
        </div>
      </div>
      <div class="mt-20 pt-10 border-t border-slate-200 dark:border-slate-900">
        <p class="text-[11px] text-slate-400 leading-relaxed mb-8 max-w-4xl">Serwis ETFkalkulator.pl ma charakter wyłącznie edukacyjny i informacyjny. Prezentowane obliczenia nie stanowią rekomendacji inwestycyjnej, porady finansowej ani doradztwa podatkowego.</p>
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 ETFkalkulator.pl — Made with ❤️ by Florian</p>
          <span>Wszelkie prawa zastrzeżone</span>
        </div>
      </div>
    </div>
  </footer>

  <script src="../js/utils.js"></script>
  <script src="../js/shared.js"></script>
  <script src="https://www.google.com/recaptcha/api.js" defer></script>
  <script>
    function ml_webform_success_37996059() {
      var $ = ml_jQuery || jQuery;
      $('.ml-subscribe-form-37996059 .row-success').show();
      $('.ml-subscribe-form-37996059 .row-form').hide();
    }
  </script>
  <script src="https://groot.mailerlite.com/js/w/webforms.min.js?v95037e5bac78f29ed026832ca21a7c7b" type="text/javascript"></script>
  <script>
    (function() {
      const s = localStorage.getItem('etf-tryb');
      const d = s === 'ciemny' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', d);
      document.documentElement.classList.toggle('light', !d);
    })();
    function przelaczTryb() {
      const html = document.documentElement;
      const isDark = html.classList.contains('dark') || html.classList.contains('dark-mode');
      if (isDark) {
        html.classList.remove('dark','dark-mode'); html.classList.add('light');
        localStorage.setItem('etf-tryb','jasny');
      } else {
        html.classList.add('dark'); html.classList.remove('light','light-mode');
        localStorage.setItem('etf-tryb','ciemny');
      }
    }

    const bar = document.getElementById('reading-progress');
    const article = document.getElementById('main');
    const mobileBar = document.getElementById('reading-progress-mobile');
    const pctLabel = document.getElementById('reading-pct');

    function updateProgress() {
      if (!bar || !article) return;
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, (scrolled / total) * 100);
      bar.style.width = pct + '%';
      if (mobileBar) mobileBar.style.width = pct + '%';
      if (pctLabel) pctLabel.textContent = Math.round(pct) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    const headings = document.querySelectorAll('article h2[id]');
    const tocLinks = document.querySelectorAll('.sidebar-toc a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(a => a.classList.remove('toc-active'));
          const active = document.querySelector('.sidebar-toc a[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('toc-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    headings.forEach(h => observer.observe(h));
  </script>
  <!-- Cookie Consent -->
  <script src="../js/cookie-consent.js" defer></script>
</body>
</html>
```

- [ ] **Krok 2: Weryfikacja pliku**

Sprawdź, że plik istnieje i ma poprawny rozmiar:
```bash
ls -la "blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"
```
Oczekiwane: plik istnieje, rozmiar > 20 KB

---

## Task 2: Zaktualizuj blog/index.html

**Pliki:**
- Modify: `blog/index.html` (licznik, featured, grid)

**Stan wyjściowy:**
- Licznik: `20 artykułów`
- Featured: `strategia-dca-regularne-inwestowanie-etf.html`
- Pierwszy element gridu: `edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html`

- [ ] **Krok 1: Zaktualizuj licznik artykułów (20 → 21)**

Znajdź i zamień:
```
20 artykułów
```
Na:
```
21 artykułów
```

- [ ] **Krok 2: Przesuń DCA z featured do gridu**

Obecny featured (do usunięcia/zamiany):
```html
        <!-- FEATURED ARTICLE -->
        <a href="strategia-dca-regularne-inwestowanie-etf.html" data-categories="etf" class="article-card block mb-10 group cursor-pointer" style="text-decoration: none">
          <div class="glass-effect rounded-[2rem] border border-white/50 dark:border-stitch-border/50 shadow-2xl overflow-hidden hover:scale-[1.005] transition-all duration-300">
            <div class="bg-cover bg-center p-6 md:p-10 text-white relative overflow-hidden flex flex-col justify-end min-h-[360px]" style="background-image: url('../images/strategia-dca-etf-2026.webp'); background-size: cover;">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-transparent"></div>
              <div class="relative z-10">
                <span class="bg-primary/90 text-white shadow-sm border border-white/10 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 inline-block">📈 Nowy · ETF</span>
                <h2 class="text-2xl md:text-3xl font-black leading-tight mb-3 text-white">Strategia DCA — jak regularnie inwestować w ETF?</h2>
                <p class="text-white/80 text-sm md:text-base leading-relaxed max-w-3xl">Dollar Cost Averaging po polsku: przykład 500 zł/mies. przez 20 lat, porównanie z Lump Sum i jak ustawić auto-zlecenia w XTB. Najsimplejsza droga do wolności finansowej.</p>
              </div>
            </div>
            <div class="bg-stitch-surface px-6 md:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex flex-wrap gap-4 text-sm text-stitch-muted font-medium">
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">calendar_today</span> Kwiecień 2026</span>
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">schedule</span> 9 minut czytania</span>
              </div>
              <span class="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shrink-0">Czytaj artykuł<span aria-hidden="true" class="material-symbols-outlined text-[18px]">arrow_forward</span></span>
            </div>
          </div>
        </a>
```

Zastąp nowym featured dla TFI vs ETF:
```html
        <!-- FEATURED ARTICLE -->
        <a href="fundusze-tfi-vs-etf-co-wybrac-2026.html" data-categories="etf" class="article-card block mb-10 group cursor-pointer" style="text-decoration: none">
          <div class="glass-effect rounded-[2rem] border border-white/50 dark:border-stitch-border/50 shadow-2xl overflow-hidden hover:scale-[1.005] transition-all duration-300">
            <div class="bg-cover bg-center p-6 md:p-10 text-white relative overflow-hidden flex flex-col justify-end min-h-[360px]" style="background: linear-gradient(135deg, #0f172a 0%, #1a3a5c 45%, #0d4f99 100%);">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>
              <div class="relative z-10">
                <span class="bg-primary/90 text-white shadow-sm border border-white/10 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 inline-block">💸 Nowy · ETF vs TFI</span>
                <h2 class="text-2xl md:text-3xl font-black leading-tight mb-3 text-white">Fundusze TFI vs ETF 2026 — które naprawdę zarabiają?</h2>
                <p class="text-white/80 text-sm md:text-base leading-relaxed max-w-3xl">TFI 2–3%/rok vs ETF 0,07–0,20%. Przez 20 lat różnica na 10 000 zł wynosi ponad 15 000 zł. Dane SPIVA: 90% aktywnych funduszy przegrywa z benchmarkiem po 15 latach.</p>
              </div>
            </div>
            <div class="bg-stitch-surface px-6 md:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex flex-wrap gap-4 text-sm text-stitch-muted font-medium">
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">calendar_today</span> Kwiecień 2026</span>
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">schedule</span> 10 minut czytania</span>
              </div>
              <span class="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shrink-0">Czytaj artykuł<span aria-hidden="true" class="material-symbols-outlined text-[18px]">arrow_forward</span></span>
            </div>
          </div>
        </a>
```

- [ ] **Krok 3: Dodaj DCA jako pierwszą kartę w gridzie**

Znajdź otwarcie gridu:
```html
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" id="articles-grid">
          <!-- Article Card -->
          <a href="edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html"
```

Wstaw nową kartę DCA PRZED istniejącą kartą EDO:
```html
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" id="articles-grid">
          <!-- Article Card -->
          <a href="strategia-dca-regularne-inwestowanie-etf.html" data-categories="etf" class="article-card flex flex-col overflow-hidden rounded-[1.5rem] bg-stitch-surface border border-white/50 dark:border-stitch-border/50 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.01] group" style="text-decoration: none">
            <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style="background-image: url('../images/strategia-dca-etf-2026.webp');"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="flex flex-1 flex-col p-6">
              <div class="flex items-center gap-3 mb-3">
                <span class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">Strategia · ETF</span>
                <span class="text-[11px] text-slate-400 font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">schedule</span> 9 minut</span>
              </div>
              <h3 class="text-base font-black leading-snug text-stitch-text group-hover:text-primary transition-colors mb-2">Strategia DCA — jak regularnie inwestować w ETF?</h3>
              <p class="text-sm leading-relaxed text-stitch-muted mb-4">Dollar Cost Averaging po polsku: 500 zł/mies. przez 20 lat, DCA vs Lump Sum i jak ustawić auto-zlecenia w XTB.</p>
              <div class="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-stitch-border">
                <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">Czytaj artykuł <span aria-hidden="true" class="material-symbols-outlined text-[14px]">arrow_forward</span></span>
              </div>
            </div>
          </a>
          <!-- Article Card -->
          <a href="edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html"
```

---

## Task 3: Zaktualizuj index.html (strona główna)

**Pliki:**
- Modify: `index.html` (sekcja "Najnowsze artykuły" — zamień Artykuł 1)

**Stan wyjściowy — Artykuł 1 (do zamiany):**
```html
          <!-- Artykuł 1 -->
          <article
            class="group flex flex-col overflow-hidden rounded-stitch bg-stitch-surface border border-stitch-border transition-all duration-300 hover:-translate-y-1 hover:shadow-stitch-soft">
            <div class="relative aspect-[16/10] overflow-hidden">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style='background-image: url("images/strategia-dca-etf-2026.webp"); background-size: cover;'>
              </div>
            </div>
            <div class="flex flex-1 flex-col p-8">
              <div class="flex items-center gap-3 mb-4">
                <span
                  class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary"
                  style="background-color:rgba(13, 127, 242, 0.1); color:#0d7ff2;">ETF · Strategia</span>
                <span class="text-[12px] text-slate-400 font-medium">11 kwietnia 2026</span>
              </div>
              <h3 class="text-xl font-bold leading-snug text-stitch-text group-hover:text-primary transition-colors"
                style="margin:0 0 12px 0;">Strategia DCA — jak regularnie inwestować w ETF?</h3>
              <p class="text-sm leading-relaxed text-stitch-muted">Dollar Cost Averaging po polsku: 500 zł/mies. przez 20 lat, DCA vs Lump Sum i jak ustawić auto-zlecenia w XTB.</p>
              <div class="mt-auto pt-8 flex items-center justify-between border-t border-slate-100">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">9 min czytania</span>
                <a href="blog/strategia-dca-regularne-inwestowanie-etf.html"
                  class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform"
                  style="color:#0d7ff2; text-decoration:none;">arrow_forward</a>
              </div>
            </div>
          </article>
```

- [ ] **Krok 1: Zastąp Artykuł 1 kartą TFI vs ETF**

Zamień powyższy blok na:
```html
          <!-- Artykuł 1 -->
          <article
            class="group flex flex-col overflow-hidden rounded-stitch bg-stitch-surface border border-stitch-border transition-all duration-300 hover:-translate-y-1 hover:shadow-stitch-soft">
            <div class="relative aspect-[16/10] overflow-hidden">
              <div class="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                style='background: linear-gradient(135deg, #0f172a 0%, #1a3a5c 45%, #0d4f99 100%);'>
              </div>
            </div>
            <div class="flex flex-1 flex-col p-8">
              <div class="flex items-center gap-3 mb-4">
                <span
                  class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary"
                  style="background-color:rgba(13, 127, 242, 0.1); color:#0d7ff2;">ETF · Porównanie</span>
                <span class="text-[12px] text-slate-400 font-medium">11 kwietnia 2026</span>
              </div>
              <h3 class="text-xl font-bold leading-snug text-stitch-text group-hover:text-primary transition-colors"
                style="margin:0 0 12px 0;">Fundusze TFI vs ETF 2026 — które naprawdę zarabiają?</h3>
              <p class="text-sm leading-relaxed text-stitch-muted">TFI 2–3%/rok vs ETF 0,07–0,20%. Przez 20 lat różnica to ponad 15 000 zł. Dane SPIVA i jak przejść z TFI na ETF.</p>
              <div class="mt-auto pt-8 flex items-center justify-between border-t border-slate-100">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">10 min czytania</span>
                <a href="blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"
                  class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform"
                  style="color:#0d7ff2; text-decoration:none;">arrow_forward</a>
              </div>
            </div>
          </article>
```

---

## Task 4: Zaktualizuj sitemap.xml

**Pliki:**
- Modify: `sitemap.xml` (dodaj nowy URL na końcu)

- [ ] **Krok 1: Dodaj wpis TFI vs ETF**

Znajdź w sitemap.xml:
```xml
  <url>
    <loc>https://etfkalkulator.pl/blog/strategia-dca-regularne-inwestowanie-etf.html</loc>
    <lastmod>2026-04-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

Zastąp:
```xml
  <url>
    <loc>https://etfkalkulator.pl/blog/strategia-dca-regularne-inwestowanie-etf.html</loc>
    <lastmod>2026-04-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://etfkalkulator.pl/blog/fundusze-tfi-vs-etf-co-wybrac-2026.html</loc>
    <lastmod>2026-04-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## Task 5: Weryfikacja końcowa

- [ ] **Krok 1: Sprawdź wymagane elementy w pliku artykułu**

```bash
grep -c "reading-progress" "blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"
```
Oczekiwane: 2 (desktop bar + mobile bar)

```bash
grep -c "reading-progress-mobile" "blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"
```
Oczekiwane: 2

```bash
grep -c "sidebar-toc" "blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"
```
Oczekiwane: 1

```bash
grep -c "newsletter-section" "blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"
```
Oczekiwane: 1

- [ ] **Krok 2: Sprawdź aktualizacje w plikach integracyjnych**

```bash
grep "fundusze-tfi" "blog/index.html" | wc -l
```
Oczekiwane: co najmniej 2 (featured + możliwy grid)

```bash
grep "fundusze-tfi" "index.html" | wc -l
```
Oczekiwane: co najmniej 1

```bash
grep "fundusze-tfi" "sitemap.xml" | wc -l
```
Oczekiwane: 1

```bash
grep "21 artykułów" "blog/index.html"
```
Oczekiwane: linia z licznikiem

- [ ] **Krok 3: Sprawdź strukturę HTML**

```bash
grep -c "<main" "blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"
```
Oczekiwane: 1

```bash
grep -c "<article" "blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"
```
Oczekiwane: 1 (element article#main)

```bash
grep -c "<aside" "blog/fundusze-tfi-vs-etf-co-wybrac-2026.html"
```
Oczekiwane: 1

---

## Checklist po wdrożeniu

- [ ] `blog/fundusze-tfi-vs-etf-co-wybrac-2026.html` — plik istnieje
- [ ] `blog/index.html` — licznik 21, featured = TFI vs ETF, DCA w gridzie
- [ ] `index.html` — Artykuł 1 = TFI vs ETF
- [ ] `sitemap.xml` — nowy URL dodany
- [ ] Brak miniatury — hero używa gradientu (planowane: dodać `.webp` w przyszłości)
