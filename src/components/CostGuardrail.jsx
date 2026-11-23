import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  FileText,
  Printer,
  Copy,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Info,
  Sliders,
  Scale,
  Flame,
  Zap
} from 'lucide-react';
import {
  SHOP_METRICS,
  APPLIANCE_BENCHMARKS,
  getCostDataForDiagnosis
} from '../data/mockDiagnostics';

export default function CostGuardrail({
  diagnosis,
  complaint,
  activeFault,
  selectedAppliance,
  selectedComplaint,
  customNote,
  applianceAge: propApplianceAge = 6
}) {
  // Resolve Appliance Name
  const applianceName = useMemo(() => {
    if (diagnosis?.appliance) return diagnosis.appliance;
    if (complaint?.applianceType) return complaint.applianceType;
    if (selectedAppliance) {
      const lower = selectedAppliance.toLowerCase();
      if (lower.includes('fridge') || lower.includes('ref')) return 'Refrigerator';
      if (lower.includes('wash')) return 'Washing Machine';
      if (lower.includes('micro')) return 'Microwave';
    }
    return 'Refrigerator';
  }, [diagnosis, complaint, selectedAppliance]);

  // Resolve Diagnosis details
  const diagnosisData = useMemo(() => {
    return diagnosis || activeFault || {
      likelyFault: "Evaporator Fan Motor or Compressor Relay Failure",
      confidenceLevel: "High",
      confidenceScore: 88,
      isDangerous: false,
      safetyWarning: null,
      recommendation: "Inspect fan blades and check relay coil Ohmic resistance."
    };
  }, [diagnosis, activeFault]);

  // Lookup cost benchmarks & guardrails for this exact diagnosis
  const costProfile = useMemo(() => {
    return getCostDataForDiagnosis(diagnosisData, applianceName);
  }, [diagnosisData, applianceName]);

  const applianceBenchmark = useMemo(() => {
    return APPLIANCE_BENCHMARKS[applianceName] || APPLIANCE_BENCHMARKS.Refrigerator;
  }, [applianceName]);

  // Customer & Complaint Info
  const initialCustomerName = complaint?.customerName || 'Jane Doe';
  const initialCustomerPhone = complaint?.customerPhone || '(555) 019-2834';
  const complaintDescription = complaint?.description || customNote || selectedComplaint || 'Standard diagnostic inspection';

  // Interactive Local State
  const [localAge, setLocalAge] = useState(propApplianceAge);
  const [quoteMode, setQuoteMode] = useState('safe'); // 'safe' | 'risky'
  const [fixedGuessAmount, setFixedGuessAmount] = useState(costProfile.minCost);
  const [customerAcknowledged, setCustomerAcknowledged] = useState(false);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone);

  useEffect(() => {
    if (complaint?.customerName) setCustomerName(complaint.customerName);
    if (complaint?.customerPhone) setCustomerPhone(complaint.customerPhone);
  }, [complaint]);

  useEffect(() => {
    if (propApplianceAge !== undefined) setLocalAge(propApplianceAge);
  }, [propApplianceAge]);

  useEffect(() => {
    setFixedGuessAmount(costProfile.minCost);
    setTicketGenerated(false);
  }, [costProfile]);

  // Derived financial & guardrail metrics
  const minCost = costProfile.minCost;
  const maxCost = costProfile.maxCost;
  const variance = maxCost - minCost;
  const replacementValue = costProfile.replacementValue || applianceBenchmark.typicalReplacementValue;

  // Age-based depreciation calculation
  const depreciatedValue = useMemo(() => {
    const lifespan = applianceBenchmark.averageLifespanYears || 10;
    const factor = Math.max(0.15, 1 - (localAge / lifespan) * 0.75);
    return Math.round(replacementValue * factor);
  }, [replacementValue, localAge, applianceBenchmark]);

  // BER evaluation
  const repairToNewRatio = replacementValue > 0 ? (maxCost / replacementValue) * 100 : 0;
  const repairToDepreciatedRatio = depreciatedValue > 0 ? (maxCost / depreciatedValue) * 100 : 0;
  const isBER = Boolean(
    repairToNewRatio >= SHOP_METRICS.berThresholdPercent ||
    repairToDepreciatedRatio >= 65 ||
    costProfile.isWorthRepairing === false ||
    localAge >= 10
  );

  // Assistant Guess Simulator Deficit Math:
  const simulatedShopLoss = Math.max(0, maxCost - Number(fixedGuessAmount || 0));
  const lossPercentage = maxCost > 0 ? Math.round((simulatedShopLoss / maxCost) * 100) : 0;

  // Unique Counter Ticket ID
  const ticketId = useMemo(() => {
    return `JAR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }, [ticketGenerated]);

  const handleCopySlip = () => {
    const slipText = `
=========================================
  ${SHOP_METRICS.shopName.toUpperCase()}
  PRE-INSPECTION COUNTER INTAKE RECEIPT
  Ticket ID: ${ticketId}
  Date: ${new Date().toLocaleDateString()}
=========================================
CUSTOMER: ${customerName} | Phone: ${customerPhone}
APPLIANCE: ${applianceName} (Estimated Age: ${localAge} yrs)
COMPLAINT: ${complaintDescription}

DIAGNOSTIC HYPOTHESIS:
- Fault: ${costProfile.faultName}
- Confidence: ${diagnosisData.confidence || `${diagnosisData.confidenceScore || 85}% (${diagnosisData.confidenceLevel || 'High'})`}
${diagnosisData.isDangerous ? `* SAFETY HAZARD: ${diagnosisData.safetyWarning || 'Immediate inspection required'}\n` : ''}
ESTIMATED BENCH REPAIR RANGE:
$${minCost} – $${maxCost} (Pending bench physical teardown)

LEGAL COUNTER GUARDRAIL CLAUSE:
"${SHOP_METRICS.disclaimerText}"

CUSTOMER ACKNOWLEDGMENT:
[X] Customer verbally agreed to non-binding estimate range at counter.
Intake Specialist: ${SHOP_METRICS.intakeOfficer}
=========================================
    `.trim();

    navigator.clipboard.writeText(slipText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="card guardrail-card">
      <div className="card-header">
        <span className="step-tag primary-tag">Quote Guardrail &amp; Margin Protection</span>
        <h2>Estimated Cost Range &amp; Intake Receipt</h2>
        <p className="subtitle">
          Prevents counter fixed-quote traps, flags beyond-economical-repair units on Day 1, and prints customer receipts.
        </p>
      </div>

      {/* Safety Hazard Alert if flagged */}
      {diagnosisData.isDangerous && (
        <div className="alert-box alert-danger safety-hazard-banner">
          <div className="alert-icon-col">
            <Flame size={32} className="text-danger" />
          </div>
          <div className="alert-content-col">
            <span className="badge badge-danger">CRITICAL SAFETY HAZARD DETECTED</span>
            <h4>{diagnosisData.likelyFault || costProfile.faultName}</h4>
            <p className="alert-description">
              {diagnosisData.safetyWarning || "Severe electrical or thermal fire risk. Do not operate unit until physical bench test is completed."}
            </p>
          </div>
        </div>
      )}

      {/* 1. DAY-1 REPAIR VS. REPLACE (BER) ALERT BANNER */}
      <div className="section ber-section">
        {isBER ? (
          <div className="alert-box alert-danger">
            <div className="alert-icon-col">
              <ShieldAlert size={36} className="text-danger" />
            </div>
            <div className="alert-content-col">
              <div className="alert-heading-row">
                <span className="badge badge-danger">CRITICAL GUARDRAIL ALERT</span>
                <h3>NOT WORTH REPAIRING — Advise Customer on Day 1!</h3>
              </div>
              <p className="alert-description">
                <strong>Why advise customer immediately?</strong> Estimated repair cost reaches{' '}
                <strong>${maxCost}</strong> ({Math.round(repairToNewRatio)}% of a new replacement unit at ~${replacementValue}), 
                and exceeds <strong>{Math.round(repairToDepreciatedRatio)}%</strong> of its depreciated residual value (~${depreciatedValue}) at{' '}
                <strong>{localAge} years old</strong>. Sinking money into bench labor will leave the customer resentful.
              </p>

              <div className="ber-metric-cards">
                <div className="ber-mini-card">
                  <span className="mini-label">Worst-Case Repair</span>
                  <span className="mini-val text-danger">${maxCost}</span>
                </div>
                <div className="ber-mini-card">
                  <span className="mini-label">Replacement Value</span>
                  <span className="mini-val">${replacementValue}</span>
                </div>
                <div className="ber-mini-card">
                  <span className="mini-label">Depreciated Value</span>
                  <span className="mini-val text-muted">${depreciatedValue}</span>
                </div>
                <div className="ber-mini-card">
                  <span className="mini-label">Shop Threshold</span>
                  <span className="mini-val">50% Cap</span>
                </div>
              </div>

              <div className="counter-script-box">
                <div className="script-title">
                  <Scale size={15} /> Jamal's Counter Script for Assistant:
                </div>
                <p className="script-text">
                  "Mr./Mrs. Customer, because your {applianceName} is {localAge} years old and this repair 
                  can reach up to <strong>${maxCost}</strong>, spending that much on an older machine rarely makes sense 
                  when replacement units start around <strong>${replacementValue}</strong>. We strongly recommend recycling 
                  or replacing rather than leaving it in the shop for costly bench teardown."
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert-box alert-success">
            <div className="alert-icon-col">
              <ShieldCheck size={36} className="text-success" />
            </div>
            <div className="alert-content-col">
              <div className="alert-heading-row">
                <span className="badge badge-success">ECONOMICALLY VIABLE</span>
                <h3>Repair is Economically Viable &amp; Approved for Intake</h3>
              </div>
              <p className="alert-description">
                Estimated repair range (<strong>${minCost} – ${maxCost}</strong>) represents only 
                <strong> {Math.round(repairToNewRatio)}%</strong> of replacement value (~${replacementValue}). 
                At {localAge} years old, the unit has substantial service lifespan remaining.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. COST RANGE ESTIMATOR & VARIANCE RISK BAR */}
      <div className="section range-estimator-section">
        <div className="section-title-row">
          <label className="section-title">
            <DollarSign size={18} /> Safe Estimated Cost Range &amp; Variance Meter
          </label>
          <span className="variance-pill">
            Diagnosis Spread: <strong>+${variance} Variance</strong>
          </span>
        </div>

        <div className="range-display-container">
          <div className="range-box min-range">
            <span className="range-label">Best-Case / Minor Part</span>
            <span className="range-amount">${minCost}</span>
            <span className="range-sub">e.g. Cleanout / Relay / Switch</span>
          </div>

          <div className="range-arrow-zone">
            <div className="spread-line">
              <span>BENCH SPREAD: ${minCost} to ${maxCost}</span>
            </div>
            <ArrowRight size={24} className="spread-arrow" />
          </div>

          <div className="range-box max-range">
            <span className="range-label">Worst-Case / Core Assembly</span>
            <span className="range-amount">${maxCost}</span>
            <span className="range-sub">e.g. Compressor / Tub / Magnetron</span>
          </div>
        </div>

        {/* Visual Variance Meter */}
        <div className="variance-meter-block">
          <div className="meter-label-row">
            <span>Intake Quote Confidence Level</span>
            <span className={variance > 100 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
              {variance > 120 ? 'HIGH VARIANCE RISK (Inspection Mandatory)' : variance > 60 ? 'MODERATE SPREAD' : 'TIGHT CONFIDENCE'}
            </span>
          </div>
          <div className="meter-bar-track">
            <div
              className={`meter-bar-fill ${
                variance > 120 ? 'fill-danger' : variance > 60 ? 'fill-amber' : 'fill-success'
              }`}
              style={{ width: `${Math.min(100, Math.max(25, (variance / 220) * 100))}%` }}
            />
          </div>
          <p className="guardrail-rule-text">
            <strong>The "Cost to Guessing" Problem:</strong> Never give a single dollar promise over the counter! 
            An external symptom cannot distinguish a minor sub-part from a catastrophic assembly failure until the technician opens the chassis.
          </p>
        </div>
      </div>

      {/* 3. INTERACTIVE ASSISTANT GUESS SIMULATOR */}
      <div className="section simulator-section">
        <div className="simulator-header">
          <div className="sim-title">
            <Sliders size={18} />
            <h3 className="section-title">Assistant Guess Simulator / Margin Risk Calculator</h3>
          </div>
          <div className="toggle-pill-group">
            <button
              type="button"
              className={`toggle-pill ${quoteMode === 'safe' ? 'active-safe' : ''}`}
              onClick={() => setQuoteMode('safe')}
            >
              <ShieldCheck size={14} /> Safe Range Quote
            </button>
            <button
              type="button"
              className={`toggle-pill ${quoteMode === 'risky' ? 'active-risky' : ''}`}
              onClick={() => setQuoteMode('risky')}
            >
              <AlertTriangle size={14} /> Risky Fixed Guess
            </button>
          </div>
        </div>

        {quoteMode === 'safe' ? (
          <div className="simulator-safe-panel">
            <div className="panel-badge-row">
              <span className="badge badge-success">RECOMMENDED BEST PRACTICE</span>
              <span className="margin-safe-text">Margin Erosion Risk: 0%</span>
            </div>
            <h4>Guarding Counter Margins: Safe Range Strategy</h4>
            <p>
              By quoting the customer the full range of <strong>${minCost} – ${maxCost}</strong> and taking the 
              <strong> ${SHOP_METRICS.minDiagnosticInspectionFee} bench inspection deposit</strong>, the shop sets correct expectations 
              and protects profit margins regardless of what the technician finds inside.
            </p>
            <div className="safe-perks-row">
              <div className="perk-item">
                <CheckCircle size={16} className="text-success" />
                <span>Customer expects higher-tier cost if major assembly failed</span>
              </div>
              <div className="perk-item">
                <CheckCircle size={16} className="text-success" />
                <span>Zero unquoted parts costs absorbed by shop</span>
              </div>
              <div className="perk-item">
                <CheckCircle size={16} className="text-success" />
                <span>Protects technician bench time from billing disputes</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="simulator-risky-panel">
            <div className="panel-badge-row">
              <span className="badge badge-danger">PROFIT COLLAPSE HAZARD</span>
              <span className="margin-loss-text">Potential Shop Deficit: -${simulatedShopLoss}</span>
            </div>

            <div className="interactive-slider-box">
              <div className="slider-label-row">
                <label>Assistant Promises a Single Fixed Dollar Guess:</label>
                <span className="simulated-guess-badge">${fixedGuessAmount}</span>
              </div>
              <input
                type="range"
                min={minCost}
                max={maxCost}
                step="5"
                value={fixedGuessAmount}
                onChange={(e) => setFixedGuessAmount(Number(e.target.value))}
                className="guess-slider"
              />
              <div className="slider-markers">
                <span>Optimistic Min: ${minCost}</span>
                <span>Midpoint: ${Math.round((minCost + maxCost) / 2)}</span>
                <span>Max Ceiling: ${maxCost}</span>
              </div>
            </div>

            <div className="loss-breakdown-card">
              <div className="loss-summary-row">
                <div className="loss-col">
                  <span className="loss-sub">Promised to Customer:</span>
                  <span className="loss-num text-info">${fixedGuessAmount}</span>
                </div>
                <div className="loss-math-symbol">-</div>
                <div className="loss-col">
                  <span className="loss-sub">Actual High-Tier Cost:</span>
                  <span className="loss-num text-danger">${maxCost}</span>
                </div>
                <div className="loss-math-symbol">=</div>
                <div className="loss-col">
                  <span className="loss-sub">Shop Unrecovered Loss:</span>
                  <span className="loss-num text-danger font-bold">
                    ${simulatedShopLoss} ({lossPercentage}% deficit)
                  </span>
                </div>
              </div>

              {simulatedShopLoss > 0 ? (
                <div className="loss-consequence-alert">
                  <TrendingDown size={18} className="text-danger" />
                  <div>
                    <strong>Counter Backlash:</strong> Customer arrives to pick up the appliance, sees a bill for <strong>${maxCost}</strong>, 
                    and claims: <em>"The person at the desk promised it would only cost ${fixedGuessAmount}!"</em>. 
                    Jamal's shop either absorbs the <strong>${simulatedShopLoss} loss</strong> out of pocket or suffers a 1-star review.
                  </div>
                </div>
              ) : (
                <div className="loss-consequence-alert neutral">
                  <Info size={18} />
                  <div>
                    You quoted the absolute maximum ceiling ($${maxCost}). While this protects margin, without quoting a range ($${minCost} – $${maxCost}), many customers will walk out without leaving the unit.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. NON-BINDING INTAKE RECEIPT & COUNTER GUARDRAIL */}
      <div className="section intake-ticket-section">
        <div className="ticket-section-header">
          <FileText size={18} />
          <h3 className="section-title">Non-Binding Counter Intake Receipt</h3>
        </div>

        <div className="customer-info-inputs">
          <div className="input-field">
            <label>Customer Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div className="input-field">
            <label>Customer Phone / SMS:</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. (555) 019-2834"
            />
          </div>
        </div>

        {/* Mandatory Counter Acknowledgment Checkbox */}
        <div className="mandatory-guardrail-checkbox">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={customerAcknowledged}
              onChange={(e) => setCustomerAcknowledged(e.target.checked)}
            />
            <span className="checkbox-text">
              <strong>Mandatory Counter Check:</strong> Customer verbally acknowledged that 
              <strong> ${minCost} – ${maxCost}</strong> is a preliminary diagnostic range, and final repair cost will only be established after bench teardown.
            </span>
          </label>
        </div>

        <div className="action-button-row">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!customerAcknowledged}
            onClick={() => setTicketGenerated(true)}
          >
            <FileText size={16} /> Generate Counter Intake Ticket
          </button>
          {!customerAcknowledged && (
            <span className="ack-needed-hint">
              * Customer acknowledgment required before generating official intake receipt.
            </span>
          )}
        </div>

        {/* Printable Counter Receipt */}
        {ticketGenerated && (
          <div className="counter-receipt-card print-area">
            <div className="receipt-header">
              <div className="receipt-brand">
                <h3>{SHOP_METRICS.shopName.toUpperCase()}</h3>
                <p>Commercial &amp; Residential Appliance Diagnostics • Certified Bench Triage</p>
              </div>
              <div className="receipt-meta">
                <span className="receipt-tag">{ticketId}</span>
                <span className="receipt-date">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-grid">
              <div className="receipt-col">
                <span className="r-label">Customer:</span>
                <span className="r-val">{customerName}</span>
                <span className="r-sub">{customerPhone}</span>
              </div>
              <div className="receipt-col">
                <span className="r-label">Appliance Item:</span>
                <span className="r-val">{applianceName}</span>
                <span className="r-sub">Approx. Age: {localAge} Years</span>
              </div>
              <div className="receipt-col">
                <span className="r-label">Recorded Complaint:</span>
                <span className="r-val">"{complaintDescription}"</span>
                <span className="r-sub">Priority: {complaint?.priority || 'Standard'}</span>
              </div>
            </div>

            <div className="receipt-diagnosis-box">
              <div className="rd-row">
                <span className="rd-label">Diagnostic Hypothesis:</span>
                <strong className="rd-val">
                  {costProfile.faultName} ({diagnosisData.confidence || `${diagnosisData.confidenceScore || 85}%`})
                </strong>
              </div>
              <div className="rd-row">
                <span className="rd-label">Estimated Diagnostic Range:</span>
                <span className="rd-price">${minCost} – ${maxCost}</span>
              </div>
              <div className="rd-row">
                <span className="rd-label">Bench Inspection Deposit:</span>
                <span className="rd-val">${SHOP_METRICS.minDiagnosticInspectionFee} (Credited toward approved repair)</span>
              </div>
            </div>

            <div className="receipt-disclaimer-box">
              <div className="disclaimer-header">
                <ShieldAlert size={14} /> EXPLICIT COUNTER GUARDRAIL CLAUSE:
              </div>
              <p className="disclaimer-text">
                "{SHOP_METRICS.disclaimerText}"
              </p>
            </div>

            <div className="receipt-signatures">
              <div className="sig-block">
                <div className="sig-line" />
                <span>Customer Signature (Agreed to Range)</span>
              </div>
              <div className="sig-block">
                <div className="sig-line" />
                <span>Service Specialist: {SHOP_METRICS.intakeOfficer}</span>
              </div>
            </div>

            <div className="receipt-actions no-print">
              <button type="button" className="btn btn-secondary" onClick={handlePrintSlip}>
                <Printer size={16} /> Print Official Slip
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCopySlip}>
                {copied ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
                {copied ? 'Copied to Clipboard!' : 'Copy Text Receipt'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
