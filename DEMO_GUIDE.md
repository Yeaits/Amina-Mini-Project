# 🎓 Professor Demo Guide - MediPickup Project

## 🔄 Changes Made

### 1. ✅ Updated to Hyderabad, India
- All pharmacy locations now in Hyderabad
- GPS coordinates set to Hyderabad area (17.4239, 78.4738)
- 5 pharmacies in different areas: Banjara Hills, Jubilee Hills, Madhapur, Gachibowli, Kondapur

### 2. ✅ Changed Currency to Indian Rupees (₹)
- All prices now in INR
- Indian medicine brands (Crocin, Brufen, Novamox, etc.)
- Realistic Indian medicine prices

### 3. ✅ Added Pharmacy Management
- Admins can create their own pharmacy
- Easy location capture
- Switch between multiple pharmacies
- View orders per pharmacy

---

## 🎬 Demo Script for Professors

### Preparation (Before Demo)

1. **Make sure both servers are running:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Re-run seed to get updated data:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Open TWO browser windows/tabs:**
   - Tab 1: Admin view (http://localhost:3000)
   - Tab 2: Customer view (http://localhost:3000) - use Incognito/Private mode

---

## 📱 Demo Flow

### PART 1: Setup Your Own Pharmacy (2-3 minutes)

**Tab 1 - Admin:**

1. **Login as Admin**
   - Email: `admin@demo.com`
   - Password: `password`
   - You'll see the Admin Dashboard

2. **Create Your Demo Pharmacy**
   - Click **"🏥 Manage Pharmacies"** button
   - Click **"+ Add New Pharmacy"**
   - Fill in details:
     ```
     Name: [Your Name]'s Pharmacy Demo
     Address: BITS Pilani Campus, Hyderabad
     Latitude: 17.5449
     Longitude: 78.5718
     ```
   - OR click **"📝 Fill Sample Data"** for quick setup
   - Click **"Create Pharmacy"**
   - ✅ Your pharmacy is created!

3. **Select Your Pharmacy**
   - Go back to Admin Dashboard (click "Admin Dashboard" in navbar)
   - You should see your pharmacy selected
   - Note: Orders will appear here for THIS pharmacy

---

### PART 2: Customer Orders Medicine (3-4 minutes)

**Tab 2 - Customer (Incognito/Private):**

1. **Show GPS Feature**
   - Open http://localhost:3000
   - Allow location access when prompted
   - 🗺️ Map shows nearby pharmacies with markers
   - Scroll down to see pharmacies list with distances

2. **Register as Customer**
   - Click **"Get Started"** or **"Sign Up Now"**
   - Fill registration:
     ```
     Name: Demo Student
     Email: student@test.com
     Password: password123
     Phone: +919876543210
     Account Type: Customer
     ```
   - Click **"Create Account"**

3. **Find Your Pharmacy**
   - You'll see the map with pharmacies
   - Find your pharmacy in the list (or any nearby pharmacy)
   - Click **"View Medicines"**

4. **Order Medicines**
   - Browse available medicines
   - Add 2-3 medicines to cart:
     - Click **"Add to Cart"** on Paracetamol (₹25)
     - Click **"Add to Cart"** on Ibuprofen (₹35)
     - Click **"Add to Cart"** on Vitamin D3 (₹70)
   
5. **Checkout**
   - Cart shows on the right with total
   - (Optional) Set pickup time - tomorrow at 10 AM
   - Click **"Place Order"**
   - ✅ Order placed successfully!
   - Will redirect to "My Orders" page

---

### PART 3: Admin Receives & Processes Order (2-3 minutes)

**Tab 1 - Admin:**

1. **See Real-time Notification**
   - 🔔 Browser notification: "New Order Received!"
   - Dashboard automatically refreshes
   - New order appears with "PLACED" status

2. **View Order Details**
   - See customer name and phone
   - See ordered items and quantities
   - See total amount in Rupees (₹)
   - See pickup time (if set)

3. **Process the Order**
   - Click **"Mark as Ready"** button
   - Order status changes to "READY"
   - ✅ Customer receives notification!

---

### PART 4: Customer Gets Notification (1 minute)

**Tab 2 - Customer:**

1. **Receive Notification**
   - 🔔 Browser notification: "Order Ready for Pickup!"
   - Orders page shows updated status
   - Order card shows "READY" badge in green

2. **View Order Status**
   - Click **"My Orders"** in navbar
   - See order with "READY" status
   - All order details visible

---

## 🎯 Key Features to Highlight

### 1. **GPS Tracking**
- "The system uses Geolocation API to find user's location"
- "Haversine formula calculates distances to pharmacies"
- "Shows pharmacies within 2km radius"
- "Interactive map built with Leaflet"

### 2. **Real-time Notifications**
- "Using Socket.IO for WebSocket connections"
- "Admin gets instant notification when customer orders"
- "Customer gets notification when order is ready"
- "No page refresh needed - updates in real-time"

### 3. **Inventory Management**
- "Each pharmacy has its own medicine inventory"
- "Stock levels tracked and displayed"
- "Can't order if medicine is out of stock"
- "Inventory automatically updates after order"

### 4. **Multi-pharmacy Support**
- "Admin can manage multiple pharmacy locations"
- "Each pharmacy has separate order queue"
- "Switch between pharmacies easily"

### 5. **User Roles**
- "Customer role: Browse, order, track"
- "Admin role: Manage pharmacy, view orders, update status"
- "JWT token authentication"
- "Role-based access control"

---

## 💡 Talking Points for Technical Questions

### Tech Stack:
**Frontend:**
- Next.js 13 (React framework with SSR)
- Tailwind CSS (utility-first styling)
- Leaflet (interactive maps)
- Socket.IO Client (real-time)
- Axios (API calls)

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Socket.IO Server
- bcryptjs for password hashing

### Architecture:
- RESTful API design
- WebSocket for real-time features
- Geospatial queries in MongoDB
- Client-side state management
- Responsive mobile-first design

### Security:
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- CORS configuration

---

## 🐛 Troubleshooting During Demo

### Problem: Map not showing
**Solution:** Refresh the page, ensure location permission granted

### Problem: No pharmacies visible
**Solution:** Check if you're allowing location access, or default Hyderabad location should show

### Problem: Notification not appearing
**Solution:** Make sure you clicked "Allow" for browser notifications

### Problem: Order not appearing in admin
**Solution:** Make sure correct pharmacy is selected in admin dashboard

---

## 📊 Test Data Available

After running `npm run seed`:

**Pharmacies in Hyderabad:**
1. MediCare Pharmacy - Banjara Hills
2. HealthPlus Pharmacy - Jubilee Hills
3. QuickMed Pharmacy - Madhapur, HITEC City
4. Apollo Pharmacy - Gachibowli
5. MedPlus Pharmacy - Kondapur

**Medicines (10 items):**
- Paracetamol (₹25)
- Ibuprofen (₹35)
- Amoxicillin (₹85)
- Cetirizine (₹40)
- Omeprazole (₹65)
- Metformin (₹50)
- Aspirin (₹20)
- Vitamin D3 (₹70)
- Azithromycin (₹120)
- Pantoprazole (₹55)

---

## 🎤 Sample Introduction

> "Good morning professors. Today I'm presenting MediPickup - a digital solution to reduce waiting times at pharmacies. The problem we're solving is the long queues at medical stores where customers waste time waiting. Our solution allows customers to order medicines online, and pharmacy owners can prepare orders before customers arrive. Let me demonstrate..."

---

## ⏱️ Time Management

- Intro: 1 min
- Setup pharmacy: 2-3 min
- Customer ordering: 3-4 min
- Admin processing: 2-3 min
- Features explanation: 2-3 min
- Q&A: remaining time

**Total: ~15 minutes**

---

## 📝 Quick Checklist Before Demo

- [ ] Backend running (port 4000)
- [ ] Frontend running (port 3000)
- [ ] MongoDB running
- [ ] Seed data loaded (Hyderabad locations)
- [ ] Two browser tabs ready (one normal, one incognito)
- [ ] Browser notifications enabled
- [ ] Good internet connection (for map tiles)

---

Good luck with your demo! 🚀
