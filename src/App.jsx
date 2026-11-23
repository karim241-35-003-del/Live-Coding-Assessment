import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_FAULTS, APPLIANCE_TYPES, SHOP_METRICS } from './data/mockDiagnostics';
import SymptomIntake from './components/SymptomIntake';
import FaultDiagnosis from './components/FaultDiagnosis';
import CostGuardrail from './components/CostGuardrail';
import { Wrench, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import './index.css';

export default function App() {
  const [selectedAppliance, setSelectedAppliance] = useState('fridge');
  const [selectedComplaint, setSelectedComplaint] = useState('noise');
  const [customNote, setCustomNote] = useState('Humming loudly, food starting to spoil');
  const [answers, setAnswers] = useState({ q_warm: true, q_clicking: false });
  const [applianceAge, setApplianceAge] = useState(6);
  const [activeFault, setActiveFault] = useState(null);

  // Dynamic Triage Engine to compute detectedFaults based on state
  const detectedFaults = useMemo(() => {
    if (!selectedAppliance) return [];

    let candidates = MOCK_FAULTS.filter((f) => f.appliance === selectedAppliance);

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

    scored.sort((a, b) => b.triageScore - a.triageScore);
    return scored.slice(0, 3);
  }, [selectedAppliance, selectedComplaint, answers]);

  useEffect(() => {
    if (detectedFaults.length > 0) {
      const match = detectedFaults.find((f) => f.id === activeFault?.id);
      if (!match) {
        setActiveFault(detectedFaults[0]);
      }
    } else {
      setActiveFault(null);
    }
  }, [detectedFaults]);

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

  // Quick diagnostic scenarios for customer intake testing
  const loadScenario = (type) => {
    if (type === 'ber_fridge') {
      setSelectedAppliance('fridge');
      setSelectedComplaint('noise');
      setAnswers({ q_warm: true, q_clicking: false });
      setApplianceAge(8);
      setCustomNote('Samsung French Door, food spoiled in top compartment, loud buzzing.');
      const fault = MOCK_FAULTS.find((f) => f.id === 'fridge_compressor_failure');
      if (fault) setActiveFault(fault);
    } else if (type === 'safe_washer') {
      setSelectedAppliance('washing_machine');
      setSelectedComplaint('burning_smell');
      setAnswers({ q_rubber_smell: true });
      setApplianceAge(3);
      setCustomNote('LG Front Loader, belt burning smell during spin, tub not turning.');
      const fault = MOCK_FAULTS.find((f) => f.id === 'washer_drive_belt');
      if (fault) setActiveFault(fault);
    } else if (type === 'micro_arcing') {
      setSelectedAppliance('microwave');
      setSelectedComplaint('burning_smell');
      setAnswers({ q_sparks_visible: true });
      setApplianceAge(5);
      setCustomNote('Panasonic Inverter, lightning flashes near waveguide cover.');
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
              {SHOP_METRICS.subtitle} • <strong>Counter Workstation</strong>
            </p>
          </div>
        </div>

        <div className="header-controls">
          <div className="live-pill">
            <span className="live-dot" />
            <span>Counter Status: <strong>Ready for Customer</strong></span>
          </div>

          <div className="preset-selector">
            <span className="preset-label">
              <Sparkles size={14} /> Quick Triage Presets:
            </span>
            <button type="button" className="preset-btn" onClick={() => loadScenario('ber_fridge')}>
              Fridge (Compressor Risk)
            </button>
            <button type="button" className="preset-btn" onClick={() => loadScenario('safe_washer')}>
              Washer (Drive Belt)
            </button>
            <button type="button" className="preset-btn" onClick={() => loadScenario('micro_arcing')}>
              Microwave (Waveguide Arcing)
            </button>
          </div>
        </div>
      </header>

      {/* Modern Workflow Progress Banner */}
      <section className="workflow-steps-ribbon">
        <div className="workflow-step active">
          <span className="step-circle">1</span>
          <div className="step-info">
            <span className="step-title">Customer &amp; Symptom Intake</span>
            <span className="step-desc">Appliance type, reported complaint &amp; triage</span>
          </div>
        </div>
        <div className="workflow-arrow">›</div>
        <div className="workflow-step active">
          <span className="step-circle">2</span>
          <div className="step-info">
            <span className="step-title">Fault Triage &amp; Bench Card</span>
            <span className="step-desc">Component matching &amp; bench hand-off</span>
          </div>
        </div>
        <div className="workflow-arrow">›</div>
        <div className="workflow-step active highlight-step">
          <span className="step-circle">3</span>
          <div className="step-info">
            <span className="step-title">Quote Guardrail &amp; Receipt</span>
            <span className="step-desc">BER alert, margin simulator &amp; intake slip</span>
          </div>
        </div>
      </section>

      {/* Main 3-Column Counter Grid */}
      <main className="main-content-grid">
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

        <div className="grid-column col-step2">
          <FaultDiagnosis
            detectedFaults={detectedFaults}
            activeFault={activeFault}
            onSelectFault={setActiveFault}
          />
        </div>

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
      </main>

      {/* Business Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span>{SHOP_METRICS.shopName} • Certified Bench Diagnostics &amp; Intake Counter System</span>
          <span className="dot-sep">•</span>
          <span>Hourly Bench Rate: ${SHOP_METRICS.hourlyBenchRate}/hr • Min Deposit: ${SHOP_METRICS.minDiagnosticInspectionFee}</span>
        </div>
        <div className="footer-right">
          <span>Counter Desk Terminal 01</span>
          <span className="dot-sep">•</span>
          <span>Non-Binding Quote Guardrail Active</span>
        </div>
      </footer>
    </div>
  );
}
