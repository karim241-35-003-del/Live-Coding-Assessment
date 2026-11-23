import React from 'react';
import { AlertCircle, Wrench, CheckCircle2, ChevronRight, ClipboardList, ShieldAlert, Cpu } from 'lucide-react';

export default function FaultDiagnosis({
  detectedFaults = [],
  activeFault,
  onSelectFault
}) {
  return (
    <div className="card diagnosis-card">
      <div className="card-header">
        <span className="step-tag">Step 2 of 3</span>
        <h2>Diagnostic Hypothesis & Bench Notes</h2>
        <p className="subtitle">Algorithmic fault matching based on triage signals, generating tech hand-off notes.</p>
      </div>

      {detectedFaults.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={36} className="text-muted" />
          <p>Please select an appliance and symptom in Step 1 to run diagnostic analysis.</p>
        </div>
      ) : (
        <>
          <div className="section">
            <label className="section-title">
              <span>Identified Fault Candidates ({detectedFaults.length})</span>
            </label>
            <div className="faults-grid">
              {detectedFaults.map((fault) => {
                const isSelected = activeFault?.id === fault.id;
                const isHighRisk = fault.costVariance > 100 || !fault.isWorthRepairing;
                return (
                  <div
                    key={fault.id}
                    className={`fault-item ${isSelected ? 'active-fault' : ''} ${isHighRisk ? 'border-amber' : ''}`}
                    onClick={() => onSelectFault(fault)}
                  >
                    <div className="fault-header-row">
                      <div className="fault-title-area">
                        <div className="badge-group">
                          <span className={`badge likelihood-badge likelihood-${fault.likelihood.toLowerCase()}`}>
                            {fault.likelihood} Match
                          </span>
                          {fault.severity === 'critical' && (
                            <span className="badge badge-critical">Major Assembly</span>
                          )}
                        </div>
                        <h4>{fault.faultName}</h4>
                      </div>
                      <div className="fault-selection-indicator">
                        {isSelected ? <CheckCircle2 className="text-success" size={20} /> : <ChevronRight size={18} />}
                      </div>
                    </div>

                    <p className="fault-symptom-text">{fault.symptomSummary}</p>

                    <div className="fault-cost-mini">
                      <span className="cost-tag">Typical Bench Cost: <strong>৳{fault.minCost?.toLocaleString()} – ৳{fault.maxCost?.toLocaleString()}</strong></span>
                      <span className="variance-tag">±৳{fault.costVariance?.toLocaleString()} variance</span>
                    </div>

                    {fault.assistantWarningNote && (
                      <div className="assistant-warning-callout">
                        <ShieldAlert size={14} className="flex-shrink-0" />
                        <span>{fault.assistantWarningNote}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {activeFault && (
            <div className="section tech-summary-section">
              <div className="tech-summary-header">
                <ClipboardList size={18} />
                <h3>Technician Intake Bench Card (Bench Hand-off)</h3>
              </div>
              <div className="tech-summary-body">
                <div className="tech-row">
                  <span className="tech-label">Primary Suspect:</span>
                  <span className="tech-value highlight-tech">{activeFault.faultName}</span>
                </div>
                <div className="tech-row">
                  <span className="tech-label">Likely Parts Required:</span>
                  <div className="tech-tags">
                    {activeFault.partsNeeded?.map((p, idx) => (
                      <span key={idx} className="part-tag">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="tech-row">
                  <span className="tech-label">Recommended Bench Test:</span>
                  <span className="tech-value italic-note">{activeFault.benchTestAdvice}</span>
                </div>
                <div className="tech-row">
                  <span className="tech-label">Est. Turnaround:</span>
                  <span className="tech-value">{activeFault.repairTimeDays} business {activeFault.repairTimeDays === 1 ? 'day' : 'days'}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
