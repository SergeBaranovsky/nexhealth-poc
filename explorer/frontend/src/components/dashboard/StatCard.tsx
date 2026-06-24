import { Link } from 'react-router-dom';

export interface StatCardProps {
  title: string;
  value: number | string;
  link?: string;
  linkText?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple';
}

/**
 * Reusable stat card component for the dashboard
 * Displays a statistic with optional link and icon
 */
export function StatCard({
  title,
  value,
  link,
  linkText = 'View All',
  icon,
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'text-blue-900',
      value: 'text-blue-600',
      link: 'text-blue-600 hover:text-blue-800',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      title: 'text-green-900',
      value: 'text-green-600',
      link: 'text-green-600 hover:text-green-800',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      title: 'text-purple-900',
      value: 'text-purple-600',
      link: 'text-purple-600 hover:text-purple-800',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} border ${classes.border} rounded-lg p-6 shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-lg font-semibold ${classes.title}`}>{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className={`text-3xl font-bold ${classes.value} mb-4`}>{value}</div>
      {link && (
        <Link
          to={link}
          className={`text-sm font-medium ${classes.link} transition-colors`}
        >
          {linkText} →
        </Link>
      )}
    </div>
  );
}
