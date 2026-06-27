# NexHealth Sandbox Explorer - Planning Documentation

This folder contains comprehensive planning and design documentation for the NexHealth Sandbox Explorer web application.

> **Not sure which approach to use?** Read the **[APPROACH-COMPARISON.md](./APPROACH-COMPARISON.md)** to decide between a quick POC (1 week) or full production app (4-6 weeks).

## Purpose

The NexHealth Sandbox Explorer is a web-based application that provides a visual interface for exploring and validating the NexHealth API sandbox environment. It allows developers, product managers, and QA engineers to browse patient data, appointments, providers, and other resources without writing code.

## Documentation Index

### POC Quick Start (RECOMMENDED)

**[04-simplified-poc-architecture.md](./04-simplified-poc-architecture.md)** ⭐
- **Simplified TypeScript full-stack approach**
- Skip complex state management - use React's built-in hooks
- Skip React Query - use simple fetch + useState
- Node.js + Hono backend instead of Python
- Share types between frontend and backend
- **Get working POC in 1 week instead of 4-6 weeks**
- **Best for:** Developers wanting to start coding NOW

### Start Here (Full App Planning)

**[00-executive-summary.md](./00-executive-summary.md)**
- High-level project overview
- Problem statement and solution
- Timeline and budget estimates (for full app)
- Success criteria and ROI
- **Best for:** Management, stakeholders, quick overview

### Architecture & Technology

**[01-technical-architecture.md](./01-technical-architecture.md)**
- System architecture and design patterns
- Technology stack (React, FastAPI, etc.)
- API integration strategy
- Security considerations
- Performance optimization
- Deployment architecture
- **Best for:** Technical leads, architects, senior developers

### Features & Design

**[02-features-and-ui-specification.md](./02-features-and-ui-specification.md)**
- Complete feature specifications
- UI/UX layouts and wireframes
- User flows and interaction patterns
- Component library and design system
- Accessibility requirements
- Future enhancement ideas
- **Best for:** Designers, product managers, frontend developers

### Implementation Plan (Full App)

**[03-implementation-roadmap.md](./03-implementation-roadmap.md)**
- Week-by-week development plan (Phases 1-5) for full production app
- Detailed task breakdowns with checklists
- Testing strategy
- Deployment plan
- Risk assessment and mitigation
- Resource requirements
- **Best for:** Project managers, developers, team leads
- **Note:** For POC, see simplified approach in document 04

## Quick Navigation Guide

### I want to understand...

**"I want to build a POC quickly!"**
→ Read: [Simplified POC Architecture](./04-simplified-poc-architecture.md)

**"What is this project about?"**
→ Read: [Executive Summary](./00-executive-summary.md)

**"How will it be built?"**
→ Read: [Technical Architecture](./01-technical-architecture.md) (full app) or [Simplified POC](./04-simplified-poc-architecture.md) (quick start)

**"What features will it have?"**
→ Read: [Features & UI Specification](./02-features-and-ui-specification.md)

**"When and how will we build it?"**
→ Read: [Implementation Roadmap](./03-implementation-roadmap.md) (full app) or [Simplified POC](./04-simplified-poc-architecture.md) (quick start)

**"How do I get started developing NOW?"**
→ Read: [Simplified POC Architecture](./04-simplified-poc-architecture.md)

**"Where should files go in the project?"**
→ Read: [Folder Structure Guide](./FOLDER-STRUCTURE.md)

**"What are the key technical decisions?"**
→ Read: [Technical Architecture - Technology Stack](./01-technical-architecture.md#technology-stack)

**"What will the UI look like?"**
→ Read: [Features & UI - Dashboard/Pages](./02-features-and-ui-specification.md#core-features)

## Project Overview

### Goals

1. **Visual API Exploration** - Browse sandbox data through an intuitive web interface
2. **Integration Validation** - Confirm API responses and data structures
3. **Non-Technical Access** - Enable stakeholders to explore data without coding
4. **Developer Tool** - Provide debugging and testing capabilities

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- React Query (data fetching)
- React Router (navigation)

**Backend:**
- Python FastAPI
- httpx (async HTTP client)
- Pydantic (validation)
- Docker (containerization)

**Infrastructure:**
- Frontend: Vercel/Netlify
- Backend: Railway/Render
- CI/CD: GitHub Actions

### Timeline

**MVP Development:** 4-6 weeks
- Week 1: Foundation & Setup
- Week 2: Core Features
- Week 3: Enhanced Features
- Week 4: Testing & Polish
- Week 5-6: Deployment

### Budget

**Development:** 160-320 hours of development time
**Production Hosting:** ~$20-100/month

## Key Features (MVP)

1. ✅ **Dashboard** - Connection status and quick navigation
2. ✅ **Patient Explorer** - Browse and search patients
3. ✅ **Appointment Browser** - View appointments with filtering
4. ✅ **Provider Directory** - List all providers
5. ✅ **Appointment Types** - View configured types
6. ✅ **Available Slots Search** - Find open appointment slots
7. ✅ **API Activity Log** - Monitor API requests/responses
8. ✅ **Settings** - Configure preferences

## Reference Materials

### NexHealth API Documentation
- [Introduction](https://docs.nexhealth.com/reference/introduction)
- [Quickstart Guide](https://docs.nexhealth.com/docs/developer-portal-quickstart-guide)
- [API Capabilities](https://docs.nexhealth.com/docs/whats-possible-with-nexhealth)
- [OpenAPI Spec](https://docs.nexhealth.com/v20240412/openapi/nexhealth-api.json)

### Existing Code
- **Python Script:** `test/nexhealth_sandbox_improved.py`
  - Reference implementation of API integration
  - Example API calls and response handling
  - Authentication flow

### API Version
**Current:** v20240412 (as of June 2026)

## Document Conventions

### Status Indicators
- ✅ Completed / Approved
- 🔄 In Progress
- ⏳ Planned
- ❌ Blocked / Issue

### Priority Levels
- **High** - Critical for MVP
- **Medium** - Important but not blocking
- **Low** - Nice to have / Future enhancement

### Code Examples
Code blocks are used throughout with language identifiers:
```typescript
// TypeScript examples for frontend
```

```python
# Python examples for backend
```

```bash
# Shell commands
```

## How to Use This Documentation

### For Management/Stakeholders
1. Read the [Executive Summary](./00-executive-summary.md)
2. Review timeline and budget sections
3. Understand ROI and success criteria
4. Make go/no-go decision

### For Technical Leads
1. Start with [Executive Summary](./00-executive-summary.md)
2. Deep dive into [Technical Architecture](./01-technical-architecture.md)
3. Review [Implementation Roadmap](./03-implementation-roadmap.md)
4. Assess team capacity and timeline
5. Make technology stack decisions

### For Developers
1. Skim [Executive Summary](./00-executive-summary.md)
2. Study [Technical Architecture](./01-technical-architecture.md)
3. Reference [Features & UI Specification](./02-features-and-ui-specification.md)
4. Follow [Implementation Roadmap](./03-implementation-roadmap.md)
5. Use checklists to track progress

### For Designers
1. Skim [Executive Summary](./00-executive-summary.md)
2. Focus on [Features & UI Specification](./02-features-and-ui-specification.md)
3. Review design system and component requirements
4. Create detailed mockups based on wireframes
5. Ensure accessibility compliance

### For Product Managers
1. Read [Executive Summary](./00-executive-summary.md)
2. Review [Features & UI Specification](./02-features-and-ui-specification.md)
3. Prioritize features for MVP vs. future phases
4. Track progress using [Implementation Roadmap](./03-implementation-roadmap.md)
5. Manage stakeholder expectations

## Updates and Maintenance

### Document Versioning

All documents should be updated as the project evolves:
- Architecture changes → Update technical architecture doc
- Feature additions → Update features specification
- Timeline adjustments → Update implementation roadmap
- Scope changes → Update executive summary

### Changelog Location

Major changes should be documented in commit messages and/or a separate CHANGELOG.md file in the project root.

### Feedback and Questions

For questions or suggestions about this documentation:
1. Create an issue in the project repository
2. Tag with `documentation` label
3. Reference the specific document and section

## Related Files

```
nexhealth-poc/
├── explorer/                       ← Main application folder (to be created)
│   ├── frontend/                   ← React frontend
│   ├── backend/                    ← Node.js or Python backend
│   ├── shared/                     ← Shared TypeScript types
│   └── README.md
├── plans/                          ← You are here
│   ├── README.md                   ← This file
│   ├── 00-executive-summary.md
│   ├── 01-technical-architecture.md
│   ├── 02-features-and-ui-specification.md
│   ├── 03-implementation-roadmap.md
│   ├── 04-simplified-poc-architecture.md
│   └── APPROACH-COMPARISON.md
├── test/
│   └── nexhealth_sandbox_improved.py  ← Reference implementation
└── README.md
```

## Next Steps

1. **Review all documentation** in order (00 → 01 → 02 → 03)
2. **Get stakeholder approval** on approach and timeline
3. **Allocate resources** (assign development team)
4. **Set up development environment** following Phase 1
5. **Begin implementation** using the roadmap checklists

---

**Last Updated:** June 23, 2026  
**API Version:** v20240412  
**Project Status:** Planning Phase  
**Documentation Version:** 1.0
