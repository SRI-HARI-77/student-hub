# Frontend Setup - Running with Backend

## Quick Start

Your frontend is now fully migrated to use the Node.js + MongoDB backend.

### Prerequisites

1. **Backend running** on `http://localhost:5000`
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **MongoDB connected** (local or Atlas)
   - Verify in backend console: `MongoDB Connected`

3. **Frontend ready** (already set up)

## Running Frontend

### Development Mode

```bash
# From project root
npm run dev
```

Frontend runs on `http://localhost:8080`

### Production Build

```bash
npm run build
npm run preview
```

## How Frontend Connects to Backend

### API Base URL
```typescript
// src/lib/api.ts
const API_BASE_URL = 'http://localhost:5000/api';
```

### Automatic Features
- ✓ JWT token injection (Bearer token)
- ✓ JSON Content-Type headers
- ✓ Auto-logout on 401
- ✓ FormData for uploads

### Token Flow
1. **Login** → Backend returns JWT
2. **Store** → `localStorage.auth_token`
3. **Attach** → Automatically added to all protected requests
4. **Logout** → Token cleared from localStorage

## Testing the Connection

### 1. Register New Authority
1. Go to `http://localhost:8080/signup`
2. Enter email, password, full name
3. Click "Create Account"
4. Should redirect to dashboard

### 2. Add Student
1. Click "Add Student" button
2. Fill form fields
3. Upload optional profile image
4. Click "Save"
5. Should appear in student list

### 3. Logout & Login Again
1. Click logout
2. Should redirect to login
3. Login with same credentials
4. Should see previous session data

## How It Works Behind the Scenes

### Signup Flow
```
User fills form
      ↓
onClick handler calls signUp()
      ↓
signUp() calls api('/auth/signup', {...})
      ↓
api() sends POST to http://localhost:5000/api/auth/signup
      ↓
Backend validates, creates user, returns JWT + user object
      ↓
Frontend stores JWT in localStorage.auth_token
      ↓
Frontend stores user in localStorage.auth_user
      ↓
useAuth context updates with user
      ↓
Navigate redirects to /dashboard
      ↓
ProtectedRoute sees user, renders Dashboard
```

### Dashboard (Students) Flow
```
Dashboard mounts
      ↓
useStudents hook executes queryFn
      ↓
queryFn calls api('/students')
      ↓
api() automatically adds Authorization header with JWT
      ↓
api() sends GET to http://localhost:5000/api/students
      ↓
Backend validates JWT, fetches user's students from MongoDB
      ↓
Backend returns array of students
      ↓
queryFn transforms field names (camelCase → snake_case)
      ↓
React Query caches data, component re-renders
      ↓
Student cards display on screen
```

## API Endpoints Being Called

### Authentication
- `POST /api/auth/signup` - Register authority
- `POST /api/auth/login` - Login authority
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Confirm password reset
- `PUT /api/auth/update-password` - Update password

### Students (Protected)
- `GET /api/students` - List all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/upload-image` - Upload image

## Data Transformation

Frontend uses `snake_case`, backend uses `camelCase`. Automatic transformation:

### Creating/Updating Student

```typescript
// Frontend form
{
  full_name: "John Doe",
  email: "john@example.com",
  date_of_birth: "2000-01-15",
  course_or_department: "CS"
}

// Transformed for backend
{
  fullName: "John Doe",
  email: "john@example.com",
  dateOfBirth: "2000-01-15",
  courseOrDepartment: "CS"
}
```

### Receiving Student

```typescript
// Backend returns
{
  _id: "123abc",
  fullName: "John Doe",
  email: "john@example.com",
  dateOfBirth: "2000-01-15",
  courseOrDepartment: "CS"
}

// Frontend transforms to
{
  id: "123abc",
  full_name: "John Doe",
  email: "john@example.com",
  date_of_birth: "2000-01-15",
  course_or_department: "CS"
}
```

## Debugging

### Check Network Requests
1. Open DevTools → Network tab
2. Try an action (login, add student)
3. Look for requests to `localhost:5000/api/...`
4. Check status code (200 = success, 401 = unauthorized, 500 = server error)

### Check localStorage
1. Open DevTools → Application → LocalStorage
2. Look for `auth_token` (JWT)
3. Look for `auth_user` (user info)
4. Both should be present after login

### Check Backend Logs
When testing, the backend should log:
```
MongoDB Connected: localhost
Server running on port 5000
GET /api/students → 200
POST /api/students → 201
etc.
```

## File Locations

```
src/
├── lib/
│   └── api.ts              # API client with JWT handling
├── hooks/
│   ├── useAuth.tsx         # Auth context & login/signup
│   └── useStudents.tsx     # Student CRUD operations
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── ForgotPassword.tsx
│   └── ResetPassword.tsx
└── components/
    ├── auth/
    │   ├── LoginForm.tsx
    │   ├── SignupForm.tsx
    │   └── ProtectedRoute.tsx
    └── dashboard/
        ├── StudentCard.tsx
        ├── StudentModal.tsx
        └── DashboardHeader.tsx
```

## No Supabase References

✓ All Supabase imports removed
✓ All Supabase method calls replaced
✓ All Supabase types replaced
✓ All Supabase client removed

Search in your project confirms: **ZERO Supabase references**

## What Changed in Hooks

### useAuth.tsx
- Before: Used `supabase.auth.*` methods
- Now: Uses `api()` calls to backend
- State: Now stores JWT token + user in localStorage
- Behavior: Same API, different implementation

### useStudents.tsx
- Before: Used `supabase.from().select()` queries
- Now: Uses `api()` and `apiMultipart()` calls
- Transformation: Converts between snake_case ↔ camelCase
- Behavior: Same API, different implementation

### No Component Changes
All components remain unchanged:
- Same props
- Same events
- Same logic
- Same UI
- Same styles
- Same animations

## Troubleshooting

### "Cannot connect to API"
```
→ Check backend is running: npm run dev in /server
→ Check backend URL: http://localhost:5000/api
→ Check no firewall blocking port 5000
```

### "Invalid email or password"
```
→ Check credentials are correct
→ Check user exists in MongoDB
→ Check backend logs for errors
```

### "401 Unauthorized"
```
→ Token may have expired (default 7 days)
→ Try logging in again
→ Check localStorage.auth_token exists
→ Check backend JWT_SECRET matches
```

### "Cannot add student"
```
→ Ensure you're logged in (check localStorage.auth_token)
→ Ensure backend is running
→ Try refreshing page to restore session
→ Check backend logs for errors
```

### "Image upload fails"
```
→ Check file is valid image (jpeg, jpg, png, gif, webp)
→ Check file size is under 5MB
→ Check Cloudinary is configured in backend
→ Check backend logs for upload errors
```

## Summary

✅ Frontend fully migrated from Supabase to backend
✅ No UI changes - all components work identically
✅ JWT authentication working
✅ All CRUD operations functional
✅ Image uploads via Cloudinary
✅ Ready to use with backend

Just run both servers and start using the application!

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
npm run dev
```

Visit `http://localhost:8080` and start managing students!
