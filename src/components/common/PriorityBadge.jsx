import React from 'react';

export default function PriorityBadge({ priority }) {
  const normalized = (priority || 'Medium').toLowerCase();
  
  let badgeClass = 'priority-medium';
  if (normalized === 'urgent') {
    badgeClass = 'priority-urgent';
  } else if (normalized === 'high') {
    badgeClass = 'priority-high';
  } else if (normalized === 'low') {
    badgeClass = 'priority-low';
  }

  return (
    <span className={`priority-pill ${badgeClass}`}>
      <span className="priority-dot"></span>
      {priority}
    </span>
  );
}
