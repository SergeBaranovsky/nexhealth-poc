# NexHealth Explorer - Backend

Backend API server for the NexHealth Explorer POC. Built with Node.js, TypeScript, and Hono.

## Features

- 🔒 Secure API key management
- 🔄 Automatic token authentication with NexHealth
- 📡 RESTful API endpoints (modular routes)
- 🚀 Fast and lightweight (Hono framework)
- 📝 Full TypeScript support
- ⚡ Request caching (2-minute TTL, 10-56x faster)
- ⏱️ Request timeout protection (10 seconds)
- 🔁 Retry logic with exponential backoff (3 retries)
- 📊 Route-level caching for stats (100x faster)
- 🛡️ Centralized error handling
- ⚙️ Centralized configuration

## Prerequisites

- Node.js 20+
- npm or yarn
- NexHealth API credentials

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env` and fill in your NexHealth credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
NEXHEALTH_API_KEY=your_api_key_here
NEXHEALTH_SUBDOMAIN=your_subdomain
NEXHEALTH_LOCATION_ID=your_location_id
```

3. **Run the development server:**

```bash
npm run dev
```

The server will start on http://localhost:8000

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Check TypeScript types

## API Endpoints

### Health Check

```
GET /health
```

Returns server status.

### Statistics (Cached)

```
GET /api/stats
```

Get aggregated statistics for patients, appointments, and providers.

**Performance:**
- Route-level cache: 5 minutes
- Client-level cache: 2 minutes
- Response time: ~5ms (cached)

**Response:**
```json
{
  "patients": { "total": 100 },
  "appointments": { "total": 250 },
  "providers": { "total": 10 }
}
```

### Patients

```
GET /api/patients?page=1&per_page=25&search=john
GET /api/patients/:id
```

List patients or get a specific patient by ID.

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 25)
- `search` - Search by name (optional)
- `inactive` - Include inactive patients (optional)

### Appointments

```
GET /api/appointments?start=2024-01-01&end=2024-12-31
```

List appointments within a date range.

**Query Parameters:**
- `start` - Start date (ISO format)
- `end` - End date (ISO format)
- `page` - Page number
- `per_page` - Items per page

### Providers

```
GET /api/providers
```

List all providers.

### Appointment Types

```
GET /api/appointment-types
```

List all appointment types.

### Available Slots

```
GET /api/available-slots?provider_id=123&days=7
```

Get available appointment slots.

**Query Parameters:**
- `provider_id` - Filter by provider
- `appointment_type_id` - Filter by appointment type
- `start_date` - Start date (YYYY-MM-DD)
- `days` - Number of days to check (default: 7)

## Project Structure

```
backend/
├── src/
│   ├── routes/           # Modular route handlers
│   │   ├── stats.ts      # Statistics endpoint (cached)
│   │   ├── patients.ts   # Patient endpoints
│   │   ├── appointments.ts # Appointment endpoints
│   │   └── providers.ts  # Provider endpoints
│   ├── middleware/       # Express middleware
│   │   └── errorHandler.ts # Centralized error handling
│   ├── index.ts          # Main server (refactored, 65% smaller)
│   ├── nexhealth.ts      # NexHealth API client (enhanced)
│   ├── config.ts         # Centralized configuration
│   └── types.ts          # TypeScript types (in ../shared/)
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Performance Optimizations

### Request Caching
- **TTL:** 2 minutes for all GET requests
- **Storage:** In-memory Map-based cache
- **Performance:** 10-56x faster for repeated requests
- **Cache methods:** `getCached()`, `setCached()`, `clearCache()`, `clearCacheEntry()`

### Request Timeout
- **Default:** 10 seconds (configurable via `config.request.timeout`)
- **Implementation:** AbortController
- **Prevents:** Hanging requests

### Retry Logic
- **Attempts:** 3 retries with exponential backoff (1s, 2s, 4s)
- **Smart retry:** Skips 4xx client errors
- **Configurable:** `config.request.maxRetries`, `config.request.retryDelay`
- **Logging:** Detailed retry attempt logs

### Route-Level Caching
- **Stats endpoint:** 5-minute cache
- **Performance:** 500ms → ~5ms (100x faster)

### Configuration

All performance settings are in `src/config.ts`:

```typescript
cache: {
  statsTTL: 5 * 60 * 1000,      // 5 minutes (route-level)
  requestTTL: 2 * 60 * 1000,    // 2 minutes (client-level)
},
request: {
  timeout: 10000,      // 10 seconds
  maxRetries: 3,       // 3 retry attempts
  retryDelay: 1000,    // 1 second base delay
}
```

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:

- `200` - Success
- `404` - Not found
- `500` - Server error

Error response format:

```json
{
  "error": "Error message"
}
```

## Development Notes

- The server automatically authenticates with NexHealth on startup
- Authentication token is reused for all subsequent requests
- CORS is enabled for the frontend (default: http://localhost:5173)
- Request logging is enabled in development mode
- All routes use the route factory pattern for dependency injection
- Centralized error handling via middleware (no try/catch in routes)
- Request caching is automatic for all GET requests
- Stats endpoint has additional route-level caching

## Known API Limitations

### NexHealth API v20240412 - No Total Count in Responses

**Issue:** The NexHealth API does not provide a `total_count` or `total_pages` field in paginated responses. The `count` field only returns the number of items in the current page, not the total across all pages.

**Documentation:** https://docs.nexhealth.com/reference/pagination.md

**Example:**
```bash
# Request with per_page=1
curl /api/patients?per_page=1
# Response: { count: 1, data: { patients: [...] } }  # ❌ Not the total!

# Request with per_page=25
curl /api/patients?per_page=25
# Response: { count: 25, data: { patients: [...] } }  # Only shows page size

# Request with per_page=200 (all records)
curl /api/patients?per_page=200
# Response: { count: 104, data: { patients: [...] } }  # ✅ Actual total (104 patients)
```

**Impact:** To get accurate total counts for stats, we must fetch all records by using a large `per_page` value.

**Our Solution (Stats Endpoint):**
```typescript
// File: src/routes/stats.ts
// Fetch all records with per_page=1000 to get accurate counts
const patientsData = await nexhealth.getPatients({ per_page: 1000 });
const total = patientsData.data.patients?.length || 0;  // Count array length
```

**Why per_page=1000:**
- NexHealth API supports up to `per_page=1000` (confirmed in docs)
- Most POC/sandbox environments have <1000 patients
- Stats are cached for 5 minutes to minimize API calls
- Client-level cache (2 min) further reduces load

**Performance:**
- Initial request: ~500ms (fetches 1000 records)
- Cached requests: ~5ms (route cache) or ~0.026ms (client cache)
- 100-56x improvement with caching

**Alternative Approaches (Not Implemented):**
1. ❌ Use cursor-based pagination to iterate all pages (slow, complex)
2. ❌ Show "100+" instead of exact counts (poor UX)
3. ❌ Use `per_page=1` (incorrect totals, shows "1 patient")
4. ✅ **Current: Use `per_page=1000` + aggressive caching** (simple, accurate, fast)

## Troubleshooting

**"Missing required environment variable" error:**
- Make sure you've created a `.env` file with all required variables

**"Authentication failed" error:**
- Verify your API key and subdomain are correct
- Check that your API key has the necessary permissions

**CORS errors:**
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
