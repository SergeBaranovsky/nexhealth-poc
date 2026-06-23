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
│   │   ├── index.ts        # Main server
│   │   └── nexhealth.ts    # NexHealth API client
│   ├── package.json
│   └── README.md
│
├── frontend/                # React + TypeScript app
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom hooks
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── README.md
│
├── shared/                  # Shared TypeScript types
│   └── types.ts
│
└── README.md               # This file
```

## Features

### Current Features (POC v1)

- ✅ Dashboard with statistics
- ✅ Patient list view
- ✅ Appointments list view
- ✅ Provider directory
- ✅ Responsive UI with TailwindCSS
- ✅ Type-safe API with shared TypeScript types
- ✅ Secure API key management (backend only)

### Planned Features (Future)

- [ ] Patient detail view
- [ ] Search and filters
- [ ] Pagination
- [ ] Available slots view
- [ ] Appointment types
- [ ] Error boundaries
- [ ] Loading states improvements

## API Endpoints

Backend provides these REST endpoints:

- `GET /health` - Health check
- `GET /api/institution` - Institution info
- `GET /api/patients` - List patients
- `GET /api/patients/:id` - Get patient details
- `GET /api/appointments` - List appointments
- `GET /api/providers` - List providers
- `GET /api/appointment-types` - List appointment types
- `GET /api/available-slots` - Get available slots

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
