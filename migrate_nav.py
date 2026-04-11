"""
migrate_nav.py — Migracja nawigacji ETFkalkulator.pl do komponentu nav.js

Co robi:
1. W kazdym HTML: zamienia blok <nav id="main-nav">...</nav> + <script>toggle...</script>
   na <div id="nav-root"></div> + <script src="[rel]js/nav.js"></script>
2. W pages/*.html i index.html: usuwa standalone <script defer> z przelaczTryb()
3. Dodaje <script src="[rel]js/shared.js" defer></script> tam gdzie go brakuje

Uruchom: python migrate_nav.py
Tryb podgladu (bez zapisu): python migrate_nav.py --dry-run
"""

import re
import os
import sys
import shutil
from pathlib import Path

BASE = Path(__file__).parent
DRY_RUN = '--dry-run' in sys.argv

# ---------- konfiguracja plikow ----------

# Wszystkie HTML do przetworzenia (sciezka wzgledna do BASE)
ALL_HTML = [
    'index.html',
    'pages/kalkulator-etf.html',
    'pages/kalkulator-obligacji.html',
    'pages/kalkulator-wolnosci.html',
    'pages/kalkulator-podatku-belki.html',
    'pages/porownywarka.html',
    'pages/o-projekcie.html',
    'pages/polityka-prywatnosci.html',
    'pages/regulamin.html',
    'blog/index.html',
    # '_article-template.html' — pominiety (inny format nava, zaktualizuj recznie)
    'blog/jak-zaczac-inwestowac-w-etf.html',
    'blog/jak-zbudowac-pierwszy-portfel-inwestycyjny.html',
    'blog/edo-vs-etf-2026.html',
    'blog/ike-czy-ikze-co-wybrac.html',
    'blog/msci-world-czy-sp500-ktory-etf-wybrac.html',
    'blog/procent-skladany-jak-dziala.html',
    'blog/regula-4-procent-fire-po-polsku.html',
    'blog/kalkulator-etf-jak-obliczyc-realny-zysk.html',
    'blog/obligacje-edo-poradnik.html',
    'blog/podatek-belki-etf-jak-rozliczyc.html',
]

# Pliki z samodzielnym blokiem przelaczTryb (w osobnym <script defer>)
# W blogach przelaczTryb jest wmieszany z reading-progress — nie ruszamy
REMOVE_PRZELACZ_IN = [
    'index.html',
    'pages/kalkulator-etf.html',
    'pages/kalkulator-obligacji.html',
    'pages/kalkulator-wolnosci.html',
    'pages/kalkulator-podatku-belki.html',
    'pages/porownywarka.html',
    'pages/o-projekcie.html',
    'pages/polityka-prywatnosci.html',
    'pages/regulamin.html',
]

# Pliki ktore NIE laduja shared.js — trzeba dodac
ADD_SHARED_IN = [
    'index.html',
    'pages/o-projekcie.html',
    'pages/polityka-prywatnosci.html',
    'pages/regulamin.html',
]

# ---------- wzorce ----------

# Nav block: od <!-- NAWIGACJA --> lub <nav id="main-nav" do konca <script> z toggleMobileNav
# Uzywa DOTALL bo blok jest wieloliniowy
NAV_PATTERN = re.compile(
    r'(\s*<!-- NAWIGACJA -->\s*)?'
    r'<nav id="main-nav"[^>]*>.*?</nav>\s*'
    r'<script>\s*function toggleMobileNav\(\).*?document\.addEventListener\(.*?\)\s*;\s*</script>',
    re.DOTALL
)

# Standalone <script defer> z przelaczTryb (w pages/ i index.html)
# Dopasowuje caly blok niezaleznie od komentarza przed funkcja
PRZELACZ_PATTERN = re.compile(
    r'(\s*<!-- Global Logic -->\s*)?'
    r'\s*<script\s+defer>\s*\n'
    r'(?:\s*//[^\n]*\n)*'      # opcjonalne komentarze na poczatku
    r'\s*function przelaczTryb\(\).*?</script>',
    re.DOTALL
)

# ---------- helper: sciezka do js/ ----------

def rel_js(rel_path):
    """Zwraca prefix do katalogu js/ na podstawie sciezki pliku."""
    depth = rel_path.count('/')
    return '../js/' if depth > 0 else 'js/'

# ---------- glowna logika ----------

def process_file(rel_path):
    fpath = BASE / rel_path
    if not fpath.exists():
        print(f'  [SKIP] Nie znaleziono: {rel_path}')
        return

    original = fpath.read_text(encoding='utf-8')
    content = original
    changes = []

    js = rel_js(rel_path)

    # 1. Zamien nav na nav-root + nav.js
    replacement_nav = f'\n  <!-- NAWIGACJA -->\n  <div id="nav-root"></div>\n  <script src="{js}nav.js"></script>'
    new_content, count = NAV_PATTERN.subn(replacement_nav, content)
    if count:
        content = new_content
        changes.append(f'nav zastapiony ({count}x)')
    else:
        changes.append('NAV NIE ZNALEZIONY — sprawdz recznie!')

    # 2. Usun standalone przelaczTryb (tylko w wybranych plikach)
    if rel_path in REMOVE_PRZELACZ_IN:
        new_content, count = PRZELACZ_PATTERN.subn('', content)
        if count:
            content = new_content
            changes.append(f'przelaczTryb usunieto ({count}x)')
        else:
            changes.append('przelaczTryb NIE ZNALEZIONY wg wzorca — sprawdz recznie')

    # 3. Dodaj shared.js jesli brakuje
    if rel_path in ADD_SHARED_IN:
        if f'{js}shared.js' not in content and 'shared.js' not in content:
            # Wstaw przed cookie-consent lub przed </body>
            insert_before = f'  <script src="{js}cookie-consent.js"'
            shared_tag = f'  <script src="{js}shared.js" defer></script>\n'
            if insert_before in content:
                content = content.replace(insert_before, shared_tag + insert_before, 1)
                changes.append('shared.js dodany')
            elif '</body>' in content:
                content = content.replace('</body>', f'{shared_tag}</body>', 1)
                changes.append('shared.js dodany (przed </body>)')
        else:
            changes.append('shared.js juz jest')

    # Raport
    changed = content != original
    status = 'ZMIENIONY' if changed else 'BEZ ZMIAN'
    print(f'  [{status}] {rel_path}')
    for c in changes:
        prefix = '    OK:' if 'NIE' not in c else '    !!'
        print(f'{prefix} {c}')

    if changed and not DRY_RUN:
        # Backup oryginalu
        backup = fpath.with_suffix('.html.bak')
        shutil.copy2(fpath, backup)
        fpath.write_text(content, encoding='utf-8')

# ---------- uruchomienie ----------

print(f'=== migrate_nav.py {"[DRY RUN]" if DRY_RUN else "[ZAPIS]"} ===\n')
for path in ALL_HTML:
    process_file(path)

if DRY_RUN:
    print('\n[DRY RUN] Zaden plik nie zostal zmieniony. Uruchom bez --dry-run zeby zapisac.')
else:
    print('\nGotowe. Pliki .bak = kopie zapasowe oryginałów.')
    print('Sprawdz kilka stron w przegladarce, a nastepnie usun pliki .bak.')
