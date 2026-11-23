import React from 'react';
import { Clock, Wrench, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Pending':
        return {
          icon: Clock,
          className: 'badge-warning',
          label: 'Pending'
        };
      case 'Under Inspection':
        return {
          icon: Wrench,
          className: 'badge-info',
          label: 'Under Inspection'
        };
      case 'Repaired':
        return {
          icon: CheckCircle2,
          className: 'badge-success',
          label: 'Repaired'
        };
      case 'Delivered':
        return {
          icon: Truck,
          className: 'badge-neutral',
          label: 'Delivered'
        };
      default:
        return {
          icon: AlertCircle,
          className: 'badge-secondary',
          label: status || 'Unknown'
        };
    }
  };

  const { icon: Icon, className, label } = getBadgeConfig();

  return (
    <span className={`status-badge ${className}`}>
      <Icon size={13} className="badge-icon" />
      <span>{label}</span>
    </span>
  );
}
