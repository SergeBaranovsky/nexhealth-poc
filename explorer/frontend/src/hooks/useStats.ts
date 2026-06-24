import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/constants';

interface StatsData {
  patients: { total: number };
  appointments: { total: number };
  providers: { total: number };
}

/**
 * Hook for fetching and managing stats data
 * Centralizes stats fetching to avoid duplicate API calls across components
 * @returns Stats data, loading state, error state, and refetch function
 */
export function useStats() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/stats`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }
      
      const statsData = await response.json();
      setData(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    patients: data?.patients || { total: 0 },
    appointments: data?.appointments || { total: 0 },
    providers: data?.providers || { total: 0 },
    loading,
    error,
    refetch: fetchStats,
  };
}
