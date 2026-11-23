/**
 * SE 331 - Appliance Fault Diagnosis & Repair Cost Estimator
 * Member 2: Fault Diagnosis Engine
 * File: mock.js
 * 
 * Simulates incoming customer complaints from Member 1 (Customer Intake)
 * aligned with the Jamal's Appliance Care data schema (Alif's branch).
 * Provides localStorage persistence for Member 2 diagnosis history.
 */

const MockDatabase = (function() {
  const STORAGE_KEY = "se331_fault_diagnosis_history";

  // Customer complaints aligned with Member 1 (Alif) and assessment test scenarios
  const INCOMING_COMPLAINTS = [
    {
      id: "JAC-2026-001",
      customerId: "CUST-101",
      customerName: "Tanvir Ahmed",
      customerPhone: "01711223344",
      customerAddress: "House 24, Road 7, Sector 4, Uttara, Dhaka",
      applianceType: "Refrigerator",
      brand: "Walton",
      modelNumber: "WFD-1B6 (Direct Cool)",
      issueCategory: "Noise & Not Cooling",
      priority: "High",
      serviceType: "Home Visit",
      status: "Under Inspection",
      registeredDate: "2026-11-20 09:30 AM",
      symptoms: ["strange_noise", "not_cooling"],
      description: "Freezer compartment works slightly but lower food chamber is not cold at all. Making a loud rattling and clicking noise continuously since yesterday."
    },
    {
      id: "JAC-2026-002",
      customerId: "CUST-102",
      customerName: "Nusrat Jahan",
      customerPhone: "01822334455",
      customerAddress: "Flat 4B, Green Heritage, Dhanmondi 27, Dhaka",
      applianceType: "Washing Machine",
      brand: "Samsung",
      modelNumber: "EcoBubble 7kg Front-Load",
      issueCategory: "Water Leakage",
      priority: "Medium",
      serviceType: "Home Visit",
      status: "Pending",
      registeredDate: "2026-11-21 11:15 AM",
      symptoms: ["water_leak", "puddle_underneath"],
      description: "Every time the spin and drain cycle runs, there is water coming from the bottom of the washing machine flooding the laundry floor."
    },
    {
      id: "JAC-2026-003",
      customerId: "CUST-103",
      customerName: "Mohammad Rahim",
      customerPhone: "01933445566",
      customerAddress: "Block D, Road 3, Mirpur 12, Dhaka",
      applianceType: "Microwave Oven",
      brand: "Singer",
      modelNumber: "SMW20VM Solo 20L",
      issueCategory: "Sparking & Burning Odor",
      priority: "Urgent",
      serviceType: "Shop Drop-off",
      status: "Pending",
      registeredDate: "2026-11-22 02:20 PM",
      symptoms: ["sparks_arcing", "burning_smell"],
      description: "Sparks flying inside the cooking chamber near the mica cover plate with a burning plastic smell when heating starts."
    },
    {
      id: "JAC-2026-004",
      customerId: "CUST-104",
      customerName: "Farhana Islam",
      customerPhone: "01644556677",
      customerAddress: "Plot 12, Avenue 5, Banani, Dhaka",
      applianceType: "Refrigerator",
      brand: "LG",
      modelNumber: "Smart Inverter 260L No-Frost",
      issueCategory: "Power Failure / Dead",
      priority: "Urgent",
      serviceType: "Home Visit",
      status: "Pending",
      registeredDate: "2026-11-22 04:00 PM",
      symptoms: ["no_power", "dead_display"],
      description: "The refrigerator was working yesterday, now nothing turns on. Completely unresponsive with no interior light after thunderstorm power surge."
    },
    {
      id: "JAC-2026-005",
      customerId: "CUST-105",
      customerName: "Kamrul Hasan",
      customerPhone: "01555667788",
      customerAddress: "Ka-65/2, Shahjadpur, Gulshan-2, Dhaka",
      applianceType: "Microwave Oven",
      brand: "Haier",
      modelNumber: "HMW-20M1 Grill 20L",
      issueCategory: "Turntable Not Rotating",
      priority: "Low",
      serviceType: "Shop Drop-off",
      status: "Pending",
      registeredDate: "2026-11-23 10:45 AM",
      symptoms: ["turntable_stuck"],
      description: "Heats food properly but the glass roller tray does not spin, leaving food heated unevenly."
    },
    {
      id: "JAC-2026-006",
      customerId: "CUST-106",
      customerName: "Farzana Yasmin",
      customerPhone: "01788990011",
      customerAddress: "Road 10, Sector 11, Uttara, Dhaka",
      applianceType: "Washing Machine",
      brand: "Whirlpool",
      modelNumber: "FreshCare 8kg Front-Load",
      issueCategory: "Burning Smell & Smoke",
      priority: "Urgent",
      serviceType: "Home Visit",
      status: "Pending",
      registeredDate: "2026-11-23 11:30 AM",
      symptoms: ["burning_smell", "smoke_detected"],
      description: "Midway through the wash cycle, it smells like something burning and hot smoke came from the rear motor cabinet."
    },
    {
      id: "JAC-2026-007",
      customerId: "CUST-107",
      customerName: "Anonymous Customer",
      customerPhone: "01700000000",
      customerAddress: "Dhaka",
      applianceType: "Washing Machine",
      brand: "General",
      modelNumber: "Standard Washer",
      issueCategory: "Unspecified Error",
      priority: "Low",
      serviceType: "Shop Drop-off",
      status: "Pending",
      registeredDate: "2026-11-23 12:00 PM",
      symptoms: [],
      description: "Something doesn't feel right today. Please check."
    }
  ];

  /**
   * Retrieve all incoming complaints from Member 1 queue
   */
  function getIncomingComplaints() {
    return [...INCOMING_COMPLAINTS];
  }

  /**
   * Retrieve single complaint by ID
   */
  function getComplaintById(id) {
    return INCOMING_COMPLAINTS.find(c => c.id === id) || null;
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
    getIncomingComplaints,
    getSampleComplaints: getIncomingComplaints, // Backward-compatible alias
    getComplaintById,
    getDiagnosisHistory,
    saveDiagnosisHistory,
    clearDiagnosisHistory
  };
})();

// Support Browser global, Node.js, and ES Modules
if (typeof window !== "undefined") {
  window.MockDatabase = MockDatabase;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = MockDatabase;
}

export default MockDatabase;
export { MockDatabase };
