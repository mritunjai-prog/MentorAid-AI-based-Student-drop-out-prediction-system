# Google OAuth Setup for MentorAid

## 📋 Your Google Cloud Project Details

- **Project ID:** `coral-rider-431818-f3`
- **Project Number:** `284543669595`
- **Console Link:** https://console.cloud.google.com/apis/credentials?project=coral-rider-431818-f3

---

## 🔧 Step-by-Step OAuth Configuration

### 1. Enable Google+ API

```bash
# Go to Google Cloud Console
https://console.cloud.google.com/apis/library/plus.googleapis.com?project=coral-rider-431818-f3

# Click "ENABLE" button
```

### 2. Configure OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=coral-rider-431818-f3

2. Choose **User Type:**

   - Select **"External"** (for testing with any Google account)
   - Click **"CREATE"**

3. **App Information:**

   - **App name:** `MentorAid`
   - **User support email:** Your email
   - **App logo:** (Optional)
   - **Application home page:** `http://localhost:5173`
   - **Application privacy policy:** (Optional for testing)
   - **Application terms of service:** (Optional for testing)
   - **Authorized domains:** Leave empty for localhost testing
   - **Developer contact information:** Your email
   - Click **"SAVE AND CONTINUE"**

4. **Scopes:**

   - Click **"ADD OR REMOVE SCOPES"**
   - Select:
     - ✅ `openid`
     - ✅ `profile`
     - ✅ `email`
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

5. **Test Users (Optional for External):**

   - Add your email as test user if using External
   - Click **"SAVE AND CONTINUE"**

6. **Summary:**
   - Review and click **"BACK TO DASHBOARD"**

### 3. Create OAuth 2.0 Client ID

1. Go to: https://console.cloud.google.com/apis/credentials?project=coral-rider-431818-f3

2. Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client ID"**

3. **Application type:** `Web application`

4. **Name:** `MentorAid Web Client`

5. **Authorized JavaScript origins:**

   ```
   http://localhost:5173
   http://localhost:5000
   ```

6. **Authorized redirect URIs:**

   ```
   http://localhost:5173
   http://localhost:5173/login
   ```

7. Click **"CREATE"**

8. **Copy your credentials:**
   - ✅ **Client ID:** `XXXXXXXXX.apps.googleusercontent.com`
   - ✅ **Client Secret:** `GOCSPX-XXXXXXXXXXXX`

### 4. Configure Environment Variables

#### Backend Configuration

Create `backend/.env` file:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=mentoraid

# JWT Configuration
JWT_SECRET_KEY=mentoraid-secret-key-2025-change-in-production

# Google OAuth Configuration
# Project ID: coral-rider-431818-f3
# Project Number: 284543669595
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

#### Frontend Configuration

Create `.env` file in root:

```bash
# Google OAuth Configuration
# Project ID: coral-rider-431818-f3
# Project Number: 284543669595
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000/api
```

**Replace:**

- `YOUR_CLIENT_ID` with your actual Client ID from step 3
- `YOUR_CLIENT_SECRET` with your actual Client Secret from step 3

---

## 🧪 Testing OAuth Integration

### 1. Install MongoDB

```powershell
# Option 1: Local MongoDB
# Download from: https://www.mongodb.com/try/download/community
# Or install via chocolatey:
choco install mongodb

# Option 2: MongoDB Atlas (Cloud - Free Tier)
# Sign up at: https://www.mongodb.com/cloud/atlas
# Get connection string and update MONGODB_URI in .env
```

### 2. Install Dependencies

```powershell
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ..
npm install
```

### 3. Activate New Authentication Files

```powershell
# Backup old files
copy src\contexts\AuthContext.tsx src\contexts\AuthContext.backup.tsx
copy src\App.tsx src\App.backup.tsx
copy src\pages\Login.tsx src\pages\Login.backup.tsx
copy backend\app.py backend\app.backup.py

# Activate new files
copy src\contexts\AuthContext.new.tsx src\contexts\AuthContext.tsx /Y
copy src\App.new.tsx src\App.tsx /Y
copy src\pages\Login.new.tsx src\pages\Login.tsx /Y
copy backend\app_with_auth.py backend\app.py /Y
```

### 4. Start Services

```powershell
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start Backend
cd backend
python app.py

# Terminal 3: Start Frontend
npm run dev
```

### 5. Test Google Login

1. Open browser: `http://localhost:5173/login`
2. Click **"Sign in with Google"** button
3. Select your Google account
4. Authorize MentorAid app
5. You should be redirected to dashboard

---

## 🔍 Troubleshooting

### Error: "Origin not allowed"

**Solution:**

- Verify `http://localhost:5173` is in **Authorized JavaScript origins**
- Clear browser cache
- Try incognito mode

### Error: "Redirect URI mismatch"

**Solution:**

- Add `http://localhost:5173/login` to **Authorized redirect URIs**
- Exact match required (no trailing slash differences)

### Error: "Invalid client"

**Solution:**

- Verify `VITE_GOOGLE_CLIENT_ID` matches Client ID from Google Console
- Check no extra spaces in `.env` file
- Restart Vite dev server after changing `.env`

### Error: "MongoDB connection failed"

**Solution:**

- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `backend/.env`
- For Atlas: verify connection string and whitelist IP (0.0.0.0/0 for testing)

### Google Sign-In Button Not Showing

**Solution:**

- Verify `@react-oauth/google` is installed: `npm install @react-oauth/google`
- Check browser console for errors
- Ensure `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Restart dev server: `npm run dev`

### Backend: "Token verification failed"

**Solution:**

- Ensure `GOOGLE_CLIENT_ID` in `backend/.env` matches frontend
- Check `google-auth` package is installed: `pip install google-auth`
- Verify internet connection (Google token verification requires network)

---

## 📊 Database Collections Created

After first Google login, MongoDB will have:

### `users` Collection

```json
{
  "_id": ObjectId("..."),
  "email": "you@gmail.com",
  "name": "Your Name",
  "google_id": "1234567890",
  "picture": "https://lh3.googleusercontent.com/...",
  "role": "counselor",
  "created_at": ISODate("2025-11-24T..."),
  "last_login": ISODate("2025-11-24T...")
}
```

### `predictions` Collection

```json
{
  "_id": ObjectId("..."),
  "user_id": "user_object_id",
  "prediction": "Graduate",
  "confidence": 0.87,
  "probabilities": {
    "Dropout": 0.08,
    "Enrolled": 0.05,
    "Graduate": 0.87
  },
  "risk_level": "Low",
  "created_at": ISODate("2025-11-24T...")
}
```

---

## 🚀 Production Deployment

### Update OAuth Settings for Production

1. Add production URLs to Google Console:

   - **Authorized JavaScript origins:**
     ```
     https://your-domain.com
     ```
   - **Authorized redirect URIs:**
     ```
     https://your-domain.com/login
     ```

2. Update environment variables:

   ```bash
   # Backend
   FRONTEND_URL=https://your-domain.com
   FLASK_ENV=production
   FLASK_DEBUG=0
   JWT_SECRET_KEY=strong-random-key-here

   # Frontend
   VITE_API_URL=https://api.your-domain.com/api
   ```

3. Change OAuth consent screen to **Internal** (if Google Workspace) or **External** (verified)

---

## 📞 Quick Reference Links

- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials?project=coral-rider-431818-f3
- **OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent?project=coral-rider-431818-f3
- **API Library:** https://console.cloud.google.com/apis/library?project=coral-rider-431818-f3
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **React OAuth Docs:** https://www.npmjs.com/package/@react-oauth/google
- **Flask JWT Docs:** https://flask-jwt-extended.readthedocs.io/

---

## ✅ Verification Checklist

Before testing, ensure:

- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized JavaScript origins set (`http://localhost:5173`)
- [ ] Authorized redirect URIs set (`http://localhost:5173/login`)
- [ ] Client ID copied to both `.env` files
- [ ] Client Secret in `backend/.env`
- [ ] MongoDB installed/configured
- [ ] All dependencies installed (`pip install` + `npm install`)
- [ ] New auth files activated
- [ ] All services running (MongoDB, Backend, Frontend)

---

**Ready to test!** 🎉

Open http://localhost:5173/login and click "Sign in with Google"
