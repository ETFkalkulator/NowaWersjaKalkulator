/* ============================================================
   utils.js — ETFkalkulator.pl
   Pomocnicze funkcje używane przez wszystkie kalkulatory.
   Zasada DRY: piszemy raz, używamy wszędzie.
   ============================================================ */


/* ----------------------------------------------------------
   FORMATOWANIE LICZB
   Intl.NumberFormat to wbudowany mechanizm przeglądarki
   który formatuje liczby według lokalnych zasad danego kraju.
   'pl-PL' = format polski: spacja jako separator tysięcy,
   przecinek jako separator dziesiętny.
   ---------------------------------------------------------- */

/**
 * Formatuje liczbę jako procent
 * Przykład: formatujProcent(0.065) → "6,50%"
 */
function formatujProcent(liczba) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(liczba);
}

/**
 * Formatuje liczbę jako kwotę w złotych
 * Przykład: formatujZl(10500.5) → "10 500,50 zł"
 */
function formatujZl(liczba) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(liczba);
};

/**
 * Formatuje dużą liczbę z separatorem tysięcy (bez waluty)
 * Przykład: formatujLiczbe(10500) → "10 500"
 */
function formatujLiczbe(liczba) {
  return new Intl.NumberFormat('pl-PL').format(liczba);
}


/* ----------------------------------------------------------
   WALIDACJA DANYCH
   Sprawdzamy czy użytkownik wpisał sensowne wartości
   zanim wykonamy obliczenia. Zapobiega błędom typu NaN
   (Not a Number) w wynikach.
   ---------------------------------------------------------- */

/**
 * Sprawdza czy wartość jest poprawną dodatnią liczbą
 * Przykład: czyPoprawnaCyfra("abc") → false
 *           czyPoprawnaCyfra(-5)    → false
 *           czyPoprawnaCyfra(1000)  → true
 */
function czyPoprawnaCyfra(wartosc) {
  const liczba = parseFloat(wartosc);
  return !isNaN(liczba) && liczba > 0;
}

/**
 * Pobiera wartość z pola input i konwertuje na liczbę
 * Jeśli pole jest puste lub niepoprawne — zwraca wartość domyślną
 * Przykład: pobierzWartosc('kwota', 10000) → 10000 (jeśli pole puste)
 */
function pobierzWartosc(idPola, domyslna = 0) {
  const pole = document.getElementById(idPola);
  if (!pole) return domyslna;
  const wartosc = parseFloat(pole.value);
  return isNaN(wartosc) ? domyslna : wartosc;
}


/* ----------------------------------------------------------
   ZAOKRĄGLANIE
   Unikamy błędów zaokrąglania JavaScript
   np. 0.1 + 0.2 = 0.30000000000000004 w JS
   Ta funkcja zaokrągla do podanej liczby miejsc dziesiętnych.
   ---------------------------------------------------------- */

/**
 * Zaokrągla liczbę do n miejsc po przecinku
 * Przykład: zaokraglij(10500.567, 2) → 10500.57
 */
function zaokraglij(liczba, miejsca = 2) {
  return Math.round(liczba * Math.pow(10, miejsca)) / Math.pow(10, miejsca);
}


/* ----------------------------------------------------------
   ANIMACJA LICZB
   Gdy wynik się zmienia, liczba "wjeżdża" animując się
   od poprzedniej wartości do nowej. Daje poczucie że
   kalkulator naprawdę liczy — nie tylko podmienia tekst.
   ---------------------------------------------------------- */

/**
 * Animuje zmianę wartości liczbowej w elemencie HTML
 * @param {string} idElementu - id elementu HTML do aktualizacji
 * @param {number} nowaWartosc - docelowa wartość
 * @param {Function} formatuj - funkcja formatowania (np. formatujZl)
 * @param {number} czas - czas animacji w ms (domyślnie 600ms)
 */
function animujLiczbe(idElementu, nowaWartosc, formatuj = formatujZl, czas = 600) {
  const element = document.getElementById(idElementu);
  if (!element) return;

  // Pobieramy obecną wartość liczbową z elementu
  const obecnaWartosc = parseFloat(element.dataset.wartosc) || 0;
  const roznica = nowaWartosc - obecnaWartosc;
  const start = performance.now();

  // Funkcja easing — animacja przyspiesza i zwalnia (jak Apple)
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const krok = (aktualnyczas) => {
    const postep = Math.min((aktualnyczas - start) / czas, 1);
    const wartosc = obecnaWartosc + roznica * easeOutCubic(postep);
    element.textContent = formatuj(zaokraglij(wartosc, 2));

    if (postep < 1) {
      requestAnimationFrame(krok);
    } else {
      // Zapisujemy końcową wartość jako atrybut data
      element.dataset.wartosc = nowaWartosc;
      element.textContent = formatuj(nowaWartosc);
    }
  };

  requestAnimationFrame(krok);
};


/* ----------------------------------------------------------
   EKSPORT FUNKCJI
   Udostępniamy funkcje dla innych plików JS w projekcie.
   Dzięki temu obligacje.js może używać formatujZl bez
   kopiowania kodu.
   ---------------------------------------------------------- */

window.ETF = window.ETF || {};
window.ETF.utils = {
  formatujZl,
  formatujProcent,
  formatujLiczbe,
  czyPoprawnaCyfra,
  pobierzWartosc,
  zaokraglij,
  animujLiczbe,
};

/* ----------------------------------------------------------
   ALIASY GLOBALNE
   Dla wygody — wszystkie kalkulatory mogą używać
   tych funkcji bezpośrednio bez window.ETF.utils.
   ---------------------------------------------------------- */
window.formatujZl = formatujZl;
window.formatujProcent = formatujProcent;
window.formatujLiczbe = formatujLiczbe;
window.czyPoprawnaCyfra = czyPoprawnaCyfra;
window.pobierzWartosc = pobierzWartosc;
window.zaokraglij = zaokraglij;
window.animuj = animujLiczbe;  /* alias: animuj() = animujLiczbe() */
