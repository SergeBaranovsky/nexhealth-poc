/**
 * NexHealth Explorer Backend
 * Simple API server that proxies requests to NexHealth API
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import * as dotenv from 'dotenv';
import { NexHealthClient } from './nexhealth';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'NEXHEALTH_API_KEY',
  'NEXHEALTH_SUBDOMAIN',
  'NEXHEALTH_LOCATION_ID',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Hono app
const app = new Hono();

// CORS middleware
app.use('/*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Initialize NexHealth client
const nexhealth = new NexHealthClient({
  apiKey: process.env.NEXHEALTH_API_KEY!,
  subdomain: process.env.NEXHEALTH_SUBDOMAIN!,
  locationId: process.env.NEXHEALTH_LOCATION_ID!,
  baseUrl: process.env.NEXHEALTH_BASE_URL,
  apiVersion: process.env.NEXHEALTH_API_VERSION,
});

// Authenticate on startup
let authPromise: Promise<string> | null = null;

async function ensureAuthenticated() {
  if (!authPromise) {
    authPromise = nexhealth.authenticate();
  }
  return authPromise;
}

// Request logging middleware
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${c.req.path} - ${c.res.status} [${ms}ms]`);
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Institution endpoint
app.get('/api/institution', async (c) => {
  try {
    await ensureAuthenticated();
    const data = await nexhealth.getInstitution();
    return c.json(data);
  } catch (error) {
    console.error('Institution error:', error);
    return c.json({ error: 'Failed to fetch institution data' }, 500);
  }
});

// Patients endpoints
app.get('/api/patients', async (c) => {
  try {
    await ensureAuthenticated();
    
    const page = c.req.query('page');
    const perPage = c.req.query('per_page');
    
    const data = await nexhealth.getPatients({
      page: page ? parseInt(page) : undefined,
      per_page: perPage ? parseInt(perPage) : undefined,
    });
    
    return c.json(data);
  } catch (error) {
    console.error('Patients error:', error);
    return c.json({ error: 'Failed to fetch patients' }, 500);
  }
});

app.get('/api/patients/:id', async (c) => {
  try {
    await ensureAuthenticated();
    
    const id = c.req.param('id');
    const data = await nexhealth.getPatient(id);
    
    return c.json(data);
  } catch (error) {
    console.error('Patient detail error:', error);
    return c.json({ error: 'Failed to fetch patient details' }, 500);
  }
});

// Appointments endpoint
app.get('/api/appointments', async (c) => {
  try {
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
  } catch (error) {
    console.error('Appointments error:', error);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});

// Providers endpoint
app.get('/api/providers', async (c) => {
  try {
    await ensureAuthenticated();
    const data = await nexhealth.getProviders();
    return c.json(data);
  } catch (error) {
    console.error('Providers error:', error);
    return c.json({ error: 'Failed to fetch providers' }, 500);
  }
});

// Appointment types endpoint
app.get('/api/appointment-types', async (c) => {
  try {
    await ensureAuthenticated();
    const data = await nexhealth.getAppointmentTypes();
    return c.json(data);
  } catch (error) {
    console.error('Appointment types error:', error);
    return c.json({ error: 'Failed to fetch appointment types' }, 500);
  }
});

// Available slots endpoint
app.get('/api/available-slots', async (c) => {
  try {
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
  } catch (error) {
    console.error('Available slots error:', error);
    return c.json({ error: 'Failed to fetch available slots' }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

// Start server
const port = parseInt(process.env.PORT || '8000');

console.log(`Starting NexHealth Explorer Backend...`);
console.log(`Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
