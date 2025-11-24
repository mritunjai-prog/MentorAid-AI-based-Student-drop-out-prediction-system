# MentorAid - Complete Setup & Run Guide

## 🚀 Quick Start

### Prerequisites

- Python 3.10+ installed
- Node.js 18+ installed
- Git installed

### Setup Instructions

#### 1. Backend Setup (Flask API)

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

Backend will start on **http://localhost:5000**

#### 2. Frontend Setup (React + Vite)

```powershell
# Navigate to project root
cd ..

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start on **http://localhost:5173**

---

## 📊 ML Model Information

**Model:** Random Forest + SMOTE + 20 Engineered Features  
**Accuracy:** 76.61% (test set)  
**Training Data:** 4,424 students  
**Features:** 47 total (28 original + 20 engineered)

### Predictions

- **Dropout** (High Risk) - Student likely to drop out
- **Enrolled** (Medium Risk) - Student needs monitoring
- **Graduate** (Low Risk) - Student on track to graduate

---

## 🔄 Testing the Integration

### Step 1: Start Backend

```powershell
cd backend
.\venv\Scripts\activate
python app.py
```

### Step 2: Start Frontend (in new terminal)

```powershell
npm run dev
```

### Step 3: Test Prediction

1. Open browser: http://localhost:5173
2. Login with demo credentials
3. Click "Upload Data" button
4. Upload `sample_students.csv`
5. View predictions in dashboard

---

## 📁 Project Structure

```
MentorAid-main/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── requirements.txt       # Python dependencies
│   └── venv/                  # Virtual environment
│
├── ml-models/
│   ├── trained_models/        # Best model (76.61%)
│   │   ├── random_forest_model.pkl
│   │   ├── scaler.pkl
│   │   ├── label_encoder.pkl
│   │   ├── feature_names.pkl
│   │   └── model_metadata.json
│   ├── train_final_model.py   # Training script
│   └── datasets/              # Training data
│
├── src/
│   ├── components/
│   │   └── dashboard/
│   │       ├── FileUpload.tsx      # CSV upload component
│   │       ├── StudentTable.tsx    # Predictions display
│   │       └── DashboardStats.tsx  # Statistics
│   └── pages/
│       └── Dashboard.tsx      # Main dashboard
│
├── sample_students.csv        # Test data (5 students)
├── MentorAid_ML_Documentation.docx  # Complete ML docs
└── README.md                  # This file
```

---

## 🔌 API Endpoints

### GET /api/health

Health check

**Response:**

```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### GET /api/model/info

Model metadata

**Response:**

```json
{
  "model_name": "Random Forest + SMOTE + 20 Engineered Features",
  "accuracy": 0.7661,
  "n_features": 47
}
```

### POST /api/predict/batch

Batch prediction (CSV upload)

**Request:** multipart/form-data with CSV file

**Response:**

```json
{
  "predictions": [
    {
      "prediction": "Graduate",
      "confidence": 0.85,
      "risk_level": "Low",
      "probabilities": {
        "Dropout": 0.1,
        "Enrolled": 0.05,
        "Graduate": 0.85
      }
    }
  ],
  "summary": {
    "total": 5,
    "dropout": 1,
    "enrolled": 1,
    "graduate": 3,
    "dropout_percentage": 20.0
  }
}
```

---

## 📈 Model Performance

| Metric             | Value  |
| ------------------ | ------ |
| Overall Accuracy   | 76.61% |
| Graduate Precision | 0.84   |
| Graduate Recall    | 0.86   |
| Dropout Precision  | 0.84   |
| Dropout Recall     | 0.72   |
| Enrolled Precision | 0.49   |
| Enrolled Recall    | 0.58   |

**Top 5 Features:**

1. Curricular units 2nd sem (approved) - 7.18%
2. completion_rate (engineered) - 6.49%
3. total_approved (engineered) - 6.27%
4. avg_approved (engineered) - 5.90%
5. total_failure_rate (engineered) - 4.99%

---

## 🛠️ Troubleshooting

### Backend Issues

**Error: "Model not loaded"**

```powershell
# Re-train the model
cd ml-models
python train_final_model.py
```

**Error: "Module not found"**

```powershell
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Error: "CORS Error"**

- Ensure Flask backend is running
- Check API_URL in FileUpload.tsx points to http://localhost:5000

**Error: "Failed to fetch"**

```powershell
# Test backend health
curl http://localhost:5000/api/health
```

---

## 📝 CSV File Format

Required columns (28 original features):

- Marital status
- Age at enrollment
- Mother's qualification
- Father's qualification
- Mother's occupation
- Father's occupation
- Admission grade
- Displaced
- Educational special needs
- Debtor
- Tuition fees up to date
- Gender
- Scholarship holder
- International
- Curricular units 1st sem (credited, enrolled, evaluations, approved, grade, without evaluations)
- Curricular units 2nd sem (credited, enrolled, evaluations, approved, grade, without evaluations)
- Previous qualification
- Nacionality

**Note:** The model automatically creates 20 engineered features from these inputs.

---

## 📚 Documentation

See **MentorAid_ML_Documentation.docx** for:

- Complete model training journey (19 models)
- Feature engineering details
- Strengths & weaknesses analysis
- Production deployment guide
- Future improvement recommendations

---

## 🎯 Next Steps

1. **Production Deployment:**

   - Deploy Flask backend to cloud (AWS/Azure/GCP)
   - Deploy React frontend to Vercel/Netlify
   - Set up HTTPS and authentication

2. **Model Improvements:**

   - Collect more student data (target 10,000+ students)
   - Add temporal features (semester progression)
   - Implement SHAP for explainability

3. **Feature Enhancements:**
   - Real-time intervention alerts
   - Email notifications for high-risk students
   - Advanced analytics dashboard
   - Student progress tracking over time

---

## 👥 Support

For issues or questions:

1. Check `MentorAid_ML_Documentation.docx`
2. Review backend logs: `backend/app.log`
3. Check browser console for frontend errors

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ using Flask, React, and scikit-learn**
