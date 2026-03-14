/**
 * Logika Kalkulatora ETF — ETFkalkulator.pl
 * ---------------------------------------
 * Oblicza wzrost kapitału z uwzględnieniem:
 * - Procentu składanego (miesięcznie)
 * - Dopłat miesięcznych
 * - Inflacji (wartość realna)
 * - Podatku Belki (z wyborem IKE/IKZE)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicjalizacja pól i zdarzeń
    const inputs = [
        'input-kapital', 'input-doplata', 'input-horyzont',
        'input-stopa', 'input-inflacja', 'input-ike'
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', obliczWszystko);
        }
    });

    // Inicjalizacja wykresu
    initChart();

    // Pierwsze obliczenie
    obliczWszystko();
});

let myChart = null;

/**
 * Ustawia stopę zwrotu z predefiniowanych scenariuszy
 */
function setStopa(val, inputEl) {
    if (!inputEl) inputEl = document.getElementById('input-stopa');
    inputEl.value = val;

    // Obsługa klas Tailwind dla przycisków
    const buttons = inputEl.parentElement.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.classList.remove('border-primary/50', 'bg-primary/5', 'text-primary', 'border-2');
        btn.classList.add('border-slate-200', 'dark:border-slate-800', 'bg-white', 'dark:bg-slate-900', 'text-slate-500');
        btn.classList.remove('font-bold');
    });
    
    // Znajdź przycisk zawierający wartość (np. "4%")
    const activeBtn = Array.from(buttons).find(b => b.innerText.includes(val + '%'));
    if (activeBtn) {
        activeBtn.classList.remove('border-slate-200', 'dark:border-slate-800', 'bg-white', 'dark:bg-slate-900', 'text-slate-500');
        activeBtn.classList.add('border-2', 'border-primary/50', 'bg-primary/5', 'text-primary', 'font-bold');
    }

    obliczWszystko();
}

/**
 * Główna funkcja obliczeniowa
 */
function obliczWszystko() {
    const start = pobierzWartosc('input-kapital', 10000);
    const doplata = pobierzWartosc('input-doplata', 500);
    const lata = pobierzWartosc('input-horyzont', 10);
    const stopaNom = pobierzWartosc('input-stopa', 7) / 100;
    const inflacjaRoczna = pobierzWartosc('input-inflacja', 2.5) / 100;
    const isIKE = document.getElementById('input-ike').checked;

    const stopaMsc = stopaNom / 12;
    const msc = Math.max(lata * 12, 1);

    let kapitalNominalny = start;
    let sumaWplat = start;
    let doplataLaczna = 0;

    const daneWykresu = {
        labels: ["Start"],
        nominalny: [start],
        wplacone: [start],
        realny: [start]
    };

    const tabelaBody = document.getElementById('tabela-body');
    if (tabelaBody) tabelaBody.innerHTML = '';

    // Symulacja miesiąc po miesiącu
    for (let m = 1; m <= msc; m++) {
        kapitalNominalny += doplata;
        sumaWplat += doplata;
        doplataLaczna += doplata;
        kapitalNominalny = kapitalNominalny * (1 + stopaMsc);

        if (m % 12 === 0) {
            const rok = m / 12;
            const infSkumulowana = Math.pow(1 + inflacjaRoczna, rok);
            const kapitalRealny = kapitalNominalny / infSkumulowana;

            daneWykresu.labels.push(`Rok ${rok}`);
            daneWykresu.nominalny.push(zaokraglij(kapitalNominalny));
            daneWykresu.wplacone.push(zaokraglij(sumaWplat));
            daneWykresu.realny.push(zaokraglij(kapitalRealny));

            if (tabelaBody) {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors";
                tr.innerHTML = `
                    <td class="px-8 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">Rok ${rok}</td>
                    <td class="px-8 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">${formatujZl(zaokraglij(sumaWplat))}</td>
                    <td class="px-8 py-4 text-sm text-slate-600 dark:text-slate-400">${formatujZl(zaokraglij(kapitalNominalny - sumaWplat))}</td>
                    <td class="px-8 py-4 text-sm font-bold text-slate-900 dark:text-white">${formatujZl(zaokraglij(kapitalNominalny))}</td>
                    <td class="px-8 py-4 text-sm font-bold text-emerald-500">${formatujZl(zaokraglij(kapitalRealny))}</td>
                `;
                tabelaBody.appendChild(tr);
            }
        }
    }

    const zyskBrutto = kapitalNominalny - sumaWplat;
    const podatekKwota = isIKE ? 0 : Math.max(0, zyskBrutto * 0.19);
    const kapitalNetto = kapitalNominalny - podatekKwota;
    const zyskPoDataku = kapitalNetto - sumaWplat;

    const wsplInfl = Math.pow(1 + inflacjaRoczna, lata);
    const kapitalRealny = kapitalNetto / wsplInfl;
    const zyskRealny = kapitalRealny - sumaWplat;

    const podstawa = Math.max(sumaWplat, 1);
    const cagrNominalny = (Math.pow(kapitalNetto / podstawa, 1 / lata) - 1) || 0;
    const cagrRealny = (Math.pow(kapitalRealny / podstawa, 1 / lata) - 1) || 0;

    // Aktualizacja UI
    animuj('etf-wynik-kapital-koncowy', zaokraglij(kapitalNetto, 2));
    animuj('etf-wynik-wklad-wlasny', zaokraglij(sumaWplat, 2));
    animuj('etf-wynik-zysk-nominalny', zaokraglij(zyskBrutto, 2));
    animuj('etf-wynik-podatek-belki', zaokraglij(podatekKwota, 2));
    animuj('etf-wynik-zysk-realny', zaokraglij(zyskRealny, 2));

    const eCagr = document.getElementById('etf-wynik-cagr');
    const eCagrR = document.getElementById('etf-wynik-cagr-realny');
    if (eCagr) eCagr.textContent = formatujProcent(cagrNominalny);
    if (eCagrR) eCagrR.textContent = formatujProcent(cagrRealny);

    // Tekst i status podatku
    const txtPodatekStatus = document.getElementById('txt-podatek-status');
    if (txtPodatekStatus) {
        txtPodatekStatus.textContent = isIKE ? "Konto IKE/IKZE (0%)" : "Opodatkowanie 19%";
        txtPodatekStatus.className = isIKE ? "font-bold text-emerald-400" : "font-bold text-white/90";
    }

    updateChart(daneWykresu);
}

/**
 * Inicjalizacja Chart.js
 */
function initChart() {
    const canvas = document.getElementById('chartInwestycja');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Kapitał Końcowy',
                    data: [],
                    borderColor: '#0d7ff2', // Primary Blue
                    backgroundColor: 'rgba(13, 127, 242, 0.1)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#0d7ff2',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                },
                {
                    label: 'Wkład Własny',
                    data: [],
                    borderColor: '#f59e0b', // Amber
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    label: 'Wartość Realna',
                    data: [],
                    borderColor: '#10b981', // Emerald
                    borderWidth: 2,
                    borderDash: [2, 2],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    titleColor: isDark ? '#fff' : '#1e293b',
                    bodyColor: isDark ? '#94a3b8' : '#64748b',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 12,
                    callbacks: {
                        label: function (context) {
                            return ` ${context.dataset.label}: ${formatujZl(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { family: 'Inter' } }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        font: { family: 'Inter' },
                        callback: (val) => formatujZl(val).split(',')[0] + ' zł'
                    }
                }
            }
        }
    });

    window.addEventListener('theme-changed', () => {
        const isDark = document.documentElement.classList.contains('dark');
        myChart.options.scales.x.ticks.color = isDark ? '#94a3b8' : '#64748b';
        myChart.options.scales.y.ticks.color = isDark ? '#94a3b8' : '#64748b';
        myChart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        myChart.options.plugins.tooltip.backgroundColor = isDark ? '#1e293b' : '#fff';
        myChart.options.plugins.tooltip.titleColor = isDark ? '#fff' : '#1e293b';
        myChart.update();
    });
}

function updateChart(dane) {
    if (!myChart) return;
    myChart.data.labels = dane.labels;
    myChart.data.datasets[0].data = dane.nominalny;
    myChart.data.datasets[1].data = dane.wplacone;
    myChart.data.datasets[2].data = dane.realny;
    myChart.update();

    if (typeof gtag === 'function') {
        gtag('event', 'calculate', { 'calculator_type': 'etf' });
    }
}

window.setStopa = setStopa;
window.obliczWszystko = obliczWszystko;
