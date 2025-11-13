# Implementation Reference Guide

This document provides specific file locations and line references for all implemented features in the Food Ordering Application.

**Created:** November 13, 2025

---

## 📍 Backend Implementation References

### 1. Authentication & User Management

#### User Registration
**File:** `backend/controllers/userControllers.js`  
**Lines:** 7-60  
**Function:** `registerUser()`  
**Features:**
- Dual role support (customer/restaurant)
- Email normalization
- Password hashing via bcryptjs
- Restaurant creation for restaurant role
- JWT token generation

**Key Lines:**
```javascript
// Line 13: Email normalization
const normalizedEmail = email.trim().toLowerCase();

// Line 20: Password hashed automatically by pre-save hook
await user.save();

// Line 25-35: Restaurant creation for restaurant owners
if (role === "restaurant") {
  const restaurant = await Restaurant.create({...});
}

// Line 51: Token generation
token: generateToken(user._id, user.role),
```

#### User Login
**File:** `backend/controllers/userControllers.js`  
**Lines:** 63-105  
**Function:** `loginUser()`  
**Features:**
- Secure password comparison
- JWT token generation
- Restaurant ID retrieval
- Comprehensive logging

**Key Lines:**
```javascript
// Line 84: Password comparison
const isMatch = await bcrypt.compare(password, user.password);

// Line 102: Token generation
token: generateToken(user._id, user.role),
```

#### User Profile
**File:** `backend/controllers/userControllers.js`  
**Lines:** 108-111  
**Function:** `getUserProfile()`

---

### 2. Password Security

**File:** `backend/models/User.js`  
**Lines:** 15-21  
**Implementation:** Pre-save hook with bcryptjs

```javascript
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

---

### 3. JWT Implementation

#### Token Generation
**File:** `backend/utils/generateToken.js`  
**Function:** `generateToken(id, role)`

#### Token Verification
**File:** `backend/middleware/authMiddleware.js`  
**Function:** Middleware that:
- Extracts token from Authorization header
- Verifies token signature
- Attaches user info to req.user

---

### 4. Restaurant Management

#### Create Restaurant
**File:** `backend/controllers/restaurantControllers.js`  
**Lines:** 6-28  
**Function:** `createRestaurant()`  
**Checks:**
- Line 8: Role verification (restaurant only)
- Image upload handling

#### Get All Restaurants
**File:** `backend/controllers/restaurantControllers.js`  
**Lines:** 31-48  
**Function:** `getRestaurants()`  
**Features:**
- Line 34-36: Advanced filtering with regex
- Case-insensitive search
- Timestamp sorting (Line 39)

#### Get Restaurant by ID
**File:** `backend/controllers/restaurantControllers.js`  
**Lines:** 51-63  
**Function:** `getRestaurantById()`

#### Update Restaurant
**File:** `backend/controllers/restaurantControllers.js`  
**Lines:** 66-92  
**Function:** `updateRestaurant()`  
**Checks:**
- Line 73: Ownership verification
- Image replacement support

#### Delete Restaurant
**File:** `backend/controllers/restaurantControllers.js`  
**Lines:** 95-113  
**Function:** `deleteRestaurant()`  
**Checks:**
- Line 101: Ownership verification

---

### 5. Menu Management

**File:** `backend/controllers/menuControllers.js`  
**Functions:**
- `createMenuItem()` - Create menu item
- `getMenuByRestaurant()` - Get restaurant menu
- `updateMenuItem()` - Update menu item
- `deleteMenuItem()` - Delete menu item

---

### 6. Order Management

#### Create Order
**File:** `backend/controllers/orderControllers.js`  
**Lines:** 5-43  
**Function:** `createOrder()`  
**Validations:**
- Line 10: Check items exist
- Line 15: Menu item availability check
- Line 16-22: Single restaurant validation
- Line 24: Quantity validation
- Line 28-30: Total calculation

#### Get User Orders
**File:** `backend/controllers/orderControllers.js`  
**Lines:** 84-96  
**Function:** `getMyOrders()`  
**Features:**
- Sorted by newest first (Line 87)
- Populated restaurant info

#### Get Order by ID
**File:** `backend/controllers/orderControllers.js`  
**Lines:** 60-82  
**Function:** `getOrderById()`  
**Authorization:**
- Line 65-67: Customer authorization check
- Line 69-72: Owner authorization check

#### Get Restaurant Orders
**File:** `backend/controllers/orderControllers.js`  
**Lines:** 98-116  
**Function:** `getOrdersForRestaurant()`  
**Authorization:**
- Line 100: Restaurant owner verification

#### Update Order Status
**File:** `backend/controllers/orderControllers.js`  
**Lines:** 132-148  
**Function:** `updateOrderStatus()`  
**Features:**
- Line 138: Only owner can update
- Status update capability

---

### 7. Payment Gateway Integration

#### PayPal Integration
**File:** `backend/controllers/paymentController.js`  

**Get OAuth Token (Lines 65-115)**
```javascript
const tokenResponse = await axios({
  url: `${process.env.PAYPAL_API}/v1/oauth2/token`,
  method: "post",
  auth: {
    username: process.env.PAYPAL_CLIENT_ID,
    password: process.env.PAYPAL_CLIENT_SECRET,
  },
  params: { grant_type: "client_credentials" },
});
```

**Create PayPal Order**
- Lines 75-95: Create order with purchase units
- Lines 96-103: Build return URLs

**Capture Payment (Lines 116-134)**
```javascript
const capture = await axios.post(
  `${process.env.PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
  {},
  { headers: { Authorization: `Bearer ${accessToken}` } }
);
```

#### M-Pesa Integration
**File:** `backend/controllers/paymentController.js`  

**Get M-Pesa Token (Lines 4-22)**
```javascript
const { data } = await axios.get(
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
  {
    auth: {
      username: process.env.MPESA_CONSUMER_KEY,
      password: process.env.MPESA_CONSUMER_SECRET,
    },
  }
);
```

**M-Pesa STK Push (Lines 24-64)**
- Line 34: Timestamp generation (14 digits)
- Line 36-38: Password generation with Base64 encoding
- Line 40-57: STK push request to M-Pesa API

**Mock M-Pesa Callback (Lines 135-162)**
```javascript
const payment = await Payment.create({
  order: order._id,
  user: order.customer,
  paymentMethod: "mpesa",
  amount: order.totalAmount,
  status: "success",
  transactionId: `TEST${Date.now()}`,
});
```

---

### 8. Database Models

#### User Schema
**File:** `backend/models/User.js`

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["customer", "restaurant", "admin"]),
  address: String,
  phone: String,
  isAdmin: Boolean,
  timestamps: { createdAt, updatedAt }
}
```

**Pre-save Hook (Lines 15-21):** Password hashing

#### Restaurant Schema
**File:** `backend/models/Restaurant.js`

```javascript
{
  name: String (required),
  managerName: String,
  owner: ObjectId (ref: "User", required),
  email: String (required),
  phone: String,
  location: String,
  image: String,
  cuisineType: String,
  rating: Number,
  timestamps: { createdAt, updatedAt }
}
```

#### MenuItem Schema
**File:** `backend/models/MenuItem.js`

```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  image: String,
  restaurant: ObjectId (ref: "Restaurant", required),
  available: Boolean (default: true),
  timestamps: { createdAt, updatedAt }
}
```

#### Order Schema
**File:** `backend/models/Order.js`

```javascript
{
  customer: ObjectId (ref: "User", required),
  restaurant: ObjectId (ref: "Restaurant", required),
  items: [{
    menuItem: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number (required),
  address: String (required),
  paymentStatus: String,
  paymentMethod: String,
  timestamps: { createdAt, updatedAt }
}
```

#### Payment Schema
**File:** `backend/models/Payment.js`

```javascript
{
  order: ObjectId (ref: "Order", required),
  user: ObjectId (ref: "User", required),
  paymentMethod: String,
  amount: Number (required),
  transactionId: String,
  status: String,
  timestamps: { createdAt, updatedAt }
}
```

---

### 9. Middleware

#### Authentication Middleware
**File:** `backend/middleware/authMiddleware.js`  
**Purpose:** Verify JWT token and attach user to request

#### Upload Middleware
**File:** `backend/middleware/uploadMiddleware.js`  
**Purpose:** Multer configuration for file uploads

---

### 10. Server Configuration

#### Main Server File
**File:** `backend/server.js`  

**Key Lines:**
- Line 1-10: Imports
- Line 12: dotenv configuration
- Line 14: Database connection
- Line 18: CORS middleware
- Line 19: JSON parsing
- Line 20: Static file serving for uploads
- Line 22-27: API route mounting
- Line 34-35: Server startup

---

## 📍 Frontend Implementation References

### 1. Authentication Context

**File:** `frontend/src/context/AuthContext.jsx`

**Authentication State:**
```javascript
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};
```

**localStorage Persistence (Lines 16-24):**
```javascript
useEffect(() => {
  if (state.user) {
    localStorage.setItem("userInfo", JSON.stringify(state.user));
  } else {
    localStorage.removeItem("userInfo");
  }
}, [state.user]);
```

**Hook:** `useAuth()` - Access authentication context

---

### 2. Cart Context

**File:** `frontend/src/context/CartContext.jsx`

**Cart Reducer (Lines 5-37):**
- ADD_ITEM: Add or increment quantity
- REMOVE_ITEM: Remove specific item
- UPDATE_QUANTITY: Modify quantity
- CLEAR_CART: Empty cart

**localStorage Persistence (Lines 42-46):**
```javascript
const [cart, dispatch] = useReducer(cartReducer, [], () => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
```

**Hook:** `useCart()` - Access cart context

---

### 3. API Layer

**File:** `frontend/src/api/api.js`  
**Purpose:** Axios instance configuration with base URL and default headers

---

### 4. Pages

#### Home Page
**File:** `frontend/src/pages/Home.jsx`  
**Features:**
- Display all restaurants
- Filter functionality
- Search capability

#### Login Page
**File:** `frontend/src/pages/Login.jsx`  
**Features:**
- Email and password input
- Form submission
- Error handling

#### Signup Page
**File:** `frontend/src/pages/Signup.jsx`  
**Features:**
- Dual role selection
- Conditional field display
- Form validation

#### Restaurant Details Page
**File:** `frontend/src/pages/RestaurantDetailsPage.jsx`  
**Features:**
- Display restaurant info
- Show menu items
- Add to cart functionality

#### Cart Page
**File:** `frontend/src/pages/CartPage.jsx`  
**Features:**
- Display cart items
- Modify quantities
- Remove items
- Calculate totals
- Proceed to checkout

#### Checkout Page
**File:** `frontend/src/pages/CheckoutPage.jsx`  
**Features:**
- Address input
- Payment method selection
- Order creation
- Payment initiation

#### Restaurant Dashboard
**File:** `frontend/src/pages/RestaurantDashboard.jsx`  
**Features:**
- Menu management
- Order management
- Status updates

#### Add Menu Item Page
**File:** `frontend/src/pages/AddMenuItemPage.jsx`  
**Features:**
- Item form
- Image upload
- Save to database

#### Order Success Page
**File:** `frontend/src/pages/OrderSuccessPage.jsx`  
**Features:**
- Order confirmation
- Order history
- Status tracking

#### Payment Cancel Page
**File:** `frontend/src/pages/PaymentCancel.jsx`  
**Features:**
- Cancellation handling
- Redirect options

#### Restaurant Register Page
**File:** `frontend/src/pages/RestaurantRegister.jsx`  
**Features:**
- Restaurant-specific registration
- Image upload

---

### 5. Components

#### Navbar Component
**File:** `frontend/src/components/Navbar.jsx`  
**Features:**
- Navigation links
- User display
- Logout button
- Role-based menu

---

### 6. Styling

**Global Styles:** `frontend/src/index.css`  
**Component Styles:** 
- `frontend/src/assets/css/auth.css`
- `frontend/src/assets/css/global.css`
- `frontend/src/assets/css/home.css`
- `frontend/src/assets/css/navbar.css`
- `frontend/src/assets/css/restaurant.css`

---

### 7. Main App File

**File:** `frontend/src/App.jsx`  
**Purpose:** Main routing configuration with all routes

**Routes (Lines 20-38):**
- "/" → Home
- "/login" → Login
- "/register" → Signup
- "/cart" → CartPage
- "/checkout" → CheckoutPage
- "/my-orders" → OrderSuccessPage
- "/restaurant/:id" → RestaurantDetails
- "/add-menu/:id" → AddMenuItemPage
- "/dashboard" → RestaurantDashboard
- "/register-restaurant" → RestaurantRegister
- "/payment-success" → PaymentSuccess
- "/payment-cancel" → PaymentCancel

---

## 🔗 Database Relationships

### One-to-Many Relationships

**User → Restaurant (Line 1)**
```
One User can own multiple Restaurants
Foreign Key: Restaurant.owner references User._id
```

**User → Order (Line 2)**
```
One User can place multiple Orders
Foreign Key: Order.customer references User._id
```

**User → Payment (Line 3)**
```
One User can have multiple Payments
Foreign Key: Payment.user references User._id
```

**Restaurant → MenuItem (Line 4)**
```
One Restaurant has many MenuItems
Foreign Key: MenuItem.restaurant references Restaurant._id
```

**Restaurant → Order (Line 5)**
```
One Restaurant fulfills many Orders
Foreign Key: Order.restaurant references Restaurant._id
```

**Order → Payment (Line 6)**
```
One Order has Payment(s)
Foreign Key: Payment.order references Order._id
```

---

## 🛣️ API Route Mappings

### User Routes
**File:** `backend/routes/authRoutes.js`

```
POST   /register
POST   /login
GET    /profile
```

### Restaurant Routes
**File:** `backend/routes/restaurantRoutes.js`

```
POST   /
GET    /
GET    /:id
PUT    /:id
DELETE /:id
```

### Menu Routes
**File:** `backend/routes/menuRoutes.js`

```
POST   /
GET    /restaurant/:id
PUT    /:id
DELETE /:id
```

### Order Routes
**File:** `backend/routes/orderRoutes.js`

```
POST   /
GET    /myorders
GET    /:id
GET    /restaurant/:id
PUT    /:id/status
PUT    /:id/pay
```

### Payment Routes
**File:** `backend/routes/paymentRoutes.js`

```
POST   /paypal
POST   /paypal/capture
POST   /mpesa
POST   /mpesa/callback
```

---

## 📦 Dependencies Reference

### Backend (package.json)
**Location:** `backend/package.json`

| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.1.0 | Web framework |
| mongoose | 8.19.1 | MongoDB ODM |
| jsonwebtoken | 9.0.2 | JWT tokens |
| bcryptjs | 3.0.2 | Password hashing |
| cors | 2.8.5 | CORS middleware |
| multer | 2.0.2 | File uploads |
| axios | 1.13.1 | HTTP client |
| dotenv | 17.2.3 | Environment config |
| nodemon | 3.1.10 | Dev server |

### Frontend (package.json)
**Location:** `frontend/package.json`

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.1.1 | UI library |
| vite | 7.1.7 | Build tool |
| react-router-dom | 7.9.4 | Routing |
| bootstrap | 5.3.8 | CSS framework |
| axios | 1.12.2 | HTTP client |
| react-hot-toast | 2.6.0 | Notifications |
| react-icons | 5.5.0 | Icons |

---

## 🔐 Security Implementation

### Password Hashing
**Location:** `backend/models/User.js` (Lines 15-21)  
**Algorithm:** bcryptjs with 10 salt rounds

### JWT Implementation
**Location:** `backend/utils/generateToken.js`  
**Expiry:** 30 days  
**Payload:** { id, role }

### Middleware Chain
**Location:** `backend/middleware/`
1. CORS middleware
2. JSON parser
3. Static file server
4. Route handlers
5. Error handlers

---

## 📝 Environment Configuration

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food_ordering
JWT_SECRET=your_secret_key
MPESA_CONSUMER_KEY=key
MPESA_CONSUMER_SECRET=secret
MPESA_SHORTCODE=174379
PAYPAL_CLIENT_ID=id
PAYPAL_CLIENT_SECRET=secret
PAYPAL_API=https://api.sandbox.paypal.com
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Testing Paths

### Register User Flow
```
POST /api/users/register
→ Validation (email unique, password required)
→ Password hashing (pre-save hook)
→ User creation
→ Restaurant creation (if restaurant role)
→ Token generation
→ Response with token
```

### Login Flow
```
POST /api/users/login
→ Find user by email
→ Compare password
→ Generate token
→ Retrieve restaurant ID (if applicable)
→ Response with token
```

### Order Flow
```
POST /api/orders
→ Validate items exist
→ Check availability
→ Verify single restaurant
→ Calculate total
→ Create order
→ Clear cart (frontend)
→ Redirect to checkout
```

### Payment Flow (PayPal)
```
POST /api/payments/paypal
→ Get OAuth token
→ Create PayPal order
→ Return approval URL
→ [Customer approves on PayPal]
→ POST /api/payments/paypal/capture
→ Capture payment
→ Update order status
```

---

## 📊 File Statistics

| Category | Count |
|----------|-------|
| Backend Controllers | 5 |
| Backend Routes | 5 |
| Backend Models | 5 |
| Backend Middleware | 2+ |
| Frontend Pages | 11 |
| Frontend Components | 3+ |
| Frontend Contexts | 2 |
| API Endpoints | 23+ |
| CSS Files | 5+ |
| Configuration Files | 4+ |

---

**Last Updated:** November 13, 2025  
**Version:** 1.0.0  
**Status:** ✅ COMPLETE

