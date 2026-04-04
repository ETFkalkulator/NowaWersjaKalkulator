# Instrukcja Obsługi: Tailwind CSS po optymalizacji PageSpeed

Z uwagi na usunięcie obciążającego skryptu `cdn.tailwindcss.com`, strona działa teraz wybitnie powiązku ze stałym, zbudowanym plikiem CSS (plik `css/tailwind-compiled.css`). Zniknęły zacięcia i długie ładowania.

## Dodawanie nowych klas lub zmiana stylów

Jeśli w którymkolwiek z plików HTML `.html` lub JS `.js` dodajesz kompletnie **nowe** funkcje Tailwinda np.:
`<div class="text-rose-900 border-4 border-fuchsia-500">`
To zmiana ta nie zaaplikuje się od razu na stronie (gdyż te konkretne nazwy ucięło narzędzie kompresujące aby nie ważyć zbędnych megabajtów). Wcześniej robił to z automatu Play CDN, ale zaciągając nam TBT / LCP w dół.

Aby strona zarejestrowała nowe klasy wystarczy po zakończeniu kodowania nowości uruchomić w głównym folderze:
**`npm run build:css`**

Skrypt ten podniesie całe środowisko i zaktualizuje `css/tailwind-compiled.css` w niecałą sekundę pod Twoje preferencje. Po przesłaniu projektu na produkcję/serwer wrzucaj również zawsze tą najnowszą zaktualizowaną wersję `css/tailwind-compiled.css`.

Zarządzanie kolorami z poziomu JS usunięto ze ścieżki i przeniesiono czysto do rdzennie działającego pliku `tailwind.config.js`.
