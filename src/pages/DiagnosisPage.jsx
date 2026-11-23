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
import DiagnosisEngine from '../../member2/diagnosisEngine.js';

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

  const executeDiagnosis = (appType, syms, desc, compId) => {
    // Map symptom aliases to ensure full compatibility with DiagnosisEngine
    const mappedSyms = (syms || []).map((s) => {
      if (s === 'sparks') return 'sparks_arcing';
      if (s === 'vibration') return 'excessive_vibration';
      if (s === 'no_turntable') return 'turntable_stuck';
      return s;
    });

    const rawResult = DiagnosisEngine.diagnoseFault({
      appliance: appType,
      applianceType: appType,
      symptoms: mappedSyms,
      description: desc,
      complaintId: compId
    });

    setDiagnosisResult({
      faultId: rawResult.faultId,
      appliance: rawResult.appliance,
      likelyFault: rawResult.likelyFault,
      possibleCauses: rawResult.possibleCauses || [],
      confidenceScore: rawResult.confidenceScore || 85,
      confidence: rawResult.confidence || `${rawResult.confidenceScore || 85}% (High)`,
      confidenceLevel: rawResult.confidenceLevel || 'High',
      isDangerous: Boolean(rawResult.isDangerous),
      safetyWarning: rawResult.safetyWarning,
      recommendation: rawResult.recommendation
    });
  };

  const handleComplaintSelect = (complaintId) => {
    setSelectedComplaintId(complaintId);
    if (!complaintId) return;

    const comp = complaints.find((c) => c.id === complaintId);
    if (comp) {
      setApplianceType(comp.applianceType);
      setDescription(comp.description);

      // Auto-assign symptoms based on complaint text
      const desc = (comp.description || '').toLowerCase();
      const issueCat = (comp.issueCategory || '').toLowerCase();
      const combined = `${issueCat} ${desc}`;

      const syms = [];
      if (combined.includes('cool') || combined.includes('warm') || combined.includes('not cold')) syms.push('not_cooling');
      if (combined.includes('noise') || combined.includes('clicking') || combined.includes('rattling')) syms.push('strange_noise');
      if (combined.includes('leak') || combined.includes('overflow') || combined.includes('water')) syms.push('water_leak');
      if (combined.includes('spark') || combined.includes('arcing')) syms.push('sparks');
      if (combined.includes('burn') || combined.includes('smoke') || combined.includes('odor')) syms.push('burning_smell');
      if (combined.includes('spin') || combined.includes('drum')) syms.push('no_spin');
      if (combined.includes('drain') || combined.includes('pump')) syms.push('no_drain');
      if (combined.includes('vibrat') || combined.includes('shaking')) syms.push('vibration');
      if (combined.includes('heat') || combined.includes('cold food')) syms.push('no_heat');
      if (combined.includes('turntable') || combined.includes('tray')) syms.push('no_turntable');
      if (combined.includes('dead') || combined.includes('power') || combined.includes('display')) syms.push('dead_display');

      const finalSyms = syms.length ? syms : ['not_cooling'];
      setSelectedSymptoms(finalSyms);

      // Auto-run diagnosis for instant feedback on selection
      executeDiagnosis(comp.applianceType, finalSyms, comp.description, complaintId);
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
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    executeDiagnosis(applianceType, selectedSymptoms, description, selectedComplaintId);
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

            {/* Observed Symptoms Checkboxes with Clean Grid Layout */}
            <div className="form-group mb-4">
              <label className="form-label">Observed Symptoms (Check all that apply):</label>
              <div className="symptoms-checkbox-grid">
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
              {/* 4. Danger Alert Banner */}
              {diagnosisResult.isDangerous && (
                <div className="alert-box alert-danger mb-4 p-4 rounded-lg bg-red-50 border-2 border-red-500 flex items-start gap-3 shadow-sm">
                  <Flame size={24} className="flex-shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <strong className="text-red-700 font-extrabold text-sm tracking-wide block uppercase">
                      CRITICAL SAFETY HAZARD: DO NOT OPERATE / UNPLUG IMMEDIATELY!
                    </strong>
                    <p className="text-xs text-red-800 font-semibold mt-1 leading-relaxed">
                      {diagnosisResult.safetyWarning || 'Dangerous condition detected. Unplug the appliance immediately to avoid risk of electrical fire or shock.'}
                    </p>
                  </div>
                </div>
              )}

              {/* 1. Identified Likely Fault & Fault ID Badge */}
              <div className="output-section">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Identified Likely Fault:</span>
                <h4 className="text-lg font-bold text-slate-900 mt-1">
                  {diagnosisResult.likelyFault}
                </h4>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300">
                    {diagnosisResult.faultId}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {diagnosisResult.appliance} Diagnostic Code
                  </span>
                </div>
              </div>

              {/* 2. Probable Causes Section */}
              <div className="output-section mt-4">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Probable Causes:</span>
                <ul className="mt-2 space-y-1.5 list-disc list-inside text-sm text-slate-700 bg-slate-50 p-3.5 rounded-md border border-slate-200">
                  {diagnosisResult.possibleCauses && diagnosisResult.possibleCauses.length > 0 ? (
                    diagnosisResult.possibleCauses.map((cause, idx) => (
                      <li key={idx} className="leading-relaxed pl-1 text-slate-700">
                        {cause}
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No specific causes identified for this symptom pattern.</li>
                  )}
                </ul>
              </div>

              {/* 3. Recommended Action & Inspection Guidelines Box */}
              <div className="output-section mt-4">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Recommended Action &amp; Inspection Guidelines:</span>
                <div className="mt-2 bg-teal-50 border border-teal-200 p-3.5 rounded-md flex items-start gap-3">
                  <Wrench size={18} className="text-teal-700 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-teal-900 leading-relaxed font-medium">
                    {diagnosisResult.recommendation}
                  </div>
                </div>
              </div>

              {/* Confidence Score Progress Bar */}
              <div className="output-section mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span>Diagnostic Confidence:</span>
                  <strong className="text-slate-800">{diagnosisResult.confidence}</strong>
                </div>
                <div className="progress-stacked">
                  <div
                    className={`progress-bar ${diagnosisResult.confidenceLevel === 'High' ? 'bar-cyan' : 'bar-amber'}`}
                    style={{ width: `${diagnosisResult.confidenceScore}%` }}
                  >
                    {diagnosisResult.confidenceScore}%
                  </div>
                </div>
              </div>

              {/* 6. Proceed to Cost Guardrail (Module 3) */}
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
