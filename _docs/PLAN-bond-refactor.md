# Bond Calculator Refactor Plan

## Overview
Modernize `pages/kalkulator-obligacji.html` and its calculation logic to achieve complete parity with the premium ETF calculator. This includes porting the high-end UI (glassmorphism, dark mode, custom sliders), integrating the horizontal 'Scenario Comparison' carousel with the "peek effect", and implementing specific bond mechanics like the "Early Redemption" penalty.

## Project Type
**WEB** (Static HTML/JS Application)

## Success Criteria
1. UI is mathematically and visually identical in quality to the ETF calculator.
2. The Scenario Comparison carousel works perfectly on mobile (78vw constraint, solid borders, peek effect) and desktop.
3. Early redemption penalty logic is strictly implemented (0.70 PLN for COI, 2.00 PLN for EDO per bond).
4. Core inflation-indexed math remains 100% accurate.
5. Chart.js graphs correctly display Nominal vs. Real profit over time.
6. All required checks in Phase X pass successfully.

## Tech Stack
- **HTML5/Tailwind CSS** (for the structural UI and layout)
- **Vanilla JavaScript** (for calculation logic and DOM manipulation)
- **Chart.js** (for data visualization)

## File Structure Impacted
- `pages/kalkulator-obligacji.html` (Complete UI overhaul)
- `js/calculators/obligacje.js` -> `js/kalkulator-obligacji.js` (Major refactoring and modularization)
- `css/main.css` (Leveraging existing styles)

## Task Breakdown

### Task 1: UI/HTML Overhaul
- **Agent:** `frontend-specialist`
- **Skill:** `ui-ux-pro-max`, `frontend-design`
- **Priority:** P1
- **Description:** Migrate the HTML structure of `kalkulator-obligacji.html` to match the exact premium layout of the ETF calculator. Include the active inputs, range sliders, dark mode support, and the exact `#scenario-cards-container` structure for the carousel. Add a new UI control for "Wcześniejszy Wykup" (Early Redemption).
- **INPUT:** Current HTML + ETF HTML reference.
- **OUTPUT:** Fully responsive, styled HTML.
- **VERIFY:** Visually inspect to ensure no layout breakages in dark/light mode and mobile viewport.

### Task 2: JS Core Math & Penalty Logic Integration
- **Agent:** `backend-specialist` / `debugger`
- **Skill:** `clean-code`, `systematic-debugging`
- **Priority:** P1
- **Description:** Transplant the existing `obliczObligacje` logic into a new modular file structure. Add the Early Redemption penalty calculations: calculate the number of bonds purchased (capital / 100 PLN), apply the math logic, and substract penalties `(0.70 PLN COI, 2.00 PLN EDO)` if the redemption year is less than the maturity year.
- **INPUT:** Old `obligacje.js` math.
- **OUTPUT:** Clean, mathematically sound calculation functions.
- **VERIFY:** Compare outputs manually with official government bond calculators or spreadsheets for edge cases (early vs full term).

### Task 3: Scenario Management & Carousel Logic
- **Agent:** `frontend-specialist`
- **Skill:** `behavioral-modes`
- **Priority:** P2
- **Description:** Implement `localStorage` scenario saving. Generate cards dynamically with the exact mobile geometry (`w-[78vw]`, `max-w-[310px]`, `border-2 border-slate-200`) mapped from our recent ETF carousel refinements.
- **INPUT:** ETF scenario saving logic.
- **OUTPUT:** Interactive "Save Scenario" button and horizontal scroll UI.
- **VERIFY:** Save multiple scenarios and verify the mobile peek effect operates without squashing.

### Task 4: Interactive Data Visualization
- **Agent:** `frontend-specialist`
- **Skill:** `clean-code`
- **Priority:** P3
- **Description:** Wire the bond math outputs to a responsive Chart.js instance showing Nominal, Real, and Input Capital lines. Ensure `aspectRatio: 1.1` on mobile.
- **INPUT:** Calculation output arrays.
- **OUTPUT:** Rendering Chart.js canvas.
- **VERIFY:** Confirm the charts resize smoothly and labels update correctly on calculation changes.

## ✅ PHASE X: Verification Checklist
- Run Security Scan (check for exposed logic) `python .agent/scripts/security_scan.py .`
- Linting and Syntax Checks `python .agent/scripts/lint_runner.py .` (if available)
- UX/Accessibility manual review: ensure tap targets and contrast are accessible.
- Mathematical validation: Validate early withdrawal scenarios subtract correctly.
- Test responsive breakpoints (Desktop, Tablet, Mobile 320px).
- Socratic Gate was respected during creation.
