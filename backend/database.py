"""
MongoDB Database Connection and Models
"""

from pymongo import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
from bson import ObjectId
import logging
import ssl

logger = logging.getLogger(__name__)


class Database:
    """MongoDB Database Manager"""

    def __init__(self, uri, db_name):
        # Configure MongoDB connection - simplified for better compatibility
        try:
            # Remove query parameters from URI and add them programmatically
            base_uri = uri.split('?')[0]
            
            self.client = MongoClient(
                base_uri,
                serverSelectionTimeoutMS=30000,
                connectTimeoutMS=30000,
                retryWrites=True,
                w='majority'
            )
            # Test the connection
            self.client.admin.command("ping")
            self.db = self.client[db_name]
            self.users = self.db.users
            self.predictions = self.db.predictions
            self.students = self.db.students
            self.interventions = self.db.interventions
            logger.info(f"✅ Connected to MongoDB: {db_name}")
        except Exception as e:
            logger.error(f"❌ MongoDB connection failed: {e}")
            logger.error(f"Connection string: {uri.split('@')[1] if '@' in uri else 'invalid'}")
            # Set to None to allow app to continue without DB
            self.client = None
            self.db = None
            self.users = None
            self.predictions = None
            self.students = None
            self.interventions = None

    def close(self):
        """Close database connection"""
        self.client.close()


class UserModel:
    """User model for authentication"""

    def __init__(self, db: Database):
        self.collection = db.users
        self._create_indexes()

    def _create_indexes(self):
        """Create indexes for better query performance"""
        self.collection.create_index("email", unique=True)
        self.collection.create_index("google_id", unique=True, sparse=True)

    def create_user(self, email, name, google_id=None, picture=None, role="counselor"):
        """Create a new user"""
        user = {
            "email": email,
            "name": name,
            "google_id": google_id,
            "picture": picture,
            "role": role,
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
        }
        result = self.collection.insert_one(user)
        user["_id"] = str(result.inserted_id)
        return user

    def find_by_email(self, email):
        """Find user by email"""
        user = self.collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user

    def find_by_google_id(self, google_id):
        """Find user by Google ID"""
        user = self.collection.find_one({"google_id": google_id})
        if user:
            user["_id"] = str(user["_id"])
        return user

    def find_by_id(self, user_id):
        """Find user by ID"""
        try:
            user = self.collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
            return user
        except:
            return None

    def update_last_login(self, email):
        """Update user's last login time"""
        self.collection.update_one(
            {"email": email}, {"$set": {"last_login": datetime.utcnow()}}
        )


class PredictionModel:
    """Model for storing predictions"""

    def __init__(self, db: Database):
        self.collection = db.predictions
        self._create_indexes()

    def _create_indexes(self):
        """Create indexes"""
        self.collection.create_index("user_id")
        self.collection.create_index("created_at")
        self.collection.create_index("student_id")

    def save_prediction(
        self, user_id, student_data, prediction, confidence, probabilities, risk_level
    ):
        """Save a prediction"""
        pred = {
            "user_id": user_id,
            "student_data": student_data,
            "prediction": prediction,
            "confidence": float(confidence),
            "probabilities": {k: float(v) for k, v in probabilities.items()},
            "risk_level": risk_level,
            "created_at": datetime.utcnow(),
        }

        # Add student_id if available
        if "student_id" in student_data:
            pred["student_id"] = student_data["student_id"]

        result = self.collection.insert_one(pred)
        pred["_id"] = str(result.inserted_id)
        return pred

    def save_batch_predictions(self, user_id, predictions_list):
        """Save multiple predictions from CSV upload"""
        records = []
        for pred in predictions_list:
            record = {
                "user_id": user_id,
                "prediction": pred.get("prediction"),
                "confidence": float(pred.get("confidence", 0)),
                "probabilities": {
                    k: float(v) for k, v in pred.get("probabilities", {}).items()
                },
                "risk_level": pred.get("risk_level"),
                "created_at": datetime.utcnow(),
            }
            if "student_id" in pred:
                record["student_id"] = pred["student_id"]
            records.append(record)

        if records:
            result = self.collection.insert_many(records)
            return len(result.inserted_ids)
        return 0

    def get_user_predictions(self, user_id, limit=100):
        """Get predictions by user"""
        predictions = list(
            self.collection.find({"user_id": user_id})
            .sort("created_at", -1)
            .limit(limit)
        )
        for pred in predictions:
            pred["_id"] = str(pred["_id"])
        return predictions

    def get_prediction_stats(self, user_id=None):
        """Get prediction statistics"""
        match_filter = {"user_id": user_id} if user_id else {}

        pipeline = [
            {"$match": match_filter},
            {
                "$group": {
                    "_id": "$prediction",
                    "count": {"$sum": 1},
                    "avg_confidence": {"$avg": "$confidence"},
                }
            },
        ]

        results = list(self.collection.aggregate(pipeline))
        return {
            r["_id"]: {"count": r["count"], "avg_confidence": r["avg_confidence"]}
            for r in results
        }


class StudentModel:
    """Model for storing student information"""

    def __init__(self, db: Database):
        self.collection = db.students
        self._create_indexes()

    def _create_indexes(self):
        """Create indexes"""
        self.collection.create_index("email", unique=True, sparse=True)
        self.collection.create_index("student_id", unique=True, sparse=True)

    def create_or_update_student(self, student_data):
        """Create or update student record"""
        student_id = student_data.get("student_id")
        if student_id:
            # Update existing or insert new
            result = self.collection.update_one(
                {"student_id": student_id},
                {
                    "$set": {
                        **student_data,
                        "updated_at": datetime.utcnow(),
                    },
                    "$setOnInsert": {"created_at": datetime.utcnow()},
                },
                upsert=True,
            )
            return student_id
        else:
            # Insert new without student_id
            student_data["created_at"] = datetime.utcnow()
            result = self.collection.insert_one(student_data)
            return str(result.inserted_id)

    def get_student(self, student_id):
        """Get student by ID (MongoDB _id or student_id field)"""
        from bson import ObjectId

        # Try MongoDB _id first
        try:
            student = self.collection.find_one({"_id": ObjectId(student_id)})
        except:
            # If not a valid ObjectId, try student_id field
            student = self.collection.find_one({"student_id": student_id})

        if student:
            student["_id"] = str(student["_id"])
        return student

    def get_all_students(self, limit=1000):
        """Get all students"""
        students = list(self.collection.find().limit(limit))
        for student in students:
            student["_id"] = str(student["_id"])
        return students


class InterventionModel:
    """Model for tracking interventions"""

    def __init__(self, db: Database):
        self.collection = db.interventions
        self._create_indexes()

    def _create_indexes(self):
        """Create indexes"""
        self.collection.create_index("student_id")
        self.collection.create_index("user_id")
        self.collection.create_index("created_at")

    def create_intervention(
        self, student_id, user_id, intervention_type, description, outcome=None
    ):
        """Create intervention record"""
        intervention = {
            "student_id": student_id,
            "user_id": user_id,
            "type": intervention_type,
            "description": description,
            "outcome": outcome,
            "created_at": datetime.utcnow(),
        }
        result = self.collection.insert_one(intervention)
        intervention["_id"] = str(result.inserted_id)
        return intervention

    def get_student_interventions(self, student_id):
        """Get all interventions for a student"""
        interventions = list(
            self.collection.find({"student_id": student_id}).sort("created_at", -1)
        )
        for intervention in interventions:
            intervention["_id"] = str(intervention["_id"])
        return interventions

    def update_intervention_outcome(self, intervention_id, outcome):
        """Update intervention outcome"""
        self.collection.update_one(
            {"_id": ObjectId(intervention_id)},
            {"$set": {"outcome": outcome, "updated_at": datetime.utcnow()}},
        )
