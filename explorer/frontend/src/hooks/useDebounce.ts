import { useEffect, useState } from 'react';
import { DEFAULT_DEBOUNCE_MS } from '../utils/constants';

/**
 * Hook that debounces a value, useful for search inputs and other frequent updates
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (defaults to DEFAULT_DEBOUNCE_MS)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = DEFAULT_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timeout if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
