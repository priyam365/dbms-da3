import React from 'react';

export function StatCard({
  icon: Icon,
  number,
  label,
  trend,
  color = '#3b82f6',
  onClick,
}) {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      data-testid="stat-card"
    >
      <div
        className="stat-icon-wrapper"
        style={{
          backgroundColor: `${color}18`,
          color: color,
          border: `1px solid ${color}35`,
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-details">
        <div className="stat-number">{number ?? 0}</div>
        <div className="stat-label">{label}</div>
        {trend && <div className="stat-trend">{trend}</div>}
      </div>
    </div>
  );
}

export default StatCard;
