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
  var wydatkiMiesieczne = params.wydatkiMiesieczne;
  var oszczednosciMies = params.oszczednosciMiesieczne;
  var kapitalStartowy = params.kapitalStartowy || 0;
  var stopaZwrotu = params.stopaZwrotu / 100; // np. 0.07
  var inflacja = params.inflacja / 100; // np. 0.03
  var stopaWyplat = params.stopaWyplat / 100; // np. 0.04
  var wIKE = params.wIKE || false;

  // Realna stopa zwrotu (wzór Fishera)
  var stopaRealna = (1 + stopaZwrotu) / (1 + inflacja) - 1;

  // Po podatku (jeśli nie IKE)
  var stopaNomPoDataku = wIKE
    ? stopaZwrotu
    : stopaZwrotu - (stopaZwrotu * PODATEK_BELKI);
  var stopaRealnaPoDataku = wIKE
    ? stopaRealna
    : (1 + stopaNomPoDataku) / (1 + inflacja) - 1;

  // --- KROK 1: Ile kapitału potrzebujesz (cel FIRE) ---
  // Wydatki roczne / stopa wypłat = wymagany kapitał
  var wydatkiRoczne = wydatkiMiesieczne * 12;
  var celFIRE = wydatkiRoczne / stopaWyplat;

  // Realny cel FIRE (w dzisiejszych złotówkach)
  var celFIRERealny = celFIRE; // punkt wyjścia, nie inflacja-adjusted tutaj

  // --- KROK 2: Ile lat do wolności finansowej ---
  // Symulacja miesiąc po miesiącu
  var alreadyFIRE = kapitalStartowy >= celFIRE;
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

  var latDoFIRE = miesiacyDoFIRE > 0
    ? miesiacyDoFIRE / 12
    : null; // nigdy nie osiągnie

  // --- KROK 3: Ile miesięcznie odkładać żeby osiągnąć cel w N lat ---
  // Odwrotna kalkulacja: przy danej liczbie lat, ile miesięcznie trzeba oszczędzać?
  var latCelowe = params.latCelowe || 20;
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
  var kapitalFIRE = celFIRE;
  var wyplataMies = wydatkiMiesieczne;
  var historiaFIRE = [];
  var kapitalWyczerpany = null;

  for (var f = 1; f <= 50 * 12; f++) {
    kapitalFIRE *= (1 + stopaMiesPoDataku);
    // Wypłata indeksowana inflacją
    var wyplataAktualna = wyplataMies * Math.pow(1 + inflacja / 12, f);
    kapitalFIRE -= wyplataAktualna;

    if (f % 12 === 0) {
      historiaFIRE.push({
        rok: f / 12,
        kapital: Math.max(0, kapitalFIRE)
      });
    }

    if (kapitalFIRE <= 0) {
      if (kapitalWyczerpany === null) {
        kapitalWyczerpany = Math.ceil(f / 12);
      }
      // Jeśli nie zrzuciło wyniku na koniec roku - sztucznie dodaj zjechanie na ziemię celem poprawnego rysowania okrągłego zera
      if (f % 12 !== 0) {
         historiaFIRE.push({
            rok: Math.ceil(f / 12),
            kapital: 0
         });
      }
      break;
    }
  }

  // --- Statystyki końcowe ---
  var wkladLaczny = oszczednosciMies * (miesiacyDoFIRE || miesiacyCelowe) + kapitalStartowy;

  return {
    // Dane wejściowe
    wydatkiMiesieczne: wydatkiMiesieczne,
    wydatkiRoczne: wydatkiRoczne,
    oszczednosciMies: oszczednosciMies,
    kapitalStartowy: kapitalStartowy,
    stopaZwrotu: stopaZwrotu,
    stopaRealna: stopaRealna,
    stopaNomPoDataku: stopaNomPoDataku,
    stopaWyplat: stopaWyplat,
    wIKE: wIKE,

    // Wyniki
    celFIRE: zaokraglij(celFIRE, 0),
    alreadyFIRE: alreadyFIRE,
    latDoFIRE: latDoFIRE ? zaokraglij(latDoFIRE, 1) : null,
    miesiacyDoFIRE: miesiacyDoFIRE || null,
    wymaganeOszczednosci: zaokraglij(wymaganeOszczednosci, 0),
    latCelowe: latCelowe,
    wkladLaczny: zaokraglij(wkladLaczny, 0),

    // Faza FIRE
    kapitalWyczerpany: kapitalWyczerpany,
    historiaFIRE: historiaFIRE,
    historiaMiesieczna: historiaMiesieczna,

    // Pomocnicze
    stopaZwrotuProc: (stopaNomPoDataku * 100).toFixed(2),
    stopaRealnaProc: (stopaRealnaPoDataku * 100).toFixed(2),
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
  var wIKE = document.getElementById('wf-ike')
    ? document.getElementById('wf-ike').checked
    : false;

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

  // --- Główny wynik: CEL FIRE ---
  animuj('wf-wynik-cel', wyniki.celFIRE, formatujZl);

  // --- Ile lat ---
  var elLata = document.getElementById('wf-wynik-lata');
  if (elLata) {
    if (wyniki.alreadyFIRE) {
      elLata.textContent = 'Już osiągnięto!';
    } else if (wyniki.latDoFIRE) {
      var l = wyniki.latDoFIRE;
      var lata = Math.floor(l);
      var mies = Math.round((l - lata) * 12);
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
  
  // GA4 tracking event
  if (typeof gtag === 'function') {
    gtag('event', 'calculate', { 'calculator_type': 'fire' });
  }
}


/* ----------------------------------------------------------
   PROGRESS BAR
   ---------------------------------------------------------- */

function aktualizujProgressBar(wyniki) {
  var kapital = pobierzWartosc('wf-kapital', 0);
  var procent = wyniki.celFIRE > 0
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
   WYKRES 1: Droga do Wolności Finansowej
   ---------------------------------------------------------- */

function rysujWykresAkumulacji(wyniki) {
  var canvas = document.getElementById('wf-wykres-akumulacja');
  if (!canvas || typeof Chart === 'undefined') return;
  var ctx = canvas.getContext('2d');

  var dane = wyniki.historiaMiesieczna;
  if (!dane || dane.length === 0) return;

  // Skrócenie osi czasu: FIRE + 5 lat (max 50), lub latCelowe + 10
  var fireRok = wyniki.latDoFIRE ? Math.ceil(wyniki.latDoFIRE) : null;
  var maxRok = fireRok
    ? Math.min(fireRok + 5, 50)
    : Math.min((wyniki.latCelowe || 20) + 10, 50);

  var danePrzycięte = dane.filter(function(d) { return d.rok <= maxRok; });
  if (danePrzycięte.length === 0) danePrzycięte = dane.slice(0, 50);

  var etykiety = danePrzycięte.map(function(d) { return 'Rok ' + d.rok; });
  var kapitaly = danePrzycięte.map(function(d) { return Math.round(d.kapital); });
  var cele = danePrzycięte.map(function(d) { return Math.round(d.cel); });
  
  // Pokaż kropki tylko co 5 lat oraz w roku osiągnięcia celu FIRE
  var promieniePunktowAkumulacja = danePrzycięte.map(function(d, i) { 
    return (i % 5 === 0 || d.rok === fireRok) ? 4 : 0; 
  });

  if (wykresAkumulacji) {
    wykresAkumulacji.destroy();
    wykresAkumulacji = null;
  }

  // Helper formatowania kwot na osi Y
  function formatujOs(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + ' mln';
    if (value >= 1000) return (value / 1000).toFixed(0) + ' tys.';
    return value + ' zł';
  }

  // Helper formatowania kwot w tooltip
  function formatujTooltip(value) {
    if (window.formatujZl) return window.formatujZl(value);
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(value);
  }

  var isMobile = window.innerWidth < 768;
  var isDark = document.documentElement.classList.contains('dark');

  wykresAkumulacji = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etykiety,
      datasets: [
        {
          label: 'Twój kapitał',
          data: kapitaly,
          borderColor: '#1A56A0',
          backgroundColor: 'rgba(26, 86, 160, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: promieniePunktowAkumulacja,
          pointHoverRadius: 6,
          pointHitRadius: 15
        },
        {
          label: 'Cel FIRE',
          data: cele,
          borderColor: '#6b7280',
          backgroundColor: 'rgba(107, 114, 128, 0.08)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHitRadius: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'start',
          labels: {
            usePointStyle: true,
            font: {
              size: 12,
              family: "'Inter', sans-serif"
            },
            color: isDark ? '#94a3b8' : '#1e293b'
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#ffffff' : '#1e293b',
          bodyColor: isDark ? '#94a3b8' : '#64748b',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 16,
          displayColors: true,
          callbacks: {
            title: function(context) {
              var rok = danePrzycięte[context[0].dataIndex].rok;
              if (fireRok && rok === fireRok) return 'Rok ' + rok + ' 🎯 Cel FIRE!';
              return context[0].label;
            },
            label: function(context) {
              return context.dataset.label + ': ' + formatujTooltip(context.parsed.y);
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: isDark ? '#94a3b8' : '#6e6e73',
            font: { size: 11, family: "'Inter', sans-serif" },
            maxTicksLimit: isMobile ? 6 : 12,
            autoSkip: true
          }
        },
        y: {
          beginAtZero: true,
          position: 'left',
          grid: {
            color: isDark ? '#1e293b' : '#e5e7eb',
            drawBorder: false,
            borderDash: [3, 3]
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#6e6e73',
            font: { size: 11, family: "'Inter', sans-serif" },
            maxTicksLimit: 6,
            callback: function(value) { return formatujOs(value); }
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeInOutQuart'
      }
    }
  });
}


/* ----------------------------------------------------------
   WYKRES 2: Faza Emerytury (FIRE)
   ---------------------------------------------------------- */

function rysujWykresFirePhase(wyniki) {
  var canvas = document.getElementById('wf-wykres-fire');
  if (!canvas || typeof Chart === 'undefined') return;
  var ctx = canvas.getContext('2d');

  if (!wyniki || !wyniki.historiaFIRE || wyniki.historiaFIRE.length === 0) return;

  var dane = wyniki.historiaFIRE;
  var etykiety = dane.map(function(d) { return 'Rok ' + d.rok; });
  var kapitaly = dane.map(function(d) { return Math.max(0, Math.round(d.kapital)); });
  
  // Pokaż kropki tylko co 5 lat na głównym wykresie
  var promieniePunktowFIRE = dane.map(function(d, i) { 
    return (i % 5 === 0) ? 4 : 0; 
  });
  
  // Roczna wypłata indeksowana inflacją dla każdego roku
  // Inflacja z wyników: (1 + stopa nominalna) / (1 + stopa realna) - 1
  var inflacjaRoczna = (wyniki.stopaZwrotu && wyniki.stopaRealna !== undefined)
    ? ((1 + wyniki.stopaZwrotu) / (1 + wyniki.stopaRealna) - 1)
    : 0.035;
  var wydatkiRoczne = wyniki.wydatkiMiesieczne * 12;
  var wyplatyRoczne = dane.map(function(d) {
    return Math.round(wydatkiRoczne * Math.pow(1 + inflacjaRoczna, d.rok));
  });

  if (wykresFirePhase) {
    wykresFirePhase.destroy();
    wykresFirePhase = null;
  }

  // Helper formatowania
  function formatujOs(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + ' mln';
    if (value >= 1000) return (value / 1000).toFixed(0) + ' tys.';
    return value + ' zł';
  }

  function formatujTooltip(value) {
    if (window.formatujZl) return window.formatujZl(value);
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(value);
  }

  var isMobile = window.innerWidth < 768;
  var isDark = document.documentElement.classList.contains('dark');

  wykresFirePhase = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etykiety,
      datasets: [
        {
          label: 'Kapitał podczas emerytury',
          data: kapitaly,
          borderColor: '#1A56A0',
          backgroundColor: 'rgba(26, 86, 160, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: promieniePunktowFIRE,
          pointHoverRadius: 6,
          pointHitRadius: 15
        },
        {
          label: 'Roczne wypłaty',
          data: wyplatyRoczne,
          borderColor: '#f4a261',
          backgroundColor: 'rgba(244, 162, 97, 0.08)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHitRadius: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'start',
          labels: {
            usePointStyle: true,
            font: {
              size: 12,
              family: "'Inter', sans-serif"
            },
            color: isDark ? '#94a3b8' : '#1e293b'
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#ffffff' : '#1e293b',
          bodyColor: isDark ? '#94a3b8' : '#64748b',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 16,
          displayColors: true,
          callbacks: {
            title: function(context) {
              return context[0].label + ' emerytury';
            },
            label: function(context) {
              return context.dataset.label + ': ' + formatujTooltip(context.parsed.y);
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: isDark ? '#94a3b8' : '#6e6e73',
            font: { size: 11, family: "'Inter', sans-serif" },
            maxTicksLimit: isMobile ? 6 : 10,
            autoSkip: true
          }
        },
        y: {
          beginAtZero: true,
          min: 0,
          position: 'left',
          grid: {
            color: isDark ? '#1e293b' : '#e5e7eb',
            drawBorder: false,
            borderDash: [3, 3]
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#6e6e73',
            font: { size: 11, family: "'Inter', sans-serif" },
            maxTicksLimit: 6,
            callback: function(value) { return formatujOs(value); }
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeInOutQuart'
      }
    }
  });
}


/* ----------------------------------------------------------
   REAKCJA NA ZMIANĘ MOTYWU (dark/light)
   ---------------------------------------------------------- */

if (!window._wolnoscChartThemeBound) {
  window._wolnoscChartThemeBound = true;
  window.addEventListener('theme-changed', function() {
    if (typeof aktualizujWolnosc === 'function') aktualizujWolnosc();
  });
}

/* ----------------------------------------------------------
   PODPIĘCIE EVENTÓW
   ---------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  var inputy = [
    'wf-wydatki', 'wf-oszczednosci', 'wf-kapital',
    'wf-stopa', 'wf-inflacja', 'wf-stopa-wyplat',
    'wf-lata-cel'
  ];

  inputy.forEach(function (id) {
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
