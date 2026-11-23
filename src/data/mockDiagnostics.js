// Shared Mock Data for Jamal's Appliance Repair — Intake & Quote Guardrail System

export const APPLIANCE_TYPES = [
  {
    id: 'fridge',
    name: 'Refrigerator / Freezer',
    icon: 'Refrigerator',
    typicalReplacementValue: 750,
    averageLifespanYears: 12,
    description: 'Compressor, defrost, sealed system, and thermostat triage'
  },
  {
    id: 'washing_machine',
    name: 'Washing Machine',
    icon: 'WashingMachine',
    typicalReplacementValue: 600,
    averageLifespanYears: 10,
    description: 'Drum bearings, drive belt, drain pump, and suspension triage'
  },
  {
    id: 'microwave',
    name: 'Microwave Oven',
    icon: 'Zap',
    typicalReplacementValue: 180,
    averageLifespanYears: 7,
    description: 'Magnetron, high voltage diode, waveguide, and door interlock triage'
  }
];

export const VAGUE_COMPLAINTS = [
  {
    id: 'noise',
    label: 'Making a strange / loud noise',
    description: 'Customer reports grinding, clicking, humming, or buzzing sounds'
  },
  {
    id: 'dead',
    label: 'Working yesterday, now completely dead / nothing',
    description: 'Unit does not power on, display is off, or trips circuit breaker'
  },
  {
    id: 'water_leak',
    label: 'Water coming from the bottom / pooling',
    description: 'Puddle under unit, leaking during or after operation'
  },
  {
    id: 'burning_smell',
    label: 'Smells like something burning / smoke',
    description: 'Electrical burning odor, ozone smell, or scorched plastic'
  }
];

export const FOLLOW_UP_QUESTIONS = {
  fridge: {
    noise: [
      { id: 'q_warm', text: 'Is the fresh food compartment warm or not cooling properly?', weight: 'compressor' },
      { id: 'q_clicking', text: 'Do you hear a loud repeating click every 2-3 minutes from the back?', weight: 'relay' },
      { id: 'q_frost', text: 'Is there heavy frost buildup on the freezer back wall?', weight: 'defrost' }
    ],
    dead: [
      { id: 'q_light_on', text: 'Does the interior light turn on when you open the door?', weight: 'control_board' },
      { id: 'q_outlet_tested', text: 'Has the outlet been tested with a phone charger or lamp?', weight: 'power_cord' }
    ],
    water_leak: [
      { id: 'q_inside_drawers', text: 'Is water pooling inside under the crisper vegetable drawers?', weight: 'drain_tube' },
      { id: 'q_ice_maker', text: 'Does this model have an active water/ice dispenser line connected?', weight: 'water_valve' }
    ],
    burning_smell: [
      { id: 'q_hot_sides', text: 'Are the exterior cabinet side walls uncomfortably hot to the touch?', weight: 'condenser_fan' },
      { id: 'q_behind_fridge', text: 'Is the odor concentrated directly behind the bottom machine compartment?', weight: 'compressor' }
    ]
  },
  washing_machine: {
    noise: [
      { id: 'q_not_spinning', text: 'Is the tub failing to spin or shaking violently during the spin cycle?', weight: 'bearing_belt' },
      { id: 'q_jet_engine', text: 'Does the noise sound like a roaring jet engine when spinning?', weight: 'drum_bearing' },
      { id: 'q_drain_hum', text: 'Does the humming noise only happen when draining water?', weight: 'drain_pump' }
    ],
    dead: [
      { id: 'q_door_clicks', text: 'Does the door lock / lid switch click shut when starting?', weight: 'lid_switch' },
      { id: 'q_panel_lights', text: 'Are any lights flashing or showing an error code on the panel?', weight: 'main_pcb' }
    ],
    water_leak: [
      { id: 'q_front_door', text: 'Is water dripping past the front door rubber gasket boot?', weight: 'door_boot' },
      { id: 'q_during_fill', text: 'Does the leak occur only while water is filling the drum?', weight: 'inlet_valve' }
    ],
    burning_smell: [
      { id: 'q_rubber_smell', text: 'Does it smell specifically like burnt friction rubber during spin?', weight: 'drive_belt' },
      { id: 'q_hot_plug', text: 'Is the wall plug or machine back panel warm or singed?', weight: 'motor_harness' }
    ]
  },
  microwave: {
    noise: [
      { id: 'q_arcing_buzz', text: 'Is the noise a deep grinding buzz accompanied by vibrations?', weight: 'transformer' },
      { id: 'q_turntable', text: 'Does the noise pulse in rhythm with the glass turntable rotating?', weight: 'roller_ring' }
    ],
    dead: [
      { id: 'q_door_slam', text: 'Did the microwave shut off immediately after opening or slamming the door?', weight: 'door_fuse' },
      { id: 'q_tripped_breaker', text: 'Did it trip your kitchen counter circuit breaker?', weight: 'interlock_switches' }
    ],
    water_leak: [
      { id: 'q_steam_vent', text: 'Is condensation dripping from the exhaust vents after cooking soup?', weight: 'condensation' }
    ],
    burning_smell: [
      { id: 'q_sparks_visible', text: 'Did you see flashes of lightning, sparks, or scorch marks inside?', weight: 'magnetron_waveguide' },
      { id: 'q_waveguide_cover', text: 'Is the mica cardboard cover inside charred or greasy?', weight: 'waveguide_cover' }
    ]
  }
};

export const MOCK_FAULTS = [
  // --- REFRIGERATORS ---
  {
    id: 'fridge_compressor_failure',
    appliance: 'fridge',
    faultName: 'Sealed System / Seized Compressor Failure',
    likelihood: 'High',
    minCost: 280,
    maxCost: 480,
    costVariance: 200,
    replacementValue: 750,
    repairTimeDays: 4,
    isWorthRepairing: false,
    severity: 'critical',
    triageTriggers: { complaint: 'noise', questionMatch: 'q_warm' },
    assistantWarningNote: 'HIGH RISK: Never give a single price quote over the counter! Quoting a simple relay ($65) when the compressor has seized ($380+) leaves the shop eating hundreds in customer backlash or free labor.',
    symptomSummary: 'Compressor humming/stalling, cabinet warm, freezer thawing',
    partsNeeded: ['Embraco R600a/R134a Compressor', 'Filter Drier', 'Refrigerant Charge', 'Access Valve'],
    benchTestAdvice: 'Measure start/run winding resistance (Ohmic check) and check for grounded winding with Megger.'
  },
  {
    id: 'fridge_start_relay',
    appliance: 'fridge',
    faultName: 'PTC Start Relay & Overload Protector',
    likelihood: 'Medium',
    minCost: 65,
    maxCost: 110,
    costVariance: 45,
    replacementValue: 750,
    repairTimeDays: 1,
    isWorthRepairing: true,
    severity: 'minor',
    triageTriggers: { complaint: 'noise', questionMatch: 'q_clicking' },
    assistantWarningNote: 'Moderate risk. Often misdiagnosed as bad compressor. Test relay continuity before committing to compressor replacement.',
    symptomSummary: 'Compressor attempts start with distinct click every 90s, stops',
    partsNeeded: ['Solid State PTC Starter Relay', 'Run Capacitor (if equipped)'],
    benchTestAdvice: 'Shake relay; if rattling like sand, internal disc is shattered.'
  },
  {
    id: 'fridge_blocked_drain',
    appliance: 'fridge',
    faultName: 'Frozen / Clogged Evaporator Defrost Drain Line',
    likelihood: 'High',
    minCost: 45,
    maxCost: 85,
    costVariance: 40,
    replacementValue: 750,
    repairTimeDays: 1,
    isWorthRepairing: true,
    severity: 'minor',
    triageTriggers: { complaint: 'water_leak', questionMatch: 'q_inside_drawers' },
    assistantWarningNote: 'Low risk simple repair. Safe for tight counter range, but inspect duckbill drain grommet to prevent repeat callbacks.',
    symptomSummary: 'Water pooling under bottom drawers, sheets of ice on freezer floor',
    partsNeeded: ['Drain Heater Clip', 'Modified P-Trap Grommet'],
    benchTestAdvice: 'Flush with hot water + baking soda; inspect duckbill valve at rear compressor bay.'
  },
  {
    id: 'fridge_inverter_board',
    appliance: 'fridge',
    faultName: 'Main Power PCB / Inverter Board Surge Blown',
    likelihood: 'Medium',
    minCost: 140,
    maxCost: 220,
    costVariance: 80,
    replacementValue: 750,
    repairTimeDays: 2,
    isWorthRepairing: true,
    severity: 'moderate',
    triageTriggers: { complaint: 'dead', questionMatch: 'q_light_on' },
    assistantWarningNote: 'Check for compressor lock before putting in new board. Blown board often caused by locked rotor amp draw.',
    symptomSummary: 'Interior LED light comes on, but fans, display, and compressor stay dead',
    partsNeeded: ['OEM Inverter Driver Module', 'Main Logic PCB'],
    benchTestAdvice: 'Check 12VDC secondary rail and optical diagnostic blink codes on inverter board.'
  },

  // --- WASHING MACHINES ---
  {
    id: 'washer_drum_bearing',
    appliance: 'washing_machine',
    faultName: 'Tub Rear Bearing & Spider Arm Corrosion',
    likelihood: 'High',
    minCost: 240,
    maxCost: 390,
    costVariance: 150,
    replacementValue: 600,
    repairTimeDays: 3,
    isWorthRepairing: false,
    severity: 'critical',
    triageTriggers: { complaint: 'noise', questionMatch: 'q_jet_engine' },
    assistantWarningNote: 'DANGER: Repair cost often exceeds 50% replacement value on machines older than 5 years. Labor intensive (full tub teardown). Warn customer about BER (Beyond Economical Repair)!',
    symptomSummary: 'Deafening jet engine sound during spin cycle, play in inner drum',
    partsNeeded: ['Rear Outer Tub Half with Pressed Bearings', 'Tri-Radial Spider Bracket', 'Shaft Seal'],
    benchTestAdvice: 'Lift inner basket relative to outer tub; if >3mm vertical play, bearings have collapsed.'
  },
  {
    id: 'washer_drive_belt',
    appliance: 'washing_machine',
    faultName: 'Snapped / Glazed Drive Belt or Motor Pulley',
    likelihood: 'High',
    minCost: 55,
    maxCost: 95,
    costVariance: 40,
    replacementValue: 600,
    repairTimeDays: 1,
    isWorthRepairing: true,
    severity: 'minor',
    triageTriggers: { complaint: 'burning_smell', questionMatch: 'q_rubber_smell' },
    assistantWarningNote: 'Safe quick turnaround. Check for locked idler pulley or motor seizure causing the belt to burn.',
    symptomSummary: 'Motor hums, tub will not spin, strong burnt rubber smell',
    partsNeeded: ['Multi-Rib Poly-V Drive Belt', 'Idler Tensioner Wheel'],
    benchTestAdvice: 'Inspect belt teeth and check motor drive shaft rotation by hand.'
  },
  {
    id: 'washer_drain_pump',
    appliance: 'washing_machine',
    faultName: 'Drain Pump Jammed with Foreign Object or Burnout',
    likelihood: 'Medium',
    minCost: 70,
    maxCost: 130,
    costVariance: 60,
    replacementValue: 600,
    repairTimeDays: 1,
    isWorthRepairing: true,
    severity: 'minor',
    triageTriggers: { complaint: 'water_leak', questionMatch: 'q_not_spinning' },
    assistantWarningNote: 'If coins/bobby pins jammed impeller, labor only ($50). If motor stator burned out, full pump swap ($120). Explain range to customer!',
    symptomSummary: 'Standing water at end of cycle, humming during drain, won\'t spin',
    partsNeeded: ['Magnetic Synchronous Drain Pump', 'Coin Trap Filter Gasket'],
    benchTestAdvice: 'Check impeller resistance with screwdriver; clear hairpins and coins from filter.'
  },

  // --- MICROWAVES ---
  {
    id: 'micro_magnetron_waveguide',
    appliance: 'microwave',
    faultName: 'Magnetron Tube Arcing & Carbonized Waveguide',
    likelihood: 'High',
    minCost: 90,
    maxCost: 155,
    costVariance: 65,
    replacementValue: 180,
    repairTimeDays: 2,
    isWorthRepairing: false,
    severity: 'critical',
    triageTriggers: { complaint: 'burning_smell', questionMatch: 'q_sparks_visible' },
    assistantWarningNote: 'ALERT: Microwave replacement value is typically only $150-$200. A $130 repair on a 4+ year old unit is rarely economical. Flag immediately at counter before customer leaves unit!',
    symptomSummary: 'Intense electrical fireworks inside cavity, ozone smoke, food cold',
    partsNeeded: ['High Voltage Magnetron Tube', 'Mica Waveguide Shield', 'Cavity Paint'],
    benchTestAdvice: 'Discharge 2000V capacitor first! Inspect antenna dome for thermal melting or perforation.'
  },
  {
    id: 'micro_door_fuse',
    appliance: 'microwave',
    faultName: 'Primary Microswitch Short / Blown 20A Ceramic Fuse',
    likelihood: 'High',
    minCost: 40,
    maxCost: 75,
    costVariance: 35,
    replacementValue: 180,
    repairTimeDays: 1,
    isWorthRepairing: true,
    severity: 'minor',
    triageTriggers: { complaint: 'dead', questionMatch: 'q_door_slam' },
    assistantWarningNote: 'Replace all 3 door switches if interlock bracket is misaligned, otherwise the new fuse will pop immediately when door shuts.',
    symptomSummary: 'Unit went totally dark when closing door, kitchen fuse or unit fuse blown',
    partsNeeded: ['20A 250V Slow-Blow Ceramic Fuse', 'Omron 16A Normally-Open Interlock Switches'],
    benchTestAdvice: 'Check sequence timing of primary, secondary, and monitor door interlock switches.'
  }
];

export const SHOP_METRICS = {
  shopName: "Jamal's Appliance Repair",
  subtitle: "Intake & Quote Guardrail System",
  counterLead: "Arik (Intake Desk Lead)",
  hourlyBenchRate: 65,
  minDiagnosticInspectionFee: 35,
  disclaimerText: "This is an initial diagnostic estimate range, not a final fixed quote. Final repair cost will be confirmed after bench inspection before work begins.",
  berThresholdPercent: 50 // Beyond Economical Repair: if repair > 50% replacement value
};
