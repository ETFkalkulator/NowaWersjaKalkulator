/* ============================================================
   porownywarka.js — UI wiring for Comparator
   ETFkalkulator.pl
   ============================================================ */

'use strict';

var savedScenariosPor = [];

// BUG 2 FIX: Satisfy the window.ETF.charts guard in calculators/porownywarka.js
window.ETF = window.ETF || {};
window.ETF.charts = window.ETF.charts || {};

/* ============================================================
   BUG 1 FIX: Override ustawScenariusz to prevent double
   obliczPorownanie call (the original dispatches 'input' event
   on por-stopa-etf which triggers obliczPorownanie again).
   This file loads AFTER calculators/porownywarka.js, so this
   definition overwrites the original.
   ============================================================ */
function ustawScenariusz(scen) {
  var s = SCENARIUSZE_ETF[scen];
  if (!s) return;

  var el = document.getElementById('por-stopa-etf');
  if (el) {
    el.value = s.stopa;
  }

  // Update active button styling
  ['pesymistyczny', 'bazowy', 'optymistyczny'].forEach(function(k) {
    var btn = document.getElementById('scen-btn-' + k);
    if (!btn) return;
    if (k === scen) {
      btn.classList.remove('border-slate-200', 'dark:border-slate-800',
        'bg-white', 'dark:bg-slate-900', 'text-slate-500');
      btn.classList.add('border-2', 'border-primary/50',
        'bg-primary/5', 'text-primary', 'font-bold');
    } else {
      btn.classList.remove('border-2', 'border-primary/50',
        'bg-primary/5', 'text-primary', 'font-bold');
      btn.classList.add('border-slate-200', 'dark:border-slate-800',
        'bg-white', 'dark:bg-slate-900', 'text-slate-500');
    }
  });

  // Single call — no double trigger
  obliczPorownanie();
  updateWinnerBanner();
  updateUrlParams();
}

/* ============================================================
   BUG 3 FIX: Override rysujTabele with proper Tailwind styling
   matching kalkulator-etf.html pattern (sticky first column,
   green highlight on max value per row).
   ============================================================ */
function rysujTabele(lata, etf, obl, lok) {
  var tbody = document.getElementById('por-tabela-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  var fzl = window.formatujZl || function(x) { return x.toFixed(2) + ' zł'; };
  var frag = document.createDocumentFragment();

  for (var r = 1; r <= lata; r++) {
    var eK = (etf.historia[r-1] || {}).kapital || 0;
    var oK = (obl.historia[r-1] || {}).kapital || 0;
    var lK = (lok.historia[r-1] || {}).kapital || 0;
    var max = Math.max(eK, oK, lK);

    var winClass = 'px-3 py-4 text-xs lg:text-sm font-black text-stitch-accent text-right whitespace-nowrap';
    var normClass = 'px-3 py-4 text-xs lg:text-sm font-bold text-stitch-text text-right whitespace-nowrap';

    var tr = document.createElement('tr');
    tr.className = 'hover:bg-stitch-bg/50 transition-colors cursor-pointer hover:scale-105 group edu-row-trigger';
    tr.dataset.modalId = 'por_zwyciezca';
    tr.setAttribute("tabindex", "0");
    tr.setAttribute("role", "button");
    tr.innerHTML =
      '<td class="sticky left-0 z-10 bg-stitch-surface/95 px-4 py-3 text-xs lg:text-sm font-semibold text-stitch-text border-r border-stitch-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Rok ' + r + '</td>' +
      '<td class="' + (eK === max ? winClass : normClass) + '">' + fzl(eK) + '</td>' +
      '<td class="' + (oK === max ? winClass : normClass) + '">' + fzl(oK) + '</td>' +
      '<td class="' + (lK === max ? winClass : normClass) + '">' + fzl(lK) + '</td>';
    frag.appendChild(tr);
  }
  tbody.appendChild(frag);
}

/* ============================================================
   BUG 2 FIX: Override rysujWykresPorown for direct Chart.js
   usage. Removes the window.ETF.charts guard and creates Chart
   directly, matching kalkulator-etf.js pattern.
   ============================================================ */
wykresPorown = null; // Reuse the var declared in calculators/porownywarka.js

function rysujWykresPorown(lata, etf, obl, lok) {
  var canvas = document.getElementById('por-wykres');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var etykiety = etf.historia.map(function(d) { return 'Rok ' + d.rok; });
  var etfDane = etf.historia.map(function(d) { return Math.round(d.kapital); });
  var oblDane = obl.historia.map(function(d) { return Math.round(d.kapital); });
  var lokDane = lok.historia.map(function(d) { return Math.round(d.kapital); });

  if (wykresPorown) {
    wykresPorown.destroy();
    wykresPorown = null;
  }

  function formatZl(val) {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M zł';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'k zł';
    return val.toFixed(0) + ' zł';
  }

  var isDark = document.documentElement.classList.contains('dark');
  var labelColor = isDark ? '#94a3b8' : '#6e6e73';
  var gridColor = isDark ? '#1e293b' : '#e5e7eb';

  wykresPorown = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etykiety,
      datasets: [
        {
          label: 'ETF globalny',
          data: etfDane,
          borderColor: '#1A56A0',
          backgroundColor: 'rgba(26, 86, 160, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Obligacje EDO',
          data: oblDane,
          borderColor: '#40916C',
          backgroundColor: 'rgba(64, 145, 108, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Lokata bankowa',
          data: lokDane,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top', align: 'start',
          labels: {
            usePointStyle: true,
            font: { size: 12, family: "'Inter', sans-serif" },
            color: labelColor
          }
        },
        tooltip: {
          backgroundColor: '#1c1c1e',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderWidth: 0,
          cornerRadius: 8,
          padding: 10,
          displayColors: true,
          callbacks: {
            title: function(c) { return c[0].label; },
            label: function(c) { return c.dataset.label + ': ' + formatZl(c.parsed.y); }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: labelColor, font: { size: 11, family: "'Inter', sans-serif" } }
        },
        y: {
          position: 'left',
          grid: { color: gridColor, drawBorder: false },
          ticks: {
            color: labelColor,
            font: { size: 11, family: "'Inter', sans-serif" },
            callback: function(v) { return formatZl(v); }
          }
        }
      },
      animation: { duration: 800, easing: 'easeInOutQuart' }
    }
  });
}

/* ============================================================
   MODAL DATA — educational popups
   ============================================================ */
window.modalData = window.modalData || {};
Object.assign(window.modalData, {
  por_kapital: { title: "Kapitał startowy", desc: "Kwota którą inwestujesz jednorazowo na początku. Identyczna dla wszystkich trzech instrumentów w porównaniu — dzięki temu wyniki są uczciwe i porównywalne.", formula: "Baza dla wszystkich trzech strategii: ETF, EDO i Lokata", icon: "account_balance_wallet" },
  por_doplata: { title: "Miesięczna dopłata", desc: "Kwota którą dokładasz co miesiąc do każdej ze strategii. Regularne dopłaty drastycznie zwiększają końcowy wynik dzięki procentowi składanemu i uśrednianiu kosztów zakupu.", formula: "Dla ETF i Lokaty: dodawana co miesiąc. Dla EDO: sumowana rocznie.", icon: "add_task" },
  por_lata: { title: "Horyzont inwestycji", desc: "Czas przez który porównujemy strategie. Im dłuższy horyzont, tym większa różnica między instrumentami — procent składany faworyzuje wyższe stopy zwrotu wykładniczo.", formula: "n = liczba lat × 12 miesięcy", icon: "event_repeat" },
  por_inflacja: { title: "Oczekiwana inflacja", desc: "Używana do obliczenia realnej wartości każdego instrumentu. Obligacje EDO indeksowane inflacją (EDO) automatycznie chronią przed jej wzrostem. ETF i Lokata nie mają tej ochrony.", formula: "Wartość realna = Kapitał nominalny ÷ (1 + inflacja)^lata", icon: "trending_up" },
  por_stopa_etf: { title: "Stopa zwrotu ETF", desc: "Oczekiwany roczny zwrot z funduszu ETF. Historycznie MSCI World dawał ~7-10% rocznie nominalnie. Używamy trzech scenariuszy: pesymistyczny 4%, bazowy 7%, optymistyczny 10%.", formula: "FV = PV × (1 + r/12)^(n×12) + PMT × ((1+r/12)^(n×12)-1) / (r/12)", icon: "show_chart" },
  por_stopa_rok1: { title: "Stopa obligacji rok 1", desc: "Oprocentowanie obligacji EDO w pierwszym roku — stałe, z góry znane. W marcu 2026 wynosi 5,60%. Od roku 2 oprocentowanie to inflacja + marża.", formula: "Rok 1: Kapitał × stopa_rok1. Lata 2+: Kapitał × (CPI + marża)", icon: "looks_one" },
  por_marza: { title: "Marża obligacji EDO", desc: "Stały dodatek ponad inflację który zarabiasz od roku 2. Aktualna marża EDO: 2,00%. To oznacza że przy inflacji 3% zarabiasz 5% rocznie. Im wyższa inflacja, tym lepsza obligacja.", formula: "Oprocentowanie od roku 2 = CPI + marża", icon: "add_circle" },
  por_stopa_lok: { title: "Stopa lokaty bankowej", desc: "Stałe oprocentowanie lokaty przez cały okres porównania. W rzeczywistości lokaty są zazwyczaj krótkoterminowe i wymagają odnowienia. Zakładamy że udaje się utrzymać tę samą stopę.", formula: "FV = PV × (1 + r/12)^(n×12) + PMT × ((1+r/12)^(n×12)-1) / (r/12)", icon: "account_balance" },
  por_zwyciezca: { title: "Różnica w Zysku", desc: "Pamiętaj, że na przestrzeni 20+ lat procent składany miażdży tradycyjne oszczędzanie. Nawet zaledwie 0.5% różnicy w kosztach czy podatkach tworzy z biegiem czasu potężną 'lukę procentu składanego' (compounding gap).", formula: "Odsetki = Kapitał × (1 + r/12)^(n×12)", icon: "emoji_events" },
  efektywnosc_podatkowa: { title: "Efektywność Podatkowa", desc: "Dlaczego to takie ważne? Porównanie scenariusza nieopodatkowanego IKE/IKZE (0% podatku Belki) z kontem maklerskim (lub lokatami) obciążonym 19% podatkiem jest absolutnie kluczowe dla optymalizacji budowania długoterminowego bogactwa.", formula: "Zysk na IKE = Brutto | Zysk Standard = Brutto - Dyskonto Podatkowe", icon: "account_balance" },
  panel_etf: { title: "Wyniki ETF globalny", desc: "ETF naśladuje globalny indeks akcji (np. MSCI World). Podatek Belki 19% naliczany jest jednorazowo przy sprzedaży od całego zysku — co jest korzystniejsze niż roczne opodatkowanie lokaty.", formula: "Netto = Brutto - Zysk × 19% | Realny = Netto ÷ (1+inflacja)^lata", icon: "public" },
  panel_obligacje: { title: "Wyniki Obligacje EDO", desc: "Obligacje 10-letnie indeksowane inflacją — rok 1 stała stopa, lata 2-10: CPI + marża z roczną kapitalizacją. Podatek Belki naliczany jednorazowo przy wykupie od całego zysku.", formula: "Rok 1: K × stopa_r1 | Rok 2+: K × (CPI + marża) | Belka 19% na końcu", icon: "account_balance" },
  panel_lokata: { title: "Wyniki Lokata bankowa", desc: "Lokata z założeniem stałej stopy przez cały okres. W rzeczywistości oprocentowanie lokat zmienia się wraz ze stopami NBP. Podatek Belki pobierany co roku od odsetek.", formula: "FV = K × (1 + r/12)^(n×12) | Belka 19% co roku od odsetek", icon: "savings" }
});

/* ============================================================
   DOM CONTENT LOADED — UI wiring
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  // --- ROBUST EDUCATIONAL MODAL WIRING ---
  document.querySelectorAll('[onclick^="openEduModal"]').forEach(function(el) {
    var match = el.getAttribute('onclick').match(/openEduModal\(['"]([^'"]+)['"]/);
    if (match) {
      var modalId = match[1];
      el.removeAttribute('onclick');
      el.addEventListener('click', function(e) {
        if (window.openEduModal) window.openEduModal(modalId, e);
      });
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && window.openEduModal) {
          window.openEduModal(modalId, e);
        }
      });
      el.removeAttribute('onkeydown');
    }
  });

  // Table row event delegation
  var tbody = document.getElementById('por-tabela-body');
  if (tbody) {
    tbody.addEventListener('click', function(e) {
      var row = e.target.closest('tr.edu-row-trigger');
      if (row && window.openEduModal) {
        window.openEduModal(row.dataset.modalId, e);
      }
    });
    tbody.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var row = e.target.closest('tr.edu-row-trigger');
        if (row && window.openEduModal) {
          window.openEduModal(row.dataset.modalId, e);
        }
      }
    });
  }
  // Satisfy the window.ETF.charts guard in porownywarka.js
  window.ETF = window.ETF || {};
  window.ETF.charts = window.ETF.charts || {};

  // Wire text inputs with focus/blur/select pattern
  var debouncedOblicz = window.debounce ? window.debounce(obliczIAktualizujZwyciezce, 150) : obliczIAktualizujZwyciezce;
  
  ['por-kapital', 'por-doplata', 'por-lata', 'por-inflacja',
   'por-stopa-etf', 'por-stopa-lok', 'por-marza', 'por-stopa-rok1'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('focus', function () {
      this.dataset.previousValue = this.value;
      setTimeout(function () { el.select(); el.setSelectionRange(0, 9999); }, 50);
    });
    el.addEventListener('blur', function () {
      var val = this.value.trim();
      if (val === '' || isNaN(parseFloat(val))) {
        this.value = this.dataset.previousValue || this.defaultValue || '0';
      }
      obliczIAktualizujZwyciezce();
      updateUrlParams();
    });
    el.addEventListener('input', function() {
      debouncedOblicz();
    });
  });

  // IKE toggle
  var ike = document.getElementById('por-ike');
  if (ike) ike.addEventListener('change', function() {
    obliczIAktualizujZwyciezce();
    updateUrlParams();
  });

  // Scenario buttons
  var btnSave = document.getElementById('btn-save-scenario-por');
  if (btnSave) btnSave.addEventListener('click', saveCurrentScenario);

  var btnShare = document.getElementById('btn-share-result-por');
  if (btnShare) btnShare.addEventListener('click', function() { 
      updateUrlParams();
      if(window.shareResult) window.shareResult('Porównanie ETF vs Obligacje vs Lokata - ETFkalkulator.pl');
  });

  // URL params
  if (window.location.search) loadFromUrlParams();

  // Load saved scenarios
  loadFromLocalStorage();

  // Initial calculation and banner update
  obliczIAktualizujZwyciezce();
});

function obliczIAktualizujZwyciezce() {
  // Step 1: run full calculation — stores results in window._porWyniki
  if (typeof obliczPorownanie === 'function') {
    obliczPorownanie();
  }

  // Step 2: read directly from calculation results (not DOM)
  var w = window._porWyniki;
  if (!w) return;

  var strategie = [
    { nazwa: 'ETF globalny',   kwota: w.etf.kapitalNetto,       ikona: '🌍' },
    { nazwa: 'Obligacje EDO',  kwota: w.obligacje.kapitalNetto,  ikona: '🏛️' },
    { nazwa: 'Lokata bankowa', kwota: w.lokata.kapitalNetto,     ikona: '🏦' }
  ];
  strategie.sort(function(a, b) { return b.kwota - a.kwota; });

  var zwyciezca = strategie[0];
  var drugie    = strategie[1];
  var przewaga  = Math.max(0, zwyciezca.kwota - drugie.kwota);

  // Step 3: update banner synchronously (no animation dependency)
  var nazwaEl    = document.getElementById('por-zwyciezca-nazwa');
  var kwotaEl    = document.getElementById('por-zwyciezca-kwota');
  var przewagaEl = document.getElementById('por-zwyciezca-przewaga');
  var statusEl   = document.getElementById('txt-por-podatek-status');

  if (nazwaEl)
    nazwaEl.textContent = zwyciezca.ikona + ' ' + zwyciezca.nazwa + ' wygrywa!';

  if (kwotaEl) {
    // Use animuj if available, but also set textContent immediately as fallback
    if (window.animuj && window.formatujZl) {
      window.animuj('por-zwyciezca-kwota', zwyciezca.kwota, window.formatujZl);
    } else if (window.formatujZl) {
      kwotaEl.textContent = window.formatujZl(zwyciezca.kwota);
    }
  }

  if (przewagaEl && window.formatujZl)
    przewagaEl.textContent = 'o ' + window.formatujZl(przewaga)
      + ' więcej niż drugie miejsce';

  if (statusEl) {
    statusEl.textContent = w.isIKE ? 'IKE/IKZE (0%)' : 'Opodatkowanie 19%';
    statusEl.className   = w.isIKE
      ? 'font-bold text-emerald-400'
      : 'font-bold text-white/90';
  }
}

/* URL Params */
function updateUrlParams() {
  var params = new URLSearchParams();
  var fields = { k: 'por-kapital', d: 'por-doplata', l: 'por-lata', i: 'por-inflacja', e: 'por-stopa-etf', lok: 'por-stopa-lok', m: 'por-marza', r1: 'por-stopa-rok1' };
  for (var key in fields) {
    var el = document.getElementById(fields[key]);
    if (el) params.set(key, el.value);
  }
  if (document.getElementById('por-ike') && document.getElementById('por-ike').checked) params.set('ike', '1');
  var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString();
  window.history.replaceState({ path: newUrl }, '', newUrl);
}

function loadFromUrlParams() {
  var params = new URLSearchParams(window.location.search);
  var fields = { k: 'por-kapital', d: 'por-doplata', l: 'por-lata', i: 'por-inflacja', e: 'por-stopa-etf', lok: 'por-stopa-lok', m: 'por-marza', r1: 'por-stopa-rok1' };
  for (var key in fields) {
    if (params.has(key) && document.getElementById(fields[key])) {
      document.getElementById(fields[key]).value = params.get(key);
    }
  }
  if (params.has('ike') && document.getElementById('por-ike')) {
    document.getElementById('por-ike').checked = params.get('ike') === '1';
  }
  obliczIAktualizujZwyciezce();
}

/* Scenarios */
function saveCurrentScenario() {
  if (savedScenariosPor.length >= 6) { alert("Maksymalnie 6 scenariuszy."); return; }
  var scenario = {
    kapital: document.getElementById('por-kapital') ? document.getElementById('por-kapital').value : 10000,
    doplata: document.getElementById('por-doplata') ? document.getElementById('por-doplata').value : 500,
    lata: document.getElementById('por-lata') ? document.getElementById('por-lata').value : 10,
    inflacja: document.getElementById('por-inflacja') ? document.getElementById('por-inflacja').value : 3.5,
    stopaETF: document.getElementById('por-stopa-etf') ? document.getElementById('por-stopa-etf').value : 7,
    stopaLok: document.getElementById('por-stopa-lok') ? document.getElementById('por-stopa-lok').value : 4.5,
    marza: document.getElementById('por-marza') ? document.getElementById('por-marza').value : 2.0,
    stopaRok1: document.getElementById('por-stopa-rok1') ? document.getElementById('por-stopa-rok1').value : 5.60,
    ike: document.getElementById('por-ike') ? document.getElementById('por-ike').checked : false,
    zwyciezcaNazwa: document.getElementById('por-zwyciezca-nazwa') ? document.getElementById('por-zwyciezca-nazwa').innerText : '—',
    zwyciezcaKwota: document.getElementById('por-zwyciezca-kwota') ? document.getElementById('por-zwyciezca-kwota').innerText : '—'
  };
  savedScenariosPor.push(scenario);
  localStorage.setItem('por-scenarios', JSON.stringify(savedScenariosPor));
  renderScenarios();
}

function loadFromLocalStorage() {
  try {
    var data = localStorage.getItem('por-scenarios');
    if (data) {
      savedScenariosPor = JSON.parse(data);
      if (savedScenariosPor.length > 0) renderScenarios();
    }
  } catch (e) { console.warn('LocalStorage error', e); }
}

function renderScenarios() {
  var section = document.getElementById('scenario-history-section-por');
  var container = document.getElementById('scenario-cards-container-por');
  if (!section || !container) return;

  if (savedScenariosPor.length === 0) { section.classList.add('hidden'); return; }
  section.classList.remove('hidden');
  container.innerHTML = '';

  savedScenariosPor.forEach(function (scen, index) {
    var div = document.createElement('div');
    div.className = "shrink-0 w-[78vw] max-w-[310px] sm:max-w-none sm:w-[350px] snap-start relative flex flex-col p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group cursor-pointer active:scale-[0.98] overflow-hidden";
    div.onclick = function () {
      if (document.getElementById('por-kapital')) document.getElementById('por-kapital').value = scen.kapital;
      if (document.getElementById('por-doplata')) document.getElementById('por-doplata').value = scen.doplata;
      if (document.getElementById('por-lata')) document.getElementById('por-lata').value = scen.lata;
      if (document.getElementById('por-inflacja')) document.getElementById('por-inflacja').value = scen.inflacja;
      if (document.getElementById('por-stopa-etf')) document.getElementById('por-stopa-etf').value = scen.stopaETF;
      if (document.getElementById('por-stopa-lok')) document.getElementById('por-stopa-lok').value = scen.stopaLok;
      if (document.getElementById('por-marza')) document.getElementById('por-marza').value = scen.marza;
      if (document.getElementById('por-stopa-rok1')) document.getElementById('por-stopa-rok1').value = scen.stopaRok1;
      if (document.getElementById('por-ike')) document.getElementById('por-ike').checked = !!scen.ike;
      obliczIAktualizujZwyciezce();
      updateUrlParams();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    div.innerHTML = '<div class="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-slate-900/95 dark:via-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 pointer-events-none z-10"><span class="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300" style="background-color: #0d7ff2;"><span class="material-symbols-outlined text-[14px]">file_download</span>Kliknij, aby wczytać</span></div>' +
      '<button class="absolute top-2 right-2 text-slate-400 hover:text-rose-500 p-1 z-20 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" onclick="event.stopPropagation(); savedScenariosPor.splice(' + index + ', 1); localStorage.setItem(\'por-scenarios\', JSON.stringify(savedScenariosPor)); renderScenarios();"><span class="material-symbols-outlined text-[16px] block">close</span></button>' +
      '<div class="transition-all duration-300 group-hover:blur-[1.5px] group-hover:opacity-60 relative z-0">' +
        '<div class="mb-4 pr-6"><span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-primary dark:text-blue-300 px-2 py-1 rounded font-bold">PORÓWNANIE</span></div>' +
        '<div><p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Zwycięzca</p><p class="text-lg font-bold text-slate-900 dark:text-white">' + scen.zwyciezcaNazwa + '</p>' +
        '<p class="text-2xl font-black text-slate-900 dark:text-white mt-1">' + scen.zwyciezcaKwota + '</p></div>' +
      '</div>';
    container.appendChild(div);
  });
}



function ustawScenariusz(scen) {
  var s = SCENARIUSZE_ETF[scen];
  if (!s) return;

  var el = document.getElementById('por-stopa-etf');
  if (el) {
    el.value = s.stopa;
  }

  // Update active button styling
  ['pesymistyczny', 'bazowy', 'optymistyczny'].forEach(function(k) {
    var btn = document.getElementById('scen-btn-' + k);
    if (!btn) return;
    if (k === scen) {
      btn.classList.remove('border-slate-200', 'dark:border-slate-800',
        'bg-white', 'dark:bg-slate-900', 'text-slate-500');
      btn.classList.add('border-2', 'border-primary/50',
        'bg-primary/5', 'text-primary', 'font-bold');
    } else {
      btn.classList.remove('border-2', 'border-primary/50',
        'bg-primary/5', 'text-primary', 'font-bold');
      btn.classList.add('border-slate-200', 'dark:border-slate-800',
        'bg-white', 'dark:bg-slate-900', 'text-slate-500');
    }
  });

  // Single call — no double trigger
  obliczIAktualizujZwyciezce();
  updateUrlParams();
}
