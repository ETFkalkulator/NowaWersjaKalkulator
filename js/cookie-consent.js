/* ============================================================
   cookie-consent.js — ETFkalkulator.pl
   Jeden plik obsługuje wszystkie strony.
   Wstrzykuje banner dynamicznie, obsługuje GA4 Consent Mode v2.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'etf-cookie-consent';

  // Ścieżka do polityki prywatności — dynamiczna na podstawie lokalizacji strony
  function getPrivacyPath() {
    var path = window.location.pathname;
    if (path.indexOf('/pages/') !== -1) return 'polityka-prywatnosci.html#cookies';
    if (path.indexOf('/blog/') !== -1) return '../pages/polityka-prywatnosci.html#cookies';
    return 'pages/polityka-prywatnosci.html#cookies';
  }

  // Jeśli użytkownik już wybrał — zaktualizuj consent i zakończ (bez bannera)
  var existing = localStorage.getItem(STORAGE_KEY);
  if (existing === 'accepted') {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    return;
  }
  if (existing === 'rejected') {
    return;
  }

  // --- Wstrzyknięcie bannera ---
  function injectBanner() {
    if (document.getElementById('etf-cookie-banner')) return;

    var privacyPath = getPrivacyPath();

    var el = document.createElement('div');
    el.id = 'etf-cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Zgoda na pliki cookie');
    el.setAttribute('aria-live', 'polite');
    el.style.cssText = [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'z-index:9999',
      'transform:translateY(100%)',
      'transition:transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      'padding:0 0 1rem 0'
    ].join(';');

    el.innerHTML =
      '<div style="max-width:80rem;margin:0 auto;padding:0 1rem">' +
        '<div style="' +
          'background:var(--color-stitch-surface, #fff);' +
          'border:1px solid var(--color-stitch-border, #e2e8f0);' +
          'border-radius:1rem;' +
          'box-shadow:0 8px 32px rgba(0,0,0,0.10),0 1.5px 6px rgba(0,0,0,0.07);' +
          'padding:1rem 1.25rem;' +
          'display:flex;' +
          'align-items:center;' +
          'gap:1rem;' +
          'flex-wrap:wrap' +
        '">' +

          /* Ikona */
          '<div style="' +
            'width:2.25rem;height:2.25rem;border-radius:0.75rem;' +
            'background:rgba(13,127,242,0.10);' +
            'display:flex;align-items:center;justify-content:center;flex-shrink:0' +
          '">' +
            '<span class="material-symbols-outlined" style="font-size:1.2rem;color:#0d7ff2">shield</span>' +
          '</div>' +

          /* Tekst */
          '<div style="flex:1;min-width:200px">' +
            '<p style="margin:0;font-size:0.8125rem;font-weight:700;color:var(--color-stitch-text, #1e293b)">Twoja prywatność</p>' +
            '<p style="margin:0.25rem 0 0;font-size:0.75rem;color:var(--color-stitch-muted, #64748b);line-height:1.5">' +
              'Nie zbieramy własnych danych osobowych. Używamy wyłącznie Google Analytics (anonimowo) do ulepszania kalkulatorów. ' +
              '<a href="' + privacyPath + '" style="color:#0d7ff2;text-decoration:underline">Polityka cookies</a>.' +
            '</p>' +
          '</div>' +

          /* Przyciski */
          '<div style="display:flex;gap:0.5rem;flex-shrink:0">' +
            '<button id="etf-cookie-reject" style="' +
              'padding:0.5rem 1.125rem;font-size:0.75rem;font-weight:700;' +
              'border:none;border-radius:0.75rem;cursor:pointer;' +
              'background:var(--color-stitch-bg, #f1f5f9);' +
              'color:var(--color-stitch-muted, #64748b);' +
              'transition:opacity .2s' +
            '">Odrzuć</button>' +
            '<button id="etf-cookie-accept" style="' +
              'padding:0.5rem 1.125rem;font-size:0.75rem;font-weight:700;' +
              'border:none;border-radius:0.75rem;cursor:pointer;' +
              'background:#0d7ff2;color:#fff;' +
              'transition:opacity .2s' +
            '">Akceptuję</button>' +
          '</div>' +

        '</div>' +
      '</div>';

    document.body.appendChild(el);

    // Animacja wejścia
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.transform = 'translateY(0)';
      });
    });

    // Hover effects
    var acceptBtn = document.getElementById('etf-cookie-accept');
    var rejectBtn = document.getElementById('etf-cookie-reject');

    acceptBtn.addEventListener('mouseenter', function () { this.style.opacity = '0.88'; });
    acceptBtn.addEventListener('mouseleave', function () { this.style.opacity = '1'; });
    rejectBtn.addEventListener('mouseenter', function () { this.style.opacity = '0.72'; });
    rejectBtn.addEventListener('mouseleave', function () { this.style.opacity = '1'; });

    // Logika wyboru
    acceptBtn.addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      if (typeof gtag === 'function') {
        gtag('consent', 'update', { analytics_storage: 'granted' });
      }
      hideBanner(el);
    });

    rejectBtn.addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'rejected');
      hideBanner(el);
    });
  }

  function hideBanner(el) {
    el.style.transform = 'translateY(100%)';
    setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 500);
  }

  // Wstrzyknij po załadowaniu DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBanner);
  } else {
    injectBanner();
  }

})();
