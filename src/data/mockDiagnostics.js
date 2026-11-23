// Shared Mock Data & Cost Guardrail Pricing Rules for Jamal's Appliance Repair
// Fully aligned with Member 1 (Customer Intake) & Member 2 (Rule-Based Diagnosis Engine)

export const APPLIANCE_BENCHMARKS = {
  Refrigerator: {
    name: 'Refrigerator / Freezer',
    typicalReplacementValue: 750,
    averageLifespanYears: 12,
    icon: '🧊',
    description: 'Compressor, sealed system, defrost heater & thermostat'
  },
  "Washing Machine": {
    name: 'Washing Machine',
    typicalReplacementValue: 600,
    averageLifespanYears: 10,
    icon: '🧺',
    description: 'Drum bearings, drive belt, drain pump & suspension dampers'
  },
  Microwave: {
    name: 'Microwave Oven',
    typicalReplacementValue: 180,
    averageLifespanYears: 7,
    icon: '⚡',
    description: 'Magnetron tube, waveguide cover, HV capacitor & microswitches'
  }
};

// Aliases for compatibility with both lowercase and title case
export const APPLIANCE_TYPES = [
  { id: 'Refrigerator', name: 'Refrigerator / Freezer', icon: '🧊', typicalReplacementValue: 750, averageLifespanYears: 12 },
  { id: 'Washing Machine', name: 'Washing Machine', icon: '🧺', typicalReplacementValue: 600, averageLifespanYears: 10 },
  { id: 'Microwave', name: 'Microwave Oven', icon: '⚡', typicalReplacementValue: 180, averageLifespanYears: 7 }
];

export const SHOP_METRICS = {
  shopName: "Jamal's Appliance Repair",
  subtitle: "Intake & Quote Guardrail System",
  counterTerminal: "Terminal 01 — Counter Desk",
  intakeOfficer: "Service Specialist #104",
  hourlyBenchRate: 65,
  minDiagnosticInspectionFee: 35,
  disclaimerText: "This is an initial diagnostic estimate range, not a final fixed quote. Final repair cost will be confirmed after bench inspection before work begins.",
  berThresholdPercent: 50 // Beyond Economical Repair: if max repair > 50% replacement value
};

/**
 * Master Pricing & Risk Table mapped to Member 2's Diagnosis Engine output
 * Maps each likelyFault string directly to cost range, parts, and BER rules.
 */
export const FAULT_COST_DATABASE = {
  // --- DANGEROUS / SAFETY FAULTS (Member 2 Emergency Rules) ---
  "High-Voltage Arcing & Waveguide Breakdown": {
    appliance: "Microwave",
    minCost: 85,
    maxCost: 155,
    costVariance: 70,
    replacementValue: 180,
    isWorthRepairing: false,
    severity: "critical",
    repairTimeDays: 2,
    assistantWarningNote: "ALERT: Replacement microwave is ~$180. A $130+ repair on an older microwave is rarely economical. Advise customer on Day 1!",
    partsNeeded: ["High Voltage Magnetron Tube", "Mica Waveguide Shield Cover", "Cavity Paint"]
  },
  "High-Voltage Transformer or Capacitor Burnout": {
    appliance: "Microwave",
    minCost: 110,
    maxCost: 175,
    costVariance: 65,
    replacementValue: 180,
    isWorthRepairing: false,
    severity: "critical",
    repairTimeDays: 3,
    assistantWarningNote: "BER HAZARD: High voltage transformer swap approaches new microwave price. Advise replacement.",
    partsNeeded: ["Step-up High Voltage Transformer (2200V)", "1.0uF HV Capacitor with Resistor"]
  },
  "Chassis Ground Fault / Live Current Leakage": {
    appliance: "Washing Machine",
    minCost: 95,
    maxCost: 180,
    costVariance: 85,
    replacementValue: 600,
    isWorthRepairing: true,
    severity: "critical",
    repairTimeDays: 2,
    assistantWarningNote: "Safety Priority: Full electrical insulation check mandatory before reconnecting.",
    partsNeeded: ["Tub Heating Element with NTC", "Chassis Ground Harness", "Terminal Block"]
  },
  "Drive Motor Burnout or Short-Circuited Wiring Harness": {
    appliance: "Washing Machine",
    minCost: 160,
    maxCost: 280,
    costVariance: 120,
    replacementValue: 600,
    isWorthRepairing: true,
    severity: "critical",
    repairTimeDays: 3,
    assistantWarningNote: "High variance: Can be simple stator capacitor ($65) or complete direct-drive motor ($280).",
    partsNeeded: ["Direct Drive Stator Assembly", "Wiring Harness", "Motor Control Board"]
  },
  "Compressor Relay Meltdown or Motor Winding Short": {
    appliance: "Refrigerator",
    minCost: 90,
    maxCost: 320,
    costVariance: 230,
    replacementValue: 750,
    isWorthRepairing: true,
    severity: "critical",
    repairTimeDays: 2,
    assistantWarningNote: "HIGH RISK: If relay melted ($90), repair is viable. If compressor shorted to ground ($320+), advise replacement.",
    partsNeeded: ["PTC Solid State Starter Relay", "Overload Thermostat", "Motor Terminal Plug"]
  },
  "Severe Electrical Short Circuit / Fire Hazard": {
    appliance: "Refrigerator",
    minCost: 120,
    maxCost: 290,
    costVariance: 170,
    replacementValue: 750,
    isWorthRepairing: true,
    severity: "critical",
    repairTimeDays: 3,
    assistantWarningNote: "Do not power on until bench tech opens control enclosure to inspect PCB traces.",
    partsNeeded: ["Main Inverter PCB", "Noise Filter Board", "Power Cord Harness"]
  },

  // --- REFRIGERATOR STANDARD FAULTS ---
  "Sealed System / Seized Compressor Failure": {
    appliance: "Refrigerator",
    minCost: 280,
    maxCost: 480,
    costVariance: 200,
    replacementValue: 750,
    isWorthRepairing: false,
    severity: "critical",
    repairTimeDays: 4,
    assistantWarningNote: "BER DANGER: Sealed system brazing and R600a charge exceeds 50% replacement value on older units.",
    partsNeeded: ["Embraco Sealed Compressor", "Filter Drier", "Refrigerant Charge", "Service Access Valve"]
  },
  "Evaporator Fan Motor or Compressor Relay Failure": {
    appliance: "Refrigerator",
    minCost: 75,
    maxCost: 140,
    costVariance: 65,
    replacementValue: 750,
    isWorthRepairing: true,
    severity: "moderate",
    repairTimeDays: 1,
    assistantWarningNote: "Safe economical repair. Bench test fan blade balance before ordering replacement motor.",
    partsNeeded: ["Evaporator Fan Motor DC 12V", "Fan Blade", "Rubber Mounting Bushing"]
  },
  "Blocked Defrost Drain Tube or Cracked Drain Pan": {
    appliance: "Refrigerator",
    minCost: 45,
    maxCost: 85,
    costVariance: 40,
    replacementValue: 750,
    repairTimeDays: 1,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["Drain Heater Extension Clip", "P-Trap Duckbill Grommet", "Hot Flushing Solution"],
    assistantWarningNote: "Low cost routine repair. Check duckbill grommet to prevent repeat callbacks."
  },
  "Main Electronic Control Board Failure or Blown Thermal Fuse": {
    appliance: "Refrigerator",
    minCost: 130,
    maxCost: 230,
    costVariance: 100,
    replacementValue: 750,
    isWorthRepairing: true,
    severity: "moderate",
    repairTimeDays: 2,
    partsNeeded: ["OEM Main Control PCB", "Thermal Cutoff Fuse"],
    assistantWarningNote: "Inspect compressor windings before installing new PCB; shorted compressor will blow new board."
  },
  "Defrost System Failure (Heating Element or Bi-Metal Thermostat)": {
    appliance: "Refrigerator",
    minCost: 80,
    maxCost: 150,
    costVariance: 70,
    replacementValue: 750,
    isWorthRepairing: true,
    severity: "moderate",
    repairTimeDays: 1,
    partsNeeded: ["Calrod Defrost Heating Rod", "Defrost Bi-Metal Thermostat", "Defrost Temperature Sensor"],
    assistantWarningNote: "Perform thermal continuity check on heating rod and defrost timer."
  },
  "Refrigerant Leak or Thermostat Temperature Sensor Failure": {
    appliance: "Refrigerator",
    minCost: 140,
    maxCost: 310,
    costVariance: 170,
    replacementValue: 750,
    isWorthRepairing: false,
    severity: "critical",
    partsNeeded: ["Electronic Leak Detection Dye", "Temperature Sensor NTC", "Schrader Port"],
    assistantWarningNote: "If leak is in internal foamed-in evaporator wall, unit is completely unrepairable (BER)."
  },
  "Condenser Fan Motor or Compressor Mounting Grommet Wear": {
    appliance: "Refrigerator",
    minCost: 65,
    maxCost: 120,
    costVariance: 55,
    replacementValue: 750,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["Condenser Cooling Fan Assembly", "Vibration Damper Rubber Grommets"],
    assistantWarningNote: "Economical repair. Clean condenser coils during reassembly."
  },

  // --- WASHING MACHINE STANDARD FAULTS ---
  "Damaged Tub Seal, Cracked Drain Pump, or Split Hose": {
    appliance: "Washing Machine",
    minCost: 65,
    maxCost: 140,
    costVariance: 75,
    replacementValue: 600,
    isWorthRepairing: true,
    severity: "moderate",
    partsNeeded: ["Front Door Rubber Boot Bellow", "Internal Siphon Hose", "Tub Clamp Band"],
    assistantWarningNote: "Inspect pump housing for hairline cracks caused by vibration."
  },
  "Blown Line Filter Fuse, Thermal Cutout, or Main PCB Failure": {
    appliance: "Washing Machine",
    minCost: 90,
    maxCost: 195,
    costVariance: 105,
    replacementValue: 600,
    isWorthRepairing: true,
    severity: "moderate",
    partsNeeded: ["Main Inverter Display PCB", "EMI Surge Suppression Filter", "Thermal Cutoff"],
    assistantWarningNote: "Verify line voltage stability before powering on replacement board."
  },
  "Clogged Drain Coin Trap or Seized Drain Pump Motor": {
    appliance: "Washing Machine",
    minCost: 50,
    maxCost: 110,
    costVariance: 60,
    replacementValue: 600,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["Magnetic Synchronous Drain Pump", "Lint Filter Basket Gasket"],
    assistantWarningNote: "If debris jammed impeller, labor only ($50). If motor burned out, full pump swap ($110)."
  },
  "Worn Drum Bearings or Broken Suspension Damper Rods": {
    appliance: "Washing Machine",
    minCost: 220,
    maxCost: 380,
    costVariance: 160,
    replacementValue: 600,
    isWorthRepairing: false,
    severity: "critical",
    partsNeeded: ["Rear Outer Tub with Pressed Bearings", "Tub Seal Kit", "Friction Damper Rods (Set of 4)"],
    assistantWarningNote: "BER ALERT: Full teardown required. Cost exceeds 50% replacement value on machines older than 5 years."
  },

  // --- MICROWAVE STANDARD FAULTS ---
  "Blown Primary Ceramic Fuse or Defective Door Interlock Switch": {
    appliance: "Microwave",
    minCost: 40,
    maxCost: 75,
    costVariance: 35,
    replacementValue: 180,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["20A 250V Ceramic Fast-Acting Fuse", "Primary Microswitch (Normally Open)"],
    assistantWarningNote: "Replace all 3 door switches if door bracket is misaligned to avoid blowing new fuse."
  },
  "Defective High-Voltage Magnetron or HV Rectifier Diode": {
    appliance: "Microwave",
    minCost: 85,
    maxCost: 145,
    costVariance: 60,
    replacementValue: 180,
    isWorthRepairing: false,
    severity: "critical",
    partsNeeded: ["Magnetron Emission Tube", "High Voltage Rectifier Diode (CL04-12)"],
    assistantWarningNote: "BER ALERT: Microwave replacement value is ~$180. A $130 repair on a 4+ year unit is rarely economical."
  },
  "Faulty Synchronous Turntable Motor or Stripped Drive Coupler": {
    appliance: "Microwave",
    minCost: 35,
    maxCost: 65,
    costVariance: 30,
    replacementValue: 180,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["21V Synchronous Turntable Motor", "Plastic Drive Roller Coupler", "Glass Plate Ring"],
    assistantWarningNote: "Fast 15-minute counter repair. Highly economical."
  },

  // Fallback
  "Undetermined Fault": {
    appliance: "General",
    minCost: 45,
    maxCost: 180,
    costVariance: 135,
    replacementValue: 500,
    isWorthRepairing: true,
    severity: "moderate",
    partsNeeded: ["General Diagnostic Inspection", "Multimeter Continuity Bench Test"],
    assistantWarningNote: "Vague customer description. Bench inspection strictly required before quote."
  }
};

/**
 * Helper to retrieve pricing metadata for a given diagnosis or fault name
 */
export function getCostDataForDiagnosis(diagnosisOrFaultName, applianceName = 'Refrigerator') {
  let faultName = '';
  let appName = applianceName;

  if (typeof diagnosisOrFaultName === 'string') {
    faultName = diagnosisOrFaultName;
  } else if (diagnosisOrFaultName && typeof diagnosisOrFaultName === 'object') {
    faultName = diagnosisOrFaultName.likelyFault || diagnosisOrFaultName.faultName || '';
    if (diagnosisOrFaultName.appliance) {
      appName = diagnosisOrFaultName.appliance;
    }
  }

  // Exact match
  if (FAULT_COST_DATABASE[faultName]) {
    return { ...FAULT_COST_DATABASE[faultName], faultName };
  }

  // Fuzzy match
  const lowerFault = faultName.toLowerCase();
  for (const [key, val] of Object.entries(FAULT_COST_DATABASE)) {
    if (key.toLowerCase().includes(lowerFault) || lowerFault.includes(key.toLowerCase())) {
      return { ...val, faultName: key };
    }
  }

  // Default fallback based on appliance
  const bench = APPLIANCE_BENCHMARKS[appName] || APPLIANCE_BENCHMARKS.Refrigerator;
  return {
    faultName: faultName || "Standard Mechanical / Electrical Diagnostic",
    appliance: appName,
    minCost: 55,
    maxCost: 190,
    costVariance: 135,
    replacementValue: bench.typicalReplacementValue,
    isWorthRepairing: true,
    severity: "moderate",
    repairTimeDays: 2,
    partsNeeded: ["Diagnostic Multimeter Inspection", "Sub-assembly Service"],
    assistantWarningNote: "Preliminary estimate range. Physical bench teardown required."
  };
}
