![1764335918138](image/NETLIFY_TROUBLESHOOTING/1764335918138.pdf)# Netlify Deployment Troubleshooting

## 🔴 Current Errors

### Error 1: Backend API 404

```
mentoraid-ai-based-student-drop-out.onrender.com/api/auth/me:1 Failed to load resource: 404
```

**Problem:** Backend URL is missing `https://` protocol

**Solution:**

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Check `VITE_API_URL` value
3. It should be: `https://mentoraid-ai-based-student-drop-out.onrender.com/api`
4. NOT: `mentoraid-ai-based-student-drop-out.onrender.com/api`

### Error 2: Chatbot Not Working

```
Using rule-based response (no API key)
```

**Problem:** `VITE_GEMINI_API_KEY` not set in Netlify

**Solution:**

1. Get your Gemini API key from: https://makersuite.google.com/app/apikey
2. Go to Netlify Dashboard → Site settings → Environment variables
3. Add: `VITE_GEMINI_API_KEY` = `your-gemini-api-key`
4. Trigger new deployment

### Error 3: CSV Upload 400 Error

```
mentoraid-ai-based-student-drop-out.onrender.com/api/predict/batch:1 Failed to load resource: 400
```

**Problem:** Either:

- Not logged in (no JWT token)
- Backend CORS not allowing Netlify domain
- Backend endpoint issue

## 🔧 Fix Steps

### Step 1: Set Correct Environment Variables in Netlify

1. **Login to Netlify:**

   - Go to https://app.netlify.com
   - Find your MentorAid site

2. **Navigate to Environment Variables:**

   - Site settings → Environment variables → Edit variables

3. **Set These Variables:**

```env
VITE_API_URL=https://mentoraid-ai-based-student-drop-out.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

**⚠️ IMPORTANT:**

- Make sure `VITE_API_URL` starts with `https://`
- Don't add trailing slash in VITE_API_URL
- Get your Google Client ID from: https://console.cloud.google.com
- Get your Gemini API key from: https://makersuite.google.com/app/apikey

4. **Save and Redeploy:**
   - Click "Save"
   - Go to Deploys tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

### Step 2: Update Backend CORS Settings

Your backend needs to allow requests from your Netlify domain.

1. **Check your Netlify URL** (e.g., `https://your-app.netlify.app`)

2. **Update backend CORS** in `backend/app.py`:

```python
# Current CORS
CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)
```

Make sure `config.py` includes your Netlify domain:

```python
# config.py
CORS_ORIGINS = [
    "http://localhost:5173",
    "https://your-app.netlify.app",  # Add your actual Netlify URL
    "https://mentoraid-ai-based-student-drop-out.onrender.com"
]
```

Then redeploy backend to Render.

### Step 3: Update Google OAuth Settings

1. **Go to Google Cloud Console:**

   - https://console.cloud.google.com
   - APIs & Services → Credentials

2. **Edit OAuth 2.0 Client ID:**

   - Add your Netlify URL to **Authorized JavaScript origins:**
     ```
     https://your-app.netlify.app
     ```
   - Add to **Authorized redirect URIs:**
     ```
     https://your-app.netlify.app
     https://your-app.netlify.app/dashboard
     ```

3. **Save changes**

### Step 4: Verify Backend is Running

1. **Check Render Dashboard:**

   - Go to https://dashboard.render.com
   - Find your backend service
   - Check if it's running (green status)

2. **Test Backend Directly:**

   - Open: `https://mentoraid-ai-based-student-drop-out.onrender.com/api/health`
   - Should return: `{"database":"connected","ml_models":"loaded","status":"healthy"}`

3. **If backend is down:**
   - Click "Manual Deploy" → "Clear build cache & deploy"
   - Check logs for errors

### Step 5: Test the Deployed App

After fixing all above:

1. **Open your Netlify URL**
2. **Check browser console** (F12) for errors
3. **Try logging in** with Google
4. **Try uploading CSV** with `sample_students_with_grades.csv`
5. **Test chatbot** - it should use AI responses, not rule-based

## 🎯 Quick Checklist

- [ ] `VITE_API_URL` starts with `https://` in Netlify
- [ ] `VITE_GEMINI_API_KEY` is set in Netlify
- [ ] `VITE_GOOGLE_CLIENT_ID` is set in Netlify
- [ ] Netlify site redeployed after setting variables
- [ ] Backend CORS includes Netlify domain
- [ ] Google OAuth includes Netlify URLs
- [ ] Backend is running on Render
- [ ] Backend `/api/health` endpoint works

## 🐛 Common Issues

### Issue: "Using rule-based response (no API key)"

**Fix:** Set `VITE_GEMINI_API_KEY` in Netlify and redeploy

### Issue: 404 on API calls

**Fix:** Add `https://` to `VITE_API_URL`

### Issue: 401 Unauthorized

**Fix:** Login with Google OAuth first

### Issue: CORS errors

**Fix:** Update backend CORS to include Netlify domain

### Issue: Google login fails

**Fix:** Add Netlify URL to Google OAuth authorized origins

## 📝 Current Configuration

Your current setup:

- **Frontend:** Netlify
- **Backend:** Render (`https://mentoraid-ai-based-student-drop-out.onrender.com`)
- **Database:** SQLite (fallback from MongoDB)
- **Auth:** Google OAuth + JWT
- **AI:** Google Gemini (needs API key)

## 🔍 Debugging Tips

1. **Check Netlify Build Logs:**

   - Deploys → Latest deploy → Deploy log
   - Look for environment variable issues

2. **Check Browser Console:**

   - F12 → Console tab
   - Look for actual error messages

3. **Check Network Tab:**

   - F12 → Network tab
   - Filter: XHR
   - Click failed requests to see details

4. **Test Locally:**
   - Set `.env` with production backend URL
   - Run `npm run dev`
   - If works locally but not on Netlify = environment variable issue

## 🚀 After Fixes

Once everything is working:

1. **Test all features:**

   - Login with Google
   - Upload CSV
   - View student details
   - Use chatbot
   - Try Risk Predictor

2. **Monitor:**

   - Check Netlify Analytics
   - Check Render logs for backend errors
   - Watch for user feedback

3. **Share the app!** 🎉

## Need Help?

If issues persist:

1. Share the exact error from browser console
2. Check Netlify deploy logs
3. Check Render backend logs
4. Verify all environment variables are set correctly
