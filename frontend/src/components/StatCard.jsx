import React from 'react';

export default function StatCard({ label, value, icon: Icon, theme = 'stat-blue' }) {
  return (
    <div className={`stat-card ${theme}`}>
      <div className="stat-icon-wrapper">
        <Icon size={26} />
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
