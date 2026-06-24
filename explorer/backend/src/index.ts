/**
 * NexHealth Explorer Backend
 * Simple API server that proxies requests to NexHealth API
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { NexHealthClient } from './nexhealth';
import { config, validateConfig } from './config';
import { asyncHandler, globalErrorHandler } from './middleware/errorHandler';
import { createStatsRoutes } from './routes/stats';
import { createPatientsRoutes } from './routes/patients';
import { createAppointmentsRoutes } from './routes/appointments';
import { createProvidersRoutes } from './routes/providers';

// Validate configuration on startup
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error instanceof Error ? error.message : error);
  process.exit(1);
}

// Initialize Hono app
const app = new Hono();

// CORS middleware
app.use('/*', cors({
  origin: config.server.corsOrigin,
  credentials: true,
}));

// Initialize NexHealth client with caching, timeout, and retry configuration
const nexhealth = new NexHealthClient({
  apiKey: config.nexhealth.apiKey,
  subdomain: config.nexhealth.subdomain,
  locationId: config.nexhealth.locationId,
  baseUrl: config.nexhealth.baseUrl,
  apiVersion: config.nexhealth.apiVersion,
  timeout: config.request.timeout,
  maxRetries: config.request.maxRetries,
  retryDelay: config.request.retryDelay,
  cacheTTL: config.cache.requestTTL,
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
app.get('/api/institution', asyncHandler(async (c) => {
  await ensureAuthenticated();
  const data = await nexhealth.getInstitution();
  return c.json(data);
}));

// Mount route modules
app.route('/api/stats', createStatsRoutes(nexhealth, ensureAuthenticated));
app.route('/api/patients', createPatientsRoutes(nexhealth, ensureAuthenticated));
app.route('/api/appointments', createAppointmentsRoutes(nexhealth, ensureAuthenticated));
app.route('/api/providers', createProvidersRoutes(nexhealth, ensureAuthenticated));

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Global error handler
app.onError(globalErrorHandler);

// Start server
console.log(`Starting NexHealth Explorer Backend...`);
console.log(`Server running on http://localhost:${config.server.port}`);

serve({
  fetch: app.fetch,
  port: config.server.port,
});
