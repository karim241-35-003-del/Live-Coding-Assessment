# Jamal's Appliance Care - Customer Information & Complaint Collection

A modern, fully functional web application built with **React.js + Vite** for **Jamal's Appliance Care**, serving as the **Customer Information & Complaint Collection** module within the Appliance Fault Diagnosis and Repair Cost Estimation System.

---

## 🛠️ Technology Stack
- **Framework:** React.js (v18) with Vite
- **Language:** JavaScript (ES6+) — *Strictly no TypeScript, PHP, or external server APIs*
- **State & Lifecycle:** React Hooks (`useState`, `useEffect`, `useContext`)
- **Navigation:** React Router DOM (v6) with Protected Routes
- **Icons:** Lucide React
- **Data Persistence:** Mock JavaScript database with `localStorage` persistence and synchronization
- **Styling:** Modern, responsive CSS3 with CSS variables, custom typography, and print-ready repair job card stylesheets

---

## 🔐 Credentials for Live Coding Evaluation
Use the following credentials on the login screen (or click the **Auto-fill credentials** helper button):
- **Email:** `admin@jamal.com`
- **Password:** `admin123`

---

## 🌟 Implemented Features

### 1. Authentication System
- **Login Screen:** Branded with shop name, repair wrench logo, and clean glassmorphism card.
- **Form Controls:** Email input, password input, **Show/Hide password toggle**, and **Remember me** checkbox.
- **Validation & Alerts:** Immediate inline form validation and clear alert boxes for invalid credentials.
- **Route Protection:** Protected dashboard and sub-routes with automatic redirect to `/login` for unauthenticated sessions.
- **Clean Separation:** Authentication state encapsulated within `AuthContext.jsx`.

### 2. Dashboard
- **5 Overview Stat Cards:**
  - **Total Customers**
  - **Total Complaints**
  - **Refrigerator Complaints**
  - **Washing Machine Complaints**
  - **Microwave Complaints**
- **Appliance Volume Distribution Bar:** Real-time percentage visualization of appliance fault intake.
- **Recent Complaints Table:** Interactive status badges, priority dots, and one-click job card inspection.
- **Latest Registered Customers:** Fast overview of recently onboarded customers.
- **Quick Action Button:** Instant shortcut to **Register New Complaint**.

### 3. Customer Information & Complaint Registration
- **Customer Information Fields:**
  - Full Name (required)
  - Phone Number (validated for **Bangladesh 11-digit mobile format**: `01XXXXXXXXX`)
  - Email Address (optional, format validated if provided)
  - Service / Residential Address (required)
  - **Registration Date & Time** (automatically generated live timestamp)
  - *Smart Auto-Fill:* Entering an existing registered phone number automatically pre-fills customer details.
- **Appliance Selection:**
  - **Interactive Selectable Cards** for **Refrigerator**, **Washing Machine**, and **Microwave Oven**.
  - Dynamic brand list tailored to Bangladeshi household appliances (Walton, Samsung, LG, Singer, Whirlpool, Haier, etc.) + custom brand option.
  - Model & serial number inputs.
  - Appliance-specific common fault categories (e.g., Not cooling, Water leakage, Drum not spinning, Sparking cavity, Turntable motor failure).
  - Priority / Urgency levels (Low, Medium, High, Urgent).
  - Service delivery preference: Home Visit / Technician Dispatch vs. Shop Counter Drop-off.
- **Instant Job Card Modal:** Generates unique ticket ID (`JAC-2026-XXX`) with one-click print and status update controls.

### 4. Customer Records Directory
- Search across customer names, phone numbers, addresses, and Customer IDs.
- Detailed customer profile drawer displaying total tickets logged and direct links to each complaint.

### 5. Complaint History & Status Tracking
- Comprehensive audit log of all complaints.
- Multi-dimensional filters: Search query, Appliance type, Stage status (Pending, Under Inspection, Repaired, Delivered), and Priority.
- Inline status dropdown updating `localStorage` records in real-time.
- **Printable Job Card / Repair Receipt:** Clean printable layout with shop details, customer info, defect summary, and physical signature lines for customer & technician.

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/karim241-35-003-del/Live-Coding-Assessment.git

# 2. Navigate to project folder
cd Live-Coding-Assessment

# 3. Switch to Alif branch
git checkout Alif

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev
```

The application will be live at: `http://localhost:5173/`

---

## 🌿 Git Branch
All code is developed and committed directly to the **`Alif`** branch.
