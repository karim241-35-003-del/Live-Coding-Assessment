# Jamal's Appliance Care — Appliance Fault Diagnosis & Repair Cost Estimation System

A unified, professional, fully functional web application built for **Jamal's Appliance Care**, developed for the **SE 331 Live Coding Assessment**.

This repository unifies all 3 project modules into a single, cohesive, production-ready system:
- **Module 1 (Alif):** Customer Information & Complaint Collection System
- **Module 2 (Nahid):** Rule-Based Fault Diagnosis Engine & Safety Triage
- **Module 3 (Arik):** Cost Guardrail, Margin Risk Simulator & Repair Cost Estimation

---

## 👥 Integrated Team Architecture

| Module | Scope / Responsibility | Assigned Member | Route |
| :--- | :--- | :--- | :--- |
| **Module 1** | **Customer Information & Complaint Collection**: Professional auth, interactive dashboard, Bangladeshi mobile validation (`01XXXXXXXXX`), selectable appliance cards, customer directory with visual profiles, complaint pipeline with Kanban board & printable job cards. | **Member 1 (Alif)** | `/dashboard`, `/new-complaint`, `/customers`, `/complaints` |
| **Module 2** | **Fault Diagnosis Engine**: Rule-based fault evaluation, priority safety hazard detection (fire, sparks, smoke, shock), confidence scoring, and bench diagnostic recommendations. | **Member 2 (Nahid)** | `/diagnosis` |
| **Module 3** | **Cost Estimation & Quote Guardrails**: "Cost to Guessing" Risk Meter, Assistant Margin Risk Simulator, Day-1 BER Alert Banner, Non-Binding Counter Receipt with mandatory acknowledgment. | **Member 3 (Arik)** | `/cost-guardrail` |

---

## 🔐 Evaluator Login Credentials
- **Email:** `admin@jamal.com`
- **Password:** `admin123`
*(Includes a 1-click **"Auto-fill credentials"** button directly on the login card for assessment demonstrations.)*

---

## 🌟 Key Capabilities by Module

### Module 1: Customer Information & Complaint Collection (Alif)
1. **Authentication System:**
   - Branded shop header & repair wrench logo.
   - Show/hide password toggle, remember me checkbox, error alerts, and route guards.
2. **Operations Dashboard:**
   - 5 overview metric cards (Total Customers, Total Complaints, Refrigerator, Washing Machine, Microwave).
   - Appliance intake volume distribution bar.
   - Recent complaints table and newly registered customers list.
3. **Customer & Complaint Registration:**
   - Name, Bangladesh 11-digit mobile validation (`01XXXXXXXXX`), optional email validation, address.
   - Auto-generated registration timestamp.
   - Interactive selectable cards for Refrigerator, Washing Machine, and Microwave Oven.
   - Dynamic brands and fault categories tailored to household appliances.
4. **Graphical Customer Records:**
   - KPI metrics, filter pill tabs, and dual view modes (Visual Cards Grid vs. Data Table).
   - Direct call/email action links, appliance history tags, and linked ticket history.
5. **Complaint History & Kanban Pipeline:**
   - 4-stage interactive workflow filter tabs (Pending, Under Inspection, Repaired, Delivered).
   - Appliance category quick filter chips.
   - Kanban board with 1-click status advancement (`Start Diagnostic ➔`, `Mark Repaired ➔`, `Mark Delivered ➔`).
   - Printable Job Card / repair receipt with technician and customer signature lines.

### Module 2: Rule-Based Fault Diagnosis Engine (Nahid)
1. **Priority Safety Hazard Checks:** Evaluated first before standard rules (sparks, burning odor, electrical shock, smoke).
2. **Component Diagnostics:** Evaluates symptoms across Refrigerator, Washing Machine, and Microwave Oven.
3. **Automated Confidence Scoring & Recommendations:** Direct transition to Cost Guardrail.

### Module 3: Cost Guardrail & Quote Risk Engine (Arik)
1. **"Cost to Guessing" Risk Meter & Range Estimator:** Replaces fixed-quote traps with safe minimum/maximum range calculations.
2. **Interactive Assistant Guess Simulator:** Simulates shop margin deficit when guessing prices without bench teardown.
3. **"Day-1 Repair vs. Replace" (BER) Alert:** Alerts when repair cost exceeds 50% replacement value.
4. **Non-Binding Counter Intake Slip:** Generates printable counter receipts with explicit non-binding legal clauses.

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/karim241-35-003-del/Live-Coding-Assessment.git

# 2. Navigate to project folder
cd Live-Coding-Assessment

# 3. Ensure you are on the main branch
git checkout main

# 4. Install dependencies
npm install

# 5. Start the development server
npm run dev
```

The unified application will be live at: **`http://localhost:5173/`**

---

## 🛠️ Verification & Build Check
```bash
npm run build
```
Builds cleanly with zero errors across all integrated modules.
