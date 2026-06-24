export interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

/**
 * Reusable error alert component
 * Displays error messages with optional retry capability
 */
export function ErrorAlert({ 
  error, 
  onRetry,
  variant = 'error' 
}: ErrorAlertProps) {
  const variantClasses = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const classes = variantClasses[variant];

  return (
    <div className={`${classes.bg} border ${classes.border} rounded-lg p-6 my-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`${classes.text} font-semibold text-lg mb-1`}>
            {variant === 'error' ? 'Error' : variant === 'warning' ? 'Warning' : 'Information'}
          </h3>
          <p className={`${classes.text}`}>{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`ml-4 px-4 py-2 ${classes.button} text-white rounded-md transition-colors`}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
