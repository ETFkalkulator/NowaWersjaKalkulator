# Przewodnik Stylu Miniatur (Thumbnail Style Guide) dla projektu ETFkalkulator 3.0

Ten plik definiuje spójny styl graficzny, z jakiego należy korzystać przy generowaniu jakichkolwiek nowych miniatur (thumbnails) dla kalkulatorów, artykułów lub innych narzędzi w obrębie projektu ETFkalkulator 3.0.

## Cechy charakterystyczne stylu (Prompt Base)
Kluczowe elementy, które muszą znaleźć się w każdym prompcie podczas generowania nowych grafik (narzędziem `generate_image`):

- **Baza i format:** "Modern premium thumbnail for [temat], high quality, UI/UX aesthetics, professional finance concept, exact 16:9 ratio, no text."
- **Motyw użyty w centrum:** "Sleek 3D [nazwa przedmiotu/ikony] icon" (np. chart, safe, hourglass, scales, piggy bank).
- **Styl i detale:** "glowing abstract charts, glassmorphism UI elements".
- **Tło i oświetlenie:** "dark solid background with vibrant neon [kolor1] and [kolor2] accents/gradients".

## Przykładowy Prompt
> "Modern premium thumbnail for an ETF investment calculator app. Sleek 3D graph with rising trend, glowing abstract charts, glassmorphism UI elements, dark background with vibrant neon blue and purple accents. High quality, UI/UX aesthetics, professional finance concept, no text."

## Dlaczego taki styl?
- **Glassmorphism i Ciemne Tło:** Idealnie współgrają z trybem ciemnym (Dark Mode), w który wyposażona jest cała strona (tailwind `dark:`).
- **Neony i Żywe Kolory:** Przyciągają uwagę użytkownika i wyglądają bardzo nowocześnie i profesjonalnie.
- **Efekty 3D:** Sprawiają, że interfejs wygląda na produkt premium i high-tech.
- **Brak tekstu (No Text):** Teksty często są źle generowane przez AI, a docelowo i tak nakładamy tytuł artykułu używając absolutnie pozycjonowanego tekstu w kodzie HTML.

## Kolorystyka i dopasowanie
Każde narzędzie / artykuł powinno operować własną parą neonowych kolorów (np. niebieski-fiolet, zielony-złoty, cyjan-magenta), aby użytkownik z łatwością mógł wzrokowo oddzielić od siebie poszczególne elementy.

_Ten plik służy asystentowi AI jako przypomnienie (Knowledge Item / Wytyczna) przy tworzeniu kolejnych materiałów graficznych z zachowaniem 100% spójności._
