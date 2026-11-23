import React, { useState } from 'react';
import CostGuardrail from './components/CostGuardrail';
import { SHOP_METRICS } from './data/mockDiagnostics';
import { Wrench, Sparkles, CheckCircle2, User, FileText, ArrowRight } from 'lucide-react';
import './index.css';

/**
 * Live Demonstration Harness for Module 3 (Arik)
 * Feeds sample complaint payloads (Member 1) and diagnosis payloads (Member 2)
 * directly into Arik's CostGuardrail component to verify seamless merge compatibility.
 */
const LIVE_TEST_SCENARIOS = [
  {
    id: 'scen_fridge_relay',
    title: 'Fridge: Noise & Not Cooling',
    complaint: {
      id: 'CMP-REF-001',
      customerName: 'Rahim Chowdhury',
      customerPhone: '01712345678',
      applianceType: 'Refrigerator',
      brand: 'Walton',
      issueCategory: 'Not Cooling',
      description: 'Loud rattling/clicking noise from back, food inside is not cold at all.',
      priority: 'High'
    },
    diagnosis: {
      faultId: 'FLT-REF-001',
      appliance: 'Refrigerator',
      likelyFault: 'Evaporator Fan Motor or Compressor Relay Failure',
      confidenceLevel: 'High',
      confidenceScore: 88,
      confidence: '88% (High)',
      isDangerous: false,
      safetyWarning: null,
      recommendation: 'Check relay coil Ohmic resistance and test evaporator fan voltage.'
    },
    applianceAge: 4
  },
  {
    id: 'scen_washer_ber',
    title: 'Washer: Drum Bearings (BER Alert)',
    complaint: {
      id: 'CMP-WM-002',
      customerName: 'Nusrat Jahan',
      customerPhone: '01898765432',
      applianceType: 'Washing Machine',
      brand: 'Samsung',
      issueCategory: 'Making Noise',
      description: 'Deafening jet-engine roar during high spin cycle, tub wobbles violently.',
      priority: 'Medium'
    },
    diagnosis: {
      faultId: 'FLT-WM-003',
      appliance: 'Washing Machine',
      likelyFault: 'Worn Drum Bearings or Broken Suspension Damper Rods',
      confidenceLevel: 'High',
      confidenceScore: 92,
      confidence: '92% (High)',
      isDangerous: false,
      safetyWarning: null,
      recommendation: 'Full tub teardown required. Bearings and spider arm collapsed.'
    },
    applianceAge: 8
  },
  {
    id: 'scen_micro_sparks',
    title: 'Microwave: Sparks & Arcing (Safety & BER)',
    complaint: {
      id: 'CMP-MIC-005',
      customerName: 'Kamrul Islam',
      customerPhone: '01911223344',
      applianceType: 'Microwave',
      brand: 'Panasonic',
      issueCategory: 'Sparks / Burning',
      description: 'Violent electrical fireworks flashing along the right wall whenever heating starts.',
      priority: 'Urgent'
    },
    diagnosis: {
      faultId: 'FLT-MIC-SAFE-01',
      appliance: 'Microwave',
      likelyFault: 'High-Voltage Arcing & Waveguide Breakdown',
      confidenceLevel: 'High',
      confidenceScore: 95,
      confidence: '95% (High)',
      isDangerous: true,
      safetyWarning: 'CRITICAL SAFETY HAZARD: DO NOT OPERATE / UNPLUG IMMEDIATELY! Severe risk of electrical fire or lethal shock.',
      recommendation: 'Unplug unit. Inspect mica waveguide cover and magnetron antenna dome.'
    },
    applianceAge: 5
  },
  {
    id: 'scen_washer_pump',
    title: 'Washer: Water Leak / Jammed Pump (Safe Repair)',
    complaint: {
      id: 'CMP-WM-004',
      customerName: 'Farhana Akter',
      customerPhone: '01655443322',
      applianceType: 'Washing Machine',
      brand: 'LG',
      issueCategory: 'Water Leaking',
      description: 'Water leaking from the bottom during drain cycle, standing water in tub.',
      priority: 'Medium'
    },
    diagnosis: {
      faultId: 'FLT-WM-002',
      appliance: 'Washing Machine',
      likelyFault: 'Clogged Drain Coin Trap or Seized Drain Pump Motor',
      confidenceLevel: 'High',
      confidenceScore: 90,
      confidence: '90% (High)',
      isDangerous: false,
      safetyWarning: null,
      recommendation: 'Check pump impeller for foreign coins/bobby pins; test motor resistance.'
    },
    applianceAge: 3
  }
];

export default function App() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const currentScenario = LIVE_TEST_SCENARIOS[activeScenarioIndex];

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
              <Sparkles size={14} /> Triage Scenarios:
            </span>
            {LIVE_TEST_SCENARIOS.map((scen, idx) => (
              <button
                key={scen.id}
                type="button"
                className={`preset-btn ${activeScenarioIndex === idx ? 'active-preset' : ''}`}
                onClick={() => setActiveScenarioIndex(idx)}
              >
                {scen.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main 2-Column Dashboard: Live Intake Feed (M1 & M2) + Arik's Cost Guardrail (M3) */}
      <main className="main-content-grid merge-layout">
        {/* Left Column: Live Inbound Payload Feed from Member 1 & 2 */}
        <div className="grid-column col-feed">
          {/* Member 1 Inbound Complaint Card */}
          <div className="card feed-card">
            <div className="card-header">
              <span className="step-tag">Inbound Stream • Member 1</span>
              <h2>Customer Intake Record</h2>
              <p className="subtitle">Data received from customer registration desk.</p>
            </div>

            <div className="feed-details-box">
              <div className="feed-row">
                <span className="feed-label">Customer:</span>
                <span className="feed-val">{currentScenario.complaint.customerName}</span>
                <span className="feed-sub">({currentScenario.complaint.customerPhone})</span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Appliance Item:</span>
                <span className="feed-val font-bold">
                  {currentScenario.complaint.brand} {currentScenario.complaint.applianceType}
                </span>
                <span className="feed-sub">Est. Age: {currentScenario.applianceAge} Years</span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Complaint:</span>
                <span className="feed-val italic">"{currentScenario.complaint.description}"</span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Priority:</span>
                <span className="badge badge-priority">{currentScenario.complaint.priority}</span>
              </div>
            </div>
          </div>

          {/* Member 2 Inbound Diagnosis Card */}
          <div className="card feed-card">
            <div className="card-header">
              <span className="step-tag">Diagnostic Stream • Member 2</span>
              <h2>Diagnosis Engine Output</h2>
              <p className="subtitle">Automated rule evaluation &amp; safety triage.</p>
            </div>

            <div className="feed-details-box">
              <div className="feed-row">
                <span className="feed-label">Identified Fault:</span>
                <span className="feed-val font-bold text-primary">
                  {currentScenario.diagnosis.likelyFault}
                </span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Confidence:</span>
                <span className="feed-val">{currentScenario.diagnosis.confidence}</span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Bench Recommendation:</span>
                <span className="feed-val text-muted">{currentScenario.diagnosis.recommendation}</span>
              </div>
              {currentScenario.diagnosis.isDangerous && (
                <div className="feed-row text-danger font-bold">
                  <span>⚠️ Safety Alert: Critical Danger Flagged</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Arik's Core Module 3 (Cost Guardrail) */}
        <div className="grid-column col-guardrail">
          <CostGuardrail
            complaint={currentScenario.complaint}
            diagnosis={currentScenario.diagnosis}
            applianceAge={currentScenario.applianceAge}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span>{SHOP_METRICS.shopName} • Certified Bench Diagnostics &amp; Intake Counter System</span>
          <span className="dot-sep">•</span>
          <span>Seamless Integration Interface: Member 1 (Intake) + Member 2 (Diagnosis) + Member 3 (Cost Guardrail)</span>
        </div>
        <div className="footer-right">
          <span>Counter Desk Terminal 01</span>
          <span className="dot-sep">•</span>
          <span>Quote Guardrail: <strong>Active</strong></span>
        </div>
      </footer>
    </div>
  );
}
