import os
import re

o_projekcie_path = r"c:\Users\komptest\Documents\Windsurf test\test kalkulator\pages\o-projekcie.html"
with open(o_projekcie_path, "r", encoding="utf-8") as f:
    template = f.read()

# Remove the newsletter section
newsletter_pattern = re.compile(r'^\s*<!-- NEWSLETTER SECTION.+?</section>\s*', re.DOTALL | re.MULTILINE)
template = newsletter_pattern.sub('\n', template)

# Remove active link highlighting from "O projekcie"
template = template.replace(
    'class="text-sm font-extrabold text-primary transition-colors hover:opacity-80"\n          href="o-projekcie.html" style="text-decoration:none; color: #0d7ff2;"',
    'class="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"\n          href="o-projekcie.html" style="text-decoration:none;"'
)
template = template.replace(
    'class="text-[12px] font-extrabold text-primary hover:opacity-80 whitespace-nowrap"\n        href="o-projekcie.html" style="text-decoration:none; color:#0d7ff2;"',
    'class="text-[12px] font-bold text-slate-600 dark:text-slate-400 hover:text-primary whitespace-nowrap"\n        href="o-projekcie.html" style="text-decoration:none;"'
)

# Extract Everything before <main> and after </main>
main_start = template.find('<main')
main_end = template.find('</main>') + len('</main>')

pre_main = template[:main_start]
post_main = template[main_end:]

def generate_page(dest_path, title, desc, canonical, main_content):
    page = pre_main + main_content + post_main
    # Replace Meta Tags
    page = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', page)
    page = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', page)
    page = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{title}">', page)
    page = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{desc}">', page)
    page = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="{canonical}">', page)
    page = re.sub(r'<meta property="og:url" content=".*?">', f'<meta property="og:url" content="{canonical}">', page)

    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(page)

# -----------------
# Polityka Prywatności
# -----------------
polityka_main = """
  <main class="pt-32 pb-20 px-4 sm:px-6 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <div class="max-w-3xl mx-auto pt-8 pb-20">
      
      <!-- HERO -->
      <nav class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8 w-fit mx-auto">
        <a href="../index.html" class="hover:text-primary transition-colors" style="text-decoration:none;">ETFkalkulator.pl</a>
        <span class="material-symbols-outlined text-[10px]">chevron_right</span>
        <span class="text-primary dark:text-blue-400">Polityka prywatności</span>
      </nav>

      <div class="flex justify-center mb-4">
        <span class="material-symbols-outlined text-4xl text-primary" style="color: #0d7ff2;">shield</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white text-center mb-3">
        Polityka Prywatności
      </h1>
      <p class="text-slate-500 dark:text-slate-400 text-center mb-3">
        Jak chronimy Twoje dane i co robimy z Twoimi informacjami
      </p>
      <div class="flex justify-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span class="material-symbols-outlined text-sm">calendar_today</span>
          Ostatnia aktualizacja: 2 marca 2026
        </div>
      </div>

      <!-- Section 1 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">1</div>
          Wprowadzenie
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">ETFkalkulator.pl szanuje Twoją prywatność. Ta polityka prywatności wyjaśnia, jakie dane zbieramy, jak je wykorzystujemy i jakie masz prawa związane z Twoimi danymi osobowymi.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Administratorem serwisu jest Właściciel serwisu ETFkalkulator.pl, będący osobą fizyczną. Kontakt w sprawach dotyczących danych osobowych możliwy jest pod adresem: <a href="mailto:kontakt@etfkalkulator.pl" class="font-bold text-primary hover:underline" style="color:#0d7ff2">kontakt@etfkalkulator.pl</a></p>
      </div>

      <!-- Section 2 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">2</div>
          Jakie dane zbieramy
        </h2>
        <div class="rounded-xl p-4 bg-primary/5 dark:bg-primary/10 border-l-4 border-primary mb-4 text-sm text-primary dark:text-blue-300 font-medium" style="border-color:#0d7ff2">Ważne: ETFkalkulator.pl nie zbiera żadnych danych osobowych podczas korzystania z kalkulatorów.</div>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Nasze narzędzia działają lokalnie w Twojej przeglądarce - nie przetwarzamy żadnych danych finansowych ani osobowych.</p>
        <div class="rounded-xl p-4 bg-primary/5 dark:bg-primary/10 border-l-4 border-primary mb-4 text-sm text-primary dark:text-blue-300 font-medium" style="border-color:#0d7ff2">Bezpiecznik matematyczny: Wszelkie obliczenia wykonywane przez kalkulatory mają charakter poglądowy i symulacyjny. Właściciel serwisu nie gwarantuje ich bezbłędności ani przydatności do podejmowania konkretnych decyzji inwestycyjnych.</div>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Jedyne dane, które mogą być zbierane to:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Adres e-mail - jeśli zapiszesz się na newsletter (dobrowolnie)</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Dane analityczne - anonimowe statystyki odwiedzin (Google Analytics)</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Ciasteczka (cookies) - do celów technicznych i analitycznych</span></li>
        </ul>
      </div>

      <!-- Section 3 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">3</div>
          Newsletter
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Zapis na newsletter jest całkowicie dobrowolny. Podajesz swój adres e-mail tylko jeśli sam tego chcesz. Możesz wypisać się w każdej chwili klikając link 'unsubscribe' w każdej wiadomości newsletter.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Newsletter zawiera informacje o nowych narzędziach, analizach rynku i aktualnościach ETFkalkulator.pl. Nie udostępniamy Twojego adresu e-mail nikomu.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Uwaga: Newsletter nie jest kanałem kontaktowym. Wszystkie pytania i sprawy prosimy zgłaszać przez email: <a href="mailto:kontakt@etfkalkulator.pl" class="font-bold text-primary hover:underline" style="color:#0d7ff2">kontakt@etfkalkulator.pl</a></p>
      </div>

      <!-- Section 4 -->
      <div id="cookies" class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">4</div>
          Pliki cookies
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">ETFkalkulator.pl używa plików cookies zgodnie z RODO (GDPR) w następujących celach:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Cookies techniczne: niezbędne do działania strony (np. zapamiętywanie ustawień trybu jasny/ciemny)</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Cookies analityczne: anonimowe statystyki odwiedzin (Google Analytics) — ładowane tylko po Twojej zgodzie</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Cookies funkcjonalne: zapamiętywanie preferencji i wyborów na stronie</span></li>
        </ul>

        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">Zarządzanie cookies</h3>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Podczas pierwszej wizyty na stronie zobaczysz banner z prośbą o zgodę na cookies. Masz pełną kontrolę:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Akceptuj: zezwalasz na wszystkie cookies (w tym analityczne)</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Odrzuć: blokujesz cookies analityczne (strona nadal działa poprawnie)</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Ustawienia: możesz zmienić preferencje w każdej chwili</span></li>
        </ul>

        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">Google Analytics</h3>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Jeśli wyrazisz zgodę, używamy Google Analytics do zbierania anonimowych statystyk:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Liczba odwiedzin i popularność stron</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Czas spędzony na stronie</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Źródła ruchu (skąd przychodzą użytkownicy)</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Informacje techniczne (przeglądarka, urządzenie)</span></li>
        </ul>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Dane analityczne są przetwarzane przez Google Ireland Ltd. w ramach usługi Google Analytics. Informacje te są przekazywane do serwerów Google, co może wiązać się z przesyłaniem danych poza Europejski Obszar Gospodarczy. Korzystamy z funkcji anonimizacji IP.</p>

        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">Twoje prawa</h3>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Zgodnie z RODO masz prawo do:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Wycofania zgody na cookies w każdej chwili</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Sprawdzenia jakie cookies są przechowywane</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Usunięcia cookies w ustawieniach przeglądarki</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Zgłoszenia skargi do organu nadzorczego (UODO)</span></li>
        </ul>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Możesz wyłączyć cookies w ustawieniach przeglądarki. Strona będzie działać bez cookies analitycznych, ale niektóre funkcje personalizacji mogą być ograniczone.</p>
      </div>

      <!-- Section 5 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">5</div>
          Dane analityczne
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Używamy Google Analytics do zbierania anonimowych statystyk odwiedzin. Zbieramy informacje takie jak:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Liczba odwiedzających</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Strony, które są najpopularniejsze</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Czas spędzony na stronie</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Geograficzne położenie (tylko kraj)</span></li>
        </ul>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Te dane są anonimowe i nie pozwalają na identyfikację konkretnej osoby. Służą nam do ulepszania serwisu i lepszego zrozumienia potrzeb użytkowników.</p>
      </div>

      <!-- Section 6 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">6</div>
          Twoje prawa
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">W związku z RODO masz następujące prawa:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Prawo dostępu: możesz poprosić o kopię swoich danych</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Prawo do sprostowania: możesz poprosić o poprawienie nieprawidłowych danych</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Prawo do usunięcia: możesz poprosić o usunięcie swoich danych</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Prawo do ograniczenia przetwarzania: możesz ograniczyć sposób przetwarzania danych</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Prawo do przenoszenia danych: możesz poprosić o przeniesienie danych do innego serwisu</span></li>
        </ul>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Aby skorzystać z tych praw, skontaktuj się z nami przez email: <a href="mailto:kontakt@etfkalkulator.pl" class="font-bold text-primary hover:underline" style="color:#0d7ff2">kontakt@etfkalkulator.pl</a></p>
      </div>

      <!-- Section 7 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">7</div>
          Bezpieczeństwo danych
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Dbamy o bezpieczeństwo Twoich danych. Stosujemy odpowiednie środki techniczne i organizacyjne, aby chronić dane przed utratą, nieuprawnionym dostępem lub zmianą.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Strona jest zabezpieczona protokołem HTTPS, co oznacza, że połączenie z naszą stroną jest szyfrowane.</p>
      </div>

      <!-- Section 8 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">8</div>
          Zmiany w polityce prywatności
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Ta polityka prywatności może być okresowo aktualizowana. Wszelkie zmiany będą publikowane na tej stronie. Zalecamy regularne sprawdzanie tej polityki.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Data ostatniej aktualizacji: 2 marca 2026 roku.</p>
      </div>

      <!-- Section 9 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">9</div>
          Kontakt
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Jeśli masz pytania dotyczące tej polityki prywatności lub chcesz skorzystać ze swoich praw, skontaktuj się z nami przez email: <a href="mailto:kontakt@etfkalkulator.pl" class="font-bold text-primary hover:underline" style="color:#0d7ff2">kontakt@etfkalkulator.pl</a></p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Odpowiemy na Twoje zapytanie w ciągu 30 dni.</p>
      </div>

    </div>
  </main>
"""

generate_page(
    dest_path=r"c:\Users\komptest\Documents\Windsurf test\test kalkulator\pages\polityka-prywatnosci.html",
    title="Polityka Prywatności | ETFkalkulator.pl",
    desc="Polityka prywatności ETFkalkulator.pl. Jakie dane zbieramy, jak je chronimy i jakie masz prawa.",
    canonical="https://etfkalkulator.pl/pages/polityka-prywatnosci.html",
    main_content=polityka_main
)

# -----------------
# Regulamin
# -----------------
regulamin_main = """
  <main class="pt-32 pb-20 px-4 sm:px-6 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <div class="max-w-3xl mx-auto pt-8 pb-20">
      
      <!-- HERO -->
      <nav class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8 w-fit mx-auto">
        <a href="../index.html" class="hover:text-primary transition-colors" style="text-decoration:none;">ETFkalkulator.pl</a>
        <span class="material-symbols-outlined text-[10px]">chevron_right</span>
        <span class="text-primary dark:text-blue-400">Regulamin</span>
      </nav>

      <div class="flex justify-center mb-4">
        <span class="material-symbols-outlined text-4xl text-primary" style="color: #0d7ff2;">gavel</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white text-center mb-3">
        Regulamin
      </h1>
      <p class="text-slate-500 dark:text-slate-400 text-center mb-3">
        Warunki korzystania z serwisu ETFkalkulator.pl
      </p>
      <div class="flex justify-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span class="material-symbols-outlined text-sm">calendar_today</span>
          Wchodzi w życie: 2 marca 2026
        </div>
      </div>

      <!-- Section 1 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">1</div>
          Wprowadzenie
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Niniejszy regulamin określa warunki korzystania z serwisu ETFkalkulator.pl. Korzystając z serwisu, potwierdzasz, że zapoznałeś się z regulaminem i akceptujesz jego postanowienia.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">ETFkalkulator.pl jest bezpłatnym narzędziem edukacyjnym przeznaczonym do celów informacyjnych.</p>
      </div>

      <!-- Section 2 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">2</div>
          Definicje
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">W rozumieniu niniejszego regulaminu:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Administrator — osoba fizyczna będąca właścicielem serwisu ETFkalkulator.pl, świadcząca usługi niekomercyjnie</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Serwis — strona internetowa ETFkalkulator.pl wraz z wszystkimi podstronami i narzędziami</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Użytkownik — osoba korzystająca z Serwisu</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Kalkulatory — narzędzia do obliczania parametrów inwestycyjnych dostępne w Serwisie</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Newsletter — usługa informacyjna świadczona przez Serwis</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">RODO — Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679</span></li>
        </ul>
      </div>

      <!-- Section 3 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">3</div>
          Zakres usługi
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">ETFkalkulator.pl udostępnia następujące narzędzia edukacyjne:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Kalkulator Obligacji Skarbowych (EDO, ROS, ROD)</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Kalkulator Wolności Finansowej (FIRE)</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Porównywarka ETF vs Obligacje</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Newsletter z analizami rynku</span></li>
        </ul>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Wszystkie narzędzia są dostępne bezpłatnie i nie wymagają rejestracji.</p>
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">Wymagania techniczne</h3>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Do korzystania z Serwisu niezbędne jest urządzenie z dostępem do sieci Internet, przeglądarka internetowa obsługująca JavaScript (np. Chrome, Firefox, Safari) oraz aktywne połączenie internetowe.</p>
      </div>

      <!-- Section 4 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">4</div>
          Prawa i obowiązki użytkownika
        </h2>
        <div class="rounded-xl p-4 bg-primary/5 dark:bg-primary/10 border-l-4 border-primary mb-4 text-sm text-primary dark:text-blue-300 font-medium" style="border-color:#0d7ff2">Ważne: Pamiętaj, że ETFkalkulator.pl to narzędzie edukacyjne, nie porada inwestycyjna.</div>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Użytkownik ma prawo do:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Korzystania z wszystkich dostępnych narzędzi edukacyjnych</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Zapisu i rezygnacji z newslettera w dowolnym momencie</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Dostępu do informacji o polityce prywatności</span></li>
        </ul>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Użytkownik zobowiązuje się do:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Niekorzystania z Serwisu w celach niezgodnych z prawem</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Niepodejmowania działań naruszających funkcjonowanie Serwisu</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Podawania prawdziwych danych w formularzu newsletter (jeśli zdecyduje się na zapis)</span></li>
        </ul>
      </div>

      <!-- Section 5 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">5</div>
          Ograniczenia odpowiedzialności
        </h2>
        <div class="rounded-xl p-4 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 mb-4 text-sm text-amber-700 dark:text-amber-400 font-medium">BARDZO WAŻNE: ETFkalkulator.pl nie świadczy usług doradztwa inwestycyjnego.</div>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Administrator Serwisu nie ponosi odpowiedzialności za:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Decyzje inwestycyjne podjęte przez Użytkownika na podstawie obliczeń z kalkulatorów</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Dokładność danych wejściowych wprowadzonych przez Użytkownika</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Straty finansowe Użytkownika wynikające z inwestycji</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Zmiany w przepisach prawnych lub podatkowych po dacie publikacji kalkulatorów</span></li>
        </ul>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Wszystkie obliczenia mają charakter wyłącznie edukacyjny i informacyjny. Przed podjęciem decyzji inwestycyjnej skonsultuj się z licencjonowanym doradcą inwestycyjnym.</p>
      </div>

      <!-- Section 6 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">6</div>
          Dokładność obliczeń
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Kalkulatory ETFkalkulator.pl zostały opracowane z największą starannością, jednak:</p>
        <ul class="space-y-2 my-4 ml-0">
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Obliczenia opierają się na danych dostępnych w momencie tworzenia narzędzi</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Wyniki mogą różnić się od rzeczywistych z powodu zmian rynkowych</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Podatki i opłaty mogą ulec zmianie wraz ze zmianą przepisów</span></li>
          <li class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" style="background-color:#0d7ff2"></div><span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Inflacja jest zmienną trudną do przewidzenia</span></li>
        </ul>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Administrator dokłada wszelkich starań, aby kalkulatory były aktualne, jednak nie gwarantuje ich pełnej dokładności w przyszłości.</p>
      </div>

      <!-- Section 7 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">7</div>
          Prawa autorskie
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Wszystkie treści dostępne w Serwisie, w tym teksty, grafiki, kalkulatory i kody źródłowe, są chronione prawem autorskim i należą do ETFkalkulator.pl.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Zabrania się kopiowania, rozpowszechniania i modyfikowania treści Serwisu bez wyraźnej zgody Administratora.</p>
      </div>

      <!-- Section 8 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">8</div>
          Newsletter
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Zapis na newsletter jest dobrowolny. Użytkownik może wypisać się z newslettera w każdej chwili klikając link 'unsubscribe' w wiadomości e-mail.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Newsletter zawiera informacje o nowych narzędziach, analizach rynku i aktualnościach związanych z ETFkalkulator.pl.</p>
      </div>

      <!-- Section 9 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">9</div>
          Przetwarzanie danych osobowych
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Szczegółowe zasady przetwarzania danych osobowych określa Polityka Prywatności dostępna pod adresem:</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3"><a href="polityka-prywatnosci.html" class="text-primary font-bold" style="color:#0d7ff2">Polityka Prywatności</a></p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Korzystanie z kalkulatorów nie wymaga podawania żadnych danych osobowych. Jedynym wyjątkiem jest zapis na newsletter, który wymaga podania adresu e-mail.</p>
      </div>

      <!-- Section 10 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">10</div>
          Zmiany w regulaminie
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszym regulaminie. Wszelkie zmiany będą publikowane na tej stronie.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Zmiany w regulaminie wchodzą w życie z dniem publikacji. Kontynuowanie korzystania z Serwisu po zmianach oznacza akceptację nowego regulaminu.</p>
      </div>

      <!-- Section 11 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">11</div>
          Reklamacje
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Reklamacje dotyczące działania Serwisu można zgłaszać na adres: <a href="mailto:kontakt@etfkalkulator.pl" class="font-bold text-primary hover:underline" style="color:#0d7ff2">kontakt@etfkalkulator.pl</a></p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Administrator rozpatrzy reklamację w terminie 14 dni.</p>
      </div>

      <!-- Section 12 -->
      <div class="glass-effect rounded-[1.5rem] p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
        <h2 class="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black flex items-center justify-center shrink-0" style="color:#0d7ff2">12</div>
          Postanowienia końcowe
        </h2>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy powszechnie obowiązującego prawa polskiego, w szczególności Kodeksu Cywilnego i ustawy o prawie autorskim i prawach pokrewnych.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Wszelkie spory wynikające z korzystania z Serwisu będą rozstrzygane przez sąd właściwy dla siedziby Administratora.</p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Regulamin wchodzi w życie z dniem 2 marca 2026 roku.</p>
        
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">Kontakt</h3>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">W przypadku pytań dotyczących regulaminu lub spraw związanych z funkcjonowaniem serwisu, prosimy o kontakt przez email: <a href="mailto:kontakt@etfkalkulator.pl" class="font-bold text-primary hover:underline" style="color:#0d7ff2">kontakt@etfkalkulator.pl</a></p>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Odpowiemy na Twoje zapytanie w ciągu 7 dni roboczych.</p>
      </div>

    </div>
  </main>
"""

generate_page(
    dest_path=r"c:\Users\komptest\Documents\Windsurf test\test kalkulator\pages\regulamin.html",
    title="Regulamin ETFkalkulator.pl | Warunki korzystania z serwisu",
    desc="Regulamin ETFkalkulator.pl. Warunki korzystania z kalkulatorów, odpowiedzialność i ograniczenia.",
    canonical="https://etfkalkulator.pl/pages/regulamin.html",
    main_content=regulamin_main
)
