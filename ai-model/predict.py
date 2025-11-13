import joblib
import json
import numpy as np

class ShoppingPredictor:
    def __init__(self):
        import os
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        self.amount_model = joblib.load(os.path.join(base_dir, 'purchase_amount_model.pkl'))
        self.category_model = joblib.load(os.path.join(base_dir, 'category_predictor_model.pkl'))
        self.scaler = joblib.load(os.path.join(base_dir, 'scaler.pkl'))
        
        with open(os.path.join(base_dir, 'encoders.json'), 'r') as f:
            self.encoders = json.load(f)
        
        with open(os.path.join(base_dir, 'feature_columns.json'), 'r') as f:
            self.feature_columns = json.load(f)
    
    def encode_input(self, customer_data):
        """Encode customer data for prediction"""
        encoded = []
        
        # Numeric columns
        numeric_cols = ['Age', 'Previous Purchases', 'Total Spent', 'Avg Order Value', 'Price Range Max']
        
        for col in self.feature_columns:
            if col in numeric_cols:
                encoded.append(customer_data.get(col, 0))
            else:
                value = str(customer_data.get(col, ''))
                if col in self.encoders and value in self.encoders[col]:
                    encoded.append(self.encoders[col][value])
                else:
                    # Use first encoder value as default
                    if col in self.encoders and len(self.encoders[col]) > 0:
                        encoded.append(0)
                    else:
                        encoded.append(0)
        
        return np.array(encoded).reshape(1, -1)
    
    def predict_purchase_amount(self, customer_data):
        """Predict how much customer will spend"""
        X = self.encode_input(customer_data)
        X_scaled = self.scaler.transform(X)
        amount = self.amount_model.predict(X_scaled)[0]
        return round(float(amount), 2)
    
    def predict_category(self, customer_data):
        """Predict which category customer will buy from"""
        X = self.encode_input(customer_data)
        X_scaled = self.scaler.transform(X)
        category_encoded = self.category_model.predict(X_scaled)[0]
        
        # Reverse lookup category name
        for cat_name, cat_id in self.encoders['Category'].items():
            if cat_id == category_encoded:
                return cat_name
        return "Unknown"
    
    def get_recommendations(self, customer_data):
        """Get personalized recommendations"""
        predicted_amount = self.predict_purchase_amount(customer_data)
        predicted_category = self.predict_category(customer_data)
        
        # Get top 3 category probabilities
        X = self.encode_input(customer_data)
        X_scaled = self.scaler.transform(X)
        probabilities = self.category_model.predict_proba(X_scaled)[0]
        
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        top_categories = []
        
        for idx in top_3_indices:
            for cat_name, cat_id in self.encoders['Category'].items():
                if cat_id == idx:
                    top_categories.append({
                        'category': cat_name,
                        'probability': round(float(probabilities[idx]) * 100, 2)
                    })
                    break
        
        return {
            'predicted_amount': predicted_amount,
            'predicted_category': predicted_category,
            'top_categories': top_categories,
            'customer_segment': self._get_segment(customer_data, predicted_amount)
        }
    
    def _get_segment(self, customer_data, predicted_amount):
        """Segment customer based on behavior"""
        age = customer_data.get('Age', 30)
        prev_purchases = customer_data.get('Previous Purchases', 0)
        
        if predicted_amount > 70 and prev_purchases > 20:
            return 'VIP'
        elif predicted_amount > 50 or prev_purchases > 10:
            return 'Regular'
        else:
            return 'New'

# Example usage
if __name__ == '__main__':
    predictor = ShoppingPredictor()
    
    # Test prediction
    test_customer = {
        'Age': 30,
        'Gender': 'Male',
        'Category': 'Clothing',
        'Location': 'California',
        'Size': 'M',
        'Season': 'Summer',
        'Subscription Status': 'Yes',
        'Previous Purchases': 15,
        'Frequency of Purchases': 'Weekly'
    }
    
    result = predictor.get_recommendations(test_customer)
    print("\n=== Prediction Result ===")
    print(json.dumps(result, indent=2))
