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

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', obliczWszystko);
        }
    });

    // Inicjalizacja wykresu
    if (window.ETF && window.ETF.charts) {
        initChart();
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
    // Pobranie danych przez utils
    const start = pobierzWartosc('input-kapital', 10000);
    const doplata = pobierzWartosc('input-doplata', 500);
    const lata = pobierzWartosc('input-horyzont', 10);
    const stopaNom = pobierzWartosc('input-stopa', 7) / 100;
    const inflacjaRoczna = pobierzWartosc('input-inflacja', 2.5) / 100;
    const isIKE = document.getElementById('input-ike').checked;

    const stopaMsc = stopaNom / 12;
    const msc = lata * 12;

    let kapitalNominalny = start;
    let sumaWplat = start;
    let doplataLaczna = 0;

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

        // Zbieranie danych do wykresu i tabeli (co roku)
        if (m % 12 === 0) {
            const rok = m / 12;
            const infSkumulowana = Math.pow(1 + inflacjaRoczna, rok);
            const kapitalRealny = kapitalNominalny / infSkumulowana;

            daneWykresu.labels.push(`Rok ${rok}`);
            daneWykresu.nominalny.push(zaokraglij(kapitalNominalny));
            daneWykresu.wplacone.push(zaokraglij(sumaWplat));
            daneWykresu.realny.push(zaokraglij(kapitalRealny));

            // Wypełnianie tabeli
            if (rok > 0 && tabelaBody) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>Rok ${rok}</td>
                    <td>${formatujZl(zaokraglij(sumaWplat))}</td>
                    <td>${formatujZl(zaokraglij(kapitalNominalny - sumaWplat))}</td>
                    <td><strong>${formatujZl(zaokraglij(kapitalNominalny))}</strong></td>
                    <td style="color: var(--color-primary-500)">${formatujZl(zaokraglij(kapitalRealny))}</td>
                `;
                tabelaBody.appendChild(tr);
            }
        }
    }

    // Podatki i wyniki końcowe
    const zyskBrutto = kapitalNominalny - sumaWplat;
    const podatek = isIKE ? 0 : Math.max(0, zyskBrutto * 0.19);
    const kapitalNetto = kapitalNominalny - podatek;
    const zyskNetto = zyskBrutto - podatek;

    // Realna wartość netto (po podatku i inflacji)
    // Obliczamy realny wzrost ponad inflację
    const infDocelowa = Math.pow(1 + inflacjaRoczna, lata);
    const kapitalRealnyNetto = kapitalNetto / infDocelowa;
    const zyskRealny = (kapitalNetto / infDocelowa) - (sumaWplat / 1); // Bardzo uproszczone

    // CAGR (Netto)
    const cagrNominalny = Math.pow(kapitalNetto / sumaWplat, 1 / lata) - 1 || 0;
    const cagrRealny = Math.pow(kapitalRealnyNetto / (sumaWplat / 1), 1 / lata) - 1 || 0;

    // Aktualizacja UI (używając animuj z utils.js)
    animuj('etf-wynik-kapital-koncowy', kapitalNetto);
    animuj('etf-wynik-wklad-wlasny', sumaWplat);
    animuj('etf-wynik-doplata-laczna', doplataLaczna);
    animuj('etf-wynik-zysk-nominalny', zyskBrutto);

    animuj('etf-wynik-podatek-belki', podatek);
    animuj('etf-wynik-zysk-po-podatku', zyskNetto);

    animuj('etf-wynik-zysk-realny', kapitalRealnyNetto - sumaWplat); // Zysk realny (czysty przyrost siły nabywczej)

    document.getElementById('etf-wynik-cagr').textContent = formatujProcent(cagrNominalny);
    document.getElementById('etf-wynik-cagr-realny').textContent = formatujProcent(cagrRealny);


    // Tekst podatku
    const txtPodatek = document.getElementById('txt-podatek');
    if (txtPodatek) {
        if (isIKE) {
            txtPodatek.textContent = "0% (Konto IKE/IKZE zwolnione)";
            txtPodatek.style.color = "var(--color-green-500)";
        } else {
            txtPodatek.textContent = "19% podatek Belki od zysku";
            txtPodatek.style.color = "";
        }
    }

    // Aktualizacja wykresu
    updateChart(daneWykresu);
}

/**
 * Inicjalizacja Chart.js
 */
function initChart() {
    const canvas = document.getElementById('chartInwestycja');
    if (!canvas || !window.ETF || !window.ETF.charts) return;
    const ctx = canvas.getContext('2d');

    const baseOptions = window.ETF.charts.getBaseOptions();
    
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                window.ETF.charts.createDataset(ctx, 'Portfel ETF', [], window.ETF.charts.colors.success),
                window.ETF.charts.createDataset(ctx, 'Wkład własny', [], window.ETF.charts.colors.muted),
                window.ETF.charts.createDataset(ctx, 'Wartość realna', [], window.ETF.charts.colors.accent)
            ]
        },
        options: baseOptions
    });
}


/**
 * Aktualizacja danych na wykresie
 */
function updateChart(dane) {
    if (!myChart) return;

    myChart.data.labels = dane.labels;
    myChart.data.datasets[1].data = dane.wplacone;
    myChart.data.datasets[0].data = dane.nominalny;
    myChart.data.datasets[2].data = dane.realny;

    myChart.update('none');
}

// Globalny alias dla HTML
window.setStopa = setStopa;
window.obliczWszystko = obliczWszystko;
