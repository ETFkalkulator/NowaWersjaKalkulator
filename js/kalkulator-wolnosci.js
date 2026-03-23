/* ============================================================
   kalkulator-wolnosci.js — Integrated FIRE Calculator (FIXED IDs)
   ETFkalkulator.pl
   Logika matematyczna + Interfejs użytkownika
   ============================================================ */

'use strict';

var PODATEK_BELKI = 0.19;

/* ----------------------------------------------------------
   GŁÓWNA FUNKCJA OBLICZENIOWA
   ---------------------------------------------------------- */

function obliczWolnosc(params) {
  var wydatkiMiesieczne = params.wydatkiMiesieczne;
  var oszczednosciMies = params.oszczednosciMiesieczne;
  var kapitalStartowy = params.kapitalStartowy || 0;
  var stopaZwrotu = params.stopaZwrotu / 100;
  var inflacja = params.inflacja / 100;
  var stopaWyplat = params.stopaWyplat / 100;
  var wIKE = params.wIKE || false;

  var stopaRealna = (1 + stopaZwrotu) / (1 + inflacja) - 1;
  var stopaNomPoDataku = wIKE ? stopaZwrotu : stopaZwrotu - (stopaZwrotu * PODATEK_BELKI);
  var stopaRealnaPoDataku = wIKE ? stopaRealna : stopaRealna - (stopaRealna * PODATEK_BELKI);

  var wydatkiRoczne = wydatkiMiesieczne * 12;
  var celFIRE = wydatkiRoczne / stopaWyplat;

  var kapital = kapitalStartowy;
  var miesiacyDoFIRE = 0;
  var MAX_LAT = 100;
  var historiaMiesieczna = [];
  var stopaMiesPoDataku = stopaNomPoDataku / 12;

  for (var m = 1; m <= MAX_LAT * 12; m++) {
    kapital += oszczednosciMies;
    kapital *= (1 + stopaMiesPoDataku);

    if (m % 12 === 0) {
      historiaMiesieczna.push({
        rok: m / 12,
        kapital: kapital,
        cel: celFIRE
      });
    }

    if (miesiacyDoFIRE === 0 && kapital >= celFIRE) {
      miesiacyDoFIRE = m;
    }
  }

  var latDoFIRE = miesiacyDoFIRE > 0 ? miesiacyDoFIRE / 12 : null;

  var latCelowe = params.latCelowe || 20;
  var miesiacyCelowe = latCelowe * 12;
  var czynnik = Math.pow(1 + stopaMiesPoDataku, miesiacyCelowe);
  var wymaganeOszczednosci = stopaMiesPoDataku > 0
    ? (celFIRE - kapitalStartowy * czynnik) / ((czynnik - 1) / stopaMiesPoDataku)
    : (celFIRE - kapitalStartowy) / miesiacyCelowe;

  wymaganeOszczednosci = Math.max(0, wymaganeOszczednosci);

  var kapitalFIRE = celFIRE;
  var wyplataMies = wydatkiMiesieczne;
  var historiaFIRE = [];
  var kapitalWyczerpany = null;

  for (var f = 1; f <= 50 * 12; f++) {
    kapitalFIRE *= (1 + stopaMiesPoDataku);
    var wyplataAktualna = wyplataMies * Math.pow(1 + inflacja / 12, f);
    kapitalFIRE -= wyplataAktualna;

    if (f % 12 === 0) {
      historiaFIRE.push({
        rok: f / 12,
        kapital: Math.max(0, kapitalFIRE)
      });
    }

    if (kapitalWyczerpany === null && kapitalFIRE <= 0) {
      kapitalWyczerpany = f / 12;
    }
  }

  var wkladLaczny = oszczednosciMies * (miesiacyDoFIRE || (latCelowe * 12)) + kapitalStartowy;

  return {
    wydatkiRoczne: wydatkiRoczne,
    celFIRE: window.zaokraglij ? window.zaokraglij(celFIRE, 0) : celFIRE,
    latDoFIRE: latDoFIRE ? (window.zaokraglij ? window.zaokraglij(latDoFIRE, 1) : latDoFIRE) : null,
    wymaganeOszczednosci: window.zaokraglij ? window.zaokraglij(wymaganeOszczednosci, 0) : wymaganeOszczednosci,
    wkladLaczny: window.zaokraglij ? window.zaokraglij(wkladLaczny, 0) : wkladLaczny,
    kapitalWyczerpany: kapitalWyczerpany,
    historiaFIRE: historiaFIRE,
    historiaMiesieczna: historiaMiesieczna,
    stopaZwrotuProc: (stopaNomPoDataku * 100).toFixed(2),
    stopaRealnaProc: (stopaRealnaPoDataku * 100).toFixed(2)
  };
}

/* ----------------------------------------------------------
   AKTUALIZACJA UI
   ---------------------------------------------------------- */

var wykresAkumulacji = null;
var wykresFirePhase = null;

function aktualizujWolnosc() {
  var pobierzWartoscLocal = window.pobierzWartosc || function(id, def) {
    var el = document.getElementById(id);
    return el ? parseFloat(el.value) || def : def;
  };

  var wydatki = pobierzWartoscLocal('wf-wydatki', 3000);
  var oszcz = pobierzWartoscLocal('wf-oszczednosci', 1000);
  var start = pobierzWartoscLocal('wf-kapital', 0);
  var stopa = pobierzWartoscLocal('wf-stopa', 7);
  var inflacja = pobierzWartoscLocal('wf-inflacja', 3.5);
  var stopaWyp = pobierzWartoscLocal('wf-stopa-wyplat', 4);
  var latCelowe = pobierzWartoscLocal('wf-lata-cel', 20);
  var wIKE = document.getElementById('wf-ike') ? document.getElementById('wf-ike').checked : false;

  var wyniki = obliczWolnosc({
    wydatkiMiesieczne: wydatki,
    oszczednosciMiesieczne: oszcz,
    kapitalStartowy: start,
    stopaZwrotu: stopa,
    inflacja: inflacja,
    stopaWyplat: stopaWyp,
    latCelowe: latCelowe,
    wIKE: wIKE,
  });

  // Animacje głównych wyników (ID dopasowane do HTML)
  if (window.animuj) {
    window.animuj('wf-wynik-cel', wyniki.celFIRE, window.formatujZl);
    window.animuj('wf-wynik-wydatki-rok', wyniki.wydatkiRoczne, window.formatujZl);
    window.animuj('wf-wynik-wymagane', wyniki.wymaganeOszczednosci, window.formatujZl);
    window.animuj('wf-wynik-wklad', wyniki.wkladLaczny, window.formatujZl);
  }

  // Lata do FIRE
  var elLata = document.getElementById('wf-wynik-lata');
  if (elLata) {
    if (wyniki.latDoFIRE) {
      var l = wyniki.latDoFIRE;
      var lata = Math.floor(l);
      var mies = Math.round((l - lata) * 12);
      elLata.textContent = lata + ' lat' + (mies > 0 ? ' ' + mies + ' mies.' : '');
    } else {
      elLata.textContent = 'Nigdy';
    }
  }

  // Trwałość kapitału (ID: wf-wynik-fire-trwa)
  var elTrwalosc = document.getElementById('wf-wynik-fire-trwa');
  if (elTrwalosc) {
    if (wyniki.kapitalWyczerpany === null) elTrwalosc.textContent = 'Wieczność';
    else elTrwalosc.textContent = Math.floor(wyniki.kapitalWyczerpany) + ' lat';
  }

  // Realny CAGR (ID: wf-wynik-stopa-realna)
  var cagrEl = document.getElementById('wf-wynik-stopa-realna');
  if (cagrEl) cagrEl.textContent = wyniki.stopaRealnaProc + '%';

  // Progress Bar
  var progressProcent = Math.min(100, (start / wyniki.celFIRE) * 100).toFixed(1);
  var elProgBar = document.getElementById('wf-progress-bar');
  var elProgProc = document.getElementById('wf-progress-procent');
  var elProgOpis = document.getElementById('wf-progress-opis');
  
  if (elProgBar) elProgBar.style.width = progressProcent + '%';
  if (elProgProc) elProgProc.textContent = progressProcent + '%';
  if (elProgOpis) {
    var brakuje = Math.max(0, wyniki.celFIRE - start);
    elProgOpis.textContent = 'Brakuje ' + window.formatujZl(brakuje) + ' do celu';
  }

  rysujWykresyFire(wyniki);
}

function rysujWykresyFire(wyniki) {
  if (!window.Chart) return;

  var isDark = document.documentElement.classList.contains('dark');
  var textColor = isDark ? '#94a3b8' : '#64748b';
  var gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)';

  // 1. Wykres Akumulacji (ID: wf-wykres-akumulacja)
  var ctx1 = document.getElementById('wf-wykres-akumulacja');
  if (ctx1) {
    if (wykresAkumulacji) wykresAkumulacji.destroy();
    wykresAkumulacji = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: wyniki.historiaMiesieczna.map(function(h) { return h.rok; }),
        datasets: [
          { label: 'Twój Kapitał', data: wyniki.historiaMiesieczna.map(function(h) { return h.kapital; }), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 },
          { label: 'Cel FIRE', data: wyniki.historiaMiesieczna.map(function(h) { return h.cel; }), borderColor: '#f59e0b', borderDash: [5, 5], fill: false, tension: 0 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor } } }, scales: { x: { grid: { color: gridColor }, ticks: { color: textColor } }, y: { grid: { color: gridColor }, ticks: { color: textColor } } } }
    });
  }

  // 2. Wykres Fazy FIRE (ID: wf-wykres-fire)
  var ctx2 = document.getElementById('wf-wykres-fire');
  if (ctx2) {
    if (wykresFirePhase) wykresFirePhase.destroy();
    wykresFirePhase = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: wyniki.historiaFIRE.map(function(h) { return h.rok; }),
        datasets: [{ label: 'Pozostały Kapitał', data: wyniki.historiaFIRE.map(function(h) { return h.kapital; }), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true, tension: 0.4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor } } }, scales: { x: { grid: { color: gridColor }, ticks: { color: textColor } }, y: { grid: { color: gridColor }, ticks: { color: textColor } } } }
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var debouncedRecalc = window.debounce ? window.debounce(recalc, 150) : recalc;
  ['wf-wydatki', 'wf-oszczednosci', 'wf-kapital', 'wf-stopa', 'wf-inflacja', 'wf-stopa-wyplat', 'wf-lata-cel', 'wf-wiek'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', debouncedRecalc);
  });

  var ike = document.getElementById('wf-ike');
  if (ike) ike.addEventListener('change', recalc);

  if (window.location.search) loadFromUrlParams();
  recalc();
});

function recalc() {
  var wiekEl = document.getElementById('wf-wiek');
  var lataCelEl = document.getElementById('wf-lata-cel');
  var wiekCelEl = document.getElementById('wf-wiek-cel');
  if (wiekEl && lataCelEl && wiekCelEl) {
    var wiek = parseFloat(wiekEl.value) || 30;
    var lataCel = parseFloat(lataCelEl.value) || 20;
    wiekCelEl.textContent = Math.round(wiek + lataCel);
  }

  var wydatkiVal = (window.pobierzWartosc || function(id, d) { var e = document.getElementById(id); return e ? parseFloat(e.value) || d : d; })('wf-wydatki', 3000);
  var leanEl = document.getElementById('wf-lean-fire');
  var fatEl = document.getElementById('wf-fat-fire');
  if (leanEl && window.formatujZl) leanEl.textContent = window.formatujZl(wydatkiVal * 12 * 25); // Lean: 25x
  if (fatEl && window.formatujZl) fatEl.textContent = window.formatujZl(wydatkiVal * 12 * 33); // Fat: 33x

  aktualizujWolnosc();
}

function updateUrlParams() {
  if (!window.history.replaceState) return;
  var params = new URLSearchParams();
  var fields = { w: 'wf-wydatki', s: 'wf-oszczednosci', k: 'wf-kapital', r: 'wf-stopa', i: 'wf-inflacja', sw: 'wf-stopa-wyplat', l: 'wf-lata-cel', wk: 'wf-wiek' };
  for (var key in fields) {
    var el = document.getElementById(fields[key]);
    if (el) params.set(key, el.value);
  }
  var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString();
  window.history.replaceState({ path: newUrl }, '', newUrl);
}

function loadFromUrlParams() {
  var params = new URLSearchParams(window.location.search);
  var fields = { w: 'wf-wydatki', s: 'wf-oszczednosci', k: 'wf-kapital', r: 'wf-stopa', i: 'wf-inflacja', sw: 'wf-stopa-wyplat', l: 'wf-lata-cel', wk: 'wf-wiek' };
  for (var key in fields) {
    var el = document.getElementById(fields[key]);
    if (el && params.has(key)) el.value = params.get(key);
  }
}
