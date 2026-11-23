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
  getCostDataForDiagnosis,
  CURRENCY
} from '../data/mockDiagnostics';

/**
 * =======================================================================
 * FINAL DELIVERABLE: Cost Estimation & Quote Risk Engine (Module 3)
 * Jamal's Appliance Care — Configured in Bangladeshi Taka (৳ BDT)
 * -----------------------------------------------------------------------
 * Seamless Integration Interface:
 * - Accepts `diagnosis` object from Member 2's DiagnosisEngine
 * - Accepts `complaint` object from Member 1's Customer Intake
 * - All calculations in Bangladeshi Taka (৳ BDT)
 * =======================================================================
 */
export default function CostGuardrail({
  // Direct integration props from Member 1 & 2
  diagnosis,
  complaint,

  // Fallback / Standalone testing props
  activeFault,
  selectedAppliance,
  selectedComplaint,
  customNote,
  applianceAge: propApplianceAge = 5
}) {
  // Resolve Appliance Name
  const applianceName = useMemo(() => {
    if (complaint?.applianceType) return complaint.applianceType;
    if (selectedAppliance) return selectedAppliance;
    if (diagnosis?.appliance) return diagnosis.appliance;
    return 'Refrigerator';
  }, [complaint, selectedAppliance, diagnosis]);

  // Resolve Diagnosis Payload
  const diagnosisData = useMemo(() => {
    if (diagnosis) return diagnosis;
    if (activeFault) return { likelyFault: activeFault.faultName || activeFault.name, ...activeFault };
    return {
      likelyFault: "Standard Component Diagnostic Inspection",
      confidence: "88% (High)",
      isDangerous: false
    };
  }, [diagnosis, activeFault]);

  // Resolve Benchmark Specs for this appliance
  const applianceBenchmark = useMemo(() => {
    return APPLIANCE_BENCHMARKS[applianceName] || APPLIANCE_BENCHMARKS.Refrigerator;
  }, [applianceName]);

  // Lookup cost benchmarks & cost estimation for this exact diagnosis in Taka
  const costProfile = useMemo(() => {
    return getCostDataForDiagnosis(diagnosisData, applianceName);
  }, [diagnosisData, applianceName]);

  // Local State
  const [localAge, setLocalAge] = useState(propApplianceAge || 5);
  const [quoteMode, setQuoteMode] = useState('safe'); // 'safe' (Range) | 'risky' (Fixed Single Dollar Guess)
  const [fixedGuessAmount, setFixedGuessAmount] = useState(costProfile.minCost);
  const [customerAcknowledged, setCustomerAcknowledged] = useState(false);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Editable customer info
  const [customerName, setCustomerName] = useState(complaint?.customerName || 'Tanvir Ahmed');
  const [customerPhone, setCustomerPhone] = useState(complaint?.customerPhone || '01711223344');
  const complaintDescription = complaint?.description || selectedComplaint?.complaintText || customNote || "Appliance experiencing performance issue.";

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

  // Derived financial & estimation metrics (in ৳ BDT)
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

  // BER (Beyond Economical Repair) evaluation:
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
    return `JAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }, [ticketGenerated]);

  const handleCopySlip = () => {
    const slipText = `
=========================================
  ${SHOP_METRICS.shopName.toUpperCase()}
  PRE-INSPECTION COST ESTIMATION RECEIPT (৳ BDT)
  Ticket ID: ${ticketId}
  Date: ${new Date().toLocaleDateString()}
=========================================
CUSTOMER: ${customerName} | Phone: ${customerPhone}
APPLIANCE: ${applianceName} (Estimated Age: ${localAge} yrs)
COMPLAINT: ${complaintDescription}

DIAGNOSIS (Member 2 Triage Engine):
- Fault: ${costProfile.faultName}
- Confidence: ${diagnosisData.confidence || `${diagnosisData.confidenceScore || 85}% (${diagnosisData.confidenceLevel || 'High'})`}
${diagnosisData.isDangerous ? `* SAFETY HAZARD: ${diagnosisData.safetyWarning || 'Immediate inspection required'}\n` : ''}
ESTIMATED BENCH REPAIR RANGE:
৳ ${minCost.toLocaleString()} – ৳ ${maxCost.toLocaleString()} BDT (Pending physical bench teardown)

LEGAL COUNTER ESTIMATION CLAUSE:
"${SHOP_METRICS.disclaimerText}"

CUSTOMER ACKNOWLEDGMENT:
[X] Customer agreed to non-binding estimate range in Bangladeshi Taka.
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
        <span className="step-tag primary-tag">Step 3 of 3 • Cost Estimation</span>
        <h2>Repair Cost Estimation &amp; Quote Risk Engine</h2>
        <p className="subtitle">
          Prevents counter fixed-quote traps, flags beyond-economical-repair units on Day 1, and prints customer receipts in Bangladeshi Taka (৳ BDT).
        </p>
      </div>

      {/* Safety Hazard Alert if flagged by Member 2 */}
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
                <span className="badge badge-danger">CRITICAL BER ALERT</span>
                <h3>NOT WORTH REPAIRING — Advise Customer on Day 1!</h3>
              </div>
              <p className="alert-description">
                <strong>Why advise customer immediately?</strong> Estimated repair cost reaches{' '}
                <strong>৳ {maxCost.toLocaleString()} BDT</strong> ({Math.round(repairToNewRatio)}% of a new replacement unit at ~৳ {replacementValue.toLocaleString()} BDT), 
                and exceeds <strong>{Math.round(repairToDepreciatedRatio)}%</strong> of its depreciated residual value (~৳ {depreciatedValue.toLocaleString()} BDT) at{' '}
                <strong>{localAge} years old</strong>. Sinking money into bench labor will leave the customer resentful.
              </p>

              <div className="ber-metric-cards">
                <div className="ber-mini-card">
                  <span className="mini-label">Worst-Case Repair</span>
                  <span className="mini-val text-danger">৳ {maxCost.toLocaleString()}</span>
                </div>
                <div className="ber-mini-card">
                  <span className="mini-label">Replacement Value</span>
                  <span className="mini-val">৳ {replacementValue.toLocaleString()}</span>
                </div>
                <div className="ber-mini-card">
                  <span className="mini-label">Depreciated Value</span>
                  <span className="mini-val text-muted">৳ {depreciatedValue.toLocaleString()}</span>
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
                  can reach up to <strong>৳ {maxCost.toLocaleString()} BDT</strong>, spending that much on an older machine rarely makes sense 
                  when replacement units start around <strong>৳ {replacementValue.toLocaleString()} BDT</strong>. We strongly recommend recycling 
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
                Estimated repair range (<strong>৳ {minCost.toLocaleString()} – ৳ {maxCost.toLocaleString()} BDT</strong>) represents only 
                <strong> {Math.round(repairToNewRatio)}%</strong> of replacement value (~৳ {replacementValue.toLocaleString()} BDT). 
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
            <span>৳</span> Safe Estimated Cost Range &amp; Variance Meter (BDT)
          </label>
          <span className="variance-pill">
            Diagnosis Spread: <strong>+৳ {variance.toLocaleString()} BDT</strong>
          </span>
        </div>

        <div className="range-display-container">
          <div className="range-box min-range">
            <span className="range-label">Best-Case / Minor Part</span>
            <span className="range-amount">৳ {minCost.toLocaleString()}</span>
            <span className="range-sub">e.g. Cleanout / Relay / Switch</span>
          </div>

          <div className="range-arrow-zone">
            <div className="spread-line">
              <span>BENCH SPREAD: ৳ {minCost.toLocaleString()} to ৳ {maxCost.toLocaleString()}</span>
            </div>
            <ArrowRight size={24} className="spread-arrow" />
          </div>

          <div className="range-box max-range">
            <span className="range-label">Worst-Case / Core Assembly</span>
            <span className="range-amount">৳ {maxCost.toLocaleString()}</span>
            <span className="range-sub">e.g. Compressor / Tub / Magnetron</span>
          </div>
        </div>

        {/* Visual Variance Meter */}
        <div className="variance-meter-block">
          <div className="meter-label-row">
            <span>Intake Quote Confidence Level</span>
            <span className={variance > 5000 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
              {variance > 5000 ? 'HIGH VARIANCE RISK (Inspection Mandatory)' : variance > 2500 ? 'MODERATE SPREAD' : 'TIGHT CONFIDENCE'}
            </span>
          </div>
          <div className="meter-bar-track">
            <div
              className={`meter-bar-fill ${
                variance > 5000 ? 'fill-danger' : variance > 2500 ? 'fill-amber' : 'fill-success'
              }`}
              style={{ width: `${Math.min(100, Math.max(25, (variance / 8000) * 100))}%` }}
            />
          </div>
          <p className="guardrail-rule-text">
            <strong>The "Cost to Guessing" Problem:</strong> Never quote a single fixed price over the counter! 
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
              By quoting the customer the full range of <strong>৳ {minCost.toLocaleString()} – ৳ {maxCost.toLocaleString()} BDT</strong> and taking the 
              <strong> ৳ {SHOP_METRICS.minDiagnosticInspectionFee} inspection deposit</strong>, the shop sets correct expectations 
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
              <span className="margin-loss-text">Potential Shop Deficit: -৳ {simulatedShopLoss.toLocaleString()}</span>
            </div>

            <div className="interactive-slider-box">
              <div className="slider-label-row">
                <label>Assistant Promises a Single Fixed Price Guess:</label>
                <span className="simulated-guess-badge">৳ {Number(fixedGuessAmount).toLocaleString()} BDT</span>
              </div>
              <input
                type="range"
                min={minCost}
                max={maxCost}
                step="100"
                value={fixedGuessAmount}
                onChange={(e) => setFixedGuessAmount(Number(e.target.value))}
                className="guess-slider"
              />
              <div className="slider-markers">
                <span>Optimistic Min: ৳ {minCost.toLocaleString()}</span>
                <span>Midpoint: ৳ {Math.round((minCost + maxCost) / 2).toLocaleString()}</span>
                <span>Max Ceiling: ৳ {maxCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="loss-breakdown-card">
              <div className="loss-summary-row">
                <div className="loss-col">
                  <span className="loss-sub">Promised to Customer:</span>
                  <span className="loss-num text-info">৳ {Number(fixedGuessAmount).toLocaleString()}</span>
                </div>
                <div className="loss-math-symbol">-</div>
                <div className="loss-col">
                  <span className="loss-sub">Actual High-Tier Cost:</span>
                  <span className="loss-num text-danger">৳ {maxCost.toLocaleString()}</span>
                </div>
                <div className="loss-math-symbol">=</div>
                <div className="loss-col">
                  <span className="loss-sub">Shop Unrecovered Loss:</span>
                  <span className="loss-num text-danger font-bold">
                    ৳ {simulatedShopLoss.toLocaleString()} ({lossPercentage}% deficit)
                  </span>
                </div>
              </div>

              {simulatedShopLoss > 0 ? (
                <div className="loss-consequence-alert">
                  <TrendingDown size={18} className="text-danger" />
                  <div>
                    <strong>Counter Backlash:</strong> Customer arrives to pick up the appliance, sees a bill for <strong>৳ {maxCost.toLocaleString()} BDT</strong>, 
                    and claims: <em>"The person at the desk promised it would only cost ৳ {Number(fixedGuessAmount).toLocaleString()}!"</em>. 
                    Jamal's shop either absorbs the <strong>৳ {simulatedShopLoss.toLocaleString()} loss</strong> out of pocket or suffers a dispute.
                  </div>
                </div>
              ) : (
                <div className="loss-consequence-alert neutral">
                  <Info size={18} />
                  <div>
                    You quoted the absolute maximum ceiling (৳ {maxCost.toLocaleString()}). While this protects margin, without quoting a range (৳ {minCost.toLocaleString()} – ৳ {maxCost.toLocaleString()}), many customers will walk out without leaving the unit.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. NON-BINDING INTAKE RECEIPT & COUNTER ESTIMATION */}
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
              placeholder="e.g. Tanvir Ahmed"
            />
          </div>
          <div className="input-field">
            <label>Customer Phone / Mobile:</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 017XXXXXXXX"
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
              <strong> ৳ {minCost.toLocaleString()} – ৳ {maxCost.toLocaleString()} BDT</strong> is a preliminary diagnostic range, and final repair cost will only be established after physical bench teardown.
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
                <span className="rd-price">৳ {minCost.toLocaleString()} – ৳ {maxCost.toLocaleString()} BDT</span>
              </div>
              <div className="rd-row">
                <span className="rd-label">Bench Inspection Deposit:</span>
                <span className="rd-val">৳ {SHOP_METRICS.minDiagnosticInspectionFee} BDT (Credited toward approved repair)</span>
              </div>
            </div>

            <div className="receipt-disclaimer-box">
              <div className="disclaimer-header">
                <ShieldAlert size={14} /> EXPLICIT COUNTER ESTIMATION CLAUSE:
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

// Aliases for compatibility
export { CostGuardrail as CostEstimation };
