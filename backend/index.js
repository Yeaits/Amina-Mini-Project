require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const pharmacyRoutes = require('./routes/pharmacies');
const medicineRoutes = require('./routes/medicines');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // User identifies themselves
  socket.on('identify', ({ userId, role, pharmacyId }) => {
    console.log('User identified:', { userId, role, pharmacyId });
    
    if (userId) {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined room: user-${userId}`);
    }
    
    if (role === 'admin' && pharmacyId) {
      socket.join(`pharmacy-${pharmacyId}`);
      console.log(`Admin joined room: pharmacy-${pharmacyId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// MongoDB connection
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medipickup';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`✓ Backend server running on http://localhost:${PORT}`);
      console.log(`✓ Socket.IO server running`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
