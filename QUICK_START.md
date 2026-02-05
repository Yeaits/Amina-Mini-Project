# 🚀 MediPickup - Quick Start Guide

## ⚡ Fast Setup (For Your Demo Tomorrow!)

### Prerequisites
1. **Node.js** (v16 or higher) - Download from https://nodejs.org/
2. **MongoDB** - Download from https://www.mongodb.com/try/download/community
3. **Terminal/Command Prompt**

---

## 📦 Step 1: Install MongoDB (If Not Installed)

### For macOS:
```bash
brew install mongodb-community
brew services start mongodb-community
```

### For Windows:
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Or run: `"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"`

### For Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

---

## 🏗️ Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run seed script to populate database
npm run seed

# Start backend server
npm run dev
```

**Expected Output:**
```
✓ Connected to MongoDB
✓ Backend server running on http://localhost:4000
✓ Socket.IO server running
```

---

## 💻 Step 3: Setup Frontend (In New Terminal)

```bash
# Open NEW terminal window
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 🎉 Step 4: Test the Application

### 1. Open Browser
Visit: **http://localhost:3000**

### 2. Test as Customer
1. Click "Sign Up Now" or "Get Started"
2. Register with any email (e.g., `customer@test.com`)
3. Allow location access when prompted
4. You'll see nearby pharmacies on the map
5. Click "View Medicines" on any pharmacy
6. Add medicines to cart
7. Set pickup time (optional)
8. Click "Place Order"
9. View your orders at "My Orders"

### 3. Test as Admin
1. Click "Login"
2. Use demo credentials:
   - Email: `admin@demo.com`
   - Password: `password`
3. You'll be redirected to Admin Dashboard
4. You'll see all orders
5. Click "Mark as Ready" to update order status
6. Customer will receive notification!

---

## ✅ Features Checklist

- [x] User Registration & Login
- [x] GPS Tracking (2km radius)
- [x] Pharmacy Map View
- [x] Medicine Selection & Cart
- [x] Order Placement with Pickup Time
- [x] Admin Dashboard
- [x] Order Management
- [x] Real-time Notifications (Socket.IO)
- [x] Order Status Updates
- [x] Inventory Management
- [x] Responsive Design

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Problem:** `MongoNetworkError: connect ECONNREFUSED`
**Solution:** 
```bash
# Check if MongoDB is running
mongosh
# If not, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongodb           # Linux
```

### Port 3000 or 4000 Already in Use
**Problem:** `Port 3000 is already in use`
**Solution:**
```bash
# Kill the process
# macOS/Linux:
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Leaflet Map Not Showing
**Problem:** Map is blank or shows "Loading..."
**Solution:** 
- Clear browser cache
- Make sure you allowed location access
- Check browser console for errors

### No Pharmacies Showing
**Problem:** "No pharmacies found"
**Solution:**
- Make sure backend seed script ran successfully
- Check if you're too far from demo locations (San Francisco area)
- Try entering coordinates manually: 37.7749, -122.4194

### Socket.IO Not Working
**Problem:** Notifications not appearing
**Solution:**
- Make sure backend is running first
- Allow browser notifications when prompted
- Check browser console for WebSocket errors
- Restart both frontend and backend

---

## 📊 Test Data

The seed script creates:
- **1 Admin User**
  - Email: admin@demo.com
  - Password: password
  
- **3 Pharmacies** (all near San Francisco)
  - MediCare Pharmacy (37.7749, -122.4194)
  - HealthPlus Pharmacy (37.7849, -122.4094)
  - QuickMed Pharmacy (37.7649, -122.4294)

- **8 Medicines**
  - Paracetamol, Ibuprofen, Amoxicillin, Cetirizine
  - Omeprazole, Metformin, Aspirin, Vitamin D3
  - All with stock quantities 20-120 units

---

## 🎬 Demo Script for Tomorrow

1. **Start with Home Page**
   - Show GPS tracking feature
   - Point out pharmacies on map
   - Show distance calculations

2. **Customer Flow**
   - Register new user
   - Browse pharmacy medicines
   - Add items to cart
   - Set pickup time
   - Place order
   - Show order tracking

3. **Admin Flow**
   - Login as admin
   - Show dashboard statistics
   - Demonstrate receiving notification (have another browser ready)
   - Update order status
   - Show customer receiving notification

4. **Highlight Features**
   - Real-time updates (Socket.IO)
   - GPS integration
   - Inventory management
   - Professional UI/UX

---

## 🔐 Security Note

For production deployment:
1. Change JWT_SECRET in .env
2. Use environment variables for sensitive data
3. Add HTTPS
4. Implement rate limiting
5. Add input validation
6. Use proper authentication middleware

---

## 📝 Additional Notes

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:4000
- MongoDB runs on: mongodb://localhost:27017/medipickup

Keep both terminals open while testing!

---

## 🆘 Need Help?

If you encounter any issues:
1. Check that MongoDB is running
2. Verify both servers are running (frontend & backend)
3. Check browser console for errors
4. Clear browser cache and cookies
5. Try incognito/private window

---

## 🎯 Project Structure

```
medipickup/
├── backend/           # Express + MongoDB + Socket.IO
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── index.js      # Server entry point
│   └── seed.js       # Database seeding
└── frontend/         # Next.js + React
    ├── pages/        # Next.js pages
    ├── components/   # React components
    └── styles/       # Global styles
```

Good luck with your demo tomorrow! 🚀
