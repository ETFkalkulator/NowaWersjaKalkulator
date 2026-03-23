/* ============================================================
   porownywarka.js — Integrated & Fixed (Scenario UI Fix)
   ETFkalkulator.pl
   ============================================================ */

'use strict';

var PODATEK_BELKI = 0.19;
var wykresPorown = null;

/**
 * POMOCNICZE FUNKCJE FORMATUJĄCE
 */
function formatujZl(val) {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);
}

function formatujProcent(val) {
    return (val * 100).toFixed(2) + '%';
}

function pobierzWartosc(id, def) {
    const el = document.getElementById(id);
    return el ? parseFloat(el.value) || def : def;
}

/**
 * SILNIK OBLICZENIOWY - STRATEGIE (ETF/LOKATA)
 */
function obliczStrategie(params) {
    var kapital = params.kapital;
    var doplata = params.doplata;
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
            historia.push({ rok: m / 12, kapital: kapitalBiezacy });
        }
    }

    var wkladLaczny = kapital + doplata * lata * 12;
    var zyskNominalny = kapitalBiezacy - wkladLaczny;
    var podatekKwota = Math.max(0, zyskNominalny * podatek);
    var kapitalNetto = kapitalBiezacy - podatekKwota;
    var zyskPoPodatku = kapitalNetto - wkladLaczny;
    
    var wsplInfl = Math.pow(1 + inflacja, lata);
    var kapitalRealny = kapitalNetto / wsplInfl;
    var zyskRealny = kapitalRealny - wkladLaczny;

    var cagr = lata > 0 ? (Math.pow(kapitalNetto / Math.max(wkladLaczny, 1), 1 / lata) - 1) : 0;
    var cagrReal = lata > 0 ? (Math.pow(kapitalRealny / Math.max(wkladLaczny, 1), 1 / lata) - 1) : 0;

    return {
        wkladLaczny: wkladLaczny,
        kapitalNetto: kapitalNetto,
        kapitalRealny: kapitalRealny,
        zyskPoPodatku: zyskPoPodatku,
        zyskRealny: zyskRealny,
        podatekKwota: podatekKwota,
        cagr: cagr,
        cagrReal: cagrReal,
        historia: historia
    };
}

/**
 * SILNIK OBLICZENIOWY - OBLIGACJE EDO
 */
function obliczEDO(params) {
    var kapital = params.kapital;
    var doplata = params.doplata;
    var lata = params.lata;
    var inflacja = params.inflacja / 100;
    var marza = params.marza / 100;
    var stopaRok1 = params.stopaRok1 / 100;
    var podatek = params.bezPodatku ? 0 : PODATEK_BELKI;

    var historia = [];
    var kapitalBiezacy = kapital;
    var sumaWplat = kapital;

    for (var r = 1; r <= lata; r++) {
        var stopaRoku = (r === 1) ? stopaRok1 : (inflacja + marza);
        var dopLatRoczna = doplata * 12;
        
        kapitalBiezacy += dopLatRoczna;
        sumaWplat += dopLatRoczna;
        
        var odsetki = kapitalBiezacy * stopaRoku;
        kapitalBiezacy += odsetki;
        
        historia.push({ rok: r, kapital: kapitalBiezacy });
    }

    var zyskNominalny = kapitalBiezacy - sumaWplat;
    var podatekKwota = Math.max(0, zyskNominalny * podatek);
    var kapitalNetto = kapitalBiezacy - podatekKwota;
    var zyskPoPodatku = kapitalNetto - sumaWplat;
    
    var wsplInfl = Math.pow(1 + inflacja, lata);
    var kapitalRealny = kapitalNetto / wsplInfl;
    var zyskRealny = kapitalRealny - sumaWplat;

    var cagr = lata > 0 ? (Math.pow(kapitalNetto / Math.max(sumaWplat, 1), 1 / lata) - 1) : 0;
    var cagrReal = lata > 0 ? (Math.pow(kapitalRealny / Math.max(sumaWplat, 1), 1 / lata) - 1) : 0;

    return {
        wkladLaczny: sumaWplat,
        kapitalNetto: kapitalNetto,
        kapitalRealny: kapitalRealny,
        zyskPoPodatku: zyskPoPodatku,
        zyskRealny: zyskRealny,
        podatekKwota: podatekKwota,
        cagr: cagr,
        cagrReal: cagrReal,
        historia: historia
    };
}

/**
 * GŁÓWNA FUNKCJA REFRESH
 */
function obliczPorownanie() {
    var kapital = pobierzWartosc('por-kapital', 10000);
    var doplata = pobierzWartosc('por-doplata', 500);
    var lata = pobierzWartosc('por-lata', 10);
    var inflacja = pobierzWartosc('por-inflacja', 3.5);
    var bezPodatku = document.getElementById('por-ike') ? document.getElementById('por-ike').checked : false;

    // 1. Oblicz ETF
    var etf = obliczStrategie({
        kapital: kapital, doplata: doplata, lata: lata, inflacja: inflacja,
        stopa: pobierzWartosc('por-stopa-etf', 7), bezPodatku: bezPodatku
    });

    // 2. Oblicz Obligacje
    var obl = obliczEDO({
        kapital: kapital, doplata: doplata, lata: lata, inflacja: inflacja,
        stopaRok1: pobierzWartosc('por-stopa-rok1', 5.6), marza: pobierzWartosc('por-marza', 2.0),
        bezPodatku: bezPodatku
    });

    // 3. Oblicz Lokatę
    var lok = obliczStrategie({
        kapital: kapital, doplata: doplata, lata: lata, inflacja: inflacja,
        stopa: pobierzWartosc('por-stopa-lok', 4.5), bezPodatku: bezPodatku
    });

    aktualizujWynikiUI(etf, obl, lok, lata, bezPodatku);
}

/**
 * AKTUALIZACJA WIDOKU (UI)
 */
function aktualizujWynikiUI(etf, obl, lok, lata, bezPodatku) {
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    // ETF Panel
    set('por-etf-kapital', formatujZl(etf.kapitalNetto));
    set('por-etf-realny', formatujZl(etf.kapitalRealny));
    set('por-etf-zysk', formatujZl(etf.zyskPoPodatku));
    set('por-etf-zysk-r', formatujZl(etf.zyskRealny));
    set('por-etf-podatek', formatujZl(etf.podatekKwota));
    set('por-etf-cagr', formatujProcent(etf.cagr));
    set('por-etf-cagr-r', formatujProcent(etf.cagrReal));

    // Obligacje Panel
    set('por-obligacje-kapital', formatujZl(obl.kapitalNetto));
    set('por-obligacje-realny', formatujZl(obl.kapitalRealny));
    set('por-obligacje-zysk', formatujZl(obl.zyskPoPodatku));
    set('por-obligacje-zysk-r', formatujZl(obl.zyskRealny));
    set('por-obligacje-podatek', formatujZl(obl.podatekKwota));
    set('por-obligacje-cagr', formatujProcent(obl.cagr));
    set('por-obligacje-cagr-r', formatujProcent(obl.cagrReal));

    // Lokata Panel
    set('por-lokata-kapital', formatujZl(lok.kapitalNetto));
    set('por-lokata-realny', formatujZl(lok.kapitalRealny));
    set('por-lokata-zysk', formatujZl(lok.zyskPoPodatku));
    set('por-lokata-zysk-r', formatujZl(lok.zyskRealny));
    set('por-lokata-podatek', formatujZl(lok.podatekKwota));
    set('por-lokata-cagr', formatujProcent(lok.cagr));
    set('por-lokata-cagr-r', formatujProcent(lok.cagrReal));

    // Winner Banner
    var maxVal = Math.max(etf.kapitalNetto, obl.kapitalNetto, lok.kapitalNetto);
    var winnerName = (etf.kapitalNetto === maxVal) ? "ETF Globalny" : (obl.kapitalNetto === maxVal) ? "Obligacje EDO" : "Lokata Bankowa";
    set('por-zwyciezca-nazwa', winnerName);
    set('por-zwyciezca-kwota', formatujZl(maxVal));
    
    var wklad = etf.wkladLaczny;
    var przewagaPercent = ((maxVal - wklad) / wklad * 100).toFixed(1);
    set('por-zwyciezca-przewaga', "Całkowity zwrot z inwestycji: " + przewagaPercent + "%");

    // Scenarios Summary (Quick View)
    var pInput = {
        kapital: pobierzWartosc('por-kapital', 10000),
        doplata: pobierzWartosc('por-doplata', 500),
        lata: lata,
        inflacja: pobierzWartosc('por-inflacja', 3.5),
        bezPodatku: bezPodatku
    };
    
    set('scen-pes-kapital', formatujZl(obliczStrategie(Object.assign({}, pInput, {stopa:4})).kapitalNetto));
    set('scen-pes-zysk', formatujZl(obliczStrategie(Object.assign({}, pInput, {stopa:4})).zyskPoPodatku));
    set('scen-pes-cagr', formatujProcent(obliczStrategie(Object.assign({}, pInput, {stopa:4})).cagr));
    
    set('scen-baz-kapital', formatujZl(etf.kapitalNetto));
    set('scen-baz-zysk', formatujZl(etf.zyskPoPodatku));
    set('scen-baz-cagr', formatujProcent(etf.cagr));
    
    set('scen-opt-kapital', formatujZl(obliczStrategie(Object.assign({}, pInput, {stopa:10})).kapitalNetto));
    set('scen-opt-zysk', formatujZl(obliczStrategie(Object.assign({}, pInput, {stopa:10})).zyskPoPodatku));
    set('scen-opt-cagr', formatujProcent(obliczStrategie(Object.assign({}, pInput, {stopa:10})).cagr));

    // Status Podatkowy
    set('txt-por-podatek-status', bezPodatku ? "Konto IKE/IKZE (0% podatku)" : "Opodatkowanie standardowe (19%)");

    // Tabela i Wykres
    rysujTabele(lata, etf, obl, lok);
    rysujWykres(lata, etf, obl, lok);
}

function rysujTabele(lata, etf, obl, lok) {
    var tbody = document.getElementById('por-tabela-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    for (var r = 1; r <= lata; r++) {
        var eK = (etf.historia[r-1] || {}).kapital || 0;
        var oK = (obl.historia[r-1] || {}).kapital || 0;
        var lK = (lok.historia[r-1] || {}).kapital || 0;
        var max = Math.max(eK, oK, lK);

        var tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors';
        tr.innerHTML = 
            '<td class="sticky left-0 z-10 bg-white dark:bg-slate-950 px-4 py-3 text-xs font-bold border-r border-slate-100 dark:border-slate-800">Rok ' + r + '</td>' +
            '<td class="px-3 py-4 text-right ' + (eK===max?'font-bold text-blue-600':'') + '">' + formatujZl(eK) + '</td>' +
            '<td class="px-3 py-4 text-right ' + (oK===max?'font-bold text-emerald-600':'') + '">' + formatujZl(oK) + '</td>' +
            '<td class="px-3 py-4 text-right ' + (lK===max?'font-bold text-amber-600':'') + '">' + formatujZl(lK) + '</td>';
        tbody.appendChild(tr);
    }
}

function rysujWykres(lata, etf, obl, lok) {
    var canvas = document.getElementById('por-wykres');
    if (!canvas || !window.Chart) return;

    if (wykresPorown) wykresPorown.destroy();

    var isDark = document.documentElement.classList.contains('dark');
    var textColor = isDark ? '#94a3b8' : '#64748b';

    wykresPorown = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: Array.from({length: lata}, (_, i) => 'Rok ' + (i+1)),
            datasets: [
                { label: 'ETF', data: etf.historia.map(h => h.kapital), borderColor: '#1A56A0', tension: 0.4, pointRadius: 2 },
                { label: 'Obligacje EDO', data: obl.historia.map(h => h.kapital), borderColor: '#40916C', tension: 0.4, pointRadius: 2 },
                { label: 'Lokata', data: lok.historia.map(h => h.kapital), borderColor: '#f4a261', tension: 0.4, pointRadius: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor, font: { size: 11 } } } },
            scales: {
                x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } },
                y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }
            }
        }
    });
}

/**
 * OBSŁUGA SCENARIUSZY (UI FIX)
 */
function ustawScenariusz(scen) {
    var rates = { 'pesymistyczny': 4, 'bazowy': 7, 'optymistyczny': 10 };
    var val = rates[scen] || 7;
    
    // 1. Zaktualizuj input
    var el = document.getElementById('por-stopa-etf');
    if (el) el.value = val;

    // 2. Podświetl wizualnie kafelek (Visual Feedback)
    ['pesymistyczny', 'bazowy', 'optymistyczny'].forEach(function(k) {
        var card = document.getElementById('scen-card-' + k);
        if (!card) return;
        
        if (k === scen) {
            card.classList.add('border-blue-500', 'bg-blue-50/50', 'ring-2', 'ring-blue-500/20');
            card.classList.remove('border-stitch-border', 'bg-primary/5');
        } else {
            card.classList.remove('border-blue-500', 'bg-blue-50/50', 'ring-2', 'ring-blue-500/20', 'bg-primary/5');
            card.classList.add('border-stitch-border');
        }
    });

    // 3. Przelicz wszystko
    obliczPorownanie();
}

document.addEventListener('DOMContentLoaded', function() {
    var inputs = ['por-kapital', 'por-doplata', 'por-lata', 'por-inflacja', 'por-stopa-etf', 'por-stopa-rok1', 'por-marza', 'por-stopa-lok'];
    
    var timer;
    function debouncedRecalc() {
        clearTimeout(timer);
        timer = setTimeout(obliczPorownanie, 150);
    }

    inputs.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', debouncedRecalc);
    });

    var ike = document.getElementById('por-ike');
    if (ike) ike.addEventListener('change', obliczPorownanie);

    // Pierwsze przeliczenie
    obliczPorownanie();
});

window.ustawScenariusz = ustawScenariusz;
window.obliczPorownanie = obliczPorownanie;
