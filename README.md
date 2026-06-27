# NexHealth Sandbox Explorer - POC

A TypeScript full-stack web application for exploring NexHealth API sandbox data with an intuitive UI.

## Project Status: **FUNCTIONAL POC COMPLETE**

This is a working proof-of-concept that:
- ✅ Connects to real NexHealth sandbox API
- ✅ Displays actual patient, appointment, and provider data
- ✅ Includes search functionality on Patients page
- ✅ Includes pagination on all list pages
- ✅ Includes date filtering on Appointments page
- ✅ Shows real-time dashboard with stats and recent activity

## Architecture

**Frontend:**
- React 18 + TypeScript
- Vite (dev server and build tool)
- TailwindCSS (styling)
- React Router (navigation)
- Custom hooks for data fetching (no external state management)

**Backend:**
- Node.js + TypeScript
- Hono (fast, lightweight web framework)
- Direct NexHealth API integration
- CORS enabled for local development

## Quick Start

### Prerequisites

- Node.js 20+ installed
- NexHealth sandbox credentials

### Option 1: Use the Startup Script (Recommended)

```bash
# Make sure you have your .env file configured first
cp explorer/backend/.env.example explorer/backend/.env
# Edit .env with your credentials

# Start both servers with one command
./start-dev.sh
```

This will:
1. Check and install dependencies if needed
2. Start backend on http://localhost:8000
3. Start frontend on http://localhost:5173
4. Open your browser to the app

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd explorer/backend
npm install
cp .env.example .env  # Edit with your credentials
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd explorer/frontend
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Project Structure

```
nexhealth-poc/
├── explorer/
│   ├── backend/          # Node.js + Hono API server
│   │   ├── src/
│   │   │   ├── index.ts        # Main server entry point
│   │   │   └── nexhealth.ts    # NexHealth API client
│   │   ├── package.json
│   │   └── .env                # API credentials
│   │
│   ├── frontend/         # React + TypeScript app
│   │   ├── src/
│   │   │   ├── pages/          # Dashboard, Patients, Appointments, Providers
│   │   │   ├── components/     # Reusable components (Layout)
│   │   │   ├── hooks/          # Custom hooks (useApi)
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── shared/           # Shared TypeScript types
│       └── types.ts
│
├── plans/                # Comprehensive planning docs
├── test/                 # Python reference scripts
├── start-dev.sh          # One-command startup script
└── README.md             # This file
```

## Features

### Dashboard
- **Real-time stats** - Patient count, appointment count, provider count
- **Recent patients** - Last 5 patients with status
- **Upcoming appointments** - Next 10 appointments with confirmation status

### Patients Page
- **Full patient list** with pagination (25 per page)
- **Search functionality** - Search by name or email
- **Patient details** - Name, email, phone, date of birth, active status
- **Clear filters** - Reset search with one click

### Appointments Page
- **Appointment list** with pagination (25 per page)
- **Date range filter** - Filter appointments by start and end date
- **Status indicators** - Visual badges for confirmed, pending, cancelled
- **Provider information** - Shows provider name when available
- **Auto-formatting** - Dates displayed in local timezone

### Providers Page
- **Full provider list** - All providers in the system
- **Provider details** - Name, NPI, email

## Configuration

### Environment Variables

Create `explorer/backend/.env`:

```env
# NexHealth API Configuration
NEXHEALTH_API_KEY=your-api-key-here
NEXHEALTH_SUBDOMAIN=your-subdomain
NEXHEALTH_LOCATION_ID=your-location-id
NEXHEALTH_BASE_URL=https://nexhealth.info
NEXHEALTH_API_VERSION=v20240412

# Server Configuration
PORT=8000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Testing

The POC has been tested and verified to:
- ✅ Successfully authenticate with NexHealth API
- ✅ Fetch real patient data (showing 100+ patients in sandbox)
- ✅ Fetch real appointment data (showing 200+ appointments)
- ✅ Fetch real provider data
- ✅ Handle pagination correctly
- ✅ Filter appointments by date range
- ✅ Search patients by name and email

## API Endpoints

The backend exposes these endpoints:

- `GET /api/stats` - Get total counts for dashboard (patients, appointments, providers)
  - **Note:** Uses `per_page=1000` workaround due to NexHealth API limitation (no `total_count` field)
  - Cached for 5 minutes to minimize API load
  - See `explorer/backend/README.md` for detailed explanation
- `GET /api/patients` - List patients (supports ?page, ?per_page)
- `GET /api/patients/:id` - Get single patient
- `GET /api/appointments` - List appointments (supports ?start, ?end, ?page, ?per_page)
- `GET /api/providers` - List all providers
- `GET /api/appointment-types` - List appointment types
- `GET /api/available-slots` - Find available time slots
- `GET /health` - Health check endpoint

## What's NOT Included (Future Enhancements)

This is a POC focused on core functionality. Future enhancements could include:

- [ ] Patient detail view page
- [ ] Appointment booking functionality
- [ ] Advanced search with multiple filters
- [ ] Export data (CSV, PDF)
- [ ] Data visualization and charts
- [ ] User authentication
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] Production deployment setup
- [ ] Error boundaries and advanced error handling
- [ ] Loading skeletons instead of spinners
- [ ] Optimistic UI updates

## Development Notes

### Key Decisions

1. **No State Management Library** - Using React's built-in hooks (useState, useEffect) is sufficient for POC
2. **No React Query** - Simple fetch + custom useApi hook works well for current needs
3. **TypeScript Full-Stack** - Shared types between frontend and backend reduce bugs
4. **Hono over Express** - Lighter, faster, better TypeScript support out of the box
5. **No Database** - All data fetched directly from NexHealth API (stateless)
6. **Stats Workaround** - Using `per_page=1000` for stats because NexHealth API v20240412 doesn't provide `total_count` in responses (see backend README for details)

### Adding New Features

To add a new page:

1. Create component in `frontend/src/pages/YourPage.tsx`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `frontend/src/components/Layout.tsx`
4. Add API endpoint in `backend/src/index.ts` if needed
5. Add method in `backend/src/nexhealth.ts` if needed

## Documentation

See the `plans/` directory for comprehensive planning documentation:

- **04-simplified-poc-architecture.md** - POC technical approach (recommended starting point)
- **00-executive-summary.md** - High-level overview
- **01-technical-architecture.md** - Detailed architecture for full production app
- **02-features-and-ui-specification.md** - Feature specifications
- **03-implementation-roadmap.md** - Development roadmap

## Troubleshooting

**Backend won't start:**
- Check that .env file exists and has correct credentials
- Verify Node.js version is 20+
- Check port 8000 is not in use: `lsof -ti:8000`

**Frontend shows "no data":**
- Verify backend is running on http://localhost:8000
- Check browser console for errors
- Test backend directly: `curl http://localhost:8000/api/patients`

**CORS errors:**
- Ensure CORS_ORIGIN in .env matches frontend URL
- Restart backend after changing .env

## License

Internal POC - Not for public distribution

## Contact

For questions about this POC, see the planning documentation in the `plans/` folder.
