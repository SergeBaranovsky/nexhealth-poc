/**
 * Appointments Routes
 * Endpoints for managing appointment data
 */

import { Hono } from 'hono';
import type { NexHealthClient } from '../nexhealth';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Creates appointments routes
 * @param nexhealth - NexHealth API client instance
 * @param ensureAuthenticated - Authentication middleware function
 */
export function createAppointmentsRoutes(
  nexhealth: NexHealthClient,
  ensureAuthenticated: () => Promise<string>
) {
  const app = new Hono();
  
  // GET /api/appointments - List appointments with optional date filtering
  app.get('/', asyncHandler(async (c) => {
    await ensureAuthenticated();
    
    const start = c.req.query('start');
    const end = c.req.query('end');
    const page = c.req.query('page');
    const perPage = c.req.query('per_page');
    
    const data = await nexhealth.getAppointments({
      start,
      end,
      page: page ? parseInt(page) : undefined,
      per_page: perPage ? parseInt(perPage) : undefined,
    });
    
    return c.json(data);
  }));
  
  // GET /api/appointments/types - Get appointment types
  app.get('/types', asyncHandler(async (c) => {
    await ensureAuthenticated();
    
    const data = await nexhealth.getAppointmentTypes();
    return c.json(data);
  }));
  
  // GET /api/appointments/available-slots - Get available time slots
  app.get('/available-slots', asyncHandler(async (c) => {
    await ensureAuthenticated();
    
    const providerId = c.req.query('provider_id');
    const appointmentTypeId = c.req.query('appointment_type_id');
    const startDate = c.req.query('start_date');
    const days = c.req.query('days');
    
    const data = await nexhealth.getAvailableSlots({
      provider_id: providerId,
      appointment_type_id: appointmentTypeId,
      start_date: startDate,
      days: days ? parseInt(days) : undefined,
    });
    
    return c.json(data);
  }));
  
  return app;
}
