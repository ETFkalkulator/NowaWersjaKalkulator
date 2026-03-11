/* ============================================================
   utils.js — ETFkalkulator.pl
   Pomocnicze funkcje używane przez wszystkie kalkulatory.
   Zasada DRY: piszemy raz, używamy wszędzie.
   ============================================================ */


/* ----------------------------------------------------------
   DEBOUNCING - optymalizacja performance inputów
   Zapobiega zbyt częstym przeliczeniom kalkulatorów
   ---------------------------------------------------------- */

/**
 * Zwraca funkcję opóźnioną (debounced)
 * @param {Function} func - funkcja do wykonania
 * @param {number} delay - opóźnienie w ms
 * @returns {Function} - funkcja debounced
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/* ----------------------------------------------------------
   WALIDACJA DANYCH WEJŚCIOWYCH
   Zapewnia poprawność zakresów wartości wejściowych
   ---------------------------------------------------------- */

/**
 * Stałe walidacyjne dla kalkulatorów
 */
const VALIDATION_CONSTANTS = {
  STOPA_MIN: 0,
  STOPA_MAX: 1,           // 100%
  INFLACJA_MIN: 0,
  INFLACJA_MAX: 0.5,     // 50%
  KAPITAL_MIN: 0,
  KAPITAL_MAX: 10000000,  // 10M zł
  WPLATA_MIN: 0,
  WPLATA_MAX: 50000,      // 50K zł miesięcznie
  WYDATKI_MIN: 0,
  WYDATKI_MAX: 50000,     // 50K zł miesięcznie
  LATA_MIN: 1,
  LATA_MAX: 50
};

/**
 * Waliduje i normalizuje wartość procentową
 * @param {number|string} value - wartość do walidacji
 * @param {string} fieldName - nazwa pola dla komunikatu błędu
 * @returns {number|null} - zwalidowana wartość lub null przy błędzie
 */
function walidujProcent(value, fieldName) {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    console.error(`❌ Nieprawidłowa wartość procentowa w polu ${fieldName}: ${value}`);
    return null;
  }
  
  if (num < VALIDATION_CONSTANTS.STOPA_MIN || num > VALIDATION_CONSTANTS.STOPA_MAX) {
    console.error(`❌ Wartość procentowa poza zakresem w polu ${fieldName}: ${num} (dozwolone: ${VALIDATION_CONSTANTS.STOPA_MIN}-${VALIDATION_CONSTANTS.STOPA_MAX})`);
    return null;
  }
  
  return num;
}

/**
 * Waliduje i normalizuje wartość kwotową
 * @param {number|string} value - wartość do walidacji
 * @param {string} fieldName - nazwa pola dla komunikatu błędu
 * @param {number} minVal - minimalna wartość
 * @param {number} maxVal - maksymalna wartość
 * @returns {number|null} - zwalidowana wartość lub null przy błędzie
 */
function walidujKwote(value, fieldName, minVal = null, maxVal = null) {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    console.error(`❌ Nieprawidłowa wartość kwotowa w polu ${fieldName}: ${value}`);
    return null;
  }
  
  const min = minVal !== null ? minVal : VALIDATION_CONSTANTS.KAPITAL_MIN;
  const max = maxVal !== null ? maxVal : VALIDATION_CONSTANTS.KAPITAL_MAX;
  
  if (num < min || num > max) {
    console.error(`❌ Wartość kwotowa poza zakresem w polu ${fieldName}: ${num} (dozwolone: ${min}-${max})`);
    return null;
  }
  
  return num;
}

/* ----------------------------------------------------------
   ERROR BOUNDARIES - bezpieczeństwo aplikacji
   Zapobiega crashom kalkulatorów i zapewnia fallback UI
   ---------------------------------------------------------- */

/**
 * Bezpiecznie wykonuje funkcję z obsługą błędów
 * @param {Function} func - funkcja do wykonania
 * @param {string} context - kontekst błędu
 * @param {Function} fallback - funkcja awaryjna
 * @returns {*} - wynik funkcji lub fallback
 */
function safeExecute(func, context, fallback = null) {
  try {
    return func();
  } catch (error) {
    console.error(`❌ Błąd w ${context}:`, error);
    
    // Wyświetl użytkownikowi informację o błędzie
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
      errorElement.textContent = `Wystąpił błąd: ${error.message}`;
      errorElement.style.display = 'block';
      errorElement.className = 'error-message';
    }
    
    // Spróbuj użyć fallback jeśli dostępny
    if (fallback && typeof fallback === 'function') {
      try {
        return fallback();
      } catch (fallbackError) {
        console.error('❌ Błąd fallbacku:', fallbackError);
      }
    }
    
    return null;
  }
}

/**
 * Czyści komunikaty błędów
 */
function clearErrorMessages() {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.style.display = 'none';
    errorElement.textContent = '';
  }
}

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

// Export validation constants and functions
window.VALIDATION_CONSTANTS = VALIDATION_CONSTANTS;
window.walidujProcent = walidujProcent;
window.walidujKwote = walidujKwote;
window.debounce = debounce;
window.safeExecute = safeExecute;
window.clearErrorMessages = clearErrorMessages;
