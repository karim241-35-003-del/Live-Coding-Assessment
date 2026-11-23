import React from 'react';
import { Refrigerator, WashingMachine, Microwave, Check } from 'lucide-react';
import { APPLIANCE_TYPES } from '../../data/mockData';

export default function ApplianceCardSelector({ selectedType, onSelect }) {
  const getIcon = (typeId) => {
    switch (typeId) {
      case 'Refrigerator':
        return Refrigerator;
      case 'Washing Machine':
        return WashingMachine;
      case 'Microwave Oven':
        return Microwave;
      default:
        return Refrigerator;
    }
  };

  return (
    <div className="appliance-selector-wrapper">
      <div className="appliance-selector-header">
        <label className="form-label-section">Select Appliance Category *</label>
        <span className="form-label-hint">Choose the appliance requiring repair</span>
      </div>

      <div className="appliance-cards-grid">
        {APPLIANCE_TYPES.map((appliance) => {
          const Icon = getIcon(appliance.id);
          const isSelected = selectedType === appliance.id;

          return (
            <div
              key={appliance.id}
              className={`appliance-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(appliance.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(appliance.id);
                }
              }}
            >
              {isSelected && (
                <div className="selection-badge">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}

              <div className="appliance-icon-container">
                <Icon size={34} strokeWidth={2} />
              </div>

              <div className="appliance-card-content">
                <h4 className="appliance-title">{appliance.title}</h4>
                <span className="appliance-subtitle">{appliance.subtitle}</span>
                <p className="appliance-desc">{appliance.description}</p>
              </div>

              <div className="appliance-card-footer">
                <span className="brand-hints">
                  Popular: {appliance.popularBrands.slice(0, 3).join(', ')}...
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
