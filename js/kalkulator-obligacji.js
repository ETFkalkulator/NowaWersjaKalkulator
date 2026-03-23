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

let myChartObl = null;

function formatujZl(val) {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);
}

function pobierzWartosc(id, def) {
    const el = document.getElementById(id);
    return el ? parseFloat(el.value) || def : def;
}

function obliczWszystko() {
    const typ = document.getElementById('input-typ').value;
    const bond = BOND_CONSTANTS[typ];
    const kapital = pobierzWartosc('input-kapital', 10000);
    const doplata = pobierzWartosc('input-doplata', 500);
    const inflacja = pobierzWartosc('input-inflacja', 3.5) / 100;
    const wIKE = document.getElementById('input-ike') ? document.getElementById('input-ike').checked : false;
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

    const kapitalNetto = obecnyKapital - (sumaZyskuNominalnego * podatek);
    const zyskNetto = kapitalNetto - sumaWplat;
    const realnaSilaNetto = kapitalNetto / Math.pow(1 + inflacja, bond.years);

    // Aktualizacja UI (ID dopasowane do HTML)
    const animuj = (id, val, fmt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = fmt(val);
    };

    animuj('ob-wynik-kapital-koncowy', kapitalNetto, formatujZl);
    animuj('ob-wynik-wklad-wlasny', sumaWplat, formatujZl);
    animuj('ob-wynik-zysk-nominalny', sumaZyskuNominalnego, formatujZl);
    animuj('ob-wynik-podatek-belki', sumaZyskuNominalnego * podatek, formatujZl);
    animuj('ob-wynik-zysk-realny', realnaSilaNetto - sumaWplat, formatujZl);
    
    const cagr = Math.pow(kapitalNetto / sumaWplat, 1 / bond.years) - 1;
    const cagrReal = Math.pow(realnaSilaNetto / sumaWplat, 1 / bond.years) - 1;
    
    animuj('ob-wynik-cagr', (cagr * 100).toFixed(2) + '%', v => v);
    animuj('ob-wynik-cagr-real', (cagrReal * 100).toFixed(2) + '%', v => v);

    // Tabela
    const tbody = document.getElementById('tabela-body');
    if (tbody) {
        tbody.innerHTML = '';
        historia.forEach(h => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-4 py-3 font-bold">Rok ${h.rok}</td>
                <td class="px-3 py-4 text-right">${formatujZl(h.sumaWplat)}</td>
                <td class="px-3 py-4 text-right text-emerald-500">${formatujZl(h.zyskNominalny)}</td>
                <td class="px-3 py-4 text-right font-bold">${formatujZl(h.kapitalSkumulowany)}</td>
                <td class="px-3 py-4 text-right">${(h.oprocentowanie * 100).toFixed(2)}%</td>
                <td class="px-3 py-4 text-right text-slate-400">${formatujZl(h.realnaSila)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    updateChartObl(historia);
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
        options: { responsive: true, maintainAspectRatio: false }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['input-typ', 'input-kapital', 'input-doplata', 'input-inflacja', 'input-ike'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', obliczWszystko);
        if (el && el.type === 'text') el.addEventListener('input', obliczWszystko);
    });

    obliczWszystko();
});
