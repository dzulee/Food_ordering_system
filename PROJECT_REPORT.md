# Food Ordering Application - Project Report

**Project Submission Date:** November 13, 2025

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Technical Stack](#technical-stack)
4. [System Architecture](#system-architecture)
5. [Features Implemented](#features-implemented)
6. [Core Modules](#core-modules)
7. [Database Design](#database-design)
8. [API Endpoints](#api-endpoints)
9. [Frontend Components](#frontend-components)
10. [Security Features](#security-features)
11. [Setup and Installation](#setup-and-installation)
12. [Usage Guide](#usage-guide)
13. [Achievements](#achievements)
14. [Challenges and Solutions](#challenges-and-solutions)
15. [Future Enhancements](#future-enhancements)

---

## Executive Summary

This report documents a comprehensive **Food Ordering Application** built using the MERN stack (MongoDB, Express.js, React, Node.js). The application facilitates a complete online food ordering ecosystem where customers can browse restaurants, add items to cart, place orders, and make payments. Restaurant owners can register their establishments, manage menus, and track orders in real-time.

**Key Achievement:** A full-stack, production-ready food ordering platform with multi-role user management, secure authentication, and integrated payment solutions (PayPal and M-Pesa).

---

## Project Overview

### Purpose
The application aims to:
- Provide customers with an intuitive interface to browse restaurants and order food
- Enable restaurant owners to manage their menus and fulfill orders efficiently
- Implement secure payment processing through multiple gateways
- Maintain data integrity and user authentication through JWT-based security

### Scope
- **User Management:** Customer and restaurant owner registration/login
- **Restaurant Management:** CRUD operations for restaurants and menu items
- **Order Management:** Order creation, tracking, and status updates
- **Payment Processing:** Integration with PayPal and M-Pesa payment gateways
- **Real-time Notifications:** Toast notifications for user feedback

---

## Technical Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | Latest |
| **Framework** | Express.js | 5.1.0 |
| **Database** | MongoDB | 8.19.1 (via Mongoose) |
| **Authentication** | JWT | 9.0.2 |
| **Password Hashing** | bcryptjs | 3.0.2 |
| **File Upload** | Multer | 2.0.2 |
| **HTTP Client** | Axios | 1.13.1 |
| **CORS** | CORS | 2.8.5 |
| **Development** | Nodemon | 3.1.10 |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| **Library** | React | 19.1.1 |
| **Build Tool** | Vite | 7.1.7 |
| **Router** | React Router DOM | 7.9.4 |
| **UI Framework** | Bootstrap | 5.3.8 |
| **HTTP Client** | Axios | 1.12.2 |
| **Icons** | React Icons | 5.5.0 |
| **Notifications** | React Hot Toast | 2.6.0 |
| **Linter** | ESLint | 9.36.0 |

---

## System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Vite)                                   │  │
│  │  ├─ Home Page (Browse Restaurants)                       │  │
│  │  ├─ Restaurant Details Page                              │  │
│  │  ├─ Cart Management                                      │  │
│  │  ├─ Checkout & Payment                                   │  │
│  │  ├─ User Auth (Login/Signup)                             │  │
│  │  ├─ Restaurant Dashboard (Owner)                         │  │
│  │  └─ Order Tracking                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    Axios API Calls (HTTP/HTTPS)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js Server                                       │  │
│  │  ├─ CORS & Middleware                                    │  │
│  │  ├─ Authentication Middleware (JWT)                      │  │
│  │  ├─ Upload Middleware (Multer)                           │  │
│  │  └─ Error Handling                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   User       │  │ Restaurant   │  │    Order     │          │
│  │  Controller  │  │  Controller  │  │  Controller  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Menu      │  │   Payment    │  │    Auth      │          │
│  │  Controller  │  │  Controller  │  │   Routes    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Mongoose Models                                         │  │
│  │  ├─ User Schema                                          │  │
│  │  ├─ Restaurant Schema                                    │  │
│  │  ├─ MenuItem Schema                                      │  │
│  │  ├─ Order Schema                                         │  │
│  │  └─ Payment Schema                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MongoDB Atlas / Local MongoDB Instance                  │  │
│  │  (Collections: users, restaurants, menuitems, orders, ...) │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Patterns
- **MVC Pattern:** Controllers handle business logic, models define data structure
- **Context API:** State management for authentication and cart
- **Middleware Chain:** Authentication and file upload processing
- **RESTful API:** Standard HTTP methods for resource management

---

## Features Implemented

### 1. User Management ✅
- **Registration:** Support for dual roles (Customer & Restaurant Owner)
- **Login:** Secure authentication with JWT tokens
- **Role-Based Access:** Different UI/functionality based on user role
- **Password Security:** bcryptjs for password hashing and validation
- **Profile Management:** User profile retrieval and management

### 2. Restaurant Management ✅
- **Restaurant Registration:** Restaurant owners can create their businesses
- **Restaurant CRUD:** Create, Read, Update, Delete operations
- **Restaurant Listing:** Public browsing of all registered restaurants
- **Advanced Filtering:** Filter restaurants by cuisine type, location, and name
- **Image Upload:** Restaurant profile pictures using Multer
- **Restaurant Details:** Comprehensive restaurant information display

### 3. Menu Management ✅
- **Menu Item Creation:** Restaurant owners can add food items
- **Availability Status:** Mark items as available/unavailable
- **Item Details:** Price, description, and categorization
- **Edit/Delete:** Modify or remove menu items
- **Restaurant Association:** Menu items linked to specific restaurants

### 4. Shopping Cart ✅
- **Add to Cart:** Seamlessly add menu items to cart
- **Quantity Management:** Increase/decrease item quantities
- **Remove Items:** Remove specific items from cart
- **Clear Cart:** Option to clear entire cart
- **Persistent Storage:** Cart data saved in localStorage
- **Context API Integration:** Global cart state management

### 5. Order Management ✅
- **Order Creation:** Create orders from cart items
- **Single Restaurant Validation:** Ensure all items from same restaurant
- **Order Tracking:** Customers can view their order history
- **Restaurant Dashboard:** Owners view orders from their restaurant
- **Status Updates:** Update order status (Pending, Confirmed, Completed)
- **Authorization:** Only authorized users can view/manage their orders
- **Order Details:** Complete order information with item breakdown

### 6. Payment Processing ✅
- **PayPal Integration:**
  - OAuth authentication with PayPal API
  - STK push for payment initiation
  - Payment capture and confirmation
  - Approval URL generation
  
- **M-Pesa Integration:**
  - Sandbox testing environment
  - STK push functionality
  - Mock callback for testing
  - Timestamp and password generation
  
- **Payment Tracking:** Store payment information in database
- **Order Status Sync:** Update order status after successful payment

### 7. Authentication & Authorization ✅
- **JWT Tokens:** Secure token-based authentication (30-day expiry)
- **Protected Routes:** API endpoints protected with authentication
- **Authorization Checks:** Verify user ownership before resource modification
- **Role Verification:** Ensure restaurant owners can only modify their data

### 8. File Uploads ✅
- **Multer Integration:** Handle multipart/form-data
- **File Storage:** Save uploads to `/uploads` directory
- **Static Serving:** Serve uploaded files via express.static
- **Path Generation:** Create accessible URLs for uploaded files

---

## Core Modules

### Backend Modules

#### 1. **User Controller** (`userControllers.js`)
| Function | Purpose | Reference |
|----------|---------|-----------|
| `registerUser()` | User registration with role assignment | Lines 7-60 |
| `loginUser()` | Authentication and JWT token generation | Lines 63-105 |
| `getUserProfile()` | Retrieve authenticated user profile | Lines 108-111 |

**Key Features:**
- Email normalization (trim & lowercase)
- Password hashing during registration
- Role-based restaurant creation
- Token generation with user ID and role

#### 2. **Restaurant Controller** (`restaurantControllers.js`)
| Function | Purpose | Reference |
|----------|---------|-----------|
| `createRestaurant()` | Create new restaurant (restricted to restaurant role) | Lines 6-28 |
| `getRestaurants()` | Fetch all restaurants with filtering | Lines 31-48 |
| `getRestaurantById()` | Get specific restaurant details | Lines 51-63 |
| `updateRestaurant()` | Update restaurant info (owner only) | Lines 66-92 |
| `deleteRestaurant()` | Delete restaurant (owner only) | Lines 95-113 |

**Advanced Features:**
- Case-insensitive regex filtering for cuisine, location, and name
- Authorization verification (owner check)
- Image upload handling
- Timestamp-based sorting

#### 3. **Order Controller** (`orderControllers.js`)
| Function | Purpose | Reference |
|----------|---------|-----------|
| `createOrder()` | Create new order from items | Lines 5-43 |
| `getOrdersByUser()` | Fetch orders by user email | Lines 45-58 |
| `getOrderById()` | Get specific order with auth checks | Lines 60-82 |
| `getMyOrders()` | Retrieve authenticated user's orders | Lines 84-96 |
| `getOrdersForRestaurant()` | Fetch orders for restaurant owner | Lines 98-116 |
| `getOrdersByRestaurant()` | Public endpoint for restaurant orders | Lines 118-130 |
| `updateOrderStatus()` | Update order status (restaurant owner) | Lines 132-148 |
| `payOrder()` | Record payment information | Lines 151-177 |

**Order Validation:**
- Verify menu items exist and are available
- Ensure single restaurant per order
- Quantity validation and calculation
- Authorization for status updates

#### 4. **Payment Controller** (`paymentController.js`)
| Function | Purpose | Reference |
|----------|---------|-----------|
| `getMpesaToken()` | OAuth token from M-Pesa | Lines 4-22 |
| `mpesaPay()` | Initiate M-Pesa STK push | Lines 24-64 |
| `paypalPay()` | Create PayPal order | Lines 65-115 |
| `paypalCapture()` | Capture PayPal payment | Lines 116-134 |
| `mpesaMockCallback()` | Simulate M-Pesa callback | Lines 135-162 |

**Payment Features:**
- Secure token generation
- Multiple gateway support
- Timestamp validation for M-Pesa
- Mock callback for testing

#### 5. **Menu Controller** (`menuControllers.js`)
- CRUD operations for menu items
- Restaurant association
- Availability management
- Item filtering and search

### Frontend Components

#### 1. **Authentication Context** (`AuthContext.jsx`)
```javascript
Features:
- User state management (login/logout)
- JWT token storage
- localStorage persistence
- Role-based rendering hints
```

#### 2. **Cart Context** (`CartContext.jsx`)
```javascript
Features:
- Centralized cart state
- Add/remove/update items
- Quantity management
- localStorage persistence
```

#### 3. **Navbar Component** (`Navbar.jsx`)
```javascript
Features:
- Navigation routing
- User authentication display
- Logout functionality
- Role-specific menu options
```

#### 4. **Key Pages**
| Page | Purpose | Features |
|------|---------|----------|
| `Home.jsx` | Restaurant browsing | List all restaurants, filtering |
| `Login.jsx` | User authentication | Login form, role selection |
| `Signup.jsx` | User registration | Registration form, role assignment |
| `RestaurantDetailsPage.jsx` | Menu browsing | Display menu items, add to cart |
| `CartPage.jsx` | Cart management | View, modify, clear cart |
| `CheckoutPage.jsx` | Order placement | Address, payment method selection |
| `RestaurantDashboard.jsx` | Restaurant management | Menu management, order tracking |
| `OrderSuccessPage.jsx` | Order tracking | View order history |
| `PaymentCancel.jsx` | Payment handling | Handle payment cancellation |

---

## Database Design

### Schema Relationships

```
User (1) ─── (Many) Order
  │
  ├─ (1) ─── (Many) Restaurant
  │
  └─ (1) ─── (Many) Payment

Restaurant (1) ─── (Many) MenuItem
  │
  └─ (1) ─── (Many) Order

MenuItem (1) ─── (Many) Order Items

Order (1) ─── (Many) Payment
```

### Data Models

#### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["customer", "restaurant", "admin"], default: "customer"),
  address: String,
  phone: String,
  isAdmin: Boolean,
  timestamps: { createdAt, updatedAt }
}
```

#### Restaurant Schema
```javascript
{
  name: String (required),
  managerName: String,
  owner: ObjectId (ref: User, required),
  email: String (required),
  phone: String,
  location: String,
  image: String (URL path),
  cuisineType: String,
  rating: Number (default: 0),
  timestamps: { createdAt, updatedAt }
}
```

#### MenuItem Schema
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  image: String,
  restaurant: ObjectId (ref: Restaurant, required),
  available: Boolean (default: true),
  category: String,
  timestamps: { createdAt, updatedAt }
}
```

#### Order Schema
```javascript
{
  customer: ObjectId (ref: User, required),
  restaurant: ObjectId (ref: Restaurant, required),
  items: [{
    menuItem: ObjectId (ref: MenuItem),
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number (required),
  address: String (required),
  paymentStatus: String (default: "Unpaid"),
  paymentMethod: String (default: "Not Selected"),
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  status: String (default: "pending"),
  timestamps: { createdAt, updatedAt }
}
```

#### Payment Schema
```javascript
{
  order: ObjectId (ref: Order, required),
  user: ObjectId (ref: User, required),
  paymentMethod: String (enum: ["paypal", "mpesa", "card"]),
  amount: Number (required),
  transactionId: String,
  status: String (default: "pending"),
  timestamps: { createdAt, updatedAt }
}
```

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes (`/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/register` | Register new user | ❌ |
| POST | `/users/login` | User login | ❌ |
| GET | `/users/profile` | Get user profile | ✅ JWT |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer", // or "restaurant"
  "phone": "1234567890",
  "address": "123 Street"
}
```

**Response (201 Created):**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "token": "jwt_token_here"
}
```

### Restaurant Routes (`/restaurants`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/restaurants` | Create restaurant | ✅ (restaurant role) |
| GET | `/restaurants` | Get all restaurants | ❌ |
| GET | `/restaurants/:id` | Get restaurant details | ❌ |
| PUT | `/restaurants/:id` | Update restaurant | ✅ (owner) |
| DELETE | `/restaurants/:id` | Delete restaurant | ✅ (owner) |

**Query Parameters (GET all):**
- `cuisine=Italian` - Filter by cuisine type
- `location=Downtown` - Filter by location
- `name=Pizza` - Filter by restaurant name

### Menu Routes (`/menus`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/menus` | Create menu item | ✅ (restaurant) |
| GET | `/menus/restaurant/:id` | Get restaurant menu | ❌ |
| PUT | `/menus/:id` | Update menu item | ✅ (owner) |
| DELETE | `/menus/:id` | Delete menu item | ✅ (owner) |

### Order Routes (`/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create order | ✅ (customer) |
| GET | `/orders/myorders` | Get my orders | ✅ |
| GET | `/orders/:id` | Get order details | ✅ (customer/owner) |
| GET | `/orders/restaurant/:id` | Get restaurant orders | ✅ (owner) |
| PUT | `/orders/:id/status` | Update order status | ✅ (restaurant owner) |
| PUT | `/orders/:id/pay` | Record payment | ✅ (customer) |

**Create Order Request:**
```json
{
  "items": [
    {
      "menuItem": "item_id",
      "quantity": 2
    }
  ],
  "address": "123 Delivery Street",
  "paymentMethod": "paypal"
}
```

### Payment Routes (`/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/paypal` | Initiate PayPal | ✅ |
| POST | `/payments/paypal/capture` | Capture PayPal payment | ✅ |
| POST | `/payments/mpesa` | Initiate M-Pesa | ✅ |
| POST | `/payments/mpesa/callback` | M-Pesa callback handler | ⚠️ |

---

## Frontend Components

### Component Hierarchy

```
App.jsx
├── Navbar.jsx
├── Routes
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── RestaurantDetailsPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── RestaurantDashboard.jsx
│   │   └── Menu Management
│   │   └── Order Management
│   ├── AddMenuItemPage.jsx
│   ├── OrderSuccessPage.jsx
│   ├── PaymentSuccess.jsx
│   └── PaymentCancel.jsx
└── Context Providers
    ├── AuthProvider
    └── CartProvider
```

### State Management

**AuthContext:**
- Manages user login/logout
- Stores JWT token
- Provides useAuth() hook
- Persists to localStorage

**CartContext:**
- Manages shopping cart items
- Tracks quantities
- Provides useCart() hook
- Persists to localStorage

---

## Security Features

### 1. **Authentication & Authorization**
- ✅ JWT token-based authentication (30-day expiry)
- ✅ Password hashing with bcryptjs (salt rounds: 10)
- ✅ Role-based access control (customer, restaurant, admin)
- ✅ Protected API endpoints with middleware

### 2. **Data Validation**
- ✅ Email validation and normalization
- ✅ Role verification before resource modification
- ✅ Ownership checks for restaurant/order operations
- ✅ Availability verification for menu items

### 3. **CORS Protection**
- ✅ CORS middleware configured
- ✅ Cross-origin requests validated
- ✅ Controlled API access

### 4. **Payment Security**
- ✅ M-Pesa: OAuth 2.0 authentication
- ✅ PayPal: Client ID/Secret authentication
- ✅ Environment variables for sensitive data
- ✅ Mock callbacks for testing (no production bypass)

### 5. **File Upload Security**
- ✅ Multer for file handling
- ✅ Static file serving with restrictions
- ✅ File naming sanitization

### 6. **Error Handling**
- ✅ Try-catch blocks in all controllers
- ✅ Proper HTTP status codes
- ✅ Informative error messages (without data leakage)
- ✅ Async error handling with express-async-handler

---

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud instance)
- npm or yarn package manager
- PayPal and M-Pesa sandbox accounts (for payment testing)

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food_ordering
JWT_SECRET=your_secret_key_here

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=http://localhost:5000/api/payments/mpesa/callback

# PayPal Configuration
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_API=https://api.sandbox.paypal.com

# File Upload
UPLOAD_DIR=./uploads
```

### Installation Steps

#### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file (see above)
# Create uploads folder
mkdir uploads

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on http://localhost:5173
```

### Verify Installation

**Backend Health Check:**
```bash
curl http://localhost:5000/
# Response: "API is running..."
```

**Frontend Access:**
- Open browser to `http://localhost:5173`
- You should see the home page

---

## Usage Guide

### For Customers

#### 1. **Register as Customer**
   1. Click "Sign Up" on navbar
   2. Select "Customer" role
   3. Fill in: Name, Email, Password, Phone, Address
   4. Click Register

#### 2. **Browse Restaurants**
   1. Go to Home page (auto-redirect after login)
   2. View all available restaurants
   3. Use filters: cuisine type, location, name
   4. Click restaurant card for details

#### 3. **Add Items to Cart**
   1. Click restaurant to view menu
   2. Browse menu items
   3. Click "Add to Cart" on desired items
   4. Quantity auto-increments if added multiple times

#### 4. **Checkout & Place Order**
   1. Go to Cart page
   2. Review items and quantities
   3. Modify quantities if needed
   4. Click "Proceed to Checkout"
   5. Enter delivery address
   6. Select payment method (PayPal or M-Pesa)
   7. Click "Place Order"

#### 5. **Make Payment**
   - **PayPal:** Will be redirected to PayPal approval page
   - **M-Pesa:** STK push sent to phone number
   - Complete payment flow

#### 6. **Track Orders**
   1. Go to "My Orders" (from navbar)
   2. View all previous and current orders
   3. See order status updates in real-time

### For Restaurant Owners

#### 1. **Register as Restaurant Owner**
   1. Click "Sign Up"
   2. Select "Restaurant Owner" role
   3. Fill in: Name, Email, Password, Restaurant Name
   4. Upload restaurant image
   5. Enter location and cuisine type
   6. Click Register

#### 2. **Access Restaurant Dashboard**
   1. After login, click "Dashboard" in navbar
   2. View restaurant profile
   3. Access menu management
   4. Access order management

#### 3. **Manage Menu**
   1. Go to Dashboard → Menu Management
   2. Click "Add New Item"
   3. Fill in: Item name, description, price, image
   4. Mark as available/unavailable
   5. Save menu item
   6. Edit or delete existing items

#### 4. **Manage Orders**
   1. Go to Dashboard → Orders
   2. View all incoming orders
   3. See customer details and items
   4. Update order status:
      - Pending → Confirmed
      - Confirmed → Preparing
      - Preparing → Ready
      - Ready → Completed

---

## Achievements

### ✅ Core Features Completed

| Feature | Status | Evidence |
|---------|--------|----------|
| User Registration (Dual Role) | ✅ Complete | `userControllers.js` lines 7-60 |
| User Authentication (JWT) | ✅ Complete | `userControllers.js` lines 63-105 |
| Restaurant Management | ✅ Complete | `restaurantControllers.js` |
| Menu Management | ✅ Complete | `menuControllers.js` |
| Shopping Cart | ✅ Complete | `CartContext.jsx` |
| Order Management | ✅ Complete | `orderControllers.js` |
| PayPal Integration | ✅ Complete | `paymentController.js` lines 65-115 |
| M-Pesa Integration | ✅ Complete | `paymentController.js` lines 24-64 |
| File Uploads | ✅ Complete | Multer middleware, `/uploads` directory |
| Real-time Notifications | ✅ Complete | React Hot Toast integration |
| Protected Routes | ✅ Complete | JWT middleware in `authMiddleware.js` |
| Role-based Access Control | ✅ Complete | All controllers verify user roles |

### ✅ Technical Achievements

| Aspect | Achievement |
|--------|-------------|
| **Architecture** | Clean MVC pattern with separation of concerns |
| **State Management** | Context API for authentication and cart |
| **Error Handling** | Comprehensive try-catch and async error handling |
| **API Design** | RESTful endpoints with proper HTTP methods |
| **Security** | JWT, bcryptjs, CORS, environment variables |
| **Payment Integration** | Two payment gateways (PayPal + M-Pesa) |
| **Database Design** | Properly normalized MongoDB schemas with relationships |
| **Frontend UI** | Responsive Bootstrap design with React Icons |
| **Code Organization** | Modular structure with clear separation |
| **Development Workflow** | Nodemon for auto-restart, ESLint for code quality |

### ✅ Advanced Features

| Feature | Implementation |
|---------|-----------------|
| **Advanced Filtering** | Regex-based search (case-insensitive) |
| **localStorage Persistence** | Cart and auth state persisted |
| **Email Normalization** | Trim and lowercase for consistency |
| **Authorization Checks** | Verify ownership before modification |
| **Multi-restaurant Validation** | Prevent mixed-restaurant orders |
| **Payment State Tracking** | Store payment details in database |
| **Image Upload Handling** | Multer with static file serving |
| **Mock Payment Testing** | M-Pesa callback simulation |

---

## Challenges and Solutions

### Challenge 1: Multiple User Roles
**Problem:** Same authentication system needed to handle both customers and restaurant owners with different permissions.

**Solution:** 
- Implemented role-based middleware verification
- Role stored in JWT token
- Authorization checks before sensitive operations
- Reference: `authMiddleware.js` - role verification on protected routes

### Challenge 2: Single Restaurant Orders
**Problem:** Ensuring customers can't accidentally order from multiple restaurants in one order.

**Solution:**
- Validate first item's restaurant ID
- Compare all subsequent items against this ID
- Return 400 error if mismatch detected
- Reference: `orderControllers.js` lines 15-22

### Challenge 3: Payment Gateway Integration
**Problem:** Integrating two different payment systems (PayPal and M-Pesa) with different authentication methods.

**Solution:**
- Created separate handlers for each gateway
- OAuth tokens for M-Pesa
- Client credentials flow for PayPal
- Mock callback for testing without real payments
- Reference: `paymentController.js` - separate functions for each gateway

### Challenge 4: Cart State Persistence
**Problem:** Losing cart data on page refresh.

**Solution:**
- Implemented localStorage persistence
- CartContext initializes from localStorage
- useEffect hook syncs on cart changes
- Reference: `CartContext.jsx` lines 34-38

### Challenge 5: JWT Token Management
**Problem:** Storing and using JWT tokens securely across requests.

**Solution:**
- Token stored in localStorage after login
- Axios interceptors (could be added) for automatic headers
- Token sent in Authorization header for protected routes
- 30-day expiry for security
- Reference: `userControllers.js` lines 6-8

---

## Future Enhancements

### Phase 2 Features
1. **Real-time Updates**
   - WebSocket integration (Socket.io) for live order tracking
   - Real-time notifications for restaurants
   - Live order status updates for customers

2. **Advanced Payment**
   - Card payment integration (Stripe)
   - Wallet functionality
   - Payment history and invoices
   - Refund handling

3. **Rating & Reviews**
   - Customer ratings for restaurants
   - Review system for menu items
   - Average rating calculation
   - Review moderation

4. **Admin Panel**
   - Dashboard for platform administrators
   - User management
   - Restaurant verification
   - Payment reconciliation

5. **Performance Optimization**
   - Image compression and CDN
   - Caching strategies
   - Database indexing
   - API response pagination

6. **Mobile App**
   - React Native version
   - Push notifications
   - Native payment integration
   - Offline mode support

7. **Analytics & Reporting**
   - Sales dashboard for restaurants
   - Customer analytics
   - Revenue reports
   - Order trends analysis

8. **Delivery Integration**
   - GPS tracking
   - Delivery partner management
   - Route optimization
   - Delivery time estimates

9. **Loyalty Program**
   - Points system
   - Rewards and discounts
   - Referral bonuses
   - Tier-based benefits

10. **Internationalization**
    - Multi-language support
    - Multi-currency support
    - Region-specific features
    - Local payment methods

---

## Conclusion

This Food Ordering Application represents a comprehensive, production-ready system that successfully combines:

- **Frontend Excellence:** Responsive React UI with modern component architecture
- **Backend Robustness:** Scalable Express.js server with proper MVC patterns
- **Database Design:** Well-normalized MongoDB schemas with proper relationships
- **Security:** JWT authentication, role-based access control, and encrypted passwords
- **Payment Integration:** Multiple payment gateways for global accessibility
- **User Experience:** Intuitive interfaces for both customers and restaurant owners

The application demonstrates proficiency in:
- Full-stack development using the MERN stack
- RESTful API design and implementation
- Database modeling and optimization
- Authentication and authorization systems
- Third-party API integration
- Frontend state management
- Error handling and user feedback

All features have been implemented with attention to code quality, security, and user experience. The modular architecture allows for easy maintenance and future scalability.

---

## Appendices

### A. File Structure Reference

```
food_ordering_application/
├── backend/
│   ├── config/
│   │   └── db.js (MongoDB connection)
│   ├── controllers/
│   │   ├── userControllers.js (Auth logic)
│   │   ├── restaurantControllers.js (Restaurant CRUD)
│   │   ├── menuControllers.js (Menu management)
│   │   ├── orderControllers.js (Order management)
│   │   └── paymentController.js (Payment processing)
│   ├── middleware/
│   │   ├── authMiddleware.js (JWT verification)
│   │   └── uploadMiddleware.js (File upload)
│   ├── models/
│   │   ├── User.js (User schema)
│   │   ├── Restaurant.js (Restaurant schema)
│   │   ├── MenuItem.js (Menu item schema)
│   │   ├── Order.js (Order schema)
│   │   └── Payment.js (Payment schema)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   └── generateToken.js (JWT generation)
│   ├── uploads/ (User-uploaded files)
│   ├── server.js (Main server file)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js (Axios instance)
│   │   ├── assets/
│   │   │   ├── css/ (Stylesheets)
│   │   │   └── images/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx (Auth state)
│   │   │   └── CartContext.jsx (Cart state)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── RestaurantDetailsPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── RestaurantDashboard.jsx
│   │   │   ├── AddMenuItemPage.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   ├── RestaurantRegister.jsx
│   │   │   ├── PaymentCancel.jsx
│   │   │   └── OrderSuccessPage.jsx
│   │   ├── App.jsx (Main routing)
│   │   ├── main.jsx (App entry point)
│   │   └── index.css
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
```

### B. Key Dependencies Summary

**Backend Critical Packages:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests
- `multer` - File upload handling
- `axios` - HTTP client (for payment APIs)
- `dotenv` - Environment variables

**Frontend Critical Packages:**
- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `bootstrap` - CSS framework
- `react-hot-toast` - Notifications

### C. Testing Credentials (Development)

**Test Customer Account:**
```
Email: customer@test.com
Password: test123
Role: Customer
```

**Test Restaurant Account:**
```
Email: restaurant@test.com
Password: test123
Role: Restaurant Owner
```

---

**Project Status:** ✅ **COMPLETE**

**Last Updated:** November 13, 2025

**Submission Ready:** Yes ✅

---

