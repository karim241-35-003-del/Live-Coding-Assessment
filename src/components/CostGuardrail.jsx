import React, { useState, useMemo } from 'react';
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
  Scale
} from 'lucide-react';
import { SHOP_METRICS, APPLIANCE_TYPES } from '../data/mockDiagnostics';

export default function CostGuardrail({
  activeFault,
  detectedFaults,
  selectedAppliance,
  selectedComplaint,
  answers,
  customNote,
  applianceAge
}) {
  // Simulator State: 'safe' (Range) or 'risky' (Single fixed guess)
  const [quoteMode, setQuoteMode] = useState('safe');
  const [fixedGuessAmount, setFixedGuessAmount] = useState(0);
  const [customerAcknowledged, setCustomerAcknowledged] = useState(false);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState('Jane Doe');
  const [customerPhone, setCustomerPhone] = useState('555-0199');

  // Appliance metadata
  const applianceMeta = useMemo(() => {
    return APPLIANCE_TYPES.find((a) => a.id === selectedAppliance) || {
      name: 'Household Appliance',
      typicalReplacementValue: 500,
      averageLifespanYears: 10
    };
  }, [selectedAppliance]);

  // Set initial guess amount when active fault changes
  React.useEffect(() => {
    if (activeFault) {
      setFixedGuessAmount(activeFault.minCost);
      setTicketGenerated(false);
    }
  }, [activeFault]);

  // Derived financial & risk calculations
  const minCost = activeFault ? activeFault.minCost : 0;
  const maxCost = activeFault ? activeFault.maxCost : 0;
  const variance = maxCost - minCost;
  const replacementValue = activeFault ? activeFault.replacementValue : applianceMeta.typicalReplacementValue;

  // Depreciated value calculation based on appliance age
  const depreciatedValue = useMemo(() => {
    const lifespan = applianceMeta.averageLifespanYears || 10;
    const factor = Math.max(0.15, 1 - (applianceAge / lifespan) * 0.75);
    return Math.round(replacementValue * factor);
  }, [replacementValue, applianceAge, applianceMeta]);

  // BER (Beyond Economical Repair) metrics:
  // Triggered if maxCost > 50% of replacement value, OR maxCost > 70% of depreciated value, OR explicitly marked !isWorthRepairing
  const repairToNewRatio = replacementValue > 0 ? (maxCost / replacementValue) * 100 : 0;
  const repairToDepreciatedRatio = depreciatedValue > 0 ? (maxCost / depreciatedValue) * 100 : 0;
  const isBER = Boolean(
    activeFault && (
      repairToNewRatio >= SHOP_METRICS.berThresholdPercent ||
      repairToDepreciatedRatio >= 65 ||
      activeFault.isWorthRepairing === false ||
      applianceAge >= 10
    )
  );

  // Risk Simulator math
  // If assistant gives a fixed guess (e.g. $65), but true fault turns out to be high tier ($380):
  const simulatedShopLoss = Math.max(0, maxCost - Number(fixedGuessAmount || 0));
  const lossPercentage = maxCost > 0 ? Math.round((simulatedShopLoss / maxCost) * 100) : 0;

  // Counter Ticket ID generator
  const ticketId = useMemo(() => {
    return `JAR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }, [ticketGenerated]);

  const handleCopySlip = () => {
    const slipText = `
=========================================
  ${SHOP_METRICS.shopName.toUpperCase()}
  PRE-INSPECTION COUNTER INTAKE SLIP
  Ticket: ${ticketId}
  Date: ${new Date().toLocaleDateString()}
=========================================
CUSTOMER: ${customerName} | Phone: ${customerPhone}
APPLIANCE: ${applianceMeta.name} (Est. Age: ${applianceAge} yrs)
COMPLAINT: ${selectedComplaint || 'General malfunction'}
CUSTOM NOTES: ${customNote || 'None'}

PRELIMINARY DIAGNOSIS HYPOTHESIS:
- Primary Suspect: ${activeFault ? activeFault.faultName : 'General Diagnostic'}
- Likelihood: ${activeFault ? activeFault.likelihood : 'Triage Incomplete'}

ESTIMATED BENCH REPAIR RANGE:
$${minCost} – $${maxCost} (Subject to physical bench teardown)

LEGAL COUNTER GUARDRAIL CLAUSE:
"${SHOP_METRICS.disclaimerText}"

CUSTOMER ACKNOWLEDGMENT:
[X] Customer verbally agreed to non-binding estimate range at counter.
Intake Officer: ${SHOP_METRICS.counterLead}
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

  if (!activeFault) {
    return (
      <div className="card member-card guardrail-card empty-guardrail">
        <div className="card-header">
          <div className="badge member-badge member-badge-3">Member 3 — Core Module</div>
          <h2>Step 3: Cost to Guessing & Quote Guardrail</h2>
        </div>
        <div className="empty-state">
          <DollarSign size={40} className="text-muted" />
          <p>Select a likely fault from Step 2 to activate the Cost Guardrail, Margin Simulator, and Intake Ticket Generator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card member-card guardrail-card">
      <div className="card-header">
        <div className="badge member-badge member-badge-3">Member 3 — Core Module</div>
        <h2>Step 3: Cost to Guessing & Quote Guardrail</h2>
        <p className="subtitle">
          Protecting Jamal's margins: prevents fixed-quote trap, warns about unrepairable units, and issues non-binding intake receipts.
        </p>
      </div>

      {/* ---------------- 1. DAY-1 REPAIR VS. REPLACE (BER) ALERT BANNER ---------------- */}
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
                <strong>Why flag this today?</strong> Estimated repair cost (<strong>${maxCost}</strong>) reaches{' '}
                <strong>{Math.round(repairToNewRatio)}%</strong> of a replacement unit (~${replacementValue}), and{' '}
                <strong>{Math.round(repairToDepreciatedRatio)}%</strong> of its depreciated residual value (~${depreciatedValue}) at{' '}
                <strong>{applianceAge} years old</strong>.
              </p>
              <div className="ber-metric-cards">
                <div className="ber-mini-card">
                  <span className="mini-label">Max Repair Est.</span>
                  <span className="mini-val text-danger">${maxCost}</span>
                </div>
                <div className="ber-mini-card">
                  <span className="mini-label">Used/New Replacement</span>
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
                  <Scale size={15} /> Jamal's Counter Script for Customer:
                </div>
                <p className="script-text">
                  "Based on our experience with this symptom on a {applianceAge}-year-old {applianceMeta.name}, 
                  bench repairs can reach <strong>${maxCost}</strong>. With a brand-new replacement around <strong>${replacementValue}</strong>, 
                  spending this money doesn't make financial sense. We recommend recycling or replacing rather than racking up bench labor."
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
                <h3>Repair is Viable & Approved for Bench Intake</h3>
              </div>
              <p className="alert-description">
                Estimated repair (<strong>${minCost} – ${maxCost}</strong>) is safely within 
                <strong> {Math.round(repairToNewRatio)}%</strong> of replacement value (~${replacementValue}). 
                Appliance age ({applianceAge} yrs) has healthy service life remaining.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- 2. COST RANGE ESTIMATOR & VARIANCE RISK BAR ---------------- */}
      <div className="section range-estimator-section">
        <div className="section-title-row">
          <label className="section-title">
            <DollarSign size={18} /> Safe Estimated Cost Range & Variance Meter
          </label>
          <span className="variance-pill">
            Cost Uncertainty Spread: <strong>+${variance}</strong>
          </span>
        </div>

        <div className="range-display-container">
          <div className="range-box min-range">
            <span className="range-label">Best-Case / Minor Sub-part</span>
            <span className="range-amount">${minCost}</span>
            <span className="range-sub">e.g. Unclog / Relay / Switch</span>
          </div>

          <div className="range-arrow-zone">
            <div className="spread-line">
              <span className="spread-label">BENCH SPREAD: ${minCost} to ${maxCost}</span>
            </div>
            <ArrowRight size={24} className="spread-arrow" />
          </div>

          <div className="range-box max-range">
            <span className="range-label">Worst-Case / Core Assembly</span>
            <span className="range-amount">${maxCost}</span>
            <span className="range-sub">e.g. Full Motor / Compressor / Board</span>
          </div>
        </div>

        {/* Visual Variance & Confidence Bar */}
        <div className="variance-meter-block">
          <div className="meter-label-row">
            <span>Intake Quote Confidence Level</span>
            <span className={variance > 100 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
              {variance > 120 ? 'HIGH VARIANCE RISK (Inspection Strictly Mandatory)' : variance > 60 ? 'MODERATE SPREAD' : 'TIGHT CONFIDENCE'}
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
            <strong>Jamal's Golden Counter Rule:</strong> Never promise a single fixed dollar figure before physical bench inspection. 
            Quoting the minimum ($${minCost}) traps the shop when internal components turn out burnt, seized, or corroded ($${maxCost}).
          </p>
        </div>
      </div>

      {/* ---------------- 3. INTERACTIVE ASSISTANT GUESS SIMULATOR ---------------- */}
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
            <h4>Guarding the Counter: Safe Range Strategy</h4>
            <p>
              By quoting the customer <strong>${minCost} – ${maxCost}</strong> and collecting the <strong>${SHOP_METRICS.minDiagnosticInspectionFee} bench diagnostic fee</strong>, 
              the shop preserves customer goodwill regardless of whether it's a quick fix or catastrophic failure.
            </p>
            <div className="safe-perks-row">
              <div className="perk-item">
                <CheckCircle size={16} className="text-success" />
                <span>Customer expects potential high-tier replacement</span>
              </div>
              <div className="perk-item">
                <CheckCircle size={16} className="text-success" />
                <span>Shop never absorbs unquoted parts costs</span>
              </div>
              <div className="perk-item">
                <CheckCircle size={16} className="text-success" />
                <span>Technician has breathing room to bench test properly</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="simulator-risky-panel">
            <div className="panel-badge-row">
              <span className="badge badge-danger">HIGH RISK OF PROFIT COLLAPSE</span>
              <span className="margin-loss-text">Potential Shop Loss: -${simulatedShopLoss}</span>
            </div>

            <div className="interactive-slider-box">
              <div className="slider-label-row">
                <label>Assistant Promises a Fixed Over-the-Counter Guess:</label>
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
                  <span className="loss-sub">True Repair Incurred:</span>
                  <span className="loss-num text-danger">${maxCost}</span>
                </div>
                <div className="loss-math-symbol">=</div>
                <div className="loss-col">
                  <span className="loss-sub">Unrecovered Shop Deficit:</span>
                  <span className="loss-num text-danger font-bold">
                    ${simulatedShopLoss} ({lossPercentage}% deficit)
                  </span>
                </div>
              </div>

              {simulatedShopLoss > 0 ? (
                <div className="loss-consequence-alert">
                  <TrendingDown size={18} className="text-danger" />
                  <div>
                    <strong>Real-world consequence at counter:</strong> The technician discovers the higher-tier failure. 
                    The customer refuses to pay more than the promised <strong>${fixedGuessAmount}</strong>. 
                    Jamal's shop either loses <strong>${simulatedShopLoss}</strong> eating parts cost, or wastes 3 hours arguing with an irate customer!
                  </div>
                </div>
              ) : (
                <div className="loss-consequence-alert neutral">
                  <Info size={18} />
                  <div>
                    You quoted the maximum worst case ($${maxCost}). While this prevents financial loss, customers may walk out immediately unless presented with the proper range ($${minCost} – $${maxCost}).
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---------------- 4. NON-BINDING INTAKE RECEIPT & COUNTER GUARDRAIL ---------------- */}
      <div className="section intake-ticket-section">
        <div className="ticket-section-header">
          <FileText size={18} />
          <h3 className="section-title">Step 4: Non-Binding Counter Intake Receipt</h3>
        </div>

        <div className="customer-info-inputs">
          <div className="input-field">
            <label>Customer Full Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div className="input-field">
            <label>Phone / SMS Contact:</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. (555) 019-2834"
            />
          </div>
        </div>

        {/* Mandatory Counter Checkbox */}
        <div className="mandatory-guardrail-checkbox">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={customerAcknowledged}
              onChange={(e) => setCustomerAcknowledged(e.target.checked)}
            />
            <span className="checkmark" />
            <span className="checkbox-text">
              <strong>Mandatory Counter Check:</strong> Customer verbally acknowledged that 
              <strong> ${minCost} – ${maxCost}</strong> is a non-binding diagnostic estimate range, 
              and bench teardown is required for final quote.
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
              * Acknowledgment required before printing counter slip.
            </span>
          )}
        </div>

        {/* Rendered Counter Ticket */}
        {ticketGenerated && (
          <div className="counter-receipt-card print-area">
            <div className="receipt-border-top" />
            <div className="receipt-header">
              <div className="receipt-brand">
                <h3>{SHOP_METRICS.shopName.toUpperCase()}</h3>
                <p>Commercial & Residential Appliance Diagnostics • Certified Bench Triage</p>
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
                <span className="r-val">{applianceMeta.name}</span>
                <span className="r-sub">Approx. Age: {applianceAge} Years</span>
              </div>
              <div className="receipt-col">
                <span className="r-label">Reported Complaint:</span>
                <span className="r-val">"{selectedComplaint || 'Customer reported malfunction'}"</span>
                <span className="r-sub">{customNote || 'No extra notes'}</span>
              </div>
            </div>

            <div className="receipt-diagnosis-box">
              <div className="rd-row">
                <span className="rd-label">Initial Triage Suspect:</span>
                <strong className="rd-val">{activeFault.faultName} ({activeFault.likelihood} Match)</strong>
              </div>
              <div className="rd-row">
                <span className="rd-label">Non-Binding Estimate Range:</span>
                <span className="rd-price">${minCost} – ${maxCost}</span>
              </div>
              <div className="rd-row">
                <span className="rd-label">Standard Bench Fee:</span>
                <span className="rd-val">${SHOP_METRICS.minDiagnosticInspectionFee} (Credited toward approved repair)</span>
              </div>
            </div>

            <div className="receipt-disclaimer-box">
              <div className="disclaimer-header">
                <ShieldAlert size={14} /> LEGAL COUNTER GUARDRAIL CLAUSE:
              </div>
              <p className="disclaimer-text">
                "{SHOP_METRICS.disclaimerText}"
              </p>
            </div>

            <div className="receipt-signatures">
              <div className="sig-block">
                <div className="sig-line" />
                <span>Customer Signature (Acknowledging Range)</span>
              </div>
              <div className="sig-block">
                <div className="sig-line" />
                <span>Intake Tech: {SHOP_METRICS.counterLead}</span>
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
