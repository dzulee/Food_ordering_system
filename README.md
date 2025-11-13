# README.md

# Food Ordering Application

A comprehensive full-stack food ordering platform where customers can browse restaurants, order food, and make payments, while restaurant owners manage their menus and orders.

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [API Overview](#api-overview)
- [Usage Examples](#usage-examples)
- [Security](#security)
- [Contributing](#contributing)
- [Support](#support)

---

## ✨ Features

### For Customers
- 🔐 Secure registration and login
- 🏪 Browse all registered restaurants
- 🔍 Filter restaurants by cuisine, location, and name
- 🍽️ View detailed menu items with prices
- 🛒 Add items to shopping cart with quantity management
- 💳 Checkout with address entry
- 💰 Pay via PayPal or M-Pesa
- 📱 Track order status in real-time
- 📜 View complete order history

### For Restaurant Owners
- 🏢 Register and manage restaurant profile
- 📸 Upload restaurant images
- ➕ Add, edit, and delete menu items
- ✅ Mark items as available/unavailable
- 📊 View incoming orders
- 🔄 Update order status (Pending → Completed)
- 👥 See customer details with each order
- 📈 Track daily business

### General
- 🔒 Secure JWT-based authentication
- 👥 Dual-role user system (customer & restaurant owner)
- 📁 File upload handling
- 🔔 Real-time toast notifications
- 📱 Responsive mobile-friendly design
- 🌍 CORS-enabled API

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.1 - UI Library
- **Vite** 7.1.7 - Build tool and dev server
- **Bootstrap** 5.3.8 - CSS Framework
- **React Router** 7.9.4 - Client-side routing
- **Axios** 1.12.2 - HTTP client
- **React Hot Toast** 2.6.0 - Notifications
- **React Icons** 5.5.0 - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** 5.1.0 - Web framework
- **MongoDB** 8.19.1 - Database (via Mongoose)
- **JWT** 9.0.2 - Authentication tokens
- **bcryptjs** 3.0.2 - Password hashing
- **Multer** 2.0.2 - File upload handling
- **Axios** 1.13.1 - HTTP client
- **CORS** 2.8.5 - Cross-origin support

### Tools
- **Nodemon** 3.1.10 - Auto-restart development
- **ESLint** 9.36.0 - Code linting

---

## 📁 Project Structure

```
food_ordering_application/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── userControllers.js    # User auth logic
│   │   ├── restaurantControllers.js
│   │   ├── menuControllers.js
│   │   ├── orderControllers.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── uploadMiddleware.js   # File upload config
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── uploads/                  # User-uploaded files
│   ├── server.js
│   ├── .env                      # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js           # Axios configuration
    │   ├── assets/
    │   │   ├── css/             # Stylesheets
    │   │   └── images/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Auth state
    │   │   └── CartContext.jsx  # Cart state
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── RestaurantDetailsPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── RestaurantDashboard.jsx
    │   │   ├── AddMenuItemPage.jsx
    │   │   ├── OrderSuccessPage.jsx
    │   │   ├── RestaurantRegister.jsx
    │   │   └── PaymentCancel.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    ├── .env.local                # Frontend environment
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation & Setup

#### 1. Clone the repository
```bash
cd food_ordering_application
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
# Add configuration (see Configuration section below)

# Create uploads directory
mkdir uploads

# Start development server
npm run dev

# Backend runs on http://localhost:5000
```

#### 3. Frontend Setup (in new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

#### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

---

## ⚙️ Configuration

### Backend Environment Variables (.env)

Create `backend/.env` file:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/food_ordering
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food_ordering

# JWT
JWT_SECRET=your_random_secret_key_here_at_least_32_characters

# M-Pesa Configuration (Sandbox)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=http://localhost:5000/api/payments/mpesa/callback

# PayPal Configuration (Sandbox)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_API=https://api.sandbox.paypal.com

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB
```

### Frontend Environment Variables (.env.local)

Create `frontend/.env.local` file:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 Documentation

### Main Documentation Files

1. **PROJECT_REPORT.md** - Comprehensive project report with:
   - Executive summary
   - Technical architecture
   - Database design
   - API endpoints documentation
   - Features breakdown
   - Security features
   - Achievements and challenges

2. **TECHNICAL_GUIDE.md** - Implementation details including:
   - Architecture overview
   - Feature breakdown
   - Database schemas
   - Development workflow
   - Debugging tips
   - Performance optimization

3. **SUBMISSION_SUMMARY.md** - Quick overview with:
   - What was achieved
   - User journeys
   - Key metrics
   - How to run the app
   - Technology summary

---

## 🔌 API Overview

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```
POST   /users/register          - Register new user
POST   /users/login             - User login
GET    /users/profile           - Get user profile [Protected]
```

### Restaurant Endpoints
```
GET    /restaurants             - Get all restaurants
GET    /restaurants/:id         - Get restaurant details
POST   /restaurants             - Create restaurant [Protected]
PUT    /restaurants/:id         - Update restaurant [Protected]
DELETE /restaurants/:id         - Delete restaurant [Protected]
```

### Order Endpoints
```
POST   /orders                  - Create order [Protected]
GET    /orders/myorders         - Get user's orders [Protected]
GET    /orders/:id              - Get order details [Protected]
PUT    /orders/:id/status       - Update order status [Protected]
```

### Payment Endpoints
```
POST   /payments/paypal         - Initiate PayPal payment [Protected]
POST   /payments/mpesa          - Initiate M-Pesa payment [Protected]
```

For detailed API documentation, refer to **PROJECT_REPORT.md**

---

## 💡 Usage Examples

### Register as Customer
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123",
    "role": "customer",
    "phone": "1234567890",
    "address": "123 Main St"
  }'
```

### Register as Restaurant Owner
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@restaurant.com",
    "password": "secure123",
    "role": "restaurant",
    "restaurantName": "Jane's Kitchen",
    "location": "Downtown",
    "phone": "9876543210"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"menuItem": "item_id_1", "quantity": 2},
      {"menuItem": "item_id_2", "quantity": 1}
    ],
    "address": "123 Delivery St",
    "paymentMethod": "paypal"
  }'
```

---

## 🔒 Security

### Features
✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcryptjs with 10 salt rounds  
✅ **Role-Based Access** - Different permissions per role  
✅ **Authorization Checks** - Ownership verification  
✅ **Input Validation** - Email normalization, data validation  
✅ **CORS Protection** - Controlled cross-origin access  
✅ **Protected Routes** - API endpoints require authentication  
✅ **Environment Variables** - Sensitive data not hardcoded  

For detailed security information, see **PROJECT_REPORT.md**

---

## 📖 Available Scripts

### Backend
```bash
npm run dev      # Start development server with hot reload
npm run start    # Start production server
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check MongoDB Atlas credentials
- Verify `MONGODB_URI` in `.env`

### CORS Error
- Backend CORS middleware should be enabled in `server.js`
- Check frontend API URL matches backend server

### JWT Error
- Verify `JWT_SECRET` is set in `.env`
- Check token format: `Authorization: Bearer <token>`

### Port Already in Use
- Change `PORT` in `.env` (default: 5000)
- Or kill process using the port

### File Upload Error
- Ensure `/uploads` directory exists
- Check file permissions
- Verify `MAX_FILE_SIZE` in `.env`

---

## 📝 Environment Setup Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed or Atlas account created
- [ ] `.env` file created in backend directory
- [ ] `.env.local` file created in frontend directory
- [ ] Dependencies installed (`npm install`)
- [ ] `/uploads` directory created in backend
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173

---

## 🚢 Deployment

### Backend Deployment
1. Deploy to Heroku, Railway, Render, or AWS
2. Set production environment variables
3. Use MongoDB Atlas for database
4. Update CORS origins for production domain

### Frontend Deployment
1. Run `npm run build` to create optimized build
2. Deploy to Vercel, Netlify, or GitHub Pages
3. Update API URL to production backend
4. Configure environment variables

---

## 📞 Support & Documentation

- **Project Report:** `PROJECT_REPORT.md` - Comprehensive documentation
- **Technical Guide:** `TECHNICAL_GUIDE.md` - Implementation details
- **Submission Summary:** `SUBMISSION_SUMMARY.md` - Quick overview
- **API Reference:** See `PROJECT_REPORT.md` → API Endpoints section

---

## 📄 License

ISC License - See LICENSE file for details

---

## 👨‍💻 Author

Food Ordering Application Project  
**Submission Date:** November 13, 2025

---

## ✅ Project Status

- ✅ All core features implemented
- ✅ Full-stack development complete
- ✅ Security features implemented
- ✅ Payment gateways integrated
- ✅ Ready for production
- ✅ Documentation complete
- ✅ Ready for submission

---

**Last Updated:** November 13, 2025  
**Status:** 🟢 Production Ready

---

## Quick Links

- 🚀 [Quick Start](#quick-start)
- ⚙️ [Configuration](#configuration)
- 📚 [Documentation](#documentation)
- 🔌 [API Overview](#api-overview)
- 🔒 [Security](#security)
- 🐛 [Troubleshooting](#troubleshooting)

