# PLAN-bond-etf-parity.md

## Overview
The goal is to achieve 100% UI and Feature parity between `kalkulator-obligacji.html` and `kalkulator-etf.html`. This ensures a seamless, consistent user experience across our financial tools. The update includes major structural changes (Nav, Footer, Newsletter), introducing dynamic monthly contributions, an educational layer for results, and a share functionality.

## Project Type
**WEB** (Vanilla JS, HTML/CSS, Tailwind)

## Success Criteria
1. The top navigation, newsletter banner, and footer in `kalkulator-obligacji.html` are visually identical and functionally matched with those in `kalkulator-etf.html`.
2. A 'Miesięczna dopłata' (Monthly Contribution) variable is integrated into bond valuation, simulating new bond cohorts each month that compound based on staggered holding periods.
3. The "Skąd wziął się ten wynik?" explanatory block accurately decodes the calculation steps, and tooltips define financial parameters like Belka Max, Inflation, and Early Penalties.
4. "Udostępnij wynik" successfully encodes input values into the `window.location.search` parameters and copies the URL to the user's clipboard.

## Tech Stack
- Frontend: HTML5, Tailwind CSS
- Logic: Vanilla JS (`js/kalkulator-obligacji.js`)
- Components: Shared styling patterns imported from `main.css` / ETF layout

## File Structure
- `pages/kalkulator-obligacji.html` (UI Structural Updates)
- `js/kalkulator-obligacji.js` (Monthly Cohort Math, Share Logic, Tooltips)

---

## Task Breakdown

### Task 1: Structural UI Components
- **Agent**: @frontend-specialist
- **Skill**: frontend-design, clean-code
- **Priority**: P2
- **Description**: Add exact HTML markup for Top Nav, Newsletter section, and Footer from the ETF page to the Bond calculator. Ensure active states and responsive behaviors are preserved.
- **INPUT**: `pages/kalkulator-etf.html` -> `<nav>`, `#newsletter-section`, `<footer>`
- **OUTPUT**: `pages/kalkulator-obligacji.html` with identical structure but active navigation pointing to "Kalkulator Obligacji".
- **VERIFY**: Check mobile responsiveness, active visual state, and working Newsletter form submission.

### Task 2: Core Math Feature - Monthly Contributions
- **Agent**: @backend-specialist & @debugger
- **Skill**: python-patterns / math-logic, javascript
- **Priority**: P1
- **Description**: Add 'Miesięczna dopłata' input to UI. Refactor `js/kalkulator-obligacji.js` to simulate monthly cohort bond purchases. Month 1 bonds hold for N years, Month 2 for N - (1/12) years, and so on.
- **INPUT**: `obliczWszystko()` logic in `js/kalkulator-obligacji.js`.
- **OUTPUT**: Staggered mathematical iteration array accurately producing real/nominal totals across separate bond cohorts.
- **VERIFY**: Verify against a manual test: $10,000 initial + $100 monthly for 10 years on EDO matches established staggered formulas.

### Task 3: The Educational Layer
- **Agent**: @ui-ux-pro-max
- **Skill**: frontend-design
- **Priority**: P2
- **Description**: Add the "Skąd wziął się ten wynik?" breakdown block underneath the results section. Include specific informational overlays (modals/tooltips) explaining concepts like "Podatek Belki" and "Kara za wcześniejszy wykup".
- **INPUT**: Empty spaces below the main result module in the HTML.
- **OUTPUT**: New HTML blocks implementing `edu-modal` from the ETF calculator and updating JS constants to serve bond-specific explanations.
- **VERIFY**: Clicking help icons opens the modal with the correct description; the breakdown section mathematically adds up.

### Task 4: Utility - Share Functionality
- **Agent**: @frontend-specialist
- **Skill**: frontend-design, clean-code
- **Priority**: P3
- **Description**: Add the 'Udostępnij wynik' button visually adjacent to 'Zapisz scenariusz'. Implement `shareResult()` logic leveraging `URLSearchParams` to encode parameters like `?kapital=...&doplata=...&horyzont=...` and write them to `navigator.clipboard`.
- **INPUT**: `js/kalkulator-obligacji.js` and HTML button mapping.
- **OUTPUT**: A functional Share button with transient UI feedback ("Skopiowano!").
- **VERIFY**: Clicking the button updates the clipboard, and opening the copied URL pre-loads the correct inputs.

---

## Phase X: Verification (Checklist)
- [ ] Run `python .agent/scripts/checklist.py .`
- [ ] Manual Math Sanity Check: Cohort timing for Monthly Contributions accurately handles early penalty edge cases per individual purchase.
- [ ] Visual Regression Check: Nav, Newsletter, and Footer look exactly like they do on ETF.
- [ ] Share Link Test: URL parameters correctly load upon page refresh.
