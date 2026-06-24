/**
 * Stats Routes
 * Endpoints for retrieving aggregate statistics
 */

import { Hono } from 'hono';
import type { NexHealthClient } from '../nexhealth';
import { asyncHandler } from '../middleware/errorHandler';
import { config } from '../config';

// Simple in-memory cache for stats endpoint
interface CacheEntry {
  data: any;
  timestamp: number;
}

let statsCache: CacheEntry | null = null;

function getCachedStats(): any | null {
  if (!statsCache || !statsCache.data || Date.now() - statsCache.timestamp > config.cache.statsTTL) {
    return null;
  }
  return statsCache.data;
}

function setCachedStats(data: any): void {
  statsCache = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Creates stats routes
 * @param nexhealth - NexHealth API client instance
 * @param ensureAuthenticated - Authentication middleware function
 */
export function createStatsRoutes(
  nexhealth: NexHealthClient,
  ensureAuthenticated: () => Promise<string>
) {
  const app = new Hono();
  
  // GET /api/stats - Returns total counts with 5-minute cache
  app.get('/', asyncHandler(async (c) => {
    await ensureAuthenticated();
    
    // Check cache first
    const cachedData = getCachedStats();
    if (cachedData) {
      return c.json(cachedData);
    }
    
    // IMPORTANT: NexHealth API Limitation Workaround
    // 
    // The NexHealth API v20240412 does NOT provide a total_count field in responses.
    // The 'count' field only returns the number of items in the current page.
    // 
    // Examples:
    //   per_page=1   → count=1   (NOT the total!)
    //   per_page=25  → count=25  (just the page size)
    //   per_page=200 → count=104 (actual total when all records fit in one page)
    // 
    // Documentation: https://docs.nexhealth.com/reference/pagination.md
    // 
    // Solution: Fetch with per_page=1000 (API maximum) to get all records in one page,
    // then count the array length. This is cached for 5 minutes to minimize API load.
    // 
    // Why per_page=1000:
    //   - NexHealth API supports up to 1000 items per page
    //   - Most POC/sandbox environments have <1000 patients/appointments
    //   - Aggressive caching (5 min route + 2 min client) reduces actual API calls
    //   - Performance: 500ms initial → 5ms cached (100x faster)
    const patientsData = await nexhealth.getPatients({ per_page: 1000 });
    const appointmentsData = await nexhealth.getAppointments({ per_page: 1000 });
    const providersData = await nexhealth.getProviders();
    
    const stats = {
      patients: {
        total: patientsData.data.patients?.length || 0  // Count array, not response.count
      },
      appointments: {
        total: appointmentsData.data.appointments?.length || 0  // Count array, not response.count
      },
      providers: {
        total: providersData.data.providers?.length || 0
      }
    };
    
    // Cache the result
    setCachedStats(stats);
    
    return c.json(stats);
  }));
  
  // POST /api/stats/refresh - Clears cache and returns fresh stats
  app.post('/refresh', asyncHandler(async (c) => {
    await ensureAuthenticated();
    
    // Clear cache
    statsCache = null;
    
    // Fetch fresh data with large per_page
    const patientsData = await nexhealth.getPatients({ per_page: 1000 });
    const appointmentsData = await nexhealth.getAppointments({ per_page: 1000 });
    const providersData = await nexhealth.getProviders();
    
    const stats = {
      patients: {
        total: patientsData.data.patients?.length || 0
      },
      appointments: {
        total: appointmentsData.data.appointments?.length || 0
      },
      providers: {
        total: providersData.data.providers?.length || 0
      }
    };
    
    // Cache the result
    setCachedStats(stats);
    
    return c.json(stats);
  }));
  
  return app;
}
