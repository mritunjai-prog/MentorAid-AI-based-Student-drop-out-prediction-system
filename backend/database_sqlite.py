"""
SQLite Database Connection and Models - Fallback for Render
"""

import sqlite3
import json
from datetime import datetime
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class Database:
    """SQLite Database Manager"""

    def __init__(self, db_path="mentoraid.db"):
        try:
            self.db_path = db_path
            self.conn = sqlite3.connect(db_path, check_same_thread=False)
            self.conn.row_factory = sqlite3.Row
            self._create_tables()
            logger.info(f"✅ Connected to SQLite database: {db_path}")
        except Exception as e:
            logger.error(f"❌ SQLite connection failed: {e}")
            self.conn = None

    def _create_tables(self):
        """Create necessary tables"""
        cursor = self.conn.cursor()

        # Users table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                picture TEXT,
                google_id TEXT UNIQUE,
                created_at TEXT,
                last_login TEXT
            )
        """
        )

        # Students table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                student_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                attendance REAL,
                marks REAL,
                extracurricular_score REAL,
                socioeconomic_status TEXT,
                family_support TEXT,
                mental_health_score REAL,
                previous_failures INTEGER,
                study_hours REAL,
                peer_influence TEXT,
                risk_score REAL,
                risk_level TEXT,
                uploaded_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """
        )

        # Predictions table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS predictions (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                student_id TEXT,
                prediction INTEGER,
                probability REAL,
                risk_level TEXT,
                top_features TEXT,
                created_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """
        )

        # Interventions table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS interventions (
                id TEXT PRIMARY KEY,
                student_id TEXT,
                intervention_type TEXT,
                description TEXT,
                status TEXT,
                created_at TEXT,
                updated_at TEXT,
                FOREIGN KEY (student_id) REFERENCES students (id)
            )
        """
        )

        self.conn.commit()

    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()


class UserModel:
    """User model for authentication"""

    def __init__(self, db: Database):
        self.db = db

    def create_user(self, user_data):
        """Create a new user"""
        from uuid import uuid4

        user_id = str(uuid4())
        cursor = self.db.conn.cursor()

        cursor.execute(
            """
            INSERT OR REPLACE INTO users (id, email, name, picture, google_id, created_at, last_login)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
            (
                user_id,
                user_data.get("email"),
                user_data.get("name"),
                user_data.get("picture"),
                user_data.get("google_id"),
                datetime.utcnow().isoformat(),
                datetime.utcnow().isoformat(),
            ),
        )

        self.db.conn.commit()
        return self.find_by_email(user_data.get("email"))

    def find_by_email(self, email):
        """Find user by email"""
        cursor = self.db.conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()

        if row:
            return dict(row)
        return None

    def find_by_google_id(self, google_id):
        """Find user by Google ID"""
        cursor = self.db.conn.cursor()
        cursor.execute("SELECT * FROM users WHERE google_id = ?", (google_id,))
        row = cursor.fetchone()

        if row:
            return dict(row)
        return None

    def find_by_id(self, user_id):
        """Find user by ID"""
        cursor = self.db.conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()

        if row:
            return dict(row)
        return None

    def update_last_login(self, user_id):
        """Update user's last login timestamp"""
        cursor = self.db.conn.cursor()
        cursor.execute(
            "UPDATE users SET last_login = ? WHERE id = ?",
            (datetime.utcnow().isoformat(), user_id),
        )
        self.db.conn.commit()


class StudentModel:
    """Student model for managing student data"""

    def __init__(self, db: Database):
        self.db = db

    def create_student(self, student_data):
        """Create a new student"""
        from uuid import uuid4

        student_id = str(uuid4())
        cursor = self.db.conn.cursor()

        cursor.execute(
            """
            INSERT INTO students (
                id, user_id, student_id, name, email, phone,
                attendance, marks, extracurricular_score, socioeconomic_status,
                family_support, mental_health_score, previous_failures,
                study_hours, peer_influence, risk_score, risk_level, uploaded_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                student_id,
                student_data.get("user_id"),
                student_data.get("student_id"),
                student_data.get("name"),
                student_data.get("email"),
                student_data.get("phone"),
                student_data.get("attendance"),
                student_data.get("marks"),
                student_data.get("extracurricular_score"),
                student_data.get("socioeconomic_status"),
                student_data.get("family_support"),
                student_data.get("mental_health_score"),
                student_data.get("previous_failures"),
                student_data.get("study_hours"),
                student_data.get("peer_influence"),
                student_data.get("risk_score"),
                student_data.get("risk_level"),
                datetime.utcnow().isoformat(),
            ),
        )

        self.db.conn.commit()
        return self.find_by_id(student_id)

    def find_by_id(self, student_id):
        """Find student by ID"""
        cursor = self.db.conn.cursor()
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        row = cursor.fetchone()

        if row:
            return dict(row)
        return None

    def find_by_user(self, user_id):
        """Find all students for a user"""
        cursor = self.db.conn.cursor()
        cursor.execute(
            "SELECT * FROM students WHERE user_id = ? ORDER BY uploaded_at DESC",
            (user_id,),
        )
        rows = cursor.fetchall()

        return [dict(row) for row in rows]

    def get_all_students(self):
        """Get all students (for compatibility with MongoDB interface)"""
        cursor = self.db.conn.cursor()
        cursor.execute("SELECT * FROM students ORDER BY uploaded_at DESC")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

    def get_student(self, student_id):
        """Get student by ID (alias for find_by_id for compatibility)"""
        return self.find_by_id(student_id)

    def create_or_update_student(self, student_data):
        """Create or update a student, return student ID"""
        # Check if student exists by student_id
        cursor = self.db.conn.cursor()
        cursor.execute(
            "SELECT id FROM students WHERE student_id = ?",
            (student_data.get("student_id"),)
        )
        existing = cursor.fetchone()

        if existing:
            # Update existing student
            self.update_student(existing["id"], student_data)
            return existing["id"]
        else:
            # Create new student
            student = self.create_student(student_data)
            return student["id"] if student else None

    def update_student(self, student_id, update_data):
        """Update student data"""
        fields = []
        values = []

        for key, value in update_data.items():
            if key not in ["id", "user_id", "student_id", "uploaded_at"]:
                fields.append(f"{key} = ?")
                values.append(value)

        if fields:
            values.append(student_id)
            query = f"UPDATE students SET {', '.join(fields)} WHERE id = ?"

            cursor = self.db.conn.cursor()
            cursor.execute(query, values)
            self.db.conn.commit()

        return self.find_by_id(student_id)

    def delete_student(self, student_id):
        """Delete a student"""
        cursor = self.db.conn.cursor()
        cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
        self.db.conn.commit()
        return cursor.rowcount > 0


class PredictionModel:
    """Prediction model for storing ML predictions"""

    def __init__(self, db: Database):
        self.db = db

    def create_prediction(self, prediction_data):
        """Create a new prediction record"""
        from uuid import uuid4

        prediction_id = str(uuid4())
        cursor = self.db.conn.cursor()

        cursor.execute(
            """
            INSERT INTO predictions (
                id, user_id, student_id, prediction, probability,
                risk_level, top_features, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                prediction_id,
                prediction_data.get("user_id"),
                prediction_data.get("student_id"),
                prediction_data.get("prediction"),
                prediction_data.get("probability"),
                prediction_data.get("risk_level"),
                json.dumps(prediction_data.get("top_features", [])),
                datetime.utcnow().isoformat(),
            ),
        )

        self.db.conn.commit()

        cursor.execute("SELECT * FROM predictions WHERE id = ?", (prediction_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

    def find_by_student(self, student_id):
        """Find all predictions for a student"""
        cursor = self.db.conn.cursor()
        cursor.execute(
            "SELECT * FROM predictions WHERE student_id = ? ORDER BY created_at DESC",
            (student_id,),
        )
        rows = cursor.fetchall()

        predictions = []
        for row in rows:
            pred = dict(row)
            if pred.get("top_features"):
                pred["top_features"] = json.loads(pred["top_features"])
            predictions.append(pred)

        return predictions

    def save_batch_predictions(self, user_id, predictions):
        """Save batch predictions (for compatibility with MongoDB interface)"""
        for pred in predictions:
            prediction_data = {
                "user_id": user_id,
                "student_id": pred.get("student_id"),
                "prediction": pred.get("prediction"),
                "probability": pred.get("confidence"),
                "risk_level": pred.get("risk_level"),
                "top_features": pred.get("top_features", []),
            }
            self.create_prediction(prediction_data)
        return True


class InterventionModel:
    """Intervention model for tracking interventions"""

    def __init__(self, db: Database):
        self.db = db

    def create_intervention(self, intervention_data):
        """Create a new intervention"""
        from uuid import uuid4

        intervention_id = str(uuid4())
        cursor = self.db.conn.cursor()

        now = datetime.utcnow().isoformat()
        cursor.execute(
            """
            INSERT INTO interventions (
                id, student_id, intervention_type, description, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
            (
                intervention_id,
                intervention_data.get("student_id"),
                intervention_data.get("intervention_type"),
                intervention_data.get("description"),
                intervention_data.get("status", "pending"),
                now,
                now,
            ),
        )

        self.db.conn.commit()

        cursor.execute("SELECT * FROM interventions WHERE id = ?", (intervention_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

    def find_by_student(self, student_id):
        """Find all interventions for a student"""
        cursor = self.db.conn.cursor()
        cursor.execute(
            "SELECT * FROM interventions WHERE student_id = ? ORDER BY created_at DESC",
            (student_id,),
        )
        rows = cursor.fetchall()

        return [dict(row) for row in rows]
