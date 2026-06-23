# NexHealth Sandbox Explorer - Features & UI/UX Specification

## Product Vision

A clean, intuitive web application that allows developers and stakeholders to explore the NexHealth sandbox environment visually, verify API integration correctness, and understand the data structure without writing code.

## Target Users

1. **Developers** - Testing API integration, understanding data structure
2. **Product Managers** - Reviewing available data and capabilities
3. **QA Engineers** - Validating API responses
4. **Business Stakeholders** - Reviewing sample data and use cases

## Core Features

### 1. Dashboard / Home Page

**Purpose:** Overview of sandbox environment and quick access to key sections

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  NexHealth Sandbox Explorer          [Profile] [Help]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │  Connection Status                            │      │
│  │  ✓ Connected to: Demo Practice               │      │
│  │  Location: Main Office (ID: 12345)           │      │
│  │  API Version: v20240412                      │      │
│  │  Token expires: 14:32:15                     │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Patients   │  │Appointments │  │  Providers  │    │
│  │     456     │  │     128     │  │     12      │    │
│  │             │  │             │  │             │    │
│  │  [Explore]  │  │  [Explore]  │  │  [Explore]  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Appt Types  │  │Available    │  │   API       │    │
│  │     8       │  │   Slots     │  │  Logs       │    │
│  │             │  │             │  │             │    │
│  │  [Explore]  │  │  [Search]   │  │  [View]     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                          │
│  Recent Activity:                                       │
│  • Patient "John Doe" viewed at 13:45                  │
│  • Listed 50 appointments at 13:42                     │
│  • Provider data refreshed at 13:40                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Connection status indicator (green = connected, red = error)
- Quick stats cards with counts
- Recent activity log
- Quick navigation to main sections
- Token expiration countdown with auto-refresh

### 2. Patients Section

**Purpose:** Browse and search patient data, view detailed patient records

#### 2.1 Patient List View

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard    PATIENTS                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Search: Name, Email, Phone...]        [Filters ▼]     │
│                                                          │
│  Showing 1-25 of 456 patients          [⟨] Page 1 [⟩]  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ID    │ Name           │ DOB        │ Email/Phone │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ 1001  │ Smith, John    │ 01/15/1985 │ john@...    │ │
│  │ 1002  │ Doe, Jane      │ 03/22/1990 │ jane@...    │ │
│  │ 1003  │ Johnson, Bob   │ 07/08/1975 │ 555-0123    │ │
│  │ 1004  │ Williams, Mary │ 11/30/1988 │ mary@...    │ │
│  │ ...                                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Per page: [25 ▼]                                       │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Real-time search (debounced)
- Sortable columns (ID, Name, DOB)
- Pagination with configurable page size
- Filters:
  - Active/Inactive status
  - Date of birth range
  - Has upcoming appointments
- Row click → Opens detail view
- Loading skeletons during data fetch
- Empty state with helpful message

#### 2.2 Patient Detail View

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Patients    PATIENT DETAIL                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  John Smith                          ID: 1001   │   │
│  │  john.smith@email.com                          │   │
│  │  (555) 123-4567                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Personal Information                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Date of Birth:    January 15, 1985 (41 years) │   │
│  │  Gender:           Male                         │   │
│  │  Status:           Active                       │   │
│  │  Created:          Jan 10, 2023                 │   │
│  │  Last Updated:     May 15, 2026                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Upcoming Appointments (2)                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Jun 25, 2026 10:00 AM - Cleaning               │   │
│  │  Jul 10, 2026 02:30 PM - Checkup                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Raw API Response                          [Copy JSON]  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  {                                              │   │
│  │    "id": "1001",                                │   │
│  │    "first_name": "John",                        │   │
│  │    "last_name": "Smith",                        │   │
│  │    ...                                          │   │
│  │  }                                              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Formatted display of patient information
- Age calculation from DOB
- Related appointments (if any)
- Expandable raw JSON response viewer
- Copy to clipboard functionality
- Breadcrumb navigation

### 3. Appointments Section

**Purpose:** Browse appointments with date filtering and view detailed appointment information

#### 3.1 Appointment List View

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard    APPOINTMENTS                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Date Range: [Jun 23, 2026] to [Jul 23, 2026]  [Apply] │
│                                                          │
│  Filters: [All Statuses ▼] [All Providers ▼]           │
│                                                          │
│  Showing 1-25 of 128 appointments      [⟨] Page 1 [⟩]  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ID   │ Patient    │ Date/Time       │ Provider    │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ 2001 │ Smith, J.  │ Jun 23, 10:00am │ Dr. Wilson  │ │
│  │ 2002 │ Doe, J.    │ Jun 23, 02:30pm │ Dr. Brown   │ │
│  │ 2003 │ Johnson, B.│ Jun 24, 09:00am │ Dr. Wilson  │ │
│  │ ...                                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Calendar View: [Day] [Week] [Month]                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Date range picker (default: today + 30 days)
- Filter by provider, appointment type, status
- List view and calendar view toggle
- Visual status indicators (confirmed, cancelled, completed)
- Quick stats: total appointments, by status
- Export to CSV option

#### 3.2 Appointment Detail View

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Appointments    APPOINTMENT DETAIL           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Appointment #2001                 Status: Confirmed    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Date & Time:   June 23, 2026 at 10:00 AM      │   │
│  │  Duration:      30 minutes                      │   │
│  │  Type:          Cleaning                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Patient Information                [View Patient →]    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Name:      John Smith                          │   │
│  │  ID:        1001                                │   │
│  │  Contact:   john.smith@email.com                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Provider Information              [View Provider →]    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Name:      Dr. Sarah Wilson                    │   │
│  │  ID:        301                                 │   │
│  │  NPI:       1234567890                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Notes:                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Regular checkup and cleaning                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Raw API Response                          [Copy JSON]  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  { ... }                                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Formatted appointment details
- Related patient and provider info with quick links
- Status badge (visual indicator)
- Notes section (if available)
- Timeline view (past appointments for same patient)

### 4. Providers Section

**Purpose:** View all providers in the system

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard    PROVIDERS                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Search: Name, NPI...]                                 │
│                                                          │
│  Found 12 providers                                     │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ┌──────────────────────────────────────────────┐  │ │
│  │ │  Dr. Sarah Wilson                     ID: 301 │  │ │
│  │ │  NPI: 1234567890                             │  │ │
│  │ │  Email: s.wilson@example.com                 │  │ │
│  │ │  Specialization: General Dentistry           │  │ │
│  │ │  [View Schedule] [View Appointments]         │  │ │
│  │ └──────────────────────────────────────────────┘  │ │
│  │                                                    │ │
│  │ ┌──────────────────────────────────────────────┐  │ │
│  │ │  Dr. Michael Brown                    ID: 302 │  │ │
│  │ │  NPI: 0987654321                             │  │ │
│  │ │  Email: m.brown@example.com                  │  │ │
│  │ │  Specialization: Orthodontics                │  │ │
│  │ │  [View Schedule] [View Appointments]         │  │ │
│  │ └──────────────────────────────────────────────┘  │ │
│  │  ...                                               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Card-based layout
- Search by name or NPI
- Quick actions: View schedule, appointments
- Provider statistics (total appointments, availability)

### 5. Appointment Types Section

**Purpose:** View configured appointment types

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard    APPOINTMENT TYPES               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Found 8 appointment types                              │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Type            │ Duration │ Description           │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Cleaning        │ 30 min   │ Regular dental clean  │ │
│  │ Checkup         │ 15 min   │ Routine examination   │ │
│  │ Consultation    │ 45 min   │ New patient consult   │ │
│  │ Root Canal      │ 90 min   │ Endodontic procedure  │ │
│  │ Filling         │ 45 min   │ Cavity treatment      │ │
│  │ Orthodontics    │ 60 min   │ Braces/aligners       │ │
│  │ ...                                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Simple table view
- Sortable by name, duration
- Visual duration indicator (bar chart)
- Click to see appointments of this type

### 6. Available Slots Search

**Purpose:** Find available appointment slots based on criteria

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard    AVAILABLE SLOTS                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Search Criteria:                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Provider:      [Dr. Wilson ▼] or [Any]        │   │
│  │  Appt Type:     [Cleaning ▼] or [Any]          │   │
│  │  Start Date:    [Jun 23, 2026]                  │   │
│  │  Number of Days: [7] days                       │   │
│  │                                 [Search Slots]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Results: 45 available slots found                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  June 23, 2026                                     │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ 09:00 AM - Dr. Wilson - Operatory 1          │ │ │
│  │  │ 09:30 AM - Dr. Wilson - Operatory 1          │ │ │
│  │  │ 10:00 AM - Dr. Brown - Operatory 2           │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  June 24, 2026                                     │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ 08:00 AM - Dr. Wilson - Operatory 1          │ │ │
│  │  │ 08:30 AM - Dr. Wilson - Operatory 1          │ │ │
│  │  │ ...                                          │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Dynamic form with filters
- Grouped by date
- Visual calendar view option
- Export results
- Quick book action (future enhancement)

### 7. API Log Viewer

**Purpose:** View API requests/responses for debugging

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard    API ACTIVITY LOG                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Filter: [All Endpoints ▼] [All Status Codes ▼]        │
│                                                          │
│  [Clear Log]                           Auto-refresh: ✓  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Time     │ Method│ Endpoint        │Status│Duration│ │
│  ├────────────────────────────────────────────────────┤ │
│  │ 13:45:23 │ GET   │ /patients/1001  │ 200  │ 145ms  │ │
│  │ 13:42:11 │ GET   │ /appointments   │ 200  │ 234ms  │ │
│  │ 13:40:05 │ GET   │ /providers      │ 200  │ 98ms   │ │
│  │ 13:38:50 │ POST  │ /authenticates  │ 200  │ 187ms  │ │
│  │ ...                                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Click on any row to view full request/response details │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Real-time log streaming
- Color-coded status codes (green=2xx, red=4xx/5xx)
- Click to expand full request/response
- Filter by endpoint, status code
- Performance metrics
- Export logs

### 8. Settings / Configuration

**Purpose:** Manage application settings and credentials (admin only)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard    SETTINGS                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Connection Settings                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Subdomain:      [demo-practice]                │   │
│  │  Location ID:    [12345]                        │   │
│  │  API Version:    v20240412                      │   │
│  │  Base URL:       https://nexhealth.info        │   │
│  │                                    [Test Connection]│
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Display Preferences                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Theme:          [Light ▼] Dark / Auto          │   │
│  │  Date Format:    [MM/DD/YYYY ▼]                │   │
│  │  Time Zone:      [America/Los_Angeles ▼]       │   │
│  │  Items per page: [25 ▼]                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Advanced                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ☑ Enable request caching                      │   │
│  │  ☑ Show raw JSON by default                    │   │
│  │  ☐ Enable debug mode                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  [Save Settings]                                        │
└─────────────────────────────────────────────────────────┘
```

## UI/UX Design Principles

### Visual Design

**Color Palette:**
- Primary: Blue (#3B82F6) - Professional, trustworthy
- Success: Green (#10B981) - Positive actions, connected status
- Warning: Yellow (#F59E0B) - Warnings, pending states
- Error: Red (#EF4444) - Errors, failed requests
- Neutral: Gray (#6B7280) - Text, borders, backgrounds

**Typography:**
- Headings: Inter or SF Pro Display (16-24px, semibold)
- Body: Inter or SF Pro Text (14-16px, regular)
- Code/Data: JetBrains Mono or Fira Code (monospace)

**Spacing:**
- Base unit: 4px
- Component padding: 16px (4 units)
- Section margins: 24px (6 units)
- Page margins: 32px (8 units)

### Interaction Patterns

**Loading States:**
- Skeleton screens for initial loads
- Spinner for data refresh
- Progress bar for long operations
- Optimistic UI updates where appropriate

**Error Handling:**
- Toast notifications for errors
- Inline error messages for forms
- Retry buttons for failed requests
- Helpful error messages with suggestions

**Empty States:**
- Friendly illustrations
- Clear explanation of why empty
- Call-to-action to populate data
- Examples or documentation links

**Responsive Design:**
- Desktop-first approach (1280px+)
- Tablet support (768px - 1279px)
- Mobile support (320px - 767px)
- Collapsible sidebar on mobile
- Stack cards vertically on small screens

### Accessibility

**WCAG 2.1 AA Compliance:**
- Proper heading hierarchy (h1, h2, h3)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators for all interactive elements
- Sufficient color contrast (4.5:1 minimum)
- Screen reader friendly
- Alt text for any images/icons

**Keyboard Shortcuts:**
- `/` - Focus search
- `Esc` - Close modals/drawers
- `Arrow keys` - Navigate lists
- `Enter` - Select/open items
- `?` - Show keyboard shortcuts help

## Component Library

### Core Components

1. **Layout Components**
   - Page container
   - Sidebar navigation
   - Header with breadcrumbs
   - Footer

2. **Data Display**
   - DataTable (sortable, filterable, paginated)
   - Card
   - Badge
   - Stat card
   - JSON viewer
   - Code block

3. **Forms & Inputs**
   - Input field
   - Select dropdown
   - Date picker
   - Date range picker
   - Search input
   - Checkbox
   - Radio button

4. **Feedback**
   - Toast notification
   - Alert banner
   - Modal dialog
   - Loading spinner
   - Skeleton loader
   - Progress bar

5. **Navigation**
   - Tabs
   - Breadcrumbs
   - Pagination
   - Sidebar menu

## User Flows

### Primary Flow: Exploring Patient Data

1. User lands on Dashboard
2. Clicks "Explore" on Patients card
3. Sees list of patients with search/filter options
4. Searches for specific patient or browses list
5. Clicks on patient row
6. Views detailed patient information
7. Optionally views related appointments
8. Can copy raw JSON for integration testing
9. Returns to patient list or navigates to other section

### Secondary Flow: Finding Available Appointment Slots

1. User navigates to Available Slots section
2. Selects provider (optional)
3. Selects appointment type (optional)
4. Sets date range
5. Clicks "Search Slots"
6. Views results grouped by date
7. Can toggle between list and calendar view
8. Can export results for external use

### Administrative Flow: Viewing API Logs

1. Admin user navigates to API Log section
2. Views recent API requests in real-time
3. Filters by endpoint or status code
4. Clicks on specific request to see details
5. Reviews request/response headers and body
6. Identifies any issues or performance bottlenecks
7. Can export logs for debugging

## Nice-to-Have Features (Future Enhancements)

1. **Appointment Booking UI** - Actually book appointments through the UI
2. **Data Visualization** - Charts showing trends, statistics
3. **Comparison Tool** - Compare different API responses side-by-side
4. **Saved Filters** - Save common filter combinations
5. **Bulk Operations** - Select multiple items for batch actions
6. **Export Functionality** - Export data to CSV, Excel, PDF
7. **Documentation Integration** - Inline API documentation
8. **Webhook Testing** - Test webhook endpoints
9. **Multi-environment Support** - Switch between sandbox/production
10. **Collaborative Features** - Share views, annotations, notes
11. **Dark Mode** - Theme switching
12. **Internationalization** - Multi-language support

## Success Metrics

### User Experience
- Time to first meaningful interaction < 2 seconds
- Search results appear < 500ms
- Navigation between sections < 300ms
- Zero accessibility violations

### Technical Performance
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Bundle size < 500KB (gzipped)

### User Satisfaction
- Easy to understand data structure
- Clear error messages
- Intuitive navigation
- Fast and responsive
- Helpful for API integration testing
