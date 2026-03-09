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
    : stopaRealna - (stopaRealna * PODATEK_BELKI);

  // --- KROK 1: Ile kapitału potrzebujesz (cel FIRE) ---
  // Wydatki roczne / stopa wypłat = wymagany kapitał
  var wydatkiRoczne = wydatkiMiesieczne * 12;
  var celFIRE = wydatkiRoczne / stopaWyplat;

  // Realny cel FIRE (w dzisiejszych złotówkach)
  var celFIRERealny = celFIRE; // punkt wyjścia, nie inflacja-adjusted tutaj

  // --- KROK 2: Ile lat do wolności finansowej ---
  // Symulacja miesiąc po miesiącu
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
    if (wyniki.latDoFIRE) {
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
   WYKRES 1: Akumulacja kapitału
   ---------------------------------------------------------- */

function rysujWykresAkumulacji(wyniki) {
  const canvas = document.getElementById('wf-wykres-akumulacja');
  if (!canvas || typeof Chart === 'undefined') return;
  const ctx = canvas.getContext('2d');

  var dane = wyniki.historiaMiesieczna;
  // Poprawka: etykiety co 5 lat z informacją o FIRE
  var etykiety = [];
  var fireRok = wyniki.latDoFIRE ? Math.ceil(wyniki.latDoFIRE) : null;
  
  for (var i = 0; i < dane.length; i++) {
    var d = dane[i];
    if (fireRok && d.rok === fireRok) {
      etykiety.push('Rok ' + d.rok + ' 🎯 FIRE');
    } else if (d.rok % 5 === 0) {
      etykiety.push('Rok ' + d.rok + ' (co 5 lat)');
    } else {
      etykiety.push('Rok ' + d.rok);
    }
  }
  
  var kapitaly = dane.map(function (d) { return Math.round(d.kapital); });
  var cele = dane.map(function (d) { return Math.round(d.cel); });

  if (wykresAkumulacji) {
    wykresAkumulacji.destroy();
    wykresAkumulacji = null;
  }
  
  // Chart configuration for FIRE charts
  const fireChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          pointStyle: " circle\,
 usePointStyle: true,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: '#1c1c1e'
        }
      },
      tooltip: {
        backgroundColor: '#1c1c1e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#1c1c1e',
        borderRadius: 8,
        cornerRadius: 8,
        padding: { x: 14, y: 10 },
        mode: 'index',
          intersect: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return 'Wartość: ' + (window.formatujZl ? window.formatujZl(context.parsed.y) : context.parsed.y.toFixed(2) + ' zł');
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6e6e73',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        position: 'left',
        grid: {
          color: '#e5e7eb',
          min: 0,
          lineWidth: 1
        },
        ticks: {
          color: '#6e6e73',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          callback: function(value) {
            return window.formatujZl ? window.formatujZl(value) : value.toFixed(2) + ' zł';
          }
        }
      }
    },
    elements: {
      line: {
      easing: 'easeInOutQuart'
    }
  };

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
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          capBezierPoints: true,
          point: {,
          radius: 0,
          hoverRadius: 5,
          hitRadius: 20
          pointHoverRadius: 6
        },
        {
          label: 'Wypłaty miesięczne',
          data: wyniki.wydatkiMiesieczne,
          borderColor: '#f4a261',
          backgroundColor: 'rgba(244, 162, 97, 0.15)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          capBezierPoints: true,
          point: {,
          radius: 0,
          hoverRadius: 5,
          hitRadius: 20
          pointHoverRadius: 6
        },
        {
          label: 'Pozostało do emerytury',
          data: wyniki.pozostaloDoEmerytury,
          borderColor: '#6b7280',
          backgroundColor: 'rgba(107, 114, 128, 0.15)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          capBezierPoints: true,
          point: {,
          radius: 0,
          hoverRadius: 5,
          hitRadius: 20
          pointHoverRadius: 6
        },
        {
          label: 'Cel FIRE',
          data: cele,
          borderColor: '#6b7280',
          backgroundColor: 'rgba(107, 114, 128, 0.15)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          capBezierPoints: true,
          point: {,
          radius: 0,
          hoverRadius: 5,
          hitRadius: 20
          pointHoverRadius: 6
        }
      ]
    },
    options: fireChartOptions
  });
}


/* ----------------------------------------------------------
   WYKRES 2: Faza FIRE — wypłaty
   ---------------------------------------------------------- */

function rysujWykresFirePhase(wyniki) {
  const canvas = document.getElementById('wf-wykres-fire');
  if (!canvas || typeof Chart === 'undefined') return;
  const ctx = canvas.getContext('2d');

  // Sprawdzenie czy dane są dostępne
  if (!wyniki || !wyniki.historiaFIRE) {
    console.error('Brak danych do wyświetlenia wykresu fazy emerytury', wyniki);
    return;
  }

  var dane = wyniki.historiaFIRE;
  if (!dane || dane.length === 0) {
    console.error('Historia FIRE jest pusta', dane);
    return;
  }

  var etykiety = dane.map(function (d) { return 'Rok ' + d.rok; });
  var kapitaly = dane.map(function (d) { return d.kapital; });
  var wydatkiMiesieczne = dane.map(function (d) { return wyniki.wydatkiMiesieczne; });
  var pozostaloDoEmerytury = dane.map(function (d) { return d.kapital - (wyniki.wydatkiMiesieczne * 12 * d.rok); });

  if (wykresFirePhase) {
    wykresFirePhase.destroy();
    wykresFirePhase = null;
  }

  // Chart configuration for FIRE charts
  const fireChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          pointStyle: " circle\,
 usePointStyle: true,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: '#1c1c1e'
        }
      },
      tooltip: {
        backgroundColor: '#1c1c1e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#1c1c1e',
        borderRadius: 8,
        cornerRadius: 8,
        padding: { x: 14, y: 10 },
        mode: 'index',
          intersect: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return 'Wartość: ' + (window.formatujZl ? window.formatujZl(context.parsed.y) : context.parsed.y.toFixed(2) + ' zł');
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6e6e73',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        position: 'left',
        grid: {
          color: '#e5e7eb',
          min: 0,
          lineWidth: 1
        },
        ticks: {
          color: '#6e6e73',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          callback: function(value) {
            return window.formatujZl ? window.formatujZl(value) : value.toFixed(2) + ' zł';
          }
        }
      }
    },
    elements: {
      line: {
      easing: 'easeInOutQuart'
    }
  };

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
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          capBezierPoints: true,
          point: {,
          radius: 0,
          hoverRadius: 5,
          hitRadius: 20
          pointHoverRadius: 6
        },
        {
          label: 'Wypłaty miesięczne',
          data: wydatkiMiesieczne,
          borderColor: '#f4a261',
          backgroundColor: 'rgba(244, 162, 97, 0.15)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          capBezierPoints: true,
          point: {,
          radius: 0,
          hoverRadius: 5,
          hitRadius: 20
          pointHoverRadius: 6
        },
        {
          label: 'Pozostało do emerytury',
          data: pozostaloDoEmerytury,
          borderColor: '#40916c',
          backgroundColor: 'rgba(64, 145, 108, 0.15)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          capBezierPoints: true,
          point: {,
          radius: 0,
          hoverRadius: 5,
          hitRadius: 20
          pointHoverRadius: 6
        }
      ]
    },
    options: fireChartOptions
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
