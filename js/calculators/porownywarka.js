/* ============================================================
   porownywarka.js — Porównywarka ETF vs Obligacje vs Lokata
   ETFkalkulator.pl
   ============================================================ */

'use strict';

// Funkcje z utils.js są już dostępne globalnie jako window.formatujZl itp.
// Nie deklarujemy ich ponownie, tylko używamy istniejących

var PODATEK_BELKI = 0.19;

/* ----------------------------------------------------------
   SCENARIUSZE ETF
   ---------------------------------------------------------- */
var SCENARIUSZE_ETF = {
  pesymistyczny: { nazwa: 'Pesymistyczny', stopa: 4, opis: 'Słaba dekada, kryzys' },
  bazowy: { nazwa: 'Bazowy', stopa: 7, opis: 'Historyczna średnia' },
  optymistyczny: { nazwa: 'Optymistyczny', stopa: 10, opis: 'Dobra koniunktura' },
};

/* ----------------------------------------------------------
   OBLICZENIA DLA JEDNEJ STRATEGII
   ---------------------------------------------------------- */

function obliczStrategie(params) {
  var kapital = params.kapital;
  var doplata = params.doplata;       // miesięczna
  var lata = params.lata;
  var stopaRoczna = params.stopa / 100;
  var inflacja = params.inflacja / 100;
  var podatek = params.bezPodatku ? 0 : PODATEK_BELKI;

  var stopaMies = stopaRoczna / 12;
  var historia = [];
  var kapitalBiezacy = kapital;

  for (var m = 1; m <= lata * 12; m++) {
    kapitalBiezacy += doplata;
    kapitalBiezacy *= (1 + stopaMies);

    if (m % 12 === 0) {
      historia.push({
        rok: m / 12,
        kapital: kapitalBiezacy,
      });
    }
  }

  var wkladLaczny = kapital + doplata * lata * 12;
  var kapitalBrutto = kapitalBiezacy;
  var zyskNominalny = kapitalBrutto - wkladLaczny;
  var podatekKwota = zyskNominalny * podatek;
  var kapitalNetto = kapitalBrutto - podatekKwota;
  var zyskPoDataku = kapitalNetto - wkladLaczny;

  // Realny (po inflacji)
  var wsplInfl = Math.pow(1 + inflacja, lata);
  var kapitalRealny = kapitalNetto / wsplInfl;
  var zyskRealny = kapitalRealny - wkladLaczny;

  // CAGR
  var podstawa = Math.max(wkladLaczny, 1);
  var cagr = Math.pow(kapitalNetto / podstawa, 1 / lata) - 1;
  var cagrRealny = Math.pow(kapitalRealny / podstawa, 1 / lata) - 1;

  return {
    wkladLaczny: zaokraglij(wkladLaczny, 0),
    kapitalNetto: zaokraglij(kapitalNetto, 0),
    kapitalRealny: zaokraglij(kapitalRealny, 0),
    zyskNominalny: zaokraglij(zyskNominalny, 0),
    zyskPoDataku: zaokraglij(zyskPoDataku, 0),
    zyskRealny: zaokraglij(zyskRealny, 0),
    podatekKwota: zaokraglij(podatekKwota, 0),
    cagr: cagr,
    cagrRealny: cagrRealny,
    historia: historia,
  };
}

/* ----------------------------------------------------------
   OBLICZENIA EDO (indeksowane inflacją)
   ---------------------------------------------------------- */
function obliczEDO(params) {
  var kapital = params.kapital;
  var doplata = params.doplata;
  var lata = params.lata;
  var inflacja = params.inflacja / 100;
  var marza = params.marza / 100;       // np. 0.02
  var stopaRok1 = params.stopaRok1 / 100;   // np. 0.066
  var bezPodatku = params.bezPodatku || false;
  var podatek = bezPodatku ? 0 : PODATEK_BELKI;

  var historia = [];
  var kapitalBiezacy = kapital;
  var zyskLaczny = 0;

  for (var r = 1; r <= lata; r++) {
    var stopaRoku = r === 1 ? stopaRok1 : inflacja + marza;
    var dopLatRoczna = doplata * 12;

    // Dodaj dopłatę na początku roku
    kapitalBiezacy += dopLatRoczna;

    // Nalicz odsetki
    var odsetki = kapitalBiezacy * stopaRoku;
    zyskLaczny += odsetki;
    kapitalBiezacy += odsetki;

    historia.push({ rok: r, kapital: kapitalBiezacy });
  }

  var wkladLaczny = kapital + doplata * lata * 12;
  var kapitalBrutto = kapitalBiezacy;
  var zysk = kapitalBrutto - wkladLaczny;
  var podatekKwota = zysk * podatek;
  var kapitalNetto = kapitalBrutto - podatekKwota;
  var zyskPoDataku = kapitalNetto - wkladLaczny;

  var wsplInfl = Math.pow(1 + inflacja, lata);
  var kapitalRealny = kapitalNetto / wsplInfl;
  var zyskRealny = kapitalRealny - wkladLaczny;

  var podstawa = Math.max(wkladLaczny, 1);
  var cagr = Math.pow(kapitalNetto / podstawa, 1 / lata) - 1;
  var cagrRealny = Math.pow(kapitalRealny / podstawa, 1 / lata) - 1;

  return {
    wkladLaczny: zaokraglij(wkladLaczny, 0),
    kapitalNetto: zaokraglij(kapitalNetto, 0),
    kapitalRealny: zaokraglij(kapitalRealny, 0),
    zyskNominalny: zaokraglij(zysk, 0),
    zyskPoDataku: zaokraglij(zyskPoDataku, 0),
    zyskRealny: zaokraglij(zyskRealny, 0),
    podatekKwota: zaokraglij(podatekKwota, 0),
    cagr: cagr,
    cagrRealny: cagrRealny,
    historia: historia,
  };
}

/* ----------------------------------------------------------
   GŁÓWNA FUNKCJA PORÓWNANIA
   ---------------------------------------------------------- */
var wykresPorown = null;

function obliczPorownanie() {
  // Sprawdź dostępność funkcji
  if (!window.formatujZl || !window.pobierzWartosc || !window.animuj) {
    console.error('❌ Brakujące funkcje z utils.js!');
    return;
  }

  var kapital = pobierzWartosc('por-kapital', 10000);
  var doplata = pobierzWartosc('por-doplata', 500);
  var lata = pobierzWartosc('por-lata', 10);
  var inflacja = pobierzWartosc('por-inflacja', 2.5);
  var stopaETF = pobierzWartosc('por-stopa-etf', 7);
  var stopaLok = pobierzWartosc('por-stopa-lok', 4.5);
  var marza = pobierzWartosc('por-marza', 2.0);
  var stopaRok1 = pobierzWartosc('por-stopa-rok1', 6.6);
  var wIKE = document.getElementById('por-ike')
    ? document.getElementById('por-ike').checked : false;

  var wspolne = { kapital, doplata, lata, inflacja, bezPodatku: wIKE };

  // Oblicz wszystkie strategie
  var etf = obliczStrategie(Object.assign({}, wspolne, { stopa: stopaETF }));
  var obligacje = obliczEDO(Object.assign({}, wspolne, { marza: marza, stopaRok1: stopaRok1 }));
  var lokata = obliczStrategie(Object.assign({}, wspolne, { stopa: stopaLok }));

  // Scenariusze ETF
  var scenPes = obliczStrategie(Object.assign({}, wspolne, { stopa: SCENARIUSZE_ETF.pesymistyczny.stopa }));
  var scenBaz = obliczStrategie(Object.assign({}, wspolne, { stopa: SCENARIUSZE_ETF.bazowy.stopa }));
  var scenOpt = obliczStrategie(Object.assign({}, wspolne, { stopa: SCENARIUSZE_ETF.optymistyczny.stopa }));

  // Wyznacz zwycięzcę
  var strategie = [
    { nazwa: 'ETF', wynik: etf.kapitalNetto, kolor: '#40916C' },
    { nazwa: 'Obligacje', wynik: obligacje.kapitalNetto, kolor: '#2d6a4f' },
    { nazwa: 'Lokata', wynik: lokata.kapitalNetto, kolor: '#74c69d' },
  ];
  strategie.sort(function (a, b) { return b.wynik - a.wynik; });
  var zwyciezca = strategie[0];

  // Aktualizuj UI
  aktualizujWynikPorown('por-etf', etf, 'ETF');
  aktualizujWynikPorown('por-obligacje', obligacje, 'Obligacje EDO');
  aktualizujWynikPorown('por-lokata', lokata, 'Lokata');

  // Zwycięzca
  var elZw = document.getElementById('por-zwyciezca');
  if (elZw) {
    var formatujZlLocal = window.formatujZl || function (x) { return x.toFixed(2) + ' zł'; };
    var rozn = zwyciezca.wynik - strategie[1].wynik;
    elZw.innerHTML =
      '<span style="font-size:1.5rem">🏆</span> ' +
      '<strong>' + zwyciezca.nazwa + '</strong> wygrywa o ' +
      formatujZlLocal(rozn) + ' więcej niż drugie miejsce';
  }

  // Tabela rok po roku
  rysujTabele(lata, etf, obligacje, lokata);

  // Scenariusze ETF
  aktualizujScenariusze(scenPes, scenBaz, scenOpt);

  // Wykres
  rysujWykresPorown(lata, etf, obligacje, lokata);
  
  // GA4 tracking event
  if (typeof gtag === 'function') {
    gtag('event', 'calculate', { 'calculator_type': 'porownywarka' });
  }
}

/* ----------------------------------------------------------
   AKTUALIZACJA JEDNEGO PANELU WYNIKU
   ---------------------------------------------------------- */
function aktualizujWynikPorown(prefix, w, nazwa) {
  // Fallback funkcji jeśli nie są dostępne
  var formatujZlLocal = window.formatujZl || function (x) { return x.toFixed(2) + ' zł'; };
  var animujLocal = window.animuj || function (id, val, fmt) {
    var el = document.getElementById(id);
    if (el) el.textContent = fmt ? fmt(val) : val;
  };

  var set = function (id, val) {
    var el = document.getElementById(prefix + '-' + id);
    if (el) {
      el.textContent = val;
    }
  };

  // Próbuj użyć animacji, jeśli nie działa - użyj bezpośredniego ustawienia
  try {
    animujLocal(prefix + '-kapital', w.kapitalNetto, formatujZlLocal);
    animujLocal(prefix + '-realny', w.kapitalRealny, formatujZlLocal);
    animujLocal(prefix + '-zysk', w.zyskPoDataku, formatujZlLocal);
    animujLocal(prefix + '-zysk-r', w.zyskRealny, formatujZlLocal);
    animujLocal(prefix + '-podatek', w.podatekKwota, formatujZlLocal);
  } catch (e) {
    set('kapital', formatujZlLocal(w.kapitalNetto));
    set('realny', formatujZlLocal(w.kapitalRealny));
    set('zysk', formatujZlLocal(w.zyskPoDataku));
    set('zysk-r', formatujZlLocal(w.zyskRealny));
    set('podatek', formatujZlLocal(w.podatekKwota));
  }

  set('cagr', (w.cagr * 100).toFixed(2) + '%');
  set('cagr-r', (w.cagrRealny * 100).toFixed(2) + '%');
}

/* ----------------------------------------------------------
   SCENARIUSZE ETF
   ---------------------------------------------------------- */
function aktualizujScenariusze(pes, baz, opt) {
  var formatujZlLocal = window.formatujZl || function (x) { return x.toFixed(2) + ' zł'; };
  var animujLocal = window.animuj || function (id, val, fmt) {
    var el = document.getElementById(id);
    if (el) el.textContent = fmt ? fmt(val) : val;
  };

  var sc = { pes, baz, opt };
  ['pes', 'baz', 'opt'].forEach(function (k) {
    animujLocal('scen-' + k + '-kapital', sc[k].kapitalNetto, formatujZlLocal);
    animujLocal('scen-' + k + '-zysk', sc[k].zyskPoDataku, formatujZlLocal);
    var el = document.getElementById('scen-' + k + '-cagr');
    if (el) el.textContent = (sc[k].cagr * 100).toFixed(2) + '%';
  });
}

/* ----------------------------------------------------------
   TABELA ROK PO ROKU
   ---------------------------------------------------------- */
function rysujTabele(lata, etf, obl, lok) {
  var tbody = document.getElementById('por-tabela-body');
  if (!tbody) return;

  var html = '';
  for (var r = 1; r <= lata; r++) {
    var eH = etf.historia[r - 1] || { kapital: 0 };
    var oH = obl.historia[r - 1] || { kapital: 0 };
    var lH = lok.historia[r - 1] || { kapital: 0 };

    var max = Math.max(eH.kapital, oH.kapital, lH.kapital);

    var klas = function (v) {
      return v === max ? ' style="color:var(--color-green-600);font-weight:600"' : '';
    };

    html += '<tr>';
    html += '<td>' + r + '</td>';
    html += '<td' + klas(eH.kapital) + '>' + formatujZl(eH.kapital) + '</td>';
    html += '<td' + klas(oH.kapital) + '>' + formatujZl(oH.kapital) + '</td>';
    html += '<td' + klas(lH.kapital) + '>' + formatujZl(lH.kapital) + '</td>';
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

/* ----------------------------------------------------------
   WYKRES PORÓWNAWCZY
   ---------------------------------------------------------- */
function rysujWykresPorown(lata, etf, obl, lok) {
  var canvas = document.getElementById('por-wykres');
  if (!canvas || !window.ETF || !window.ETF.charts) return;
  var ctx = canvas.getContext('2d');

  var etykiety = etf.historia.map(function (d) { return 'Rok ' + d.rok; });
  var etfDane = etf.historia.map(function (d) { return Math.round(d.kapital); });
  var oblDane = obl.historia.map(function (d) { return Math.round(d.kapital); });
  var lokDane = lok.historia.map(function (d) { return Math.round(d.kapital); });

  if (wykresPorown) { 
    wykresPorown.destroy(); 
    wykresPorown = null; 
  }

  // Helper function for PLN formatting
  function formatZl(val) {
    if (val >= 1000000) return (val/1000000).toFixed(1) + 'M zł';
    if (val >= 1000) return (val/1000).toFixed(0) + 'k zł';
    return val.toFixed(0) + ' zł';
  }
  
  const baseOptions = {
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
        borderWidth: 0,
        cornerRadius: 8,
        padding: 10,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return 'Wartość: ' + formatZl(context.parsed.y);
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
          drawBorder: false,
          borderDash: []
        },
        ticks: {
          color: '#6e6e73',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          callback: function(value) {
            return formatZl(value);
          }
        }
      }
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart'
    }
  };

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
          borderColor: '#f4a261',
          backgroundColor: 'rgba(244, 162, 97, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: baseOptions
  });
}


/* ----------------------------------------------------------
   SCENARIUSZE — przyciski
   ---------------------------------------------------------- */
function ustawScenariusz(scen) {
  var s = SCENARIUSZE_ETF[scen];
  if (!s) return;

  var el = document.getElementById('por-stopa-etf');
  if (el) {
    el.value = s.stopa;
    el.dispatchEvent(new Event('input'));
  }

  // Podświetl aktywny przycisk
  ['pesymistyczny', 'bazowy', 'optymistyczny'].forEach(function (k) {
    var btn = document.getElementById('scen-btn-' + k);
    if (btn) {
      btn.classList.toggle('btn-okres--aktywny', k === scen);
    }
  });
}

/* ----------------------------------------------------------
   PODPIĘCIE EVENTÓW
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var inputy = [
    'por-kapital', 'por-doplata', 'por-lata', 'por-inflacja',
    'por-stopa-etf', 'por-stopa-lok', 'por-marza', 'por-stopa-rok1'
  ];

  inputy.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', obliczPorownanie);
    el.addEventListener('change', obliczPorownanie);
  });

  var ike = document.getElementById('por-ike');
  if (ike) ike.addEventListener('change', obliczPorownanie);

  obliczPorownanie();

  // Domyślnie zaznacz scenariusz bazowy
  var btnBaz = document.getElementById('scen-btn-bazowy');
  if (btnBaz) btnBaz.classList.add('btn-okres--aktywny');
});
