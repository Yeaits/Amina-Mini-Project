# 🔄 Quick Update Guide - Apply New Changes

## What Changed?

1. ✅ **Location**: San Francisco → Hyderabad, India
2. ✅ **Currency**: USD ($) → INR (₹)
3. ✅ **Pharmacies**: 3 US pharmacies → 5 Hyderabad pharmacies
4. ✅ **New Feature**: Admin can create and manage pharmacies
5. ✅ **Medicine brands**: Updated to Indian brands (Crocin, Brufen, etc.)

---

## 🚀 How to Apply Updates

### Option 1: Fresh Start (RECOMMENDED for demo)

This ensures everything is clean and working:

```bash
# 1. Stop both servers (Ctrl+C in both terminals)

# 2. Clear old database
cd backend
mongosh medipickup --eval "db.dropDatabase()"

# 3. Re-run seed with new Hyderabad data
npm run seed

# 4. Start backend
npm run dev

# 5. In new terminal, start frontend
cd ../frontend
npm run dev

# 6. Open browser at http://localhost:3000
```

### Option 2: Just Restart (if servers are already running)

```bash
# Terminal 1 - Backend
cd backend
npm run seed    # Re-seed database with Hyderabad locations
npm run dev     # Restart server

# Terminal 2 - Frontend  
cd frontend
npm run dev     # Restart server
```

---

## ✅ Verify Changes Are Applied

1. **Open http://localhost:3000**
2. **Check Location**: Map should center on Hyderabad
3. **Check Currency**: Prices should show ₹ (Rupees) not $
4. **Check Pharmacies**: Should see Hyderabad addresses
5. **Check Admin**: Should see "🏥 Manage Pharmacies" button

---

## 📍 New Pharmacy Locations (Hyderabad)

All pharmacies are now in Hyderabad with realistic locations:

1. **MediCare Pharmacy** - Banjara Hills (17.4239, 78.4738)
2. **HealthPlus Pharmacy** - Jubilee Hills (17.4326, 78.4071)
3. **QuickMed Pharmacy** - Madhapur, HITEC City (17.4485, 78.3908)
4. **Apollo Pharmacy** - Gachibowli (17.4400, 78.3489)
5. **MedPlus Pharmacy** - Kondapur (17.4617, 78.3654)

---

## 💰 New Pricing (Indian Rupees)

Sample medicine prices:
- Paracetamol: ₹25 (was $2.50)
- Ibuprofen: ₹35 (was $3.00)
- Amoxicillin: ₹85 (was $8.50)
- Vitamin D3: ₹70 (was $7.00)

---

## 🏥 New Feature: Pharmacy Management

**How to use:**

1. Login as admin (`admin@demo.com` / `password`)
2. Click **"🏥 Manage Pharmacies"** button
3. Click **"+ Add New Pharmacy"**
4. Fill form or use **"Fill Sample Data"** button
5. Create your own pharmacy!

**Use this for your demo:**
- Create "[Your Name]'s Pharmacy"
- Use BITS Pilani Hyderabad coordinates: 17.5449, 78.5718
- Show professors you can manage your own pharmacy

---

## 🎯 For Your Demo Tomorrow

### Step 1: Apply Updates (Tonight)
```bash
cd backend
npm run seed
npm run dev
```

### Step 2: Test Everything (Tonight)
- Create a test pharmacy as admin
- Register a test customer account
- Place a test order
- Mark order as ready
- Verify notifications work

### Step 3: Demo Day (Tomorrow)
Follow the **DEMO_GUIDE.md** step by step!

---

## 🐛 Common Issues After Update

### Issue: Map shows USA instead of Hyderabad
**Fix:** Clear browser cache and hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)

### Issue: Still seeing $ instead of ₹
**Fix:** 
1. Make sure you downloaded the updated files
2. Hard refresh browser (Cmd+Shift+R)
3. Check frontend/components/MedicineCard.js has ₹ symbol

### Issue: Old pharmacies still showing
**Fix:**
```bash
cd backend
mongosh medipickup --eval "db.pharmacies.deleteMany({})"
npm run seed
```

### Issue: "Manage Pharmacies" button not showing
**Fix:**
1. Make sure you copied the updated admin/index.jsx
2. Restart frontend server
3. Hard refresh browser

---

## 📝 Files That Changed

If you need to manually update:

**Backend:**
- `backend/seed.js` - Hyderabad locations + INR prices

**Frontend:**
- `frontend/pages/index.jsx` - Default coordinates
- `frontend/components/MedicineCard.js` - Currency symbol
- `frontend/components/OrderCard.js` - Currency symbol  
- `frontend/pages/pharmacy/[id].jsx` - Currency symbol
- `frontend/pages/admin/index.jsx` - Pharmacy management link
- `frontend/pages/admin/pharmacies.jsx` - NEW FILE

---

## ✨ Summary of Update Commands

```bash
# Complete fresh start
cd backend
mongosh medipickup --eval "db.dropDatabase()"
npm run seed
npm run dev

# In new terminal
cd frontend  
npm run dev
```

That's it! You're ready for the demo! 🎉
