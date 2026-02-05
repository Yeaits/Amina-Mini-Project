# 🔧 Port 4000 Already in Use - Fix Guide

## Problem
You're seeing this error:
```
Error: listen EADDRINUSE: address already in use :::4000
```

This means another application is already using port 4000.

---

## ✅ Solution 1: Kill the Process (RECOMMENDED)

### Step 1: Find what's using port 4000
```bash
lsof -i:4000
```

### Step 2: Kill the process
```bash
# Kill the process automatically
lsof -ti:4000 | xargs kill -9
```

### Step 3: Start backend again
```bash
npm run dev
```

---

## ✅ Solution 2: Use a Different Port

If you want to keep the other process running, use port 4001 instead:

### Step 1: Update backend/.env
Change this line in `backend/.env`:
```
PORT=4001
```
(I've already done this for you)

### Step 2: Update frontend API URLs
You need to update all frontend files to use port 4001 instead of 4000.

**Manual Method:**
Search and replace in these files:
- `frontend/pages/_app.jsx` - Line with `io('http://localhost:4000')`
- `frontend/pages/index.jsx` - Line with `http://localhost:4000`
- `frontend/pages/auth/login.jsx` - Line with `http://localhost:4000`
- `frontend/pages/auth/register.jsx` - Line with `http://localhost:4000`
- `frontend/pages/pharmacy/[id].jsx` - Lines with `http://localhost:4000`
- `frontend/pages/admin/index.jsx` - Lines with `http://localhost:4000`
- `frontend/pages/customer/orders.jsx` - Line with `http://localhost:4000`

Replace all `http://localhost:4000` with `http://localhost:4001`

**OR Use Find & Replace in VS Code:**
1. Press `Cmd+Shift+F` (Mac) or `Ctrl+Shift+H` (Windows/Linux)
2. Search for: `localhost:4000`
3. Replace with: `localhost:4001`
4. Click "Replace All"

### Step 3: Restart servers
```bash
# In backend terminal
npm run dev

# In frontend terminal (restart it)
npm run dev
```

---

## 🔍 How to Check What's Using Port 4000

```bash
# See all details
lsof -i:4000

# You might see something like:
# COMMAND   PID    USER   FD   TYPE    DEVICE SIZE/OFF NODE NAME
# node    12345   yourname   21u  IPv6  0xabcdef  0t0  TCP *:4000 (LISTEN)
```

Common culprits:
- Another instance of your backend still running
- A different Node.js project
- Docker containers
- Other development servers

---

## 💡 Quick Commands Reference

```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000 (if frontend has issues)
lsof -ti:3000 | xargs kill -9

# See all Node processes
ps aux | grep node

# Kill all Node processes (nuclear option - use carefully!)
killall node
```

---

## ✅ After Fixing

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   Should see:
   ```
   ✓ Connected to MongoDB
   ✓ Backend server running on http://localhost:4000 (or 4001)
   ✓ Socket.IO server running
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   
   Should see:
   ```
   ready - started server on 0.0.0.0:3000, url: http://localhost:3000
   ```

3. **Test:**
   Open http://localhost:3000 in your browser

---

## 🆘 Still Having Issues?

Try this complete restart:

```bash
# 1. Stop everything
killall node

# 2. Clear any locks
rm -rf backend/node_modules/.cache
rm -rf frontend/.next

# 3. Start backend
cd backend
npm run dev

# 4. In new terminal, start frontend
cd frontend  
npm run dev
```
