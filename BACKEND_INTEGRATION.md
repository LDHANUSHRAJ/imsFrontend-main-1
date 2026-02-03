# 🔗 Backend Integration Guide

## ✅ What's Been Done

Your IMS Frontend is now **configured** to connect to your backend at:
```
https://internshipportal-4iul.onrender.com
```

### Files Created/Updated:

1. **`.env.development`** - Environment configuration pointing to your backend
2. **`src/services/api.ts`** - Centralized Axios API client with:
   - Authentication token injection
   - Error handling (401, 403, 404, 500)
   - Automatic logout on unauthorized access
   - Request/response logging

---

## 🎯 Next Steps to Complete Integration

### Step 1: Understand Your Backend API Structure

**Action Required**: You need to provide or discover the following:

1. **Authentication Endpoints**
   - Login: `POST /auth/login` or similar?
   - What's the request format?
   - What's the response format (token structure)?

2. **Available Endpoints**
   - Sessions: `/api/sessions` or `/sessions`?
   - Recruiters: `/api/recruiters` or `/recruiters`?
   - Jobs: `/api/jobs` or `/internships`?
   - Applications: `/api/applications`?

**How to Find Out**:

Option A: Check backend source code
Option B: Contact backend developer
Option C: Use browser DevTools on the existing UI:
   - Go to https://internshipportal-4iul.onrender.com/ui/
   - Open DevTools (F12) → Network tab
   - Perform actions (login, view internships, etc.)
   - See what API calls are made

### Step 2: Map Frontend to Backend Endpoints

Once you know the backend structure, update these files:

#### `src/services/auth.ts`
Currently uses localStorage mock. Update to:

```typescript
import api from './api';

export const loginUser = async (email: string, password: string, role: UserRole) => {
    const response = await api.post('/auth/login', {
        email,
        password,
        role,
    });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
};
```

#### `src/services/mock/SessionService.ts`
Replace mock implementation with:

```typescript
import api from '../api';
import type { InternshipSession } from '../../types';

export const SessionService = {
    getAll: async (): Promise<InternshipSession[]> => {
        const response = await api.get('/api/sessions'); // Adjust endpoint
        return response.data.sessions || response.data;
    },
    
    create: async (session: Partial<InternshipSession>) => {
        const response = await api.post('/api/sessions', session);
        return response.data;
    },
    
    // ... other methods
};
```

#### Similarly update:
- `JobService.ts` → Connect to `/api/jobs` or `/api/internships`
- `RecruiterService.ts` → Connect to `/api/recruiters`
- `ApplicationService.ts` → Connect to `/api/applications`
- `GuideService.ts` → Connect to `/api/guides`
- `ClosureService.ts` → Connect to `/api/evaluations`

### Step 3: Test the Integration

```bash
# Start development server
npm run dev

# Try logging in
# Watch browser console and Network tab for API calls
# Check if requests are going to your backend
```

---

## 🔍 Debugging Guide

### Check if API calls are reaching backend:

1. **Open Browser DevTools** (F12)
2. Go to **Network** tab
3. Try logging in
4. Look for requests to `internshipportal-4iul.onrender.com`

**If you see:**
- ✅ **200 OK** - Success! Integration working
- ❌ **404 Not Found** - Endpoint doesn't exist (check URL)
- ❌ **401 Unauthorized** - Check token/credentials
- ❌ **500 Internal Server Error** - Backend issue
- ❌ **CORS Error** - Backend needs to allow your frontend domain

### Common Issues & Solutions:

#### Issue 1: CORS Error
```
Access to fetch at 'https://internshipportal-4iul.onrender.com' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: Backend must add CORS headers:
```javascript
// Backend code (Express.js example)
app.use(cors({
  origin: ['http://localhost:5173', 'https://ims.christuniversity.in'],
  credentials: true
}));
```

#### Issue 2: Different Response Format
If backend returns:
```json
{ "success": true, "data": {...} }
```

Update `src/services/api.ts` response interceptor:
```typescript
api.interceptors.response.use(
    (response) => {
        // If backend wraps data in { success, data }
        return response.data.success ? response.data.data : response.data;
    },
    // ...
);
```

#### Issue 3: Token Format Mismatch
If backend expects token differently (e.g., `Token xyz` instead of `Bearer xyz`):

Update `src/services/api.ts` request interceptor:
```typescript
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Token ${token}`; // Adjust format
    }
    return config;
});
```

---

## 📝 Quick Integration Checklist

Use this checklist to track your progress:

### Phase 1: Discovery
- [ ] Map out all backend endpoints (login, sessions, jobs, etc.)
- [ ] Document request/response formats
- [ ] Check authentication mechanism (JWT, session, etc.)
- [ ] Verify CORS is configured

### Phase 2: Update Services
- [ ] Update `auth.ts` with real login endpoint
- [ ] Update `SessionService.ts`
- [ ] Update `JobService.ts`
- [ ] Update `RecruiterService.ts`
- [ ] Update `ApplicationService.ts`
- [ ] Update `GuideService.ts`
- [ ] Update `ClosureService.ts`

### Phase 3: Testing
- [ ] Test login flow
- [ ] Test session management
- [ ] Test job posting
- [ ] Test application approval
- [ ] Test guide assignment
- [ ] Test evaluations
- [ ] Test logout

### Phase 4: Error Handling
- [ ] Handle network errors gracefully
- [ ] Show user-friendly error messages
- [ ] Log errors for debugging
- [ ] Add retry logic for failed requests

---

## 🎓 Example: Converting Mock Service to Real API

### Before (Mock):
```typescript
// SessionService.ts (Mock)
export const SessionService = {
    getAll: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [...MOCK_SESSIONS];
    },
};
```

### After (Real API):
```typescript
// SessionService.ts (Real)
import api from '../api';

export const SessionService = {
    getAll: async () => {
        try {
            const response = await api.get('/api/sessions');
            return response.data.sessions; // Adjust based on backend format
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            throw error;
        }
    },
};
```

---

## 🚀 Recommended Approach

### Option A: Gradual Migration (Safer)
1. Start with authentication only
2. Get login working
3. Then migrate one module at a time (sessions → jobs → applications)
4. Test each module thoroughly before moving to next

### Option B: Full Migration (Faster)
1. Map all endpoints at once
2. Update all services together
3. Test everything
4. Fix issues

**I recommend Option A** - it's safer and easier to debug.

---

## 📞 Need Help?

If you encounter issues, provide:
1. **Endpoint URL** you're trying to hit
2. **Request payload** (what you're sending)
3. **Response** (what backend returns)
4. **Error message** (if any)
5. **Network tab screenshot**

---

## 🔧 Tools to Help

### Postman/Insomnia
Test backend endpoints independently before integrating:
```
POST https://internshipportal-4iul.onrender.com/auth/login
Body: { "email": "test@example.com", "password": "test123", "role": "IC" }
```

### cURL
Quick command-line testing:
```bash
curl -X POST https://internshipportal-4iul.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## ✅ Success Criteria

You'll know integration is complete when:
- ✅ Login works with real credentials
- ✅ Data from backend appears in UI
- ✅ Actions (create, update, delete) persist to backend
- ✅ No more mock data
- ✅ All features work end-to-end

---

**Status**: 🟡 **Backend Connected - Services Need Updating**

**Next Action**: Discover backend API structure and update service files

**Estimated Time**: 2-4 hours (depending on backend API documentation)

---

**Last Updated**: January 31, 2026  
**Backend URL**: https://internshipportal-4iul.onrender.com  
**Frontend Status**: Ready for integration
