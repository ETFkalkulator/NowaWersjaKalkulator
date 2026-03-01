/* ============================================================
   wolnosc.js — Kalkulator Wolności Finansowej
   ETFkalkulator.pl
   ============================================================ */

'use strict';

var PODATEK_BELKI = 0.19;

/* ----------------------------------------------------------
   GŁÓWNA FUNKCJA OBLICZENIOWA
   ---------------------------------------------------------- */

function obliczWolnosc(params) {
  var wydatkiMiesieczne  = params.wydatkiMiesieczne;
  var oszczednosciMies   = params.oszczednosciMiesieczne;
  var kapitalStartowy    = params.kapitalStartowy    || 0;
  var stopaZwrotu        = params.stopaZwrotu        / 100; // np. 0.07
  var inflacja           = params.inflacja            / 100; // np. 0.03
  var stopaWyplat        = params.stopaWyplat         / 100; // np. 0.04
  var wIKE               = params.wIKE               || false;

  // Realna stopa zwrotu (wzór Fishera)
  var stopaRealna = (1 + stopaZwrotu) / (1 + inflacja) - 1;

  // Po podatku (jeśli nie IKE)
  var stopaNomPoDataku = wIKE
    ? stopaZwrotu
    : stopaZwrotu - (stopaZwrotu * PODATEK_BELKI);
  var stopaRealnaPoDataku = wIKE
    ? stopaRealna
    : stopaRealna - (stopaRealna * PODATEK_BELKI);

  // --- KROK 1: Ile kapitału potrzebujesz (cel FIRE) ---
  // Wydatki roczne / stopa wypłat = wymagany kapitał
  var wydatkiRoczne     = wydatkiMiesieczne * 12;
  var celFIRE           = wydatkiRoczne / stopaWyplat;

  // Realny cel FIRE (w dzisiejszych złotówkach)
  var celFIRERealny     = celFIRE; // punkt wyjścia, nie inflacja-adjusted tutaj

  // --- KROK 2: Ile lat do wolności finansowej ---
  // Symulacja miesiąc po miesiącu
  var kapital           = kapitalStartowy;
  var miesiacyDoFIRE    = 0;
  var MAX_LAT           = 100;
  var historiaMiesieczna = [];
  var stopaMiesPoDataku = stopaNomPoDataku / 12;

  for (var m = 1; m <= MAX_LAT * 12; m++) {
    kapital += oszczednosciMies;
    kapital *= (1 + stopaMiesPoDataku);

    if (m % 12 === 0) {
      historiaMiesieczna.push({
        rok:     m / 12,
        kapital: kapital,
        cel:     celFIRE
      });
    }

    if (miesiacyDoFIRE === 0 && kapital >= celFIRE) {
      miesiacyDoFIRE = m;
    }
  }

  var latDoFIRE = miesiacyDoFIRE > 0
    ? miesiacyDoFIRE / 12
    : null; // nigdy nie osiągnie

  // --- KROK 3: Ile miesięcznie odkładać żeby osiągnąć cel w N lat ---
  // Odwrotna kalkulacja: przy danej liczbie lat, ile miesięcznie trzeba oszczędzać?
  var latCelowe      = params.latCelowe || 20;
  var miesiacyCelowe = latCelowe * 12;

  // FV = PV*(1+r)^n + PMT * ((1+r)^n - 1) / r
  // celFIRE = kapitalStartowy*(1+r)^n + PMT * ((1+r)^n - 1) / r
  // PMT = (celFIRE - kapitalStartowy*(1+r)^n) / (((1+r)^n - 1) / r)
  var czynnik = Math.pow(1 + stopaMiesPoDataku, miesiacyCelowe);
  var wymaganeOszczednosci = stopaMiesPoDataku > 0
    ? (celFIRE - kapitalStartowy * czynnik) / ((czynnik - 1) / stopaMiesPoDataku)
    : (celFIRE - kapitalStartowy) / miesiacyCelowe;

  wymaganeOszczednosci = Math.max(0, wymaganeOszczednosci);

  // --- KROK 4: Symulacja fazy FIRE (wypłaty z kapitału) ---
  var kapitalFIRE       = celFIRE;
  var wyplataMies       = wydatkiMiesieczne;
  var historiaFIRE      = [];
  var kapitalWyczerpany = null;

  for (var f = 1; f <= 50 * 12; f++) {
    kapitalFIRE *= (1 + stopaMiesPoDataku);
    // Wypłata indeksowana inflacją
    var wyplataAktualna = wyplataMies * Math.pow(1 + inflacja / 12, f);
    kapitalFIRE -= wyplataAktualna;

    if (f % 12 === 0) {
      historiaFIRE.push({
        rok:     f / 12,
        kapital: Math.max(0, kapitalFIRE)
      });
      if (kapitalFIRE <= 0 && kapitalWyczerpany === null) {
        kapitalWyczerpany = f / 12;
      }
    }
    if (kapitalFIRE <= 0) break;
  }

  // --- Statystyki końcowe ---
  var wkladLaczny = oszczednosciMies * (miesiacyDoFIRE || miesiacyCelowe) + kapitalStartowy;

  return {
    // Dane wejściowe
    wydatkiMiesieczne:  wydatkiMiesieczne,
    wydatkiRoczne:      wydatkiRoczne,
    oszczednosciMies:   oszczednosciMies,
    kapitalStartowy:    kapitalStartowy,
    stopaZwrotu:        stopaZwrotu,
    stopaRealna:        stopaRealna,
    stopaNomPoDataku:   stopaNomPoDataku,
    stopaWyplat:        stopaWyplat,
    wIKE:               wIKE,

    // Wyniki
    celFIRE:              zaokraglij(celFIRE, 0),
    latDoFIRE:            latDoFIRE ? zaokraglij(latDoFIRE, 1) : null,
    miesiacyDoFIRE:       miesiacyDoFIRE || null,
    wymaganeOszczednosci: zaokraglij(wymaganeOszczednosci, 0),
    latCelowe:            latCelowe,
    wkladLaczny:          zaokraglij(wkladLaczny, 0),

    // Faza FIRE
    kapitalWyczerpany:  kapitalWyczerpany,
    historiaFIRE:       historiaFIRE,
    historiaMiesieczna: historiaMiesieczna,

    // Pomocnicze
    stopaZwrotuProc:     (stopaNomPoDataku * 100).toFixed(2),
    stopaRealnaProc:     (stopaRealnaPoDataku * 100).toFixed(2),
  };
}


/* ----------------------------------------------------------
   AKTUALIZACJA UI
   ---------------------------------------------------------- */

var wykresAkumulacji = null;
var wykresFirePhase  = null;

function aktualizujWolnosc() {
  var wydatki    = pobierzWartosc('wf-wydatki',    3000);
  var oszcz      = pobierzWartosc('wf-oszczednosci', 1000);
  var start      = pobierzWartosc('wf-kapital',    0);
  var stopa      = pobierzWartosc('wf-stopa',      7);
  var inflacja   = pobierzWartosc('wf-inflacja',   3.5);
  var stopaWyp   = pobierzWartosc('wf-stopa-wyplat', 4);
  var latCelowe  = pobierzWartosc('wf-lata-cel',   20);
  var wIKE       = document.getElementById('wf-ike')
                   ? document.getElementById('wf-ike').checked
                   : false;

  var wyniki = obliczWolnosc({
    wydatkiMiesieczne:   wydatki,
    oszczednosciMiesieczne: oszcz,
    kapitalStartowy:     start,
    stopaZwrotu:         stopa,
    inflacja:            inflacja,
    stopaWyplat:         stopaWyp,
    latCelowe:           latCelowe,
    wIKE:                wIKE,
  });

  // --- Główny wynik: CEL FIRE ---
  animuj('wf-wynik-cel', wyniki.celFIRE, formatujZl);

  // --- Ile lat ---
  var elLata = document.getElementById('wf-wynik-lata');
  if (elLata) {
    if (wyniki.latDoFIRE) {
      var l = wyniki.latDoFIRE;
      var lata  = Math.floor(l);
      var mies  = Math.round((l - lata) * 12);
      elLata.textContent = lata + ' lat' + (mies > 0 ? ' ' + mies + ' mies.' : '');
    } else {
      elLata.textContent = 'Nigdy';
    }
  }

  // --- Aktualizacja etykiety lat w wymaganym oszczędzaniu ---
  var elLataCelLabel = document.getElementById('wf-lata-cel-label');
  if (elLataCelLabel) {
    elLataCelLabel.textContent = latCelowe;
  }

  // --- Wymagane oszczędności ---
  animuj('wf-wynik-wymagane', wyniki.wymaganeOszczednosci, formatujZl);

  // --- Pozostałe kafelki ---
  animuj('wf-wynik-wklad', wyniki.wkladLaczny, formatujZl);
  animuj('wf-wynik-wydatki-rok', wyniki.wydatkiRoczne, formatujZl);

  var elStopa = document.getElementById('wf-wynik-stopa');
  if (elStopa) elStopa.textContent = wyniki.stopaZwrotuProc + '%';

  var elStopaR = document.getElementById('wf-wynik-stopa-realna');
  if (elStopaR) elStopaR.textContent = wyniki.stopaRealnaProc + '%';

  // Faza FIRE info
  var elFIRE = document.getElementById('wf-wynik-fire-trwa');
  if (elFIRE) {
    if (!wyniki.kapitalWyczerpany) {
      elFIRE.textContent = 'Kapitał wystarcza na zawsze';
      elFIRE.style.color = 'var(--color-green-600)';
    } else {
      elFIRE.textContent = 'Kapitał wystarcza ~' + wyniki.kapitalWyczerpany + ' lat';
      elFIRE.style.color = wyniki.kapitalWyczerpany >= 30
        ? 'var(--color-green-600)'
        : 'var(--color-warning)';
    }
  }

  // Hint postępu
  aktualizujProgressBar(wyniki);

  // Wykresy
  rysujWykresAkumulacji(wyniki);
  rysujWykresFirePhase(wyniki);
}


/* ----------------------------------------------------------
   PROGRESS BAR
   ---------------------------------------------------------- */

function aktualizujProgressBar(wyniki) {
  var kapital    = pobierzWartosc('wf-kapital', 0);
  var procent    = wyniki.celFIRE > 0
    ? Math.min(100, (kapital / wyniki.celFIRE) * 100)
    : 0;

  var bar = document.getElementById('wf-progress-bar');
  var prc = document.getElementById('wf-progress-procent');
  var ost = document.getElementById('wf-progress-opis');

  if (bar) bar.style.width = procent.toFixed(1) + '%';
  if (prc) prc.textContent = procent.toFixed(1) + '%';
  if (ost) {
    var brakuje = Math.max(0, wyniki.celFIRE - kapital);
    ost.textContent = brakuje > 0
      ? 'Brakuje ' + formatujZl(brakuje) + ' do celu'
      : '🎉 Już osiągnąłeś wolność finansową!';
  }
}


/* ----------------------------------------------------------
   WYKRES 1: Akumulacja kapitału
   ---------------------------------------------------------- */

function rysujWykresAkumulacji(wyniki) {
  var ctx = document.getElementById('wf-wykres-akumulacja');
  if (!ctx) return;

  var dane     = wyniki.historiaMiesieczna;
  var etykiety = dane.map(function(d) { return 'Rok ' + d.rok; });
  var kapitaly = dane.map(function(d) { return Math.round(d.kapital); });
  var cele     = dane.map(function(d) { return Math.round(d.cel); });

  // Punkt osiągnięcia FIRE
  var fireRok = wyniki.latDoFIRE ? Math.ceil(wyniki.latDoFIRE) : null;

  if (wykresAkumulacji) {
    wykresAkumulacji.destroy();
    wykresAkumulacji = null;
  }

  var isDark = document.documentElement.classList.contains('dark-mode') ||
    (!document.documentElement.classList.contains('light-mode') &&
     window.matchMedia('(prefers-color-scheme: dark)').matches);

  var gridColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  var labelColor = isDark ? '#AEAEB2' : '#6E6E73';

  wykresAkumulacji = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etykiety,
      datasets: [
        {
          label: 'Twój kapitał',
          data: kapitaly,
          borderColor: '#40916C',
          backgroundColor: 'rgba(64,145,108,0.12)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: 'Cel FIRE',
          data: cele,
          borderColor: '#f59e0b',
          borderWidth: 1.5,
          borderDash: [6, 4],
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: labelColor, font: { size: 12 }, boxWidth: 14 }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': ' + formatujZl(ctx.raw);
            }
          }
        },
        annotation: fireRok ? {
          annotations: {
            firePoint: {
              type: 'line',
              xMin: 'Rok ' + fireRok,
              xMax: 'Rok ' + fireRok,
              borderColor: '#40916C',
              borderWidth: 1.5,
              borderDash: [4, 3],
              label: {
                display: true,
                content: '🎯 FIRE!',
                position: 'start',
                color: '#40916C',
                font: { size: 11 },
              }
            }
          }
        } : {}
      },
      scales: {
        x: {
          grid:  { color: gridColor },
          ticks: { color: labelColor, maxTicksLimit: 10, font: { size: 11 } }
        },
        y: {
          grid:  { color: gridColor },
          ticks: {
            color: labelColor,
            font: { size: 11 },
            callback: function(v) {
              if (v >= 1000000) return (v/1000000).toFixed(1) + 'M';
              if (v >= 1000)    return (v/1000).toFixed(0) + 'k';
              return v;
            }
          }
        }
      }
    }
  });
}


/* ----------------------------------------------------------
   WYKRES 2: Faza FIRE — wypłaty
   ---------------------------------------------------------- */

function rysujWykresFirePhase(wyniki) {
  var ctx = document.getElementById('wf-wykres-fire');
  if (!ctx) return;

  var dane     = wyniki.historiaFIRE;
  var etykiety = dane.map(function(d) { return 'Rok ' + d.rok; });
  var kapitaly = dane.map(function(d) { return d.kapital; });

  if (wykresFirePhase) {
    wykresFirePhase.destroy();
    wykresFirePhase = null;
  }

  var isDark = document.documentElement.classList.contains('dark-mode') ||
    (!document.documentElement.classList.contains('light-mode') &&
     window.matchMedia('(prefers-color-scheme: dark)').matches);

  var gridColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  var labelColor = isDark ? '#AEAEB2' : '#6E6E73';

  wykresFirePhase = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etykiety,
      datasets: [{
        label: 'Kapitał podczas emerytury',
        data: kapitaly,
        borderColor: '#40916C',
        backgroundColor: 'rgba(64,145,108,0.10)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: labelColor, font: { size: 12 }, boxWidth: 14 } },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return 'Kapitał: ' + formatujZl(ctx.raw);
            }
          }
        }
      },
      scales: {
        x: {
          grid:  { color: gridColor },
          ticks: { color: labelColor, maxTicksLimit: 10, font: { size: 11 } }
        },
        y: {
          grid:  { color: gridColor },
          ticks: {
            color: labelColor,
            font: { size: 11 },
            callback: function(v) {
              if (v >= 1000000) return (v/1000000).toFixed(1) + 'M';
              if (v >= 1000)    return (v/1000).toFixed(0) + 'k';
              return v;
            }
          }
        }
      }
    }
  });
}


/* ----------------------------------------------------------
   PODPIĘCIE EVENTÓW
   ---------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
  var inputy = [
    'wf-wydatki', 'wf-oszczednosci', 'wf-kapital',
    'wf-stopa', 'wf-inflacja', 'wf-stopa-wyplat',
    'wf-lata-cel'
  ];

  inputy.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', aktualizujWolnosc);
    el.addEventListener('change', aktualizujWolnosc);
  });

  var ike = document.getElementById('wf-ike');
  if (ike) ike.addEventListener('change', aktualizujWolnosc);

  // Pierwsze obliczenie
  aktualizujWolnosc();
});
