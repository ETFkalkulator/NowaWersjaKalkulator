
/**
 * Logika Kalkulatora Obligacji Skarbowych — ETFkalkulator.pl
 */

let savedScenarios = [];
let myChart = null;

// Aktualizuj tę datę przy każdej zmianie stawek (jedyne miejsce w projekcie)
const BOND_RATES_DATE = 'kwiecień 2026';

const BOND_CONSTANTS = {
    EDO: { name: 'EDO (10 letnie)', years: 10, yr1: 0.0535, margin: 0.0200, penalty: 3.00, cap: 'annual', tax: 'end' },
    COI: { name: 'COI (4 letnie)', years: 4, yr1: 0.0475, margin: 0.0150, penalty: 2.00, cap: 'payout', tax: 'payout' },
    TOS: { name: 'TOS (3 letnie)', years: 3, fixed: 0.0440, penalty: 1.00, cap: 'annual', tax: 'end' },
    ROR: { name: 'ROR (1 roczne)', years: 1, fixedYr1: 0.0400, margin: 0.0000, penalty: 0.50, cap: 'payout', tax: 'payout' },
    ROS: { name: 'ROS (6 letnie)', years: 6, yr1: 0.0500, margin: 0.0200, penalty: 1.50, cap: 'annual', tax: 'end' },
    ROD: { name: 'ROD (12 letnie)', years: 12, yr1: 0.0560, margin: 0.0250, penalty: 2.00, cap: 'annual', tax: 'end' }
};

document.addEventListener('DOMContentLoaded', () => {
    const numericInputs = ['input-kapital', 'input-doplata', 'input-inflacja'];

    numericInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const debouncedOblicz = window.debounce(() => obliczWszystko(), 150);
            el.addEventListener('input', () => {
                const val = el.value.trim();
                if (val !== '' && !isNaN(parseFloat(val))) debouncedOblicz();
            });
            el.addEventListener('focus', function () {
                this.dataset.previousValue = this.value;
                setTimeout(() => { this.select(); this.setSelectionRange(0, 9999); }, 50);
            });
            el.addEventListener('blur', function () {
                const val = this.value.trim();
                if (val === '' || isNaN(parseFloat(val))) {
                    this.value = this.dataset.previousValue || this.defaultValue || '0';
                    obliczWszystko();
                }
            });
        }
    });

    ['input-typ', 'input-ike', 'input-800plus', 'input-rolowanie', 'input-wykup'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', () => {
            if (id === 'input-800plus') on800PlusChange();
            if (id === 'input-typ') { updateEarlyRedemptionSlider(); updateTypeOptions(); }
            obliczWszystko();
        });
    });

    const wykupSlider = document.getElementById('input-wykup');
    if (wykupSlider) {
        wykupSlider.addEventListener('input', (e) => {
            document.getElementById('wykup-val-display').innerText = e.target.value;
            obliczWszystko();
        });
    }

    const customMarzaInput = document.getElementById('input-custom-marza');
    const debouncedCustomOblicz = window.debounce(() => obliczWszystko(), 150);

    if (customMarzaInput) {
        customMarzaInput.addEventListener('input', debouncedCustomOblicz);
    }

    const customYr1Input = document.getElementById('input-custom-yr1');
    if (customYr1Input) {
        customYr1Input.addEventListener('input', debouncedCustomOblicz);
    }

    const btnSaveScenario = document.getElementById('btn-save-scenario');
    if (btnSaveScenario) btnSaveScenario.addEventListener('click', saveCurrentScenario);

    const btnShare = document.getElementById('btn-share-result');
    if (btnShare) btnShare.addEventListener('click', () => window.shareResult('Moja symulacja obligacji - ETFkalkulator.pl'));

    initChart();
    updateTypeOptions();
    updateEarlyRedemptionSlider();

    if (window.location.search) loadFromUrlParams();

    loadFromLocalStorage();
    obliczWszystko();
});

// Reakcja na zmianę motywu (dark/light)
if (!window._obligacjeChartThemeBound) {
    window._obligacjeChartThemeBound = true;
    window.addEventListener('theme-changed', function() {
        if (typeof obliczWszystko === 'function') obliczWszystko();
    });
}

function updateTypeOptions() {
    const typeSelect = document.getElementById('input-typ');
    const is800El = document.getElementById('input-800plus');
    if (!typeSelect || !is800El) return;
    const isFamilyBond = typeSelect.value === 'ROS' || typeSelect.value === 'ROD';
    is800El.checked = isFamilyBond;
}

function on800PlusChange() {
    const typeSelect = document.getElementById('input-typ');
    const is800El = document.getElementById('input-800plus');
    if (!typeSelect || !is800El) return;
    const currentVal = typeSelect.value;
    const isFamilyBond = currentVal === 'ROS' || currentVal === 'ROD';
    if (is800El.checked && !isFamilyBond) {
        typeSelect.value = 'ROS';
        updateEarlyRedemptionSlider();
    } else if (!is800El.checked && isFamilyBond) {
        typeSelect.value = 'EDO';
        updateEarlyRedemptionSlider();
    }
}

function updateEarlyRedemptionSlider() {
    const typeSelect = document.getElementById('input-typ').value;
    const years = BOND_CONSTANTS[typeSelect].years;
    const slider = document.getElementById('input-wykup');
    const display = document.getElementById('wykup-val-display');

    if (slider) {
        slider.max = years;
        slider.value = years;
        
        if (display) display.innerText = slider.value;
    }
    updateBondInfoBar();
}

function updateBondInfoBar() {
    const type = document.getElementById('input-typ').value;
    const bond = BOND_CONSTANTS[type];
    if (!bond) return;

    const yr1El = document.getElementById('bond-info-yr1');
    const marginEl = document.getElementById('bond-info-margin');
    const marginWrap = document.getElementById('bond-info-margin-wrap');
    const penaltyEl = document.getElementById('bond-info-penalty');

    if (yr1El) {
        const yr1Rate = bond.yr1 ?? bond.fixed ?? bond.fixedYr1 ?? 0;
        yr1El.textContent = (yr1Rate * 100).toFixed(2) + '%';
    }
    if (marginEl && marginWrap) {
        if (bond.margin !== undefined && bond.margin > 0 && bond.fixed === undefined) {
            marginEl.textContent = 'CPI + ' + (bond.margin * 100).toFixed(2) + '%';
            marginWrap.classList.remove('hidden');
        } else if (bond.fixed !== undefined) {
            marginEl.textContent = 'Sta\u0142e ' + (bond.fixed * 100).toFixed(2) + '%';
            marginWrap.classList.remove('hidden');
        } else {
            marginWrap.classList.add('hidden');
        }
    }
    if (penaltyEl) {
        penaltyEl.textContent = bond.penalty.toFixed(2) + ' z\u0142/szt.';
    }
    const dateEl = document.getElementById('bond-info-date');
    if (dateEl) {
        dateEl.textContent = BOND_RATES_DATE;
    }

    const customMarzaWrap = document.getElementById('custom-marza-wrap');
    if (customMarzaWrap) {
        const hasCpiMargin = bond.margin !== undefined && bond.margin > 0 && bond.fixed === undefined;
        customMarzaWrap.classList.toggle('hidden', !hasCpiMargin);
        const marzaInp = document.getElementById('input-custom-marza');
        if (marzaInp) {
            if (!hasCpiMargin) {
                marzaInp.value = '';
            } else {
                marzaInp.placeholder = 'np. ' + (bond.margin * 100).toFixed(2);
            }
        }
    }

    const customYr1Wrap = document.getElementById('custom-yr1-wrap');
    if (customYr1Wrap) {
        const hasYr1 = bond.yr1 !== undefined || bond.fixedYr1 !== undefined || bond.fixed !== undefined;
        customYr1Wrap.classList.toggle('hidden', !hasYr1);
        const yr1Inp = document.getElementById('input-custom-yr1');
        if (yr1Inp) {
            if (!hasYr1) {
                yr1Inp.value = '';
            } else {
                const yr1Rate = bond.yr1 ?? bond.fixed ?? bond.fixedYr1 ?? 0;
                yr1Inp.placeholder = 'np. ' + (yr1Rate * 100).toFixed(2);
            }
        }
    }
}

function setStopa(val, inputEl) { } // Not used directly in obligacje, kept for interface parity if needed

function obliczWszystko() {
    const kapitalStart = parseFloat(document.getElementById('input-kapital')?.value) || 0;
    const doplata = parseFloat(document.getElementById('input-doplata')?.value) || 0;
    const type = document.getElementById('input-typ').value;
    const inflacjaInput = parseFloat(document.getElementById('input-inflacja')?.value) || 0;
    const isIKE = document.getElementById('input-ike')?.checked || false;
    const isRolowanie = document.getElementById('input-rolowanie')?.checked || false;

    const wykupSlider = document.getElementById('input-wykup');
    const wykupRok = wykupSlider ? parseInt(wykupSlider.value) || BOND_CONSTANTS[type].years : BOND_CONSTANTS[type].years;

    const bond = BOND_CONSTANTS[type];
    const customMarzaVal = parseFloat(document.getElementById('input-custom-marza')?.value);
    const effectiveMargin = (!isNaN(customMarzaVal) && customMarzaVal >= 0)
        ? customMarzaVal / 100
        : bond.margin;
    
    const customYr1Val = parseFloat(document.getElementById('input-custom-yr1')?.value);
    const baseFirstYearRate = bond.yr1 ?? bond.fixed ?? bond.fixedYr1 ?? 0;
    const effectiveYr1 = (!isNaN(customYr1Val) && customYr1Val > 0)
        ? customYr1Val / 100
        : baseFirstYearRate;

    const cpi = Math.max(0, inflacjaInput / 100);
    const bondPrice = isRolowanie ? 99.90 : 100.00;

    const actualYears = Math.min(wykupRok, bond.years);
    const totalMonths = Math.max(actualYears * 12, 1);

    let cohorts = [];

    for (let m = 0; m < totalMonths; m++) {
        let amount = (m === 0) ? kapitalStart : doplata;
        if (amount <= 0) continue;

        let quantity = amount / bondPrice;
        cohorts.push({
            startMonth: m,
            quantity: quantity,
            nominal: quantity * 100.00,
            cost: amount
        });
    }

    let daneWykresu = {
        labels: ["Start"],
        nominalny: [kapitalStart],
        wklad: [kapitalStart],
        realny: [kapitalStart]
    };

    const tabelaBody = document.getElementById('tabela-body');
    if (tabelaBody) tabelaBody.innerHTML = '';

    let globalFinalTaxPaid = 0;
    let globalFinalPenaltyPaid = 0;
    let globalFinalGrossProfit = 0;
    let globalFinalNetCapital = 0;
    let globalTotalWkladAtEnd = 0;

    for (let y = 1; y <= actualYears; y++) {
        let currentYearMonths = y * 12;
        let totalNominalAtY = 0;
        let totalWkladAtY = 0;

        for (let c of cohorts) {
            if (c.startMonth >= currentYearMonths) continue;
            totalWkladAtY += c.cost;

            let heldMonths = currentYearMonths - c.startMonth;
            let fullYears = Math.floor(heldMonths / 12);
            let remMonths = heldMonths % 12;

            let currentNominal = c.nominal;
            let accumInterest = 0;
            let taxPaid = 0;

            for (let i = 1; i <= fullYears; i++) {
                let rate = (type === 'TOS') ? effectiveYr1 : (type === 'ROR') ? effectiveYr1 + bond.margin : (i === 1 ? effectiveYr1 : cpi + effectiveMargin);
                let interest = currentNominal * rate;
                accumInterest += interest;

                if (bond.tax === 'payout' && !isIKE) {
                    let tax = interest * 0.19;
                    taxPaid += tax;
                    interest -= tax;
                }
                if (bond.cap === 'annual') {
                    currentNominal += interest;
                }
            }

            let fractionalInterest = 0;
            if (remMonths > 0) {
                let rate = (type === 'TOS') ? effectiveYr1 : (type === 'ROR') ? effectiveYr1 + bond.margin : (fullYears === 0 ? effectiveYr1 : cpi + effectiveMargin);
                fractionalInterest = currentNominal * rate * (remMonths / 12);
                accumInterest += fractionalInterest;

                if (bond.tax === 'payout' && !isIKE) {
                    let tax = fractionalInterest * 0.19;
                    taxPaid += tax;
                    fractionalInterest -= tax;
                }
                if (bond.cap === 'annual') {
                    currentNominal += fractionalInterest;
                }
            }

            let isFinalYear = (y === actualYears);
            let isEarly = (actualYears < bond.years) && (heldMonths < bond.years * 12);
            let penalty = 0;

            let currentCapitalNet = bond.cap === 'annual' ? currentNominal : (c.nominal + accumInterest - taxPaid);

            if (isFinalYear && isEarly) {
                penalty = Math.min(c.quantity * bond.penalty, accumInterest);
                currentCapitalNet -= penalty;
                if (bond.tax === 'end' && !isIKE) {
                    let taxable = Math.max(0, accumInterest - penalty);
                    let endTax = taxable * 0.19;
                    taxPaid += endTax;
                    currentCapitalNet -= endTax;
                }
            } else if (isFinalYear && !isEarly) {
                if (bond.tax === 'end' && !isIKE) {
                    let endTax = accumInterest * 0.19;
                    taxPaid += endTax;
                    currentCapitalNet -= endTax;
                }
            } else if (!isFinalYear && bond.tax === 'end' && !isIKE) {
                // Approximate early tax logic for chart visualization only
                let endTax = accumInterest * 0.19;
                currentCapitalNet -= endTax;
            }

            totalNominalAtY += currentCapitalNet;

            if (isFinalYear) {
                globalFinalTaxPaid += taxPaid;
                globalFinalPenaltyPaid += penalty;
                globalFinalGrossProfit += accumInterest;
            }
        }

        const infSkumulowana = Math.pow(1 + cpi, y);
        const realCapital = totalNominalAtY / infSkumulowana;

        daneWykresu.labels.push('Rok ' + y);
        daneWykresu.nominalny.push(window.zaokraglij(totalNominalAtY));
        daneWykresu.wklad.push(window.zaokraglij(totalWkladAtY));
        daneWykresu.realny.push(window.zaokraglij(realCapital));

        if (y === actualYears) {
            globalFinalNetCapital = totalNominalAtY;
            globalTotalWkladAtEnd = totalWkladAtY;
        }

        if (tabelaBody) {
            const currentCpiRate = cpi;
            const avgRate = (type === 'TOS') ? effectiveYr1 : (y === 1) ? effectiveYr1 : currentCpiRate + effectiveMargin;

            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors";
            tr.innerHTML = `
                <td class="sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 px-4 py-3 text-xs lg:text-sm font-semibold border-r border-slate-100 dark:border-slate-800">Rok ${y}</td>
                <td class="px-3 py-4 text-xs lg:text-sm text-right">${window.formatujZl(window.zaokraglij(totalWkladAtY))}</td>
                <td class="px-3 py-4 text-xs lg:text-sm text-right">${window.formatujZl(window.zaokraglij(totalNominalAtY - totalWkladAtY))}</td>
                <td class="px-3 py-4 text-xs lg:text-sm text-right font-bold text-slate-900 dark:text-white">${window.formatujZl(window.zaokraglij(totalNominalAtY))}</td>
                <td class="px-3 py-4 text-xs lg:text-sm text-right">${(avgRate * 100).toFixed(2)}%</td>
                <td class="px-3 py-4 text-xs lg:text-sm text-right font-bold text-emerald-500">${window.formatujZl(window.zaokraglij(realCapital))}</td>
            `;
            tabelaBody.appendChild(tr);
        }
    }

    const finalCapital = globalFinalNetCapital;
    const finalReal = daneWykresu.realny[daneWykresu.realny.length - 1];
    let rawProfit = finalCapital - globalTotalWkladAtEnd;

    // Safety check just in case totalWklad is < 1
    const safeBase = Math.max(globalTotalWkladAtEnd, 1);
    const cagrNom = (Math.pow(finalCapital / safeBase, 1 / actualYears) - 1) || 0;
    const cagrReal = (Math.pow(finalReal / safeBase, 1 / actualYears) - 1) || 0;

    if (window.animuj) {
        window.animuj('ob-wynik-kapital', finalCapital, window.formatujZl);
        window.animuj('ob-wynik-wklad', globalTotalWkladAtEnd, window.formatujZl);
        window.animuj('ob-wynik-zysk', globalFinalGrossProfit, window.formatujZl);
        window.animuj('ob-wynik-kara', globalFinalPenaltyPaid, window.formatujZl);
        window.animuj('ob-wynik-podatek', globalFinalTaxPaid, window.formatujZl);
        window.animuj('ob-wynik-realny', finalReal, window.formatujZl);
        window.animuj('ob-wynik-cagr', cagrNom, window.formatujProcent);
        window.animuj('ob-wynik-cagr-real', cagrReal, window.formatujProcent);
    }

    const txtPodatekStatus = document.getElementById('txt-podatek-status');
    if (txtPodatekStatus) {
        txtPodatekStatus.textContent = isIKE ? "Konto IKE/IKZE (0%)" : "Opodatkowanie 19%";
        txtPodatekStatus.className = isIKE ? "font-bold text-emerald-400" : "font-bold text-white/90";
    }

    if (myChart) {
        myChart.data.labels = daneWykresu.labels;
        myChart.data.datasets[0].data = daneWykresu.nominalny;
        myChart.data.datasets[1].data = daneWykresu.wklad;
        myChart.data.datasets[2].data = daneWykresu.realny;
        myChart.update();
    }
    updateUrlParams();
}

function initChart() {
    const canvas = document.getElementById('chartObligacje');
    if (!canvas || !window.Chart) return;
    const ctx = canvas.getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(13, 127, 242, 0.2)');
    gradient.addColorStop(1, 'rgba(13, 127, 242, 0)');

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Kapitał Końcowy', data: [], borderColor: '#0d7ff2', backgroundColor: gradient, borderWidth: 3, fill: true, tension: 0.3, pointRadius: 0, pointHoverRadius: 6 },
                { label: 'Wkład Własny', data: [], borderColor: '#f59e0b', borderWidth: 2, borderDash: [5, 5], fill: false, tension: 0.3, pointRadius: 0 },
                { label: 'Wartość Realna', data: [], borderColor: '#10b981', borderWidth: 2, borderDash: [2, 2], fill: false, tension: 0.3, pointRadius: 0 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: true, aspectRatio: window.innerWidth > 768 ? 2.5 : 1.1,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    titleColor: isDark ? '#ffffff' : '#1e293b',
                    bodyColor: isDark ? '#94a3b8' : '#64748b',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 16
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: textColor } },
                y: { grid: { borderDash: [5, 5], color: isDark ? '#1e293b' : '#e5e7eb' }, ticks: { color: textColor, callback: (v) => window.formatujZl ? window.formatujZl(v).split(',')[0] + ' zł' : v } }
            }
        }
    });
}

function saveCurrentScenario() {
    if (savedScenarios.length >= 6) {
        alert("Maksymalnie 6 scenariuszy.");
        return;
    }

    const scenario = {
        kapital: document.getElementById('input-kapital') ? document.getElementById('input-kapital').value : 0,
        doplata: document.getElementById('input-doplata') ? document.getElementById('input-doplata').value : 0,
        typ: document.getElementById('input-typ').value,
        inflacja: document.getElementById('input-inflacja') ? document.getElementById('input-inflacja').value : 0,
        customMarza: document.getElementById('input-custom-marza') ? document.getElementById('input-custom-marza').value : '',
        customYr1: document.getElementById('input-custom-yr1') ? document.getElementById('input-custom-yr1').value : '',
        kapitalKoncowyStr: document.getElementById('ob-wynik-kapital').innerText,
        zyskNominalnyStr: document.getElementById('ob-wynik-zysk').innerText
    };
    savedScenarios.push(scenario);
    localStorage.setItem('ob-scenarios', JSON.stringify(savedScenarios));
    renderScenarios();
}

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('ob-scenarios');
        if (data) {
            const parsed = JSON.parse(data);
            savedScenarios = Array.isArray(parsed) ? parsed : [];
            if (savedScenarios.length > 0) renderScenarios();
        }
    } catch (e) {
        console.warn('LocalStorage error', e);
    }
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
        div.className = "shrink-0 w-[78vw] max-w-[310px] sm:max-w-none sm:w-[350px] snap-start relative flex flex-col p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group cursor-pointer active:scale-[0.98] overflow-hidden";
        div.onclick = () => {
            if (document.getElementById('input-kapital')) document.getElementById('input-kapital').value = scen.kapital;
            if (document.getElementById('input-doplata')) document.getElementById('input-doplata').value = scen.doplata;
            document.getElementById('input-typ').value = scen.typ;
            if (document.getElementById('input-inflacja')) document.getElementById('input-inflacja').value = scen.inflacja;
            if (document.getElementById('input-custom-marza')) document.getElementById('input-custom-marza').value = scen.customMarza || '';
            if (document.getElementById('input-custom-yr1')) document.getElementById('input-custom-yr1').value = scen.customYr1 || '';
            
            updateEarlyRedemptionSlider();
            obliczWszystko();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const formatPl = new Intl.NumberFormat('pl-PL');
        const kapStr = formatPl.format(scen.kapital);
        const dopStr = formatPl.format(scen.doplata);

        div.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-slate-900/95 dark:via-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 pointer-events-none z-10">
              <span class="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300" style="background-color: #0d7ff2;">
                <span class="material-symbols-outlined text-[14px]">file_download</span>
                Kliknij, aby wczytać
              </span>
            </div>
            <button class="absolute top-2 right-2 text-slate-400 hover:text-rose-500 p-1 z-20 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" onclick="event.stopPropagation(); savedScenarios.splice(${index}, 1); localStorage.setItem('ob-scenarios', JSON.stringify(savedScenarios)); renderScenarios();">
                <span class="material-symbols-outlined text-[16px] block">close</span>
            </button>
            <div class="transition-all duration-300 group-hover:blur-[1.5px] group-hover:opacity-60 relative z-0">
              <div class="mb-4 pr-6">
                  <span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-primary dark:text-blue-300 px-2 py-1 rounded font-bold">${escapeHtml(scen.typ)}</span>
                  <span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded ml-1">${kapStr} zł st.</span>
                  <span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded ml-1">${dopStr} zł/ms</span>
              </div>
              <div>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Kapitał końcowy</p>
                  <p class="text-2xl font-black text-slate-900 dark:text-white">${escapeHtml(scen.kapitalKoncowyStr)}</p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1"><span class="material-symbols-outlined text-[13px] text-emerald-500">trending_up</span> Zysk z odsetek: ${escapeHtml(scen.zyskNominalnyStr)}</p>
              </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateUrlParams() {
    const params = new URLSearchParams();
    if (document.getElementById('input-kapital')) params.set('k', document.getElementById('input-kapital').value);
    if (document.getElementById('input-doplata')) params.set('d', document.getElementById('input-doplata').value);
    params.set('t', document.getElementById('input-typ').value);
    if (document.getElementById('input-inflacja')) params.set('i', document.getElementById('input-inflacja').value);
    if (document.getElementById('input-ike').checked) params.set('ike', '1');
    if (document.getElementById('input-800plus').checked) params.set('800', '1');
    if (document.getElementById('input-rolowanie').checked) params.set('r', '1');
    
    const cMarza = document.getElementById('input-custom-marza')?.value;
    if (cMarza) params.set('cm', cMarza);
    const cYr1 = document.getElementById('input-custom-yr1')?.value;
    if (cYr1) params.set('cy1', cYr1);

    // Update URL without reloading
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString();
    window.history.replaceState({ path: newUrl }, '', newUrl);
}

function loadFromUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    const safeGetParam = (key, elId, isCheckbox = false) => {
        if (params.has(key)) {
            const el = document.getElementById(elId);
            if (!el) return;
            if (isCheckbox) {
                el.checked = params.get(key) === '1';
            } else {
                if (key === 't') {
                    if (Object.keys(BOND_CONSTANTS).includes(params.get(key))) {
                        el.value = params.get(key);
                    }
                } else {
                    const val = parseFloat(params.get(key));
                    if (!isNaN(val)) el.value = val;
                }
            }
        }
    };

    safeGetParam('k', 'input-kapital');
    safeGetParam('d', 'input-doplata');
    safeGetParam('t', 'input-typ');
    safeGetParam('i', 'input-inflacja');
    safeGetParam('ike', 'input-ike', true);
    safeGetParam('800', 'input-800plus', true);
    safeGetParam('r', 'input-rolowanie', true);
    safeGetParam('cm', 'input-custom-marza');
    safeGetParam('cy1', 'input-custom-yr1');

    updateTypeOptions();
    updateEarlyRedemptionSlider();
}

// Educational Modals Data
window.modalData = window.modalData || {};
Object.assign(window.modalData, {
    kapital_start: {
        title: "Kapitał Startowy",
        desc: "Kwota którą inwestujesz jednorazowo na początku. Im wyższa baza startowa, tym szybciej działa roczna kapitalizacja (EDO/TOS). Minimalna jednostka to 100 zł (1 obligacja).",
        formula: "Liczba obligacji = Kapitał startowy ÷ Cena zakupu (100 zł lub 99,90 zł przy rolowaniu)",
        icon: "account_balance_wallet"
    },
    doplata_msc: {
        title: "Miesięczna Dopłata",
        desc: "Każda Twoja miesięczna dopłata oznacza fizyczny zakup nowej paczki obligacji z nowym harmonogramem odsetkowym. Obliczamy to rzetelnie dla każdej kohorty oddzielnie.",
        formula: "Każdy miesiąc to nowe obligacje: Month(x) + ...",
        icon: "add_task"
    },
    inflacja_cpi: {
        title: "Oczekiwana Inflacja (CPI)",
        desc: "Wskaźnik wzrostu cen ogłaszany co miesiąc przez GUS. Obligacje indeksowane (EDO, COI, ROS, ROD) automatycznie zwiększają oprocentowanie gdy inflacja rośnie — to Twoja ochrona przed utratą siły nabywczej. Aktualna inflacja GUS (styczeń 2026): 2,2%.",
        formula: "Oprocentowanie od roku 2 = CPI (poprzedni rok) + Marża obligacji",
        icon: "trending_up"
    },
    wczesny_wykup: {
        title: "Wcześniejszy Wykup",
        desc: "Możesz wycofać pieniądze w dowolnym momencie przed końcem okresu obligacji. Pobierana jest opłata manipulacyjna za każdą obligację (np. 3 zł/szt. dla EDO). Opłata nigdy nie może przekroczyć narosłych odsetek — Twój kapitał jest zawsze bezpieczny.",
        formula: "Kara = Liczba obligacji × Opłata/szt. (max: narosłe odsetki)",
        icon: "money_off"
    },
    custom_marza: {
        title: "Własna Marża",
        desc: "Marża to stały dodatek ponad inflację, który zarabiasz na obligacjach indeksowanych (EDO, COI, ROS, ROD). Jeśli Ministerstwo Finansów zmieni marże w nowych emisjach, możesz tutaj wpisać własną wartość. Zostaw pole puste, aby używać domyślnej marży z aktualnej oferty MF.",
        formula: "Zysk w kolejnych latach = Inflacja + Twoja marża (lub domyślna jeśli pole jest puste)",
        icon: "edit"
    },
    custom_yr1: {
        title: "Oprocentowanie w 1. roku",
        desc: "W pierwszym roku (lub całym okresie dla TOS/ROR) odsetki są gwarantowane i podane z góry przez Ministerstwo Finansów. Jeśli warunki emisji się zmienią, możesz tutaj wprowadzić nową wartość oprocentowania. Zostaw pole puste, aby korzystać z wartości domyślnych dla wybranej obligacji.",
        formula: "Odsetki = Twój % (lub domyślny jeśli pole puste) × nominał",
        icon: "percent"
    },
    wynik_karta: {
        title: "Jak liczymy wynik?",
        desc: "Każda miesięczna dopłata kupuje nowy pakiet obligacji z własnym harmonogramem odsetkowym. Odsetki naliczane są wg zasad MF: roczna kapitalizacja (EDO/TOS) lub wypłata (COI/ROR). Tarcza Antydeflacyjna chroni przed ujemną inflacją — marża jest zawsze gwarantowana. Podatek Belki (19%) jest pobierany na koniec okresu (EDO/TOS) lub przy każdej wypłacie odsetek (COI/ROR), chyba że włączysz IKE/IKZE. Kara za wcześniejszy wykup nie może przekroczyć naliczonych odsetek.",
        formula: "Kapitał × (CPI + Marża) − Kara − Podatek Belki 19%",
        icon: "calculate"
    }
});
