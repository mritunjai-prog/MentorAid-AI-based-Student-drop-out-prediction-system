# MentorAid — AI-based Student Dropout Prediction

A concise, shareable overview you can post about the MentorAid project.

---

## Short Project Summary (post-ready)

MentorAid is a lightweight AI-driven platform that helps schools and educators identify students at risk of dropping out. Upload a CSV of student records or use individual risk predictor tools to get instant risk scores, confidence levels, and recommended interventions. MentorAid integrates Google Sign‑In, delivers visual dashboards, and provides a chatbot assistant for quick actions — making early intervention practical and fast.

Use this to identify at-risk students, prioritize outreach, and measure intervention impact.

---

## Real‑time Applications

- Early warning system for schools: spot high-risk students from attendance and grade patterns.
- Bulk batch processing: upload class or school CSVs to predict risk for all students instantly.
- Teacher dashboard: filter by class/department and take targeted action for students who need help.
- Counseling & interventions: provides suggested remediation and records intervention history.
- Admin reporting: aggregated stats and charts to monitor trends and program effectiveness.
- Chatbot assistant: quick navigation, upload triggers, and short how‑to guidance.

---

## How MentorAid Works (step‑by‑step)

1. Frontend: Teacher/Admin logs in using Google Sign‑In (OAuth) on the web app.
2. Upload: User uploads a CSV with student fields (attendance, marks, class, Nationality, fees, etc.) or uses the quick predictor form.
3. API Call: Frontend sends the file to the backend `/api/predict/batch` endpoint with the user token.
4. Preprocessing:
   - The backend loads the CSV with `pandas` and computes derived fields (e.g., `attendance%`, `averageMarks`).
   - Handles known legacy/typo issues (example: `Nationality` → `Nacionality`) so the model receives the expected feature names.
   - Normalizes categorical columns (class, department, feeStatus, etc.) and converts probability dicts into JSON-safe strings for storage.
5. Prediction:
   - The preprocessed features are fed into a trained Random Forest model (scikit‑learn), which returns:
     - `prediction` (binary/label)
     - `confidence` (score)
     - `probabilities` (per-class probability breakdown)
6. Storage:
   - Results and enriched student records are stored in the database (MongoDB preferred; SQLite fallback available for deployments without MongoDB).
   - Probabilities are serialized to JSON strings for SQLite compatibility.
7. Response & UI:
   - API returns the enriched rows including prediction, confidence, probabilities, attendance, averageMarks, feeStatus.
   - Frontend displays the table, charts, and student detail view with recommended interventions.
8. Chatbot & Quick Actions:
   - In-app chatbot can navigate to dashboard, trigger the upload modal programmatically, or open quick risk predictor.
   - If an LLM API key (Gemini) is configured, chatbot will use it for richer responses; otherwise it falls back to rule-based replies.

---

## Technology Stack (complete)

- Frontend

  - React + Vite + TypeScript
  - Styling: Tailwind CSS
  - Components: custom dashboard, file upload (drag/drop), charts
  - Hosting: Netlify
  - Environment variables (frontend):
    - `VITE_API_URL` — backend base URL (e.g. `https://<your-backend>/api`)
    - `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID
    - `VITE_GEMINI_API_KEY` — Google Gemini API key (optional for chatbot)

- Backend

  - Python (3.11+ compatible) with Flask
  - WSGI: Gunicorn for production (Render); Waitress optional for local dev
  - Key libraries:
    - pandas, numpy — data handling
    - scikit‑learn — Random Forest model
    - imbalanced‑learn — SMOTE / balancing utilities used during training
    - joblib — saving/loading model artifacts
    - flask‑jwt‑extended — JWT authentication management
    - flask‑cors — Cross Origin Resource Sharing
    - google‑auth / google-auth-oauthlib — Google OAuth verification
    - pymongo or SQLite (`sqlite3`) — database (MongoDB preferred; SQLite used as fallback)
  - Hosting: Render (web service) or any WSGI host

- Database

  - Primary: MongoDB (recommended for production)
  - Fallback: SQLite (`mentoraid.db`) with migration logic to add missing columns
  - Stored fields include: student attributes, `averageMarks`, `attendance`, `feeStatus`, `prediction`, `confidence`, `probabilities` (JSON string in SQLite)

- Machine Learning Model & Tools

  - Model: Random Forest classifier (scikit‑learn)
  - Training: uses ~47 features (original + engineered). Important features include marks, attendance, fee/payment flags, engagement metrics.
  - Class balancing: SMOTE or similar used during training to handle imbalance
  - Performance: around ~76.6% test accuracy on the trained dataset (example metric — adjust based on retraining)
  - Model artifact saved with `joblib` and loaded by the Flask app at startup

- Authentication

  - Google OAuth: verify tokens server-side (Google token verification) and then issue JWTs
  - Protect endpoints with `@jwt_required` for create/update/predict routes

- Chatbot & AI

  - Rule-based fallback for common commands (navigation, upload instructions, quick actions)
  - Optional integration with Google Gemini (Generative Model) when `VITE_GEMINI_API_KEY` is set — used for richer conversational responses

- DevOps & Deployment
  - Frontend: Netlify (build via `npm run build`, publish `dist`)
  - Backend: Render (or similar), Gunicorn start command `gunicorn app:app` is used in production
  - Environment variables for backend: DB URI, JWT secrets, Google client secrets, etc.
  - CORS: Configure to allow both local dev (`http://localhost:5173`) and production Netlify domain
  - Notes: For Render, make sure production install includes necessary dependencies (don’t rely on a locally installed Waitress unless present in requirements)

---

## ML Pipeline & Data Handling (more detail)

- Feature engineering: compute `averageMarks` from provided grade columns; compute `attendance%` from attendance/absent fields; derive `feeStatus` from tuition/debtor columns.
- Naming compatibility: Preprocessing includes fixes for naming mismatches (e.g., renames `Nationality` → `Nacionality` if model expects it).
- Serialization: Model probabilities (dict) are JSON‑serialized before storing in SQLite to avoid binding errors.
- Retraining: To update the model, re-run training with latest labeled data, retrain with the same preprocessing pipeline, and save a new `joblib` artifact.

---

## Production Caveats & Setup Checklist

- Ensure backend has all required dependencies in `requirements.txt` (scikit‑learn, pandas, flask, gunicorn, pymongo, etc.).
- For Render: use Gunicorn to run `app:app` and avoid using Waitress in production unless installed.
- Ensure DB migrations run or are included to add new columns (class, department, feeStatus, prediction, confidence, probabilities)
- Set Netlify environment variables: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_GEMINI_API_KEY` (if using chatbot LLM)
- Add Netlify URL to Google OAuth client authorized origins & redirect URIs
- Configure CORS in backend to allow Netlify domain

---

## Quick Local Run (developer)

1. Backend

```powershell
# Create & activate virtualenv (example)
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
cd backend
# run dev (Waitress optional)
python app.py
# or run Gunicorn locally for parity: gunicorn app:app
```

2. Frontend

```bash
cd frontend-or-root
npm install
npm run dev
# or build for production
npm run build
```

3. Environment variables (local `.env` or OS env):

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_GEMINI_API_KEY=<your-gemini-api-key>  # optional
JWT_SECRET_KEY=your_jwt_secret
MONGODB_URI=your_db_uri  # optional
```

---

## Why MentorAid Matters (closing pitch)

MentorAid turns everyday student data — grades, attendance, fees, and demographics — into actionable early warnings. It helps teachers and counselors prioritize help, improves retention, and makes data-driven interventions repeatable and measurable. With lightweight deployment options (Netlify + Render) and straightforward CSV uploads, it fits into existing school workflows without heavy infrastructure.

---

If you want, I can:

- Create a shorter social media post (tweet/LinkedIn) version.
- Convert this into a one-page PDF or slide.
- Generate a README for the repo with the same content.

Tell me which format you'd like next.
