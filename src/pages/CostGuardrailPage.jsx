import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CostGuardrail from '../components/CostGuardrail';
import { SHOP_METRICS } from '../data/mockDiagnostics';
import { useData } from '../context/DataContext';
import {
  Wrench,
  Sparkles,
  CheckCircle2,
  User,
  FileText,
  ArrowRight,
  ShieldAlert,
  ClipboardList,
  Layers
} from 'lucide-react';

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
    title: 'Washer: Water Leak / Jammed Pump',
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

export default function CostGuardrailPage() {
  const { complaints } = useData();
  const location = useLocation();

  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [selectedLiveTicketId, setSelectedLiveTicketId] = useState('');

  // Check if routed from a specific ticket
  const initialTicket = location.state?.selectedComplaint || null;
  const liveTicket = complaints.find((c) => c.id === selectedLiveTicketId) || initialTicket;

  const currentScenario = LIVE_TEST_SCENARIOS[activeScenarioIndex];

  // Effective payload
  const effectiveComplaint = liveTicket || currentScenario.complaint;
  const effectiveDiagnosis = liveTicket
    ? {
        faultId: `FLT-${liveTicket.applianceType.slice(0, 3).toUpperCase()}-AUTO`,
        appliance: liveTicket.applianceType,
        likelyFault: `${liveTicket.issueCategory} - Component Diagnostics Required`,
        confidence: '90% (High)',
        isDangerous: liveTicket.priority === 'Urgent',
        safetyWarning:
          liveTicket.priority === 'Urgent'
            ? 'SAFETY ALERT: Disconnect appliance immediately to prevent short circuit hazard.'
            : null,
        recommendation: `Inspect ${liveTicket.brand} ${liveTicket.applianceType} internal coils, motor, and PCB circuits.`
      }
    : currentScenario.diagnosis;

  const effectiveAge = liveTicket ? 4 : currentScenario.applianceAge;

  return (
    <div className="page-container cost-guardrail-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Repair Cost Estimation System</h1>
          <p className="page-subtitle">
            Module 3 Engine: Bench repair cost modeling, BER threshold checks, and customer quote generation in Bangladeshi Taka (৳ BDT).
          </p>
        </div>
        <div className="live-pill">
          <span className="live-dot" />
          <span>Counter Status: <strong>Ready for Customer</strong></span>
        </div>
      </div>

      {/* Scenario / Live Ticket Selector Bar */}
      <div className="card filter-card mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-muted uppercase flex items-center gap-1">
              <Sparkles size={14} className="text-amber-500" /> Triage Scenarios:
            </span>
            {LIVE_TEST_SCENARIOS.map((scen, idx) => (
              <button
                key={scen.id}
                type="button"
                className={`preset-btn ${!liveTicket && activeScenarioIndex === idx ? 'active-preset' : ''}`}
                onClick={() => {
                  setSelectedLiveTicketId('');
                  setActiveScenarioIndex(idx);
                }}
              >
                {scen.title}
              </button>
            ))}
          </div>

          {/* Or Pick Live Ticket */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase">Or Live Ticket:</span>
            <select
              className="form-select form-select-sm"
              value={selectedLiveTicketId}
              onChange={(e) => setSelectedLiveTicketId(e.target.value)}
            >
              <option value="">-- Select Registered Complaint --</option>
              {complaints.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.customerName} ({c.applianceType})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Inbound Payloads (M1 & M2) + Arik's Cost Guardrail (M3) */}
      <div className="main-content-grid merge-layout">
        {/* Left Column: Live Inbound Payload Feed from Member 1 & 2 */}
        <div className="grid-column col-feed">
          {/* Member 1 Inbound Complaint Card */}
          <div className="card feed-card">
            <div className="card-header">
              <span className="step-tag">Inbound Stream • Member 1 (Intake)</span>
              <h2>Customer Intake Record</h2>
              <p className="subtitle">Verified ticket from customer registration desk.</p>
            </div>

            <div className="feed-details-box">
              <div className="feed-row">
                <span className="feed-label">Ticket ID:</span>
                <span className="feed-val font-mono font-bold text-primary">
                  {effectiveComplaint.id}
                </span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Customer:</span>
                <span className="feed-val font-semibold">{effectiveComplaint.customerName}</span>
                <span className="feed-sub">({effectiveComplaint.customerPhone})</span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Appliance Item:</span>
                <span className="feed-val font-bold">
                  {effectiveComplaint.brand} {effectiveComplaint.applianceType}
                </span>
                <span className="feed-sub">Est. Age: {effectiveAge} Years</span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Complaint:</span>
                <span className="feed-val italic">"{effectiveComplaint.description}"</span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Priority:</span>
                <span className="badge badge-priority">{effectiveComplaint.priority}</span>
              </div>
            </div>
          </div>

          {/* Member 2 Inbound Diagnosis Card */}
          <div className="card feed-card mt-4">
            <div className="card-header">
              <span className="step-tag">Diagnostic Stream • Member 2 (Diagnosis)</span>
              <h2>Diagnosis Engine Output</h2>
              <p className="subtitle">Automated rule evaluation &amp; safety triage.</p>
            </div>

            <div className="feed-details-box">
              <div className="feed-row">
                <span className="feed-label">Identified Fault:</span>
                <span className="feed-val font-bold text-primary">
                  {effectiveDiagnosis.likelyFault}
                </span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Confidence:</span>
                <span className="feed-val">{effectiveDiagnosis.confidence || '92% (High)'}</span>
              </div>
              <div className="feed-row">
                <span className="feed-label">Bench Recommendation:</span>
                <span className="feed-val text-muted">{effectiveDiagnosis.recommendation}</span>
              </div>
              {effectiveDiagnosis.isDangerous && (
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
            complaint={effectiveComplaint}
            diagnosis={effectiveDiagnosis}
            applianceAge={effectiveAge}
          />
        </div>
      </div>
    </div>
  );
}
