# NexHealth POC - Complete Folder Structure

## Overview

This document shows the complete folder structure of the `nexhealth-poc` repository, including the new `explorer/` application.

## Current Repository Structure

```
nexhealth-poc/
│
├── explorer/                           # 🆕 Main web application (to be created)
│   │
│   ├── frontend/                       # React + TypeScript frontend
│   │   ├── src/
│   │   │   ├── pages/                  # Page components
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Patients.tsx
│   │   │   │   ├── PatientDetail.tsx
│   │   │   │   ├── Appointments.tsx
│   │   │   │   ├── Providers.tsx
│   │   │   │   ├── AppointmentTypes.tsx
│   │   │   │   ├── AvailableSlots.tsx
│   │   │   │   └── ApiLogs.tsx
│   │   │   │
│   │   │   ├── components/             # Reusable UI components
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Layout.tsx
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   └── Breadcrumbs.tsx
│   │   │   │   ├── common/
│   │   │   │   │   ├── DataTable.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   │   └── JsonViewer.tsx
│   │   │   │   └── ui/                # shadcn/ui components (optional)
│   │   │   │
│   │   │   ├── hooks/                  # Custom React hooks
│   │   │   │   ├── useApi.ts           # Simple data fetching hook
│   │   │   │   ├── usePatients.ts
│   │   │   │   ├── useAppointments.ts
│   │   │   │   └── useProviders.ts
│   │   │   │
│   │   │   ├── types/                  # TypeScript type definitions
│   │   │   │   ├── api.ts              # API response types
│   │   │   │   ├── patient.ts
│   │   │   │   ├── appointment.ts
│   │   │   │   └── provider.ts
│   │   │   │
│   │   │   ├── utils/                  # Utility functions
│   │   │   │   ├── formatters.ts       # Date, phone, etc.
│   │   │   │   ├── api-client.ts       # API client setup
│   │   │   │   └── constants.ts
│   │   │   │
│   │   │   ├── App.tsx                 # Main app component
│   │   │   ├── main.tsx                # Entry point
│   │   │   └── index.css               # Global styles
│   │   │
│   │   ├── public/                     # Static assets
│   │   │   └── favicon.ico
│   │   │
│   │   ├── .env.example                # Environment variables template
│   │   ├── .env.local                  # Local environment variables (gitignored)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── README.md
│   │
│   ├── backend/                        # Node.js + TypeScript backend (OR Python)
│   │   ├── src/
│   │   │   ├── index.ts                # Entry point
│   │   │   ├── nexhealth.ts            # NexHealth API client
│   │   │   ├── routes.ts               # API route handlers
│   │   │   ├── types.ts                # Shared type definitions
│   │   │   ├── middleware/
│   │   │   │   ├── cors.ts
│   │   │   │   ├── error-handler.ts
│   │   │   │   └── logger.ts
│   │   │   └── utils/
│   │   │       ├── config.ts           # Environment config
│   │   │       └── logger.ts
│   │   │
│   │   ├── .env.example                # Environment variables template
│   │   ├── .env                        # Local environment variables (gitignored)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── shared/                         # Shared types between frontend & backend
│   │   └── types.ts                    # Common TypeScript interfaces
│   │
│   ├── docker-compose.yml              # Docker setup (optional)
│   ├── .gitignore
│   └── README.md                       # Main app documentation
│
├── plans/                              # 📋 Planning & design documentation
│   ├── README.md                       # Navigation guide
│   ├── 00-executive-summary.md         # Business case & overview
│   ├── 01-technical-architecture.md    # Full architecture (Python/FastAPI)
│   ├── 02-features-and-ui-specification.md  # UI/UX design
│   ├── 03-implementation-roadmap.md    # Full app timeline (4-6 weeks)
│   ├── 04-simplified-poc-architecture.md    # POC approach (1 week) ⚡
│   ├── APPROACH-COMPARISON.md          # POC vs Full comparison
│   └── FOLDER-STRUCTURE.md            # This file
│
├── test/                               # 🧪 Test scripts & exploratory code
│   ├── nexhealth_sandbox.py            # Original exploration script
│   └── nexhealth_sandbox_improved.py   # Reference implementation
│
├── .gitignore
└── README.md                           # Repository overview
```

## Key Directories Explained

### `/explorer` - Main Application

The web application for exploring NexHealth sandbox data.

**Location:** `nexhealth-poc/explorer/`

**Contains:**
- Frontend React app
- Backend API server (Node.js or Python)
- Shared types (if using TypeScript full-stack)

### `/explorer/frontend` - React Frontend

Single-page application built with React + TypeScript.

**Technology:**
- React 18
- TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- React Router (navigation)

**Key Features:**
- Browse patients, appointments, providers
- Search and filter data
- View detailed records
- Display raw JSON responses

### `/explorer/backend` - API Server

Backend server that proxies requests to NexHealth API.

**Two Options:**

#### Option 1: Node.js + TypeScript (Recommended for POC)
```
explorer/backend/
├── src/
│   ├── index.ts          # Hono or Express server
│   ├── nexhealth.ts      # NexHealth API client
│   └── routes.ts         # API endpoints
├── package.json
└── tsconfig.json
```

#### Option 2: Python + FastAPI (For production)
```
explorer/backend/
├── app/
│   ├── main.py           # FastAPI server
│   ├── services/
│   │   └── nexhealth_client.py
│   └── api/
│       └── routes/
├── requirements.txt
└── .env
```

**Purpose:**
- Secure API key storage (never exposed to frontend)
- Proxy NexHealth API requests
- Error handling and retry logic
- Request/response logging
- Token management

### `/explorer/shared` - Shared Types

Common TypeScript type definitions used by both frontend and backend.

**Only needed for TypeScript full-stack approach.**

**Example:**
```typescript
// explorer/shared/types.ts
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  // ... more fields
}
```

### `/plans` - Documentation

All planning, design, and architecture documentation.

**Start here to understand the project!**

### `/test` - Exploration Scripts

Python scripts used to explore and test the NexHealth API.

**Reference Implementation:**
- `nexhealth_sandbox_improved.py` - Shows how to interact with NexHealth API
- Can be ported to TypeScript for the backend

## Environment Files

### Frontend Environment Variables

**File:** `explorer/frontend/.env.local`

```bash
VITE_API_URL=http://localhost:8000
```

### Backend Environment Variables

**File:** `explorer/backend/.env`

```bash
# NexHealth API Configuration
NEXHEALTH_API_KEY=your_api_key_here
NEXHEALTH_SUBDOMAIN=your_subdomain
NEXHEALTH_LOCATION_ID=your_location_id
NEXHEALTH_BASE_URL=https://nexhealth.info
NEXHEALTH_API_VERSION=v20240412

# Server Configuration
PORT=8000
NODE_ENV=development

# CORS (for frontend)
CORS_ORIGIN=http://localhost:5173
```

**⚠️ Important:** Never commit `.env` files to git! Only commit `.env.example` templates.

## Getting Started

### Quick Start (POC Approach)

```bash
# Navigate to project root
cd nexhealth-poc

# Create explorer directory structure
mkdir -p explorer/frontend explorer/backend

# Setup backend
cd explorer/backend
npm init -y
npm install hono @hono/node-server dotenv typescript tsx @types/node

# Setup frontend
cd ../frontend
npm create vite@latest . -- --template react-ts
npm install react-router-dom

# Start coding!
```

### Full Approach

See detailed setup instructions in:
- **POC:** `plans/04-simplified-poc-architecture.md`
- **Full App:** `plans/03-implementation-roadmap.md`

## .gitignore Additions

Make sure to add these to your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
*.env

# Dependencies
node_modules/
venv/
__pycache__/

# Build outputs
dist/
build/
*.pyc

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

## Next Steps

1. **Read** the planning docs in `/plans`
2. **Choose** your approach (POC vs Full)
3. **Create** the `explorer/` directory structure
4. **Start coding** following the implementation guide

## Questions?

Refer to:
- **Quick comparison:** `plans/APPROACH-COMPARISON.md`
- **POC guide:** `plans/04-simplified-poc-architecture.md`
- **Full roadmap:** `plans/03-implementation-roadmap.md`
