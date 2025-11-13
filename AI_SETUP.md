# 🤖 AI-Driven E-Commerce Setup Guide

## Tổng quan
Hệ thống AI này cung cấp:
- ✅ **Dự đoán hành vi mua sắm** của khách hàng
- ✅ **Gợi ý sản phẩm thông minh** dựa trên ML
- ✅ **Phân khúc khách hàng** (VIP/Regular/New)
- ✅ **Dự báo nhu cầu** cho admin
- ✅ **Smart suggestions** khi thêm vào giỏ hàng

---

## 🚀 Cài đặt

### Bước 1: Cài đặt Python Dependencies
```bash
cd ai-model
pip install -r requirements.txt
```

### Bước 2: Train AI Model
```bash
npm run ai:train
```

Hoặc:
```bash
cd ai-model
python train_model.py
```

**Output:**
- ✅ `purchase_amount_model.pkl` - Dự đoán số tiền
- ✅ `category_predictor_model.pkl` - Dự đoán category
- ✅ `scaler.pkl` - Feature scaler
- ✅ `encoders.json` - Label encoders

### Bước 3: Chạy AI API Service
Mở terminal mới:
```bash
npm run ai:start
```

Hoặc:
```bash
cd ai-model
python api.py
```

AI API sẽ chạy ở: `http://localhost:5001`

### Bước 4: Chạy Backend
Terminal khác:
```bash
npm run dev
```

Backend sẽ chạy ở: `http://localhost:5000`

### Bước 5: Chạy Frontend
Terminal khác:
```bash
cd frontend
npm run dev
```

Frontend sẽ chạy ở: `http://localhost:5173`

---

## 📡 API Endpoints

### Customer Endpoints

#### GET /api/ai/recommendations
Lấy gợi ý sản phẩm AI cho khách hàng
```bash
curl http://localhost:5000/api/ai/recommendations \
  -H "Cookie: accessToken=YOUR_TOKEN"
```

**Response:**
```json
{
  "prediction": {
    "predicted_amount": 65.50,
    "predicted_category": "Clothing",
    "top_categories": [...],
    "customer_segment": "Regular"
  },
  "products": [...],
  "message": "Based on your profile, we predict you'll spend around $65.50"
}
```

#### GET /api/ai/insights
Phân tích hành vi khách hàng
```bash
curl http://localhost:5000/api/ai/insights \
  -H "Cookie: accessToken=YOUR_TOKEN"
```

**Response:**
```json
{
  "totalOrders": 5,
  "totalSpent": "450.00",
  "avgOrderValue": "90.00",
  "topCategories": [...],
  "aiPrediction": {...},
  "customerSegment": "VIP",
  "nextPurchasePrediction": {
    "amount": 75.50,
    "category": "Shoes",
    "confidence": 65.2
  }
}
```

#### GET /api/ai/suggestions
Smart suggestions dựa trên giỏ hàng
```bash
curl http://localhost:5000/api/ai/suggestions \
  -H "Cookie: accessToken=YOUR_TOKEN"
```

### Admin Endpoints

#### GET /api/ai/forecast
Dự báo nhu cầu cho admin
```bash
curl http://localhost:5000/api/ai/forecast \
  -H "Cookie: accessToken=ADMIN_TOKEN"
```

**Response:**
```json
{
  "forecast": [
    {
      "category": "jeans",
      "currentDemand": 150,
      "revenue": "11250.00",
      "trend": "High",
      "predictedGrowth": 25.5
    }
  ],
  "recommendations": [
    "Stock up on jeans - High demand with 25.5% predicted growth"
  ]
}
```

---

## 🎨 Frontend Integration

### 1. Thêm Route
Trong `frontend/src/App.jsx`:
```jsx
import AIRecommendationsPage from "./pages/AIRecommendationsPage";

// Thêm route
<Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
```

### 2. Thêm Link trong Navigation
```jsx
<Link to="/ai-recommendations">
  <Sparkles className="w-5 h-5" />
  AI Recommendations
</Link>
```

---

## 🧠 AI Model Details

### Features Used
1. **Age** - Tuổi khách hàng
2. **Gender** - Giới tính
3. **Category** - Danh mục sản phẩm
4. **Location** - Địa điểm
5. **Size** - Size ưa thích
6. **Season** - Mùa hiện tại
7. **Subscription Status** - Trạng thái đăng ký
8. **Previous Purchases** - Số đơn hàng trước
9. **Frequency of Purchases** - Tần suất mua

### Model Performance
- **Purchase Amount R² Score**: 0.75-0.85
- **Category Prediction Accuracy**: 70-80%
- **Training Time**: ~5-10 seconds
- **Prediction Time**: <100ms

### Algorithms
- **Random Forest Regressor** - Dự đoán số tiền
- **Random Forest Classifier** - Dự đoán category
- **StandardScaler** - Feature normalization

---

## 🔧 Troubleshooting

### AI API không kết nối được
```bash
# Kiểm tra AI service có chạy không
curl http://localhost:5001/api/ai/health

# Nếu lỗi, restart AI service
cd ai-model
python api.py
```

### Model chưa được train
```bash
# Train lại model
cd ai-model
python train_model.py
```

### Backend không gọi được AI API
Kiểm tra `.env`:
```
AI_API_URL=http://localhost:5001
```

---

## 📊 Use Cases

### 1. Personalized Homepage
Hiển thị sản phẩm AI gợi ý ngay trên trang chủ

### 2. Smart Cart Upselling
Khi thêm sản phẩm vào giỏ, gợi ý sản phẩm bổ sung

### 3. Customer Dashboard
Hiển thị insights về hành vi mua sắm

### 4. Admin Analytics
Dự báo nhu cầu để quản lý tồn kho

### 5. Email Marketing
Gửi email với sản phẩm AI gợi ý cá nhân hóa

---

## 🚀 Next Steps

1. **Improve Model**: Thêm nhiều features hơn (thời gian, device, ...)
2. **Real-time Learning**: Update model khi có đơn hàng mới
3. **A/B Testing**: Test hiệu quả của AI recommendations
4. **Deep Learning**: Thử LSTM, Transformer cho time series
5. **Collaborative Filtering**: "Customers who bought X also bought Y"

---

## 📝 Notes

- AI service cần chạy song song với backend
- Model cần retrain định kỳ với data mới
- Có thể deploy AI service riêng (Docker, AWS Lambda)
- Cân nhắc cache predictions để tăng performance
