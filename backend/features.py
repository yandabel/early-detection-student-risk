# test_features.py

import joblib

features = joblib.load("features.pkl")

print(len(features))
print(features[-10:])