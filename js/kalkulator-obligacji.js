/* ============================================================
   kalkulator-obligacji.js — Fixed IDs & Logic
   ETFkalkulator.pl
   ============================================================ */

'use strict';

const BOND_CONSTANTS = {
    EDO: { name: '10-letnie EDO', years: 10, yr1: 0.0560, margin: 0.02, penalty: 2.00, fee: 0, min: 1, type: 'inflation' },
    COI: { name: '4-letnie COI', years: 4, yr1: 0.0560, margin: 0.015, penalty: 0.70, fee: 0, min: 1, type: 'inflation' },
    TOS: { name: '3-letnie TOS', years: 3, fixed: 0.0520, penalty: 0.70, fee: 0, min: 1, type: 'fixed' },
    ROR: { name: '1-roczne ROR', years: 1, fixedYr1: 0.0500, penalty: 0.50, fee: 0, min: 1, type: 'fixed' },
    DOR: { name: '2-letnie DOR', years: 2, fixedYr1: 0.0525, penalty: 0.70, fee: 0, min: 1, type: 'fixed' },
    ROS: { name: '6-letnie ROS (800+)', years: 6, yr1: 0.0580, margin: 0.0175, penalty: 0.70, fee: 0, min: 1, type: 'inflation' },
    ROD: { name: '12-letnie ROD (800+)', years: 12, yr1: 0.0600, margin: 0.02, penalty: 2.00, fee: 0, min: 1, type: 'inflation' }
};

// Note: Using global utility functions from utils.js (formatujZl, pobierzWartosc, zaokraglij, animuj)
// for consistency and to avoid redundant code.

let myChartObl = null;

function obliczWszystko() {
    const typ = document.getElementById('input-typ').value;
    const bond = BOND_CONSTANTS[typ];
    const kapital = pobierzWartosc('input-kapital', 10000);
    const doplata = pobierzWartosc('input-doplata', 0);
    const inflacja = pobierzWartosc('input-inflacja', 3.5) / 100;
    const wIKE = document.getElementById('input-ike').checked;
    const podatek = wIKE ? 0 : 0.19;

    let historia = [];
    let obecnyKapital = kapital;
    let sumaWplat = kapital;
    let sumaZyskuNominalnego = 0;

    for (let r = 1; r <= bond.years; r++) {
        let stopa = (r === 1) ? (bond.yr1 || bond.fixed || bond.fixedYr1) : (bond.type === 'inflation' ? (inflacja + bond.margin) : (bond.fixed || bond.fixedYr1));
        
        let zyskWRoku = obecnyKapital * stopa;
        obecnyKapital += zyskWRoku;
        sumaZyskuNominalnego += zyskWRoku;
        
        // Dopłata na koniec roku (uproszczenie)
        obecnyKapital += doplata * 12;
        sumaWplat += doplata * 12;

        historia.push({
            rok: r,
            sumaWplat: sumaWplat,
            zyskNominalny: sumaZyskuNominalnego,
            kapitalSkumulowany: obecnyKapital,
            oprocentowanie: stopa,
            realnaSila: obecnyKapital / Math.pow(1 + inflacja, r)
        });
    }

    // Obliczenia zostaną wykonane poniżej uwzględniając rok wykupu
    // Aktualizacja UI (ID dopasowane do HTML)
    const animuj = (id, val, fmt) => {
        const el = document.getElementById(id);
        if (el) {
            if (typeof window.animuj === 'function') {
                window.animuj(id, val, fmt);
            } else {
                el.textContent = fmt(val);
            }
        }
    };

    // Pobranie kary (uproszczenie: kara z zeszłego roku lub bieżącego)
    const wykupRok = pobierzWartosc('input-wykup', bond.years);
    let kara = 0;
    if (wykupRok < bond.years) {
        // Kara to zwykle stała kwota za sztukę (np. 2 zł dla EDO)
        // W uproszczeniu: (kapital / 100) * bond.penalty
        kara = (kapital / 100) * bond.penalty;
    }

    const kapitalBrutto = historia[wykupRok - 1].kapitalSkumulowany;
    const zyskBrutto = kapitalBrutto - historia[wykupRok - 1].sumaWplat;
    const podatekKwota = wIKE ? 0 : Math.max(0, zyskBrutto * podatek);
    const sumaWplatWykup = historia[wykupRok - 1].sumaWplat;
    
    // Kara nie może przekroczyć narosłych odsetek (zasada bezpieczeństwa kapitału)
    const karaFinal = Math.min(kara, zyskBrutto);
    const kapitalNetto = kapitalBrutto - podatekKwota - karaFinal;
    const realnaSilaNetto = kapitalNetto / Math.pow(1 + inflacja, wykupRok);

    animuj('ob-wynik-kapital', kapitalNetto, formatujZl); // Poprawione ID
    animuj('ob-wynik-wklad', sumaWplatWykup, formatujZl); // Poprawione ID
    animuj('ob-wynik-zysk', zyskBrutto, formatujZl); // Poprawione ID
    animuj('ob-wynik-podatek', podatekKwota, formatujZl); // Poprawione ID
    animuj('ob-wynik-kara', karaFinal, formatujZl); // Dodane ID
    animuj('ob-wynik-realny', realnaSilaNetto, formatujZl); // Poprawione ID
    
    const cagr = Math.pow(kapitalNetto / sumaWplatWykup, 1 / wykupRok) - 1;
    const cagrReal = Math.pow(realnaSilaNetto / sumaWplatWykup, 1 / wykupRok) - 1;
    
    animuj('ob-wynik-cagr', (cagr * 100).toFixed(2) + '%', v => v);
    animuj('ob-wynik-cagr-real', (cagrReal * 100).toFixed(2) + '%', v => v);

    // Tabela - aktualizacja do wykupRok
    const tbody = document.getElementById('tabela-body');
    if (tbody) {
        tbody.textContent = '';
        historia.forEach((h, idx) => {
            if (idx >= wykupRok) return; // Ukrywamy lata po wykupie
            const tr = document.createElement('tr');
            
            const createTd = (text, className = '') => {
                const td = document.createElement('td');
                td.textContent = text;
                if (className) td.className = className;
                return td;
            };

            tr.append(
                createTd(`Rok ${h.rok}`, "px-4 py-3 font-bold"),
                createTd(formatujZl(h.sumaWplat), "px-3 py-4 text-right"),
                createTd(formatujZl(h.zyskNominalny), "px-3 py-4 text-right text-emerald-500"),
                createTd(formatujZl(h.kapitalSkumulowany), "px-3 py-4 text-right font-bold"),
                createTd(`${(h.oprocentowanie * 100).toFixed(2)}%`, "px-3 py-4 text-right"),
                createTd(formatujZl(h.realnaSila), "px-3 py-4 text-right text-slate-400")
            );
            tbody.appendChild(tr);
        });
    }

    updateChartObl(historia.slice(0, wykupRok));
}

function updateChartObl(historia) {
    const ctx = document.getElementById('chartObligacje');
    if (!ctx || !window.Chart) return;

    if (myChartObl) myChartObl.destroy();

    myChartObl = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historia.map(h => 'Rok ' + h.rok),
            datasets: [
                { label: 'Kapitał Końcowy', data: historia.map(h => h.kapitalSkumulowany), borderColor: '#0d7ff2', tension: 0.3, fill: true, backgroundColor: 'rgba(13, 127, 242, 0.1)' },
                { label: 'Wkład Własny', data: historia.map(h => h.sumaWplat), borderColor: '#f59e0b', borderDash: [5, 5], fill: false }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            animation: { duration: 400 }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = [
        'input-typ', 'input-kapital', 'input-doplata', 'input-inflacja', 
        'input-ike', 'input-wykup', 'input-custom-marza', 'input-custom-yr1'
    ];
    
    const debouncedOblicz = (typeof window.debounce === 'function') 
        ? window.debounce(obliczWszystko, 250) 
        : obliczWszystko;

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        
        el.addEventListener('change', obliczWszystko); // Zmiana selektora/checkboxa - natychmiast
        if (el.type === 'text' || el.type === 'number' || el.type === 'range') {
            el.addEventListener('input', debouncedOblicz); // Pisanie - z opóźnieniem
        }
    });

    // Update range display
    const range = document.getElementById('input-wykup');
    const display = document.getElementById('wykup-val-display');
    if (range && display) {
        range.addEventListener('input', () => {
            display.textContent = range.value;
        });
    }

    // Initial run
    setTimeout(obliczWszystko, 100);
});
