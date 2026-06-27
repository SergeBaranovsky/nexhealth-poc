# Simplified POC Architecture - TypeScript Full-Stack

> **✅ STATUS: FUNCTIONAL POC COMPLETE** (Updated: June 23, 2026)
> 
> The POC is fully functional with real data from NexHealth API! All features are working including search, filters, and pagination. Both backend and frontend are running and tested. See [Current Status](#-current-status-updated-june-23-2026) section below.

## Overview

This document outlines a **simplified approach** for a Proof of Concept (POC) that prioritizes:
- **Speed** - Get something working quickly
- **Simplicity** - Minimal dependencies and complexity
- **Single Language** - TypeScript for both frontend and backend
- **Easy to extend** - Can evolve into full app later

## Key Simplifications for POC

### 1. State Management

**❌ DON'T USE (for POC):**
- Zustand
- Redux
- MobX
- Complex state management libraries

**✅ USE INSTEAD:**
- **React's built-in hooks:**
  - `useState` for local component state
  - `useContext` for sharing data across components (if needed)
  - `useEffect` for side effects
  - `useCallback` / `useMemo` for optimization (only if needed)

**Why:** For a POC with 5-7 pages, React's built-in state is sufficient. You can always refactor to Zustand later if complexity grows.

### 2. Data Fetching

**❌ DON'T USE (for POC):**
- React Query (TanStack Query)
- SWR
- Apollo Client

**✅ USE INSTEAD:**
- **Simple fetch or axios** with `useState` + `useEffect`
- Create a simple custom hook for reusability

**Example:**
```typescript
// Simple custom hook for data fetching
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api${url}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage in component
function PatientList() {
  const { data, loading, error } = useApi<Patient[]>('/patients');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{/* render patients */}</div>;
}
```

**Why:** For POC, this is 100% sufficient. React Query is great but adds complexity you don't need yet.

### 3. Backend: TypeScript Instead of Python

**✅ RECOMMENDED: Node.js + TypeScript**

**Benefits for POC:**
- ✅ Single language (TypeScript) for entire stack
- ✅ Easier for one developer to work on both frontend and backend
- ✅ Can share types between frontend and backend
- ✅ Faster setup than Python virtual environments
- ✅ Great ecosystem for web APIs

**Backend Framework Options:**

#### Option 1: Express.js (Most Common)
```typescript
// Familiar, tons of examples, mature ecosystem
import express from 'express';
const app = express();

app.get('/api/patients', async (req, res) => {
  // Call NexHealth API
  const response = await fetch('https://nexhealth.info/patients', {
    headers: { 'Authorization': API_KEY }
  });
  res.json(await response.json());
});
```

#### Option 2: Hono (Modern, Fast) **RECOMMENDED FOR POC**
```typescript
// Modern, simple, fast, great TypeScript support
import { Hono } from 'hono';
const app = new Hono();

app.get('/api/patients', async (c) => {
  const response = await fetch('https://nexhealth.info/patients', {
    headers: { 'Authorization': API_KEY }
  });
  return c.json(await response.json());
});
```

**Why Hono:**
- Ultralight and fast
- Excellent TypeScript support out of the box
- Simpler API than Express
- Built-in helpers for common tasks
- Can run on Node.js, Cloudflare Workers, Deno, Bun

## Simplified Technology Stack

### Frontend
```json
{
  "core": "React 18 + TypeScript + Vite",
  "styling": "TailwindCSS",
  "routing": "React Router v6",
  "data-fetching": "fetch API + custom hooks",
  "state": "useState + useContext",
  "ui-components": "shadcn/ui (optional, can use plain Tailwind)"
}
```

**Dependencies:**
```bash
npm install react react-dom react-router-dom
npm install -D typescript @types/react @types/react-dom
npm install -D vite @vitejs/plugin-react
npm install -D tailwindcss postcss autoprefixer
```

### Backend
```json
{
  "runtime": "Node.js 20+",
  "framework": "Hono or Express",
  "language": "TypeScript",
  "http-client": "fetch (native in Node 18+)",
  "env-vars": "dotenv"
}
```

**Dependencies:**
```bash
npm install hono @hono/node-server
# OR
npm install express
npm install -D @types/express

# Common
npm install dotenv
npm install -D typescript tsx @types/node
```

## Simplified Project Structure

```
nexhealth-poc/
├── explorer/                    # Main application folder
│   ├── frontend/                # React app
│   │   ├── src/
│   │   │   ├── pages/          # Page components
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Patients.tsx
│   │   │   │   └── Appointments.tsx
│   │   │   ├── components/     # Reusable components
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── DataTable.tsx
│   │   │   ├── hooks/          # Custom hooks
│   │   │   │   └── useApi.ts
│   │   │   ├── types/          # TypeScript types
│   │   │   │   └── api.ts
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend/                 # Node.js API
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── nexhealth.ts    # NexHealth API client
│   │   │   ├── routes.ts       # API routes
│   │   │   └── types.ts        # Shared types
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                  # Shared types (optional)
│   │   └── types.ts            # Types used by both F&B
│   │
│   └── README.md
│
├── plans/                       # Planning documentation
├── test/                        # Test scripts
└── README.md
```

## Shared Types Between Frontend & Backend

**Big advantage of TypeScript full-stack:**

```typescript
// explorer/shared/types.ts or explorer/backend/src/types.ts
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  bio?: {
    date_of_birth?: string;
    gender?: string;
  };
  inactive: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id?: string;
  start_time: string;
  end_time: string;
  status?: string;
}

// Backend uses these types
// Frontend imports and uses the same types - no duplication!
```

## POC Implementation Timeline

### Week 1: Core Setup & Basic Features

**Day 1-2: Setup** ✅ COMPLETED
- [x] Initialize both projects (Vite for frontend, Node for backend)
- [x] Set up TypeScript configs
- [x] Install minimal dependencies (package.json created, npm install needed)
- [x] Create basic folder structure
- [x] Set up environment variables (.env.example created)

**Day 3-4: Backend API Proxy** ✅ COMPLETED
- [x] Create NexHealth client with authentication (ported from Python)
- [x] Implement `/api/patients` endpoint
- [x] Implement `/api/appointments` endpoint
- [x] Implement `/api/providers` endpoint
- [x] Implement `/api/appointment-types` endpoint (bonus)
- [x] Implement `/api/available-slots` endpoint (bonus)
- [ ] Test with Postman/Insomnia (requires npm install & .env setup)

**Day 5-7: Frontend Pages** ✅ COMPLETED
- [x] Create basic layout with routing
- [x] Build Dashboard page (simple stats)
- [x] Build Patients list page (table with data)
- [x] Build Appointments list page
- [x] Build Providers list page (bonus)
- [x] Add basic styling with Tailwind

**Result:** ✅ All code written! Ready to run after `npm install` and `.env` setup

---

## Current Status (Updated: June 23, 2026)

### ✅ Completed and Working
- ✅ Backend API running (TypeScript + Hono on port 8000)
- ✅ Frontend app running (React + Vite on port 5173)
- ✅ Real data fetching from NexHealth API verified
- ✅ Stats endpoint (`/api/stats`) for accurate total counts across all pages
- ✅ Dashboard with live stats and recent activity showing accurate totals (104 patients, 80 appointments)
- ✅ Patients page with search functionality (by name/email)
- ✅ Patients page with pagination (25 per page) and accurate count display
- ✅ Appointments page with date range filters
- ✅ Appointments page with pagination (25 per page) and accurate count display
- ✅ Pagination displays accurate "Showing X to Y of Z" on all pages
- ✅ Providers page (complete list)
- ✅ Loading states and error handling
- ✅ Responsive UI with TailwindCSS
- ✅ Type-safe API client with proper response transformation
- ✅ Development startup script (`start-dev.sh`)
- ✅ Comprehensive documentation

### ✅ Verified Working
- Authentication with NexHealth API
- Patient data display (100+ patients in sandbox)
- Appointment data display (200+ appointments)
- Provider data display
- Search filtering
- Date range filtering
- Pagination controls
- Status indicators (active/inactive, confirmed/pending/cancelled)

### Future Enhancements (Not Required for POC)
- Patient detail view page
- Advanced search with multiple filters
- Sorting by column headers
- Export functionality (CSV, PDF)
- Unit tests and integration tests
- Error boundaries
- Docker containerization
- Production deployment
- Appointment booking functionality

### Running the POC

The POC is now fully functional! To run it:

**Quick Start (Recommended):**
```bash
# From project root
./start-dev.sh
```

This will automatically:
- Install dependencies if needed
- Start backend on http://localhost:8000
- Start frontend on http://localhost:5173
- Both servers run concurrently

**Manual Start:**
```bash
# Terminal 1 - Backend
cd explorer/backend
npm run dev

# Terminal 2 - Frontend  
cd explorer/frontend
npm run dev
```

**What You'll See:**
- Dashboard with real patient/appointment counts
- Recent patients list
- Upcoming appointments
- Full patient search and pagination
- Appointment filtering by date
- Provider directory

**Estimated time:** ~2 minutes if dependencies already installed

---

### Week 2: Polish & Expand (Optional)

- [ ] Add search functionality
- [ ] Add pagination
- [x] Add loading states (basic spinners implemented)
- [x] Basic error handling (error message display)
- [ ] Improve error handling (add error boundaries, retry logic)
- [ ] Add patient detail view
- [x] Add basic styling improvements (TailwindCSS layout complete)
- [ ] Add filters (by date, status, etc.)
- [ ] Add sorting (table columns)

## Minimal Code Examples

### Backend (Hono + TypeScript)

```typescript
// explorer/backend/src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { NexHealthClient } from './nexhealth';

const app = new Hono();

app.use('/*', cors());

const nexhealth = new NexHealthClient({
  apiKey: process.env.NEXHEALTH_API_KEY!,
  subdomain: process.env.NEXHEALTH_SUBDOMAIN!,
  locationId: process.env.NEXHEALTH_LOCATION_ID!,
});

// Initialize and authenticate
await nexhealth.authenticate();

app.get('/api/patients', async (c) => {
  const page = c.req.query('page') || '1';
  const perPage = c.req.query('per_page') || '25';
  
  const data = await nexhealth.getPatients({ page, per_page: perPage });
  return c.json(data);
});

app.get('/api/appointments', async (c) => {
  const start = c.req.query('start') || new Date().toISOString();
  const end = c.req.query('end') || new Date(Date.now() + 30*24*60*60*1000).toISOString();
  
  const data = await nexhealth.getAppointments({ start, end });
  return c.json(data);
});

export default app;
```

### Frontend (React + TypeScript)

```typescript
// explorer/frontend/src/pages/Patients.tsx
import { useState, useEffect } from 'react';
import { Patient } from '../types/api';

export function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => setPatients(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.first_name} {p.last_name}</td>
              <td className="p-2">{p.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## What to Skip for POC

### Skip These Initially:
- ❌ React Query / SWR
- ❌ Redux / Zustand / MobX
- ❌ Complex testing setup
- ❌ Docker (just run locally)
- ❌ CI/CD pipelines
- ❌ Advanced error boundaries
- ❌ Logging infrastructure
- ❌ Caching (Redis, etc.)
- ❌ Complex authentication
- ❌ Database
- ❌ WebSockets
- ❌ shadcn/ui (unless you really want it - plain Tailwind is faster for POC)

### Keep It Simple:
- ✅ Plain fetch or axios
- ✅ useState + useEffect
- ✅ Basic error handling (try/catch)
- ✅ Simple .env files
- ✅ Console.log for debugging
- ✅ Basic Tailwind classes
- ✅ React Router for navigation

## When to Add Complexity

**Add state management when:**
- You have >10 components sharing the same state
- You're prop-drilling more than 2-3 levels deep
- State updates become hard to track

**Add React Query when:**
- You need background refetching
- You need complex caching strategies
- You're making many API calls with dependencies
- You want optimistic updates

**Add Docker when:**
- Multiple developers need consistent environments
- Ready to deploy to production
- Need to test in containerized environment

## POC Success Criteria

After 1 week, you should have:
- ✅ Backend API running that proxies NexHealth API
- ✅ Frontend displaying patients, appointments, providers
- ✅ Basic routing between pages
- ✅ Minimal styling with Tailwind
- ✅ TypeScript types shared between frontend/backend
- ✅ Working authentication to NexHealth API

**That's it!** Keep it simple, get it working, then refactor.

## Migration Path to Full App

When ready to scale up the POC:

1. **Add React Query** - Replace custom `useApi` hook
2. **Add Zustand** - If state becomes complex
3. **Add shadcn/ui** - For polished UI components
4. **Add Testing** - Vitest + React Testing Library
5. **Add Docker** - Containerize for deployment
6. **Add CI/CD** - Automated testing and deployment
7. **Refactor backend** - Add proper error handling, logging
8. **Add caching** - Redis for frequently accessed data

But for POC: **Keep it simple!**

## ~~Recommended Approach for POC~~ ✅ IMPLEMENTATION COMPLETE

### ✅ Day 1: Backend - DONE
All backend code has been created:
- `explorer/backend/` structure created
- `package.json` with Hono, TypeScript, and all dependencies
- `src/nexhealth.ts` - Complete API client (ported from Python)
- `src/index.ts` - Full REST API with all endpoints
- TypeScript configuration and environment setup

**Next step:** Run `npm install` in `explorer/backend/`

### ✅ Day 2: Frontend - DONE
All frontend code has been created:
- `explorer/frontend/` structure with Vite + React + TypeScript
- Complete routing with React Router
- TailwindCSS configured
- Custom `useApi` hook for data fetching

**Next step:** Run `npm install` in `explorer/frontend/`

### ✅ Day 3-5: Connect & Build - DONE
- Frontend connected to backend via Vite proxy
- Dashboard, Patients, Appointments, Providers pages built
- Navigation and layout complete
- TailwindCSS styling applied

### ⚠️ Day 6-7: Polish - PARTIAL
- [x] Basic loading states (simple spinners)
- [x] Basic error handling (error message display)
- [x] Clean, responsive UI with TailwindCSS
- [ ] Search functionality
- [ ] Filters
- [ ] Pagination
- [ ] Advanced error boundaries

**Result:** ✅ Functional POC with core features complete. Polish items remain TODO.

## Questions Answered

### "Do we need State Management?"
**No, not for POC.** Use `useState` and `useContext` if needed. Add Zustand later if complexity grows.

### "Do we need API Client (React Query)?"
**No, not for POC.** Simple fetch + useState is enough. React Query is great but overkill for POC.

### "Should we use TypeScript for backend?"
**Yes!** Great idea for POC:
- Single language
- Share types
- Easier for one developer
- Fast setup
- Can port existing Python logic to TypeScript easily

## Final Recommendation

**For POC:**
```
Frontend: React + TypeScript + Vite + Tailwind + React Router
Backend:  Node.js + TypeScript + Hono
State:    useState + useContext (built-in React)
Data:     fetch + useEffect (no library needed)
```

**Start simple. Add complexity only when you feel the pain.**

This approach will get you a working POC in 1 week instead of 4-6 weeks!
