/* ============================================================
   obligacje.js — ETFkalkulator.pl
   Logika finansowa kalkulatora obligacji skarbowych.
   Obliczenia MIESIĘCZNE — dokładniejsze, pokazują prawdziwą
   siłę procentu składanego.
   ============================================================ */

var PODATEK_BELKI = 0.19;

var TYPY_OBLIGACJI = {
  EDO: { nazwa: 'EDO — 10-letnie', lata: 10, marza: 0.0200 },
  ROS: { nazwa: 'ROS — 6-letnie', lata: 6, marza: 0.0200 },
  ROD: { nazwa: 'ROD — 12-letnie', lata: 12, marza: 0.0250 },
  COI: { nazwa: 'COI — 4-letnie', lata: 4, marza: 0.0150 },
};

/* ----------------------------------------------------------
   GŁÓWNA FUNKCJA OBLICZENIOWA — pętla MIESIĘCZNA
   ---------------------------------------------------------- */

function obliczObligacje(kapital, typObligacji, stopaRok1, inflacja, wIKE, doplataRoczna) {
  wIKE = wIKE || false;
  doplataRoczna = doplataRoczna || 0;

  var obligacja = TYPY_OBLIGACJI[typObligacji];
  var lata = obligacja.lata;
  var marza = obligacja.marza;
  var miesiacyRazem = lata * 12;
  var doplataMiesieczna = doplataRoczna / 12;

  var kapitalBiezacy = kapital;
  var doplataLaczna = 0;
  var zyskSkumulowany = 0;

  var historiaMiesieczna = [];
  var historiaRoczna = [];

  for (var miesiac = 1; miesiac <= miesiacyRazem; miesiac++) {
    var rok = Math.ceil(miesiac / 12);

    // Stopa miesięczna = roczna / 12
    var stopaRoczna = (rok === 1) ? stopaRok1 : (inflacja + marza);
    var stopaMiesieczna = stopaRoczna / 12;

    // Dopłata na początku miesiąca — od razu pracuje
    if (doplataMiesieczna > 0) {
      kapitalBiezacy += doplataMiesieczna;
      doplataLaczna += doplataMiesieczna;
    }

    // Odsetki od kapitału (już z dopłatą)
    var odsetkiMiesieczne = kapitalBiezacy * stopaMiesieczna;
    kapitalBiezacy += odsetkiMiesieczne;
    zyskSkumulowany += odsetkiMiesieczne;

    historiaMiesieczna.push({
      miesiac: miesiac,
      rok: rok,
      kapital: zaokraglij(kapitalBiezacy),
      doplataLaczna: zaokraglij(doplataLaczna),
      stopa: stopaRoczna,
    });

    // Zapisujemy koniec każdego roku
    if (miesiac % 12 === 0) {
      historiaRoczna.push({
        rok: miesiac / 12,
        kapital: zaokraglij(kapitalBiezacy),
        doplataLaczna: zaokraglij(doplataLaczna),
        stopa: stopaRoczna,
      });
    }
  }

  // Obliczenia końcowe
  var wkladWlasny = kapital + doplataLaczna;
  var zyskNominalny = kapitalBiezacy - wkladWlasny;
  var podatekBelki = wIKE ? 0 : zyskNominalny * PODATEK_BELKI;
  var zyskPoOpodatkowaniu = zyskNominalny - podatekBelki;
  var kapitalKoncowy = wkladWlasny + zyskPoOpodatkowaniu;

  // Zysk realny dla obligacji indeksowanych inflacją:
  // Obligacje EDO/ROS/ROD/COI działają tak że rok 2+ = inflacja + marża.
  // Inflacja jest już WBUDOWANA w oprocentowanie — obligacje same kompensują inflację.
  // Dlatego zysk realny to tylko marża ponad inflację (minus podatek Belki).
  //
  // Obliczamy to przez symulację "realnego" portfela gdzie stopa = tylko marża (bez inflacji):
  var kapitalRealnyBiezacy = kapital;
  var doplataLacznaRealna = 0;

  for (var mR = 1; mR <= miesiacyRazem; mR++) {
    var rokR = Math.ceil(mR / 12);
    // W roku 1 zysk realny = stopa rok 1 - inflacja (bo rok 1 jest stały, nie indeksowany)
    // W roku 2+ zysk realny = marża (bo inflacja jest skompensowana)
    var stopaRealna = (rokR === 1)
      ? Math.max(stopaRok1 - inflacja, 0)
      : marza;
    var stopaMiesiecznaRealna = stopaRealna / 12;

    if (doplataMiesieczna > 0) {
      kapitalRealnyBiezacy += doplataMiesieczna;
      doplataLacznaRealna += doplataMiesieczna;
    }
    kapitalRealnyBiezacy += kapitalRealnyBiezacy * stopaMiesiecznaRealna;
  }

  var wkladWlasnyRealny = kapital + doplataLacznaRealna;
  var zyskRealnyBrutto = kapitalRealnyBiezacy - wkladWlasnyRealny;
  var podatekRealny = wIKE ? 0 : zyskRealnyBrutto * PODATEK_BELKI;
  var kapitalRealny = wkladWlasnyRealny + zyskRealnyBrutto - podatekRealny;
  var zyskRealny = kapitalRealny - wkladWlasnyRealny;

  // CAGR liczony od całego wkładu własnego
  var podstawaCagr = Math.max(wkladWlasny, 1);
  var cagrNominalny = Math.pow(kapitalKoncowy / podstawaCagr, 1 / lata) - 1;
  var cagrRealny = Math.pow(kapitalRealny / Math.max(wkladWlasnyRealny, 1), 1 / lata) - 1;

  return {
    kapital: kapital,
    typObligacji: typObligacji,
    lata: lata,
    stopaRok1: stopaRok1,
    inflacja: inflacja,
    wIKE: wIKE,
    doplataRoczna: zaokraglij(doplataRoczna),
    doplataLaczna: zaokraglij(doplataLaczna),
    wkladWlasny: zaokraglij(wkladWlasny),
    zyskNominalny: zaokraglij(zyskNominalny),
    podatekBelki: zaokraglij(podatekBelki),
    zyskPoOpodatkowaniu: zaokraglij(zyskPoOpodatkowaniu),
    kapitalKoncowy: zaokraglij(kapitalKoncowy),
    zyskRealny: zaokraglij(zyskRealny),
    kapitalRealny: zaokraglij(kapitalRealny),
    cagrNominalny: zaokraglij(cagrNominalny, 4),
    cagrRealny: zaokraglij(cagrRealny, 4),
    historiaMiesieczna: historiaMiesieczna,
    historiaRoczna: historiaRoczna,
  };
}

/* ----------------------------------------------------------
   PORÓWNANIE Z LOKATĄ — też miesięcznie
   ---------------------------------------------------------- */

function obliczLokata(kapital, stopaRoczna, lata, wIKE, doplataRoczna) {
  wIKE = wIKE || false;
  doplataRoczna = doplataRoczna || 0;

  var doplataMiesieczna = doplataRoczna / 12;
  var kapitalBiezacy = kapital;
  var stopaMiesieczna = stopaRoczna / 12;
  var miesiacyRazem = lata * 12;
  var zyskRocznyAkum = 0;

  for (var miesiac = 1; miesiac <= miesiacyRazem; miesiac++) {
    // Dopłata na początku miesiąca
    if (doplataMiesieczna > 0) kapitalBiezacy += doplataMiesieczna;

    var odsetki = kapitalBiezacy * stopaMiesieczna;
    kapitalBiezacy += odsetki;
    zyskRocznyAkum += odsetki;

    // Podatek Belki od lokaty pobierany co rok
    if (miesiac % 12 === 0 && !wIKE) {
      var podatek = zyskRocznyAkum * PODATEK_BELKI;
      kapitalBiezacy -= podatek;
      zyskRocznyAkum = 0;
    }
  }

  var doplataLaczna = doplataRoczna * lata;
  var wkladWlasny = kapital + doplataLaczna;

  return {
    kapitalKoncowy: zaokraglij(kapitalBiezacy),
    zysk: zaokraglij(kapitalBiezacy - wkladWlasny),
  };
}

/* ----------------------------------------------------------
   OBSŁUGA INTERFEJSU
   ---------------------------------------------------------- */

var aktualnyWykres = null;
var widokWykresu = 'lata';
var aktualnyOkres = 'miesiecznie';

function aktualizujKalkulator() {
  var utils = window.ETF.utils;
  var formatujZl = utils.formatujZl;
  var formatujProc = utils.formatujProcent;
  var animuj = utils.animujLiczbe;

  var kapital = utils.pobierzWartosc('input-kapital', 10000);
  var typEl = document.getElementById('input-typ');
  var typ = typEl ? typEl.value : 'EDO';
  var stopaRok1 = utils.pobierzWartosc('input-stopa', 6.6) / 100;
  var inflacja = utils.pobierzWartosc('input-inflacja', 3.5) / 100;
  var ikeEl = document.getElementById('input-ike');
  var wIKE = ikeEl ? ikeEl.checked : false;
  var stopaLokaty = utils.pobierzWartosc('input-lokata', 4.5) / 100;
  var doplata = utils.pobierzWartosc('input-doplata', 0);

  // Przeliczamy na roczną
  var doplataRoczna = (aktualnyOkres === 'miesiecznie') ? doplata * 12 : doplata;

  if (kapital < 0 || stopaRok1 <= 0) return;
  if (kapital === 0 && doplataRoczna === 0) return;

  var wyniki = obliczObligacje(kapital, typ, stopaRok1, inflacja, wIKE, doplataRoczna);
  var lokata = obliczLokata(kapital, stopaLokaty, wyniki.lata, wIKE, doplataRoczna);

  // Kafelki główne
  animuj('wynik-kapital-koncowy', wyniki.kapitalKoncowy, formatujZl);
  animuj('wynik-wklad-wlasny', wyniki.wkladWlasny, formatujZl);
  animuj('wynik-doplata-laczna', wyniki.doplataLaczna, formatujZl);
  animuj('wynik-zysk-nominalny', wyniki.zyskNominalny, formatujZl);
  animuj('wynik-podatek-belki', wyniki.podatekBelki, formatujZl);
  animuj('wynik-zysk-po-podatku', wyniki.zyskPoOpodatkowaniu, formatujZl);
  animuj('wynik-zysk-realny', wyniki.zyskRealny, formatujZl);
  animuj('wynik-lokata-porownanie', lokata.zysk, formatujZl);
  // Kafelek porównania — osobne ID żeby uniknąć duplikatu
  animuj('wynik-obligacje-porownanie', wyniki.zyskPoOpodatkowaniu, formatujZl);

  // Aktualizujemy wykres
  rysujWykres(wyniki, kapital, stopaLokaty, wIKE, doplataRoczna);

  var elCagr = document.getElementById('wynik-cagr');
  if (elCagr) elCagr.textContent = formatujProc(wyniki.cagrNominalny);

  var elCagrRealny = document.getElementById('wynik-cagr-realny');
  if (elCagrRealny) elCagrRealny.textContent = formatujProc(wyniki.cagrRealny);

  // Różnica obligacje vs lokata
  var roznica = wyniki.zyskPoOpodatkowaniu - lokata.zysk;
  var elRoznica = document.getElementById('wynik-roznica-lokata');
  if (elRoznica) {
    elRoznica.textContent = (roznica >= 0 ? '+' : '') + formatujZl(roznica);
    elRoznica.style.color = roznica >= 0 ? 'var(--color-green-500)' : 'var(--color-error)';
  }

  // Hint dopłaty
  aktualizujHintDoplaty(doplata, wyniki.lata);

  // Wykres i tabela
  rysujWykres(wyniki, kapital, stopaLokaty, wIKE, doplataRoczna);
  aktualizujTabele(wyniki, formatujZl, formatujProc);
}

/* ----------------------------------------------------------
   HINT DOPŁATY
   ---------------------------------------------------------- */

function aktualizujHintDoplaty(doplata, lata) {
  var hint = document.getElementById('hint-doplata');
  if (!hint) return;

  if (doplata <= 0) {
    hint.textContent = 'Wpisz kwotę którą chcesz regularnie dokładać';
    return;
  }

  // Formatuj liczbę z separatorem tysięcy (spacja) — krótszy tekst
  function fmt(n) {
    return Math.round(n).toLocaleString('pl-PL') + ' zł';
  }

  if (aktualnyOkres === 'miesiecznie') {
    var rocznie = doplata * 12;
    var lacznie = rocznie * lata;
    // Podziel na dwie linie żeby nie rozszerzał kontenera
    hint.innerHTML = fmt(doplata) + '/mies. = ' + fmt(rocznie) + '/rok<br>' + fmt(lacznie) + ' łącznie przez ' + lata + ' lat';
  } else {
    hint.innerHTML = fmt(doplata) + '/rok = ' + fmt(Math.round(doplata / 12)) + '/mies.';
  }
}

/* ----------------------------------------------------------
   PRZEŁĄCZNIK OKRESU DOPŁATY
   ---------------------------------------------------------- */

function ustawOkres(okres) {
  aktualnyOkres = okres;

  var btnMies = document.getElementById('btn-miesiecznie');
  var btnRocz = document.getElementById('btn-rocznie');

  if (okres === 'miesiecznie') {
    btnMies.className = 'btn-okres btn-okres--aktywny';
    btnRocz.className = 'btn-okres';
  } else {
    btnRocz.className = 'btn-okres btn-okres--aktywny';
    btnMies.className = 'btn-okres';
  }

  aktualizujKalkulator();
}

/* ----------------------------------------------------------
   PRZEŁĄCZNIK WIDOKU WYKRESU
   ---------------------------------------------------------- */

function ustawWidokWykresu(widok) {
  widokWykresu = widok;

  var btnLata = document.getElementById('btn-wykres-lata');
  var btnMiesiace = document.getElementById('btn-wykres-miesiace');

  if (widok === 'lata') {
    btnLata.className = 'btn-okres btn-okres--aktywny';
    btnMiesiace.className = 'btn-okres';
  } else {
    btnMiesiace.className = 'btn-okres btn-okres--aktywny';
    btnLata.className = 'btn-okres';
  }

  aktualizujKalkulator();
}

/* ----------------------------------------------------------
   WYKRES
   ---------------------------------------------------------- */

function rysujWykres(wyniki, kapitalPoczatkowy, stopaLokaty, wIKE, doplataRoczna) {
  var canvas = document.getElementById('wykres-obligacji');
  if (!canvas || typeof Chart === 'undefined' || !window.ETF || !window.ETF.charts) return;
  if (aktualnyWykres) aktualnyWykres.destroy();

  var ctx = canvas.getContext('2d');
  var historia = (widokWykresu === 'lata') ? wyniki.historiaRoczna : wyniki.historiaMiesieczna;

  var etykiety = historia.map(function (p) {
    return widokWykresu === 'lata' ? 'Rok ' + p.rok : 'M' + p.miesiac;
  });

  var daneObligacji = historia.map(function (p) { return p.kapital; });

  // Lokata — obliczamy punkty do wykresu
  var daneLokaty = [];
  var kapitalLokaty = kapitalPoczatkowy;
  var stopaMiesieczna = stopaLokaty / 12;
  var doplataMiesieczna = doplataRoczna / 12;
  var zyskRocznyAkum = 0;
  var punktow = historia.length;
  var krokMiesieczny = (widokWykresu === 'lata') ? 12 : 1;

  for (var i = 1; i <= punktow; i++) {
    for (var m = 0; m < krokMiesieczny; m++) {
      if (doplataMiesieczna > 0) kapitalLokaty += doplataMiesieczna;
      var odsetki = kapitalLokaty * stopaMiesieczna;
      kapitalLokaty += odsetki;
      zyskRocznyAkum += odsetki;
      var miesiacGlobalny = (i - 1) * krokMiesieczny + m + 1;
      if (miesiacGlobalny % 12 === 0 && !wIKE) {
        kapitalLokaty -= zyskRocznyAkum * PODATEK_BELKI;
        zyskRocznyAkum = 0;
      }
    }
    daneLokaty.push(zaokraglij(kapitalLokaty));
  }

  // Linia wkładu własnego
  var daneWklad = historia.map(function (p) {
    return zaokraglij(kapitalPoczatkowy + p.doplataLaczna);
  });

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
            return 'Wartość: ' + window.formatujZl(context.parsed.y);
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
            return 'Wartość: ' + window.formatujZl(context.parsed.y);
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
  
  aktualnyWykres = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etykiety,
      datasets: [
        {
          label: 'Obligacje skarbowe',
          data: daneObligacji,
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
          data: daneLokaty,
          borderColor: '#f4a261',
          backgroundColor: 'rgba(244, 162, 97, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Wkład własny',
          data: daneWklad,
          borderColor: '#1A56A0',
          backgroundColor: 'rgba(26, 86, 160, 0.15)',
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
   TABELA ROK PO ROKU
   ---------------------------------------------------------- */

function aktualizujTabele(wyniki, formatujZl, formatujProc) {
  var tbody = document.getElementById('tabela-body');
  if (!tbody) return;

  tbody.innerHTML = wyniki.historiaRoczna.map(function (r) {
    return '<tr>' +
      '<td><strong>Rok ' + r.rok + '</strong></td>' +
      '<td>' + formatujProc(r.stopa) + '</td>' +
      '<td style="color: var(--color-green-500)">' + formatujZl(r.doplataLaczna) + '</td>' +
      '<td><strong>' + formatujZl(r.kapital) + '</strong></td>' +
      '</tr>';
  }).join('');
}

/* ----------------------------------------------------------
   INICJALIZACJA
   ---------------------------------------------------------- */

function init() {
  aktualizujKalkulator();

  ['input-kapital', 'input-typ', 'input-stopa', 'input-inflacja', 'input-lokata', 'input-doplata']
    .forEach(function (id) {
      var pole = document.getElementById(id);
      if (pole) {
        pole.addEventListener('input', aktualizujKalkulator);
        pole.addEventListener('change', aktualizujKalkulator);
      }
    });

  var checkboxIKE = document.getElementById('input-ike');
  if (checkboxIKE) checkboxIKE.addEventListener('change', aktualizujKalkulator);
}

document.addEventListener('DOMContentLoaded', init);
