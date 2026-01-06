# Frontend Integration Guide

This guide shows how to integrate the frontend with the MERN backend.

## Setup

1. Start MongoDB (local or Atlas)
2. Configure `.env` file in `/server` directory
3. Install backend dependencies: `cd server && npm install`
4. Start backend server: `npm run dev` (runs on port 5000)
5. Frontend runs on port 8080

## API Base URL

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Authentication Flow

### 1. Signup/Register

```javascript
// POST /api/auth/signup
const signup = async (email, password, fullName) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, fullName })
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};
```

### 2. Login

```javascript
// POST /api/auth/login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};
```

### 3. Get Current User

```javascript
// GET /api/auth/me
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
};
```

### 4. Logout

```javascript
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page
};
```

### 5. Forgot Password

```javascript
// POST /api/auth/forgot-password
const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });

  return await response.json();
};
```

### 6. Reset Password

```javascript
// POST /api/auth/reset-password
const resetPassword = async (token, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password })
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('token', data.token);
  }

  return data;
};
```

## Student CRUD Operations

### Helper Function for Authenticated Requests

```javascript
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};
```

### 1. Get All Students

```javascript
// GET /api/students
const getStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    headers: getAuthHeaders()
  });

  return await response.json();
};
```

### 2. Create Student

```javascript
// POST /api/students
const createStudent = async (studentData, imageFile) => {
  const formData = new FormData();

  formData.append('fullName', studentData.fullName);
  formData.append('email', studentData.email);
  if (studentData.phone) formData.append('phone', studentData.phone);
  if (studentData.dateOfBirth) formData.append('dateOfBirth', studentData.dateOfBirth);
  if (studentData.gender) formData.append('gender', studentData.gender);
  if (studentData.courseOrDepartment) formData.append('courseOrDepartment', studentData.courseOrDepartment);
  if (studentData.batchOrYear) formData.append('batchOrYear', studentData.batchOrYear);
  if (studentData.address) formData.append('address', studentData.address);

  if (imageFile) {
    formData.append('profileImage', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });

  return await response.json();
};
```

### 3. Get Single Student

```javascript
// GET /api/students/:id
const getStudent = async (id) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    headers: getAuthHeaders()
  });

  return await response.json();
};
```

### 4. Update Student

```javascript
// PUT /api/students/:id
const updateStudent = async (id, studentData, imageFile) => {
  const formData = new FormData();

  formData.append('fullName', studentData.fullName);
  formData.append('email', studentData.email);
  if (studentData.phone) formData.append('phone', studentData.phone);
  if (studentData.dateOfBirth) formData.append('dateOfBirth', studentData.dateOfBirth);
  if (studentData.gender) formData.append('gender', studentData.gender);
  if (studentData.courseOrDepartment) formData.append('courseOrDepartment', studentData.courseOrDepartment);
  if (studentData.batchOrYear) formData.append('batchOrYear', studentData.batchOrYear);
  if (studentData.address) formData.append('address', studentData.address);

  if (imageFile) {
    formData.append('profileImage', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData
  });

  return await response.json();
};
```

### 5. Delete Student

```javascript
// DELETE /api/students/:id
const deleteStudent = async (id) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  return await response.json();
};
```

### 6. Upload Image Only

```javascript
// POST /api/students/upload-image
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/students/upload-image`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });

  return await response.json();
};
```

## Error Handling

```javascript
const handleApiError = (data) => {
  if (!data.success) {
    if (data.message === 'Not authorized to access this route') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

const apiCall = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return handleApiError(data);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## Field Mapping

### Frontend → Backend

| Frontend Field | Backend Field | Type |
|---------------|---------------|------|
| full_name | fullName | String |
| email | email | String |
| phone | phone | String |
| date_of_birth | dateOfBirth | Date |
| gender | gender | String |
| course_or_department | courseOrDepartment | String |
| batch_or_year | batchOrYear | String |
| address | address | String |
| profile_image_url | profileImageUrl | String |

### Backend → Frontend Response

| Backend Field | Frontend Field | Type |
|--------------|---------------|------|
| fullName | full_name | String |
| email | email | String |
| phone | phone | String |
| dateOfBirth | date_of_birth | Date |
| gender | gender | String |
| courseOrDepartment | course_or_department | String |
| batchOrYear | batch_or_year | String |
| address | address | String |
| profileImageUrl | profile_image_url | String |
| _id | id | String |
| createdAt | created_at | Date |
| updatedAt | updated_at | Date |

## Complete Integration Example

```javascript
// Create a student with all fields
const handleCreateStudent = async (formData, imageFile) => {
  try {
    const studentData = {
      fullName: formData.full_name,
      email: formData.email,
      phone: formData.phone || null,
      dateOfBirth: formData.date_of_birth || null,
      gender: formData.gender || null,
      courseOrDepartment: formData.course_or_department || null,
      batchOrYear: formData.batch_or_year || null,
      address: formData.address || null
    };

    const result = await createStudent(studentData, imageFile);

    if (result.success) {
      const student = {
        id: result.data._id,
        full_name: result.data.fullName,
        email: result.data.email,
        phone: result.data.phone,
        date_of_birth: result.data.dateOfBirth,
        gender: result.data.gender,
        course_or_department: result.data.courseOrDepartment,
        batch_or_year: result.data.batchOrYear,
        address: result.data.address,
        profile_image_url: result.data.profileImageUrl,
        created_at: result.data.createdAt,
        updated_at: result.data.updatedAt
      };

      console.log('Student created:', student);
    }
  } catch (error) {
    console.error('Error creating student:', error.message);
  }
};
```

## CORS Configuration

The backend is configured to accept requests from `http://localhost:8080` by default. If you need to change the frontend URL, update the `FRONTEND_URL` in `.env`:

```
FRONTEND_URL=http://localhost:8080
```

## Testing Checklist

- [ ] Backend server running on port 5000
- [ ] MongoDB connected successfully
- [ ] Cloudinary credentials configured
- [ ] Can register new authority user
- [ ] Can login with credentials
- [ ] JWT token stored in localStorage
- [ ] Can create student with image
- [ ] Can fetch all students
- [ ] Can update student
- [ ] Can delete student
- [ ] Protected routes require authentication
- [ ] Logout clears token

## Common Issues

### CORS Error
- Ensure backend `FRONTEND_URL` matches your frontend URL
- Check if backend server is running

### 401 Unauthorized
- Check if token is present in localStorage
- Verify token is being sent in Authorization header
- Token may have expired (default: 7 days)

### 404 Not Found
- Verify API endpoint URLs
- Check if routes are registered correctly
- Ensure backend server is running on correct port

### Image Upload Fails
- Check Cloudinary credentials
- Verify file size is under 5MB
- Ensure file is a valid image format

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Ensure network connectivity for Atlas
