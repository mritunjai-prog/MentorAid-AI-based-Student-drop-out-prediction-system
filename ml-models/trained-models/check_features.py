import pickle

# Load model and feature names
model = pickle.load(open("svm_tuned_model.pkl", "rb"))
feature_names = pickle.load(open("feature_names.pkl", "rb"))

# Remove Target if present
feature_names_clean = [f for f in feature_names if f != "Target"]

print(f"feature_names.pkl has {len(feature_names_clean)} features")
print(f"Model expects: {model.n_features_in_} features")
print()

print("Model expected features:")
for i, feat in enumerate(model.feature_names_in_, 1):
    print(f"{i}. {feat}")

print("\n" + "=" * 80)
print("Difference:")
model_features = set(model.feature_names_in_)
pkl_features = set(feature_names_clean)

missing_in_pkl = model_features - pkl_features
extra_in_pkl = pkl_features - model_features

if missing_in_pkl:
    print(f"Features in MODEL but NOT in feature_names.pkl: {missing_in_pkl}")
if extra_in_pkl:
    print(f"Features in feature_names.pkl but NOT in MODEL: {extra_in_pkl}")
