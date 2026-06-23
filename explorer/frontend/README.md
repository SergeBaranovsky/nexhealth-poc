# NexHealth Explorer - Frontend

React frontend for the NexHealth Explorer POC. Built with React, TypeScript, Vite, and TailwindCSS.

## Features

- 📊 Dashboard with overview statistics
- 👥 Patient list and details
- 📅 Appointments calendar view
- 👨‍⚕️ Provider directory
- 🎨 Clean, responsive UI with TailwindCSS
- ⚡ Fast development with Vite
- 📝 Full TypeScript support

## Prerequisites

- Node.js 20+
- npm or yarn
- Backend API running on port 8000

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

The app will start on http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Check TypeScript types

## Project Structure

```
frontend/
├── src/
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Patients.tsx
│   │   ├── Appointments.tsx
│   │   └── Providers.tsx
│   ├── components/         # Reusable components
│   │   └── Layout.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useApi.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── README.md
```

## Architecture

### State Management

Following the POC approach, this app uses **React's built-in hooks only**:
- `useState` - Component state
- `useEffect` - Side effects
- Custom `useApi` hook - Data fetching

No Zustand, Redux, or MobX needed for POC!

### Data Fetching

Simple custom `useApi` hook that wraps `fetch`:
- No React Query or SWR
- Perfect for POC
- Can upgrade later if needed

### Styling

TailwindCSS utility classes:
- Fast development
- No CSS files to manage
- Responsive by default

## API Integration

The frontend uses Vite's proxy to communicate with the backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

All API calls go to `/api/*` which proxies to the backend.

## Pages

### Dashboard (`/`)
- Overview statistics
- Quick links to other pages

### Patients (`/patients`)
- List of all patients
- Searchable and filterable
- Shows patient details

### Appointments (`/appointments`)
- List of appointments
- Date range filters
- Shows appointment details

### Providers (`/providers`)
- List of providers
- Shows provider information

## Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx`

Example:

```tsx
// 1. Create src/pages/NewPage.tsx
export function NewPage() {
  return <div>New Page</div>;
}

// 2. Add to App.tsx
import { NewPage } from './pages/NewPage';
<Route path="new-page" element={<NewPage />} />

// 3. Add to Layout.tsx
<Link to="/new-page">New Page</Link>
```

## Development Notes

- Hot reload enabled - changes reflect immediately
- TypeScript errors shown in terminal and browser
- Vite provides fast builds and refresh

## Troubleshooting

**"Cannot connect to backend" error:**
- Make sure backend is running on port 8000
- Check `vite.config.ts` proxy settings

**Blank page:**
- Check browser console for errors
- Verify all imports are correct
- Run `npm run type-check`

**Styles not working:**
- Make sure TailwindCSS is installed
- Check `tailwind.config.js` content paths
- Verify `@tailwind` directives in `index.css`
