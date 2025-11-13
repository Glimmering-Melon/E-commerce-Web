import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
import joblib
import json

# Load dataset
df = pd.read_csv('../shopping_trends.csv')

print("Dataset shape:", df.shape)
print("\nColumns:", df.columns.tolist())
print("\nFirst few rows:")
print(df.head())

# Preprocessing
le_dict = {}
categorical_columns = ['Gender', 'Category', 'Location', 'Size', 'Color', 'Season', 
                       'Subscription Status', 'Payment Method', 'Shipping Type', 
                       'Preferred Payment Method', 'Frequency of Purchases']

df_encoded = df.copy()

for col in categorical_columns:
    le = LabelEncoder()
    df_encoded[col] = le.fit_transform(df[col].astype(str))
    le_dict[col] = {str(label): int(idx) for idx, label in enumerate(le.classes_)}

# Convert boolean columns
df_encoded['Discount Applied'] = df['Discount Applied'].map({'Yes': 1, 'No': 0})
df_encoded['Promo Code Used'] = df['Promo Code Used'].map({'Yes': 1, 'No': 0})

# Features for prediction - expanded with more features
feature_columns = ['Age', 'Gender', 'Category', 'Location', 'Size', 'Color', 'Season', 
                   'Subscription Status', 'Payment Method', 'Shipping Type',
                   'Previous Purchases', 'Frequency of Purchases']

X = df_encoded[feature_columns]
y_amount = df_encoded['Purchase Amount (USD)']
y_category = df_encoded['Category']

# Split data
X_train, X_test, y_train_amount, y_test_amount = train_test_split(
    X, y_amount, test_size=0.2, random_state=42
)

X_train_cat, X_test_cat, y_train_cat, y_test_cat = train_test_split(
    X, y_category, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Purchase Amount Predictor
print("\n=== Training Purchase Amount Predictor ===")
amount_model = RandomForestRegressor(
    n_estimators=150, 
    random_state=42, 
    max_depth=15,
    min_samples_leaf=2,
    max_features='sqrt'
)
amount_model.fit(X_train_scaled, y_train_amount)
amount_score = amount_model.score(X_test_scaled, y_test_amount)
print(f"Purchase Amount R² Score: {amount_score:.4f}")

# Train Category Predictor
print("\n=== Training Category Predictor ===")
category_model = RandomForestClassifier(
    n_estimators=150, 
    random_state=42, 
    max_depth=15,
    min_samples_leaf=2,
    max_features='sqrt'
)
category_model.fit(X_train_scaled, y_train_cat)
category_score = category_model.score(X_test_scaled, y_test_cat)
print(f"Category Accuracy: {category_score:.4f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': amount_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n=== Feature Importance ===")
print(feature_importance)

# Save models
joblib.dump(amount_model, 'purchase_amount_model.pkl')
joblib.dump(category_model, 'category_predictor_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

# Save encoders
with open('encoders.json', 'w') as f:
    json.dump(le_dict, f, indent=2)

# Save feature columns
with open('feature_columns.json', 'w') as f:
    json.dump(feature_columns, f)

print("\n✅ Models saved successfully!")
print("- purchase_amount_model.pkl")
print("- category_predictor_model.pkl")
print("- scaler.pkl")
print("- encoders.json")
