# Quick Start Guide

Get the backend running in 5 minutes!

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Cloudinary account (for image uploads)
- Gmail account (for password reset emails)

## Step 1: Install Dependencies

```bash
cd server
npm install
```

## Step 2: Setup Environment Variables

Create a `.env` file in the `/server` directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_management
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_EXPIRE=7d
JWT_RESET_EXPIRE=10m

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

FRONTEND_URL=http://localhost:8080
```

## Step 3: Setup MongoDB

### Option A: Local MongoDB

Install and start MongoDB locally:

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
# Install and start as service

# Linux
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student_management?retryWrites=true&w=majority
```

## Step 4: Setup Cloudinary

1. Go to https://cloudinary.com
2. Create free account
3. Go to Dashboard
4. Copy Cloud Name, API Key, API Secret
5. Update `.env` with your credentials

## Step 5: Setup Gmail for Password Reset

1. Enable 2-Step Verification in Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Generate App Password
4. Update `.env`:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
```

## Step 6: Start the Server

```bash
npm run dev
```

You should see:

```
Server running on port 5000
MongoDB Connected: localhost
```

## Step 7: Test the API

### Using curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123","fullName":"Admin User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Using Postman or Thunder Client:

1. Import the endpoints from `API_INTEGRATION.md`
2. Test signup, login, and student CRUD operations

## Step 8: Connect Frontend

The frontend should be able to connect automatically. Just ensure:

1. Backend is running on port 5000
2. Frontend is running on port 8080
3. Both servers are running simultaneously

## Minimal Setup (Skip Email)

If you want to skip email setup for now:

1. Comment out email-related code in `controllers/authController.js`
2. Or just leave default email values (forgot password won't work)

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=3000
```

### MongoDB Connection Failed

```bash
# Check MongoDB status
brew services list  # macOS
sudo systemctl status mongodb  # Linux

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongodb  # Linux
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## Development Tips

1. Use `npm run dev` for auto-restart on file changes
2. Check console logs for errors
3. MongoDB data persists between restarts
4. Use MongoDB Compass to view database: https://www.mongodb.com/products/compass

## Next Steps

1. Read `README.md` for detailed documentation
2. Check `API_INTEGRATION.md` for frontend integration
3. Test all API endpoints
4. Connect with frontend application

## Production Deployment

For production deployment:

1. Change `JWT_SECRET` to a strong random string
2. Use MongoDB Atlas instead of local MongoDB
3. Set `NODE_ENV=production`
4. Use production-grade email service
5. Enable HTTPS
6. Set up proper logging
7. Configure rate limiting
8. Add monitoring and alerts

## Support

If you encounter issues:

1. Check error messages in console
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check API endpoint URLs
5. Review logs for detailed errors

## Success!

If you see "Server running on port 5000" and "MongoDB Connected", you're all set!

The backend is now ready to handle requests from the frontend.
