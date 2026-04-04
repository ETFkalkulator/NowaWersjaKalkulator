import re

html_file = r'C:\Users\komptest\Documents\ETFkalkulator 3.0\A wersja do pracy\blog\index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

new_left_column = """      <div>
        <!-- Section: Kategorie -->
        <div class="mb-8 pl-1 pr-1">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-xs font-black text-primary uppercase tracking-widest whitespace-nowrap">Kategorie</span>
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          </div>
          
          <!-- Category Chips Container -->
          <div class="flex overflow-x-auto gap-3 pb-2 no-scrollbar" id="category-filters">
             <button data-filter="all" class="category-btn cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all bg-primary text-white shadow-md border-transparent hover:brightness-110">Wszystkie</button>
             <button data-filter="etf" class="category-btn cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all bg-stitch-surface text-stitch-muted border border-stitch-border hover:border-primary/50 hover:text-primary hover:bg-primary/5">ETF</button>
             <button data-filter="obligacje" class="category-btn cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all bg-stitch-surface text-stitch-muted border border-stitch-border hover:border-primary/50 hover:text-primary hover:bg-primary/5">Obligacje Skarbowe</button>
             <button data-filter="fire" class="category-btn cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all bg-stitch-surface text-stitch-muted border border-stitch-border hover:border-primary/50 hover:text-primary hover:bg-primary/5">Wolność Finansowa</button>
             <button data-filter="porownywarka" class="category-btn cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all bg-stitch-surface text-stitch-muted border border-stitch-border hover:border-primary/50 hover:text-primary hover:bg-primary/5">Porównywarka</button>
             <button data-filter="belka" class="category-btn cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all bg-stitch-surface text-stitch-muted border border-stitch-border hover:border-primary/50 hover:text-primary hover:bg-primary/5">Podatek Belki</button>
          </div>
        </div>

        <!-- Section Label: Najnowszy artykuł -->
        <div class="flex items-center gap-3 mb-6 mt-6">
          <span class="text-xs font-black text-primary uppercase tracking-widest whitespace-nowrap">Najnowszy artykuł</span>
          <div class="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <!-- FEATURED ARTICLE -->
        <a href="inflacja-niszczy-oszczednosci-co-zrobic.html" data-categories="etf,obligacje" class="article-card block mb-10 group cursor-pointer" style="text-decoration: none">
          <div class="glass-effect rounded-[2rem] border border-white/50 dark:border-stitch-border/50 shadow-2xl overflow-hidden hover:scale-[1.005] transition-all duration-300">
            <div class="bg-cover bg-center p-6 md:p-10 text-white relative overflow-hidden flex flex-col justify-end min-h-[360px]" style="background-image: url('../images/inflacja-niszczy-oszczednosci.webp');">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-transparent"></div>
              <div class="relative z-10">
                <span class="bg-primary/90 text-white shadow-sm border border-white/10 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 inline-block">Inflacja · Oszczędności</span>
                <h2 class="text-2xl md:text-3xl font-black leading-tight mb-3 text-white">Inflacja niszczy oszczędności — i co z tym zrobić w 2026</h2>
                <p class="text-white/80 text-sm md:text-base leading-relaxed max-w-3xl">Ile traci konto bankowe na inflacji? ETF, obligacje EDO i konkretny plan ochrony kapitału.</p>
              </div>
            </div>
            <div class="bg-stitch-surface px-6 md:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex flex-wrap gap-4 text-sm text-stitch-muted font-medium">
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">calendar_today</span> Kwiecień 2026</span>
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">schedule</span> 9 minut czytania</span>
              </div>
              <span class="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shrink-0">Czytaj artykuł<span aria-hidden="true" class="material-symbols-outlined text-[18px]">arrow_forward</span></span>
            </div>
          </div>
        </a>

        <!-- Section Label: Wszystkie wpisy -->
        <div class="flex items-center gap-3 mb-6 mt-10">
          <span class="text-xs font-black text-primary uppercase tracking-widest whitespace-nowrap">Baza Wiedzy</span>
          <div class="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <!-- Published Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" id="articles-grid">
"""

articles = [
    {
        "url": "podatek-belki-etf-jak-rozliczyc.html",
        "cats": "etf,belka",
        "tag": "ETF · Podatki",
        "title": "Podatek Belki od ETF — jak rozliczyć PIT-38 i ile faktycznie zapłacisz w 2026",
        "desc": "Praktyczny przewodnik krok po kroku: PIT-38, PIT-8C, kompensacja strat i legalne sposoby na minimalizację podatku.",
        "time": "9 minut",
        "img": "thumb_article_belka.webp"
    },
    {
        "url": "jak-zaczac-inwestowac-w-etf.html",
        "cats": "etf",
        "tag": "ETF",
        "title": "Jak zacząć inwestować w ETF w Polsce — przewodnik krok po kroku",
        "desc": "Od wyboru brokera, przez DCA, po IKE/IKZE. Praktyczny poradnik dla początkujących.",
        "time": "10 minut",
        "img": "thumb_article_start_etf.webp"
    },
    {
        "url": "ike-czy-ikze-co-wybrac.html",
        "cats": "etf,obligacje,belka,fire",
        "tag": "IKE/IKZE",
        "title": "IKE czy IKZE — co wybrać w 2026? Porównanie, limity i liczby",
        "desc": "Limity wpłat, zwrot z PIT i scenariusze. Co opłaca się bardziej w twojej sytuacji?",
        "time": "9 minut",
        "img": "thumb_article_ike_ikze.webp"
    },
    {
        "url": "kalkulator-etf-jak-obliczyc-realny-zysk.html",
        "cats": "etf",
        "tag": "ETF",
        "title": "Kalkulator ETF — jak obliczyć realny zysk po podatku i inflacji",
        "desc": "Zysk netto, tarcza IKE/IKZE i inflacja. Liczymy ile faktycznie zyskujesz na giełdzie.",
        "time": "8 minut",
        "img": "thumb_article_real_profit.webp"
    },
    {
        "url": "obligacje-edo-poradnik.html",
        "cats": "obligacje",
        "tag": "Obligacje",
        "title": "Obligacje EDO — co to jest i jak działają? Kompletny poradnik 2026",
        "desc": "Oprocentowanie 5,60% + inflacja, jak kupić, IKE-Obligacje. Kompletne ABC.",
        "time": "8 minut",
        "img": "thumb_article_edo_guide.webp"
    },
    {
        "url": "jak-zbudowac-pierwszy-portfel-inwestycyjny.html",
        "cats": "etf,obligacje",
        "tag": "ETF · Obligacje",
        "title": "Jak zbudować pierwszy portfel inwestycyjny 2026",
        "desc": "Konkretny plan: poduszka finansowa, ETF globalny i obligacje EDO dla początkujących.",
        "time": "10 minut",
        "img": "thumb_article_portfolio.webp"
    },
    {
        "url": "msci-world-czy-sp500-ktory-etf-wybrac.html",
        "cats": "etf",
        "tag": "ETF",
        "title": "MSCI World czy S&P 500 — który ETF wybrać?",
        "desc": "Porównanie wyników, kosztów, dywersyfikacji i ryzyka - IWDA vs CSPX.",
        "time": "9 minut",
        "img": "thumb_article_msci_sp500.webp"
    },
    {
        "url": "procent-skladany-jak-dziala.html",
        "cats": "etf,fire",
        "tag": "ETF · FIRE",
        "title": "Procent składany — dlaczego czas to pieniądz",
        "desc": "Wzór, reguła 72 i dlaczego dziesięć lat wcześniej bije dwa razy większe wpłaty.",
        "time": "9 minut",
        "img": "thumb_article_compound.webp"
    },
    {
        "url": "regula-4-procent-fire-po-polsku.html",
        "cats": "fire",
        "tag": "FIRE",
        "title": "Ile potrzebujesz żeby nie pracować? Reguła 4% w Polsce",
        "desc": "Warianty FIRE i jak wolność finansowa wygląda w polskich realiach podatkowych.",
        "time": "10 minut",
        "img": "regula-4-procent-fire-po-polsku.webp"
    },
    {
        "url": "edo-vs-etf-2026.html",
        "cats": "porownywarka,etf,obligacje",
        "tag": "Porównywarka",
        "title": "EDO vs ETF — uczciwe porównanie dla polskiego inwestora",
        "desc": "Bezpośrednie porównanie ryzyka, kosztów i zysków długoterminowych.",
        "time": "8 minut",
        "img": "thumb_article_edo_etf.webp"
    }
]

for a in articles:
    new_left_column += f"""          <!-- Article Card -->
          <a href="{a['url']}" data-categories="{a['cats']}" class="article-card flex flex-col overflow-hidden rounded-[1.5rem] bg-stitch-surface border border-white/50 dark:border-stitch-border/50 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.01] group" style="text-decoration: none">
            <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style="background-image: url('../images/{a['img']}');"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="flex flex-1 flex-col p-6">
              <div class="flex items-center gap-3 mb-3">
                <span class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">{a['tag']}</span>
                <span class="text-[11px] text-slate-400 font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">schedule</span> {a['time']}</span>
              </div>
              <h3 class="text-base font-black leading-snug text-stitch-text group-hover:text-primary transition-colors mb-2">{a['title']}</h3>
              <p class="text-sm leading-relaxed text-stitch-muted mb-4">{a['desc']}</p>
              <div class="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-stitch-border">
                <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">Czytaj artykuł <span aria-hidden="true" class="material-symbols-outlined text-[14px]">arrow_forward</span></span>
              </div>
            </div>
          </a>
"""

new_left_column += """        </div>
        <!-- Brak wyników -->
        <div id="no-results" class="hidden py-16 text-center">
          <span class="material-symbols-outlined text-4xl text-slate-300 mb-3 block">search_off</span>
          <p class="text-stitch-text font-bold text-lg mb-1">Brak wyników</p>
          <p class="text-stitch-muted text-sm">Nie ma jeszcze artykułów w tej kategorii.</p>
        </div>
      </div>"""

start_marker = "      <div>\n        <!-- Section Label: Najnowszy artykuł -->"
end_marker = "      </div>\n      <!-- /LEFT COLUMN -->"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker) + len("      </div>")

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_left_column + content[end_idx:]
    
    filter_js = """
  <!-- JS Navigation & Categories script -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const categoryBtns = document.querySelectorAll('.category-btn');
      const articleCards = document.querySelectorAll('.article-card');
      const noResults = document.getElementById('no-results');

      categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Zmiana stylów przycisków (aktywny / nieaktywny)
          categoryBtns.forEach(b => {
             b.classList.remove('bg-primary', 'text-white', 'shadow-md', 'border-transparent');
             b.classList.add('bg-stitch-surface', 'text-stitch-muted');
          });
          btn.classList.add('bg-primary', 'text-white', 'shadow-md', 'border-transparent');
          btn.classList.remove('bg-stitch-surface', 'text-stitch-muted');

          const filter = btn.dataset.filter;
          let visibleCount = 0;

          articleCards.forEach(card => {
            const categories = card.dataset.categories ? card.dataset.categories.split(',') : [];
            const isFeatured = card.classList.contains('block') && card.classList.contains('mb-10');
            
            // Logika ukrywania/pokazywania (dodanie animacji opacity jeśli możliwe)
            if (filter === 'all' || categories.includes(filter)) {
              card.style.display = isFeatured ? 'block' : 'flex';
              visibleCount++;
            } else {
              card.style.display = 'none';
            }
          });

          if (visibleCount === 0) {
            noResults.classList.remove('hidden');
          } else {
            noResults.classList.add('hidden');
          }
        });
      });
    });
  </script>
</body>"""
    if "<!-- Nasze pliki JavaScript -->" in new_content:
        new_content = new_content.replace("</body>", filter_js)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("MARKERS NOT FOUND")
