/**
 * Error Handler Middleware
 * Centralized error handling for all routes
 */

import type { Context, Next } from 'hono';

/**
 * Custom error class for NexHealth API errors
 */
export class NexHealthApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'NexHealthApiError';
  }
}

/**
 * Async error handler middleware
 * Wraps route handlers to catch and handle errors consistently
 */
export function asyncHandler(
  fn: (c: Context) => Promise<Response>
) {
  return async (c: Context) => {
    try {
      return await fn(c);
    } catch (error) {
      return handleError(error, c);
    }
  };
}

/**
 * Centralized error handling logic
 */
function handleError(error: unknown, c: Context): Response {
  // Log the error
  console.error('Error:', error);
  
  // Handle NexHealthApiError
  if (error instanceof NexHealthApiError) {
    return c.json(
      {
        error: error.message,
        details: error.details,
      },
      error.statusCode
    );
  }
  
  // Handle standard Error
  if (error instanceof Error) {
    return c.json(
      {
        error: error.message,
      },
      500
    );
  }
  
  // Handle unknown errors
  return c.json(
    {
      error: 'An unexpected error occurred',
    },
    500
  );
}

/**
 * Global error handler for unhandled errors
 */
export function globalErrorHandler(err: Error, c: Context): Response {
  console.error('Unhandled error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message,
    },
    500
  );
}
