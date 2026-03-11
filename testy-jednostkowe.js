// Testy Jednostkowe dla Kalkulatorów ETFkalkulator.pl
// Autor: Ekspert Programista
// Cel: Weryfikacja poprawności obliczeń

console.log('🧪 Rozpoczynanie testów jednostkowych kalkulatorów ETFkalkulator.pl');

// Test Case 1: Parametry podstawowe
function testCase1() {
    console.log('\n📊 Test Case 1: Parametry podstawowe');
    const params = {
        kapital: 10000,
        doplata: 500,
        lata: 10,
        stopa: 0.07,
        inflacja: 0.025,
        ike: false
    };
    
    // Oczekiwane wyniki (wzory finansowe)
    const miesiace = params.lata * 12;
    const stopaMies = params.stopa / 12;
    
    let kapital = params.kapital;
    let sumaWplat = params.kapital;
    
    for (let i = 1; i <= miesiace; i++) {
        kapital = kapital * (1 + stopaMies) + params.doplata;
        sumaWplat += params.doplata;
    }
    
    const zyskBrutto = kapital - sumaWplat;
    const podatek = zyskBrutto * 0.19;
    const kapitalNetto = kapital - podatek;
    const zyskNetto = zyskBrutto - podatek;
    
    console.log('Oczekiwane wyniki:');
    console.log(`Kapitał końcowy brutto: ${kapital.toFixed(2)} zł`);
    console.log(`Zysk brutto: ${zyskBrutto.toFixed(2)} zł`);
    console.log(`Podatek 19%: ${podatek.toFixed(2)} zł`);
    console.log(`Kapitał końcowy netto: ${kapitalNetto.toFixed(2)} zł`);
    console.log(`Zysk netto: ${zyskNetto.toFixed(2)} zł`);
    
    return {
        kapitalNetto: kapitalNetto,
        zyskNetto: zyskNetto,
        zyskBrutto: zyskBrutto,
        podatek: podatek
    };
}

// Test Case 2: IKE (zwolnienie z podatku)
function testCase2() {
    console.log('\n🛡️ Test Case 2: IKE (zwolnienie z podatku)');
    const params = {
        kapital: 10000,
        doplata: 500,
        lata: 10,
        stopa: 0.07,
        inflacja: 0.025,
        ike: true
    };
    
    const miesiace = params.lata * 12;
    const stopaMies = params.stopa / 12;
    
    let kapital = params.kapital;
    let sumaWplat = params.kapital;
    
    for (let i = 1; i <= miesiace; i++) {
        kapital = kapital * (1 + stopaMies) + params.doplata;
        sumaWplat += params.doplata;
    }
    
    const zyskBrutto = kapital - sumaWplat;
    const podatek = 0; // IKE - zwolnienie
    const kapitalNetto = kapital;
    const zyskNetto = zyskBrutto;
    
    console.log('Oczekiwane wyniki IKE:');
    console.log(`Kapitał końcowy brutto: ${kapital.toFixed(2)} zł`);
    console.log(`Zysk brutto: ${zyskBrutto.toFixed(2)} zł`);
    console.log(`Podatek: ${podatek.toFixed(2)} zł (zwolnienie)`);
    console.log(`Kapitał końcowy netto: ${kapitalNetto.toFixed(2)} zł`);
    console.log(`Zysk netto: ${zyskNetto.toFixed(2)} zł`);
    
    return {
        kapitalNetto: kapitalNetto,
        zyskNetto: zyskNetto,
        zyskBrutto: zyskBrutto,
        podatek: podatek
    };
}

// Test Case 3: Dopłata = 0 (tylko kapitał początkowy)
function testCase3() {
    console.log('\n💰 Test Case 3: Dopłata = 0');
    const params = {
        kapital: 10000,
        doplata: 0,
        lata: 10,
        stopa: 0.07,
        inflacja: 0.025,
        ike: false
    };
    
    const miesiace = params.lata * 12;
    const stopaMies = params.stopa / 12;
    
    let kapital = params.kapital;
    let sumaWplat = params.kapital;
    
    for (let i = 1; i <= miesiace; i++) {
        kapital = kapital * (1 + stopaMies);
        // Brak dopłaty
    }
    
    const zyskBrutto = kapital - sumaWplat;
    const podatek = zyskBrutto * 0.19;
    const kapitalNetto = kapital - podatek;
    const zyskNetto = zyskBrutto - podatek;
    
    console.log('Oczekiwane wyniki (dopłata = 0):');
    console.log(`Kapitał końcowy brutto: ${kapital.toFixed(2)} zł`);
    console.log(`Zysk brutto: ${zyskBrutto.toFixed(2)} zł`);
    console.log(`Podatek 19%: ${podatek.toFixed(2)} zł`);
    console.log(`Kapitał końcowy netto: ${kapitalNetto.toFixed(2)} zł`);
    console.log(`Zysk netto: ${zyskNetto.toFixed(2)} zł`);
    
    return {
        kapitalNetto: kapitalNetto,
        zyskNetto: zyskNetto,
        zyskBrutto: zyskBrutto,
        podatek: podatek
    };
}

// Test Case 4: Wysoka stopa (12% rocznie)
function testCase4() {
    console.log('\n📈 Test Case 4: Wysoka stopa (12% rocznie)');
    const params = {
        kapital: 10000,
        doplata: 500,
        lata: 10,
        stopa: 0.12,
        inflacja: 0.025,
        ike: false
    };
    
    const miesiace = params.lata * 12;
    const stopaMies = params.stopa / 12;
    
    let kapital = params.kapital;
    let sumaWplat = params.kapital;
    
    for (let i = 1; i <= miesiace; i++) {
        kapital = kapital * (1 + stopaMies) + params.doplata;
        sumaWplat += params.doplata;
    }
    
    const zyskBrutto = kapital - sumaWplat;
    const podatek = zyskBrutto * 0.19;
    const kapitalNetto = kapital - podatek;
    const zyskNetto = zyskBrutto - podatek;
    
    console.log('Oczekiwane wyniki (12% rocznie):');
    console.log(`Kapitał końcowy brutto: ${kapital.toFixed(2)} zł`);
    console.log(`Zysk brutto: ${zyskBrutto.toFixed(2)} zł`);
    console.log(`Podatek 19%: ${podatek.toFixed(2)} zł`);
    console.log(`Kapitał końcowy netto: ${kapitalNetto.toFixed(2)} zł`);
    console.log(`Zysk netto: ${zyskNetto.toFixed(2)} zł`);
    
    return {
        kapitalNetto: kapitalNetto,
        zyskNetto: zyskNetto,
        zyskBrutto: zyskBrutto,
        podatek: podatek
    };
}

// Funkcja porównawcza
function porownajWyniki(nazwaKalkulatora, wynik, oczekiwane) {
    const roznicaKapitalu = Math.abs(wynik.kapitalNetto - oczekiwane.kapitalNetto);
    const roznicaZysku = Math.abs(wynik.zyskNetto - oczekiwane.zyskNetto);
    const roznicaPodatku = Math.abs(wynik.podatek - oczekiwane.podatek);
    
    const tolerancja = 0.01; // 1% tolerancja na zaokrąglanie
    
    const kapitalPoprawny = roznicaKapitalu / oczekiwane.kapitalNetto < tolerancja;
    const zyskPoprawny = roznicaZysku / oczekiwane.zyskNetto < tolerancja;
    const podatekPoprawny = roznicaPodatku / oczekiwane.podatek < tolerancja;
    
    console.log(`\n🔍 ${nazwaKalkulatora}:`);
    console.log(`Kapitał końcowy: ${wynik.kapitalNetto.toFixed(2)} zł (oczekiwane: ${oczekiwane.kapitalNetto.toFixed(2)} zł) ${kapitalPoprawny ? '✅' : '❌'}`);
    console.log(`Zysk netto: ${wynik.zyskNetto.toFixed(2)} zł (oczekiwane: ${oczekiwane.zyskNetto.toFixed(2)} zł) ${zyskPoprawny ? '✅' : '❌'}`);
    console.log(`Podatek: ${wynik.podatek.toFixed(2)} zł (oczekiwane: ${oczekiwane.podatek.toFixed(2)} zł) ${podatekPoprawny ? '✅' : '❌'}`);
    
    return {
        poprawny: kapitalPoprawny && zyskPoprawny && podatekPoprawny,
        roznice: {
            kapital: roznicaKapitalu,
            zysk: roznicaZysku,
            podatek: roznicaPodatku
        }
    };
}

// Wykonanie testów
console.log('🚀 Wykonywanie testów jednostkowych...');

const test1 = testCase1();
const test2 = testCase2();
const test3 = testCase3();
const test4 = testCase4();

console.log('\n📋 PODSUMOWANIE TESTÓW:');
console.log('=====================================');

// Tutaj można wpisać wyniki z kalkulatorów i porównać
console.log('\n🔄 Wpisz wyniki z kalkulatorów ETFkalkulator.pl:');
console.log('ETF: kapitalNetto, zyskNetto, podatek');
console.log('Porównywarka: kapitalNetto, zyskNetto, podatek');
console.log('Obligacje: kapitalNetto, zyskNetto, podatek');
console.log('FIRE: kapitalNetto, zyskNetto, podatek');

console.log('\n✅ Testy zakończone. Otwórz konsolę w kalkulatorach i porównaj wyniki.');
