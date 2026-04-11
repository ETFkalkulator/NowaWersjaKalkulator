# Artykuł #3 — EDO, COI, TOS, ROS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wdrożyć artykuł porównujący wszystkie typy obligacji skarbowych (EDO, COI, TOS, ROS, ROD) z konkretnymi liczbami i decision tree, wzmacniając klaster obligacji w SEO.

**Architecture:** Jeden plik HTML `blog/edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html` wzorowany na `blog/etf-spada-co-robic-korekta-gieldowa.html`. Po wdrożeniu — aktualizacja 3 plików towarzyszących (blog/index.html, index.html, sitemap.xml).

**Tech Stack:** HTML5, Tailwind CSS (lokalny build `css/tailwind.css`), Vanilla JS (nav.js, progress bar, TOC IntersectionObserver), Schema.org (Article + BreadcrumbList + FAQPage)

---

## Pliki

| Akcja | Plik |
|-------|------|
| Utwórz | `blog/edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html` |
| Modyfikuj | `blog/index.html` |
| Modyfikuj | `index.html` |
| Modyfikuj | `sitemap.xml` |
| Wzorzec (tylko czytaj) | `blog/etf-spada-co-robic-korekta-gieldowa.html` |

---

## Task 1: Utwórz główny plik artykułu — HEAD i Schema.org

**Files:**
- Create: `blog/edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html`

- [ ] **Krok 1: Utwórz plik z sekcją HEAD**

Skopiuj strukturę HEAD z `blog/etf-spada-co-robic-korekta-gieldowa.html` i dostosuj do artykułu #3. Plik zaczyna się od:

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
  <title>EDO, COI, TOS, ROS — które obligacje wybrać 2026? | ETFkalkulator.pl</title>
  <meta name="description" content="Porównanie wszystkich rodzajów obligacji skarbowych 2026. EDO vs COI vs TOS vs ROS — tabela, liczby, kalkulator zysku netto.">
  <meta name="robots" content="index, follow">
  <meta name="author" content="ETFkalkulator.pl">
  <link rel="canonical" href="https://etfkalkulator.pl/blog/edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html">

  <meta property="og:title" content="EDO, COI, TOS, ROS — które obligacje wybrać 2026? | ETFkalkulator.pl">
  <meta property="og:description" content="Porównanie wszystkich rodzajów obligacji skarbowych 2026. EDO vs COI vs TOS vs ROS — tabela, liczby, kalkulator zysku netto.">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://etfkalkulator.pl/blog/edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html">
  <meta property="og:site_name" content="ETFkalkulator.pl">
  <meta property="og:image" content="https://etfkalkulator.pl/images/obligacje-typy-porownanie-2026.webp">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="pl_PL">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="EDO, COI, TOS, ROS — które obligacje wybrać 2026?">
  <meta name="twitter:description" content="Porównanie wszystkich rodzajów obligacji skarbowych 2026. EDO vs COI vs TOS vs ROS — tabela, liczby, kalkulator zysku netto.">
  <meta name="twitter:image" content="https://etfkalkulator.pl/images/obligacje-typy-porownanie-2026.webp">

  <!-- Schema.org BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Strona główna","item":"https://etfkalkulator.pl/"},
      {"@type":"ListItem","position":2,"name":"Blog","item":"https://etfkalkulator.pl/blog/"},
      {"@type":"ListItem","position":3,"name":"EDO, COI, TOS, ROS — które obligacje wybrać 2026?","item":"https://etfkalkulator.pl/blog/edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html"}
    ]
  }
  </script>

  <!-- Schema.org Article -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "EDO, COI, TOS, ROS — które obligacje wybrać 2026?",
    "description": "Porównanie wszystkich rodzajów obligacji skarbowych 2026. EDO vs COI vs TOS vs ROS — tabela, liczby, kalkulator zysku netto.",
    "author": {"@type":"Organization","name":"ETFkalkulator.pl"},
    "publisher": {"@type":"Organization","name":"ETFkalkulator.pl","url":"https://etfkalkulator.pl"},
    "datePublished": "2026-04-11",
    "dateModified": "2026-04-11",
    "url": "https://etfkalkulator.pl/blog/edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html",
    "inLanguage": "pl"
  }
  </script>

  <!-- Schema.org FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Które obligacje skarbowe są najlepsze w 2026?",
        "acceptedAnswer": {"@type":"Answer","text":"To zależy od horyzontu inwestycyjnego. Na krótki termin (do roku) — ROR (3-mies., 4,00%). Na 3 lata — TOS (4,40%, stałe). Na 4 lata z ochroną przed inflacją — COI (4,75% + inflacja+1,5%). Na 10 lat — EDO (5,35% rok 1, potem inflacja+2%). Jeśli masz dzieci i 800+ — ROD (5,60%). Na IKE-Obligacje (PKO BP) najlepsze są EDO lub ROS — brak podatku Belki po 60/65 roku życia."}
      },
      {
        "@type": "Question",
        "name": "Jaka jest różnica między EDO a COI?",
        "acceptedAnswer": {"@type":"Answer","text":"EDO to 10-letnie obligacje indeksowane inflacją: 5,35% w roku 1, potem inflacja+2% przez lata 2–10. COI to 4-letnie obligacje: 4,75% w roku 1, potem inflacja+1,5% przez lata 2–4. EDO daje lepszą ochronę przed inflacją długoterminowo i wyższy naddatek (2% vs 1,5%), ale wymaga cierpliwości — wcześniejszy wykup kosztuje 3 zł/szt."}
      },
      {
        "@type": "Question",
        "name": "Czy obligacje skarbowe są bezpieczne?",
        "acceptedAnswer": {"@type":"Answer","text":"Tak — obligacje detaliczne Skarbu Państwa są gwarantowane przez Państwo Polskie. Historycznie żaden kraj zachodni z własną walutą nie zbankrutował na obligacjach detalicznych. Ryzyko nominalne jest praktycznie zerowe. Jedyne ryzyko to inflacja wyższa niż prognozowana (przy TOS/ROR, które mają stałe oprocentowanie) oraz płynność — wcześniejszy wykup kosztuje 3 zł/szt."}
      },
      {
        "@type": "Question",
        "name": "Ile można zarobić na 10 000 zł w obligacjach skarbowych?",
        "acceptedAnswer": {"@type":"Answer","text":"Przy 10 000 zł i założeniu inflacji 3%: TOS (3 lata) — ok. 1 371 zł netto. COI (4 lata) — ok. 2 340 zł netto. ROS (6 lat) — ok. 3 840 zł netto. EDO (10 lat) — ok. 7 830 zł netto. Wyniki dla EDO/COI/ROS zależą od przyszłej inflacji — wyższy CPI = wyższy zysk. Kalkulator na etfkalkulator.pl policzy dokładnie."}
      },
      {
        "@type": "Question",
        "name": "Co to jest IKE-Obligacje i kiedy warto?",
        "acceptedAnswer": {"@type":"Answer","text":"IKE-Obligacje to rachunek w PKO BP (lub Pekao) pozwalający kupować obligacje detaliczne bez podatku Belki po spełnieniu warunków IKE (wypłata po 60/65 roku życia). Podatek Belki od obligacji wynosi 19% od naliczonych odsetek. Na EDO przez 10 lat przy 10 000 zł różnica to ok. 1 900 zł. Ograniczenie: przez IKE-Obligacje dostępne są tylko wybrane serie i tylko przez oddział PKO BP lub Pekao — brak dostępu online do pełnej oferty."}
      },
      {
        "@type": "Question",
        "name": "Kiedy opłaca się wcześniej wykupić obligacje?",
        "acceptedAnswer": {"@type":"Answer","text":"Prawie nigdy, o ile nie potrzebujesz pilnie gotówki. Wcześniejszy wykup kosztuje 3 zł za każdą obligację (1 obligacja = 100 zł). Przy 100 obligacjach (10 000 zł) — kara to 300 zł, czyli 3% kapitału. Dodatkowo tracisz odsetki za bieżący okres. Jeśli wiesz, że możesz potrzebować środków wcześniej — wybierz ROR (3-miesięczne) lub TOS (3-letnie) zamiast EDO."}
      }
    ]
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
```

---

## Task 2: BODY — nawigacja, progress bar, hero

- [ ] **Krok 1: Dodaj opening body, progress bar, nav i hero**

Bezpośrednio po zamknięciu `</head>` dodaj:

```html
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
    style="background-image: url('../images/obligacje-typy-porownanie-2026.webp'); background-size: cover; background-position: center;">
    <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.70) 55%, rgba(15,23,42,0.93) 100%);"></div>
    <div class="relative z-10 max-w-3xl mx-auto">
      <nav class="mb-6" aria-label="breadcrumb">
        <ol class="flex items-center gap-2 text-sm text-white/60 flex-wrap">
          <li><a href="../index.html" class="hover:text-white transition-colors" style="text-decoration:none;">ETFkalkulator.pl</a></li>
          <li><span aria-hidden="true" class="material-symbols-outlined text-[14px]">chevron_right</span></li>
          <li><a href="index.html" class="hover:text-white transition-colors" style="text-decoration:none;">Blog</a></li>
          <li><span aria-hidden="true" class="material-symbols-outlined text-[14px]">chevron_right</span></li>
          <li class="text-white font-semibold">EDO, COI, TOS, ROS — które obligacje wybrać</li>
        </ol>
      </nav>
      <h1 class="text-2xl md:text-4xl font-black text-white leading-tight mb-4">EDO, COI, TOS, ROS — które obligacje skarbowe wybrać w 2026?</h1>
      <p class="text-white/85 text-base md:text-lg leading-relaxed mb-4">ROR, TOS, COI, ROS, EDO, ROD — sześć serii obligacji skarbowych, każda z innym horyzontem i oprocentowaniem. Który instrument pasuje do Twojego celu? Porównanie z liczbami i decision tree.</p>
      <div class="flex flex-wrap gap-4 mt-4 text-white/60 text-sm">
        <span class="flex items-center gap-1.5"><span aria-hidden="true" class="material-symbols-outlined text-[16px]">calendar_today</span> kwiecień 2026</span>
        <span class="flex items-center gap-1.5"><span aria-hidden="true" class="material-symbols-outlined text-[16px]">schedule</span> 10 minut czytania</span>
        <span class="flex items-center gap-1.5"><span aria-hidden="true" class="material-symbols-outlined text-[16px]">person</span> ETFkalkulator.pl</span>
      </div>
    </div>
  </section>
```

---

## Task 3: MAIN — otwierająca siatka, TOC inline i sekcja 1 (przegląd z tabelą)

- [ ] **Krok 1: Dodaj main grid, TOC inline i sekcję 1**

```html
  <!-- MAIN -->
  <main class="bg-white dark:bg-slate-950 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-10 xl:gap-16 items-start">

      <article id="main" class="min-w-0 pt-8 pb-16 lg:pb-20">

        <!-- TOC (mobile/inline) -->
        <div class="glass-effect rounded-[1.5rem] p-6 mb-10 border-l-4 border-primary bg-primary/5 dark:bg-primary/10">
          <p class="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><span aria-hidden="true" class="material-symbols-outlined text-[18px]">format_list_bulleted</span> Spis treści</p>
          <ol class="space-y-2 text-sm list-decimal list-inside">
            <li><a href="#przeglad" class="text-primary hover:underline font-medium" style="text-decoration:none;">Rodzaje obligacji skarbowych — przegląd</a></li>
            <li><a href="#edo" class="text-primary hover:underline font-medium" style="text-decoration:none;">EDO — najlepsza ochrona przed inflacją</a></li>
            <li><a href="#coi" class="text-primary hover:underline font-medium" style="text-decoration:none;">COI — kompromis 4-letni</a></li>
            <li><a href="#tos" class="text-primary hover:underline font-medium" style="text-decoration:none;">TOS — stałe oprocentowanie bez niespodzianek</a></li>
            <li><a href="#ros-rod" class="text-primary hover:underline font-medium" style="text-decoration:none;">ROS i ROD — kiedy warto</a></li>
            <li><a href="#decision-tree" class="text-primary hover:underline font-medium" style="text-decoration:none;">Decision tree: które obligacje dla Ciebie</a></li>
            <li><a href="#ike-obligacje" class="text-primary hover:underline font-medium" style="text-decoration:none;">IKE-Obligacje PKO BP — kiedy warto połączyć</a></li>
            <li><a href="#faq" class="text-primary hover:underline font-medium" style="text-decoration:none;">FAQ — najczęstsze pytania</a></li>
          </ol>
        </div>

        <!-- SECTION 1 — przegląd -->
        <h2 id="przeglad" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">1</span>
          Rodzaje obligacji skarbowych — przegląd (kwiecień 2026)
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg">Ministerstwo Finansów oferuje sześć serii obligacji detalicznych. Różnią się horyzontem, oprocentowaniem i sposobem indeksacji. Oto tabela porównawcza — wszystkie dane z kwietnia 2026:</p>

        <div class="overflow-x-auto mb-8">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <th class="text-left p-3 font-bold border border-slate-200 dark:border-slate-700">Seria</th>
                <th class="text-left p-3 font-bold border border-slate-200 dark:border-slate-700">Horyzont</th>
                <th class="text-left p-3 font-bold border border-slate-200 dark:border-slate-700">Rok 1</th>
                <th class="text-left p-3 font-bold border border-slate-200 dark:border-slate-700">Lata następne</th>
                <th class="text-left p-3 font-bold border border-slate-200 dark:border-slate-700">Dla kogo</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white dark:bg-slate-900">
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-bold text-primary" style="color:#0d7ff2;">ROR</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">3 miesiące</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-semibold">4,00%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">—</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">Krótki termin, park gotówki</td>
              </tr>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-bold text-primary" style="color:#0d7ff2;">TOS</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">3 lata</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-semibold">4,40%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">4,40% (stałe)</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">Pewność, bez inflacyjnego ryzyka</td>
              </tr>
              <tr class="bg-white dark:bg-slate-900">
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-bold text-primary" style="color:#0d7ff2;">COI</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">4 lata</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-semibold">4,75%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">CPI + 1,50%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">Ochrona przed inflacją, 4 lata</td>
              </tr>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-bold text-primary" style="color:#0d7ff2;">ROS</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">6 lat</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-semibold">5,00%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">CPI + 1,75%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">Śred. termin, lepsza marża</td>
              </tr>
              <tr class="bg-white dark:bg-slate-900">
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-bold text-emerald-600">EDO</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">10 lat</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-semibold">5,35%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">CPI + 2,00%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">Długi termin, max ochrona przed inflacją</td>
              </tr>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-bold text-violet-600">ROD</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">12 lat</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700 font-semibold">5,60%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">CPI + 2,50%</td>
                <td class="p-3 border border-slate-200 dark:border-slate-700">Beneficjenci 800+ (limit 100 szt./mies.)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-2xl p-5 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 mb-8">
          <p class="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">ℹ️ Ważne: wcześniejszy wykup</p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Każda seria (poza ROR) umożliwia wcześniejszy wykup, ale kosztuje to <strong>3 zł za obligację</strong> (1 obligacja = 100 zł). Przy 100 obligacjach (10 000 zł) opłata wynosi 300 zł — 3% kapitału. Planuj horyzont z głową.</p>
        </div>
```

---

## Task 4: Sekcje 2–4 (EDO, COI, TOS)

- [ ] **Krok 1: Dodaj sekcje EDO, COI i TOS z przykładami liczbowymi**

Założenie do wszystkich przykładów: inflacja 3% (cel NBP), 10 000 zł, podatek Belki 19%.

```html
        <!-- SECTION 2 — EDO -->
        <h2 id="edo" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-black flex items-center justify-center shrink-0">2</span>
          EDO — najlepsza ochrona przed inflacją długoterminowo
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg">EDO (10-letnie oszczędnościowe) to flagowy produkt Ministerstwa Finansów dla długoterminowych oszczędności. Rok 1: <strong class="text-slate-900 dark:text-white">5,35%</strong>. Lata 2–10: inflacja CPI + 2% marży rocznie.</p>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">Kluczowa zaleta: <strong>marża 2%</strong> ponad inflację jest gwarantowana przez cały okres. Jeśli inflacja wyniesie 5%, zarobisz 7%. Jeśli 1% — zarobisz 3%. Zawsze realnie powyżej inflacji.</p>

        <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">Przykład: 10 000 zł przez 10 lat (inflacja 3%)</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-emerald-600 mb-1">5,35%</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Rok 1 (stałe)</p>
          </div>
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-emerald-600 mb-1">~7 830 zł</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Zysk netto po 10 latach*</p>
          </div>
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-emerald-600 mb-1">+2%</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Marża ponad inflację (gwarantowana)</p>
          </div>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 mb-6">*Szacunek przy założeniu CPI = 3% przez cały okres, podatek Belki 19% naliczany od odsetek każdego roku.</p>

        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4"><strong class="text-slate-900 dark:text-white">Kiedy wybrać EDO:</strong> masz horyzont 10+ lat, priorytetem jest ochrona siły nabywczej, inwestujesz w ramach IKE-Obligacje (brak podatku Belki po spełnieniu warunków).</p>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4"><strong class="text-slate-900 dark:text-white">Kiedy EDO nie jest idealne:</strong> potrzebujesz dostępu do pieniędzy przed 10. rokiem — opłata 3 zł/szt. za wcześniejszy wykup.</p>

        <!-- SECTION 3 — COI -->
        <h2 id="coi" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">3</span>
          COI — kompromis 4-letni z indeksacją
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg">COI (4-letnie indeksowane) daje inflacyjną ochronę przy krótszym horyzoncie: <strong class="text-slate-900 dark:text-white">4,75%</strong> w roku 1, a następnie CPI + 1,5% przez lata 2–4.</p>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">Marża 1,5% vs 2% przy EDO to różnica ~0,5% rocznie — przez 4 lata małe kwoty. Jednak COI to cykl 4-letni: po wykupie możesz reinwestować w nowych warunkach, co daje elastyczność.</p>

        <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">Przykład: 10 000 zł przez 4 lata (inflacja 3%)</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-primary mb-1" style="color:#0d7ff2;">4,75%</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Rok 1 (stałe)</p>
          </div>
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-primary mb-1" style="color:#0d7ff2;">~2 340 zł</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Zysk netto po 4 latach*</p>
          </div>
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-primary mb-1" style="color:#0d7ff2;">+1,5%</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Marża ponad inflację</p>
          </div>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 mb-6">*Szacunek przy CPI = 3%, podatek Belki 19%.</p>

        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4"><strong class="text-slate-900 dark:text-white">Kiedy wybrać COI:</strong> horyzont 4–8 lat, chcesz ochrony przed inflacją, ale 10-letnie EDO to za długo. Dobry wybór na środek portfela obligacyjnego.</p>

        <!-- SECTION 4 — TOS -->
        <h2 id="tos" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">4</span>
          TOS — stałe oprocentowanie bez niespodzianek
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg">TOS (3-letnie stałoprocentowe): <strong class="text-slate-900 dark:text-white">4,40% przez całe 3 lata</strong>. Brak indeksacji — wiesz z góry ile zarobisz, bez względu na przyszłą inflację.</p>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">To zaleta i wada jednocześnie. Jeśli inflacja wzrośnie powyżej 4,40% — TOS straci realnie na wartości. Jeśli inflacja spadnie — TOS wygra z COI. Idealne gdy cenisz pewność ponad optymalizację.</p>

        <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">Przykład: 10 000 zł przez 3 lata</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-amber-500 mb-1">4,40%</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Stałe przez 3 lata</p>
          </div>
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-amber-500 mb-1">~1 071 zł</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Zysk netto po 3 latach*</p>
          </div>
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-amber-500 mb-1">gwarantowany</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Wynik pewny z góry</p>
          </div>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 mb-6">*Podatek Belki 19% od odsetek.</p>

        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4"><strong class="text-slate-900 dark:text-white">Kiedy wybrać TOS:</strong> horyzont 3 lata, inflacja w Polsce spada (scenariusz dezinflacyjny), cenisz przewidywalność nad inflacyjny upside.</p>
```

---

## Task 5: Sekcje 5–6 (ROS/ROD i Decision Tree)

- [ ] **Krok 1: Dodaj sekcje ROS/ROD i decision tree**

```html
        <!-- SECTION 5 — ROS i ROD -->
        <h2 id="ros-rod" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">5</span>
          ROS i ROD — kiedy warto
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg"><strong>ROS</strong> (6-letnie rodzinne oszczędnościowe): 5,00% rok 1, potem CPI + 1,75% przez lata 2–6. Dostępne dla każdego — lepszy naddatek niż COI (1,75% vs 1,5%) przy dłuższym horyzoncie.</p>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4"><strong>ROD</strong> (12-letnie dla posiadaczy 800+): <strong class="text-slate-900 dark:text-white">5,60%</strong> rok 1, potem CPI + 2,5% przez lata 2–12. Limit: 100 obligacji (10 000 zł) miesięcznie na dziecko objęte świadczeniem. Najwyższa marża ze wszystkich serii.</p>

        <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">Przykład ROS: 10 000 zł przez 6 lat (inflacja 3%)</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-primary mb-1" style="color:#0d7ff2;">5,00%</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Rok 1 (stałe)</p>
          </div>
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-primary mb-1" style="color:#0d7ff2;">~3 840 zł</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Zysk netto po 6 latach*</p>
          </div>
          <div class="glass-effect rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-3xl font-black text-primary mb-1" style="color:#0d7ff2;">+1,75%</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Marża ponad inflację</p>
          </div>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 mb-6">*Szacunek przy CPI = 3%, podatek Belki 19%.</p>

        <div class="rounded-2xl p-5 bg-violet-50 dark:bg-violet-950/30 border-l-4 border-violet-500 mb-8">
          <p class="text-xs font-black uppercase tracking-wider text-violet-700 dark:text-violet-400 mb-2">💜 ROD — tylko dla uprawnionych</p>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Obligacje ROD mogą kupić wyłącznie beneficjenci programu 800+ (rodzice/opiekunowie dzieci). Marża 2,5% to <strong>najwyższa dostępna</strong> wśród wszystkich serii. Jeśli masz dzieci objęte 800+ i horyzont 10+ lat — ROD bije wszystko.</p>
        </div>

        <!-- SECTION 6 — Decision Tree -->
        <h2 id="decision-tree" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">6</span>
          Decision tree: które obligacje dla Ciebie?
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-base md:text-lg">Odpowiedz na 3 pytania i znajdź swoją serię:</p>

        <div class="space-y-4 mb-8">
          <div class="glass-effect rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <p class="font-bold text-slate-900 dark:text-white mb-3">🕐 Na jak długo inwestujesz?</p>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span class="font-bold text-primary shrink-0" style="color:#0d7ff2;">Do 12 miesięcy</span>
                <span class="text-slate-600 dark:text-slate-300">→ <strong>ROR</strong> (3-miesięczne, 4,00%) — parking gotówki, pełna płynność co kwartał</span>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span class="font-bold text-primary shrink-0" style="color:#0d7ff2;">3 lata</span>
                <span class="text-slate-600 dark:text-slate-300">→ <strong>TOS</strong> (4,40% stałe) — pewny wynik, dobry przy dezinflacji</span>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span class="font-bold text-primary shrink-0" style="color:#0d7ff2;">4 lata</span>
                <span class="text-slate-600 dark:text-slate-300">→ <strong>COI</strong> (4,75% + CPI+1,5%) — ochrona przed inflacją przy umiarkowanym horyzoncie</span>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span class="font-bold text-primary shrink-0" style="color:#0d7ff2;">6 lat</span>
                <span class="text-slate-600 dark:text-slate-300">→ <strong>ROS</strong> (5,00% + CPI+1,75%) — lepszy naddatek niż COI, wciąż bez 10-letniej blokady</span>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                <span class="font-bold text-emerald-600 shrink-0">10 lat</span>
                <span class="text-slate-600 dark:text-slate-300">→ <strong>EDO</strong> (5,35% + CPI+2%) — maksymalna ochrona przed inflacją, idealne na IKE</span>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30">
                <span class="font-bold text-violet-600 shrink-0">12 lat + 800+</span>
                <span class="text-slate-600 dark:text-slate-300">→ <strong>ROD</strong> (5,60% + CPI+2,5%) — najwyższa marża, tylko dla uprawnionych</span>
              </div>
            </div>
          </div>

          <div class="glass-effect rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <p class="font-bold text-slate-900 dark:text-white mb-3">📊 Czy inflacja Ci straszy?</p>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span class="font-bold text-slate-500 shrink-0">Tak, inflacja to mój wróg</span>
                <span class="text-slate-600 dark:text-slate-300">→ Wybierz indeksowane: <strong>COI / ROS / EDO / ROD</strong> — wszystkie mają naddatek nad CPI</span>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span class="font-bold text-slate-500 shrink-0">Chcę znać wynik z góry</span>
                <span class="text-slate-600 dark:text-slate-300">→ <strong>TOS</strong> — stałe 4,40%, bez niespodzianek w górę ani w dół</span>
              </div>
            </div>
          </div>

          <div class="glass-effect rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <p class="font-bold text-slate-900 dark:text-white mb-3">🏦 Czy masz IKE-Obligacje w PKO BP?</p>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                <span class="font-bold text-emerald-600 shrink-0">Tak</span>
                <span class="text-slate-600 dark:text-slate-300">→ Priorytet: <strong>EDO lub ROS</strong> na IKE — brak podatku Belki po spełnieniu warunków IKE oznacza ~20–25% więcej zysku netto</span>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span class="font-bold text-slate-500 shrink-0">Nie</span>
                <span class="text-slate-600 dark:text-slate-300">→ Wybierz serię wg horyzontu z drzewa powyżej. Podatek Belki 19% od odsetek zapłacisz automatycznie.</span>
              </div>
            </div>
          </div>
        </div>
```

---

## Task 6: Sekcje 7 (IKE-Obligacje) i FAQ + zamknięcie artykułu

- [ ] **Krok 1: Dodaj sekcję IKE-Obligacje, FAQ i zamknij `<article>`**

```html
        <!-- SECTION 7 — IKE-Obligacje -->
        <h2 id="ike-obligacje" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-black flex items-center justify-center shrink-0">7</span>
          IKE-Obligacje PKO BP — kiedy warto połączyć
        </h2>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-base md:text-lg">IKE-Obligacje to specjalny rachunek w <strong>PKO BP lub Pekao</strong> pozwalający kupować obligacje detaliczne bez podatku Belki — o ile wypłacisz środki po 60. (kobieta) lub 65. (mężczyzna) roku życia.</p>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">Podatek Belki od obligacji to 19% naliczanych odsetek każdego roku. Przy EDO przez 10 lat na 10 000 zł — różnica netto to ok. <strong class="text-slate-900 dark:text-white">1 900 zł</strong>. Przy większych kwotach — jeszcze więcej.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div class="glass-effect rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p class="font-bold text-slate-900 dark:text-white mb-2">✅ Zalety IKE-Obligacje</p>
            <ul class="text-sm text-slate-600 dark:text-slate-300 space-y-1">
              <li>• Brak podatku Belki (19%) od odsetek</li>
              <li>• Te same serie co bez IKE (EDO, ROS, COI, TOS)</li>
              <li>• Limit 2026: 28 260 zł/rok</li>
            </ul>
          </div>
          <div class="glass-effect rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p class="font-bold text-slate-900 dark:text-white mb-2">⚠️ Ograniczenia</p>
            <ul class="text-sm text-slate-600 dark:text-slate-300 space-y-1">
              <li>• Tylko PKO BP lub Pekao (oddział lub agent)</li>
              <li>• Brak pełnej obsługi online (wybrane serie)</li>
              <li>• Przy wcześniejszej wypłacie — podatek Belki od całości</li>
            </ul>
          </div>
        </div>

        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4"><strong class="text-slate-900 dark:text-white">Rekomendacja:</strong> jeśli masz długi horyzont (10+ lat) i masz już IKE maklerskie na ETF — rozważ otwarcie IKE-Obligacje jako drugi koszyk na obligacje EDO/ROS. To dwa oddzielne konta IKE — limit 28 260 zł obowiązuje łącznie w danym roku, ale możesz mieć oba konta równocześnie.</p>

        <div class="my-8 p-6 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 text-center">
          <p class="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Policz zysk z obligacji z dokładnym uwzględnieniem podatku Belki</p>
          <a href="../pages/kalkulator-obligacji.html"
            class="inline-flex items-center gap-2 mt-3 px-6 py-3 rounded-full font-bold text-white text-sm transition-all hover:opacity-90"
            style="background-color:#0d7ff2; text-decoration:none;">
            <span aria-hidden="true" class="material-symbols-outlined text-[18px]">calculate</span>
            Kalkulator obligacji
          </a>
        </div>

        <!-- SECTION 8 — FAQ -->
        <h2 id="faq" class="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-6 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2;">8</span>
          FAQ — najczęstsze pytania
        </h2>

        <div class="space-y-3 mb-10">
          <details class="glass-effect rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <summary class="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 dark:text-white">
              Które obligacje skarbowe są najlepsze w 2026?
              <span aria-hidden="true" class="material-symbols-outlined expand-icon text-slate-400 shrink-0">expand_more</span>
            </summary>
            <div class="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To zależy od horyzontu. Do roku: ROR (4,00%). Na 3 lata: TOS (4,40% stałe). Na 4 lata z ochroną przed inflacją: COI (4,75% + CPI+1,5%). Na 10 lat: EDO (5,35% + CPI+2%). Jeśli masz 800+ i horyzont 12 lat: ROD (5,60% + CPI+2,5%). Na IKE-Obligacje najlepsze są EDO lub ROS.
            </div>
          </details>

          <details class="glass-effect rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <summary class="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 dark:text-white">
              Jaka jest różnica między EDO a COI?
              <span aria-hidden="true" class="material-symbols-outlined expand-icon text-slate-400 shrink-0">expand_more</span>
            </summary>
            <div class="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              EDO to 10-letnie z marżą CPI+2%, COI to 4-letnie z marżą CPI+1,5%. EDO daje lepszą ochronę przed inflacją (wyższy naddatek) i dłuższy horyzont. COI jest elastyczniejsze — po 4 latach możesz reinwestować. Wcześniejszy wykup kosztuje 3 zł/szt. przy obu.
            </div>
          </details>

          <details class="glass-effect rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <summary class="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 dark:text-white">
              Czy obligacje skarbowe są bezpieczne?
              <span aria-hidden="true" class="material-symbols-outlined expand-icon text-slate-400 shrink-0">expand_more</span>
            </summary>
            <div class="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tak — gwarantowane przez Skarb Państwa. Ryzyko nominalne praktycznie zerowe. Jedyne ryzyka to: wyższa od prognozowanej inflacja (przy TOS/ROR) i brak płynności przed terminem (opłata 3 zł/szt. za wcześniejszy wykup).
            </div>
          </details>

          <details class="glass-effect rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <summary class="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 dark:text-white">
              Ile można zarobić na 10 000 zł w obligacjach?
              <span aria-hidden="true" class="material-symbols-outlined expand-icon text-slate-400 shrink-0">expand_more</span>
            </summary>
            <div class="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Przy założeniu inflacji 3%: TOS (3 lata) ≈ 1 071 zł netto. COI (4 lata) ≈ 2 340 zł netto. ROS (6 lat) ≈ 3 840 zł netto. EDO (10 lat) ≈ 7 830 zł netto. Wyniki EDO/COI/ROS zależą od przyszłego CPI — wyższy CPI = wyższy zysk.
            </div>
          </details>

          <details class="glass-effect rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <summary class="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 dark:text-white">
              Co to jest IKE-Obligacje i kiedy warto?
              <span aria-hidden="true" class="material-symbols-outlined expand-icon text-slate-400 shrink-0">expand_more</span>
            </summary>
            <div class="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              IKE-Obligacje (PKO BP / Pekao) pozwala kupować obligacje bez podatku Belki (19%) po spełnieniu warunków IKE. Na EDO 10 lat przy 10 000 zł różnica to ok. 1 900 zł. Ograniczenie: tylko wybrane serie przez oddział, brak pełnego dostępu online. Limit 2026: 28 260 zł/rok.
            </div>
          </details>

          <details class="glass-effect rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <summary class="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 dark:text-white">
              Kiedy opłaca się wcześniej wykupić obligacje?
              <span aria-hidden="true" class="material-symbols-outlined expand-icon text-slate-400 shrink-0">expand_more</span>
            </summary>
            <div class="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Prawie nigdy — opłata 3 zł/szt. to 3% przy 100 obligacjach (10 000 zł). Jeśli możesz potrzebować środków przed terminem — wybierz ROR (3-miesięczne, pełna płynność) lub TOS zamiast EDO.
            </div>
          </details>
        </div>

        <!-- Powiązane artykuły -->
        <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p class="text-xs font-black uppercase tracking-widest text-primary mb-6" style="color:#0d7ff2;">Powiązane artykuły</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="obligacje-edo-poradnik.html" class="glass-effect rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors group" style="text-decoration:none;">
              <p class="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-sm mb-1">EDO 2026 — szczegółowy poradnik</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Jak liczyć zysk, IKE-Obligacje, wcześniejszy wykup</p>
            </a>
            <a href="lokata-czy-obligacje-skarbowe-2026.html" class="glass-effect rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors group" style="text-decoration:none;">
              <p class="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-sm mb-1">Lokata czy obligacje skarbowe 2026?</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Porównanie: kiedy lokata, kiedy obligacje</p>
            </a>
          </div>
        </div>

      </article>
```

---

## Task 7: Sidebar (desktop) i mobile bottom bar

- [ ] **Krok 1: Dodaj sidebar i mobile bottom bar**

```html
      <!-- SIDEBAR -->
      <aside class="hidden lg:block sticky top-24 self-start space-y-6">

        <!-- TOC sidebar -->
        <div class="glass-effect rounded-[1.5rem] p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <p class="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2" style="color:#0d7ff2;"><span aria-hidden="true" class="material-symbols-outlined text-[16px]">format_list_bulleted</span> Spis treści</p>
          <nav class="sidebar-toc space-y-1 text-sm">
            <a href="#przeglad" class="block py-1.5 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all" style="text-decoration:none;">1. Rodzaje obligacji — przegląd</a>
            <a href="#edo" class="block py-1.5 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all" style="text-decoration:none;">2. EDO — ochrona przed inflacją</a>
            <a href="#coi" class="block py-1.5 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all" style="text-decoration:none;">3. COI — kompromis 4-letni</a>
            <a href="#tos" class="block py-1.5 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all" style="text-decoration:none;">4. TOS — stałe oprocentowanie</a>
            <a href="#ros-rod" class="block py-1.5 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all" style="text-decoration:none;">5. ROS i ROD</a>
            <a href="#decision-tree" class="block py-1.5 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all" style="text-decoration:none;">6. Decision tree</a>
            <a href="#ike-obligacje" class="block py-1.5 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all" style="text-decoration:none;">7. IKE-Obligacje PKO BP</a>
            <a href="#faq" class="block py-1.5 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all" style="text-decoration:none;">8. FAQ</a>
          </nav>
        </div>

        <!-- CTA sidebar -->
        <div class="glass-effect rounded-[1.5rem] p-6 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <p class="text-xs font-black uppercase tracking-widest text-primary mb-2" style="color:#0d7ff2;">Kalkulator obligacji</p>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">Policz zysk netto z EDO, COI, TOS — z uwzględnieniem podatku Belki i wcześniejszego wykupu.</p>
          <a href="../pages/kalkulator-obligacji.html"
            class="block w-full py-3 px-4 rounded-full font-bold text-white text-sm text-center transition-all hover:opacity-90"
            style="background-color:#0d7ff2; text-decoration:none;">
            Policz zysk z obligacji
          </a>
        </div>

        <!-- Powiązane sidebar -->
        <div class="glass-effect rounded-[1.5rem] p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <p class="text-xs font-black uppercase tracking-widest text-primary mb-4" style="color:#0d7ff2;">Powiązane</p>
          <div class="space-y-3">
            <a href="obligacje-edo-poradnik.html" class="block text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors" style="text-decoration:none;">→ EDO 2026 — poradnik</a>
            <a href="lokata-czy-obligacje-skarbowe-2026.html" class="block text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors" style="text-decoration:none;">→ Lokata czy obligacje 2026</a>
            <a href="jak-zaczac-inwestowac-w-etf.html" class="block text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors" style="text-decoration:none;">→ Jak zacząć inwestować w ETF</a>
          </div>
        </div>

      </aside>

    </div>
  </main>

  <!-- MOBILE BOTTOM BAR -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
    <div class="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div id="reading-progress-mobile" class="h-full rounded-full transition-none" style="width:0%;background-color:#0d7ff2;"></div>
    </div>
    <span id="reading-pct" class="text-xs text-slate-500 dark:text-slate-400 font-mono w-8 text-right shrink-0">0%</span>
    <a href="../pages/kalkulator-obligacji.html"
      class="shrink-0 px-4 py-2 rounded-full font-bold text-white text-xs"
      style="background-color:#0d7ff2; text-decoration:none;">
      Kalkulator
    </a>
  </div>
```

---

## Task 8: Newsletter, footer i JavaScript

- [ ] **Krok 1: Dodaj newsletter section, footer z cookie, i zamykające skrypty JS**

```html
  <!-- NEWSLETTER -->
  <section id="newsletter-section" class="bg-slate-900 dark:bg-slate-950 py-16 px-4">
    <div class="max-w-2xl mx-auto text-center">
      <p class="text-xs font-black uppercase tracking-widest text-primary mb-4" style="color:#0d7ff2;">Newsletter</p>
      <h2 class="text-2xl md:text-3xl font-black text-white mb-4">Bądź na bieżąco z rynkiem obligacji</h2>
      <p class="text-slate-400 mb-8 leading-relaxed">Nowe stawki, artykuły i narzędzia — prosto na maila. Zero spamu.</p>
      <div class="ml-embedded" data-form="V5dMke"></div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="bg-slate-950 text-slate-400 py-10 px-4">
    <div class="max-w-4xl mx-auto text-center space-y-4">
      <p class="font-black text-white text-lg">ETFkalkulator.pl</p>
      <p class="text-sm">Bezpłatne kalkulatory finansowe dla polskich inwestorów.</p>
      <div class="flex flex-wrap justify-center gap-4 text-sm">
        <a href="../pages/o-projekcie.html" class="hover:text-white transition-colors" style="text-decoration:none;">O projekcie</a>
        <a href="../pages/polityka-prywatnosci.html" class="hover:text-white transition-colors" style="text-decoration:none;">Polityka prywatności</a>
        <a href="../pages/regulamin.html" class="hover:text-white transition-colors" style="text-decoration:none;">Regulamin</a>
      </div>
      <p class="text-xs text-slate-600">© 2026 ETFkalkulator.pl. Treści mają charakter edukacyjny i nie stanowią doradztwa inwestycyjnego.</p>
      <button id="cookie-settings-btn" class="text-xs text-slate-600 hover:text-slate-400 transition-colors mt-2">Ustawienia cookies</button>
    </div>
  </footer>

  <!-- COOKIE CONSENT -->
  <script src="../js/cookie-consent.js"></script>

  <!-- MAILERLITE -->
  <script>
    (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    ml('account', '1171847');
  </script>

  <!-- READING PROGRESS + TOC HIGHLIGHT -->
  <script>
    const bar = document.getElementById('reading-progress');
    const mobileBar = document.getElementById('reading-progress-mobile');
    const pctLabel = document.getElementById('reading-pct');

    function updateProgress() {
      const article = document.getElementById('main');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0;
      if (bar) bar.style.width = pct + '%';
      if (mobileBar) mobileBar.style.width = pct + '%';
      if (pctLabel) pctLabel.textContent = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // TOC highlight
    const headings = document.querySelectorAll('article h2[id]');
    const tocLinks = document.querySelectorAll('.sidebar-toc a');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(link => link.classList.remove('toc-active'));
          const active = document.querySelector(`.sidebar-toc a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('toc-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    headings.forEach(h => observer.observe(h));
  </script>

</body>
</html>
```

---

## Task 9: Aktualizacja blog/index.html

**Files:**
- Modify: `blog/index.html`

- [ ] **Krok 1: Przeczytaj blog/index.html i znajdź sekcję featured + licznik**

Uruchom Read na `blog/index.html`. Zidentyfikuj:
1. Licznik artykułów (np. `17 artykułów` → `18 artykułów`)
2. Bieżący featured artykuł (staje się kartą w siatce)
3. Wzorzec karty w siatce

- [ ] **Krok 2: Zaktualizuj licznik, featured i dodaj kartę w siatce**

Zmień licznik `17 artykułów` → `18 artykułów`.

Nowy featured artykuł (podmień istniejący featured):
```html
<!-- featured: obligacje typy -->
<a href="edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html" ...>
  <img src="../images/obligacje-typy-porownanie-2026.webp" ...>
  <h2>EDO, COI, TOS, ROS — które obligacje skarbowe wybrać w 2026?</h2>
  <p>Porównanie wszystkich rodzajów obligacji skarbowych 2026. Tabela, liczby i decision tree — która seria pasuje do Twojego horyzontu.</p>
  <span>kwiecień 2026</span> · <span>10 min czytania</span>
</a>
```

Stary featured (artykuł #2, `etf-spada-co-robic-korekta-gieldowa.html`) przenosi się do siatki jako pierwsza karta. Użyj wzorca kart z istniejącej siatki.

---

## Task 10: Aktualizacja index.html (strona główna)

**Files:**
- Modify: `index.html`

- [ ] **Krok 1: Przeczytaj index.html, znajdź sekcję "Najnowsze artykuły"**

Uruchom Read na `index.html`. Zidentyfikuj 3 karty artykułów w sekcji "Najnowsze artykuły".

- [ ] **Krok 2: Podmień najstarszą kartę na nowy artykuł**

Podmień najstarszą z 3 kart na artykuł #3. Wzorzec karty (przepisz tytuł, opis, link, czas):

```
Tytuł:  EDO, COI, TOS, ROS — które obligacje wybrać 2026?
Opis:   Porównanie wszystkich serii obligacji skarbowych. Tabela z oprocentowaniem, liczby i decision tree.
Link:   blog/edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html
Czas:   10 min czytania
Data:   kwiecień 2026
```

---

## Task 11: Aktualizacja sitemap.xml

**Files:**
- Modify: `sitemap.xml`

- [ ] **Krok 1: Dodaj URL artykułu do sitemap**

Odczytaj `sitemap.xml`, dodaj wpis przed zamknięciem `</urlset>`:

```xml
<url>
  <loc>https://etfkalkulator.pl/blog/edo-coi-tos-ros-ktore-obligacje-wybrac-2026.html</loc>
  <lastmod>2026-04-11</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## Task 12: Weryfikacja końcowa (checklist ze STANDARD-ARTYKULU.md)

- [ ] **Krok 1: Sprawdź wymagane elementy HTML**

Uruchom Grep na nowym pliku artykułu i zweryfikuj obecność:
- `#reading-progress` — progress bar desktop
- `#reading-progress-mobile` — progress bar mobile
- `.sidebar-toc` — TOC w sidebarze
- `const bar = document.getElementById('reading-progress')` — JS progress
- `href="#newsletter-section"` — link nawigacji "Zapisz się"

- [ ] **Krok 2: Sprawdź strukturę HTML**

Zweryfikuj (Grep):
- 1× `<main>` i `</main>`
- 1× `<article id="main">` i `</article>`
- 1× `<aside>` i `</aside>`

- [ ] **Krok 3: Sprawdź aktualizacje towarzyszące**

Zweryfikuj (Grep), że:
- `blog/index.html` zawiera `edo-coi-tos-ros-ktore-obligacje-wybrac-2026`
- `index.html` zawiera `edo-coi-tos-ros-ktore-obligacje-wybrac-2026`
- `sitemap.xml` zawiera `edo-coi-tos-ros-ktore-obligacje-wybrac-2026`

---

## Self-Review

**Spec coverage:**
- ✅ Title, meta description, canonical — Task 1
- ✅ Schema.org BreadcrumbList + Article + FAQPage (6 pytań) — Task 1
- ✅ GA4 + preconnect/dns-prefetch — Task 1
- ✅ Progress bar desktop + mobile — Task 2 + Task 8
- ✅ Hero z breadcrumb — Task 2
- ✅ TOC inline (mobile) + sidebar TOC — Task 3 + Task 7
- ✅ Sekcja 1: tabela wszystkich serii (kwiecień 2026) — Task 3
- ✅ Sekcja 2: EDO z kartami liczbowymi — Task 4
- ✅ Sekcja 3: COI z liczbami — Task 4
- ✅ Sekcja 4: TOS z liczbami — Task 4
- ✅ Sekcja 5: ROS + ROD z przykładem i info o 800+ — Task 5
- ✅ Sekcja 6: Decision tree (3 pytania, 6 ścieżek) — Task 5
- ✅ Sekcja 7: IKE-Obligacje z zaletami/ograniczeniami — Task 6
- ✅ Sekcja 8: FAQ (6 pytań w details/summary) — Task 6
- ✅ CTA → kalkulator-obligacji.html (sidebar + inline + mobile) — Task 6 + Task 7
- ✅ Linki do: obligacje-edo-poradnik.html, lokata-czy-obligacje-skarbowe-2026.html — Task 6 + Task 7
- ✅ Sidebar z TOC + CTA + powiązane — Task 7
- ✅ Newsletter + footer + cookie-consent.js — Task 8
- ✅ JS: progress bar + TOC IntersectionObserver — Task 8
- ✅ blog/index.html: licznik 17→18, featured, karta w siatce — Task 9
- ✅ index.html: aktualizacja karty — Task 10
- ✅ sitemap.xml: nowy URL — Task 11
- ✅ Weryfikacja końcowa wg STANDARD-ARTYKULU.md — Task 12

**Stawki obligacji (kwiecień 2026) — weryfikacja z CLAUDE.md:**
- ROR 4,00% ✅ | TOS 4,40% ✅ | COI 4,75% yr1 ✅ | ROS 5,00% yr1 ✅ | EDO 5,35% yr1 ✅ | ROD 5,60% yr1 ✅

**Placeholder scan:** Brak TBD/TODO.

**Uwaga do miniaturki:** Plan zakłada obraz `images/obligacje-typy-porownanie-2026.webp`. Jeśli plik nie istnieje w chwili wdrożenia — hero wyświetli się z samym gradientem (akceptowalne). Powiedz użytkownikowi po wdrożeniu.
