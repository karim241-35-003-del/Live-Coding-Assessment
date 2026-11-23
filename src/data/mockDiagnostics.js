// Shared Mock Data & Cost Estimation Pricing Rules for Jamal's Appliance Repair
// Fully aligned with Member 1 (Customer Intake) & Member 2 (Rule-Based Diagnosis Engine)
// All currency benchmarks configured in Bangladeshi Taka (৳ BDT)

export const CURRENCY = {
  symbol: '৳',
  code: 'BDT',
  name: 'Bangladeshi Taka'
};

export const APPLIANCE_BENCHMARKS = {
  Refrigerator: {
    name: 'Refrigerator / Freezer',
    typicalReplacementValue: 75000,
    averageLifespanYears: 12,
    icon: '🧊',
    description: 'Compressor, sealed system, defrost heater & thermostat'
  },
  "Washing Machine": {
    name: 'Washing Machine',
    typicalReplacementValue: 60000,
    averageLifespanYears: 10,
    icon: '🧺',
    description: 'Drum bearings, drive belt, drain pump & suspension dampers'
  },
  Microwave: {
    name: 'Microwave Oven',
    typicalReplacementValue: 18000,
    averageLifespanYears: 7,
    icon: '⚡',
    description: 'Magnetron tube, waveguide cover, HV capacitor & microswitches'
  }
};

// Aliases for compatibility with both lowercase and title case
export const APPLIANCE_TYPES = [
  { id: 'Refrigerator', name: 'Refrigerator / Freezer', icon: '🧊', typicalReplacementValue: 75000, averageLifespanYears: 12 },
  { id: 'Washing Machine', name: 'Washing Machine', icon: '🧺', typicalReplacementValue: 60000, averageLifespanYears: 10 },
  { id: 'Microwave', name: 'Microwave Oven', icon: '⚡', typicalReplacementValue: 18000, averageLifespanYears: 7 }
];

export const SHOP_METRICS = {
  shopName: "Jamal's Appliance Care",
  subtitle: "Intake & Cost Estimation System",
  counterTerminal: "Terminal 01 — Counter Desk",
  intakeOfficer: "Service Specialist #104",
  currencySymbol: "৳",
  currencyCode: "BDT",
  hourlyBenchRate: 500,
  minDiagnosticInspectionFee: 500,
  disclaimerText: "This is an initial diagnostic cost estimate range in Bangladeshi Taka (৳ BDT), not a final fixed quote. Final repair cost will be confirmed after bench inspection before work begins.",
  berThresholdPercent: 50 // Beyond Economical Repair: if max repair > 50% replacement value
};

/**
 * Master Pricing & Risk Table mapped to Member 2's Diagnosis Engine output
 * All costs in Bangladeshi Taka (৳ BDT)
 */
export const FAULT_COST_DATABASE = {
  // --- DANGEROUS / SAFETY FAULTS (Member 2 Emergency Rules) ---
  "High-Voltage Arcing & Waveguide Breakdown": {
    appliance: "Microwave",
    minCost: 1800,
    maxCost: 4500,
    costVariance: 2700,
    replacementValue: 18000,
    isWorthRepairing: false,
    severity: "critical",
    repairTimeDays: 2,
    assistantWarningNote: "ALERT: Replacement microwave is ~৳18,000. A ৳4,000+ repair on an older microwave is rarely economical. Advise customer on Day 1!",
    partsNeeded: ["High Voltage Magnetron Tube", "Mica Waveguide Shield Cover", "Cavity Paint"]
  },
  "High-Voltage Transformer or Capacitor Burnout": {
    appliance: "Microwave",
    minCost: 2500,
    maxCost: 5500,
    costVariance: 3000,
    replacementValue: 18000,
    isWorthRepairing: false,
    severity: "critical",
    repairTimeDays: 3,
    assistantWarningNote: "BER HAZARD: High voltage transformer swap approaches new microwave price. Advise replacement.",
    partsNeeded: ["Step-up High Voltage Transformer (2200V)", "1.0uF HV Capacitor with Resistor"]
  },
  "Chassis Ground Fault / Live Current Leakage": {
    appliance: "Washing Machine",
    minCost: 2200,
    maxCost: 5500,
    costVariance: 3300,
    replacementValue: 60000,
    isWorthRepairing: true,
    severity: "critical",
    repairTimeDays: 2,
    assistantWarningNote: "Safety Priority: Full electrical insulation check mandatory before reconnecting.",
    partsNeeded: ["Tub Heating Element with NTC", "Chassis Ground Harness", "Terminal Block"]
  },
  "Drive Motor Burnout or Short-Circuited Wiring Harness": {
    appliance: "Washing Machine",
    minCost: 4500,
    maxCost: 9500,
    costVariance: 5000,
    replacementValue: 60000,
    isWorthRepairing: true,
    severity: "critical",
    repairTimeDays: 3,
    assistantWarningNote: "High variance: Can be simple stator capacitor (৳1,500) or complete direct-drive motor (৳9,500).",
    partsNeeded: ["Direct Drive Stator Assembly", "Wiring Harness", "Motor Control Board"]
  },
  "Compressor Relay Meltdown or Motor Winding Short": {
    appliance: "Refrigerator",
    minCost: 2500,
    maxCost: 8500,
    costVariance: 6000,
    replacementValue: 75000,
    isWorthRepairing: true,
    severity: "critical",
    repairTimeDays: 2,
    assistantWarningNote: "HIGH RISK: If relay melted (৳2,500), repair is viable. If compressor shorted to ground (৳8,500+), advise replacement.",
    partsNeeded: ["PTC Solid State Starter Relay", "Overload Thermostat", "Motor Terminal Plug"]
  },
  "Severe Electrical Short Circuit / Fire Hazard": {
    appliance: "Refrigerator",
    minCost: 3500,
    maxCost: 8800,
    costVariance: 5300,
    replacementValue: 75000,
    isWorthRepairing: true,
    severity: "critical",
    repairTimeDays: 3,
    assistantWarningNote: "Do not power on until bench tech opens control enclosure to inspect PCB traces.",
    partsNeeded: ["Main Inverter PCB", "Noise Filter Board", "Power Cord Harness"]
  },

  // --- REFRIGERATOR STANDARD FAULTS ---
  "Sealed System / Seized Compressor Failure": {
    appliance: "Refrigerator",
    minCost: 8500,
    maxCost: 16500,
    costVariance: 8000,
    replacementValue: 75000,
    isWorthRepairing: false,
    severity: "critical",
    repairTimeDays: 4,
    assistantWarningNote: "BER DANGER: Sealed system brazing and R600a charge exceeds 50% replacement value on older units.",
    partsNeeded: ["Embraco Sealed Compressor", "Filter Drier", "Refrigerant Charge", "Service Access Valve"]
  },
  "Evaporator Fan Motor or Compressor Relay Failure": {
    appliance: "Refrigerator",
    minCost: 2200,
    maxCost: 4500,
    costVariance: 2300,
    replacementValue: 75000,
    isWorthRepairing: true,
    severity: "moderate",
    repairTimeDays: 1,
    assistantWarningNote: "Safe economical repair. Bench test fan blade balance before ordering replacement motor.",
    partsNeeded: ["Evaporator Fan Motor DC 12V", "Fan Blade", "Rubber Mounting Bushing"]
  },
  "Blocked Defrost Drain Tube or Cracked Drain Pan": {
    appliance: "Refrigerator",
    minCost: 1200,
    maxCost: 2500,
    costVariance: 1300,
    replacementValue: 75000,
    repairTimeDays: 1,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["Drain Heater Extension Clip", "P-Trap Duckbill Grommet", "Hot Flushing Solution"],
    assistantWarningNote: "Low cost routine repair. Check duckbill grommet to prevent repeat callbacks."
  },
  "Main Electronic Control Board Failure or Blown Thermal Fuse": {
    appliance: "Refrigerator",
    minCost: 3800,
    maxCost: 7500,
    costVariance: 3700,
    replacementValue: 75000,
    isWorthRepairing: true,
    severity: "moderate",
    repairTimeDays: 2,
    partsNeeded: ["OEM Main Control PCB", "Thermal Cutoff Fuse"],
    assistantWarningNote: "Inspect compressor windings before installing new PCB; shorted compressor will blow new board."
  },
  "Defrost System Failure (Heating Element or Bi-Metal Thermostat)": {
    appliance: "Refrigerator",
    minCost: 2400,
    maxCost: 4800,
    costVariance: 2400,
    replacementValue: 75000,
    isWorthRepairing: true,
    severity: "moderate",
    repairTimeDays: 1,
    partsNeeded: ["Calrod Defrost Heating Rod", "Defrost Bi-Metal Thermostat", "Defrost Temperature Sensor"],
    assistantWarningNote: "Perform thermal continuity check on heating rod and defrost timer."
  },
  "Refrigerant Leak or Thermostat Temperature Sensor Failure": {
    appliance: "Refrigerator",
    minCost: 4200,
    maxCost: 9500,
    costVariance: 5300,
    replacementValue: 75000,
    isWorthRepairing: false,
    severity: "critical",
    partsNeeded: ["Electronic Leak Detection Dye", "Temperature Sensor NTC", "Schrader Port"],
    assistantWarningNote: "If leak is in internal foamed-in evaporator wall, unit is completely unrepairable (BER)."
  },
  "Condenser Fan Motor or Compressor Mounting Grommet Wear": {
    appliance: "Refrigerator",
    minCost: 1800,
    maxCost: 3600,
    costVariance: 1800,
    replacementValue: 75000,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["Condenser Cooling Fan Assembly", "Vibration Damper Rubber Grommets"],
    assistantWarningNote: "Economical repair. Clean condenser coils during reassembly."
  },

  // --- WASHING MACHINE STANDARD FAULTS ---
  "Damaged Tub Seal, Cracked Drain Pump, or Split Hose": {
    appliance: "Washing Machine",
    minCost: 1800,
    maxCost: 4200,
    costVariance: 2400,
    replacementValue: 60000,
    isWorthRepairing: true,
    severity: "moderate",
    partsNeeded: ["Front Door Rubber Boot Bellow", "Internal Siphon Hose", "Tub Clamp Band"],
    assistantWarningNote: "Inspect pump housing for hairline cracks caused by vibration."
  },
  "Blown Line Filter Fuse, Thermal Cutout, or Main PCB Failure": {
    appliance: "Washing Machine",
    minCost: 2800,
    maxCost: 6200,
    costVariance: 3400,
    replacementValue: 60000,
    isWorthRepairing: true,
    severity: "moderate",
    partsNeeded: ["Main Inverter Display PCB", "EMI Surge Suppression Filter", "Thermal Cutoff"],
    assistantWarningNote: "Verify line voltage stability before powering on replacement board."
  },
  "Clogged Drain Coin Trap or Seized Drain Pump Motor": {
    appliance: "Washing Machine",
    minCost: 1500,
    maxCost: 3500,
    costVariance: 2000,
    replacementValue: 60000,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["Magnetic Synchronous Drain Pump", "Lint Filter Basket Gasket"],
    assistantWarningNote: "If debris jammed impeller, labor only (৳1,500). If motor burned out, full pump swap (৳3,500)."
  },
  "Worn Drum Bearings or Broken Suspension Damper Rods": {
    appliance: "Washing Machine",
    minCost: 6500,
    maxCost: 12500,
    costVariance: 6000,
    replacementValue: 60000,
    isWorthRepairing: false,
    severity: "critical",
    partsNeeded: ["Rear Outer Tub with Pressed Bearings", "Tub Seal Kit", "Friction Damper Rods (Set of 4)"],
    assistantWarningNote: "BER ALERT: Full teardown required. Cost exceeds 50% replacement value on machines older than 5 years."
  },

  // --- MICROWAVE STANDARD FAULTS ---
  "Blown Primary Ceramic Fuse or Defective Door Interlock Switch": {
    appliance: "Microwave",
    minCost: 1100,
    maxCost: 2200,
    costVariance: 1100,
    replacementValue: 18000,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["20A 250V Ceramic Fast-Acting Fuse", "Primary Microswitch (Normally Open)"],
    assistantWarningNote: "Replace all 3 door switches if door bracket is misaligned to avoid blowing new fuse."
  },
  "Defective High-Voltage Magnetron or HV Rectifier Diode": {
    appliance: "Microwave",
    minCost: 2500,
    maxCost: 4800,
    costVariance: 2300,
    replacementValue: 18000,
    isWorthRepairing: false,
    severity: "critical",
    partsNeeded: ["Magnetron Emission Tube", "High Voltage Rectifier Diode (CL04-12)"],
    assistantWarningNote: "BER ALERT: Microwave replacement value is ~৳18,000. A ৳4,000+ repair on a 4+ year unit is rarely economical."
  },
  "Faulty Synchronous Turntable Motor or Stripped Drive Coupler": {
    appliance: "Microwave",
    minCost: 900,
    maxCost: 1900,
    costVariance: 1000,
    replacementValue: 18000,
    isWorthRepairing: true,
    severity: "minor",
    partsNeeded: ["21V Synchronous Turntable Motor", "Plastic Drive Roller Coupler", "Glass Plate Ring"],
    assistantWarningNote: "Fast 15-minute counter repair. Highly economical."
  },

  // Fallback
  "Undetermined Fault": {
    appliance: "General",
    minCost: 1500,
    maxCost: 5500,
    costVariance: 4000,
    replacementValue: 50000,
    isWorthRepairing: true,
    severity: "moderate",
    partsNeeded: ["General Diagnostic Inspection", "Multimeter Continuity Bench Test"],
    assistantWarningNote: "Vague customer description. Bench inspection strictly required before quote."
  }
};

/**
 * Helper to retrieve pricing metadata in Bangladeshi Taka (৳ BDT)
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
    minCost: 1800,
    maxCost: 5500,
    costVariance: 3700,
    replacementValue: bench.typicalReplacementValue,
    isWorthRepairing: true,
    severity: "moderate",
    repairTimeDays: 2,
    partsNeeded: ["Diagnostic Multimeter Inspection", "Sub-assembly Service"],
    assistantWarningNote: "Preliminary estimate range. Physical bench teardown required."
  };
}
