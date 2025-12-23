<div align="center">

# 🎓 MentorAid - AI-Powered Student Dropout Prediction System

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)
[![ML Models](https://img.shields.io/badge/ML%20Models-6%20Trained-success.svg)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**An intelligent student risk management platform leveraging Machine Learning to predict student dropouts and enable proactive interventions**

[Demo](#-demo-access) • [Features](#-key-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [ML Models](#-machine-learning-models) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Machine Learning Models](#-machine-learning-models)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Demo Access](#-demo-access)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

**MentorAid** is a comprehensive web application designed to revolutionize student support in educational institutions. By combining cutting-edge machine learning algorithms with an intuitive user interface, MentorAid empowers educators, mentors, and administrators to:

- 🎯 **Identify at-risk students** before they drop out
- 📊 **Make data-driven decisions** with real-time analytics
- 🤝 **Intervene proactively** with personalized support strategies
- 📈 **Track progress** and measure intervention effectiveness

### 🏆 Key Achievements

- ✅ **19 ML Models Trained and Evaluated** (Phase 1, 2, 3)
- ✅ **Best Model: Random Forest + SMOTE - 76.61% Test Accuracy**
- ✅ Trained on **4,424 real student records** (3,539 training + 885 test)
- ✅ Analyzes **47 production features** (28 original + 20 engineered)
- ✅ Implemented feature engineering pipeline with SMOTE balancing
- ✅ Modern, responsive UI with dark mode support and real-time predictions

---

## ✨ Key Features

### 🤖 AI-Powered Predictions

- **Advanced ML Models:** 6 trained models including SVM, Random Forest, Neural Networks, and more
- **Real-Time Risk Assessment:** Instant dropout probability calculations
- **Multi-Factor Analysis:** Evaluates academic, financial, and behavioral indicators
- **Confidence Scoring:** Provides prediction confidence levels for informed decision-making

### 📊 Comprehensive Dashboard

- **Student Overview:** Monitor 150+ students with sortable, filterable tables
- **Risk Visualization:** Interactive charts showing risk distribution
- **Attendance Tracking:** Real-time attendance monitoring with trend analysis
- **Academic Performance:** Grade tracking and performance analytics
- **Financial Monitoring:** Fee status and scholarship tracking

### 🎯 Student Management

- **Individual Profiles:** Detailed student information and history
- **AI Insights:** Personalized risk factors and recommendations
- **Intervention History:** Track all support activities and outcomes
- **Progress Charts:** Visual representation of student improvement
- **Contact Management:** Easy access to student contact information

### 🛠️ Administrative Tools

- **Data Import:** CSV/Excel file upload for bulk student data
- **Export Functionality:** Download reports and analytics
- **Search & Filters:** Advanced filtering by risk level, class, department
- **Role-Based Access:** Separate views for admins, mentors, and teachers
- **Dark/Light Theme:** Customizable UI for user preference

---

## 🔧 Tech Stack

### Frontend

<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="50" height="50"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="50" height="50"/>
  <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="Tailwind" width="50" height="50"/>
  <img src="https://vitejs.dev/logo.svg" alt="Vite" width="50" height="50"/>
</p>

- **React 18.3.1** - Modern UI library
- **TypeScript 5.5.3** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Vite 5.4.2** - Lightning-fast build tool
- **Recharts 3.2.1** - Data visualization
- **Lucide React** - Beautiful icon library
- **React Router 7.9.1** - Client-side routing

### Machine Learning & Data Science

<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="Python" width="50" height="50"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/pandas/pandas-original.svg" alt="Pandas" width="50" height="50"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/numpy/numpy-original.svg" alt="NumPy" width="50" height="50"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" alt="Scikit-learn" width="50" height="50"/>
</p>

- **Python 3.x** - Core ML development
- **scikit-learn** - Machine learning algorithms
- **pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Jupyter Notebooks** - Interactive development

---

## 🤖 Machine Learning Models

### Model Performance Comparison

### Model Performance Comparison

| Model                          | Accuracy | Phase   | Status            | Notes                    |
| ------------------------------ | -------- | ------- | ----------------- | ------------------------ |
| **RF + SMOTE + 20 Features**   | **76.61%** | Phase 2 | ✅ **PRODUCTION** | Best model with engineering |
| Random Forest (Tuned)          | 75.37%   | Phase 2 | ✅ Trained        | Enhanced variant         |
| XGBoost (Tuned)                | 75.25%   | Phase 2 | ✅ Trained        | Gradient boosting        |
| Stacking Ensemble              | 74.92%   | Phase 2 | ✅ Trained        | Ensemble approach        |
| LightGBM                       | 74.80%   | Phase 2 | ✅ Trained        | Fast gradient boosting   |
| Random Forest (Baseline)       | 75.14%   | Phase 1 | ✅ Trained        | Baseline performance     |
| Gradient Boosting              | 75.14%   | Phase 1 | ✅ Trained        | Baseline performance     |
| AdaBoost                       | 74.80%   | Phase 1 | ✅ Trained        | Baseline                 |
| Extra Trees                    | 74.12%   | Phase 1 | ✅ Trained        | Baseline                 |
| Logistic Regression            | 73.90%   | Phase 1 | ✅ Trained        | Linear model             |
| Decision Tree                  | 71.64%   | Phase 1 | ✅ Trained        | Simple baseline          |
| Neural Networks                | 72-75%   | DL      | ⚠️  Not optimal   | Overfitting on small data |
| K-Nearest Neighbors            | 69.27%   | Phase 1 | ✅ Trained        | Distance-based           |
| Support Vector Machine         | 68.36%   | Phase 1 | ✅ Trained        | Baseline                 |
| Naive Bayes                    | 62.82%   | Phase 1 | ✅ Trained        | Probabilistic baseline   |

### 📊 Dataset Overview

- **Total Records:** 4,424 students
- **Training Set:** 3,539 samples → 5,301 after SMOTE balancing
- **Test Set:** 885 samples
- **Original Features:** 28 attributes
- **Engineered Features:** 20 additional features (+1.47% accuracy)
- **Production Features:** 47 total features (7 dropped due to low correlation)
- **Target Classes:** Dropout (32%), Enrolled (18%), Graduate (50%)
- **Data Quality:** Cleaned, outlier-removed, normalized, class-balanced with SMOTE

### 🎯 Key Findings

**Model Selection Process:**
- Evaluated 19 different models across 3 optimization phases
- Best baseline: Random Forest at 75.14%
- Added feature engineering (+1.47% boost to 76.61%)
- Optimization attempts (Phase 3) led to overfitting
- **Final choice:** Simpler model with engineered features outperforms complex tuning

**Feature Engineering Impact:**
- 20 engineered features created from original 28
- 6 of top 10 most important features are engineered
- Reduced to 47 production features (removed low-correlation features)
- Feature engineering strategy proved more effective than hyperparameter tuning

### 📁 Available Models

```
ml-models/trained-models/
├── random_forest_model.pkl      # PRODUCTION MODEL (76.61% accuracy)
├── scaler.pkl                   # Feature scaling
├── label_encoder.pkl            # Class encoding
├── feature_names.pkl            # 47 production features
├── model_metadata.json          # Model configuration
├── feature_importance.csv       # Top features ranking
└── model_performance.png        # Performance visualization
```

---

## 📂 Project Structure

```
MentorAid/
├── 📱 src/                          # Frontend source code
│   ├── 📄 App.tsx                   # Main application component
│   ├── 📄 main.tsx                  # Entry point
│   ├── 📁 components/               # Reusable UI components
│   │   ├── dashboard/               # Dashboard-specific components
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── StudentTable.tsx
│   │   │   ├── ChartsSection.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── student/                 # Student detail components
│   │   │   ├── AIInsights.tsx
│   │   │   ├── InterventionHistory.tsx
│   │   │   ├── StudentMetrics.tsx
│   │   │   └── ProgressChart.tsx
│   │   └── ui/                      # Common UI elements
│   │       ├── AnimatedLoader.tsx
│   │       ├── AnimatedThemeToggle.tsx
│   │       └── Toaster.tsx
│   ├── 📁 pages/                    # Route pages
│   │   ├── Introduction.tsx         # Landing page
│   │   ├── Login.tsx                # Authentication
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   └── StudentDetails.tsx       # Student profile
│   ├── 📁 contexts/                 # React contexts
│   │   ├── AuthContext.tsx          # Authentication state
│   │   └── ThemeContext.tsx         # Theme management
│   ├── 📁 data/                     # Data utilities
│   │   └── mockData.ts              # Mock data generator
│   └── 📁 types/                    # TypeScript definitions
│       └── student.ts               # Student interface
│
├── 🤖 ml-models/                    # Machine Learning
│   ├── 📓 notebooks/                # Jupyter notebooks
│   │   ├── hyperparameter_tuning.ipynb
│   │   ├── real_time_prediction_demo.ipynb
│   │   └── student_predictions.ipynb
│   ├── 💾 trained-models/           # Saved ML models
│   │   ├── svm_tuned_model.pkl
│   │   ├── feature_names.pkl
│   │   └── ... (other models)
│   └── 📊 datasets/                 # Training data
│       └── dataset.csv              # 4,426 student records
│
├── 📄 package.json                  # Dependencies
├── 📄 vite.config.ts                # Vite configuration
├── 📄 tailwind.config.js            # Tailwind configuration
├── 📄 tsconfig.json                 # TypeScript configuration
└── 📄 README.md                     # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0.0 or higher (comes with Node.js)
- **Python** 3.8+ (for ML model development)
- **Git** ([Download](https://git-scm.com/))

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/mritunjai-prog/MentorAid---AI-based-Student-drop-out-prediction-system.git
cd MentorAid---AI-based-Student-drop-out-prediction-system
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Open in browser**

Navigate to [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

### ML Model Setup (Optional)

To work with ML models:

```bash
cd ml-models/notebooks
pip install pandas numpy scikit-learn jupyter matplotlib seaborn
jupyter notebook
```

---

## 💻 Usage

### Starting the Application

```bash
npm run dev
```

### Development Commands

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

### Environment Variables (Future)

Create a `.env` file for production:

```env
VITE_API_URL=your_backend_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

---

## 🔐 Demo Access

### Test Credentials

Use **any email/password** combination to access the demo:

| Role    | Email                | Password       |
| ------- | -------------------- | -------------- |
| Admin   | `admin@school.edu`   | `any password` |
| Mentor  | `mentor@school.edu`  | `any password` |
| Teacher | `teacher@school.edu` | `any password` |

### Demo Features

- ✅ Browse 150+ mock student profiles
- ✅ Filter by risk level, class, department
- ✅ View detailed student analytics
- ✅ Explore AI insights and recommendations
- ✅ Test dark/light theme toggle
- ✅ Export data to CSV

---

## 📸 Screenshots

### Dashboard Overview

_Coming soon - Main dashboard with student risk visualization_

### Student Profile

_Coming soon - Detailed student information and AI insights_

### Prediction Interface

_Coming soon - Real-time risk prediction form_

---

## 🗺️ Roadmap

### ✅ Completed

- [x] React frontend with TypeScript
- [x] 6 ML models trained (SVM 99.50% accuracy)
- [x] Interactive dashboard with 150+ students
- [x] Student detail pages with insights
- [x] Dark/light theme support
- [x] Mock authentication system
- [x] Responsive design (mobile-friendly)

### 🚧 In Progress

- [ ] **Risk Predictor Page** - Manual data entry for real-time predictions
- [ ] Python backend (Flask/FastAPI)
- [ ] REST API for ML model integration
- [ ] Supabase database integration

### 🔮 Future Enhancements

- [ ] Real authentication (JWT tokens)
- [ ] Live ML predictions via API
- [ ] CSV upload with batch predictions
- [ ] Email notifications for high-risk students
- [ ] Intervention planning tools
- [ ] Progress tracking over time
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Sentiment analysis from student feedback
- [ ] Gamified mentor dashboard
- [ ] Integration with LMS platforms

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Mritunjai** - [GitHub Profile](https://github.com/mritunjai-prog)

---

## 🙏 Acknowledgments

- Dataset source: [UCI Machine Learning Repository](https://archive.ics.uci.edu/)
- Icons: [Lucide Icons](https://lucide.dev/)
- UI Inspiration: Modern educational platforms
- ML Tutorials: scikit-learn documentation

---

## 📞 Contact

- **GitHub Issues:** [Report a bug](https://github.com/mritunjai-prog/MentorAid---AI-based-Student-drop-out-prediction-system/issues)
- **Email:** Available via GitHub profile
- **LinkedIn:** Connect on LinkedIn

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/mritunjai-prog/MentorAid---AI-based-Student-drop-out-prediction-system)
![GitHub stars](https://img.shields.io/github/stars/mritunjai-prog/MentorAid---AI-based-Student-drop-out-prediction-system?style=social)
![GitHub forks](https://img.shields.io/github/forks/mritunjai-prog/MentorAid---AI-based-Student-drop-out-prediction-system?style=social)

---

<div align="center">

### 🌟 Star this repository if you found it helpful!

**Built with ❤️ to help students succeed**

[⬆ Back to top](#-mentoraid---ai-powered-student-dropout-prediction-system)

</div>
