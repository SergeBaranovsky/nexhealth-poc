import { useState, useEffect } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Simple custom hook for API data fetching
 * Following the POC architecture - no React Query needed
 */
export function useApi<T>(url: string, skip = false): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(0);

  useEffect(() => {
    if (skip) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        console.error('API fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, skip, shouldFetch]);

  const refetch = () => {
    setShouldFetch(prev => prev + 1);
  };

  return { data, loading, error, refetch };
}
