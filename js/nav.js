// nav.js — Komponent nawigacji ETFkalkulator.pl
// Wstrzykuje nav synchronicznie do <div id="nav-root"></div>
// Automatycznie wykrywa głębokość strony i dobiera ścieżki relatywne.

(function () {
  'use strict';

  var path = window.location.pathname;
  var inPages = path.indexOf('/pages/') !== -1;
  var inBlog  = path.indexOf('/blog/')  !== -1;

  // Prefiksy ścieżek
  var H = (inPages || inBlog) ? '../' : '';               // do root (index.html)
  var P = inPages ? '' : (inBlog ? '../pages/' : 'pages/'); // do /pages/
  var B = inBlog  ? '' : (inPages ? '../blog/' : 'blog/');  // do /blog/

  // Helpery stanu aktywnego
  var CLS_D      = 'class="px-3 py-2 text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100/60 dark:hover:bg-slate-800/50 rounded-lg transition-colors" style="text-decoration:none;"';
  var CLS_D_ACT  = 'class="px-3 py-2 text-[13px] font-bold rounded-lg transition-colors" style="color:#0d7ff2; background:rgba(13,127,242,0.08); text-decoration:none;"';
  var CLS_M      = 'class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors" style="text-decoration:none;"';
  var CLS_M_ACT  = 'class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors" style="color:#0d7ff2; background:rgba(13,127,242,0.08); text-decoration:none;"';
  var ICO        = 'class="material-symbols-outlined text-[20px] text-slate-400" aria-hidden="true"';
  var ICO_ACT    = 'class="material-symbols-outlined text-[20px]" style="color:#0d7ff2;" aria-hidden="true"';

  function dCls(slug) { return path.indexOf(slug) !== -1 ? CLS_D_ACT : CLS_D; }
  function mCls(slug) { return path.indexOf(slug) !== -1 ? CLS_M_ACT : CLS_M; }
  function iCo(slug)  { return path.indexOf(slug) !== -1 ? ICO_ACT   : ICO; }
  var blogActive = inBlog;

  var html = '' +
    '<nav id="main-nav" class="fixed top-0 w-full z-[100] glass-effect border-b border-stitch-border/50" style="font-family:\'Inter\',sans-serif;">' +
    '<div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">' +

    // Logo
    '<a href="' + H + 'index.html" class="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity" style="text-decoration:none;">' +
    '<div class="p-1.5 rounded-lg text-white flex items-center justify-center" style="background-color:#0d7ff2;">' +
    '<span class="material-symbols-outlined text-[20px]" aria-hidden="true">account_balance_wallet</span>' +
    '</div>' +
    '<span class="text-[17px] font-bold tracking-tight text-stitch-text dark:text-slate-100">ETFkalkulator.pl</span>' +
    '</a>' +

    // Desktop links
    '<div class="hidden xl:flex items-center gap-0.5 flex-1 justify-center px-4">' +
    '<a href="' + P + 'kalkulator-etf.html" '       + dCls('kalkulator-etf')          + '>Kalkulator ETF</a>' +
    '<a href="' + P + 'kalkulator-obligacji.html" '  + dCls('kalkulator-obligacji')     + '>Obligacje EDO</a>' +
    '<a href="' + P + 'kalkulator-wolnosci.html" '   + dCls('kalkulator-wolnosci')      + '>Kalkulator FIRE</a>' +
    '<a href="' + P + 'porownywarka.html" '          + dCls('porownywarka')             + '>Porównywarka</a>' +
    '<a href="' + P + 'kalkulator-podatku-belki.html" ' + dCls('kalkulator-podatku-belki') + '>Podatek Belki</a>' +
    '<a href="' + B + 'index.html" '                + (blogActive ? CLS_D_ACT : CLS_D) + '>Blog</a>' +
    '<a href="' + P + 'o-projekcie.html" '          + dCls('o-projekcie')              + '>O projekcie</a>' +
    '</div>' +

    // Right: dark mode + newsletter + hamburger
    '<div class="flex items-center gap-2 shrink-0">' +
    '<button onkeydown="if(event.key===\'Enter\')this.click()" onclick="przelaczTryb()" aria-label="Przełącz tryb ciemny/jasny" class="w-9 h-9 rounded-lg border border-stitch-border bg-stitch-surface/80 flex items-center justify-center hover:bg-stitch-bg transition-colors">' +
    '<span class="material-symbols-outlined text-[19px] block dark:hidden" aria-hidden="true">light_mode</span>' +
    '<span class="material-symbols-outlined text-[19px] hidden dark:block" aria-hidden="true">dark_mode</span>' +
    '</button>' +
    '<a href="#newsletter-section" class="hidden sm:flex items-center bg-primary text-white px-4 h-9 rounded-full text-[13px] font-bold hover:opacity-90 transition-opacity" style="background-color:#0d7ff2; text-decoration:none;">Zapisz się</a>' +
    '<button id="nav-toggle" onclick="toggleMobileNav()" aria-label="Otwórz menu nawigacji" aria-expanded="false" aria-controls="mobile-nav" class="xl:hidden w-9 h-9 rounded-lg border border-stitch-border bg-stitch-surface/80 flex items-center justify-center hover:bg-stitch-bg transition-colors">' +
    '<span id="nav-icon-menu" class="material-symbols-outlined text-[20px]" aria-hidden="true">menu</span>' +
    '<span id="nav-icon-close" class="material-symbols-outlined text-[20px] hidden" aria-hidden="true">close</span>' +
    '</button>' +
    '</div>' +
    '</div>' +

    // Mobile dropdown
    '<div id="mobile-nav" class="hidden xl:hidden border-t border-stitch-border/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-lg">' +
    '<div class="max-w-7xl mx-auto px-4 pt-3 pb-4">' +
    '<div class="grid grid-cols-2 sm:grid-cols-4 gap-1">' +
    '<a href="' + P + 'kalkulator-etf.html" onclick="closeMobileNav()" '          + mCls('kalkulator-etf')          + '><span ' + iCo('kalkulator-etf')          + '>trending_up</span>Kalkulator ETF</a>' +
    '<a href="' + P + 'kalkulator-obligacji.html" onclick="closeMobileNav()" '    + mCls('kalkulator-obligacji')     + '><span ' + iCo('kalkulator-obligacji')     + '>receipt_long</span>Obligacje EDO</a>' +
    '<a href="' + P + 'kalkulator-wolnosci.html" onclick="closeMobileNav()" '     + mCls('kalkulator-wolnosci')      + '><span ' + iCo('kalkulator-wolnosci')      + '>savings</span>Kalkulator FIRE</a>' +
    '<a href="' + P + 'porownywarka.html" onclick="closeMobileNav()" '            + mCls('porownywarka')             + '><span ' + iCo('porownywarka')             + '>compare_arrows</span>Porównywarka</a>' +
    '<a href="' + P + 'kalkulator-podatku-belki.html" onclick="closeMobileNav()" ' + mCls('kalkulator-podatku-belki') + '><span ' + iCo('kalkulator-podatku-belki') + '>percent</span>Podatek Belki</a>' +
    '<a href="' + B + 'index.html" onclick="closeMobileNav()" '                   + (blogActive ? CLS_M_ACT : CLS_M) + '><span ' + (blogActive ? ICO_ACT : ICO)    + '>article</span>Blog</a>' +
    '<a href="' + P + 'o-projekcie.html" onclick="closeMobileNav()" '             + mCls('o-projekcie')              + '><span ' + iCo('o-projekcie')              + '>info</span>O projekcie</a>' +
    '</div>' +
    '<div class="mt-3 pt-3 border-t border-stitch-border/40 flex sm:hidden">' +
    '<a href="#newsletter-section" onclick="closeMobileNav()" class="w-full text-center text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity" style="background-color:#0d7ff2; text-decoration:none;">Zapisz się na newsletter</a>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</nav>';

  // Wstrzyknij nav
  var root = document.getElementById('nav-root');
  if (root) root.outerHTML = html;

  // Funkcje nawigacji mobilnej (globalne)
  window.toggleMobileNav = function () {
    var m  = document.getElementById('mobile-nav');
    var im = document.getElementById('nav-icon-menu');
    var ic = document.getElementById('nav-icon-close');
    var b  = document.getElementById('nav-toggle');
    var open = !m.classList.contains('hidden');
    m.classList.toggle('hidden', open);
    im.classList.toggle('hidden', !open);
    ic.classList.toggle('hidden', open);
    b.setAttribute('aria-expanded', String(!open));
  };

  window.closeMobileNav = function () {
    var m  = document.getElementById('mobile-nav');
    if (!m) return;
    m.classList.add('hidden');
    var im = document.getElementById('nav-icon-menu');
    var ic = document.getElementById('nav-icon-close');
    var b  = document.getElementById('nav-toggle');
    if (im) im.classList.remove('hidden');
    if (ic) ic.classList.add('hidden');
    if (b)  b.setAttribute('aria-expanded', 'false');
  };

  document.addEventListener('click', function (e) {
    var nav = document.getElementById('main-nav');
    if (nav && !nav.contains(e.target)) window.closeMobileNav();
  });
})();
