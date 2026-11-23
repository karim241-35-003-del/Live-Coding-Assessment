import React from 'react';
import { APPLIANCE_TYPES, VAGUE_COMPLAINTS, FOLLOW_UP_QUESTIONS } from '../data/mockDiagnostics';
import { HelpCircle, MessageSquare, Check, X, Info } from 'lucide-react';

export default function SymptomIntake({
  selectedAppliance,
  onSelectAppliance,
  selectedComplaint,
  onSelectComplaint,
  customNote,
  onChangeCustomNote,
  answers,
  onAnswerQuestion,
  applianceAge,
  onChangeApplianceAge
}) {
  const currentQuestions = (selectedAppliance && selectedComplaint && FOLLOW_UP_QUESTIONS[selectedAppliance]?.[selectedComplaint]) || [];

  return (
    <div className="card member-card intake-card">
      <div className="card-header">
        <div className="badge member-badge member-badge-1">Member 1 Scaffold</div>
        <h2>Step 1: Front-Desk Symptom Intake</h2>
        <p className="subtitle">Standardize vague customer descriptions into actionable diagnostic signals.</p>
      </div>

      <div className="section">
        <label className="section-title">1. Appliance Category</label>
        <div className="appliance-grid">
          {APPLIANCE_TYPES.map((app) => {
            const isSelected = selectedAppliance === app.id;
            return (
              <button
                type="button"
                key={app.id}
                className={`appliance-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectAppliance(app.id)}
              >
                <div className="app-icon-wrapper">
                  {app.id === 'fridge' && '🧊'}
                  {app.id === 'washing_machine' && '🧺'}
                  {app.id === 'microwave' && '⚡'}
                </div>
                <div className="app-meta">
                  <span className="app-name">{app.name}</span>
                  <span className="app-sub">Avg repl. ~${app.typicalReplacementValue}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="section">
        <label className="section-title">2. What the Customer Complains About (Vague Complaint)</label>
        <div className="complaint-pills">
          {VAGUE_COMPLAINTS.map((c) => {
            const isSelected = selectedComplaint === c.id;
            return (
              <button
                type="button"
                key={c.id}
                className={`complaint-pill ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectComplaint(c.id)}
              >
                <span className="pill-quote">"{c.label}"</span>
              </button>
            );
          })}
        </div>

        <div className="custom-note-group">
          <label className="sub-label">
            <MessageSquare size={14} /> Customer's Verbatim Notes / Model Details:
          </label>
          <input
            type="text"
            className="input-text"
            placeholder="e.g. Whirlpool Gold Series, humming started 3 days ago..."
            value={customNote}
            onChange={(e) => onChangeCustomNote(e.target.value)}
          />
        </div>
      </div>

      {currentQuestions.length > 0 && (
        <div className="section dynamic-questions">
          <label className="section-title">
            <HelpCircle size={16} /> 3. Targeted Triage Follow-ups (Ask Customer at Counter)
          </label>
          <p className="hint-text">
            Jamal's rule: Ask these 2-3 quick questions before estimating to prevent quoting the wrong sub-assembly.
          </p>

          <div className="question-list">
            {currentQuestions.map((q) => {
              const currentVal = answers[q.id];
              return (
                <div key={q.id} className="question-item">
                  <div className="q-text">{q.text}</div>
                  <div className="q-buttons">
                    <button
                      type="button"
                      className={`q-btn yes-btn ${currentVal === true ? 'selected' : ''}`}
                      onClick={() => onAnswerQuestion(q.id, true)}
                    >
                      <Check size={14} /> Yes
                    </button>
                    <button
                      type="button"
                      className={`q-btn no-btn ${currentVal === false ? 'selected' : ''}`}
                      onClick={() => onAnswerQuestion(q.id, false)}
                    >
                      <X size={14} /> No
                    </button>
                    <button
                      type="button"
                      className={`q-btn unsure-btn ${currentVal === undefined ? 'selected' : ''}`}
                      onClick={() => onAnswerQuestion(q.id, undefined)}
                    >
                      Unsure
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="section age-slider-section">
        <div className="slider-header">
          <label className="section-title">Appliance Estimated Age</label>
          <span className="age-display">{applianceAge} {applianceAge === 1 ? 'Year Old' : 'Years Old'}</span>
        </div>
        <input
          type="range"
          min="1"
          max="15"
          step="1"
          value={applianceAge}
          onChange={(e) => onChangeApplianceAge(parseInt(e.target.value, 10))}
          className="range-slider"
        />
        <div className="slider-scale">
          <span>1 yr (Like New)</span>
          <span>5 yrs</span>
          <span>10 yrs (High Depreciation)</span>
          <span>15+ yrs</span>
        </div>
      </div>
    </div>
  );
}
