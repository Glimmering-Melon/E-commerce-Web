# AI Shopping Demand Prediction Model

## Tính năng
- **Dự đoán số tiền khách hàng sẽ chi tiêu**
- **Dự đoán danh mục sản phẩm khách quan tâm**
- **Phân khúc khách hàng** (VIP, Regular, New)
- **Top 3 categories** khách có khả năng mua

## Cài đặt

### 1. Cài đặt Python dependencies
```bash
cd ai-model
pip install -r requirements.txt
```

### 2. Train model
```bash
python train_model.py
```

Sẽ tạo ra:
- `purchase_amount_model.pkl` - Model dự đoán số tiền
- `category_predictor_model.pkl` - Model dự đoán category
- `scaler.pkl` - Scaler cho features
- `encoders.json` - Encoders cho categorical data

### 3. Test prediction
```bash
python predict.py
```

### 4. Chạy API server
```bash
python api.py
```

API sẽ chạy ở `http://localhost:5001`

## API Endpoints

### POST /api/ai/predict
Dự đoán hành vi mua sắm của khách hàng

**Request:**
```json
{
  "Age": 30,
  "Gender": "Male",
  "Category": "Clothing",
  "Location": "California",
  "Size": "M",
  "Season": "Summer",
  "Subscription Status": "Yes",
  "Previous Purchases": 15,
  "Frequency of Purchases": "Weekly"
}
```

**Response:**
```json
{
  "predicted_amount": 65.50,
  "predicted_category": "Clothing",
  "top_categories": [
    {"category": "Clothing", "probability": 45.2},
    {"category": "Footwear", "probability": 30.1},
    {"category": "Accessories", "probability": 15.7}
  ],
  "customer_segment": "Regular"
}
```

### GET /api/ai/health
Kiểm tra trạng thái API

## Tích hợp vào Backend

Thêm vào `backend/controllers/analytics.controller.js`:

```javascript
import axios from 'axios';

export const getCustomerPrediction = async (req, res) => {
  try {
    const customerData = {
      Age: req.user.age || 30,
      Gender: req.user.gender || 'Male',
      'Previous Purchases': req.user.orders?.length || 0,
      // ... other fields
    };
    
    const aiResponse = await axios.post('http://localhost:5001/api/ai/predict', customerData);
    res.json(aiResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Model Performance
- Purchase Amount R² Score: ~0.75-0.85
- Category Prediction Accuracy: ~70-80%

## Features Used
1. Age
2. Gender
3. Category
4. Location
5. Size
6. Season
7. Subscription Status
8. Previous Purchases
9. Frequency of Purchases
