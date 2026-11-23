import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ClipboardList,
  Flame,
  Zap,
  Info
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function DiagnosisPage() {
  const { complaints } = useData();
  const navigate = useNavigate();

  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [applianceType, setApplianceType] = useState('Refrigerator');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['not_cooling', 'strange_noise']);
  const [description, setDescription] = useState(
    'Freezer works slightly but lower chamber is warm. Continuous clicking and rattling sound.'
  );
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const symptomOptions = {
    Refrigerator: [
      { id: 'not_cooling', label: 'Not Cooling / Warm Chamber' },
      { id: 'strange_noise', label: 'Rattling / Clicking Noise' },
      { id: 'water_leak', label: 'Water Leaking on Floor' },
      { id: 'frost_buildup', label: 'Excessive Frost Build-up' },
      { id: 'burning_smell', label: 'Burning Smell / Overheating' },
      { id: 'sparks', label: 'Electrical Sparks / Shock Hazard' }
    ],
    'Washing Machine': [
      { id: 'no_spin', label: 'Drum Not Spinning' },
      { id: 'no_drain', label: 'Water Not Draining / Pump Blocked' },
      { id: 'water_leak', label: 'Water Leakage During Cycle' },
      { id: 'vibration', label: 'Violent Vibration / Loud Roar' },
      { id: 'door_lock', label: 'Door Lock Jammed' },
      { id: 'burning_smell', label: 'Burning Rubber / Smoke' }
    ],
    'Microwave Oven': [
      { id: 'no_heat', label: 'Running But Not Heating' },
      { id: 'sparks', label: 'Sparks / Fireworks in Cavity' },
      { id: 'no_turntable', label: 'Turntable Plate Not Rotating' },
      { id: 'dead_display', label: 'Display / Keypad Dead' },
      { id: 'burning_smell', label: 'Burning Odor / High Voltage Buzz' }
    ]
  };

  const handleComplaintSelect = (complaintId) => {
    setSelectedComplaintId(complaintId);
    if (!complaintId) return;

    const comp = complaints.find((c) => c.id === complaintId);
    if (comp) {
      setApplianceType(comp.applianceType);
      setDescription(comp.description);
      // Auto-assign symptoms
      const desc = comp.description.toLowerCase();
      const syms = [];
      if (desc.includes('cool') || desc.includes('warm')) syms.push('not_cooling');
      if (desc.includes('noise') || desc.includes('clicking')) syms.push('strange_noise');
      if (desc.includes('leak') || desc.includes('overflow')) syms.push('water_leak');
      if (desc.includes('spark') || desc.includes('fire')) syms.push('sparks');
      if (desc.includes('spin') || desc.includes('drum')) syms.push('no_spin');
      if (desc.includes('heat') || desc.includes('warm')) syms.push('no_heat');
      setSelectedSymptoms(syms.length ? syms : ['not_cooling']);
    }
  };

  const handleToggleSymptom = (symId) => {
    if (selectedSymptoms.includes(symId)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symId]);
    }
  };

  const runDiagnosis = (e) => {
    e.preventDefault();
    const text = description.toLowerCase();

    // Priority 1: Safety Hazard check
    const isDangerous =
      selectedSymptoms.includes('sparks') ||
      selectedSymptoms.includes('burning_smell') ||
      text.includes('spark') ||
      text.includes('smoke') ||
      text.includes('shock') ||
      text.includes('fire');

    let likelyFault = '';
    let recommendation = '';
    let confidenceScore = 90;

    if (applianceType === 'Refrigerator') {
      if (isDangerous) {
        likelyFault = 'Compressor PTC Starter Relay Arcing / Short Circuit';
        recommendation =
          'CRITICAL SAFETY HAZARD: Unplug refrigerator immediately. Do not power until relay and compressor terminals are ohm-tested.';
        confidenceScore = 95;
      } else if (selectedSymptoms.includes('not_cooling')) {
        likelyFault = 'Evaporator Fan Motor Failure or Capillary Tube Blockage';
        recommendation =
          'Check evaporator fan RPM, test defrost sensor, and check refrigerant system operating pressure.';
        confidenceScore = 88;
      } else if (selectedSymptoms.includes('water_leak')) {
        likelyFault = 'Defrost Drain Tube Clogged with Ice or Algae';
        recommendation = 'Flush drain hole with hot water and inspect drain pan heater.';
        confidenceScore = 92;
      } else {
        likelyFault = 'Thermostat Sensor / Control Board Calibration Fault';
        recommendation = 'Test temperature NTC thermistor resistance against factory table.';
        confidenceScore = 85;
      }
    } else if (applianceType === 'Washing Machine') {
      if (isDangerous) {
        likelyFault = 'Motor Drive Stator Short / Main PCB Inverter Overheating';
        recommendation = 'Unplug machine. Test motor windings for ground continuity.';
        confidenceScore = 96;
      } else if (selectedSymptoms.includes('no_drain') || selectedSymptoms.includes('water_leak')) {
        likelyFault = 'Clogged Drain Pump Filter / Ruptured Bellows Intake Gasket';
        recommendation =
          'Clear foreign objects from coin trap and test 230V drain pump coil resistance.';
        confidenceScore = 93;
      } else if (selectedSymptoms.includes('no_spin') || selectedSymptoms.includes('vibration')) {
        likelyFault = 'Worn Spider Arm Bearings or Broken Suspension Damper Rods';
        recommendation = 'Inspect rear bearing seal for rust bleed; check shock absorber resistance.';
        confidenceScore = 91;
      } else {
        likelyFault = 'Door Interlock Switch or Hall Speed Sensor Failure';
        recommendation = 'Check door latch contact continuity and rotor tachometer pulse.';
        confidenceScore = 86;
      }
    } else {
      // Microwave Oven
      if (isDangerous || selectedSymptoms.includes('sparks')) {
        likelyFault = 'High-Voltage Waveguide Arcing / Burnt Mica Cover';
        recommendation =
          'CRITICAL HAZARD: Do not operate. Replace waveguide mica sheet and check magnetron antenna dome.';
        confidenceScore = 97;
      } else if (selectedSymptoms.includes('no_heat')) {
        likelyFault = 'High-Voltage Diode / Capacitor or Magnetron Open Circuit';
        recommendation =
          'Discharge high-voltage capacitor safely before service. Measure HV diode forward drop.';
        confidenceScore = 90;
      } else {
        likelyFault = 'Turntable Synchronous Drive Motor Failure';
        recommendation = 'Test turntable motor coil with multimeter (approx 2.5kΩ to 3.5kΩ).';
        confidenceScore = 89;
      }
    }

    setDiagnosisResult({
      faultId: `FLT-${applianceType.slice(0, 3).toUpperCase()}-001`,
      appliance: applianceType,
      likelyFault,
      confidenceScore,
      confidence: `${confidenceScore}% (High)`,
      isDangerous,
      safetyWarning: isDangerous
        ? 'CRITICAL SAFETY HAZARD: Disconnect power immediately. High risk of electrical fire or shock.'
        : null,
      recommendation
    });
  };

  const handleProceedToCost = () => {
    navigate('/cost-guardrail', {
      state: {
        selectedComplaint: {
          id: selectedComplaintId || 'JAC-DIAG-LIVE',
          customerName: 'Verified Diagnostics Client',
          customerPhone: '01700000000',
          applianceType,
          brand: 'Standard Model',
          issueCategory: diagnosisResult.likelyFault,
          description,
          priority: diagnosisResult.isDangerous ? 'Urgent' : 'Medium'
        }
      }
    });
  };

  const activeOptions = symptomOptions[applianceType] || symptomOptions.Refrigerator;

  return (
    <div className="page-container diagnosis-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Rule-Based Fault Diagnosis Engine</h1>
          <p className="page-subtitle">
            Module 2: Analyzes appliance symptoms, checks priority safety hazard rules, and outputs verified fault predictions.
          </p>
        </div>
      </div>

      <div className="dashboard-columns-grid">
        {/* Left Column: Diagnostic Input Form */}
        <div className="card">
          <form onSubmit={runDiagnosis}>
            {/* Pick existing complaint shortcut */}
            <div className="form-group mb-4">
              <label className="form-label">
                Load Complaint from Customer Intake (Module 1):
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedComplaintId}
                onChange={(e) => handleComplaintSelect(e.target.value)}
              >
                <option value="">-- Manual Entry or Select Registered Complaint --</option>
                {complaints.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.customerName} ({c.applianceType}: {c.issueCategory})
                  </option>
                ))}
              </select>
            </div>

            {/* Appliance Selector */}
            <div className="form-group mb-4">
              <label className="form-label">Appliance Type:</label>
              <div className="radio-pill-group">
                {['Refrigerator', 'Washing Machine', 'Microwave Oven'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`radio-pill ${applianceType === type ? 'active' : ''}`}
                    onClick={() => {
                      setApplianceType(type);
                      setSelectedSymptoms([]);
                    }}
                  >
                    {type === 'Refrigerator' && '❄️ '}
                    {type === 'Washing Machine' && '🧺 '}
                    {type === 'Microwave Oven' && '⚡ '}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Common Symptoms Checkboxes */}
            <div className="form-group mb-4">
              <label className="form-label">Observed Symptoms (Check all that apply):</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {activeOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`checkbox-pill ${selectedSymptoms.includes(opt.id) ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(opt.id)}
                      onChange={() => handleToggleSymptom(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Free-text Description */}
            <div className="form-group mb-4">
              <label className="form-label">Fault Description &amp; Free-Text Symptoms:</label>
              <textarea
                rows={3}
                className="form-input form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. food not cooling, sparking sound, leaking water from bottom tray..."
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block flex items-center justify-center gap-2">
              <Wrench size={18} />
              <span>Evaluate Diagnostic Rules</span>
            </button>
          </form>
        </div>

        {/* Right Column: Diagnostic Output Card */}
        <div className="card">
          <div className="card-header-row mb-3">
            <h3 className="section-heading">Diagnostic Engine Output</h3>
            {diagnosisResult && (
              <span className="badge badge-info">{diagnosisResult.confidence}</span>
            )}
          </div>

          {!diagnosisResult ? (
            <div className="text-center py-12 text-muted">
              <Wrench size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="font-semibold">No active diagnosis evaluated yet.</p>
              <p className="text-xs">
                Select appliance symptoms on the left and click "Evaluate Diagnostic Rules".
              </p>
            </div>
          ) : (
            <div className="diagnosis-output-box">
              {diagnosisResult.isDangerous && (
                <div className="alert-box alert-danger mb-4">
                  <Flame size={20} className="flex-shrink-0 text-danger" />
                  <div>
                    <strong>CRITICAL SAFETY HAZARD DETECTED</strong>
                    <p className="text-xs mt-1">{diagnosisResult.safetyWarning}</p>
                  </div>
                </div>
              )}

              <div className="output-section">
                <span className="text-xs font-bold text-muted uppercase">Identified Likely Fault:</span>
                <h4 className="text-lg font-bold text-slate-900 mt-1">
                  {diagnosisResult.likelyFault}
                </h4>
              </div>

              <div className="output-section mt-4">
                <span className="text-xs font-bold text-muted uppercase">Bench Recommendation:</span>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200 mt-1">
                  {diagnosisResult.recommendation}
                </p>
              </div>

              <div className="output-section mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span>Confidence Score:</span>
                  <strong className="text-slate-800">{diagnosisResult.confidenceScore}%</strong>
                </div>
                <div className="progress-stacked">
                  <div
                    className="progress-bar bar-cyan"
                    style={{ width: `${diagnosisResult.confidenceScore}%` }}
                  >
                    {diagnosisResult.confidenceScore}%
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  className="btn btn-primary btn-block flex items-center justify-center gap-2"
                  onClick={handleProceedToCost}
                >
                  <span>Proceed to Cost Guardrail (Module 3)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
