// js/kalkulator-etf-historyczny.js
'use strict';

// ── Stan globalny ──────────────────────────────────────────────────────────
var ETF_DATA = null;    // załadowane z etf-data.json
var USDPLN   = null;    // załadowane z etf-usdpln.json
var btChart  = null;    // instancja Chart.js backtesting
var cmpChart = null;    // instancja Chart.js porównanie
var terChart = null;    // instancja Chart.js TER

var btState  = {};      // ostatnie wyniki backtestingu (do ShareModule)
var cmpState = {};      // ostatnie wyniki porównania
var terState = {};      // ostatnie wyniki TER

// ── Month-Year Picker ──────────────────────────────────────────────────────
var _activePicker = null;

function getDataRange() {
  var min = '2099-01';
  Object.keys(ETF_DATA).forEach(function (ticker) {
    if (ETF_DATA[ticker].start && ETF_DATA[ticker].start < min) {
      min = ETF_DATA[ticker].start;
    }
  });
  var usdplnKeys = USDPLN ? Object.keys(USDPLN) : [];
  var max = usdplnKeys.length ? usdplnKeys[usdplnKeys.length - 1] : '2025-12';
  return { min: min, max: max };
}

function MonthYearPicker(inputId, minYYYYMM, maxYYYYMM) {
  this.input    = document.getElementById(inputId);
  this.minKey   = minYYYYMM;   // "RRRR-MM"
  this.maxKey   = maxYYYYMM;   // "RRRR-MM"
  this.el       = null;
  this._year    = null;
  var self      = this;
  this.input.addEventListener('click', function (e) {
    e.stopPropagation();
    if (_activePicker && _activePicker !== self) { _activePicker.close(); }
    if (self.el) { self.close(); } else { self.open(); }
  });
}

MonthYearPicker.prototype._parseInput = function () {
  var v = this.input.value; // "MM/RRRR"
  if (v && v.length === 7) {
    return { mm: parseInt(v.slice(0, 2)), yyyy: parseInt(v.slice(3)) };
  }
  return { mm: null, yyyy: parseInt(this.maxKey.slice(0, 4)) };
};

MonthYearPicker.prototype._renderHTML = function (year) {
  var NAMES    = ['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paź','lis','gru'];
  var cur      = this._parseInput();
  var minY     = parseInt(this.minKey.slice(0, 4));
  var minM     = parseInt(this.minKey.slice(5, 7));
  var maxY     = parseInt(this.maxKey.slice(0, 4));
  var maxM     = parseInt(this.maxKey.slice(5, 7));

  var disablePrev = year <= minY ? 'disabled' : '';
  var disableNext = year >= maxY ? 'disabled' : '';

  var html = '<div class="mypicker-year-row">' +
    '<button class="mypicker-prev" ' + disablePrev + '>‹</button>' +
    '<span class="mypicker-year">' + year + '</span>' +
    '<button class="mypicker-next" ' + disableNext + '>›</button>' +
    '</div><div class="mypicker-months">';

  NAMES.forEach(function (name, i) {
    var mm         = i + 1;
    var isActive   = (mm === cur.mm && year === cur.yyyy);
    var isDisabled = (year === minY && mm < minM) || (year === maxY && mm > maxM);
    html += '<button class="mypicker-month' +
      (isActive   ? ' active'   : '') +
      (isDisabled ? ' disabled' : '') + '"' +
      ' data-mm="' + mm + '"' +
      (isDisabled ? ' disabled' : '') + '>' +
      name + '</button>';
  });

  html += '</div>';
  return html;
};

MonthYearPicker.prototype.open = function () {
  _activePicker = this;
  var parsed    = this._parseInput();
  this._year    = parsed.yyyy;

  var el        = document.createElement('div');
  el.className  = 'mypicker';
  el.innerHTML  = this._renderHTML(this._year);
  document.body.appendChild(el);
  this.el       = el;

  var rect      = this.input.getBoundingClientRect();
  el.style.top  = (rect.bottom + 6) + 'px';
  el.style.left = rect.left + 'px';

  var self = this;
  el.addEventListener('click', function (e) {
    e.stopPropagation();
    var btn = e.target.closest('button');
    if (!btn || btn.disabled) return;
    if (btn.classList.contains('mypicker-prev')) {
      self._year--;
      el.innerHTML = self._renderHTML(self._year);
    } else if (btn.classList.contains('mypicker-next')) {
      self._year++;
      el.innerHTML = self._renderHTML(self._year);
    } else if (btn.classList.contains('mypicker-month')) {
      var mm = String(btn.dataset.mm).padStart(2, '0');
      self.input.value = mm + '/' + self._year;
      self.close();
    }
  });
};

MonthYearPicker.prototype.close = function () {
  if (this.el) { this.el.remove(); this.el = null; }
  if (_activePicker === this) { _activePicker = null; }
};

// Zamknij picker kliknięciem poza nim
document.addEventListener('click', function () {
  if (_activePicker) { _activePicker.close(); }
});

// ── Ładowanie danych ───────────────────────────────────────────────────────
async function loadData() {
  // Dane ładowane przez <script> tag — działa zarówno przez HTTP jak i file://
  ETF_DATA = window.__ETF_DATA;
  USDPLN   = window.__USDPLN;
}

// ── Inicjalizacja ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function () {
  await loadData();
  var range = getDataRange();
  new MonthYearPicker('bt-od',  range.min, range.max);
  new MonthYearPicker('bt-do',  range.min, range.max);
  new MonthYearPicker('cmp-od', range.min, range.max);
  new MonthYearPicker('cmp-do', range.min, range.max);
  ShareModule.preloadAssets();           // preładuj favicon do Canvas
  renderEtfSelector('etf-selector-bt', 'bt', null);
  renderEtfSelector('etf-selector-cmp-a', 'cmp-a', 'IWDA');
  renderEtfSelector('etf-selector-cmp-b', 'cmp-b', 'VWCE');
  switchTab('backtesting');
  ShareModule.loadFromHash();
});

// ── Zakładki ───────────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(function (p) {
    p.classList.add('hidden');
  });
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    b.classList.remove('text-primary', 'border-primary');
    b.style.color = '';
    b.style.borderColor = '';
  });

  var panel = document.getElementById('panel-' + name);
  var btn   = document.getElementById('tab-' + name);
  if (panel) panel.classList.remove('hidden');
  if (btn) {
    btn.style.color = '#0d7ff2';
    btn.style.borderBottomColor = '#0d7ff2';
  }
}

// ── ETF Selector ───────────────────────────────────────────────────────────
function renderEtfSelector(containerId, prefix, defaultSelected) {
  var container = document.getElementById(containerId);
  if (!container || !ETF_DATA) return;

  var selected = defaultSelected;
  container.innerHTML = '';

  Object.keys(ETF_DATA).forEach(function (ticker) {
    var etf = ETF_DATA[ticker];
    var isSelected = ticker === selected;

    var card = document.createElement('button');
    card.id = prefix + '-etf-' + ticker;
    card.onclick = function () { selectEtf(containerId, prefix, ticker); };
    card.className = 'etf-card text-left p-3 rounded-xl border-2 transition-all ' +
      (isSelected
        ? 'border-primary bg-primary/5 dark:bg-primary/10'
        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-white dark:bg-slate-800/50');
    card.innerHTML =
      '<p class="text-sm font-extrabold text-stitch-text">' + ticker + '</p>' +
      '<p class="text-[10px] text-slate-400 leading-tight mt-0.5">' + etf.name + '</p>' +
      '<p class="text-[10px] font-bold mt-1" style="color:#0d7ff2;">TER ' + (etf.ter * 100).toFixed(2) + '% · ' + etf.type + '</p>';
    container.appendChild(card);
  });

  if (defaultSelected) {
    container.dataset.selected = defaultSelected;
  }
}

function selectEtf(containerId, prefix, ticker) {
  var container = document.getElementById(containerId);
  container.querySelectorAll('.etf-card').forEach(function (c) {
    c.className = 'etf-card text-left p-3 rounded-xl border-2 transition-all border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-white dark:bg-slate-800/50';
  });
  var selected = document.getElementById(prefix + '-etf-' + ticker);
  if (selected) {
    selected.className = 'etf-card text-left p-3 rounded-xl border-2 transition-all border-primary bg-primary/5 dark:bg-primary/10';
  }
  container.dataset.selected = ticker;
}

function getSelectedEtf(containerId) {
  var container = document.getElementById(containerId);
  return container ? container.dataset.selected : null;
}

// ── Presety daty ──────────────────────────────────────────────────────────
function setPresetBt(preset) {
  var now   = new Date();
  var endMM = String(now.getMonth() + 1).padStart(2, '0');
  var endYY = now.getFullYear();
  var lastKey = USDPLN ? Object.keys(USDPLN).pop() : null;
  var doVal = lastKey ? lastKey.slice(5, 7) + '/' + lastKey.slice(0, 4) : endMM + '/' + endYY;

  var odVal;
  if (preset === 'max') {
    var ticker = getSelectedEtf('etf-selector-bt') || 'IWDA';
    var start  = ETF_DATA[ticker] ? ETF_DATA[ticker].start : '2009-10';
    odVal = start.slice(5, 7) + '/' + start.slice(0, 4);
  } else if (preset === 'covid') {
    odVal = '01/2020';
  } else {
    var startYear = endYY - parseInt(preset);
    odVal = endMM + '/' + startYear;
  }

  document.getElementById('bt-od').value = odVal;
  document.getElementById('bt-do').value = doVal;
}

function setPresetCmp(preset) {
  var now    = new Date();
  var endMM  = String(now.getMonth() + 1).padStart(2, '0');
  var endYY  = now.getFullYear();
  var lastKey = USDPLN ? Object.keys(USDPLN).pop() : null;
  var doVal  = lastKey ? lastKey.slice(5, 7) + '/' + lastKey.slice(0, 4) : endMM + '/' + endYY;

  var odVal;
  if (preset === 'max') {
    var tickerA = getSelectedEtf('etf-selector-cmp-a') || 'IWDA';
    var tickerB = getSelectedEtf('etf-selector-cmp-b') || 'VWCE';
    var startA  = (ETF_DATA[tickerA] && ETF_DATA[tickerA].start) ? ETF_DATA[tickerA].start : '2009-10';
    var startB  = (ETF_DATA[tickerB] && ETF_DATA[tickerB].start) ? ETF_DATA[tickerB].start : '2014-05';
    var start   = startA > startB ? startA : startB;
    odVal = start.slice(5, 7) + '/' + start.slice(0, 4);
  } else if (preset === 'covid') {
    odVal = '01/2020';
  } else {
    odVal = endMM + '/' + (endYY - parseInt(preset));
  }

  document.getElementById('cmp-od').value = odVal;
  document.getElementById('cmp-do').value = doVal;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function parseInputDate(val) {
  // Format wejściowy: "MM/RRRR" → "RRRR-MM"
  var parts = val.trim().split('/');
  if (parts.length !== 2) return null;
  return parts[1] + '-' + parts[0].padStart(2, '0');
}

function formatPLN(val) {
  return val.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' zł';
}

function getMonthsBetween(startKey, endKey) {
  // Zwraca posortowaną tablicę kluczy "RRRR-MM" między startKey a endKey (włącznie)
  var result = [];
  var cur = new Date(startKey + '-01');
  var end = new Date(endKey + '-01');
  while (cur <= end) {
    var y = cur.getFullYear();
    var m = String(cur.getMonth() + 1).padStart(2, '0');
    result.push(y + '-' + m);
    cur.setMonth(cur.getMonth() + 1);
  }
  return result;
}

// ── obliczBacktesting ─────────────────────────────────────────────────────
function obliczBacktesting() {
  var ticker  = getSelectedEtf('etf-selector-bt');
  var kapital = parseFloat((document.getElementById('bt-kapital').value || '0').replace(/\s/g, '').replace(',', '.'));
  var doplata = parseFloat((document.getElementById('bt-doplata').value || '0').replace(/\s/g, '').replace(',', '.'));
  var od      = parseInputDate(document.getElementById('bt-od').value);
  var doD     = parseInputDate(document.getElementById('bt-do').value);
  var ike     = document.getElementById('bt-ike').checked;

  if (!ticker || !od || !doD || isNaN(kapital)) {
    alert('Uzupełnij wszystkie pola.');
    return;
  }

  var etf    = ETF_DATA[ticker];
  var months = getMonthsBetween(od, doD);
  if (months.length < 2) { alert('Wybierz dłuższy okres.'); return; }

  // Symulacja miesiąc po miesiącu
  var kapitalUSD  = kapital / (USDPLN[od] || 4.0);
  var wplacono    = kapital;
  var historiaKapital  = [];
  var historiaWplacono = [];
  var historiaDaty     = [];

  months.forEach(function (key, idx) {
    var stopa  = etf.returns[key] !== undefined ? etf.returns[key] : 0;
    var kurs   = USDPLN[key] || USDPLN[Object.keys(USDPLN).pop()];

    if (idx > 0) {
      kapitalUSD = kapitalUSD * (1 + stopa - etf.ter / 12) + doplata / kurs;
      wplacono  += doplata;
    }

    var kapitalPLN = kapitalUSD * kurs;
    historiaKapital.push(Math.round(kapitalPLN));
    historiaWplacono.push(Math.round(wplacono));
    historiaDaty.push(key.slice(0, 4) + '/' + key.slice(5, 7));
  });

  var kapitalFinal = historiaKapital[historiaKapital.length - 1];
  var zyskBrutto   = kapitalFinal - wplacono;
  var podatek      = ike ? 0 : Math.max(0, zyskBrutto * 0.19);
  var kapitalNetto = kapitalFinal - podatek;
  var zyskNetto    = kapitalNetto - wplacono;
  var oszczIKE     = ike ? 0 : Math.max(0, zyskBrutto * 0.19);
  var zwrotPct     = ((kapitalNetto / wplacono - 1) * 100).toFixed(1);

  // Aktualizuj DOM
  document.getElementById('bt-empty').classList.add('hidden');
  document.getElementById('bt-wyniki').classList.remove('hidden');
  document.getElementById('bt-res-kapital').textContent  = formatPLN(kapitalNetto);
  document.getElementById('bt-res-zysk').textContent     = (zyskNetto >= 0 ? '+' : '') + formatPLN(zyskNetto);
  document.getElementById('bt-res-wplacono').textContent = formatPLN(wplacono);
  document.getElementById('bt-res-zwrot').textContent    = (parseFloat(zwrotPct) >= 0 ? '+' : '') + zwrotPct + '%';

  // Pokaż przycisk share
  var shareBtn = document.getElementById('bt-share-btn');
  shareBtn.classList.remove('hidden');
  shareBtn.classList.add('flex');

  // Renderuj wykres
  renderBtChart(historiaDaty, historiaKapital, historiaWplacono);

  // Zapisz stan do ShareModule
  btState = {
    ticker: ticker, etfName: etf.name,
    od: od, doD: doD,
    kapital: kapital, doplata: doplata, ike: ike,
    kapitalFinal: kapitalNetto, wplacono: wplacono,
    zyskNetto: zyskNetto, zwrotPct: zwrotPct,
    oszczIKE: oszczIKE
  };
}

function renderBtChart(labels, kapital, wplacono) {
  var ctx = document.getElementById('bt-chart').getContext('2d');
  if (btChart) btChart.destroy();

  btChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Wartość portfela',
          data: kapital,
          borderColor: '#0d7ff2',
          backgroundColor: 'rgba(13,127,242,0.08)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2
        },
        {
          label: 'Wpłacony kapitał',
          data: wplacono,
          borderColor: '#94a3b8',
          borderDash: [6, 4],
          fill: false,
          tension: 0,
          pointRadius: 0,
          borderWidth: 1.5
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ctx.dataset.label + ': ' + ctx.parsed.y.toLocaleString('pl-PL') + ' zł';
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function (v) {
              return (v / 1000).toFixed(0) + 'k zł';
            }
          }
        }
      }
    }
  });
}

// ── obliczPorownanie ──────────────────────────────────────────────────────
function obliczPorownanie() {
  var tickerA  = getSelectedEtf('etf-selector-cmp-a');
  var tickerB  = getSelectedEtf('etf-selector-cmp-b');
  var kapital  = parseFloat((document.getElementById('cmp-kapital').value || '0').replace(/\s/g, '').replace(',', '.'));
  var doplata  = parseFloat((document.getElementById('cmp-doplata').value || '0').replace(/\s/g, '').replace(',', '.'));
  var od       = parseInputDate(document.getElementById('cmp-od').value);
  var doD      = parseInputDate(document.getElementById('cmp-do').value);
  var ike      = document.getElementById('cmp-ike').checked;

  if (!tickerA || !tickerB || !od || !doD || isNaN(kapital)) { alert('Uzupełnij wszystkie pola.'); return; }
  if (tickerA === tickerB) { alert('Wybierz dwa różne ETF-y.'); return; }

  function simulate(ticker) {
    var etf    = ETF_DATA[ticker];
    var months = getMonthsBetween(od, doD);
    var kUSD   = kapital / (USDPLN[od] || 4.0);
    var wpl    = kapital;
    var hist   = [];
    months.forEach(function (key, idx) {
      var stopa = etf.returns[key] !== undefined ? etf.returns[key] : 0;
      var kurs  = USDPLN[key] || USDPLN[Object.keys(USDPLN).pop()];
      if (idx > 0) { kUSD = kUSD * (1 + stopa - etf.ter / 12) + doplata / kurs; wpl += doplata; }
      hist.push(Math.round(kUSD * kurs));
    });
    var finalBrutto = hist[hist.length - 1];
    var podatek = ike ? 0 : Math.max(0, (finalBrutto - wpl) * 0.19);
    return { hist: hist, final: finalBrutto - podatek, wpl: wpl };
  }

  var resA = simulate(tickerA);
  var resB = simulate(tickerB);
  var months = getMonthsBetween(od, doD);
  var labels = months.map(function (k) { return k.slice(0, 4) + '/' + k.slice(5); });
  var diff = Math.abs(resA.final - resB.final);
  var winner = resA.final >= resB.final ? tickerA : tickerB;

  document.getElementById('cmp-empty').classList.add('hidden');
  document.getElementById('cmp-wyniki').classList.remove('hidden');
  document.getElementById('cmp-label-a').textContent = tickerA;
  document.getElementById('cmp-label-b').textContent = tickerB;
  document.getElementById('cmp-res-a').textContent   = formatPLN(resA.final);
  document.getElementById('cmp-res-b').textContent   = formatPLN(resB.final);
  document.getElementById('cmp-res-diff').textContent = winner + ' lepszy o ' + formatPLN(diff);

  var shareBtn = document.getElementById('cmp-share-btn');
  shareBtn.classList.remove('hidden');
  shareBtn.classList.add('flex');

  if (cmpChart) cmpChart.destroy();
  var ctx = document.getElementById('cmp-chart').getContext('2d');
  cmpChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: tickerA, data: resA.hist, borderColor: '#0d7ff2', backgroundColor: 'rgba(13,127,242,0.06)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 },
        { label: tickerB, data: resB.hist, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.06)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toLocaleString('pl-PL') + ' zł'; } } } },
      scales: { y: { ticks: { callback: function (v) { return (v / 1000).toFixed(0) + 'k zł'; } } } }
    }
  });

  cmpState = { tickerA: tickerA, tickerB: tickerB, etfNameA: ETF_DATA[tickerA].name, etfNameB: ETF_DATA[tickerB].name, od: od, doD: doD, kapital: kapital, doplata: doplata, ike: ike, finalA: resA.final, finalB: resB.final, diff: diff, winner: winner };
}

// ── obliczTER ─────────────────────────────────────────────────────────────
function obliczTER() {
  var kapital = parseFloat((document.getElementById('ter-kapital').value || '0').replace(/\s/g, '').replace(',', '.'));
  var doplata = parseFloat((document.getElementById('ter-doplata').value || '0').replace(/\s/g, '').replace(',', '.'));
  var lata    = parseInt(document.getElementById('ter-lata').value || '0');
  var terA    = parseFloat((document.getElementById('ter-a').value || '0').replace(',', '.')) / 100;
  var terB    = parseFloat((document.getElementById('ter-b').value || '0').replace(',', '.')) / 100;

  if (isNaN(kapital) || isNaN(lata) || lata < 1) { alert('Uzupełnij pola.'); return; }

  var WZROST = 0.07; // założenie 7% rocznie brutto
  var months = lata * 12;

  function simTER(ter) {
    var k = kapital;
    var hist = [k];
    var stopaMsc = Math.pow(1 + WZROST - ter, 1 / 12) - 1;
    for (var i = 1; i <= months; i++) {
      k = k * (1 + stopaMsc) + doplata;
      if (i % 12 === 0) hist.push(Math.round(k));
    }
    return { final: Math.round(k), hist: hist };
  }

  var resA = simTER(terA);
  var resB = simTER(terB);
  var diff = Math.abs(resA.final - resB.final);

  document.getElementById('ter-empty').classList.add('hidden');
  document.getElementById('ter-wyniki').classList.remove('hidden');
  document.getElementById('ter-res-a').textContent   = formatPLN(resA.final);
  document.getElementById('ter-res-b').textContent   = formatPLN(resB.final);
  document.getElementById('ter-res-diff').textContent = formatPLN(diff);
  document.getElementById('ter-res-lata').textContent = 'przez ' + lata + ' lat';
  document.getElementById('ter-label-a').textContent  = 'TER ' + (terA * 100).toFixed(2) + '%';
  document.getElementById('ter-label-b').textContent  = 'TER ' + (terB * 100).toFixed(2) + '%';

  var shareBtn = document.getElementById('ter-share-btn');
  shareBtn.classList.remove('hidden');
  shareBtn.classList.add('flex');

  var labels = Array.from({ length: lata + 1 }, function (_, i) { return i + ' lat'; });
  if (terChart) terChart.destroy();
  var ctx = document.getElementById('ter-chart').getContext('2d');
  terChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'TER ' + (terA * 100).toFixed(2) + '%', data: resA.hist, borderColor: '#0d7ff2', backgroundColor: 'rgba(13,127,242,0.06)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 },
        { label: 'TER ' + (terB * 100).toFixed(2) + '%', data: resB.hist, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.06)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toLocaleString('pl-PL') + ' zł'; } } } },
      scales: { y: { ticks: { callback: function (v) { return (v / 1000).toFixed(0) + 'k zł'; } } } }
    }
  });

  terState = { kapital: kapital, doplata: doplata, lata: lata, terA: terA, terB: terB, finalA: resA.final, finalB: resB.final, diff: diff };
}

// ── ShareModule ────────────────────────────────────────────────────────────
var ShareModule = {

  generateCard: function (tab) {
    var canvas = document.createElement('canvas');
    canvas.width  = 1200;
    canvas.height = 630;
    var ctx = canvas.getContext('2d');

    var data = tab === 'bt' ? btState : tab === 'cmp' ? cmpState : terState;

    // ── Tło ──
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 630);

    // ── Obramowanie karty ──
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth   = 2;
    ShareModule._roundRect(ctx, 1, 1, 1198, 628, 24);
    ctx.stroke();

    // ── Logo ──
    ShareModule._drawLogo(ctx, 60, 56);

    // ── Badge IKE (jeśli włączone) ──
    if (data.ike) {
      ctx.fillStyle = '#f0fdf4';
      ShareModule._roundRectFill(ctx, 800, 40, 340, 38, 19);
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ IKE — 0% podatku Belki', 970, 64);
    }

    // ── Subtitle (parametry) ──
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Inter, sans-serif';
    ctx.textAlign = 'left';
    var subtitle = ShareModule._buildSubtitle(tab, data);
    ctx.fillText(subtitle, 60, 155);

    // ── Główna liczba ──
    ctx.fillStyle = '#0d7ff2';
    ctx.font = 'bold 72px Inter, sans-serif';
    var mainVal = ShareModule._buildMainValue(tab, data);
    ctx.fillText(mainVal.text, 60, 250);

    // ── Badge zwrotu / różnicy ──
    if (mainVal.badge) {
      ctx.fillStyle = '#f0fdf4';
      var bw = ctx.measureText(mainVal.badge).width + 32;
      var bx = 60 + ctx.measureText(mainVal.text).width + 20;
      ShareModule._roundRectFill(ctx, bx, 208, bw, 44, 22);
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText(mainVal.badge, bx + 16, 237);
    }

    // ── 3 kafelki ──
    var tiles = ShareModule._buildTiles(tab, data);
    tiles.forEach(function (tile, i) {
      var x = 60 + i * 370;
      var y = 290;
      ctx.strokeStyle = tile.color;
      ctx.lineWidth   = 4;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 310, y); ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font      = '14px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(tile.label.toUpperCase(), x, y + 26);
      ctx.fillStyle = tile.valueColor || '#1e293b';
      ctx.font      = 'bold 28px Inter, sans-serif';
      ctx.fillText(tile.value, x, y + 64);
    });

    // ── Separator stopki ──
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(60, 540); ctx.lineTo(1140, 540); ctx.stroke();

    // ── Stopka ──
    ShareModule._drawLogo(ctx, 60, 570, 22);
    ctx.fillStyle = '#94a3b8';
    ctx.font      = '16px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Oblicz swoje wyniki na etfkalkulator.pl', 1140, 590);

    return canvas;
  },

  _drawLogo: function (ctx, x, y, size) {
    size = size || 28;
    ctx.fillStyle = '#0d7ff2';
    ShareModule._roundRectFill(ctx, x, y - size + 4, size, size, 6);
    if (ShareModule._faviconImg && ShareModule._faviconImg.complete) {
      ctx.drawImage(ShareModule._faviconImg, x, y - size + 4, size, size);
    }
    ctx.fillStyle = '#1e293b';
    ctx.font      = 'bold ' + (size === 28 ? '20' : '16') + 'px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ETFkalkulator.pl', x + size + 10, y);
  },

  _faviconImg: null,
  preloadAssets: function () {
    var base  = window.location.pathname.includes('/pages/') ? '../' : '';
    var img   = new Image();
    img.src   = base + 'images/favicon.png';
    ShareModule._faviconImg = img;
  },

  _buildSubtitle: function (tab, data) {
    if (tab === 'bt') {
      var od = data.od ? data.od.slice(5, 7) + '/' + data.od.slice(0, 4) : '';
      var do_ = data.doD ? data.doD.slice(5, 7) + '/' + data.doD.slice(0, 4) : '';
      return (data.ticker || '') + ' · ' + od + '–' + do_ + ' · ' + (data.doplata || 0).toLocaleString('pl-PL') + ' zł/msc';
    }
    if (tab === 'cmp') {
      return (data.tickerA || '') + ' vs ' + (data.tickerB || '') + ' · ' + (data.od || '').slice(0, 7) + '–' + (data.doD || '').slice(0, 7);
    }
    return 'TER ' + ((data.terA || 0) * 100).toFixed(2) + '% vs TER ' + ((data.terB || 0) * 100).toFixed(2) + '% · ' + (data.lata || 0) + ' lat · ' + (data.doplata || 0).toLocaleString('pl-PL') + ' zł/msc';
  },

  _buildMainValue: function (tab, data) {
    if (tab === 'bt') {
      return {
        text:  (data.kapitalFinal || 0).toLocaleString('pl-PL') + ' zł',
        badge: (parseFloat(data.zwrotPct) >= 0 ? '+' : '') + (data.zwrotPct || 0) + '%'
      };
    }
    if (tab === 'cmp') {
      var labelA = (data.tickerA || 'A') + ': ' + (data.finalA || 0).toLocaleString('pl-PL') + ' zł';
      return { text: labelA, badge: null };
    }
    return {
      text:  'Różnica: ' + (data.diff || 0).toLocaleString('pl-PL') + ' zł',
      badge: null
    };
  },

  _buildTiles: function (tab, data) {
    if (tab === 'bt') {
      return [
        { label: 'Wpłacony kapitał', value: (data.wplacono || 0).toLocaleString('pl-PL') + ' zł', color: '#0d7ff2', valueColor: '#1e293b' },
        { label: 'Zysk netto',       value: ((data.zyskNetto || 0) >= 0 ? '+' : '') + (data.zyskNetto || 0).toLocaleString('pl-PL') + ' zł', color: '#16a34a', valueColor: '#16a34a' },
        { label: data.ike ? 'Zwrot %' : 'Oszczędność IKE', value: data.ike ? (parseFloat(data.zwrotPct) >= 0 ? '+' : '') + data.zwrotPct + '%' : (data.oszczIKE || 0).toLocaleString('pl-PL') + ' zł', color: '#f59e0b', valueColor: '#f59e0b' }
      ];
    }
    if (tab === 'cmp') {
      return [
        { label: data.tickerA || 'ETF A', value: (data.finalA || 0).toLocaleString('pl-PL') + ' zł', color: '#0d7ff2', valueColor: '#0d7ff2' },
        { label: data.tickerB || 'ETF B', value: (data.finalB || 0).toLocaleString('pl-PL') + ' zł', color: '#f59e0b', valueColor: '#f59e0b' },
        { label: 'Różnica',               value: (data.diff || 0).toLocaleString('pl-PL') + ' zł',   color: '#64748b', valueColor: '#64748b' }
      ];
    }
    return [
      { label: 'Kapitał TER ' + ((data.terA || 0) * 100).toFixed(2) + '%', value: (data.finalA || 0).toLocaleString('pl-PL') + ' zł', color: '#0d7ff2', valueColor: '#0d7ff2' },
      { label: 'Kapitał TER ' + ((data.terB || 0) * 100).toFixed(2) + '%', value: (data.finalB || 0).toLocaleString('pl-PL') + ' zł', color: '#f59e0b', valueColor: '#f59e0b' },
      { label: 'Opłata kosztuje',         value: (data.diff || 0).toLocaleString('pl-PL') + ' zł',   color: '#ef4444', valueColor: '#ef4444' }
    ];
  },

  _roundRect: function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  },

  _roundRectFill: function (ctx, x, y, w, h, r) {
    ShareModule._roundRect(ctx, x, y, w, h, r);
    ctx.fill();
  },

  buildShareUrl: function (tab) {
    var params = [];
    params.push('tab=' + tab);

    if (tab === 'bt') {
      params.push('etf='     + (btState.ticker  || ''));
      params.push('start='   + (btState.od      || '').replace('-', ''));
      params.push('end='     + (btState.doD     || '').replace('-', ''));
      params.push('capital=' + (btState.kapital || 0));
      params.push('monthly=' + (btState.doplata || 0));
      params.push('ike='     + (btState.ike ? '1' : '0'));
    } else if (tab === 'cmp') {
      params.push('etf_a='   + (cmpState.tickerA || ''));
      params.push('etf_b='   + (cmpState.tickerB || ''));
      params.push('start='   + (cmpState.od  || '').replace('-', ''));
      params.push('end='     + (cmpState.doD || '').replace('-', ''));
      params.push('capital=' + (cmpState.kapital || 0));
      params.push('monthly=' + (cmpState.doplata || 0));
      params.push('ike='     + (cmpState.ike ? '1' : '0'));
    } else {
      params.push('capital=' + (terState.kapital || 0));
      params.push('monthly=' + (terState.doplata || 0));
      params.push('years='   + (terState.lata    || 0));
      params.push('ter_a='   + (terState.terA    || 0));
      params.push('ter_b='   + (terState.terB    || 0));
    }

    var base = window.location.origin + window.location.pathname;
    return base + '#' + params.join('&');
  },

  loadFromHash: function () {
    var hash = window.location.hash.slice(1);
    if (!hash) return;

    var params = {};
    hash.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      if (kv.length === 2) params[kv[0]] = decodeURIComponent(kv[1]);
    });

    var tab = params.tab;
    if (!tab) return;

    function hashDateToInput(val) {
      if (!val || val.length < 6) return '';
      return val.slice(4, 6) + '/' + val.slice(0, 4);
    }

    if (tab === 'bt') {
      if (params.etf) selectEtf('etf-selector-bt', 'bt', params.etf);
      if (params.capital) document.getElementById('bt-kapital').value = params.capital;
      if (params.monthly) document.getElementById('bt-doplata').value = params.monthly;
      if (params.start)   document.getElementById('bt-od').value      = hashDateToInput(params.start);
      if (params.end)     document.getElementById('bt-do').value      = hashDateToInput(params.end);
      if (params.ike)     document.getElementById('bt-ike').checked   = params.ike === '1';
      switchTab('backtesting');
      obliczBacktesting();
    } else if (tab === 'cmp') {
      if (params.etf_a) selectEtf('etf-selector-cmp-a', 'cmp-a', params.etf_a);
      if (params.etf_b) selectEtf('etf-selector-cmp-b', 'cmp-b', params.etf_b);
      if (params.capital) document.getElementById('cmp-kapital').value = params.capital;
      if (params.monthly) document.getElementById('cmp-doplata').value = params.monthly;
      if (params.start)   document.getElementById('cmp-od').value      = hashDateToInput(params.start);
      if (params.end)     document.getElementById('cmp-do').value      = hashDateToInput(params.end);
      if (params.ike)     document.getElementById('cmp-ike').checked   = params.ike === '1';
      switchTab('porownanie');
      obliczPorownanie();
    } else if (tab === 'ter') {
      if (params.capital) document.getElementById('ter-kapital').value = params.capital;
      if (params.monthly) document.getElementById('ter-doplata').value = params.monthly;
      if (params.years)   document.getElementById('ter-lata').value    = params.years;
      if (params.ter_a)   document.getElementById('ter-a').value       = params.ter_a;
      if (params.ter_b)   document.getElementById('ter-b').value       = params.ter_b;
      switchTab('ter');
      obliczTER();
    }
  },

  share: function (tab) {
    var canvas = ShareModule.generateCard(tab);
    var url    = ShareModule.buildShareUrl(tab);
    var title  = 'Moje wyniki ETF — ETFkalkulator.pl';

    canvas.toBlob(function (blob) {
      var file = new File([blob], 'wyniki-etf.png', { type: 'image/png' });

      // MOBILE: Web Share API z plikiem
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: title, url: url })
          .catch(function () {}); // użytkownik anulował — nic nie rób
        return;
      }

      // DESKTOP: pobierz PNG + skopiuj URL + toast
      var a = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      a.download = 'wyniki-etf.png';
      a.click();
      URL.revokeObjectURL(a.href);

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          ShareModule._showToast('Pobrano kartę · Skopiowano link');
        }).catch(function () {
          ShareModule._showToast('Pobrano kartę PNG');
        });
      } else {
        ShareModule._showToast('Pobrano kartę PNG');
      }
    }, 'image/png');
  },

  _showToast: function (msg) {
    var toast  = document.getElementById('share-toast');
    var msgEl  = document.getElementById('share-toast-msg');
    if (!toast) return;
    msgEl.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('flex');
    setTimeout(function () {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 3000);
  }

}; // koniec ShareModule
