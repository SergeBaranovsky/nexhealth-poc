/**
 * Providers Routes
 * Endpoints for managing provider data
 */

import { Hono } from 'hono';
import type { NexHealthClient } from '../nexhealth';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Creates providers routes
 * @param nexhealth - NexHealth API client instance
 * @param ensureAuthenticated - Authentication middleware function
 */
export function createProvidersRoutes(
  nexhealth: NexHealthClient,
  ensureAuthenticated: () => Promise<string>
) {
  const app = new Hono();
  
  // GET /api/providers - List all providers
  app.get('/', asyncHandler(async (c) => {
    await ensureAuthenticated();
    
    const data = await nexhealth.getProviders();
    return c.json(data);
  }));
  
  return app;
}
