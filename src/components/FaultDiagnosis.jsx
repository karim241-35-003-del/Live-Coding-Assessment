import React from 'react';

/**
 * =======================================================================
 * MEMBER 2 SCAFFOLD: Triage Engine & Fault Diagnosis
 * Assigned To: Member 2 (Nahid)
 * -----------------------------------------------------------------------
 * Expected Responsibilities:
 * - Triage Rules & Confidence Scoring
 * - Top 1-2 Likely Fault Display with likelihood badges
 * - Technician Intake Bench Card (Hand-off summary replacing handwritten notes)
 * =======================================================================
 */
export default function FaultDiagnosis({
  detectedFaults = [],
  activeFault,
  onSelectFault
}) {
  return (
    <div className="card member-card diagnosis-card">
      <div className="card-header">
        <div className="badge member-badge member-badge-2">Member 2 (Nahid) — Scaffold</div>
        <h2>Step 2: Fault Diagnosis & Triage</h2>
        <p className="subtitle">Triage matching engine and technician bench card summary.</p>
      </div>

      <div className="scaffold-placeholder">
        <div className="scaffold-status">
          <span className="scaffold-dot" />
          <span>Scaffold / Interface Stub for Member 2</span>
        </div>
        <p className="scaffold-desc">
          This component is reserved for Member 2 to implement the triage scoring algorithm and technician hand-off card.
        </p>

        {/* Minimal functional selector so downstream Module 3 (Arik) has faults to evaluate */}
        <div className="scaffold-controls">
          <label className="scaffold-label">Select Fault to Test in Module 3:</label>
          <div className="scaffold-fault-list">
            {detectedFaults.map((fault) => {
              const isSelected = activeFault?.id === fault.id;
              return (
                <button
                  type="button"
                  key={fault.id}
                  className={`scaffold-fault-btn ${isSelected ? 'active-fault' : ''}`}
                  onClick={() => onSelectFault && onSelectFault(fault)}
                >
                  <div className="sfb-top">
                    <span className="sfb-name">{fault.faultName}</span>
                    <span className="sfb-badge">{fault.likelihood} Match</span>
                  </div>
                  <div className="sfb-cost">
                    Typical: ${fault.minCost} – ${fault.maxCost} (±${fault.costVariance})
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
