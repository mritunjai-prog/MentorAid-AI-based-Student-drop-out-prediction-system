"""
MentorAid Flask Backend API with MongoDB and Google OAuth
Handles student dropout prediction requests with authentication
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
import pandas as pd
import numpy as np
import joblib
from pathlib import Path
import traceback
import logging
from datetime import datetime

# Import our modules
from config import Config
from auth import verify_google_token, token_required

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize JWT
jwt = JWTManager(app)

# Initialize CORS
CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)

# Initialize Database with fallback to SQLite
db = None
UserModel = None
PredictionModel = None
StudentModel = None
InterventionModel = None

try:
    # Try MongoDB first
    from database import (
        Database as MongoDatabase,
        UserModel as MongoUserModel,
        PredictionModel as MongoPredictionModel,
        StudentModel as MongoStudentModel,
        InterventionModel as MongoInterventionModel,
    )
    db = MongoDatabase(Config.MONGODB_URI, Config.MONGODB_DB_NAME)
    if db.client is not None:
        UserModel = MongoUserModel
        PredictionModel = MongoPredictionModel
        StudentModel = MongoStudentModel
        InterventionModel = MongoInterventionModel
        user_model = UserModel(db)
        prediction_model = PredictionModel(db)
        student_model = StudentModel(db)
        intervention_model = InterventionModel(db)
        logger.info("✅ MongoDB connected and models initialized")
    else:
        raise Exception("MongoDB client is None")
except Exception as mongo_error:
    logger.warning(f"⚠️ MongoDB failed: {mongo_error}")
    logger.info("🔄 Falling back to SQLite database...")
    try:
        from database_sqlite import (
            Database as SQLiteDatabase,
            UserModel as SQLiteUserModel,
            PredictionModel as SQLitePredictionModel,
            StudentModel as SQLiteStudentModel,
            InterventionModel as SQLiteInterventionModel,
        )
        db = SQLiteDatabase()
        UserModel = SQLiteUserModel
        PredictionModel = SQLitePredictionModel
        StudentModel = SQLiteStudentModel
        InterventionModel = SQLiteInterventionModel
        user_model = UserModel(db)
        prediction_model = PredictionModel(db)
        student_model = StudentModel(db)
        intervention_model = InterventionModel(db)
        logger.info("✅ SQLite database connected and models initialized")
    except Exception as sqlite_error:
        logger.error(f"❌ SQLite initialization also failed: {sqlite_error}")
        logger.error(traceback.format_exc())
        db = None
        user_model = None
        prediction_model = None
        student_model = None
        intervention_model = None

# Load ML model artifacts
MODEL_DIR = Path(__file__).parent.parent / "ml-models" / "trained_models"

try:
    model = joblib.load(MODEL_DIR / "random_forest_model.pkl")
    scaler = joblib.load(MODEL_DIR / "scaler.pkl")
    label_encoder = joblib.load(MODEL_DIR / "label_encoder.pkl")
    feature_names = joblib.load(MODEL_DIR / "feature_names.pkl")
    logger.info("✅ Model artifacts loaded successfully")
except Exception as e:
    logger.error(f"❌ Error loading model artifacts: {e}")
    model = None


# ==================== FEATURE ENGINEERING ====================
def engineer_features(df):
    """Create 20 engineered features from raw student data"""
    # Academic Performance
    df["avg_approved"] = (
        df["Curricular units 1st sem (approved)"]
        + df["Curricular units 2nd sem (approved)"]
    ) / 2
    df["avg_grade"] = (
        df["Curricular units 1st sem (grade)"] + df["Curricular units 2nd sem (grade)"]
    ) / 2
    df["total_approved"] = (
        df["Curricular units 1st sem (approved)"]
        + df["Curricular units 2nd sem (approved)"]
    )
    df["total_evaluations"] = (
        df["Curricular units 1st sem (evaluations)"]
        + df["Curricular units 2nd sem (evaluations)"]
    )
    df["grade_consistency"] = abs(
        df["Curricular units 1st sem (grade)"] - df["Curricular units 2nd sem (grade)"]
    )
    df["grade_improvement"] = (
        df["Curricular units 2nd sem (grade)"] - df["Curricular units 1st sem (grade)"]
    )

    # Failure Metrics
    df["failure_rate_sem1"] = np.where(
        df["Curricular units 1st sem (evaluations)"] > 0,
        (
            df["Curricular units 1st sem (evaluations)"]
            - df["Curricular units 1st sem (approved)"]
        )
        / df["Curricular units 1st sem (evaluations)"],
        0,
    )
    df["failure_rate_sem2"] = np.where(
        df["Curricular units 2nd sem (evaluations)"] > 0,
        (
            df["Curricular units 2nd sem (evaluations)"]
            - df["Curricular units 2nd sem (approved)"]
        )
        / df["Curricular units 2nd sem (evaluations)"],
        0,
    )
    df["total_failure_rate"] = (df["failure_rate_sem1"] + df["failure_rate_sem2"]) / 2

    # Completion Metrics
    df["completion_rate"] = np.where(
        df["total_evaluations"] > 0, df["total_approved"] / df["total_evaluations"], 0
    )

    # Financial Stability
    df["financial_stability"] = (
        df["Tuition fees up to date"] + df["Scholarship holder"] - df["Debtor"]
    ).clip(0, 3)

    # Parent Education
    df["parent_education_avg"] = (
        df["Mother's qualification"] + df["Father's qualification"]
    ) / 2
    df["parent_education_max"] = df[
        ["Mother's qualification", "Father's qualification"]
    ].max(axis=1)

    # Age Categories
    df["is_mature_student"] = (df["Age at enrollment"] >= 25).astype(int)
    df["is_traditional_age"] = (
        (df["Age at enrollment"] >= 18) & (df["Age at enrollment"] <= 22)
    ).astype(int)

    # Risk Indicators
    df["has_sem1_failures"] = (
        df["Curricular units 1st sem (approved)"]
        < df["Curricular units 1st sem (evaluations)"]
    ).astype(int)
    df["has_sem2_failures"] = (
        df["Curricular units 2nd sem (approved)"]
        < df["Curricular units 2nd sem (evaluations)"]
    ).astype(int)
    df["both_sems_failures"] = (
        df["has_sem1_failures"] & df["has_sem2_failures"]
    ).astype(int)

    # Performance Categories
    df["high_performer"] = (df["avg_grade"] >= 14).astype(int)
    df["low_performer"] = (df["avg_grade"] < 10).astype(int)

    return df


def preprocess_data(df):
    """Preprocess student data for prediction"""
    df = engineer_features(df)

    # Drop non-predictive features
    features_to_drop = [
        "Application mode",
        "Application order",
        "Course",
        "Daytime/evening attendance",
        "Unemployment rate",
        "Inflation rate",
        "GDP",
    ]
    df = df.drop(columns=features_to_drop, errors="ignore")

    # Ensure correct feature order
    df = df[feature_names]

    # Scale features
    df_scaled = scaler.transform(df)
    return df_scaled


# ==================== AUTHENTICATION ENDPOINTS ====================
@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    """Authenticate user with Google OAuth token"""
    if not db:
        return jsonify({"error": "Database not available"}), 503

    try:
        data = request.get_json()
        token = data.get("token")

        if not token:
            return jsonify({"error": "Token is required"}), 400

        # Verify Google token
        user_info = verify_google_token(token, Config.GOOGLE_CLIENT_ID)

        if not user_info:
            return jsonify({"error": "Invalid Google token"}), 401

        # Check if user exists
        user = user_model.find_by_google_id(user_info["google_id"])

        if not user:
            # Create new user
            user = user_model.create_user(
                email=user_info["email"],
                name=user_info["name"],
                google_id=user_info["google_id"],
                picture=user_info["picture"],
            )
            logger.info(f"New user created: {user['email']}")
        else:
            # Update last login
            user_model.update_last_login(user["email"])
            logger.info(f"User logged in: {user['email']}")

        # Create JWT tokens
        access_token = create_access_token(identity=str(user["_id"]))
        refresh_token = create_refresh_token(identity=str(user["_id"]))

        return jsonify(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "id": str(user["_id"]),
                    "email": user["email"],
                    "name": user["name"],
                    "picture": user.get("picture"),
                    "role": user.get("role", "counselor"),
                },
            }
        )

    except Exception as e:
        logger.error(f"Google auth error: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Authentication failed", "details": str(e)}), 500

    except Exception as e:
        logger.error(f"Google auth error: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Authentication failed", "message": str(e)}), 500


@app.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": access_token})


@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Get current user info"""
    user_id = get_jwt_identity()
    user = user_model.find_by_id(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(
        {
            "id": user["_id"],
            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture"),
            "role": user.get("role", "counselor"),
        }
    )


# ==================== ML PREDICTION ENDPOINTS ====================


@app.route("/api/model/info", methods=["GET"])
def model_info():
    """Get model metadata"""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    return jsonify(
        {
            "model_name": "Random Forest + SMOTE + 20 Engineered Features",
            "accuracy": 0.7661,
            "n_features": len(feature_names),
            "target_classes": label_encoder.classes_.tolist(),
            "features": feature_names,
        }
    )


@app.route("/api/predict", methods=["POST"])
@jwt_required()
def predict_single():
    """Predict outcome for a single student (requires authentication)"""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Convert to DataFrame
        df = pd.DataFrame([data])

        # Preprocess and predict
        X = preprocess_data(df)
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]

        # Decode prediction
        predicted_class = label_encoder.inverse_transform([prediction])[0]
        class_probabilities = {
            cls: float(prob) for cls, prob in zip(label_encoder.classes_, probabilities)
        }

        risk_level = (
            "High"
            if predicted_class == "Dropout"
            else "Medium" if predicted_class == "Enrolled" else "Low"
        )

        result = {
            "prediction": predicted_class,
            "probabilities": class_probabilities,
            "confidence": float(max(probabilities)),
            "risk_level": risk_level,
        }

        # Save prediction to database
        if db:
            prediction_model.save_prediction(
                user_id=user_id,
                student_data=data,
                prediction=predicted_class,
                confidence=float(max(probabilities)),
                probabilities=class_probabilities,
                risk_level=risk_level,
            )

        return jsonify(result)

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 400


@app.route("/api/predict/batch", methods=["POST"])
@jwt_required()
def predict_batch():
    """Predict outcomes for multiple students (requires authentication)"""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        user_id = get_jwt_identity()

        # Check if file upload
        if "file" in request.files:
            file = request.files["file"]
            df = pd.read_csv(file)
        else:
            data = request.get_json()
            df = pd.DataFrame(data)

        logger.info(f"Received {len(df)} students for prediction")

        # Keep student ID if present
        has_id = "student_id" in df.columns or "Student ID" in df.columns
        if has_id:
            student_ids = df.get("student_id", df.get("Student ID")).tolist()

        # Preprocess and predict
        X = preprocess_data(df.copy())
        predictions = model.predict(X)
        probabilities = model.predict_proba(X)
        predicted_classes = label_encoder.inverse_transform(predictions)

        # Build results
        results = []
        for i, (pred_class, probs) in enumerate(zip(predicted_classes, probabilities)):
            result = {
                "prediction": pred_class,
                "confidence": float(max(probs)),
                "probabilities": {
                    cls: float(prob) for cls, prob in zip(label_encoder.classes_, probs)
                },
                "risk_level": (
                    "High"
                    if pred_class == "Dropout"
                    else "Medium" if pred_class == "Enrolled" else "Low"
                ),
            }

            if has_id:
                result["student_id"] = student_ids[i]

            results.append(result)

        # Save batch predictions and students to database
        if db:
            prediction_model.save_batch_predictions(user_id, results)

            # Save students with predictions
            for i, result in enumerate(results):
                row = df.iloc[i]

                # Calculate attendance and average marks from CSV data
                # Get curricular units data
                sem1_approved = row.get("Curricular units 1st sem (approved)", 0)
                sem1_enrolled = row.get("Curricular units 1st sem (enrolled)", 1)
                sem2_approved = row.get("Curricular units 2nd sem (approved)", 0)
                sem2_enrolled = row.get("Curricular units 2nd sem (enrolled)", 1)

                # Calculate attendance as approval rate
                total_approved = sem1_approved + sem2_approved
                total_enrolled = sem1_enrolled + sem2_enrolled
                attendance = round(
                    (
                        (total_approved / total_enrolled * 100)
                        if total_enrolled > 0
                        else 0
                    ),
                    1,
                )

                # Get average grades
                sem1_grade = row.get("Curricular units 1st sem (grade)", 0)
                sem2_grade = row.get("Curricular units 2nd sem (grade)", 0)
                avg_marks = round((sem1_grade + sem2_grade) / 2, 1)

                student_data = {
                    "student_id": result.get("student_id", f"STU{str(i+1).zfill(5)}"),
                    "name": row.get("Name", f"Student {i+1}"),
                    "email": row.get("Email", f"student{i+1}@university.edu"),
                    "attendance": attendance,
                    "averageMarks": avg_marks,
                    "class": "N/A",
                    "department": "General",
                    "feeStatus": row.get("Tuition fees up to date", 1) == 1
                    and row.get("Debtor", 0) == 0
                    and "paid"
                    or "pending",
                    "prediction": result["prediction"],
                    "risk_level": result["risk_level"],
                    "confidence": result["confidence"],
                    "probabilities": result["probabilities"],
                }
                mongo_id = student_model.create_or_update_student(student_data)
                # Add MongoDB ID to result
                result["_id"] = str(mongo_id)

        # Calculate summary statistics
        dropout_count = sum(1 for r in results if r["prediction"] == "Dropout")
        enrolled_count = sum(1 for r in results if r["prediction"] == "Enrolled")
        graduate_count = sum(1 for r in results if r["prediction"] == "Graduate")

        return jsonify(
            {
                "predictions": results,
                "summary": {
                    "total": len(results),
                    "dropout": dropout_count,
                    "enrolled": enrolled_count,
                    "graduate": graduate_count,
                    "dropout_percentage": round(dropout_count / len(results) * 100, 2),
                    "at_risk_percentage": round(
                        (dropout_count + enrolled_count) / len(results) * 100, 2
                    ),
                },
            }
        )

    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 400


# ==================== STUDENT MANAGEMENT ENDPOINTS ====================
@app.route("/api/students", methods=["GET"])
@jwt_required()
def get_students():
    """Get all students"""
    if not db:
        return jsonify({"error": "Database not connected"}), 500

    try:
        students = student_model.get_all_students()
        return jsonify({"students": students, "count": len(students)})
    except Exception as e:
        logger.error(f"Error fetching students: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/students/<student_id>", methods=["GET"])
@jwt_required()
def get_student(student_id):
    """Get student by ID"""
    if not db:
        return jsonify({"error": "Database not connected"}), 500

    try:
        student = student_model.get_student(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        return jsonify(student)
    except Exception as e:
        logger.error(f"Error fetching student: {e}")
        return jsonify({"error": str(e)}), 500


# ==================== INTERVENTION ENDPOINTS ====================
@app.route("/api/interventions/<student_id>", methods=["GET"])
@jwt_required()
def get_interventions(student_id):
    """Get interventions for a student"""
    if not db:
        return jsonify({"error": "Database not connected"}), 500

    try:
        interventions = intervention_model.get_student_interventions(student_id)
        return jsonify({"interventions": interventions, "count": len(interventions)})
    except Exception as e:
        logger.error(f"Error fetching interventions: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/interventions", methods=["POST"])
@jwt_required()
def create_intervention():
    """Create new intervention"""
    if not db:
        return jsonify({"error": "Database not connected"}), 500

    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        intervention = intervention_model.create_intervention(
            student_id=data["student_id"],
            user_id=user_id,
            intervention_type=data["type"],
            description=data["description"],
            outcome=data.get("outcome"),
        )

        return jsonify(intervention), 201
    except Exception as e:
        logger.error(f"Error creating intervention: {e}")
        return jsonify({"error": str(e)}), 400


# ==================== ROOT & HEALTH ENDPOINTS ====================
@app.route("/", methods=["GET"])
def root():
    """Root endpoint"""
    return jsonify(
        {"message": "MentorAid API is running", "version": "1.0.0", "status": "healthy"}
    )


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify(
        {
            "status": "healthy",
            "database": "connected" if db else "disconnected",
            "ml_models": (
                "loaded" if model and scaler and label_encoder else "not_loaded"
            ),
        }
    )


# ==================== STATS ENDPOINTS ====================
@app.route("/api/stats/predictions", methods=["GET"])
@jwt_required()
def get_prediction_stats():
    """Get prediction statistics"""
    if not db:
        return jsonify({"error": "Database not connected"}), 500

    try:
        user_id = get_jwt_identity()
        stats = prediction_model.get_prediction_stats(user_id)
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/analyze", methods=["POST"])
@jwt_required()
def analyze_features():
    """Analyze feature importance"""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        feature_importance = pd.DataFrame(
            {"feature": feature_names, "importance": model.feature_importances_}
        ).sort_values("importance", ascending=False)

        top_features = feature_importance.head(20).to_dict("records")

        return jsonify(
            {
                "top_features": top_features,
                "message": "Top 20 features influencing predictions globally",
            }
        )

    except Exception as e:
        logger.error(f"Analysis error: {e}")
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    print("=" * 70)
    print("  MentorAid Flask Backend API with MongoDB & Google OAuth")
    print("=" * 70)
    print("\n🚀 Starting server on http://localhost:5000")
    print("\n📌 Authentication Endpoints:")
    print("   POST /api/auth/google       - Google OAuth login")
    print("   POST /api/auth/refresh      - Refresh access token")
    print("   GET  /api/auth/me           - Get current user")
    print("\n📌 ML Prediction Endpoints (Protected):")
    print("   GET  /api/health            - Health check")
    print("   GET  /api/model/info        - Model metadata")
    print("   POST /api/predict           - Single prediction")
    print("   POST /api/predict/batch     - Batch predictions")
    print("   POST /api/analyze           - Feature importance")
    print("\n📌 Student Management (Protected):")
    print("   GET  /api/students          - Get all students")
    print("   GET  /api/students/<id>     - Get student by ID")
    print("\n📌 Interventions (Protected):")
    print("   GET  /api/interventions/<id> - Get student interventions")
    print("   POST /api/interventions      - Create intervention")
    print("\n" + "=" * 70)

    app.run(debug=Config.DEBUG, host="0.0.0.0", port=5000)
