# MediPickup - Complete Project Setup Guide

## Overview
A pharmacy ordering system with:
- Customer portal to order medicines
- Admin portal for pharmacy owners
- GPS tracking for nearby pharmacies (2km radius)
- Real-time notifications (Socket.IO)
- Inventory management

---

## STEP 1: Project Structure

```
medipickup/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Pharmacy.js
│   │   ├── Medicine.js
│   │   ├── Inventory.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── pharmacies.js
│   │   ├── medicines.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   ├── seed.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── pages/
│   │   ├── index.jsx
│   │   ├── _app.jsx
│   │   ├── auth/
│   │   │   ├── login.jsx
│   │   │   └── register.jsx
│   │   ├── pharmacy/
│   │   │   └── [id].jsx
│   │   ├── admin/
│   │   │   └── index.jsx
│   │   └── customer/
│   │       ├── orders.jsx
│   │       └── cart.jsx
│   ├── components/
│   │   ├── NavBar.js
│   │   ├── Map.jsx
│   │   ├── MedicineCard.js
│   │   └── OrderCard.js
│   ├── styles/
│   │   └── globals.css
│   ├── public/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

---

## STEP 2: Create Directories

Run these commands in your terminal:

```bash
# Create main project folder
mkdir medipickup
cd medipickup

# Create backend structure
mkdir -p backend/models backend/routes backend/middleware
touch backend/index.js backend/seed.js backend/package.json backend/.env

# Create frontend structure
mkdir -p frontend/pages/auth frontend/pages/pharmacy frontend/pages/admin frontend/pages/customer
mkdir -p frontend/components frontend/styles frontend/public
touch frontend/package.json frontend/next.config.js frontend/tailwind.config.js frontend/postcss.config.js
```

---

## STEP 3: Backend Setup

### 3.1 Backend Dependencies (`backend/package.json`)

```json
{
  "name": "medipickup-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "seed": "node seed.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "socket.io": "^4.6.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**Install:**
```bash
cd backend
npm install
```

### 3.2 Environment Variables (`backend/.env`)

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/medipickup
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

---

## STEP 4: Frontend Setup

### 4.1 Frontend Dependencies (`frontend/package.json`)

```json
{
  "name": "medipickup-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "13.5.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "axios": "^1.5.0",
    "socket.io-client": "^4.6.1",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.5.8",
    "postcss": "^8.4.26",
    "autoprefixer": "^10.4.14"
  }
}
```

**Install:**
```bash
cd frontend
npm install
```

### 4.2 Next.js Config (`frontend/next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### 4.3 Tailwind Config (`frontend/tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4.4 PostCSS Config (`frontend/postcss.config.js`)

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## STEP 5: Run the Application

### Start MongoDB
```bash
# Make sure MongoDB is installed and running
mongod
```

### Start Backend
```bash
cd backend
npm run seed  # Run once to populate initial data
npm run dev   # Start development server
```

### Start Frontend
```bash
cd frontend
npm run dev
```

---

## STEP 6: Test Credentials

After seeding, use these credentials:

**Admin Login:**
- Email: `admin@demo.com`
- Password: `password`

**Customer (You'll need to register):**
- Use the registration page to create a customer account

---

## STEP 7: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Admin Dashboard: http://localhost:3000/admin
- Customer Orders: http://localhost:3000/customer/orders

---

## Features Included

✅ User Authentication (Login/Register)
✅ GPS Tracking (2km radius for nearby pharmacies)
✅ Customer Medicine Selection & Ordering
✅ Admin Order Management
✅ Inventory Management
✅ Real-time Notifications (Socket.IO)
✅ Pickup Time Selection
✅ Order Status Tracking
✅ Responsive Design (Tailwind CSS)

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or `brew services start mongodb-community`
- Check connection string in `.env`

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Leaflet CSS Issues
Make sure to import leaflet CSS in your Map component or globally

### Socket.IO Connection Issues
- Ensure backend is running first
- Check CORS settings in backend
- Verify socket URL in frontend matches backend URL

---

## Next Steps

1. Create all the files I'll provide in the next steps
2. Follow the exact directory structure
3. Install dependencies as shown
4. Run seed script
5. Start both servers
6. Test the application

Ready to create all the code files? Let me know and I'll provide each file!
