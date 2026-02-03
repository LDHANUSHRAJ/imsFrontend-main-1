# 🔗 API Integration Handbook - IMS Frontend

## 📋 Overview

This document provides complete API specifications for integrating the IMS Faculty Portal frontend with the backend services.

---

## 🌐 Base URLs

```
Development: http://localhost:3000/api
Staging: https://staging-api.christuniversity.in/ims
Production: https://api.christuniversity.in/ims
```

---

## 🔐 Authentication

### Login

**Endpoint**: `POST /auth/login`

**Request**:
```typescript
{
  email: string;
  password: string;
  role: 'IC' | 'HOD' | 'FACULTY' | 'RECRUITER';
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    token: string;  // JWT token
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: 'IC' | 'HOD' | 'FACULTY' | 'RECRUITER';
      department?: string;  // For Faculty/HOD
      companyName?: string; // For Recruiter
    }
  }
}
```

**Error** (401 Unauthorized):
```typescript
{
  success: false;
  error: {
    code: 'INVALID_CREDENTIALS';
    message: 'Invalid email or password';
  }
}
```

### Refresh Token

**Endpoint**: `POST /auth/refresh`

**Headers**:
```
Authorization: Bearer <refresh_token>
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    token: string;  // New JWT token
    refreshToken: string; // New refresh token
  }
}
```

### Get Current User

**Endpoint**: `GET /auth/me`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    id: string;
    name: string;
    email: string;
    role: 'IC' | 'HOD' | 'FACULTY' | 'RECRUITER';
    department?: string;
    companyName?: string;
  }
}
```

### Logout

**Endpoint**: `POST /auth/logout`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```typescript
{
  success: true;
  message: 'Logged out successfully';
}
```

---

## 📅 Session Management

### Get All Sessions

**Endpoint**: `GET /sessions`

**Query Parameters**:
```typescript
{
  status?: 'ACTIVE' | 'CLOSED';  // Optional filter
  program?: string;               // Optional filter
  page?: number;                  // Default: 1
  limit?: number;                 // Default: 20
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    sessions: Array<{
      id: string;
      academicYear: string;
      program: string;  // e.g., "MCA", "MBA"
      batch: string;    // e.g., "2024-2026"
      startDate: string;  // ISO 8601
      endDate: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }
}
```

### Create Session

**Endpoint**: `POST /sessions`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  academicYear: string;  // e.g., "2024-25"
  program: string;       // e.g., "MCA"
  batch: string;         // e.g., "2024-2026"
  startDate: string;     // ISO 8601
  endDate: string;       // ISO 8601
}
```

**Response** (201 Created):
```typescript
{
  success: true;
  data: {
    id: string;
    academicYear: string;
    program: string;
    batch: string;
    startDate: string;
    endDate: string;
    isActive: true;
    createdAt: string;
    updatedAt: string;
  };
  message: 'Session created successfully';
}
```

**Validation Errors** (400 Bad Request):
```typescript
{
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: 'Validation failed';
    details: [
      {
        field: 'endDate';
        message: 'End date must be after start date';
      }
    ]
  }
}
```

### Update Session

**Endpoint**: `PUT /sessions/:id`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request** (all fields optional):
```typescript
{
  academicYear?: string;
  program?: string;
  batch?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: { /* Updated session object */ };
  message: 'Session updated successfully';
}
```

### Delete Session

**Endpoint**: `DELETE /sessions/:id`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```typescript
{
  success: true;
  message: 'Session deleted successfully';
}
```

---

## 👔 Recruiter Management

### Get All Recruiters

**Endpoint**: `GET /recruiters`

**Query Parameters**:
```typescript
{
  isActive?: boolean;  // Optional filter
  search?: string;     // Search by name or company
  page?: number;
  limit?: number;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    recruiters: Array<{
      id: string;
      name: string;
      email: string;
      companyName: string;
      contactNumber?: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      lastLoginAt?: string;
    }>;
    pagination: { /* ... */ }
  }
}
```

### Create Recruiter

**Endpoint**: `POST /recruiters`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  name: string;
  email: string;
  companyName: string;
  contactNumber?: string;
}
```

**Response** (201 Created):
```typescript
{
  success: true;
  data: {
    id: string;
    name: string;
    email: string;
    companyName: string;
    contactNumber?: string;
    isActive: true;
    createdAt: string;
    temporaryPassword: string;  // Send via email to recruiter
  };
  message: 'Recruiter account created. Credentials sent to email.';
}
```

### Update Recruiter

**Endpoint**: `PUT /recruiters/:id`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  name?: string;
  email?: string;
  companyName?: string;
  contactNumber?: string;
  isActive?: boolean;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: { /* Updated recruiter object */ };
  message: 'Recruiter updated successfully';
}
```

### Delete Recruiter

**Endpoint**: `DELETE /recruiters/:id`

**Response** (200 OK):
```typescript
{
  success: true;
  message: 'Recruiter account deleted successfully';
}
```

---

## 💼 Job Postings

### Get All Jobs

**Endpoint**: `GET /jobs`

**Query Parameters**:
```typescript
{
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  recruiterId?: string;  // Filter by recruiter
  search?: string;       // Search by title or company
  page?: number;
  limit?: number;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    jobs: Array<{
      id: string;
      title: string;
      description: string;
      requirements: string[];
      location: string;
      stipend?: string;
      duration?: string;
      status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
      recruiterId: string;
      recruiterName: string;
      companyName: string;
      companyId: string;
      feedback?: string;  // If rejected
      postedAt: string;
      createdAt: string;
      updatedAt: string;
    }>;
    pagination: { /* ... */ }
  }
}
```

### Create Job Posting

**Endpoint**: `POST /jobs`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  title: string;
  description: string;
  requirements: string[];
  location: string;
  stipend?: string;
  duration?: string;
  rolesAndResp?: string;
}
```

**Response** (201 Created):
```typescript
{
  success: true;
  data: {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    location: string;
    stipend?: string;
    status: 'DRAFT';  // Default status
    recruiterId: string;  // From auth token
    recruiterName: string;
    companyName: string;
    postedAt: string;
    createdAt: string;
    updatedAt: string;
  };
  message: 'Job posting created successfully';
}
```

### Update Job Posting

**Endpoint**: `PUT /jobs/:id`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request** (all fields optional):
```typescript
{
  title?: string;
  description?: string;
  requirements?: string[];
  location?: string;
  stipend?: string;
  duration?: string;
  status?: 'DRAFT' | 'PENDING';  // Recruiter can only set these
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: { /* Updated job object */ };
  message: 'Job posting updated successfully';
}
```

### Approve/Reject Job

**Endpoint**: `PUT /jobs/:id/status`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  status: 'APPROVED' | 'REJECTED';
  feedback?: string;  // Required if REJECTED
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: { /* Updated job object */ };
  message: 'Job posting status updated';
}
```

**ERP Trigger**: On APPROVED, trigger push to Student App via ERP

---

## 📝 Student Applications

### Get All Applications

**Endpoint**: `GET /applications`

**Query Parameters**:
```typescript
{
  jobId?: string;  // Filter by job
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  facultyId?: string;  // Filter by assigned faculty
  search?: string;  // Search by student name/USN
  page?: number;
  limit?: number;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    applications: Array<{
      id: string;
      jobId: string;
      jobTitle: string;
      companyName: string;
      studentId: string;
      studentName: string;
      studentRegNo: string;  // USN
      studentEmail: string;
      program: string;       // e.g., "MCA"
      semester: number;
      cgpa: number;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      resumeUrl?: string;
      coverLetterUrl?: string;
      appliedAt: string;
      reviewedAt?: string;
      reviewedBy?: string;
      rejectionReason?: string;
      lorUrl?: string;  // Letter of Recommendation URL
    }>;
    pagination: { /* ... */ }
  }
}
```

### Get Application Details

**Endpoint**: `GET /applications/:id`

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    id: string;
    job: { /* Full job object */ };
    student: {
      id: string;
      name: string;
      regNo: string;
      email: string;
      phone: string;
      program: string;
      semester: number;
      cgpa: number;
      department: string;
    };
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    resumeUrl?: string;
    coverLetterUrl?: string;
    additionalDocuments?: string[];
    appliedAt: string;
    reviewedAt?: string;
    reviewedBy?: {
      id: string;
      name: string;
      role: string;
    };
    rejectionReason?: string;
    lorUrl?: string;
  }
}
```

### Approve Application

**Endpoint**: `PUT /applications/:id/approve`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  notes?: string;
  generateLOR?: boolean;  // Default: true
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    application: { /* Updated application object */ };
    lorUrl?: string;  // If generated
  };
  message: 'Application approved successfully';
}
```

**ERP Trigger**: Notify student via Student App

### Reject Application

**Endpoint**: `PUT /applications/:id/reject`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  reason: string;  // Required
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: { /* Updated application object */ };
  message: 'Application rejected';
}
```

**ERP Trigger**: Notify student via Student App

### Generate LOR

**Endpoint**: `POST /applications/:id/lor`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  template?: string;  // Optional LOR template ID
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    lorUrl: string;  // URL to download PDF
    lorId: string;
    generatedAt: string;
    generatedBy: {
      id: string;
      name: string;
    }
  };
  message: 'Letter of Recommendation generated successfully';
}
```

---

## 👨‍🏫 Guide Assignment

### Get Student-Guide Assignments

**Endpoint**: `GET /guides/assignments`

**Query Parameters**:
```typescript
{
  guideId?: string;  // Filter by faculty guide
  studentId?: string;
  status?: 'UNASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  page?: number;
  limit?: number;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    assignments: Array<{
      id: string;
      student: {
        id: string;
        name: string;
        regNo: string;
        program: string;
      };
      guide: {
        id: string;
        name: string;
        department: string;
      } | null;
      internship: {
        id: string;
        companyName: string;
        position: string;
      };
      status: 'UNASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
      assignedAt?: string;
      completedAt?: string;
      feedbacks: Array<{
        id: string;
        content: string;
        createdAt: string;
      }>;
    }>;
    pagination: { /* ... */ }
  }
}
```

### Assign Guide

**Endpoint**: `POST /guides/assign`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  studentId: string;
  guideId: string;
  internshipId: string;
}
```

**Response** (201 Created):
```typescript
{
  success: true;
  data: {
    id: string;
    student: { /* ... */ };
    guide: { /* ... */ };
    internship: { /* ... */ };
    status: 'IN_PROGRESS';
    assignedAt: string;
  };
  message: 'Guide assigned successfully';
}
```

**ERP Trigger**: Notify student and guide

### Add Feedback

**Endpoint**: `POST /guides/assignments/:id/feedback`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  content: string;
  attachments?: string[];  // URLs to documents
}
```

**Response** (201 Created):
```typescript
{
  success: true;
  data: {
    id: string;
    content: string;
    attachments: string[];
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: string;
  };
  message: 'Feedback added successfully';
}
```

---

## ⭐ Final Evaluation

### Submit Evaluation

**Endpoint**: `POST /evaluations`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```typescript
{
  studentId: string;
  internshipId: string;
  rating: number;  // 1-5
  remarks: string;
  technicalSkills?: number;  // 1-10
  communicationSkills?: number;
  punctuality?: number;
  overallPerformance?: number;
  strengths?: string;
  areasOfImprovement?: string;
}
```

**Response** (201 Created):
```typescript
{
  success: true;
  data: {
    id: string;
    studentId: string;
    internshipId: string;
    rating: number;
    remarks: string;
    technicalSkills: number;
    communicationSkills: number;
    punctuality: number;
    overallPerformance: number;
    strengths: string;
    areasOfImprovement: string;
    evaluatedBy: {
      id: string;
      name: string;
    };
    evaluatedAt: string;
  };
  message: 'Evaluation submitted successfully';
}
```

**ERP Trigger**: Update student records, notify student

### Get Evaluations

**Endpoint**: `GET /evaluations`

**Query Parameters**:
```typescript
{
  studentId?: string;
  evaluatorId?: string;
  page?: number;
  limit?: number;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    evaluations: Array<{
      id: string;
      student: { /* ... */ };
      internship: { /* ... */ };
      rating: number;
      remarks: string;
      technicalSkills: number;
      communicationSkills: number;
      punctuality: number;
      overallPerformance: number;
      strengths: string;
      areasOfImprovement: string;
      evaluatedBy: { /* ... */ };
      evaluatedAt: string;
    }>;
    pagination: { /* ... */ }
  }
}
```

---

## 🔔 Notifications

### Get User Notifications

**Endpoint**: `GET /notifications`

**Query Parameters**:
```typescript
{
  isRead?: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
  page?: number;
  limit?: number;
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: 'success' | 'error' | 'warning' | 'info';
      isRead: boolean;
      createdAt: string;
      link?: string;  // Optional link to navigate
    }>;
    unreadCount: number;
    pagination: { /* ... */ }
  }
}
```

### Mark as Read

**Endpoint**: `PUT /notifications/:id/read`

**Response** (200 OK):
```typescript
{
  success: true;
  message: 'Notification marked as read';
}
```

### Mark All as Read

**Endpoint**: `PUT /notifications/read-all`

**Response** (200 OK):
```typescript
{
  success: true;
  message: 'All notifications marked as read';
}
```

---

## 🚨 Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Temporary unavailable |

---

## 📊 Rate Limiting

```
Rate Limit: 100 requests per minute per user
Headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1645564800
```

---

## 🔒 CORS Configuration

**Allowed Origins**:
```
Development: http://localhost:5173
Staging: https://staging-ims.christuniversity.in
Production: https://ims.christuniversity.in
```

**Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`

**Allowed Headers**: `Content-Type, Authorization`

---

## ✅ Testing API Endpoints

### Using cURL

```bash
# Login
curl -X POST https://api.christuniversity.in/ims/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ic@christuniversity.in", "password": "password", "role": "IC"}'

# Get sessions (with token)
curl -X GET https://api.christuniversity.in/ims/sessions \
  -H "Authorization: Bearer <token>"

# Create job posting
curl -X POST https://api.christuniversity.in/ims/jobs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Intern",
    "description": "Work on React applications",
    "location": "Bangalore",
    "stipend": "25000",
    "requirements": ["React", "TypeScript"]
  }'
```

### Using Postman

Import this collection:
```json
{
  "info": {
    "name": "IMS API Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [{"key": "token", "value": "{{token}}"}]
  }
}
```

---

## 📝 Frontend-Backend Communication

### Authentication Flow

```
1. User logs in → POST /auth/login
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include:
   Header: Authorization: Bearer <token>
5. Token expires after 1 hour
6. Frontend refreshes token → POST /auth/refresh
7. On 401 error, redirect to login
```

### Data Fetching Pattern (Frontend)

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor (add token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

**Last Updated**: January 31, 2026  
**Version**: 1.0.0  
**Contact**: backend-team@christuniversity.in
