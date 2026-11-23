import React from 'react';

/**
 * =======================================================================
 * MEMBER 1 SCAFFOLD: Front-Desk Symptom Intake
 * Assigned To: Member 1 (Alif)
 * -----------------------------------------------------------------------
 * Expected Responsibilities:
 * - Appliance Category Selection (Fridge, Washing Machine, Microwave)
 * - Vague Customer Complaint Quick-Select Pills + Custom Text Notes
 * - Dynamic 2-3 Follow-up Triage Questions based on selected symptom
 * =======================================================================
 */
export default function SymptomIntake({
  selectedAppliance = 'fridge',
  onSelectAppliance,
  selectedComplaint = 'noise',
  onSelectComplaint,
  customNote = '',
  onChangeCustomNote,
  applianceAge = 5,
  onChangeApplianceAge
}) {
  return (
    <div className="card member-card intake-card">
      <div className="card-header">
        <div className="badge member-badge member-badge-1">Member 1 (Alif) — Scaffold</div>
        <h2>Step 1: Symptom Intake</h2>
        <p className="subtitle">Front-desk customer symptom & appliance intake module.</p>
      </div>

      <div className="scaffold-placeholder">
        <div className="scaffold-status">
          <span className="scaffold-dot" />
          <span>Scaffold / Interface Stub for Member 1</span>
        </div>
        <p className="scaffold-desc">
          This component is reserved for Member 1 to implement the full appliance picker, complaint pills, and dynamic triage questionnaire.
        </p>

        {/* Minimal functional controls so team workflow test doesn't break */}
        <div className="scaffold-controls">
          <div className="scaffold-field">
            <label>Appliance Type:</label>
            <select
              value={selectedAppliance}
              onChange={(e) => onSelectAppliance && onSelectAppliance(e.target.value)}
              className="scaffold-select"
            >
              <option value="fridge">Refrigerator / Freezer</option>
              <option value="washing_machine">Washing Machine</option>
              <option value="microwave">Microwave Oven</option>
            </select>
          </div>

          <div className="scaffold-field">
            <label>Customer Complaint:</label>
            <select
              value={selectedComplaint}
              onChange={(e) => onSelectComplaint && onSelectComplaint(e.target.value)}
              className="scaffold-select"
            >
              <option value="noise">"Making a strange / loud noise"</option>
              <option value="dead">"Working yesterday, now nothing"</option>
              <option value="water_leak">"Water coming from bottom"</option>
              <option value="burning_smell">"Smells like something burning"</option>
            </select>
          </div>

          <div className="scaffold-field">
            <label>Appliance Age: <strong>{applianceAge} yrs</strong></label>
            <input
              type="range"
              min="1"
              max="15"
              value={applianceAge}
              onChange={(e) => onChangeApplianceAge && onChangeApplianceAge(Number(e.target.value))}
              className="range-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
