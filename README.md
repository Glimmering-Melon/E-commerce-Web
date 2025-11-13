# 🛒 AI-Powered E-Commerce Platform

<div align="center">



**A full-stack e-commerce platform with AI-driven product recommendations and customer behavior analytics**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live Demo](#) • [Documentation](#features) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [AI Model Training](#-ai-model-training)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛍️ E-Commerce Core
- **Product Management**: Full CRUD operations for products with categories
- **Shopping Cart**: Real-time cart updates with persistent storage
- **Checkout System**: Secure payment processing with Stripe
- **Order Management**: Complete order tracking and history
- **Coupon System**: Discount codes and promotional offers

### 🤖 AI-Powered Features
- **Smart Recommendations**: ML-based product suggestions tailored to each user
- **Customer Behavior Analytics**: Deep insights into shopping patterns
- **Demand Forecasting**: Predict future sales trends for inventory management
- **Customer Segmentation**: Automatic classification (VIP, Regular, New)
- **Purchase Prediction**: Estimate customer spending and category preferences

### 👑 Admin Dashboard
- **Sales Analytics**: Real-time revenue and order statistics
- **Product Analytics**: Best sellers, trending items, and inventory alerts
- **Customer Insights**: User behavior patterns and demographics
- **AI Forecasting**: Demand predictions and growth trends

### 🔐 Security & Authentication
- **JWT Authentication**: Secure access/refresh token system
- **Role-Based Access**: Admin and customer role separation
- **Password Hashing**: bcrypt encryption for user passwords
- **CORS Protection**: Secure cross-origin resource sharing

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Instant cart and order status updates
- **Image Management**: Cloudinary integration for optimized images
- **Smooth Animations**: Framer Motion for enhanced UX

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **Stripe** - Payment processing

### AI/ML
- **Python 3.8+** - Programming language
- **scikit-learn** - Machine learning library
- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **Flask** - AI API server
- **joblib** - Model serialization

---

## 🏗️ Architecture

```
┌─────────────────┐
│   React Client  │
│   (Frontend)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────┐
│   Express API   │←────→│   MongoDB    │
│   (Backend)     │      │   Database   │
└────────┬────────┘      └──────────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────┐
│   Flask API     │←────→│  ML Models   │
│   (AI Service)  │      │   (.pkl)     │
└─────────────────┘      └──────────────┘
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/) or use MongoDB Atlas
- **npm** or **yarn** - Package manager
- **Git** - Version control

### Required Accounts
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database hosting
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Stripe](https://stripe.com/) - Payment processing (optional for testing)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mern-ecommerce.git
cd mern-ecommerce
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Install AI/ML Dependencies

```bash
cd ai-model
pip install -r requirements.txt
cd ..
```

---

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Secrets (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Frontend URL
CLIENT_URL=http://localhost:5173

# AI Service URL
AI_API_URL=http://localhost:5001
```

### 2. Generate JWT Secrets

```bash
# Generate ACCESS_TOKEN_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate REFRESH_TOKEN_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. MongoDB Setup

**Option A: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string to `MONGO_URI` in `.env`
5. Add your IP to whitelist (or use 0.0.0.0/0 for development)

**Option B: Local MongoDB**
```bash
# Install MongoDB locally
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb
# Windows: Download from mongodb.com

# Use local connection string
MONGO_URI=mongodb://localhost:27017/ecommerce
```

### 4. Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `.env` file

---

## 🏃 Running the Application

### Development Mode

You need **4 terminal windows**:

#### Terminal 1: Backend Server
```bash
npm run dev
```
Server runs at: `http://localhost:5000`

#### Terminal 2: Frontend Dev Server
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

#### Terminal 3: AI Service
```bash
cd ai-model
python api.py
```
AI API runs at: `http://localhost:5001`

#### Terminal 4: Seed Database (First time only)
```bash
npm run seed
```

### Production Mode

```bash
# Build frontend
npm run build

# Start production server
npm start
```

---

## 🤖 AI Model Training

### 1. Prepare Training Data

The `shopping_trends.csv` dataset is included. It contains:
- Customer demographics (age, gender, location)
- Purchase history
- Product preferences
- Shopping behavior patterns

### 2. Train the Models

```bash
npm run ai:train
```

Or manually:
```bash
cd ai-model
python train_model.py
```

This creates:
- `purchase_amount_model.pkl` - Predicts spending amount
- `category_predictor_model.pkl` - Predicts product category
- `scaler.pkl` - Feature normalization
- `encoders.json` - Label encoders
- `feature_columns.json` - Feature list

### 3. Model Performance

Expected metrics:
- **Purchase Amount R² Score**: 0.75-0.85
- **Category Prediction Accuracy**: 70-80%
- **Training Time**: ~5-10 seconds
- **Prediction Time**: <100ms

### 4. Retrain Models

Retrain periodically with new data:
```bash
# Export orders to CSV (implement custom script)
# Then retrain
npm run ai:train
```

---

## 🌐 Deployment

### Deploy to Render (Recommended)

#### Backend Deployment

1. Create account at [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   ```
   Name: ecommerce-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
5. Add environment variables from `.env`
6. Deploy

#### Frontend Deployment

1. Click "New +" → "Static Site"
2. Connect repository
3. Configure:
   ```
   Name: ecommerce-frontend
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
5. Deploy

#### AI Service Deployment

1. Click "New +" → "Web Service"
2. Configure:
   ```
   Name: ecommerce-ai
   Environment: Python
   Build Command: cd ai-model && pip install -r requirements.txt
   Start Command: cd ai-model && python api.py
   ```
3. Deploy

### Deploy to Vercel (Frontend Only)

```bash
cd frontend
npm install -g vercel
vercel
```

### Deploy to Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-app-name

# Add buildpacks
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/python

# Set environment variables
heroku config:set MONGO_URI=your_mongo_uri
# ... add all other env vars

# Deploy
git push heroku main
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/logout          - Logout user
POST   /api/auth/refresh-token   - Refresh access token
GET    /api/auth/profile         - Get user profile
```

### Product Endpoints

```
GET    /api/products             - Get all products
GET    /api/products/featured    - Get featured products
GET    /api/products/category/:category - Get products by category
POST   /api/products             - Create product (Admin)
DELETE /api/products/:id         - Delete product (Admin)
PATCH  /api/products/:id         - Toggle featured (Admin)
```

### Cart Endpoints

```
GET    /api/cart                 - Get user cart
POST   /api/cart                 - Add to cart
DELETE /api/cart                 - Remove from cart
PUT    /api/cart/:id             - Update cart quantity
```

### AI Endpoints

```
GET    /api/ai/recommendations   - Get AI product recommendations
GET    /api/ai/insights          - Get customer behavior insights
GET    /api/ai/suggestions       - Get smart cart suggestions
GET    /api/ai/forecast          - Get demand forecast (Admin)
```

### Payment Endpoints

```
POST   /api/payments/create-checkout-session - Create Stripe session
POST   /api/payments/checkout-success        - Handle successful payment
```

---

## 📁 Project Structure

```
mern-ecommerce/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── lib/            # Database & external services
│   ├── utils/          # Helper functions
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── stores/     # Zustand stores
│   │   ├── lib/        # Utilities
│   │   └── App.jsx     # Main app component
│   └── public/         # Static assets
├── ai-model/
│   ├── train_model.py  # Model training script
│   ├── predict.py      # Prediction logic
│   ├── api.py          # Flask API server
│   ├── requirements.txt # Python dependencies
│   └── *.pkl           # Trained models
├── .env                # Environment variables
├── package.json        # Node dependencies
└── README.md          # This file
```

---

## 👥 Default Users

After running `npm run seed`:

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@example.com      | admin123    |
| Customer | john@example.com       | password123 |
| Customer | jane@example.com       | password123 |

---

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd frontend
npm test

# Run AI model tests
cd ai-model
python -m pytest
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [MongoDB](https://www.mongodb.com/) - Database
- [Stripe](https://stripe.com/) - Payment processing
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [scikit-learn](https://scikit-learn.org/) - Machine learning
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📞 Support

For support, email support@example.com or join our Slack channel.

---

<div align="center">

**Made with ❤️ by Your Team**

[⬆ Back to Top](#-ai-powered-e-commerce-platform)

</div>
