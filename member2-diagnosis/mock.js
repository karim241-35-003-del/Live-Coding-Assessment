/**
 * SE 331 - Appliance Fault Diagnosis & Repair Cost Estimator
 * Member 2: Fault Diagnosis Engine
 * File: mock.js
 * 
 * Acts as the mock database containing sample structured customer complaints
 * (simulating input from Member 1: Customer Intake) and provides localStorage
 * persistence for diagnosis records.
 */

const MockDatabase = (function() {
  const STORAGE_KEY = "se331_fault_diagnosis_history";

  // Pre-configured customer complaints representing real-world diagnostic scenarios
  const SAMPLE_COMPLAINTS = [
    {
      id: "CMP-REF-001",
      title: "Making noise + food is not cold",
      appliance: "Refrigerator",
      symptoms: ["strange_noise", "not_cooling"],
      description: "It has been making a loud rattling and clicking noise since yesterday, and the food inside the fridge compartment is not cold at all.",
      customerName: "Rahim Chowdhury",
      reportedAt: "2026-11-20T09:30:00Z"
    },
    {
      id: "CMP-WM-002",
      title: "Water coming from the bottom",
      appliance: "Washing Machine",
      symptoms: ["water_leak", "puddle_underneath"],
      description: "Every time the spin cycle runs, there is water coming from the bottom of the washing machine, flooding the laundry floor.",
      customerName: "Nusrat Jahan",
      reportedAt: "2026-11-21T14:15:00Z"
    },
    {
      id: "CMP-MIC-003",
      title: "Was working yesterday, now nothing",
      appliance: "Microwave",
      symptoms: ["no_power", "dead_display"],
      description: "The microwave was working yesterday, now nothing turns on when plugged in. Digital display is completely blank and dark.",
      customerName: "Tanvir Ahmed",
      reportedAt: "2026-11-22T11:00:00Z"
    },
    {
      id: "CMP-WM-004",
      title: "Smells like something burning",
      appliance: "Washing Machine",
      symptoms: ["burning_smell", "smoke_detected"],
      description: "Midway through the cycle, it smells like something burning and hot plastic smoke is coming from behind the unit.",
      customerName: "Farhana Akter",
      reportedAt: "2026-11-22T16:45:00Z"
    },
    {
      id: "CMP-MIC-005",
      title: "Sparks inside cooking chamber",
      appliance: "Microwave",
      symptoms: ["sparks_arcing", "strange_noise"],
      description: "Loud buzzing noise and violent electrical sparks flashing along the internal right wall whenever heating starts.",
      customerName: "Kamrul Islam",
      reportedAt: "2026-11-23T08:20:00Z"
    },
    {
      id: "CMP-REF-006",
      title: "Heavy frost buildup in freezer",
      appliance: "Refrigerator",
      symptoms: ["frost_buildup", "not_cooling"],
      description: "Thick ice and frost building up over the freezer coils, while the lower refrigerator section stays warm.",
      customerName: "Sadia Sultana",
      reportedAt: "2026-11-23T09:05:00Z"
    },
    {
      id: "CMP-VAG-007",
      title: "Vague Complaint / Insufficient Data",
      appliance: "Washing Machine",
      symptoms: [],
      description: "The machine doesn't feel right today. Please check.",
      customerName: "Anonymous User",
      reportedAt: "2026-11-23T10:00:00Z"
    }
  ];

  // Available symptom definitions categorized by appliance
  const SYMPTOM_CATALOG = {
    common: [
      { id: "no_power", label: "No Power / Completely Dead" },
      { id: "strange_noise", label: "Abnormal Noise (Rattling / Grinding)" },
      { id: "burning_smell", label: "Burning Smell (Plastic / Electrical)" },
      { id: "smoke_detected", label: "Visible Smoke / Fumes" },
      { id: "sparks_arcing", label: "Sparks or Electrical Arcing" },
      { id: "electric_shock", label: "Tingling / Electric Shock on Touch" }
    ],
    Refrigerator: [
      { id: "not_cooling", label: "Food Not Cold / Compartment Warm" },
      { id: "frost_buildup", label: "Excessive Frost / Ice Buildup" },
      { id: "water_leak", label: "Water Leaking From Bottom / Drain Pan" },
      { id: "clicking_sound", label: "Clicking Sound Near Compressor" },
      { id: "constant_running", label: "Motor Runs Constantly Without Cycling" }
    ],
    "Washing Machine": [
      { id: "water_leak", label: "Water Leaking from Bottom" },
      { id: "puddle_underneath", label: "Puddle Forming Underneath Unit" },
      { id: "no_drain", label: "Will Not Drain Water" },
      { id: "no_spin", label: "Drum Will Not Spin" },
      { id: "excessive_vibration", label: "Violent Shaking / Banging on Spin" },
      { id: "door_locked", label: "Door Latch Stuck / Won't Unlock" }
    ],
    Microwave: [
      { id: "no_heat", label: "Runs and Lights Up but Food Stays Cold" },
      { id: "dead_display", label: "Display Completely Dark / Buttons Unresponsive" },
      { id: "turntable_stuck", label: "Turntable Glass Plate Won't Turn" },
      { id: "loud_humming", label: "Extremely Loud Humming / Buzzing" }
    ]
  };

  /**
   * Fetch all preloaded customer complaints
   */
  function getSampleComplaints() {
    return [...SAMPLE_COMPLAINTS];
  }

  /**
   * Retrieve single complaint by ID
   */
  function getComplaintById(id) {
    return SAMPLE_COMPLAINTS.find(c => c.id === id) || null;
  }

  /**
   * Retrieve symptom catalog for an appliance (common + specific)
   */
  function getSymptomsForAppliance(appliance) {
    const common = SYMPTOM_CATALOG.common;
    const specific = SYMPTOM_CATALOG[appliance] || [];
    return [...common, ...specific];
  }

  /**
   * Retrieve diagnosis history from localStorage
   */
  function getDiagnosisHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("Failed to read diagnosis history from localStorage:", err);
      return [];
    }
  }

  /**
   * Save a newly calculated diagnosis into localStorage
   */
  function saveDiagnosisHistory(diagnosisRecord) {
    try {
      const history = getDiagnosisHistory();
      // Add unique session record id and timestamp if missing
      const record = {
        historyId: "HIST-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6),
        savedAt: new Date().toISOString(),
        ...diagnosisRecord
      };
      // Keep most recent 25 records
      history.unshift(record);
      if (history.length > 25) {
        history.length = 25;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      return record;
    } catch (err) {
      console.error("Failed to save diagnosis history to localStorage:", err);
      return diagnosisRecord;
    }
  }

  /**
   * Clear all stored diagnosis history from localStorage
   */
  function clearDiagnosisHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (err) {
      console.error("Failed to clear diagnosis history:", err);
      return false;
    }
  }

  return {
    getSampleComplaints,
    getComplaintById,
    getSymptomsForAppliance,
    getDiagnosisHistory,
    saveDiagnosisHistory,
    clearDiagnosisHistory
  };
})();

// Support Node.js environment for testing if applicable
if (typeof module !== "undefined" && module.exports) {
  module.exports = MockDatabase;
}
