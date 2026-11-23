/**
 * SE 331 - Appliance Fault Diagnosis & Repair Cost Estimator
 * Member 2: Fault Diagnosis Engine
 * File: diagnosisEngine.js
 * 
 * Implements the Rule-Based Fault Diagnosis Engine.
 * Analyzes appliance type, symptoms array, and free-text customer description keywords.
 * Prioritizes safety checks for dangerous faults (burn, smoke, sparks, shock).
 * Outputs a standardized structured object ready for Member 3 (Cost Estimator).
 */

const DiagnosisEngine = (function() {
  /**
   * Helper function to detect presence of keywords in normalized text
   */
  function containsKeywords(text, keywords) {
    if (!text || typeof text !== "string") return false;
    const lower = text.toLowerCase();
    return keywords.some(keyword => {
      if (keyword instanceof RegExp) {
        return keyword.test(lower);
      }
      return lower.includes(keyword.toLowerCase());
    });
  }

  /**
   * Helper function to detect presence of any symptom ID in array
   */
  function containsSymptom(symptoms, targetList) {
    if (!Array.isArray(symptoms)) return false;
    return targetList.some(target => symptoms.includes(target));
  }

  /**
   * Priority Safety Rules: Evaluated FIRST before any standard diagnostic rule
   */
  function checkPrioritySafety(appliance, symptoms, description) {
    const text = description || "";

    const hasBurningKeyword = containsKeywords(text, [
      "burn", "burning", "burnt", "smell like burning", "smells like something burning",
      "burning smell", "charred", "melted", "melting plastic", "hot smell"
    ]);
    const hasSmokeKeyword = containsKeywords(text, ["smoke", "smoking", "fumes", "puff of smoke"]);
    const hasSparksKeyword = containsKeywords(text, ["spark", "sparks", "sparking", "arcing", "flame", "fire", "popping noise and sparks"]);
    const hasShockKeyword = containsKeywords(text, ["shock", "shocks", "shocking", "electric shock", "tingling"]);

    const isBurn = hasBurningKeyword || containsSymptom(symptoms, ["burning_smell"]);
    const isSmoke = hasSmokeKeyword || containsSymptom(symptoms, ["smoke_detected"]);
    const isSparks = hasSparksKeyword || containsSymptom(symptoms, ["sparks_arcing"]);
    const isShock = hasShockKeyword || containsSymptom(symptoms, ["electric_shock"]);

    if (!isBurn && !isSmoke && !isSparks && !isShock) {
      return null; // No immediate safety hazard detected
    }

    // Critical safety alert detected: build emergency fault profile
    const warning = "CRITICAL SAFETY HAZARD: DO NOT OPERATE / UNPLUG IMMEDIATELY! Severe risk of electrical fire or lethal electric shock.";

    if (appliance === "Microwave") {
      if (isSparks) {
        return {
          faultId: "FLT-MIC-SAFE-01",
          likelyFault: "High-Voltage Arcing & Waveguide Breakdown",
          possibleCauses: [
            "Burnt, greasy, or carbonized mica waveguide coverplate",
            "Damaged magnetron antenna dome arcing against chassis",
            "Interior cavity paint peeling exposing bare reflective metal",
            "Metallic object or improper cookware inside cooking chamber"
          ],
          confidenceScore: 95,
          confidenceLevel: "High",
          confidence: "95% (High)",
          isDangerous: true,
          safetyWarning: warning,
          recommendation: "UNPLUG IMMEDIATELY. Stop using the microwave. Do not attempt DIY operation. A certified high-voltage technician must replace the waveguide cover and inspect magnetron RF shielding."
        };
      }
      return {
        faultId: "FLT-MIC-SAFE-02",
        likelyFault: "High-Voltage Transformer or Capacitor Burnout",
        possibleCauses: [
          "Shorted secondary high-voltage transformer winding",
          "Ruptured oil-filled high-voltage filter capacitor",
          "Seized cooling blower fan causing extreme overheating"
        ],
        confidenceScore: 92,
        confidenceLevel: "High",
        confidence: "92% (High)",
        isDangerous: true,
        safetyWarning: warning,
        recommendation: "UNPLUG IMMEDIATELY. Microwave high-voltage capacitors store up to 4,000V even when unplugged. Do not open housing without high-voltage discharge equipment."
      };
    }

    if (appliance === "Washing Machine") {
      if (isShock) {
        return {
          faultId: "FLT-WM-SAFE-01",
          likelyFault: "Chassis Ground Fault / Live Current Leakage",
          possibleCauses: [
            "Water heating element insulation cracked, leaking current to drum",
            "Loose or corroded protective earth ground wire on chassis",
            "Moisture ingress onto motor terminal block connector"
          ],
          confidenceScore: 95,
          confidenceLevel: "High",
          confidence: "95% (High)",
          isDangerous: true,
          safetyWarning: warning,
          recommendation: "DO NOT TOUCH WITH BARE HANDS. Turn off main circuit breaker or unplug from wall using dry insulated gloves. A licensed electrician must verify earthing and insulation."
        };
      }
      return {
        faultId: "FLT-WM-SAFE-02",
        likelyFault: "Drive Motor Burnout or Short-Circuited Wiring Harness",
        possibleCauses: [
          "Seized drive motor drawing excessive locked-rotor current",
          "Worn drive belt slipping continuously and burning against motor pulley",
          "Chafed wiring harness rubbing against vibrating steel cabinet"
        ],
        confidenceScore: 90,
        confidenceLevel: "High",
        confidence: "90% (High)",
        isDangerous: true,
        safetyWarning: warning,
        recommendation: "UNPLUG IMMEDIATELY and turn off water supply valves. Do not leave unattended. Technician must check motor winding insulation and inspect drive belt."
      };
    }

    if (appliance === "Refrigerator") {
      return {
        faultId: "FLT-REF-SAFE-01",
        likelyFault: "Compressor Relay Meltdown or Motor Winding Short",
        possibleCauses: [
          "Overheated PTC start relay / thermistor melting plastic casing",
          "Internal compressor motor electrical short circuit",
          "Defrost heating element overheating due to failed safety thermostat"
        ],
        confidenceScore: 91,
        confidenceLevel: "High",
        confidence: "91% (High)",
        isDangerous: true,
        safetyWarning: warning,
        recommendation: "UNPLUG IMMEDIATELY. Keep refrigerator doors firmly closed to retain cool air temporarily. Schedule an urgent service visit to replace relay and verify motor windings."
      };
    }

    // Generic danger fallback
    return {
      faultId: "FLT-GEN-SAFE-01",
      likelyFault: "Severe Electrical Short Circuit / Fire Hazard",
      possibleCauses: [
        "Internal power wire insulation breakdown",
        "Overheated electrical connector / terminal block",
        "Component breakdown creating direct line-to-neutral short"
      ],
      confidenceScore: 90,
      confidenceLevel: "High",
      confidence: "90% (High)",
      isDangerous: true,
      safetyWarning: warning,
      recommendation: "UNPLUG IMMEDIATELY. Do not turn the appliance on under any circumstances until an appliance technician completes an electrical safety inspection."
    };
  }

  /**
   * Diagnostic Rules for Refrigerator
   */
  function diagnoseRefrigerator(symptoms, description) {
    const text = description || "";

    const isNoisy = containsSymptom(symptoms, ["strange_noise", "clicking_sound"]) ||
      containsKeywords(text, ["noise", "noisy", "rattling", "clicking", "humming", "buzzing", "making a noise", "sound"]);
    
    const isNotCold = containsSymptom(symptoms, ["not_cooling"]) ||
      containsKeywords(text, ["not cold", "food is not cold", "warm", "not cooling", "food spoiling", "spoiling", "stays warm", "lukewarm"]);

    const isLeaking = containsSymptom(symptoms, ["water_leak"]) ||
      containsKeywords(text, ["water coming from the bottom", "water coming from bottom", "water", "bottom", "puddle", "leak", "leaking", "drain", "ice maker leak"]);

    const isDead = containsSymptom(symptoms, ["no_power"]) ||
      containsKeywords(text, ["was working yesterday, now nothing", "now nothing", "dead", "no power", "won't turn on", "not working at all", "completely off"]);

    const isFrostBuildup = containsSymptom(symptoms, ["frost_buildup"]) ||
      containsKeywords(text, ["frost", "ice buildup", "frost buildup", "freezer iced up", "thick ice", "coils covered"]);

    // Test Case: "making a noise + food is not cold"
    if (isNoisy && isNotCold) {
      return {
        faultId: "FLT-REF-001",
        likelyFault: "Evaporator Fan Motor or Compressor Relay Failure",
        possibleCauses: [
          "Evaporator fan motor bearing worn or fan blade hitting frost buildup",
          "Failed compressor start relay (PTC thermistor) causing intermittent clicking",
          "Compressor motor overheating without circulating refrigerant",
          "Choked condenser coils restricting heat rejection"
        ],
        confidenceScore: 88,
        confidenceLevel: "High",
        confidence: "88% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Remove freezer rear panel to inspect evaporator fan operation and frost pattern. Test compressor start relay with a multimeter for continuity, and clean dust from condenser coils."
      };
    }

    // Test Case: "water coming from the bottom"
    if (isLeaking) {
      return {
        faultId: "FLT-REF-002",
        likelyFault: "Blocked Defrost Drain Tube or Cracked Drain Pan",
        possibleCauses: [
          "Defrost drain tube frozen or clogged with algae/dust, overflowing to bottom",
          "Cracked plastic condensation evaporator pan underneath compressor",
          "Damaged water inlet valve or loose water filter tubing"
        ],
        confidenceScore: 85,
        confidenceLevel: "High",
        confidence: "85% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Flush defrost drain hole with warm water and a flexible brush. Inspect the condensation drip pan located at the bottom rear for cracks or misalignment."
      };
    }

    // Test Case: "was working yesterday, now nothing"
    if (isDead) {
      return {
        faultId: "FLT-REF-003",
        likelyFault: "Main Electronic Control Board Failure or Blown Thermal Fuse",
        possibleCauses: [
          "AC power line voltage spike destroyed main PCB power regulation circuit",
          "Blown internal thermal safety fuse on wiring harness",
          "Defective cold control thermostat or faulty door interlock switch"
        ],
        confidenceScore: 82,
        confidenceLevel: "High",
        confidence: "82% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Verify wall socket has active voltage using a meter. Check power cord continuity and inspect the main electronic control board on the rear/top for burned resistors or capacitors."
      };
    }

    // Heavy frost buildup
    if (isFrostBuildup) {
      return {
        faultId: "FLT-REF-004",
        likelyFault: "Defrost System Failure (Heating Element or Bi-Metal Thermostat)",
        possibleCauses: [
          "Burnt out radiant defrost heating element beneath evaporator",
          "Open bi-metal defrost termination thermostat",
          "Failed electronic defrost control board or mechanical defrost timer"
        ],
        confidenceScore: 86,
        confidenceLevel: "High",
        confidence: "86% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Manually defrost freezer. Test defrost heater resistance with an ohmmeter (standard: 20-50 ohms). Test continuity of bi-metal thermostat when frozen below 0°C."
      };
    }

    // Only not cold
    if (isNotCold) {
      return {
        faultId: "FLT-REF-005",
        likelyFault: "Refrigerant Leak or Thermostat Temperature Sensor Failure",
        possibleCauses: [
          "Slow sealed system refrigerant leak (low freon/R600a charge)",
          "Faulty thermistor / temperature sensor sending wrong resistance to PCB",
          "Damaged magnetic door gasket allowing warm ambient air leakage"
        ],
        confidenceScore: 75,
        confidenceLevel: "Medium",
        confidence: "75% (Medium)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Inspect door rubber seal using dollar bill friction test. Technician must connect service manifold gauges to measure refrigerant suction and discharge pressures."
      };
    }

    // Only noisy
    if (isNoisy) {
      return {
        faultId: "FLT-REF-006",
        likelyFault: "Condenser Fan Motor or Compressor Mounting Grommet Wear",
        possibleCauses: [
          "Worn condenser fan motor bearings at bottom rear",
          "Hardened or cracked rubber compressor vibration dampers",
          "Vibrating refrigerant capillary tubing against steel frame"
        ],
        confidenceScore: 78,
        confidenceLevel: "Medium",
        confidence: "78% (Medium)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Pull unit forward and inspect the lower rear compartment while compressor runs to identify vibrating tubing or worn fan blades."
      };
    }

    return null;
  }

  /**
   * Diagnostic Rules for Washing Machine
   */
  function diagnoseWashingMachine(symptoms, description) {
    const text = description || "";

    const isLeaking = containsSymptom(symptoms, ["water_leak", "puddle_underneath"]) ||
      containsKeywords(text, [
        "water coming from the bottom", "water coming from bottom", "water", "bottom",
        "puddle", "leak", "leaking", "flooding", "water on floor", "puddle underneath"
      ]);

    const isDead = containsSymptom(symptoms, ["no_power"]) ||
      containsKeywords(text, [
        "was working yesterday, now nothing", "now nothing", "dead", "no power",
        "won't turn on", "not working at all", "completely off"
      ]);

    const isNoDrainOrSpin = containsSymptom(symptoms, ["no_drain", "no_spin"]) ||
      containsKeywords(text, ["won't drain", "not draining", "won't spin", "drum not spinning", "water standing in drum", "not spinning"]);

    const isExcessiveVibration = containsSymptom(symptoms, ["excessive_vibration", "strange_noise"]) ||
      containsKeywords(text, ["vibrating", "banging", "shaking", "loud noise on spin", "drum roaring", "jet engine"]);

    // Test Case: "water coming from the bottom"
    if (isLeaking) {
      return {
        faultId: "FLT-WM-001",
        likelyFault: "Damaged Tub Seal, Cracked Drain Pump, or Split Hose",
        possibleCauses: [
          "Cracked drain pump casing or failed internal pump impeller shaft seal",
          "Punctured or detached corrugated drain hose or water inlet hose",
          "Perforated front door rubber bellow gasket or worn main tub center seal",
          "Excessive detergent foaming causing pressure relief valve overflow"
        ],
        confidenceScore: 89,
        confidenceLevel: "High",
        confidence: "89% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Remove rear or bottom access panel. Run a short rinse/drain cycle with a dry floor to pinpoint exact source of water droplets around pump, hoses, and drum seal."
      };
    }

    // Test Case: "was working yesterday, now nothing"
    if (isDead) {
      return {
        faultId: "FLT-WM-002",
        likelyFault: "Blown Line Filter Fuse, Thermal Cutout, or Main PCB Failure",
        possibleCauses: [
          "Blown 10A/15A ceramic line noise suppression filter fuse",
          "Faulty electronic door lock / interlock switch preventing machine power-up",
          "Defective switch-mode power supply (SMPS) section on main inverter board"
        ],
        confidenceScore: 84,
        confidenceLevel: "High",
        confidence: "84% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Test wall receptacle. Disconnect machine, remove top panel, and check line filter module fuse for continuity. Test door latch micro-switch resistance."
      };
    }

    // Drain / Spin issue
    if (isNoDrainOrSpin) {
      return {
        faultId: "FLT-WM-003",
        likelyFault: "Clogged Drain Coin Trap or Seized Drain Pump Motor",
        possibleCauses: [
          "Foreign debris (coins, hairpins, lint) jamming pump impeller",
          "Burnt out drain pump motor coil windings",
          "Defective water level pressure switch (transducer) hose clogged with sediment"
        ],
        confidenceScore: 90,
        confidenceLevel: "High",
        confidence: "90% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Open front-bottom emergency drain filter cap, collect trapped water, and clear any debris. If pump still hums without spinning, replace drain pump motor."
      };
    }

    // Noise / Vibration
    if (isExcessiveVibration) {
      return {
        faultId: "FLT-WM-004",
        likelyFault: "Worn Drum Bearings or Broken Suspension Damper Rods",
        possibleCauses: [
          "Deteriorated tub shaft ball bearings (loud roaring sound during spin cycle)",
          "Worn or detached hydraulic suspension shock dampers",
          "Corroded or broken drum spider support bracket"
        ],
        confidenceScore: 85,
        confidenceLevel: "High",
        confidence: "85% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Spin inner basket by hand while empty; if you feel gritty resistance or excessive play between inner and outer tub, tub bearings need rebuild."
      };
    }

    return null;
  }

  /**
   * Diagnostic Rules for Microwave
   */
  function diagnoseMicrowave(symptoms, description) {
    const text = description || "";

    const isDead = containsSymptom(symptoms, ["no_power", "dead_display"]) ||
      containsKeywords(text, [
        "was working yesterday, now nothing", "now nothing", "dead", "no power",
        "won't turn on", "not working at all", "completely dark", "blank display"
      ]);

    const isNoHeat = containsSymptom(symptoms, ["no_heat"]) ||
      containsKeywords(text, ["not heat", "no heat", "food is not hot", "food stays cold", "doesn't heat", "won't heat", "cold food"]);

    const isTurntableStuck = containsSymptom(symptoms, ["turntable_stuck"]) ||
      containsKeywords(text, ["turntable", "plate won't turn", "glass plate stuck", "tray not spinning", "doesn't rotate"]);

    // Test Case: "was working yesterday, now nothing"
    if (isDead) {
      return {
        faultId: "FLT-MIC-001",
        likelyFault: "Blown Primary Ceramic Fuse or Defective Door Interlock Switch",
        possibleCauses: [
          "Blown 20A ceramic line fuse triggered by mis-timed door micro-switch",
          "Worn primary door monitor micro-switch shorting AC power line upon opening",
          "Tripped cavity thermal protector cutoff"
        ],
        confidenceScore: 87,
        confidenceLevel: "High",
        confidence: "87% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Test the 20A ceramic fuse inside unit with an ohmmeter. Inspect door latch mechanism and replace all three door micro-switches if timing alignment is faulty."
      };
    }

    // No heat
    if (isNoHeat) {
      return {
        faultId: "FLT-MIC-002",
        likelyFault: "Defective High-Voltage Magnetron or HV Rectifier Diode",
        possibleCauses: [
          "Burnt high-voltage diode shorted to ground",
          "Depleted cathode or open filament in microwave magnetron tube",
          "Blown high-voltage inline safety fuse (between capacitor and transformer)"
        ],
        confidenceScore: 91,
        confidenceLevel: "High",
        confidence: "91% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Qualified service technician only. Discharge high-voltage capacitor safely before testing HV diode with a 9V battery circuit and checking magnetron filament continuity."
      };
    }

    // Turntable stuck
    if (isTurntableStuck) {
      return {
        faultId: "FLT-MIC-003",
        likelyFault: "Faulty Synchronous Turntable Motor or Stripped Drive Coupler",
        possibleCauses: [
          "Stripped plastic center turntable drive coupler / hub",
          "Burned out 21V/120V synchronous turntable drive motor under the base",
          "Cracked roller guide ring or mechanical food debris jamming track"
        ],
        confidenceScore: 88,
        confidenceLevel: "High",
        confidence: "88% (High)",
        isDangerous: false,
        safetyWarning: null,
        recommendation: "Inspect plastic turntable coupler under glass tray for stripped splines. Test bottom motor winding resistance with multimeter."
      };
    }

    return null;
  }

  /**
   * Safe Fallback: Generated when symptoms are vague, missing, or inconclusive
   */
  function generateFallbackDiagnosis(appliance, symptoms, description) {
    return {
      faultId: "FLT-UNDETERMINED-000",
      likelyFault: "Undetermined Fault",
      possibleCauses: [
        "Intermittent electronic control signal or loose terminal connection",
        "Sensor drift or calibration deviation outside automated diagnostic thresholds",
        "Mechanical friction or component wear requiring hands-on disassembly and physical inspection"
      ],
      confidenceScore: 20,
      confidenceLevel: "Low",
      confidence: "20% (Low)",
      isDangerous: false,
      safetyWarning: null,
      recommendation: "Symptoms provided are vague or insufficient for automated rule-based diagnosis. A certified appliance technician must perform an on-site physical inspection, multimeter readout, and error code verification."
    };
  }

  /**
   * Main Diagnostic Engine Entry Point
   * 
   * @param {Object} input
   * @param {string} input.appliance - "Refrigerator", "Washing Machine", or "Microwave"
   * @param {Array<string>} [input.symptoms=[]] - Array of symptom IDs or keywords
   * @param {string} [input.description=""] - Free-text customer complaint description
   * @returns {Object} Standardized structured diagnosis object for Member 3
   */
  function diagnoseFault(input) {
    const rawAppliance = (input && input.appliance) ? String(input.appliance).trim() : "Unspecified";
    const symptoms = (input && Array.isArray(input.symptoms)) ? input.symptoms : [];
    const description = (input && input.description) ? String(input.description).trim() : "";

    // Normalize appliance string
    let appliance = rawAppliance;
    const lowerApp = rawAppliance.toLowerCase();
    if (lowerApp.includes("fridge") || lowerApp.includes("refrigerator")) {
      appliance = "Refrigerator";
    } else if (lowerApp.includes("wash") || lowerApp.includes("wm")) {
      appliance = "Washing Machine";
    } else if (lowerApp.includes("micro") || lowerApp.includes("oven")) {
      appliance = "Microwave";
    }

    // Step 1: PRIORITY SAFETY CHECK (Danger faults evaluated first)
    const safetyDiagnosis = checkPrioritySafety(appliance, symptoms, description);
    if (safetyDiagnosis) {
      return enrichResult(safetyDiagnosis, appliance, symptoms, description);
    }

    // Step 2: APPLIANCE-SPECIFIC RULE EVALUATION
    let result = null;
    if (appliance === "Refrigerator") {
      result = diagnoseRefrigerator(symptoms, description);
    } else if (appliance === "Washing Machine") {
      result = diagnoseWashingMachine(symptoms, description);
    } else if (appliance === "Microwave") {
      result = diagnoseMicrowave(symptoms, description);
    }

    // Step 3: SAFE FALLBACK (If symptoms are vague, empty, or unmatched)
    if (!result) {
      result = generateFallbackDiagnosis(appliance, symptoms, description);
    }

    return enrichResult(result, appliance, symptoms, description);
  }

  /**
   * Enriches the diagnosis result with standardized metadata for Member 3 (Cost Estimator)
   */
  function enrichResult(result, appliance, symptoms, description) {
    return {
      faultId: result.faultId,
      appliance: appliance,
      likelyFault: result.likelyFault,
      possibleCauses: result.possibleCauses || [],
      confidenceScore: result.confidenceScore || 0,
      confidenceLevel: result.confidenceLevel || "Low",
      confidence: result.confidence || `${result.confidenceScore || 0}% (${result.confidenceLevel || "Low"})`,
      isDangerous: Boolean(result.isDangerous),
      safetyWarning: result.safetyWarning || null,
      recommendation: result.recommendation || "",
      diagnosedAt: new Date().toISOString(),
      inputSummary: {
        appliance: appliance,
        symptoms: symptoms,
        description: description
      }
    };
  }

  return {
    diagnoseFault
  };
})();

// Support Browser global, Node.js, and ES Modules
if (typeof window !== "undefined") {
  window.DiagnosisEngine = DiagnosisEngine;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = DiagnosisEngine;
}

export default DiagnosisEngine;
export { DiagnosisEngine };
