# 🏗 IMS Faculty & Recruiter Portal - Production Architecture

## 📌 Executive Summary

**Application**: Internship Management System (IMS) - Faculty & Admin Portal  
**Client**: CHRIST University  
**Ecosystem**: ESPro ERP Integration  
**Tech Stack**: React 19 + TypeScript + Vite + React Router v6  
**Design Pattern**: Enterprise ERP-Style UI (Card-based, GitHub-inspired)

---

## 🎯 Core Principles

### 1. **Role Segregation (CRITICAL)**
- **NO student login** - Students use a separate mobile/web app
- **NO public recruiter signup** - Only IC can create recruiter accounts
- **Faculty credentials** - Login via existing CHRIST ERP system (simulated)
- **Strict role-based routing** - Each role sees ONLY their authorized pages

### 2. **System Boundaries**
```
┌─────────────────────────────────────────────────────────────┐
│                    IMS FACULTY PORTAL                        │
│  (This Application - Frontend Only)                          │
│                                                              │
│  Roles: IC | HOD | Faculty/Guide | Corporate Recruiter      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Mock API Layer (Axios)
                   │
        ┌──────────▼──────────┐     ┌────────────────────┐
        │  CHRIST ERP API      │     │  Student App       │
        │  (Backend - TBD)     │────▶│  (Separate System) │
        └──────────────────────┘     └────────────────────┘
```

### 3. **Authentication Flow**
```
Faculty/IC/HOD → CHRIST ERP Credentials → Session Created
Corporate       → IC Creates Account    → Limited Access
Recruiter       
```

---

## 👥 Role-Based Access Matrix

| Module | IC | HOD | Faculty | Recruiter |
|--------|----|----|---------|-----------|
| Dashboard | ✅ Full Stats | ✅ Approval Focus | ✅ Mentorship | ✅ Job Mgmt |
| Session Management | ✅ Create/Edit | ✅ View/Close | ❌ | ❌ |
| Recruiter Management | ✅ CRUD | ❌ | ❌ | ❌ |
| Job Posting (View) | ✅ Approve | ✅ Approve | ✅ View | ✅ Create/Edit |
| Student Applications | ✅ View All | ✅ Approve | ✅ Approve | ❌ |
| Guide Assignment | ✅ Assign | ✅ Assign | ✅ My Students | ❌ |
| Closure & Evaluation | ✅ View All | ✅ View | ✅ Evaluate | ❌ |
| Notifications | ✅ | ✅ | ✅ | ✅ |

---

## 🔄 Functional Workflow (Step-by-Step)

### Phase 1: Setup (IC/HOD)
```
1. IC logs in → Opens new Internship Session
   - Program: MCA, MBA, etc.
   - Batch: 2024-2026
   - Academic Year: 2024-25
   - Start/End Dates
   
2. IC creates Corporate Recruiter accounts
   - Company Name, Email, Contact
   - Generates temporary password
   - Account stored in system (no public signup)
```

### Phase 2: Job Posting (Recruiter → IC/Placement)
```
3. Recruiter logs in → Creates Internship Posting
   - Title, Description, Requirements
   - Location, Stipend, Duration
   - Status: DRAFT
   
4. Recruiter submits for approval → Status: PENDING

5. IC/Placement reviews posting
   ├─ APPROVE → Status: APPROVED → Pushed to Student App (ERP trigger)
   └─ REJECT → Status: REJECTED → Feedback sent to recruiter
```

### Phase 3: Application Review (Faculty/HOD)
```
6. Students apply via Student App (external system)
   - Applications appear in Faculty Portal

7. Faculty/HOD reviews applications
   ├─ APPROVE → Auto-generate LOR (PDF placeholder)
   └─ REJECT → Rejection reason logged

8. Approved students → Forwarded to company
```

### Phase 4: Mentorship (IC/Faculty)
```
9. IC/HOD assigns Faculty Guide to student
   - Guide receives notification
   
10. Guide monitors student progress
    - Reviews logs/reports
    - Provides feedback
    - Status: Unassigned → In Progress → Completed
```

### Phase 5: Closure (Faculty/Guide)
```
11. Student submits final documents
    - Internship report, certificates
    
12. Guide evaluates
    - Rating (1-5 stars)
    - Final remarks
    - Status: CLOSED
```

---

## 📁 Folder Structure (Production-Ready)

```
src/
├── components/              # Reusable UI components
│   ├── ui/                  # Primitive components
│   │   ├── Badge.tsx        # Status indicators
│   │   ├── Button.tsx       # Primary button component
│   │   ├── Input.tsx        # Form inputs
│   │   ├── Modal.tsx        # Dialog/Modal
│   │   ├── Table.tsx        # Data tables
│   │   └── Breadcrumbs.tsx  # Navigation breadcrumbs
│   ├── dashboard/           # Dashboard-specific
│   │   └── StatCard.tsx     # Metric cards
│   ├── notifications/       # Notification system
│   │   └── NotificationDropdown.tsx
│   └── auth/                # Auth guards
│       └── ProtectedRoute.tsx
│
├── context/                 # Global state management
│   ├── AuthContext.tsx      # User session
│   └── NotificationContext.tsx
│
├── pages/                   # Route-level pages
│   ├── LoginPage.tsx        # Authentication
│   ├── Dashboard.tsx        # Role dispatcher
│   ├── dashboards/          # Role-specific dashboards
│   │   ├── ICDashboard.tsx
│   │   ├── HODDashboard.tsx
│   │   ├── FacultyDashboard.tsx
│   │   └── RecruiterDashboard.tsx
│   ├── sessions/            # Session management
│   │   ├── SessionList.tsx
│   │   └── SessionForm.tsx
│   ├── recruiters/          # Recruiter CRUD
│   │   ├── RecruiterManagement.tsx
│   │   └── RecruiterForm.tsx
│   ├── jobs/                # Job postings
│   │   ├── JobPostingList.tsx
│   │   └── JobForm.tsx
│   ├── applications/        # Student applications
│   │   ├── ApplicationList.tsx
│   │   └── ApplicationDetail.tsx
│   ├── guides/              # Guide assignment
│   │   └── GuideAssignment.tsx
│   └── closure/             # Final evaluation
│       └── ClosureEvaluation.tsx
│
├── services/                # Data layer
│   ├── auth.js              # Authentication service
│   ├── erpAPI.ts            # ERP integration (mock)
│   └── mock/                # Mock API services
│       ├── SessionService.ts
│       ├── RecruiterService.ts
│       ├── JobService.ts
│       ├── ApplicationService.ts
│       ├── GuideService.ts
│       └── ClosureService.ts
│
├── types/                   # TypeScript definitions
│   └── index.ts             # All interfaces
│
├── utils/                   # Helper functions
│   └── cn.ts                # Tailwind class merger
│
├── App.tsx                  # Main router + layout
├── index.css                # Global styles + CHRIST theme
└── main.tsx                 # App entry point
```

---

## 🎨 Design System

### Color Palette (CHRIST University)
```css
--color-christ-navy: #0F2540;   /* Primary brand */
--color-christ-blue: #1E3A5F;   /* Secondary brand */
--color-christ-gold: #D4AF37;   /* Accent/highlight */

/* Status Colors */
--color-success: #059669;       /* Approved */
--color-warning: #d97706;       /* Pending */
--color-danger: #dc2626;        /* Rejected */
```

### Component Patterns
- **Cards over Tables** - Better visual hierarchy, responsive
- **Status Badges** - Color-coded (Green/Yellow/Red)
- **Modal Confirmations** - Critical actions (Approve/Reject)
- **Micro-animations** - Hover states, transitions

### Typography
- **Headings**: Sans-serif, bold, CHRIST Navy
- **Body**: 16px, line-height 1.5, Gray 800
- **Labels**: 14px, medium weight, Gray 500

---

## 🔐 Security & Permissions

### Route Guards
```typescript
// Implemented in App.tsx
<ProtectedRoute allowedRoles={['IC']}>
  <RecruiterManagement />
</ProtectedRoute>
```

### Data Access Rules
1. **IC** - Full system access
2. **HOD** - Approval workflows + read-only sessions
3. **Faculty** - Own students only (guide assignment)
4. **Recruiter** - Own postings only

### Session Management
- Token stored in `localStorage`
- Auto-logout on token expiry (future: JWT)
- CSRF protection (future: backend implementation)

---

## 🔗 API Integration Points

### Mock API → Real API Migration

| Service | Mock Endpoint | Real Endpoint (TBD) | Method |
|---------|---------------|---------------------|--------|
| Login | `auth.js` | `/api/auth/login` | POST |
| Sessions | `SessionService.ts` | `/api/sessions` | GET/POST/PUT |
| Recruiters | `RecruiterService.ts` | `/api/recruiters` | GET/POST/PUT |
| Jobs | `JobService.ts` | `/api/jobs` | GET/POST/PUT |
| Applications | `ApplicationService.ts` | `/api/applications` | GET/PUT |
| Guides | `GuideService.ts` | `/api/guides` | GET/POST |
| Closure | `ClosureService.ts` | `/api/evaluations` | POST |

### ERP Triggers
```typescript
// Implemented in erpAPI.ts
triggerERPUpdate(ERPEvents.APPLICATION_APPROVED, {
  applicationId: '123',
  studentName: 'John Doe'
});

// Backend must listen for these events and update:
// - Student App (push notifications)
// - CHRIST ERP database
// - Email notifications
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] API endpoints updated from mock to real
- [ ] Error logging (Sentry/LogRocket)
- [ ] Performance monitoring (Google Analytics)
- [ ] HTTPS enforced
- [ ] CORS configured

### Testing
- [ ] Unit tests (Vitest/Jest)
- [ ] Integration tests (Playwright)
- [ ] Accessibility audit (axe-core)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness

### Production Build
```bash
npm run build
# Output: dist/ folder
# Deploy to: Vercel, Netlify, or CHRIST server
```

---

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Bundle Size | < 500KB |

---

## 🛠 Tech Stack Justification

| Technology | Reason |
|------------|--------|
| **React 19** | Latest stable, concurrent rendering |
| **TypeScript** | Type safety, better DX |
| **Vite** | Fast dev server, optimized builds |
| **React Router v6** | Standard routing library |
| **Context API** | Simple state management (no Redux overhead) |
| **Tailwind CSS** | Utility-first, rapid development |
| **Lucide React** | Clean, minimal icons |
| **Axios** | HTTP client (future API integration) |

---

## 📝 Development Guidelines

### Code Style
- **Use TypeScript** for all new components
- **Functional components** with hooks
- **Named exports** for components
- **PascalCase** for components, **camelCase** for functions

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';
import { ComponentProps } from '../types';

// 2. Interface
interface Props extends ComponentProps {
  title: string;
}

// 3. Component
const MyComponent = ({ title }: Props) => {
  // 4. State & hooks
  const [isOpen, setIsOpen] = useState(false);

  // 5. Handlers
  const handleClick = () => setIsOpen(!isOpen);

  // 6. JSX
  return <div onClick={handleClick}>{title}</div>;
};

// 7. Export
export default MyComponent;
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `StatCard.tsx`)
- Services: `camelCase.ts` (e.g., `authService.ts`)
- Types: `index.ts` (centralized)

---

## 🐛 Known Limitations (To Address)

1. **No real authentication** - Mock login system
2. **No file uploads** - LOR generation is placeholder
3. **No email notifications** - Console logs only
4. **No PDF generation** - Needs jsPDF integration
5. **No real-time updates** - Refresh required (future: WebSockets)
6. **No pagination** - Lists show all items (future: infinite scroll)

---

## 🎓 Handoff to Backend Team

### Required API Endpoints
See Section: **API Integration Points** above

### Data Models Required
See: `src/types/index.ts` for TypeScript interfaces

### Expected Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format"
  }
}
```

---

## 📚 Additional Documentation

- **Implementation Guide**: See `IMPLEMENTATION_GUIDE.md`
- **Component Storybook**: (Future: Storybook setup)
- **API Documentation**: (Future: Swagger/OpenAPI)

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintained By**: CHRIST University IT Team  
**Built with ❤️ for CHRIST University**
