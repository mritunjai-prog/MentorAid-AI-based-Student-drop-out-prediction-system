"""
Quick test of Flask backend API
"""

import requests
import json

API_URL = "http://localhost:5000/api"

print("=" * 70)
print("  Testing MentorAid Flask Backend")
print("=" * 70)

# Test 1: Health Check
print("\n1. Testing Health Endpoint...")
try:
    response = requests.get(f"{API_URL}/health", timeout=5)
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   ❌ Error: {e}")
    print("   Make sure Flask backend is running (python backend/app.py)")
    exit(1)

# Test 2: Model Info
print("\n2. Testing Model Info Endpoint...")
try:
    response = requests.get(f"{API_URL}/model/info", timeout=5)
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Model: {data['model_name']}")
    print(f"   Accuracy: {data['accuracy']*100:.2f}%")
    print(f"   Features: {data['n_features']}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 3: Batch Prediction with CSV
print("\n3. Testing Batch Prediction...")
try:
    with open("sample_students.csv", "rb") as f:
        files = {"file": ("sample_students.csv", f, "text/csv")}
        response = requests.post(f"{API_URL}/predict/batch", files=files, timeout=30)

    print(f"   Status: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"   Total Students: {data['summary']['total']}")
        print(f"   Dropouts: {data['summary']['dropout']}")
        print(f"   Enrolled: {data['summary']['enrolled']}")
        print(f"   Graduates: {data['summary']['graduate']}")
        print(f"\n   First Student Prediction:")
        pred = data["predictions"][0]
        print(f"     - Prediction: {pred['prediction']}")
        print(f"     - Confidence: {pred['confidence']*100:.1f}%")
        print(f"     - Risk Level: {pred['risk_level']}")
    else:
        print(f"   ❌ Error: {response.json()}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "=" * 70)
print("✅ Backend API Test Complete!")
print("=" * 70)
