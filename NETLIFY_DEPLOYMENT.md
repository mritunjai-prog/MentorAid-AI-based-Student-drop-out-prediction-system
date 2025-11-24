# Deploying MentorAid to Netlify

## Option 1: Deploy via Netlify Web Interface (Recommended)

1. **Go to Netlify**: Visit [https://app.netlify.com](https://app.netlify.com)
2. **Sign in** with your GitHub account
3. **Click "Add new site" → "Import an existing project"**
4. **Connect to GitHub** and select your repository: `MentorAid-AI-based-Student-drop-out-prediction-system`
5. **Configure build settings**:

   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

6. **Add environment variables** (Site settings → Environment variables):

   ```
   VITE_GOOGLE_CLIENT_ID=284543669595-3bat01kl1t0g0uh41fgatmcbl7hv3cla.apps.googleusercontent.com
   VITE_API_URL=https://your-backend-url.com/api
   ```

7. **Click "Deploy site"**

## Option 2: Deploy via Netlify CLI

If you prefer CLI deployment, use these commands:

```powershell
# Login to Netlify (opens browser)
netlify login

# Initialize the site (one-time setup)
netlify init

# Deploy
netlify deploy --prod
```

## Option 3: Manual Drag & Drop

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop your `dist` folder
3. Configure environment variables after deployment

## Post-Deployment Steps

### 1. Update Google OAuth Authorized Origins

Add your Netlify URL to Google Cloud Console:

- Go to: [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
- Select your OAuth 2.0 Client ID
- Add to "Authorized JavaScript origins":
  - `https://your-site-name.netlify.app`
- Add to "Authorized redirect URIs":
  - `https://your-site-name.netlify.app`

### 2. Update Backend CORS Settings

In your `backend/app.py`, add your Netlify URL to allowed origins:

```python
CORS(app, origins=["https://your-site-name.netlify.app"])
```

### 3. Deploy Backend

Your backend needs to be deployed separately. Options:

- **Render**: [render.com](https://render.com) (Free tier available)
- **Railway**: [railway.app](https://railway.app) (Free tier available)
- **Heroku**: [heroku.com](https://heroku.com)
- **PythonAnywhere**: [pythonanywhere.com](https://pythonanywhere.com)

Update `VITE_API_URL` in Netlify environment variables to point to your deployed backend.

## Notes

- Your build is ready in the `dist` folder
- The `netlify.toml` configuration is already set up
- React Router redirects are configured via `_redirects` file
- Frontend-only features will work immediately
- Backend features (authentication, predictions) require backend deployment
