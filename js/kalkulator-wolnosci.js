/* ============================================================
   kalkulator-wolnosci.js — UI wiring for FIRE Calculator
   ETFkalkulator.pl
   ============================================================ */

'use strict';

var savedScenariosFire = [];

// Modal data for educational popups
window.modalData = window.modalData || {};
Object.assign(window.modalData, {
  wydatki_mies: { title: "Miesięczne wydatki", desc: "Twoje obecne miesięczne wydatki na życie. To podstawa do obliczenia celu FIRE — im niższe wydatki, tym mniej kapitału potrzebujesz i tym szybciej osiągniesz wolność finansową.", formula: "Wydatki roczne = Wydatki miesięczne × 12", icon: "shopping_cart" },
  stopa_wyplat: { title: "Stopa wypłat", desc: "Procent kapitału który wypłacasz rocznie w fazie emerytury. Reguła 4% pochodzi z badania 'Trinity Study' — wypłacanie 4% rocznie jest bezpieczne przez 30+ lat przy zdywersyfikowanym portfelu. Niższa stopa = bezpieczniej, ale wymaga więcej kapitału.", formula: "Cel FIRE = Wydatki roczne ÷ Stopa wypłat (np. 3 000 × 12 ÷ 0.04 = 900 000 zł)", icon: "percent" },
  oszczednosci_mies: { title: "Miesięczne oszczędności", desc: "Kwota którą odkładasz co miesiąc na inwestycje. To najważniejszy parametr — regularność i kwota oszczędzania ma większy wpływ na wynik niż stopa zwrotu w pierwszych latach budowania kapitału.", formula: "Kapitał(n) = Kapitał(n-1) × (1+r) + Oszczędności", icon: "savings" },
  kapital_start_fire: { title: "Kapitał startowy", desc: "Masz już jakieś oszczędności lub inwestycje? Wpisz ich aktualną wartość. Każda złotówka startowego kapitału pracuje przez cały horyzont inwestycji — im więcej masz teraz, tym szybciej osiągniesz cel.", formula: "FV = PV × (1+r)^n + PMT × ((1+r)^n - 1) / r", icon: "account_balance_wallet" },
  stopa_zwrotu_fire: { title: "Stopa zwrotu", desc: "Oczekiwany średnioroczny zwrot z Twoich inwestycji. ETF na MSCI World historycznie dawał ok. 7-10% rocznie nominalnie. Kalkulator odejmuje inflację i podatek Belki żeby pokazać realny wynik.", formula: "Stopa realna = (1 + stopa nominalna) / (1 + inflacja) - 1", icon: "show_chart" },
  inflacja_fire: { title: "Oczekiwana inflacja", desc: "Inflacja zmniejsza siłę nabywczą pieniądza w czasie. W kalkulatorze FIRE inflacja ma podwójne znaczenie — zmniejsza realną wartość Twojego kapitału podczas akumulacji, ale też zwiększa Twoje przyszłe wydatki podczas wypłat.", formula: "Realna stopa = (1 + nominalna) / (1 + inflacja) - 1", icon: "trending_up" },
  lata_cel: { title: "Cel czasowy", desc: "Za ile lat chcesz osiągnąć wolność finansową? Kalkulator wyliczy ile musisz odkładać miesięcznie żeby to osiągnąć przy podanej stopie zwrotu. To odwrotna kalkulacja — wynik zobaczysz w kafelku 'Wymagane oszczędności'.", formula: "PMT = (Cel FIRE - PV×(1+r)^n) / ((1+r)^n - 1) × r", icon: "event" },
  cel_fire: { title: "Cel FIRE", desc: "Kwota kapitału przy której możesz przestać pracować. Obliczona jako Twoje wydatki roczne podzielone przez stopę wypłat. Przy regule 4% to 25-krotność rocznych wydatków. Twój portfel powinien generować tyle odsetek/dywidend ile potrzebujesz na życie.", formula: "Cel FIRE = Wydatki roczne ÷ Stopa wypłat = Wydatki × 25", icon: "flag" },
  lata_do_fire: { title: "Ile lat do FIRE", desc: "Szacowany czas do osiągnięcia wolności finansowej przy obecnym tempie oszczędzania i podanej stopie zwrotu. Symulacja odbywa się miesiąc po miesiącu aż kapitał osiągnie cel FIRE.", formula: "Symulacja: Kapitał(m+1) = (Kapitał(m) + Oszczędności) × (1 + r/12)", icon: "timer" },
  wydatki_roczne: { title: "Wydatki roczne", desc: "Twoje roczne wydatki obliczone jako miesięczne × 12. To podstawa do wyliczenia celu FIRE metodą reguły 4%. Pamiętaj że w fazie emerytury wydatki będą rosły razem z inflacją.", formula: "Wydatki roczne = Wydatki miesięczne × 12", icon: "receipt_long" },
  wymagane_oszczednosci: { title: "Wymagane oszczędności", desc: "Ile musisz odkładać miesięcznie żeby osiągnąć cel FIRE w zadanym czasie. Obliczone na podstawie wzoru annuity — uwzględnia procent składany i Twój kapitał startowy.", formula: "PMT = (Cel - PV×(1+r)^n) ÷ ((1+r)^n - 1) × r", icon: "calculate" },
  wklad_laczny: { title: "Łączny wkład", desc: "Suma wszystkich Twoich wpłat — kapitał startowy plus wszystkie miesięczne oszczędności przez cały okres akumulacji. Różnica między kapitałem końcowym a wkładem to efekt procentu składanego.", formula: "Wkład = Kapitał startowy + Oszczędności miesięczne × Liczba miesięcy", icon: "payments" },
  trwalosc_kapitalu: { title: "Trwałość kapitału", desc: "Ile lat wystarczy Twój kapitał FIRE przy założonej stopie wypłat i inflacji. Idealna sytuacja to 'wieczność' — gdy stopa zwrotu portfela przewyższa wypłaty. Przy regule 4% i zdywersyfikowanym portfelu kapitał historycznie wystarczał na 30+ lat.", formula: "Kapitał(rok+1) = Kapitał(rok) × (1+r) - Wydatki roczne × (1+inflacja)^rok", icon: "hourglass_empty" },
  cagr_real_fire: { title: "Realny CAGR", desc: "Średnioroczna stopa wzrostu siły nabywczej Twojego portfela — po podatku Belki i po inflacji. To prawdziwy przyrost Twojego bogactwa. Dla FIRE kluczowe jest żeby realny CAGR był dodatni przez cały horyzont inwestycji.", formula: "Realny CAGR = (1 + stopa nominalna po podatku) / (1 + inflacja) - 1", icon: "potted_plant" }
});

document.addEventListener('DOMContentLoaded', function () {
  // Wire all text inputs
  ['wf-wydatki', 'wf-oszczednosci', 'wf-kapital', 'wf-stopa', 'wf-inflacja', 'wf-stopa-wyplat', 'wf-lata-cel', 'wf-wiek'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('focus', function () {
      this.dataset.previousValue = this.value;
      setTimeout(function () { el.select(); el.setSelectionRange(0, 9999); }, 50);
    });
    el.addEventListener('blur', function () {
      var val = this.value.trim();
      if (val === '' || isNaN(parseFloat(val))) {
        this.value = this.dataset.previousValue || this.defaultValue || '0';
      }
      recalc();
    });
    el.addEventListener('input', recalc);
  });

  // Wire IKE toggle
  var ike = document.getElementById('wf-ike');
  if (ike) ike.addEventListener('change', recalc);

  // Scenario buttons
  var btnSave = document.getElementById('btn-save-scenario-fire');
  if (btnSave) btnSave.addEventListener('click', saveCurrentScenario);

  var btnShare = document.getElementById('btn-share-result-fire');
  if (btnShare) btnShare.addEventListener('click', shareResult);

  // Load saved state
  if (window.location.search) loadFromUrlParams();
  loadFromLocalStorage();

  // First calculation
  recalc();
});

function recalc() {
  // Update age label
  var wiekEl = document.getElementById('wf-wiek');
  var lataCelEl = document.getElementById('wf-lata-cel');
  var wiekCelEl = document.getElementById('wf-wiek-cel');
  if (wiekEl && lataCelEl && wiekCelEl) {
    var wiek = parseFloat(wiekEl.value) || 30;
    var lataCel = parseFloat(lataCelEl.value) || 20;
    wiekCelEl.textContent = Math.round(wiek + lataCel);
  }

  // Update FIRE variant badges
  var wydatkiVal = (window.pobierzWartosc || function(id, d) { var e = document.getElementById(id); return e ? parseFloat(e.value) || d : d; })('wf-wydatki', 3000);
  var leanEl = document.getElementById('wf-lean-fire');
  var fatEl = document.getElementById('wf-fat-fire');
  if (leanEl && window.formatujZl) leanEl.textContent = window.formatujZl(wydatkiVal * 12 * 20);
  if (fatEl && window.formatujZl) fatEl.textContent = window.formatujZl(wydatkiVal * 12 * 33);

  // IKE status badge
  var ikeChecked = document.getElementById('wf-ike') ? document.getElementById('wf-ike').checked : false;
  var statusEl = document.getElementById('txt-podatek-status-fire');
  if (statusEl) {
    statusEl.textContent = ikeChecked ? "Konto IKE/IKZE (0%)" : "Opodatkowanie 19%";
    statusEl.className = ikeChecked ? "font-bold text-emerald-400" : "font-bold text-white/90";
  }

  // Call the engine
  if (typeof aktualizujWolnosc === 'function') {
    aktualizujWolnosc();
  }

  updateUrlParams();
}

/* URL Params */
function updateUrlParams() {
  var params = new URLSearchParams();
  var fields = { w: 'wf-wydatki', s: 'wf-oszczednosci', k: 'wf-kapital', r: 'wf-stopa', i: 'wf-inflacja', sw: 'wf-stopa-wyplat', l: 'wf-lata-cel', wk: 'wf-wiek' };
  for (var key in fields) {
    var el = document.getElementById(fields[key]);
    if (el) params.set(key, el.value);
  }
  if (document.getElementById('wf-ike') && document.getElementById('wf-ike').checked) params.set('ike', '1');
  var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString();
  window.history.replaceState({ path: newUrl }, '', newUrl);
}

function loadFromUrlParams() {
  var params = new URLSearchParams(window.location.search);
  var fields = { w: 'wf-wydatki', s: 'wf-oszczednosci', k: 'wf-kapital', r: 'wf-stopa', i: 'wf-inflacja', sw: 'wf-stopa-wyplat', l: 'wf-lata-cel', wk: 'wf-wiek' };
  for (var key in fields) {
    if (params.has(key) && document.getElementById(fields[key])) {
      document.getElementById(fields[key]).value = params.get(key);
    }
  }
  if (params.has('ike') && document.getElementById('wf-ike')) {
    document.getElementById('wf-ike').checked = params.get('ike') === '1';
  }
}

/* Scenarios */
function saveCurrentScenario() {
  if (savedScenariosFire.length >= 6) { alert("Maksymalnie 6 scenariuszy."); return; }
  var scenario = {
    wydatki: document.getElementById('wf-wydatki') ? document.getElementById('wf-wydatki').value : 3000,
    oszcz: document.getElementById('wf-oszczednosci') ? document.getElementById('wf-oszczednosci').value : 1000,
    kapital: document.getElementById('wf-kapital') ? document.getElementById('wf-kapital').value : 0,
    stopa: document.getElementById('wf-stopa') ? document.getElementById('wf-stopa').value : 7,
    inflacja: document.getElementById('wf-inflacja') ? document.getElementById('wf-inflacja').value : 3.5,
    stopaWyp: document.getElementById('wf-stopa-wyplat') ? document.getElementById('wf-stopa-wyplat').value : 4,
    lata: document.getElementById('wf-lata-cel') ? document.getElementById('wf-lata-cel').value : 20,
    ike: document.getElementById('wf-ike') ? document.getElementById('wf-ike').checked : false,
    celFIREStr: document.getElementById('wf-wynik-cel') ? document.getElementById('wf-wynik-cel').innerText : '—',
    latStr: document.getElementById('wf-wynik-lata') ? document.getElementById('wf-wynik-lata').innerText : '—'
  };
  savedScenariosFire.push(scenario);
  localStorage.setItem('fire-scenarios', JSON.stringify(savedScenariosFire));
  renderScenarios();
}

function loadFromLocalStorage() {
  try {
    var data = localStorage.getItem('fire-scenarios');
    if (data) {
      savedScenariosFire = JSON.parse(data);
      if (savedScenariosFire.length > 0) renderScenarios();
    }
  } catch (e) { console.warn('LocalStorage error', e); }
}

function renderScenarios() {
  var section = document.getElementById('scenario-history-section-fire');
  var container = document.getElementById('scenario-cards-container-fire');
  if (!section || !container) return;

  if (savedScenariosFire.length === 0) { section.classList.add('hidden'); return; }
  section.classList.remove('hidden');
  container.innerHTML = '';

  savedScenariosFire.forEach(function (scen, index) {
    var div = document.createElement('div');
    div.className = "shrink-0 w-[78vw] max-w-[310px] sm:max-w-none sm:w-[350px] snap-start relative flex flex-col p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group cursor-pointer active:scale-[0.98] overflow-hidden";
    div.onclick = function () {
      if (document.getElementById('wf-wydatki')) document.getElementById('wf-wydatki').value = scen.wydatki;
      if (document.getElementById('wf-oszczednosci')) document.getElementById('wf-oszczednosci').value = scen.oszcz;
      if (document.getElementById('wf-kapital')) document.getElementById('wf-kapital').value = scen.kapital;
      if (document.getElementById('wf-stopa')) document.getElementById('wf-stopa').value = scen.stopa;
      if (document.getElementById('wf-inflacja')) document.getElementById('wf-inflacja').value = scen.inflacja;
      if (document.getElementById('wf-stopa-wyplat')) document.getElementById('wf-stopa-wyplat').value = scen.stopaWyp;
      if (document.getElementById('wf-lata-cel')) document.getElementById('wf-lata-cel').value = scen.lata;
      if (document.getElementById('wf-ike')) document.getElementById('wf-ike').checked = !!scen.ike;
      recalc();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    var formatPl = new Intl.NumberFormat('pl-PL');
    div.innerHTML = '<div class="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-slate-900/95 dark:via-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 pointer-events-none z-10"><span class="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300" style="background-color: #0d7ff2;"><span class="material-symbols-outlined text-[14px]">file_download</span>Kliknij, aby wczytać</span></div>' +
      '<button class="absolute top-2 right-2 text-slate-400 hover:text-rose-500 p-1 z-20 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" onclick="event.stopPropagation(); savedScenariosFire.splice(' + index + ', 1); localStorage.setItem(\'fire-scenarios\', JSON.stringify(savedScenariosFire)); renderScenarios();"><span class="material-symbols-outlined text-[16px] block">close</span></button>' +
      '<div class="transition-all duration-300 group-hover:blur-[1.5px] group-hover:opacity-60 relative z-0">' +
        '<div class="mb-4 pr-6"><span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-primary dark:text-blue-300 px-2 py-1 rounded font-bold">FIRE</span> <span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded ml-1">' + formatPl.format(scen.wydatki) + ' zł/mies.</span></div>' +
        '<div><p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Cel FIRE</p><p class="text-2xl font-black text-slate-900 dark:text-white">' + scen.celFIREStr + '</p>' +
        '<p class="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1"><span class="material-symbols-outlined text-[13px] text-emerald-500">timer</span> Do celu: ' + scen.latStr + '</p></div>' +
      '</div>';
    container.appendChild(div);
  });
}

function shareResult() {
  updateUrlParams();
  var url = window.location.href;
  var title = 'Moja symulacja FIRE - ETFkalkulator.pl';
  if (navigator.share) {
    navigator.share({ title: title, url: url }).catch(function () {});
  } else {
    navigator.clipboard.writeText(url).then(function () {
      var el = document.getElementById('txt-btn-share-fire');
      if (el) { el.textContent = 'Skopiowano link!'; setTimeout(function () { el.textContent = 'Udostępnij wynik'; }, 2000); }
    });
  }
}

/* Modal functions (shared with other calculators) */
function openEduModal(type, event) {
  if (event) { event.preventDefault(); event.stopPropagation(); }
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  var data = window.modalData[type];
  if (!data) return;
  document.getElementById('modal-title').innerText = data.title;
  document.getElementById('modal-explanation').innerText = data.desc;
  document.getElementById('modal-formula').innerText = data.formula;
  document.getElementById('modal-icon').innerText = data.icon;
  var modal = document.getElementById('edu-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeEduModal() {
  var modal = document.getElementById('edu-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}
