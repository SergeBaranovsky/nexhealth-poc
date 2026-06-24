/**
 * Patients Routes
 * Endpoints for managing patient data
 */

import { Hono } from 'hono';
import type { NexHealthClient } from '../nexhealth';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Creates patients routes
 * @param nexhealth - NexHealth API client instance
 * @param ensureAuthenticated - Authentication middleware function
 */
export function createPatientsRoutes(
  nexhealth: NexHealthClient,
  ensureAuthenticated: () => Promise<string>
) {
  const app = new Hono();
  
  // GET /api/patients - List all patients with pagination
  app.get('/', asyncHandler(async (c) => {
    await ensureAuthenticated();
    
    const page = c.req.query('page');
    const perPage = c.req.query('per_page');
    
    const data = await nexhealth.getPatients({
      page: page ? parseInt(page) : undefined,
      per_page: perPage ? parseInt(perPage) : undefined,
    });
    
    return c.json(data);
  }));
  
  // GET /api/patients/:id - Get single patient details
  app.get('/:id', asyncHandler(async (c) => {
    await ensureAuthenticated();
    
    const id = c.req.param('id');
    const data = await nexhealth.getPatient(id);
    
    return c.json(data);
  }));
  
  return app;
}
