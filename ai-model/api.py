from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import ShoppingPredictor
import os

app = Flask(__name__)
CORS(app)

# Initialize predictor
try:
    predictor = ShoppingPredictor()
    print("✅ AI Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    predictor = None

@app.route('/api/ai/predict', methods=['POST'])
def predict():
    """Predict customer purchase behavior"""
    if not predictor:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        customer_data = request.json
        result = predictor.get_recommendations(customer_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/ai/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy' if predictor else 'unhealthy',
        'model_loaded': predictor is not None
    })

if __name__ == '__main__':
    port = int(os.environ.get('AI_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
