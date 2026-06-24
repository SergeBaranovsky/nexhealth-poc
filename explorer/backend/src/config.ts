/**
 * Backend Configuration
 * Centralized configuration with validation
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Application configuration object
 */
export const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '8000'),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  
  // NexHealth API configuration
  nexhealth: {
    apiKey: process.env.NEXHEALTH_API_KEY || '',
    subdomain: process.env.NEXHEALTH_SUBDOMAIN || '',
    locationId: process.env.NEXHEALTH_LOCATION_ID || '',
    baseUrl: process.env.NEXHEALTH_BASE_URL,
    apiVersion: process.env.NEXHEALTH_API_VERSION,
  },
  
  // Cache configuration
  cache: {
    statsTTL: 5 * 60 * 1000, // 5 minutes in milliseconds
    requestTTL: 2 * 60 * 1000, // 2 minutes for API request cache
  },
  
  // Request configuration
  request: {
    timeout: 10000, // 10 seconds in milliseconds
    maxRetries: 3,
    retryDelay: 1000, // Base delay in milliseconds for exponential backoff
  },
  
  // Pagination defaults
  pagination: {
    defaultPerPage: 25,
    maxPerPage: 100,
  },
} as const;

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = [
  'NEXHEALTH_API_KEY',
  'NEXHEALTH_SUBDOMAIN',
  'NEXHEALTH_LOCATION_ID',
] as const;

/**
 * Validates that all required environment variables are set
 * @throws Error if any required environment variable is missing
 */
export function validateConfig(): void {
  const missing: string[] = [];
  
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Type-safe access to configuration
 */
export type Config = typeof config;
