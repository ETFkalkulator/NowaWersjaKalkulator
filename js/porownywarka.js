/* ============================================================
   porownywarka.js — Integrated & Fixed (Scenario UI Fix)
   ETFkalkulator.pl
   ============================================================ */

'use strict';

var PODATEK_BELKI = 0.19;
var wykresPorown = null;

/**
 * POMOCNICZE FUNKCJE
 * Korzystamy z globalnych funkcji w utils.js: formatujZl, formatujProcent, animuj.
 */

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
    const set = (id, val, formatFn = null) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (typeof val === 'number' && formatFn) {
            animuj(id, val, formatFn);
        } else {
            el.textContent = val;
        }
    };

    // ETF Panel
    set('por-etf-kapital', etf.kapitalNetto, formatujZl);
    set('por-etf-realny', etf.kapitalRealny, formatujZl);
    set('por-etf-zysk', etf.zyskPoPodatku, formatujZl);
    set('por-etf-zysk-r', etf.zyskRealny, formatujZl);
    set('por-etf-podatek', etf.podatekKwota, formatujZl);
    set('por-etf-cagr', etf.cagr, formatujProcent);
    set('por-etf-cagr-r', etf.cagrReal, formatujProcent);

    // Obligacje Panel
    set('por-obligacje-kapital', obl.kapitalNetto, formatujZl);
    set('por-obligacje-realny', obl.kapitalRealny, formatujZl);
    set('por-obligacje-zysk', obl.zyskPoPodatku, formatujZl);
    set('por-obligacje-zysk-r', obl.zyskRealny, formatujZl);
    set('por-obligacje-podatek', obl.podatekKwota, formatujZl);
    set('por-obligacje-cagr', obl.cagr, formatujProcent);
    set('por-obligacje-cagr-r', obl.cagrReal, formatujProcent);

    // Lokata Panel
    set('por-lokata-kapital', lok.kapitalNetto, formatujZl);
    set('por-lokata-realny', lok.kapitalRealny, formatujZl);
    set('por-lokata-zysk', lok.zyskPoPodatku, formatujZl);
    set('por-lokata-zysk-r', lok.zyskRealny, formatujZl);
    set('por-lokata-podatek', lok.podatekKwota, formatujZl);
    set('por-lokata-cagr', lok.cagr, formatujProcent);
    set('por-lokata-cagr-r', lok.cagrReal, formatujProcent);

    // Winner Banner
    var maxVal = Math.max(etf.kapitalNetto, obl.kapitalNetto, lok.kapitalNetto);
    var winnerName = (etf.kapitalNetto === maxVal) ? "ETF Globalny" : (obl.kapitalNetto === maxVal) ? "Obligacje EDO" : "Lokata Bankowa";
    set('por-zwyciezca-nazwa', winnerName);
    set('por-zwyciezca-kwota', maxVal, formatujZl);
    
    var wklad = etf.wkladLaczny;
    var przewagaPercent = (maxVal - wklad) / wklad;
    set('por-zwyciezca-przewaga', "Całkowity zwrot z inwestycji: " + formatujProcent(przewagaPercent));

    // Scenarios Summary (Quick View)
    var pInput = {
        kapital: pobierzWartosc('por-kapital', 10000),
        doplata: pobierzWartosc('por-doplata', 500),
        lata: lata,
        inflacja: pobierzWartosc('por-inflacja', 3.5),
        bezPodatku: bezPodatku
    };
    
    set('scen-pes-kapital', obliczStrategie(Object.assign({}, pInput, {stopa:4})).kapitalNetto, formatujZl);
    set('scen-pes-zysk', obliczStrategie(Object.assign({}, pInput, {stopa:4})).zyskPoPodatku, formatujZl);
    set('scen-pes-cagr', obliczStrategie(Object.assign({}, pInput, {stopa:4})).cagr, formatujProcent);
    
    set('scen-baz-kapital', etf.kapitalNetto, formatujZl);
    set('scen-baz-zysk', etf.zyskPoPodatku, formatujZl);
    set('scen-baz-cagr', etf.cagr, formatujProcent);
    
    set('scen-opt-kapital', obliczStrategie(Object.assign({}, pInput, {stopa:10})).kapitalNetto, formatujZl);
    set('scen-opt-zysk', obliczStrategie(Object.assign({}, pInput, {stopa:10})).zyskPoPodatku, formatujZl);
    set('scen-opt-cagr', obliczStrategie(Object.assign({}, pInput, {stopa:10})).cagr, formatujProcent);

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
        const createTd = (text, className = "") => {
            const td = document.createElement('td');
            td.textContent = text;
            if (className) td.className = className;
            return td;
        };

        tr.append(
            createTd('Rok ' + r, "sticky left-0 z-10 bg-white dark:bg-slate-950 px-4 py-3 text-xs font-bold border-r border-slate-100 dark:border-slate-800"),
            createTd(formatujZl(eK), "px-3 py-4 text-right " + (eK===max?'font-bold text-blue-600':'')),
            createTd(formatujZl(oK), "px-3 py-4 text-right " + (oK===max?'font-bold text-emerald-600':'')),
            createTd(formatujZl(lK), "px-3 py-4 text-right " + (lK===max?'font-bold text-amber-600':''))
        );
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
