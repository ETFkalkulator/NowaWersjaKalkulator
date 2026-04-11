# Strategia wzrostu ETFkalkulator.pl — Design Doc

**Data:** 2026-04-06  
**Status:** Zatwierdzony przez właściciela

---

## Kontekst

ETFkalkulator.pl to bezpłatny serwis z kalkulatorami finansowymi dla polskich inwestorów detalicznych. Projekt ma być jednym z kilku pasywnych źródeł dochodu właściciela — nie wymaga osobistej marki ani bycia "twarzą projektu".

**Stan na 2026-04-06:**
- 5 kalkulatorów (ETF, obligacje, podatek Belki, FIRE, porównywarka)
- 15 artykułów blogowych
- ~kilkadziesiąt sesji miesięcznie (ruch głównie bezpośredni)
- Brak obecności w social media
- Brak programów afiliacyjnych

**Dostępny czas:** 8–10+ godzin tygodniowo  
**Cel monetyzacji:** Pasywny (afiliacja, ewentualnie reklamy)  
**Persona właściciela:** Anonimowa — działamy jako marka "ETFkalkulator", nie jako osoba

---

## Cel strategiczny

Doprowadzić serwis do **1000+ sesji organicznych miesięcznie** w ciągu 3–6 miesięcy, a następnie uruchomić pasywną monetyzację afiliacją. Projekt nie wymaga nowych funkcji przed promocją — produkt jest gotowy.

---

## Faza 1 — Dystrybucja brandowa (miesiąc 1–3)

**Cel:** Zdobyć pierwsze setki sesji przez aktywną dystrybucję w społecznościach.

### Konta do założenia (Tier 1)

| Platforma | Konto | Cel |
|---|---|---|
| Facebook | Strona "ETFkalkulator.pl" | Posty w grupach inwestorskich |
| Wykop | Konto brandowe lub neutralne | Aktywność w tagach #etf #inwestowanie |

### Konta do założenia (Tier 2, po uruchomieniu Tier 1)

| Platforma | Konto | Cel |
|---|---|---|
| Reddit | Konto neutralne | r/PolskaFinanse i podobne |
| Google Search Console | Właściciel domeny | Monitorowanie SEO |

### Strategia dystrybucji

- Dołącz do grup: "Inwestowanie w ETF Polska", "Dywidenda i FIRE Polska", "IKE/IKZE Polska"
- Taktyka: odpowiadaj na pytania w grupach, gdzie kalkulator lub artykuł jest naturalną odpowiedzią — nie spam, ale pomoc
- Każdy nowy artykuł = post na wszystkich kanałach Tier 1
- Częstotliwość: 2–3 posty tygodniowo łącznie

### Metryki sukcesu fazy 1
- 200+ sesji/miesiąc z social media
- Dołączenie do 5+ aktywnych grup

---

## Faza 2 — SEO i content (ciągłe, równolegle do fazy 1)

**Cel:** Zbudować autorytet SEO i dotrzeć do 1000 sesji organicznych miesięcznie.

### Priorytety contentowe

- Docelowo: 30–50 artykułów (teraz jest 15 — potrzeba 15–35 kolejnych)
- Frazy z długim ogonem: "czy warto kupić EDO w 2026", "IKE vs IKZE kalkulator", "jak obliczyć podatek Belki ETF"
- Każdy artykuł powinien linkować do co najmniej jednego kalkulatora

### Techniczne SEO

- Google Search Console — monitorowanie pozycji i błędów
- Sprawdzenie Core Web Vitals (Lighthouse)
- Upewnienie się że sitemap.xml jest aktualny po każdym artykule

---

## Faza 3 — Monetyzacja afiliacją (gdy ruch > 1000 sesji/mies.)

**Cel:** Uruchomić pasywny dochód z linków afiliacyjnych.

### Programy partnerskie do rejestracji (kolejność)

1. **XTB Partners** — największy polski broker, program partnerski, linki w artykułach o ETF i IKE
2. **Freedom24** — program afiliacyjny, artykuły o IKE/IKZE
3. **Finax** — robo-advisor, naturalny fit z kalkulatorem FIRE
4. **Bossa (DM BOŚ)** — broker obligacji, artykuły o EDO/COI

### Miejsca wdrożenia linków afiliacyjnych

- Artykuły "Gdzie otworzyć IKE 2026" i "Gdzie otworzyć IKZE 2026" (już istnieją — gotowe na linki)
- Kalkulator ETF — CTA "Otwórz konto i zacznij inwestować"
- Artykuły porównawcze ETF vs obligacje

### Szacowany potencjał

- XTB: ~100–300 zł za zarejestrowanego i aktywnego klienta
- Przy 1000 sesji/mies. i konwersji 0.5%: 5 rejestracji × 150 zł = ~750 zł/mies. (orientacyjnie)

---

## Czego NIE robimy

- Nie budujemy personal brandu właściciela
- Nie tworzymy nowych kalkulatorów przed osiągnięciem ruchu (produkt jest gotowy)
- Nie uruchamiamy monetyzacji przed progiem 1000 sesji/mies.
- Nie nagrywamy twarzy ani głosu

---

## Priorytety tygodniowe (propozycja)

| Czas | Aktywność |
|---|---|
| 2–3h | Dystrybucja: posty w grupach, odpowiedzi na pytania |
| 3–4h | Nowy artykuł SEO |
| 1–2h | Monitorowanie (GA4, Search Console) |
| 1h | Drobne poprawki techniczne |

---

## Następne kroki (implementacja)

1. Założenie konta Facebook (strona brandowa)
2. Dołączenie do grup inwestorskich
3. Założenie konta Wykop
4. Weryfikacja Google Search Console
5. Plan 5 kolejnych artykułów SEO
6. Rejestracja w programach afiliacyjnych (po osiągnięciu progu)
