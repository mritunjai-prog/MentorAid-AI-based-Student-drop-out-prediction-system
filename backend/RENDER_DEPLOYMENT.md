# Deploying Backend to Render

## Quick Deploy Steps

1. **Go to Render**: Visit [https://render.com](https://render.com) and sign up/login with GitHub

2. **Create New Web Service**:

   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository: `MentorAid-AI-based-Student-drop-out-prediction-system`
   - Select the repository

3. **Configure the service**:

   - **Name**: `mentoraid-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

   ```
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET_KEY=<generate-a-strong-random-secret-key>
   JWT_REFRESH_SECRET_KEY=<generate-another-strong-random-secret-key>
   GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
   FLASK_ENV=production
   ```

   **Get your actual values from:**

   - MongoDB URI: From `backend/.env` file
   - Google OAuth: From `backend/.env` file or Google Cloud Console
   - JWT Secrets: Generate new random strings for production

5. **Click "Create Web Service"** - Render will start building and deploying

6. **Wait for deployment** (2-3 minutes) - You'll get a URL like: `https://mentoraid-backend.onrender.com`

## After Backend is Deployed

1. **Update Netlify environment variable**:

   - Go to: https://app.netlify.com/sites/mentoraid/configuration/env
   - Update `VITE_API_URL` to: `https://mentoraid-backend.onrender.com/api`
   - Redeploy frontend

2. **Update backend CORS**:

   - Your backend already has CORS configured for production

3. **Test the deployment**:
   - Visit: `https://mentoraid-backend.onrender.com/api/health`
   - Should see: `{"status": "healthy"}`

## Important Notes

- Free tier on Render: Service spins down after 15 minutes of inactivity
- First request after inactivity takes ~30 seconds to wake up
- ML models (23MB Random Forest) will be loaded on startup
- MongoDB Atlas is already configured for remote access

## Alternative: Deploy Backend to Railway

If you prefer Railway:

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `backend`
5. Add the same environment variables
6. Railway will auto-detect Python and deploy

Your backend URL will be: `https://mentoraid-backend.up.railway.app`
