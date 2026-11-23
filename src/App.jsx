import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_FAULTS, APPLIANCE_TYPES, VAGUE_COMPLAINTS, SHOP_METRICS } from './data/mockDiagnostics';
import SymptomIntake from './components/SymptomIntake';
import FaultDiagnosis from './components/FaultDiagnosis';
import CostGuardrail from './components/CostGuardrail';
import { Wrench, Shield, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
import './index.css';

export default function App() {
  // Lifted state across all 3 modules
  const [selectedAppliance, setSelectedAppliance] = useState('fridge');
  const [selectedComplaint, setSelectedComplaint] = useState('noise');
  const [customNote, setCustomNote] = useState('Whirlpool Double Door, making loud buzzing in compressor area');
  const [answers, setAnswers] = useState({ q_warm: true, q_clicking: false });
  const [applianceAge, setApplianceAge] = useState(6);
  const [activeFault, setActiveFault] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'step1' | 'step2' | 'step3'

  // Dynamic Triage Engine to compute detectedFaults based on state
  const detectedFaults = useMemo(() => {
    if (!selectedAppliance) return [];

    // Filter by appliance
    let candidates = MOCK_FAULTS.filter((f) => f.appliance === selectedAppliance);

    // Score based on complaint match and question answers
    const scored = candidates.map((fault) => {
      let score = 10;
      if (fault.triageTriggers) {
        if (fault.triageTriggers.complaint === selectedComplaint) {
          score += 30;
        }
        if (fault.triageTriggers.questionMatch && answers[fault.triageTriggers.questionMatch] === true) {
          score += 50;
        }
      }
      return { ...fault, triageScore: score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.triageScore - a.triageScore);
    return scored.slice(0, 3);
  }, [selectedAppliance, selectedComplaint, answers]);

  // Sync active fault when detected faults change
  useEffect(() => {
    if (detectedFaults.length > 0) {
      // Keep existing active fault if it's still in candidates, otherwise pick top
      const stillValid = detectedFaults.find((f) => f.id === activeFault?.id);
      if (!stillValid) {
        setActiveFault(detectedFaults[0]);
      }
    } else {
      setActiveFault(null);
    }
  }, [detectedFaults]);

  // Handlers
  const handleSelectAppliance = (appId) => {
    setSelectedAppliance(appId);
    setAnswers({});
    setCustomNote('');
  };

  const handleSelectComplaint = (complaintId) => {
    setSelectedComplaint(complaintId);
    setAnswers({});
  };

  const handleAnswerQuestion = (qId, val) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: val
    }));
  };

  // Demo presets for fast evaluation
  const loadPreset = (presetKey) => {
    if (presetKey === 'fridge_ber') {
      setSelectedAppliance('fridge');
      setSelectedComplaint('noise');
      setAnswers({ q_warm: true, q_clicking: false, q_frost: false });
      setApplianceAge(9);
      setCustomNote('Samsung French Door, food spoiled in top compartment, loud buzzing.');
    } else if (presetKey === 'washer_safe') {
      setSelectedAppliance('washing_machine');
      setSelectedComplaint('burning_smell');
      setAnswers({ q_rubber_smell: true });
      setApplianceAge(3);
      setCustomNote('LG Front Loader, belt burning smell during spin, tub not turning.');
    } else if (presetKey === 'micro_spark') {
      setSelectedAppliance('microwave');
      setSelectedComplaint('burning_smell');
      setAnswers({ q_sparks_visible: true });
      setApplianceAge(5);
      setCustomNote('Panasonic Inverter, lightning flashes near waveguide cover.');
    }
  };

  const resetAll = () => {
    setSelectedAppliance('fridge');
    setSelectedComplaint('noise');
    setAnswers({ q_warm: true });
    setApplianceAge(4);
    setCustomNote('');
  };

  return (
    <div className="app-container">
      {/* Top Banner & Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="logo-shield">
            <Wrench size={24} className="logo-icon" />
          </div>
          <div>
            <h1 className="brand-title">{SHOP_METRICS.shopName}</h1>
            <p className="brand-subtitle">
              {SHOP_METRICS.subtitle} • <strong>Counter Terminal 01</strong>
            </p>
          </div>
        </div>

        <div className="header-controls">
          <div className="live-pill">
            <span className="live-dot" />
            <span>Counter Lead: <strong>{SHOP_METRICS.counterLead}</strong></span>
          </div>

          <div className="preset-selector">
            <span className="preset-label">
              <Sparkles size={14} /> Quick Scenarios:
            </span>
            <button type="button" className="preset-btn" onClick={() => loadPreset('fridge_ber')}>
              Fridge High Loss / BER
            </button>
            <button type="button" className="preset-btn" onClick={() => loadPreset('washer_safe')}>
              Washer Belt (Safe Fix)
            </button>
            <button type="button" className="preset-btn" onClick={() => loadPreset('micro_spark')}>
              Microwave Arcing
            </button>
            <button type="button" className="preset-btn reset-btn" onClick={resetAll} title="Reset Form">
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* Team Architecture Ribbon */}
      <section className="architecture-ribbon">
        <div className="arch-item">
          <span className="arch-num">M1</span>
          <div className="arch-text">
            <strong>Member 1: Front Intake</strong>
            <span>Appliance, Vague Complaint & Triage Follow-ups</span>
          </div>
        </div>
        <div className="arch-arrow">→</div>
        <div className="arch-item">
          <span className="arch-num">M2</span>
          <div className="arch-text">
            <strong>Member 2: Triage Engine</strong>
            <span>Algorithmic Fault Match & Tech Bench Summary</span>
          </div>
        </div>
        <div className="arch-arrow">→</div>
        <div className="arch-item arch-highlight">
          <span className="arch-num">M3</span>
          <div className="arch-text">
            <strong>Member 3 (Core Lead): Cost Guardrail</strong>
            <span>Range Meter, Loss Simulator, BER Banner & Intake Ticket</span>
          </div>
        </div>
      </section>

      {/* View Switcher for Narrow Screens */}
      <div className="view-switcher-bar">
        <span className="switcher-label">Display Mode:</span>
        <button
          type="button"
          className={`switcher-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All 3 Steps (Full Counter View)
        </button>
        <button
          type="button"
          className={`switcher-btn ${activeTab === 'step1' ? 'active' : ''}`}
          onClick={() => setActiveTab('step1')}
        >
          Step 1: Intake (M1)
        </button>
        <button
          type="button"
          className={`switcher-btn ${activeTab === 'step2' ? 'active' : ''}`}
          onClick={() => setActiveTab('step2')}
        >
          Step 2: Diagnosis (M2)
        </button>
        <button
          type="button"
          className={`switcher-btn ${activeTab === 'step3' ? 'active' : ''}`}
          onClick={() => setActiveTab('step3')}
        >
          Step 3: Cost Guardrail (M3 Core)
        </button>
      </div>

      {/* Main Workflow Grid */}
      <main className="main-content-grid">
        {(activeTab === 'all' || activeTab === 'step1') && (
          <div className="grid-column col-step1">
            <SymptomIntake
              selectedAppliance={selectedAppliance}
              onSelectAppliance={handleSelectAppliance}
              selectedComplaint={selectedComplaint}
              onSelectComplaint={handleSelectComplaint}
              customNote={customNote}
              onChangeCustomNote={setCustomNote}
              answers={answers}
              onAnswerQuestion={handleAnswerQuestion}
              applianceAge={applianceAge}
              onChangeApplianceAge={setApplianceAge}
            />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'step2') && (
          <div className="grid-column col-step2">
            <FaultDiagnosis
              detectedFaults={detectedFaults}
              activeFault={activeFault}
              onSelectFault={setActiveFault}
              selectedAppliance={selectedAppliance}
              selectedComplaint={selectedComplaint}
              answers={answers}
              customNote={customNote}
            />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'step3') && (
          <div className="grid-column col-step3">
            <CostGuardrail
              activeFault={activeFault}
              detectedFaults={detectedFaults}
              selectedAppliance={selectedAppliance}
              selectedComplaint={selectedComplaint}
              answers={answers}
              customNote={customNote}
              applianceAge={applianceAge}
            />
          </div>
        )}
      </main>

      {/* Counter Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span>SE 331 Live Coding Assessment • Modular 3-Tier Architecture</span>
          <span className="dot-sep">•</span>
          <span>Offline React/Vite Client • Strictly Mock Diagnostics Data</span>
        </div>
        <div className="footer-right">
          <span>Branch: <strong>Arik</strong></span>
          <span className="dot-sep">•</span>
          <span>Lead Developer: <strong>arikabrar (163)</strong></span>
        </div>
      </footer>
    </div>
  );
}
