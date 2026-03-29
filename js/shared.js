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
