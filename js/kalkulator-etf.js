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
    // Inicjalizacja pól i zdarzeń (używając utils.js)
    const inputs = [
        'input-kapital', 'input-doplata', 'input-horyzont',
        'input-stopa', 'input-inflacja', 'input-ike'
    ];

    // Stwórz debounced version funkcji obliczającej
    const debouncedObliczWszystko = window.debounce ? window.debounce(obliczWszystko, 150) : obliczWszystko;

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', debouncedObliczWszystko);
        }
    });

    // Inicjalizacja wykresu
    console.log('🔍 Chart available:', typeof Chart);
    console.log('🔍 window.ETF.charts available:', !!window.ETF.charts);
    
    if (typeof Chart !== 'undefined' && window.ETF && window.ETF.charts) {
        console.log('✅ Inicjalizuję wykres');
        initChart();
    } else {
        console.error('❌ Chart.js lub ETF.charts nie dostępne');
    }

    // Pierwsze obliczenie
    obliczWszystko();
});

let myChart = null;

/**
 * Ustawia stopę zwrotu z predefiniowanych scenariuszy
 */
function setStopa(wartosc, btn) {
    document.getElementById('input-stopa').value = wartosc;

    // Klasy CSS dla przycisków
    document.querySelectorAll('.btn-scenariusz').forEach(b => b.classList.remove('btn-scenariusz--aktywny'));
    btn.classList.add('btn-scenariusz--aktywny');

    obliczWszystko();
}

/**
 * Główna funkcja obliczeniowa
 */
function obliczWszystko() {
    // Pobranie danych bez nadmiernego sprawdzania (cache availability)
    const hasValidation = window.walidujKwote && window.walidujProcent;
    
    const start = hasValidation ? window.walidujKwote(pobierzWartosc('input-kapital', 10000), 'kapital', 0, VALIDATION_CONSTANTS.KAPITAL_MAX) : parseFloat(pobierzWartosc('input-kapital', 10000));
    const doplata = hasValidation ? window.walidujKwote(pobierzWartosc('input-doplata', 500), 'doplata', 0, VALIDATION_CONSTANTS.WPLATA_MAX) : parseFloat(pobierzWartosc('input-doplata', 500));
    const lata = hasValidation ? window.walidujKwote(pobierzWartosc('input-horyzont', 10), 'horyzont', VALIDATION_CONSTANTS.LATA_MIN, VALIDATION_CONSTANTS.LATA_MAX) : parseFloat(pobierzWartosc('input-horyzont', 10));
    const stopaNom = hasValidation ? window.walidujProcent(pobierzWartosc('input-stopa', 7), 'stopa') / 100 : parseFloat(pobierzWartosc('input-stopa', 7)) / 100;
    const inflacjaRoczna = hasValidation ? window.walidujProcent(pobierzWartosc('input-inflacja', 2.5), 'inflacja') / 100 : parseFloat(pobierzWartosc('input-inflacja', 2.5)) / 100;
    
    // Early return jeśli walidacja się nie powiodła
    if (start === null || doplata === null || lata === null || stopaNom === null || inflacjaRoczna === null) {
        console.error('❌ Przerwano obliczenia - błędne dane wejściowe');
        updateChart([]);
        return;
    }
    
    const isIKE = document.getElementById('input-ike').checked;

        const stopaMsc = stopaNom / 12;
        const msc = lata * 12;

        let kapitalNominalny = start;
        let sumaWplat = start;
        let doplataLaczna = 0;
        let kapitalRealny = start; // Zdefiniuj przed pętlą

        const daneWykresu = {
            labels: [],
            nominalny: [],
            wplacone: [],
            realny: []
        };

        const tabelaBody = document.getElementById('tabela-body');
        if (tabelaBody) tabelaBody.innerHTML = '';

        // Symulacja miesiąc po miesiącu
        for (let m = 0; m <= msc; m++) {
            if (m > 0) {
                kapitalNominalny = kapitalNominalny * (1 + stopaMsc) + doplata;
                sumaWplat += doplata;
                doplataLaczna += doplata;
            }

            kapitalRealny = kapitalNominalny / Math.pow(1 + inflacjaRoczna / 12, m / 12);

            daneWykresu.labels.push(m > 0 ? `Rok ${Math.ceil(m / 12)}` : 'Start');
            daneWykresu.nominalny.push(kapitalNominalny);
            daneWykresu.wplacone.push(sumaWplat);
            daneWykresu.realny.push(kapitalRealny);

            // Wypełnianie tabeli
            if (Math.floor(m / 12) > 0 && tabelaBody) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>Rok ${Math.ceil(m / 12)}</td>
                    <td>${formatujZl(zaokraglij(sumaWplat))}</td>
                    <td>${formatujZl(zaokraglij(kapitalNominalny - sumaWplat))}</td>
                    <td>${formatujZl(zaokraglij(kapitalRealny))}</td>
                `;
                tabelaBody.appendChild(tr);
            }
        }

        // Obliczenia końcowe
        const zyskNominalny = kapitalNominalny - sumaWplat;
        const zyskRealny = kapitalRealny - sumaWplat;

        // CAGR
        const cagrNominalny = Math.pow(kapitalNominalny / start, 1 / lata) - 1;
        const cagrRealny = Math.pow(kapitalRealny / start, 1 / lata) - 1;

        // Aktualizacja UI
        animuj('etf-wynik-kapital-koncowy', kapitalNominalny, formatujZl);
        animuj('etf-wynik-zysk-po-podatku', zyskNominalny, formatujZl);
        animuj('etf-wynik-zysk-realny', zyskRealny, formatujZl); // Zysk realny (czysty przyrost siły nabywczej)

        document.getElementById('etf-wynik-cagr').textContent = formatujProcent(cagrNominalny);
        document.getElementById('etf-wynik-cagr-realny').textContent = formatujProcent(cagrRealny);

        // Tekst podatku
        const txtPodatek = document.getElementById('txt-podatek');
        if (txtPodatek) {
            if (isIKE) {
                txtPodatek.textContent = '0% (Konto IKE/IKZE zwolnione)';
                txtPodatek.style.color = 'var(--color-green-500)';
            } else {
                txtPodatek.textContent = '19% podatek Belki od zysku';
                txtPodatek.style.color = '';
            }
        }

        // Wykres
        updateChart({
            labels: daneWykresu.labels,
            datasets: [{
                label: 'Kapitał nominalny (brutto)',
                data: daneWykresu.nominalny,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.1
            }, {
                label: 'Wpłacone',
                data: daneWykresu.wplacone,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                tension: 0.1
            }, {
                label: 'Kapitał realny (inflacja)',
                data: daneWykresu.realny,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.1
            }]
        });
        
        // GA4 tracking event
        if (typeof gtag === 'function') {
            gtag('event', 'calculate', { 'calculator_type': 'etf' });
        }
}

/**
 * Inicjalizacja Chart.js - Revolut/Trading212 Style
 */
function initChart() {
    const canvas = document.getElementById('chartInwestycja');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Helper function for PLN formatting
    function formatZl(val) {
      if (val >= 1000000) return (val/1000000).toFixed(1) + 'M zł';
      if (val >= 1000) return (val/1000).toFixed(0) + 'k zł';
      return val.toFixed(0) + ' zł';
    }
    
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Portfel ETF',
                    data: [],
                    borderColor: '#1A56A0',
                    backgroundColor: 'rgba(26, 86, 160, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Wkład własny',
                    data: [],
                    borderColor: '#f4a261',
                    backgroundColor: 'rgba(244, 162, 97, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Wartość realna',
                    data: [],
                    borderColor: '#6b7280',
                    backgroundColor: 'rgba(107, 114, 128, 0.15)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
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
        }
    });
}


/**
 * Aktualizacja danych na wykresie
 */
function updateChart(dane) {
    console.log(' updateChart called with:', dane);
    console.log(' myChart exists:', !!myChart);
    
    if (!myChart) {
        console.error(' myChart not initialized');
        return;
    }

    console.log(' Updating chart with data length:', dane.labels?.length);
    myChart.data.labels = dane.labels;
    myChart.data.datasets[1].data = dane.wplacone;
    myChart.data.datasets[0].data = dane.nominalny;
    myChart.data.datasets[2].data = dane.realny;

    myChart.update('none');
    console.log(' Chart updated successfully');
    
    // GA4 tracking event
    if (typeof gtag === 'function') {
        gtag('event', 'calculate', { 'calculator_type': 'etf' });
    }
}

// Globalny alias dla HTML
window.setStopa = setStopa;
window.obliczWszystko = obliczWszystko;
