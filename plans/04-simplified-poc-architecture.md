# Simplified POC Architecture - TypeScript Full-Stack

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

#### Option 2: Hono (Modern, Fast) ⭐ **RECOMMENDED FOR POC**
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

**Day 1-2: Setup**
- [ ] Initialize both projects (Vite for frontend, Node for backend)
- [ ] Set up TypeScript configs
- [ ] Install minimal dependencies
- [ ] Create basic folder structure
- [ ] Set up environment variables

**Day 3-4: Backend API Proxy**
- [ ] Create NexHealth client with authentication
- [ ] Implement `/api/patients` endpoint
- [ ] Implement `/api/appointments` endpoint
- [ ] Implement `/api/providers` endpoint
- [ ] Test with Postman/Insomnia

**Day 5-7: Frontend Pages**
- [ ] Create basic layout with routing
- [ ] Build Dashboard page (simple stats)
- [ ] Build Patients list page (table with data)
- [ ] Build Appointments list page
- [ ] Add basic styling with Tailwind

**Result:** Working POC that displays NexHealth data

### Week 2: Polish & Expand (Optional)

- [ ] Add search functionality
- [ ] Add pagination
- [ ] Add loading states
- [ ] Improve error handling
- [ ] Add patient detail view
- [ ] Add basic styling improvements

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

## Recommended Approach for POC

### Day 1: Backend
```bash
mkdir -p explorer/backend
cd explorer/backend
npm init -y
npm install hono @hono/node-server dotenv
npm install -D typescript tsx @types/node
# Create basic API that proxies NexHealth
```

### Day 2: Frontend
```bash
mkdir -p explorer/frontend
cd explorer/frontend
npm create vite@latest . -- --template react-ts
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
# Create basic pages with routing
```

### Day 3-5: Connect & Build
- Connect frontend to backend
- Display data in tables
- Add basic navigation
- Style with Tailwind

### Day 6-7: Polish
- Add loading states
- Add error handling
- Improve UI
- Add search/filters

**Result:** Working POC in 1 week with minimal complexity!

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
