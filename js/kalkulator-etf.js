/**
 * Logika Kalkulatora ETF — ETFkalkulator.pl
 * ---------------------------------------
 * Oblicza wzrost kapitału z uwzględnieniem:
 * - Procentu składanego (miesięcznie)
 * - Dopłat miesięcznych
 * - Inflacji (wartość realna)
 * - Podatku Belki (z wyborem IKE/IKZE)
 */

let savedScenarios = [];

document.addEventListener('DOMContentLoaded', () => {
    // Inicjalizacja pól i zdarzeń
    const numericInputs = [
        'input-kapital', 'input-doplata', 'input-horyzont',
        'input-stopa', 'input-inflacja'
    ];

    numericInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Only trigger calculations on valid input
            el.addEventListener('input', () => {
                const val = el.value.trim();
                if (val !== '' && !isNaN(parseFloat(val))) {
                    obliczWszystko();
                }
            });

            // Smart Auto-Clearing: clear on focus
            el.addEventListener('focus', function() {
                this.dataset.previousValue = this.value;
                this.value = '';
            });

            // Safety Net: restore on blur if empty
            el.addEventListener('blur', function() {
                const val = this.value.trim();
                if (val === '' || isNaN(parseFloat(val))) {
                    this.value = this.dataset.previousValue || this.defaultValue || '0';
                    obliczWszystko();
                }
            });
        }
    });

    const elIke = document.getElementById('input-ike');
    if (elIke) {
        elIke.addEventListener('change', obliczWszystko);
    }

    const btnSaveScenario = document.getElementById('btn-save-scenario');
    if (btnSaveScenario) {
        btnSaveScenario.addEventListener('click', saveCurrentScenario);
    }

    const btnShareResult = document.getElementById('btn-share-result');
    if (btnShareResult) {
        btnShareResult.addEventListener('click', shareResult);
    }

    // Inicjalizacja wykresu
    initChart();

    // Wczytaj z URL ze wskaźnikami, jeśli istnieją
    if (window.location.search) {
        loadFromUrlParams();
    }

    // Wczytaj zapisane scenariusze
    loadFromLocalStorage();

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
                    <td class="sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 px-4 py-3 text-xs lg:text-sm font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Rok ${rok}</td>
                    <td class="px-3 py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400 font-medium text-right whitespace-nowrap">${formatujZl(zaokraglij(sumaWplat))}</td>
                    <td class="px-3 py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400 text-right whitespace-nowrap">${formatujZl(zaokraglij(kapitalNominalny - sumaWplat))}</td>
                    <td class="px-3 py-4 text-xs lg:text-sm font-bold text-slate-900 dark:text-white text-right whitespace-nowrap">${formatujZl(zaokraglij(kapitalNominalny))}</td>
                    <td class="px-3 py-4 text-xs lg:text-sm font-bold text-emerald-500 text-right whitespace-nowrap">${formatujZl(zaokraglij(kapitalRealny))}</td>
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
    animuj('etf-wynik-cagr', cagrNominalny, formatujProcent);
    animuj('etf-wynik-cagr-real', cagrRealny, formatujProcent);

    // Tekst i status podatku
    const txtPodatekStatus = document.getElementById('txt-podatek-status');
    if (txtPodatekStatus) {
        txtPodatekStatus.textContent = isIKE ? "Konto IKE/IKZE (0%)" : "Opodatkowanie 19%";
        txtPodatekStatus.className = isIKE ? "font-bold text-emerald-400" : "font-bold text-white/90";
    }

    updateChart(daneWykresu);
    
    // Zaktualizuj parametry w adresie URL
    updateUrlParams();
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

/**
 * SCENARIO HISTORY LOGIC
 */
function saveCurrentScenario() {
    if (savedScenarios.length >= 6) {
        alert("Możesz zapisać maksymalnie 6 scenariuszy.");
        return;
    }

    const kapital = pobierzWartosc('input-kapital', 10000);
    const doplata = pobierzWartosc('input-doplata', 500);
    const lata = pobierzWartosc('input-horyzont', 10);
    const stopa = pobierzWartosc('input-stopa', 7);
    
    // Read formatted result directly from UI
    const kapitalKoncowyEl = document.getElementById('etf-wynik-kapital-koncowy');
    const kapitalKoncowyStr = kapitalKoncowyEl ? kapitalKoncowyEl.innerText : '0,00 zł';

    const zyskRealnyEl = document.getElementById('etf-wynik-zysk-realny');
    const zyskRealnyStr = zyskRealnyEl ? zyskRealnyEl.innerText : '0,00 zł';

    const scenario = {
        kapital: kapital,
        doplata: doplata,
        lata: lata,
        stopa: stopa,
        kapitalKoncowyStr: kapitalKoncowyStr,
        zyskRealnyStr: zyskRealnyStr
    };

    savedScenarios.push(scenario);
    saveToLocalStorage();
    renderScenarios();
}

function renderScenarios() {
    const section = document.getElementById('scenario-history-section');
    const container = document.getElementById('scenario-cards-container');
    if (!section || !container) return;

    if (savedScenarios.length === 0) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');
    container.innerHTML = '';

    savedScenarios.forEach((scen, index) => {
        const div = document.createElement('div');
        div.className = "min-w-[85%] sm:min-w-[300px] snap-center bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-transparent dark:border-slate-700 rounded-2xl p-4 relative group cursor-pointer hover:border-primary/50 active:scale-[0.98] shrink-0 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden";
        div.onclick = () => loadScenario(index);
        
        // Format z polskim separatorem spacji (np. "10 000")
        const formatPl = new Intl.NumberFormat('pl-PL');
        const kapitalStr = formatPl.format(scen.kapital);
        const doplataStr = formatPl.format(scen.doplata);

        div.innerHTML = `
            <button class="absolute top-2 right-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 z-20 bg-white/80 dark:bg-slate-800/80 rounded-full backdrop-blur-sm hover:scale-110 shadow-sm" onclick="deleteScenario(${index}, event)" aria-label="Usuń scenariusz">
                <span class="material-symbols-outlined text-[16px] block">close</span>
            </button>

            <!-- Guide Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-slate-900/95 dark:via-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none z-10">
                <span class="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span class="material-symbols-outlined text-[14px]">file_download</span>
                    Kliknij, aby wczytać
                </span>
            </div>

            <div class="transition-all duration-300 group-hover:blur-[1.5px] group-hover:opacity-60 relative z-0">
                <div class="flex flex-wrap gap-1 mb-4 pr-6">
                    <span class="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">${kapitalStr} zł st.</span>
                    <span class="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">${doplataStr} zł/msc</span>
                    <span class="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">${scen.lata} lat</span>
                    <span class="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">${scen.stopa}% zysk</span>
                </div>
                <div>
                    <p class="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Przewidywany kapitał końcowy</p>
                    <p class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">${scen.kapitalKoncowyStr}</p>
                    <div class="flex items-center gap-1 mt-2 mb-1">
                        <span class="material-symbols-outlined text-[13px] text-emerald-500">trending_up</span>
                        <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">
                            w tym zysk realny: ${scen.zyskRealnyStr}
                        </p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function deleteScenario(index, event) {
    if (event) {
        event.stopPropagation();
    }
    savedScenarios.splice(index, 1);
    saveToLocalStorage();
    renderScenarios();
}

function loadScenario(index) {
    const scen = savedScenarios[index];
    if (!scen) return;
    
    document.getElementById('input-kapital').value = scen.kapital;
    document.getElementById('input-doplata').value = scen.doplata;
    document.getElementById('input-horyzont').value = scen.lata;
    
    // Updating 'stopa' also handles calculations via setStopa() helper
    setStopa(scen.stopa, document.getElementById('input-stopa'));
    
    // Visual feedback 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('etf-scenarios', JSON.stringify(savedScenarios));
    } catch (e) {
        console.error('Cannot save scenarios to localStorage', e);
    }
}

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('etf-scenarios');
        if (data) {
            savedScenarios = JSON.parse(data);
            if (savedScenarios.length > 0) {
                renderScenarios();
            }
        }
    } catch (e) {
        console.error('Cannot load scenarios from localStorage', e);
    }
}

function updateUrlParams() {
    const start = document.getElementById('input-kapital').value;
    const msc = document.getElementById('input-doplata').value;
    const lata = document.getElementById('input-horyzont').value;
    const stopa = document.getElementById('input-stopa').value;
    const inf = document.getElementById('input-inflacja').value;
    const ike = document.getElementById('input-ike').checked;

    const params = new URLSearchParams();
    params.set('start', start);
    params.set('msc', msc);
    params.set('lata', lata);
    params.set('stopa', stopa);
    params.set('inf', inf);
    params.set('ike', ike);

    const newUrl = window.location.pathname + '?' + params.toString();
    window.history.replaceState({ path: newUrl }, '', newUrl);
}

function loadFromUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('start')) document.getElementById('input-kapital').value = params.get('start');
    if (params.has('msc')) document.getElementById('input-doplata').value = params.get('msc');
    if (params.has('lata')) document.getElementById('input-horyzont').value = params.get('lata');
    if (params.has('stopa')) {
        document.getElementById('input-stopa').value = params.get('stopa');
        const buttons = document.getElementById('input-stopa').parentElement.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.classList.remove('border-primary/50', 'bg-primary/5', 'text-primary', 'border-2');
            btn.classList.add('border-slate-200', 'dark:border-slate-800', 'bg-white', 'dark:bg-slate-900', 'text-slate-500');
            btn.classList.remove('font-bold');
        });
        const activeBtn = Array.from(buttons).find(b => b.innerText.includes(params.get('stopa') + '%'));
        if (activeBtn) {
            activeBtn.classList.remove('border-slate-200', 'dark:border-slate-800', 'bg-white', 'dark:bg-slate-900', 'text-slate-500');
            activeBtn.classList.add('border-2', 'border-primary/50', 'bg-primary/5', 'text-primary', 'font-bold');
        }
    }
    if (params.has('inf')) document.getElementById('input-inflacja').value = params.get('inf');
    if (params.has('ike')) document.getElementById('input-ike').checked = params.get('ike') === 'true';
}

function shareResult() {
    const url = window.location.href;
    const title = 'Mój plan inwestycyjny - ETFkalkulator.pl';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url).then(() => {
            const btnTxt = document.getElementById('txt-btn-share');
            if (btnTxt) {
                const originalText = btnTxt.innerText;
                btnTxt.innerText = 'Skopiowano link! ✔️';
                setTimeout(() => {
                    btnTxt.innerText = originalText;
                }, 2000);
            }
        }).catch(err => console.error('Error copying link', err));
    }
}

// Make functions globally accessible for inline handlers
window.saveCurrentScenario = saveCurrentScenario;
window.deleteScenario = deleteScenario;
window.loadScenario = loadScenario;
window.shareResult = shareResult;
