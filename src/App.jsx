import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_FAULTS, APPLIANCE_TYPES, SHOP_METRICS } from './data/mockDiagnostics';
import SymptomIntake from './components/SymptomIntake';
import FaultDiagnosis from './components/FaultDiagnosis';
import CostGuardrail from './components/CostGuardrail';
import { Wrench, Shield, Sparkles, RotateCcw } from 'lucide-react';
import './index.css';

export default function App() {
  // Lifted state shared across modules
  const [selectedAppliance, setSelectedAppliance] = useState('fridge');
  const [selectedComplaint, setSelectedComplaint] = useState('noise');
  const [customNote, setCustomNote] = useState('Humming loudly, food starting to spoil');
  const [applianceAge, setApplianceAge] = useState(6);
  const [activeFault, setActiveFault] = useState(null);

  // Filter detected faults for Member 2 stub & Member 3
  const detectedFaults = useMemo(() => {
    return MOCK_FAULTS.filter((f) => f.appliance === selectedAppliance);
  }, [selectedAppliance]);

  // Set active fault whenever detected faults update
  useEffect(() => {
    if (detectedFaults.length > 0) {
      const match = detectedFaults.find((f) => f.id === activeFault?.id);
      if (!match) {
        setActiveFault(detectedFaults[0]);
      }
    }
  }, [detectedFaults]);

  // Quick preset test buttons for grading Arik's Module 3
  const loadScenario = (type) => {
    if (type === 'ber_fridge') {
      setSelectedAppliance('fridge');
      setSelectedComplaint('noise');
      setApplianceAge(8);
      const fault = MOCK_FAULTS.find((f) => f.id === 'fridge_compressor_failure');
      if (fault) setActiveFault(fault);
    } else if (type === 'safe_washer') {
      setSelectedAppliance('washing_machine');
      setSelectedComplaint('burning_smell');
      setApplianceAge(3);
      const fault = MOCK_FAULTS.find((f) => f.id === 'washer_drive_belt');
      if (fault) setActiveFault(fault);
    } else if (type === 'micro_arcing') {
      setSelectedAppliance('microwave');
      setSelectedComplaint('burning_smell');
      setApplianceAge(5);
      const fault = MOCK_FAULTS.find((f) => f.id === 'micro_magnetron_waveguide');
      if (fault) setActiveFault(fault);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="logo-shield">
            <Wrench size={24} className="logo-icon" />
          </div>
          <div>
            <h1 className="brand-title">{SHOP_METRICS.shopName}</h1>
            <p className="brand-subtitle">
              {SHOP_METRICS.subtitle} • <strong>Module 3 Core Implementation (Arik)</strong>
            </p>
          </div>
        </div>

        <div className="header-controls">
          <div className="live-pill">
            <span className="live-dot" />
            <span>Developer: <strong>Arik (Member 3 Lead)</strong></span>
          </div>

          <div className="preset-selector">
            <span className="preset-label">
              <Sparkles size={14} /> Test Scenarios for Arik's Part:
            </span>
            <button type="button" className="preset-btn" onClick={() => loadScenario('ber_fridge')}>
              Compressor (BER Alert)
            </button>
            <button type="button" className="preset-btn" onClick={() => loadScenario('safe_washer')}>
              Belt (Safe Repair)
            </button>
            <button type="button" className="preset-btn" onClick={() => loadScenario('micro_arcing')}>
              Magnetron (BER)
            </button>
          </div>
        </div>
      </header>

      {/* Team Ribbon showing division of work */}
      <section className="architecture-ribbon">
        <div className="arch-item">
          <span className="arch-num">M1</span>
          <div className="arch-text">
            <strong>Member 1 (Alif)</strong>
            <span>Symptom Intake [Scaffold]</span>
          </div>
        </div>
        <div className="arch-arrow">→</div>
        <div className="arch-item">
          <span className="arch-num">M2</span>
          <div className="arch-text">
            <strong>Member 2 (Nahid)</strong>
            <span>Triage Engine [Scaffold]</span>
          </div>
        </div>
        <div className="arch-arrow">→</div>
        <div className="arch-item arch-highlight">
          <span className="arch-num">M3</span>
          <div className="arch-text">
            <strong>Member 3 (Arik) — FULL IMPLEMENTATION</strong>
            <span>Cost to Guessing Meter, Margin Simulator, BER Alert & Intake Ticket</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Member 1 & 2 side scaffold columns, Member 3 prominent */}
      <main className="main-content-grid team-layout">
        <div className="grid-column col-step1">
          <SymptomIntake
            selectedAppliance={selectedAppliance}
            onSelectAppliance={setSelectedAppliance}
            selectedComplaint={selectedComplaint}
            onSelectComplaint={setSelectedComplaint}
            customNote={customNote}
            onChangeCustomNote={setCustomNote}
            applianceAge={applianceAge}
            onChangeApplianceAge={setApplianceAge}
          />
        </div>

        <div className="grid-column col-step2">
          <FaultDiagnosis
            detectedFaults={detectedFaults}
            activeFault={activeFault}
            onSelectFault={setActiveFault}
          />
        </div>

        <div className="grid-column col-step3 arik-core-focus">
          <CostGuardrail
            activeFault={activeFault}
            detectedFaults={detectedFaults}
            selectedAppliance={selectedAppliance}
            selectedComplaint={selectedComplaint}
            customNote={customNote}
            applianceAge={applianceAge}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span>SE 331 Live Coding Assessment</span>
          <span className="dot-sep">•</span>
          <span>Member 1 (Alif) &amp; Member 2 (Nahid) Scaffolds Preserved</span>
        </div>
        <div className="footer-right">
          <span>Git Branch: <strong>Arik</strong></span>
          <span className="dot-sep">•</span>
          <span>Module 3: <strong>Cost to Guessing &amp; Quote Guardrail (Done)</strong></span>
        </div>
      </footer>
    </div>
  );
}
