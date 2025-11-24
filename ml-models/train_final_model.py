"""
MentorAid - Final Model Training Script
Trains the best performing model (Random Forest with SMOTE + 20 Engineered Features)
Achieves 76.61% accuracy on test set
"""

import pandas as pd
import numpy as np
import warnings

warnings.filterwarnings("ignore")

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE

import joblib
import json
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns

print("=" * 70)
print("  MentorAid - Training Best Model (RF + SMOTE + Engineered Features)")
print("=" * 70)

# ==================== LOAD DATASET ====================
print("\n📂 Loading dataset...")
df = pd.read_csv("datasets/dataset.csv")
print(f"✅ Dataset loaded: {df.shape[0]} samples, {df.shape[1]} features")
print(f"\nTarget distribution:")
print(df["Target"].value_counts())

# ==================== FEATURE ENGINEERING ====================
print("\n🔧 Creating 20 engineered features...")

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
df["both_sems_failures"] = (df["has_sem1_failures"] & df["has_sem2_failures"]).astype(
    int
)

# Performance Categories
df["high_performer"] = (df["avg_grade"] >= 14).astype(int)
df["low_performer"] = (df["avg_grade"] < 10).astype(int)

print(f"✅ Created 20 engineered features")
print(f"New dataset shape: {df.shape}")

# ==================== FEATURE PREPARATION ====================
features_to_drop = [
    "Application mode",
    "Application order",
    "Course",
    "Daytime/evening attendance",
    "Unemployment rate",
    "Inflation rate",
    "GDP",
    "Target",
]

X = df.drop(columns=features_to_drop, errors="ignore")
y = df["Target"].copy()

# Encode target
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

print(f"\n✅ Total features: {X.shape[1]}")
print(f"   Original: 28")
print(f"   Engineered: 20")
print(f"   Total: {X.shape[1]}")

# ==================== TRAIN-TEST SPLIT ====================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n✅ Data split:")
print(f"   Training: {X_train.shape[0]} samples")
print(f"   Test: {X_test.shape[0]} samples")

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ==================== SMOTE BALANCING ====================
print(f"\n⚖️ Applying SMOTE class balancing...")
smote = SMOTE(random_state=42, k_neighbors=5)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train_scaled, y_train)

print(f"✅ Training data balanced:")
print(f"   Original: {X_train_scaled.shape[0]} samples")
print(f"   Balanced: {X_train_balanced.shape[0]} samples")

# ==================== TRAIN BEST MODEL ====================
print(f"\n🌲 Training Random Forest (best configuration)...")

rf_model = RandomForestClassifier(
    n_estimators=300,
    max_depth=20,
    min_samples_split=10,
    max_features="sqrt",
    random_state=42,
    n_jobs=-1,
)

rf_model.fit(X_train_balanced, y_train_balanced)

# Predictions
y_pred = rf_model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n{'='*70}")
print(f"🏆 MODEL PERFORMANCE")
print(f"{'='*70}")
print(f"\n✅ Test Accuracy: {accuracy*100:.2f}%")
print(f"\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print(f"\nConfusion Matrix:")
print(cm)

# Feature Importance
feature_importance = pd.DataFrame(
    {"feature": X.columns, "importance": rf_model.feature_importances_}
).sort_values("importance", ascending=False)

print(f"\n📊 Top 15 Most Important Features:")
print(feature_importance.head(15).to_string(index=False))

# ==================== SAVE MODEL & ARTIFACTS ====================
output_dir = Path("trained_models")
output_dir.mkdir(exist_ok=True)

print(f"\n💾 Saving model and artifacts...")

joblib.dump(rf_model, output_dir / "random_forest_model.pkl")
joblib.dump(scaler, output_dir / "scaler.pkl")
joblib.dump(label_encoder, output_dir / "label_encoder.pkl")
joblib.dump(list(X.columns), output_dir / "feature_names.pkl")

# Save feature importance
feature_importance.to_csv(output_dir / "feature_importance.csv", index=False)

# Save model metadata
metadata = {
    "model_name": "Random Forest with SMOTE + Engineered Features",
    "accuracy": float(accuracy),
    "n_features": X.shape[1],
    "original_features": 28,
    "engineered_features": 20,
    "n_training_samples": X_train_balanced.shape[0],
    "n_test_samples": X_test.shape[0],
    "hyperparameters": {
        "n_estimators": 300,
        "max_depth": 20,
        "min_samples_split": 10,
        "max_features": "sqrt",
    },
    "balancing_method": "SMOTE (k_neighbors=5)",
    "target_classes": label_encoder.classes_.tolist(),
}

with open(output_dir / "model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=4)

print(f"✅ Saved random_forest_model.pkl")
print(f"✅ Saved scaler.pkl")
print(f"✅ Saved label_encoder.pkl")
print(f"✅ Saved feature_names.pkl")
print(f"✅ Saved feature_importance.csv")
print(f"✅ Saved model_metadata.json")

# ==================== CREATE VISUALIZATION ====================
print(f"\n📊 Creating visualizations...")

fig, axes = plt.subplots(2, 2, figsize=(16, 12))

# 1. Confusion Matrix
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    ax=axes[0, 0],
    xticklabels=label_encoder.classes_,
    yticklabels=label_encoder.classes_,
)
axes[0, 0].set_title("Confusion Matrix", fontsize=14, fontweight="bold")
axes[0, 0].set_ylabel("True Label")
axes[0, 0].set_xlabel("Predicted Label")

# 2. Feature Importance (Top 15)
top_features = feature_importance.head(15)
axes[0, 1].barh(range(len(top_features)), top_features["importance"], color="skyblue")
axes[0, 1].set_yticks(range(len(top_features)))
axes[0, 1].set_yticklabels(top_features["feature"], fontsize=9)
axes[0, 1].invert_yaxis()
axes[0, 1].set_title("Top 15 Feature Importance", fontsize=14, fontweight="bold")
axes[0, 1].set_xlabel("Importance")

# 3. Class Distribution (Test Set)
unique, counts = np.unique(y_test, return_counts=True)
class_names = [label_encoder.classes_[i] for i in unique]
axes[1, 0].bar(class_names, counts, color=["#e74c3c", "#f39c12", "#2ecc71"])
axes[1, 0].set_title("Test Set Class Distribution", fontsize=14, fontweight="bold")
axes[1, 0].set_ylabel("Count")
for i, (name, count) in enumerate(zip(class_names, counts)):
    axes[1, 0].text(i, count + 5, str(count), ha="center", fontweight="bold")

# 4. Model Performance Metrics
metrics = ["Accuracy", "Dropout\nF1", "Enrolled\nF1", "Graduate\nF1"]
from sklearn.metrics import f1_score

f1_per_class = f1_score(y_test, y_pred, average=None)
values = [accuracy, f1_per_class[0], f1_per_class[1], f1_per_class[2]]
colors = ["#3498db", "#e74c3c", "#f39c12", "#2ecc71"]

axes[1, 1].bar(metrics, values, color=colors)
axes[1, 1].set_title("Model Performance Metrics", fontsize=14, fontweight="bold")
axes[1, 1].set_ylabel("Score")
axes[1, 1].set_ylim(0, 1)
for i, v in enumerate(values):
    axes[1, 1].text(i, v + 0.02, f"{v:.3f}", ha="center", fontweight="bold")

plt.tight_layout()
plt.savefig(output_dir / "model_performance.png", dpi=300, bbox_inches="tight")
print(f"✅ Saved model_performance.png")

print(f"\n{'='*70}")
print(f"✅ MODEL TRAINING COMPLETE!")
print(f"{'='*70}")
print(f"\n📁 All artifacts saved to: {output_dir.absolute()}")
print(f"\n🎯 Final Model: Random Forest + SMOTE + 20 Engineered Features")
print(f"   Accuracy: {accuracy*100:.2f}%")
print(f"   Features: {X.shape[1]} (28 original + 20 engineered)")
print(f"   Training Samples: {X_train_balanced.shape[0]} (after SMOTE)")
print(f"   Test Samples: {X_test.shape[0]}")
