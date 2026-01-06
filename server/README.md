# Student Management System - Backend

A secure MERN stack backend for managing student records with JWT authentication and role-based access control.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Cloudinary for image uploads
- Nodemailer for email notifications

## Features

- Authority (Admin) authentication with JWT
- Secure password hashing with bcrypt
- Password reset via email
- Protected API routes
- Student CRUD operations
- Image upload support via Cloudinary
- Validation and error handling
- Role-based access control

## Project Structure

```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary configuration
├── controllers/
│   ├── authController.js  # Auth logic
│   └── studentController.js # Student CRUD logic
├── middleware/
│   ├── auth.js            # JWT verification
│   └── upload.js          # Multer configuration
├── models/
│   ├── User.js            # User schema
│   └── Student.js         # Student schema
├── routes/
│   ├── auth.js            # Auth routes
│   └── student.js         # Student routes
├── utils/
│   └── sendEmail.js       # Email utility
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── server.js              # Entry point
```

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_management
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_RESET_EXPIRE=10m

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

FRONTEND_URL=http://localhost:8080
```

## MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB locally
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env`

## Cloudinary Setup

1. Create account at https://cloudinary.com
2. Get your credentials from dashboard
3. Update Cloudinary variables in `.env`

## Email Setup (Gmail)

1. Enable 2-Step Verification in Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update email credentials in `.env`

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Register Authority
```
POST /api/auth/signup
Body: { email, password, fullName }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
```

#### Forgot Password
```
POST /api/auth/forgot-password
Body: { email }
```

#### Reset Password
```
POST /api/auth/reset-password
Body: { token, password }
```

#### Update Password
```
PUT /api/auth/update-password
Headers: { Authorization: "Bearer <token>" }
Body: { currentPassword, newPassword }
```

### Student Routes (All require authentication)

#### Get All Students
```
GET /api/students
Headers: { Authorization: "Bearer <token>" }
```

#### Create Student
```
POST /api/students
Headers: { Authorization: "Bearer <token>", Content-Type: "multipart/form-data" }
Body: FormData with student fields + profileImage file
```

#### Get Single Student
```
GET /api/students/:id
Headers: { Authorization: "Bearer <token>" }
```

#### Update Student
```
PUT /api/students/:id
Headers: { Authorization: "Bearer <token>", Content-Type: "multipart/form-data" }
Body: FormData with updated fields + optional profileImage
```

#### Delete Student
```
DELETE /api/students/:id
Headers: { Authorization: "Bearer <token>" }
```

#### Upload Image Only
```
POST /api/students/upload-image
Headers: { Authorization: "Bearer <token>", Content-Type: "multipart/form-data" }
Body: FormData with image file
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Protected routes with middleware
- Role-based access control
- Token expiration handling
- Password reset with time-limited tokens
- Input validation
- File upload restrictions (image types, 5MB limit)

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- File upload errors
- Network errors

## Testing the API

Use tools like Postman or Thunder Client:

1. Register a new authority user
2. Login to get JWT token
3. Add token to Authorization header for protected routes
4. Test CRUD operations for students

## Production Deployment

1. Set strong `JWT_SECRET`
2. Use MongoDB Atlas or production MongoDB
3. Configure production email service
4. Set `NODE_ENV=production`
5. Enable HTTPS
6. Set appropriate CORS origins
7. Use environment-specific configurations

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network connectivity for Atlas

### Cloudinary Upload Error
- Verify credentials
- Check file size (max 5MB)
- Ensure file is valid image format

### Email Not Sending
- Verify Gmail app password
- Check email configuration
- Enable "Less secure app access" if needed

## License

ISC
