# NexHealth Explorer

A full-stack TypeScript application for exploring NexHealth sandbox data.

## Overview

This is a **Proof of Concept (POC)** application following the simplified architecture from `plans/04-simplified-poc-architecture.md`.

**Technology Stack:**
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + TypeScript + Hono
- **Shared:** TypeScript types used by both frontend and backend

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- NexHealth API credentials (API key, subdomain, location ID)

### Setup & Run

1. **Clone and navigate to project:**

```bash
cd nexhealth-poc/explorer
```

2. **Setup Backend:**

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your NexHealth credentials

# Start backend server
npm run dev
```

Backend will run on http://localhost:8000

3. **Setup Frontend (in a new terminal):**

```bash
cd ../frontend
npm install

# Start frontend dev server
npm run dev
```

Frontend will run on http://localhost:5173

4. **Open in browser:**

Visit http://localhost:5173

## Project Structure

```
explorer/
├── backend/                 # Node.js + Hono API
│   ├── src/
│   │   ├── routes/         # Modular route handlers
│   │   │   ├── stats.ts
│   │   │   ├── patients.ts
│   │   │   ├── appointments.ts
│   │   │   └── providers.ts
│   │   ├── middleware/     # Express middleware
│   │   │   └── errorHandler.ts
│   │   ├── index.ts        # Main server (refactored)
│   │   ├── nexhealth.ts    # NexHealth API client (enhanced)
│   │   └── config.ts       # Centralized configuration
│   ├── package.json
│   └── README.md
│
├── frontend/                # React + TypeScript app
│   ├── src/
│   │   ├── pages/          # Page components (refactored)
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Patients.tsx
│   │   │   ├── Appointments.tsx
│   │   │   └── Providers.tsx
│   │   ├── components/     # Reusable components
│   │   │   ├── common/     # Shared UI components
│   │   │   │   ├── Pagination.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── ErrorAlert.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   ├── DataTable.tsx
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── StatCard.tsx
│   │   │   └── Layout.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useApi.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useStats.ts
│   │   ├── utils/          # Utility functions
│   │   │   ├── formatters.ts
│   │   │   ├── constants.ts
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── README.md
│
├── shared/                  # Shared TypeScript types
│   └── types.ts            # Enhanced with response & filter types
│
└── README.md               # This file
```

## Features

### Current Features (POC v1 - Refactored)

**Frontend:**
- ✅ Dashboard with statistics and caching
- ✅ Patient list with search and pagination
- ✅ Appointments list with filters
- ✅ Provider directory
- ✅ Responsive UI with TailwindCSS
- ✅ Reusable component library (6 common components)
- ✅ Custom hooks (pagination, debouncing, stats caching)
- ✅ Search debouncing (~80% reduction in API calls)
- ✅ Type-safe API with shared TypeScript types
- ✅ Consistent error handling and loading states

**Backend:**
- ✅ Secure API key management
- ✅ Modular route structure (4 route modules)
- ✅ Centralized configuration
- ✅ Request caching (2-minute TTL, 10-56x faster)
- ✅ Request timeout protection (10-second max)
- ✅ Retry logic with exponential backoff (3 retries)
- ✅ Route-level caching for stats (100x faster)
- ✅ Centralized error handling middleware

**Performance:**
- ✅ Stats endpoint: 500ms → ~5ms (route cache)
- ✅ Stats requests: 1.45s → 0.026s (client cache)
- ✅ Patient requests: 0.287s → 0.019s (client cache)
- ✅ Search efficiency: ~80% reduction in API calls

### Planned Features (Future)

- [ ] Patient detail view
- [ ] Available slots view
- [ ] Appointment types management
- [ ] Error boundaries
- [ ] Automated testing (Vitest)

## API Endpoints

Backend provides these REST endpoints:

- `GET /health` - Health check
- `GET /api/stats` - Statistics (cached, ultra-fast)
- `GET /api/patients` - List patients (with search & pagination)
- `GET /api/patients/:id` - Get patient details
- `GET /api/appointments` - List appointments (with filters)
- `GET /api/providers` - List providers
- `GET /api/appointment-types` - List appointment types
- `GET /api/available-slots` - Get available slots

**Features:**
- Automatic request caching (2-minute TTL)
- Request timeout protection (10 seconds)
- Retry logic with exponential backoff
- Route-level caching for stats endpoint

See `backend/README.md` for detailed API documentation.

## Development

### Backend Development

```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run type-check   # Check TypeScript types
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run type-check   # Check TypeScript types
```

## Performance Optimizations

This application includes several performance enhancements:

### Backend Optimizations
- **Route-level caching:** Stats endpoint cached for 5 minutes (100x faster)
- **Request-level caching:** All GET requests cached for 2 minutes (10-56x faster)
- **Request timeout:** 10-second maximum prevents hanging requests
- **Retry logic:** 3 retries with exponential backoff (1s, 2s, 4s)
- **Smart retry:** Skips retry on 4xx client errors

### Frontend Optimizations
- **Search debouncing:** 500ms delay reduces API calls by ~80%
- **Stats caching:** Dashboard stats cached in React state
- **Pagination hooks:** Efficient page management
- **Reusable components:** Reduced code duplication by 142+ lines

### Measured Performance Improvements
- Stats endpoint: 500ms → ~5ms (route cache) = **100x faster**
- Stats requests: 1.45s → 0.026s (client cache) = **56x faster**
- Patient requests: 0.287s → 0.019s (client cache) = **15x faster**
- Search API calls: ~80% reduction (debouncing)

## Architecture Decisions

This POC follows these principles:

### ✅ What We Use

- **React built-in hooks** (`useState`, `useEffect`) - No state management library
- **Simple fetch API** - No React Query or SWR
- **TailwindCSS** - Fast styling without CSS files
- **TypeScript** - Full type safety across frontend and backend
- **Hono** - Lightweight, fast API framework

### ❌ What We Skip (for POC)

- Redux/Zustand/MobX
- React Query/SWR
- Docker
- Complex testing setup
- CI/CD pipelines
- Database
- Authentication (uses API key only)

**Why?** These can be added later when complexity demands it. For POC, keep it simple!

## Migration Path

When ready to scale up:

1. Add React Query for data fetching
2. Add Zustand if state becomes complex
3. Add proper testing (Vitest + React Testing Library)
4. Add Docker for deployment
5. Add CI/CD pipeline
6. Add monitoring and logging

See `plans/04-simplified-poc-architecture.md` for details.

## Troubleshooting

### Backend issues

**"Missing required environment variable" error:**
- Copy `.env.example` to `.env` in backend directory
- Fill in your NexHealth credentials

**"Authentication failed" error:**
- Verify API key and subdomain are correct
- Check API key has necessary permissions

### Frontend issues

**"Cannot connect to backend" error:**
- Make sure backend is running on port 8000
- Check backend terminal for errors

**Blank page:**
- Check browser console for errors
- Verify backend is running and healthy (`curl http://localhost:8000/health`)

**CORS errors:**
- Update `CORS_ORIGIN` in backend `.env`
- Restart backend after changing `.env`

## Documentation

- **POC Architecture:** `../plans/04-simplified-poc-architecture.md`
- **Folder Structure:** `../plans/FOLDER-STRUCTURE.md`
- **Approach Comparison:** `../plans/APPROACH-COMPARISON.md`
- **Backend README:** `backend/README.md`
- **Frontend README:** `frontend/README.md`

## Reference Implementation

The NexHealth API client is ported from the Python reference implementation:
- See `../test/nexhealth_sandbox_improved.py`

## Contributing

This is a POC project. When adding features:

1. Keep it simple
2. Follow existing patterns
3. Update shared types if needed
4. Test manually (no automated tests yet)
5. Update documentation

## License

MIT
