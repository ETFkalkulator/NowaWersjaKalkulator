// shared.js
// Common functionality for ETFkalkulator.pl calculators

window.modalData = window.modalData || {};

window.debounce = function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

window.shareResult = function (title) {
    // If the calculator has an updateUrlParams function, call it first
    if (typeof updateUrlParams === 'function') {
        updateUrlParams();
    }

    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: title || 'Moja symulacja - ETFkalkulator.pl',
            url: url
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url).then(() => {
            const btnTxt = document.getElementById('txt-btn-share');
            if (btnTxt) {
                // Ensure we only store the text, not overwriting it if user clicks rapidly
                if (!btnTxt.dataset.originalText) {
                    btnTxt.dataset.originalText = btnTxt.innerText;
                }
                btnTxt.innerText = 'Skopiowano link! ✔️';
                setTimeout(() => {
                    btnTxt.innerText = btnTxt.dataset.originalText;
                    delete btnTxt.dataset.originalText;
                }, 2000);
            }
        });
    }
};

window.openEduModal = function (type, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }

    const data = window.modalData[type];
    if (!data) return;

    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-explanation');
    const formulaEl = document.getElementById('modal-formula');
    const iconEl = document.getElementById('modal-icon');

    if (titleEl) titleEl.innerText = data.title;
    if (descEl) descEl.innerText = data.desc;
    if (formulaEl) formulaEl.innerText = data.formula;
    if (iconEl) iconEl.innerText = data.icon;

    const modal = document.getElementById('edu-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};

window.closeEduModal = function () {
    const modal = document.getElementById('edu-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

/**
 * Nagłówek Cookie Consent — Centralizacja
 * Zarządza banerem plików cookies i zgodami Google Analytics (gtag).
 */
window.initCookieConsent = function () {
    // 1. Sprawdź czy wybór już był
    const choice = localStorage.getItem('etf-cookie-consent');
    
    // Funkcja aktualizacji GA
    const updateGtagConsent = (status) => {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': status === 'accepted' ? 'granted' : 'denied',
                'ad_storage': status === 'accepted' ? 'granted' : 'denied'
            });
            
            // Manualnie wyślij page_view po przyznaniu zgody, ponieważ send_page_view jest wyłączone w configu
            if (status === 'accepted') {
                gtag('event', 'page_view');
            }
        }
    };

    // Jeśli wybór już był — zaktualizuj consent i zakończ
    if (choice) {
        updateGtagConsent(choice);
        return;
    }

    // 2. Jeśli brak wyboru — wstrzyknij baner (jeśli jeszcze go nie ma)
    let cookieConsent = document.getElementById('cookie-consent');
    if (!cookieConsent) {
        // Wykrywanie ścieżki (czy jesteśmy w podfolderze np. /blog/ lub /pages/)
        const isSubfolder = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/pages/');
        const basePath = isSubfolder ? '../' : '';
        const policyPath = `${basePath}pages/polityka-prywatnosci.html`;

        const bannerHtml = `
            <div id="cookie-consent"
                class="fixed bottom-6 left-6 right-6 md:left-auto md:w-[400px] bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-[100] transition-all duration-500 translate-y-20 opacity-0 transform"
                style="display: none">
                <div class="flex items-start gap-4 mb-4">
                    <div class="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-2xl text-amber-600 dark:text-amber-400">
                        <span class="material-symbols-outlined">cookie</span>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-900 dark:text-white">Prywatność i cookies</h4>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                            Używamy ciasteczek, aby zapewnić najlepszą jakość korzystania z naszych kalkulatorów. Kontynuując przeglądanie, zgadzasz się na naszą 
                            <a href="${policyPath}" class="underline hover:text-primary transition-colors">politykę prywatności</a>.
                        </p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button id="cookie-accept" class="flex-1 bg-primary text-white text-xs font-bold py-3 rounded-xl hover:opacity-90 transition-opacity" style="background-color: #0d7ff2">Akceptuję</button>
                    <button id="cookie-reject" class="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Odrzuć</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', bannerHtml);
        cookieConsent = document.getElementById('cookie-consent');
    }

    if (!cookieConsent) return;

    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    // Pokaż baner z animacją
    cookieConsent.style.display = 'block';
    setTimeout(() => {
        cookieConsent.style.opacity = '1';
        cookieConsent.style.transform = 'translateY(0)';
    }, 100);

    // Event Listeners
    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('etf-cookie-consent', 'accepted');
        cookieConsent.style.opacity = '0';
        cookieConsent.style.transform = 'translateY(20px)';
        setTimeout(() => { cookieConsent.style.display = 'none'; }, 300);
        updateGtagConsent('accepted');
        
        if (typeof gtag === 'function') {
            gtag('event', 'cookie_consent_accepted');
        }
    });

    rejectBtn?.addEventListener('click', () => {
        localStorage.setItem('etf-cookie-consent', 'rejected');
        cookieConsent.style.opacity = '0';
        cookieConsent.style.transform = 'translateY(20px)';
        setTimeout(() => { cookieConsent.style.display = 'none'; }, 300);
        updateGtagConsent('rejected');
    });
};

/**
 * Dark Mode Management
 * -------------------
 * Global switch for dark/light mode with state persistence.
 */
window.przelaczTryb = function() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    if (isDark) {
        html.classList.remove('dark', 'dark-mode');
        html.classList.add('light', 'light-mode');
        localStorage.setItem('etf-tryb', 'jasny');
    } else {
        html.classList.add('dark', 'dark-mode');
        html.classList.remove('light', 'light-mode');
        localStorage.setItem('etf-tryb', 'ciemny');
    }

    const d = html.classList.contains('dark');
    const m = document.getElementById('meta-theme-color');
    if (m) m.content = d ? '#0f172a' : '#f8fafc';
};

// Initialize Theme
(function() {
    const html = document.documentElement;
    const saved = localStorage.getItem('etf-tryb');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'ciemny' || (!saved && systemDark)) {
        html.classList.add('dark', 'dark-mode');
        html.classList.remove('light', 'light-mode');
    } else {
        html.classList.add('light', 'light-mode');
        html.classList.remove('dark', 'dark-mode');
    }

    const m = document.getElementById('meta-theme-color');
    if (m) m.content = html.classList.contains('dark') ? '#0f172a' : '#f8fafc';
})();

// Automatyczna inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    window.initCookieConsent();
});
