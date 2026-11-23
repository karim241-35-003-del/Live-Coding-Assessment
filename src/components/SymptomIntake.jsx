import React from 'react';
import { APPLIANCE_TYPES, VAGUE_COMPLAINTS, FOLLOW_UP_QUESTIONS } from '../data/mockDiagnostics';
import { HelpCircle, MessageSquare, Check, X, ShieldAlert, Cpu } from 'lucide-react';

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
    <div className="card intake-card">
      <div className="card-header">
        <span className="step-tag">Step 1 of 3</span>
        <h2>Appliance & Symptom Intake</h2>
        <p className="subtitle">Record customer complaints and capture key preliminary triage signals at the counter.</p>
      </div>

      {/* Appliance Category Selector */}
      <div className="section">
        <label className="section-title">
          <span>1. Appliance Category</span>
        </label>
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
                <div className="app-icon-wrapper">{app.icon}</div>
                <div className="app-meta">
                  <span className="app-name">{app.name}</span>
                  <span className="app-sub">Avg repl. ~${app.typicalReplacementValue} • {app.averageLifespanYears}y lifespan</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vague Customer Complaint Selector */}
      <div className="section">
        <label className="section-title">
          <span>2. Customer Reported Complaint</span>
        </label>
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
                <span className="pill-desc">{c.description}</span>
              </button>
            );
          })}
        </div>

        <div className="custom-note-group">
          <label className="sub-label">
            <MessageSquare size={14} /> Additional Customer Details / Brand & Model:
          </label>
          <input
            type="text"
            className="input-text"
            placeholder="e.g. Whirlpool Double Door, buzzing started 2 days ago..."
            value={customNote}
            onChange={(e) => onChangeCustomNote(e.target.value)}
          />
        </div>
      </div>

      {/* Dynamic Triage Follow-ups */}
      {currentQuestions.length > 0 && (
        <div className="section dynamic-questions">
          <div className="section-title-row">
            <label className="section-title">
              <HelpCircle size={15} /> 3. Targeted Triage Questions (Ask at Counter)
            </label>
            <span className="variance-pill">30-second triage</span>
          </div>

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

      {/* Appliance Age Slider */}
      <div className="section age-slider-section">
        <div className="slider-header">
          <label className="section-title">Appliance In-Service Age</label>
          <span className="age-display">{applianceAge} {applianceAge === 1 ? 'Year' : 'Years'} Old</span>
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
          <span>1y (New)</span>
          <span>5y (Mid-life)</span>
          <span>10y (High Depreciation)</span>
          <span>15y+</span>
        </div>
      </div>
    </div>
  );
}
