import { BUTTON_VARIANTS, ThemeColor } from '../../utils/constants';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel: string; // "patients", "appointments", etc.
  variant?: ThemeColor;
}

/**
 * Reusable pagination component with consistent styling
 * Shows page controls, current page info, and item range
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel,
  variant = 'default',
}: PaginationProps) {
  const buttonConfig = BUTTON_VARIANTS[variant];
  
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="mt-6 bg-white rounded-lg shadow px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className={`px-4 py-2 rounded-md transition-colors ${
            canGoPrev ? buttonConfig.primary : buttonConfig.disabled
          }`}
        >
          Previous
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-700 font-medium">
            Showing {startItem} to {endItem} of {totalItems} {itemLabel}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Page {currentPage} of {totalPages}
          </div>
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={`px-4 py-2 rounded-md transition-colors ${
            canGoNext ? buttonConfig.primary : buttonConfig.disabled
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
