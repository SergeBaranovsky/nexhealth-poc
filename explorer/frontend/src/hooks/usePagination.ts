import { useState } from 'react';
import { ITEMS_PER_PAGE } from '../utils/constants';

/**
 * Hook for managing pagination state
 * @param itemsPerPage - Number of items per page (defaults to ITEMS_PER_PAGE constant)
 * @returns Pagination state and itemsPerPage value
 */
export function usePagination(itemsPerPage: number = ITEMS_PER_PAGE) {
  const [page, setPage] = useState(1);

  return {
    page,
    setPage,
    itemsPerPage,
  };
}
