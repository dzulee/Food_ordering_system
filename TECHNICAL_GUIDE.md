# Technical Implementation Guide

## Quick Start

### Prerequisites
- Node.js v14+
- MongoDB
- npm

### Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## Architecture Overview

### Technology Stack
- **Frontend:** React 19 + Vite + Bootstrap 5
- **Backend:** Node.js + Express 5 + MongoDB 8
- **Authentication:** JWT (30-day expiry)
- **Payments:** PayPal + M-Pesa
- **State Management:** React Context API

---

## Key Features Breakdown

### 1. Authentication System

**Location:** `backend/controllers/userControllers.js`

```javascript
// Registration supports dual roles:
// - Customer: Individual food buyer
// - Restaurant: Restaurant owner managing business

// Password: Automatically hashed with bcryptjs (10 salt rounds)
// Token: JWT with 30-day expiry containing userId and role
```

**Flow:**
1. User submits email/password
2. Email normalized (lowercase, trim)
3. Password hashed before storage
4. JWT token generated with user role
5. Token sent to frontend, stored in localStorage

### 2. Restaurant Management

**Location:** `backend/controllers/restaurantControllers.js`

**Operations:**
- Create restaurant (restaurant role only)
- List all restaurants (public)
- Filter by cuisine, location, name (regex, case-insensitive)
- Update restaurant info (owner only)
- Delete restaurant (owner only)

**Example Query:**
```
GET /api/restaurants?cuisine=Italian&location=Downtown&name=Pizza
```

### 3. Order Processing

**Location:** `backend/controllers/orderControllers.js`

**Validation:**
- All items from same restaurant
- Items must be available
- Positive quantities
- Authorization checks for viewing

**Status Flow:**
```
Pending → Confirmed → Preparing → Ready → Completed
```

### 4. Payment Gateway Integration

**Location:** `backend/controllers/paymentController.js`

#### PayPal Flow:
1. Generate OAuth token
2. Create order in PayPal
3. Return approval URL
4. Customer approves payment
5. Capture payment
6. Update order status

#### M-Pesa Flow:
1. Generate OAuth token
2. Send STK push to phone
3. Customer enters PIN on phone
4. M-Pesa confirms payment
5. Update order status

### 5. Frontend State Management

**Authentication Context** (`frontend/src/context/AuthContext.jsx`):
- Stores user info and JWT
- Handles login/logout
- Persists to localStorage
- Clears cart on logout

**Cart Context** (`frontend/src/context/CartContext.jsx`):
- Manages shopping cart
- Add/remove/update items
- Persists to localStorage
- Calculates totals

---

## Database Schemas

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer|restaurant|admin),
  address: String,
  phone: String,
  createdAt: Timestamp
}
```

### Restaurant
```javascript
{
  name: String,
  owner: ObjectId (ref: User),
  email: String,
  phone: String,
  location: String,
  image: String (URL path),
  cuisineType: String,
  rating: Number,
  createdAt: Timestamp
}
```

### MenuItem
```javascript
{
  name: String,
  description: String,
  price: Number,
  restaurant: ObjectId (ref: Restaurant),
  available: Boolean,
  image: String,
  createdAt: Timestamp
}
```

### Order
```javascript
{
  customer: ObjectId (ref: User),
  restaurant: ObjectId (ref: Restaurant),
  items: [{
    menuItem: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  address: String,
  paymentStatus: String,
  paymentMethod: String,
  status: String,
  createdAt: Timestamp
}
```

---

## API Endpoints Reference

### Authentication
```
POST   /api/users/register
POST   /api/users/login
GET    /api/users/profile         [Protected]
```

### Restaurants
```
POST   /api/restaurants            [Protected: restaurant role]
GET    /api/restaurants
GET    /api/restaurants/:id
PUT    /api/restaurants/:id        [Protected: owner]
DELETE /api/restaurants/:id        [Protected: owner]
```

### Menu Items
```
POST   /api/menus                  [Protected: restaurant]
GET    /api/menus/restaurant/:id
PUT    /api/menus/:id              [Protected: owner]
DELETE /api/menus/:id              [Protected: owner]
```

### Orders
```
POST   /api/orders                 [Protected]
GET    /api/orders/myorders        [Protected]
GET    /api/orders/:id             [Protected]
GET    /api/orders/restaurant/:id  [Protected]
PUT    /api/orders/:id/status      [Protected: owner]
PUT    /api/orders/:id/pay         [Protected]
```

### Payments
```
POST   /api/payments/paypal        [Protected]
POST   /api/payments/paypal/capture [Protected]
POST   /api/payments/mpesa         [Protected]
POST   /api/payments/mpesa/callback
```

---

## Security Features

### 1. Password Security
- **Hashing:** bcryptjs with 10 salt rounds
- **Pre-save Hook:** Automatic hashing in User model
- **Comparison:** bcryptjs.compare() in login

### 2. JWT Authentication
- **Token:** Stored in localStorage on frontend
- **Expiry:** 30 days
- **Payload:** userId, role
- **Verification:** authMiddleware validates on protected routes

### 3. Role-Based Access
- **Registration:** Dual role system (customer/restaurant)
- **Dashboard:** Different UI based on role
- **API:** Controllers check req.user.role

### 4. Authorization
- **Ownership Check:** Users can only modify their own data
- **Restaurant Owner:** Can only access their orders
- **Customer:** Can only view their orders

### 5. Input Validation
- **Email:** Normalized (lowercase, trimmed)
- **Quantities:** Positive integers only
- **Items:** Must exist and be available

---

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev
# Uses Nodemon for auto-restart on file changes
```

### Frontend Development
```bash
cd frontend
npm run dev
# Uses Vite dev server with hot reload
```

### Linting
```bash
cd frontend
npm run lint
# ESLint checks code quality
```

### Building for Production
```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

---

## Environment Variables

### Backend (.env)
```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/food_ordering

# JWT
JWT_SECRET=your_random_secret_key

# M-Pesa
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=http://localhost:5000/api/payments/mpesa/callback

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_API=https://api.sandbox.paypal.com
```

---

## Common Issues & Solutions

### Issue: CORS Error
**Solution:** Ensure CORS middleware is configured in server.js
```javascript
app.use(cors());
```

### Issue: JWT not recognized
**Solution:** 
1. Check token format in Authorization header: `Bearer {token}`
2. Verify JWT_SECRET in .env matches

### Issue: File upload not working
**Solution:**
1. Ensure `/uploads` folder exists
2. Check Multer configuration
3. Verify file permissions

### Issue: MongoDB connection error
**Solution:**
1. Check MongoDB is running
2. Verify MONGODB_URI in .env
3. Check network connectivity for Atlas

### Issue: Payment gateway errors
**Solution:**
1. Verify API credentials in .env
2. Check sandbox vs production URLs
3. Ensure network allows requests to payment APIs

---

## Testing Checklist

- [ ] User registration (customer and restaurant)
- [ ] User login and JWT generation
- [ ] Restaurant creation and listing
- [ ] Menu item management
- [ ] Add items to cart
- [ ] Modify cart quantities
- [ ] Create order from cart
- [ ] View order history
- [ ] Update order status (restaurant)
- [ ] PayPal payment flow
- [ ] M-Pesa payment flow
- [ ] Restaurant dashboard
- [ ] Filter restaurants by cuisine/location
- [ ] Logout and cart clear

---

## Performance Optimization Tips

1. **Database:** Add indexes to frequently queried fields
   ```javascript
   email: { unique: true }
   restaurant: { index: true }
   ```

2. **API:** Implement pagination for large result sets
   ```javascript
   GET /api/restaurants?page=1&limit=10
   ```

3. **Frontend:** Use React.memo for non-changing components
   ```javascript
   const MenuItem = React.memo(({item}) => {...})
   ```

4. **Caching:** Implement Redis for session management

5. **Images:** Compress and use CDN for media files

---

## Deployment Considerations

### Backend Deployment
- Use cloud platform (Heroku, Railway, Render, AWS)
- Set production environment variables
- Use MongoDB Atlas for cloud database
- Enable HTTPS only
- Configure CORS for production domain

### Frontend Deployment
- Build with `npm run build`
- Deploy to Vercel, Netlify, or GitHub Pages
- Update API URLs for production
- Enable caching headers
- Minify and compress assets

---

