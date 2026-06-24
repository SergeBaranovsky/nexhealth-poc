import { SPINNER_COLORS, ThemeColor } from '../../utils/constants';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: ThemeColor;
}

/**
 * Reusable loading spinner component
 * Shows an animated spinner with optional message
 */
export function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md',
  color = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const spinnerColor = SPINNER_COLORS[color];
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 ${spinnerColor} border-t-transparent`}
      />
      {message && (
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
}
