import React from 'react';

/**
 * Maps status strings to badge color classes
 */
export function getStatusColorClass(status) {
  if (!status) return 'badge-slate';
  const s = String(status).trim().toLowerCase();

  switch (s) {
    case 'open':
      return 'badge-blue';
    case 'under investigation':
      return 'badge-amber';
    case 'closed':
      return 'badge-gray';
    case 'referred to court':
      return 'badge-purple';
    case 'critical':
      return 'badge-red';
    case 'high':
      return 'badge-orange';
    case 'medium':
      return 'badge-yellow';
    case 'low':
      return 'badge-green';
    case 'pending':
      return 'badge-gray';
    case 'in custody':
      return 'badge-red';
    case 'arrested':
      return 'badge-red';
    case 'released on bail':
      return 'badge-yellow';
    case 'produced in court':
      return 'badge-purple';
    case 'good':
      return 'badge-green';
    case 'degraded':
      return 'badge-yellow';
    case 'damaged':
      return 'badge-red';
    default:
      return 'badge-blue';
  }
}

export function StatusBadge({ status, className = '' }) {
  if (!status) return null;
  const colorClass = getStatusColorClass(status);

  return (
    <span
      className={`badge ${colorClass} ${className}`.trim()}
      data-testid="status-badge"
    >
      <span className="badge-dot" />
      {status}
    </span>
  );
}

export default StatusBadge;
