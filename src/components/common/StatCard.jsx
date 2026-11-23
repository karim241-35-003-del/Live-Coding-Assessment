import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, colorTheme = 'blue', trend }) {
  return (
    <div className={`stat-card stat-${colorTheme}`}>
      <div className="stat-card-header">
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <div className="stat-value-row">
            <h3 className="stat-value">{value}</h3>
            {trend && <span className="stat-trend">{trend}</span>}
          </div>
        </div>
        <div className="stat-icon-wrapper">
          <Icon size={26} strokeWidth={2.2} />
        </div>
      </div>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  );
}
