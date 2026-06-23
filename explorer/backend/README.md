# NexHealth Explorer - Backend

Backend API server for the NexHealth Explorer POC. Built with Node.js, TypeScript, and Hono.

## Features

- 🔒 Secure API key management
- 🔄 Automatic token authentication with NexHealth
- 📡 RESTful API endpoints
- 🚀 Fast and lightweight (Hono framework)
- 📝 Full TypeScript support

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

### Institution

```
GET /api/institution
```

Get institution and location information.

### Patients

```
GET /api/patients?page=1&per_page=25
GET /api/patients/:id
```

List patients or get a specific patient by ID.

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 25)

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
│   ├── index.ts          # Main server file
│   ├── nexhealth.ts      # NexHealth API client
│   └── types.ts          # TypeScript types (in ../shared/)
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
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

## Troubleshooting

**"Missing required environment variable" error:**
- Make sure you've created a `.env` file with all required variables

**"Authentication failed" error:**
- Verify your API key and subdomain are correct
- Check that your API key has the necessary permissions

**CORS errors:**
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
