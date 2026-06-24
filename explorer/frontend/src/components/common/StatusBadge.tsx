import { STATUS_COLORS, StatusType } from '../../utils/constants';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string; // Override default label
}

/**
 * Reusable status badge component
 * Displays status with predefined color schemes
 */
export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {displayLabel}
    </span>
  );
}
