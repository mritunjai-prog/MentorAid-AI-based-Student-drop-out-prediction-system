# MentorAid - MongoDB & Google OAuth Integration Guide

## 🚀 Setup Instructions

### 1. Backend Setup

#### Install MongoDB

```powershell
# Option 1: Install MongoDB Community Edition
# Download from: https://www.mongodb.com/try/download/community

# Option 2: Use MongoDB Atlas (Cloud)
# Create free cluster at: https://www.mongodb.com/cloud/atlas
```

#### Install Python Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables

```powershell
# Copy .env.example to .env
copy .env.example .env

# Edit .env file with your credentials:
# - MONGODB_URI=mongodb://localhost:27017/  (or your MongoDB Atlas URI)
# - GOOGLE_CLIENT_ID=your-google-client-id
# - GOOGLE_CLIENT_SECRET=your-google-client-secret
# - JWT_SECRET_KEY=your-secret-key-here
```

### 2. Google OAuth Setup

#### Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "MentorAid"
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:5000`
7. Authorized redirect URIs:
   - `http://localhost:5173`
8. Copy **Client ID** and **Client Secret**

#### Update Configuration

```powershell
# Backend .env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Frontend .env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 3. Frontend Setup

#### Install Dependencies

```powershell
npm install
```

#### Configure Environment

```powershell
# Copy .env.example to .env
copy .env.example .env

# Edit .env file:
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application

#### Start MongoDB (if local)

```powershell
# Start MongoDB service
mongod
```

#### Start Backend

```powershell
cd backend
python app_with_auth.py
```

#### Start Frontend

```powershell
npm run dev
```

## 📋 New Files Created

### Backend Files:

- `backend/config.py` - Configuration settings
- `backend/database.py` - MongoDB models (User, Prediction, Student, Intervention)
- `backend/auth.py` - Authentication utilities
- `backend/app_with_auth.py` - Main Flask app with auth
- `backend/.env.example` - Environment variables template
- `backend/requirements.txt` - Updated with new dependencies

### Frontend Files:

- `src/utils/api.ts` - API client with axios
- `src/contexts/AuthContext.new.tsx` - Updated auth context
- `src/App.new.tsx` - App with Google OAuth provider
- `src/pages/Login.new.tsx` - Login page with Google button
- `.env.example` - Environment variables template

## 🔒 Security Features

### JWT Authentication

- Access tokens (24 hour expiry)
- Refresh tokens (30 day expiry)
- Automatic token refresh on 401

### Protected Routes

All prediction and management endpoints require authentication:

- `/api/predict` - Single prediction
- `/api/predict/batch` - Batch predictions
- `/api/students` - Student management
- `/api/interventions` - Intervention tracking
- `/api/stats/predictions` - Statistics

### Google OAuth

- Secure token verification
- Email verification check
- Automatic user creation/login

## 📊 Database Collections

### Users Collection

```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "name": "John Doe",
  "google_id": "1234567890",
  "picture": "https://...",
  "role": "counselor",
  "created_at": ISODate,
  "last_login": ISODate
}
```

### Predictions Collection

```json
{
  "_id": ObjectId,
  "user_id": "user_id",
  "student_id": "optional",
  "prediction": "Dropout",
  "confidence": 0.85,
  "probabilities": {
    "Dropout": 0.85,
    "Enrolled": 0.10,
    "Graduate": 0.05
  },
  "risk_level": "High",
  "created_at": ISODate
}
```

### Students Collection

```json
{
  "_id": ObjectId,
  "student_id": "STU001",
  "name": "Student Name",
  "email": "student@university.edu",
  "data": { ... student features ... },
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### Interventions Collection

```json
{
  "_id": ObjectId,
  "student_id": "STU001",
  "user_id": "counselor_id",
  "type": "Academic Support",
  "description": "Tutoring session scheduled",
  "outcome": "Improved grades",
  "created_at": ISODate
}
```

## 🔄 Migration from Old to New

### Step 1: Rename Files

```powershell
# Backup old files
copy src\contexts\AuthContext.tsx src\contexts\AuthContext.old.tsx
copy src\App.tsx src\App.old.tsx
copy src\pages\Login.tsx src\pages\Login.old.tsx

# Replace with new files
copy src\contexts\AuthContext.new.tsx src\contexts\AuthContext.tsx
copy src\App.new.tsx src\App.tsx
copy src\pages\Login.new.tsx src\pages\Login.tsx

# Backup old backend
copy backend\app.py backend\app.old.py

# Use new backend
copy backend\app_with_auth.py backend\app.py
```

### Step 2: Install New Dependencies

```powershell
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ..
npm install
```

### Step 3: Configure Environment Variables

- Set up Google OAuth credentials
- Configure MongoDB connection
- Set JWT secret key

### Step 4: Test

1. Start MongoDB
2. Start backend: `python app.py`
3. Start frontend: `npm run dev`
4. Try Google login at `http://localhost:5173/login`

## 🎯 API Usage Examples

### Google Login (Frontend)

```typescript
import { authAPI } from "../utils/api";

// After Google returns credential
const response = await authAPI.googleLogin(credential);
localStorage.setItem("access_token", response.access_token);
```

### Make Authenticated Request

```typescript
import { predictionAPI } from "../utils/api";

// Token automatically added by axios interceptor
const result = await predictionAPI.predictSingle(studentData);
```

### Batch Prediction with CSV

```typescript
const formData = new FormData();
formData.append("file", csvFile);

const response = await predictionAPI.predictBatch(csvFile);
// Predictions saved to database automatically
```

## 🐛 Troubleshooting

### Google Login Not Working

- Verify `VITE_GOOGLE_CLIENT_ID` matches Google Console
- Check authorized JavaScript origins include `http://localhost:5173`
- Clear browser cache and cookies

### MongoDB Connection Failed

- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- Verify network connectivity for Atlas

### JWT Token Errors

- Check `JWT_SECRET_KEY` is set in `.env`
- Verify token format in localStorage
- Try logout and login again

## 🚀 Next Steps

1. ✅ Set up Google OAuth credentials
2. ✅ Configure MongoDB (local or Atlas)
3. ✅ Update environment variables
4. ✅ Test Google login
5. ✅ Test CSV upload with predictions saved to DB
6. 📝 Add user roles and permissions
7. 📝 Implement email notifications
8. 📝 Deploy to production

## 📞 Support

For issues or questions, refer to:

- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- MongoDB: https://docs.mongodb.com/
- Flask-JWT: https://flask-jwt-extended.readthedocs.io/
