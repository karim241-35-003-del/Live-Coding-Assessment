# Jamal's Appliance Repair — Intake & Quote Guardrail System

An appliance repair shop intake assistant web application designed to protect counter margins, prevent fixed-quote traps, flag beyond-economical-repair (BER) units on Day 1, and generate non-binding counter intake receipts.

Developed as a modular 3-tier architecture for **SE 331 Live Coding Assessment**.

---

## 👥 Modular Team Architecture

| Module | Component | Team Role / Scope | Status |
| :--- | :--- | :--- | :--- |
| **Module 1** | `src/components/SymptomIntake.jsx` | **Member 1 (Scaffold)**: Appliance selection, customer vague complaint quick-pills, custom notes, and dynamic 2-3 triage follow-up questions. | Completed |
| **Module 2** | `src/components/FaultDiagnosis.jsx` | **Member 2 (Scaffold)**: Algorithmic fault scoring and triage engine, likelihood confidence badges, and Technician Intake Bench Card. | Completed |
| **Module 3** | `src/components/CostGuardrail.jsx` | **Member 3 (Lead / Core Focus - Arik)**: Cost to Guessing Risk Meter, Assistant Margin Risk Simulator, Day-1 BER Alert Banner, and Non-Binding Counter Receipt with mandatory acknowledgment. | Completed (Full Detail) |
| **Shared** | `src/data/mockDiagnostics.js` | Zero external APIs; comprehensive appliances, complaints, triage rules, faults, and shop metrics. | Completed |

---

## 🚀 Key Features (Module 3 Core - Cost Guardrails)

1. **"Cost to Guessing" Risk Meter & Range Estimator**:
   - Replaces single fixed price promises with a safe **Estimated Cost Range (`$min – $max`)**.
   - Visual risk meter tracks cost variance and confidence spread.
   - Highlights Jamal's golden counter rule: never quote a single figure before bench teardown.

2. **Interactive Assistant Guess Simulator / Margin Risk Calculator**:
   - Toggles between **Safe Range Quote** (0% margin loss) and **Risky Fixed Guess**.
   - Interactive slider allows simulating counter assistant guesses.
   - Real-time math shows unrecovered shop deficit if internal faults require higher-tier parts.

3. **"Day-1 Repair vs. Replace" (BER) Alert Banner**:
   - Compares maximum repair cost against brand-new and depreciated replacement value based on appliance age.
   - Triggers prominent red alert when repair exceeds 50% replacement value or if unit is beyond economical repair.
   - Includes Jamal's ready-to-read counter customer script.

4. **Non-Binding Customer Intake Slip & Counter Guardrail**:
   - Generates counter receipt with unique ticket ID (`#JAR-2026-XXXX`).
   - Mandatory counter acknowledgment checkbox before generating the receipt.
   - Includes explicit legal non-binding disclaimer clause.
   - Quick one-click "Print Official Slip" (with print-only media CSS) and "Copy Text Receipt".

---

## 🛠️ Tech Stack & Run Instructions

- **Framework**: React 18 + Vite
- **Icons**: Lucide React
- **Styling**: High-contrast, counter-friendly CSS with responsive layout and print stylesheets
- **Data**: Pure client-side mock data (`src/data/mockDiagnostics.js`)

### Development Server
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```
