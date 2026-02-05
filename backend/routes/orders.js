const express = require('express');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { pharmacyId, items, pickupTime } = req.body;

    // Calculate total
    let total = 0;
    const orderItems = items.map((item) => {
      const lineTotal = item.unitPrice * item.quantity;
      total += lineTotal;
      return {
        medicine: item.medicineId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal,
      };
    });

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      pharmacy: pharmacyId,
      items: orderItems,
      total,
      pickupTime: pickupTime ? new Date(pickupTime) : null,
      status: 'placed',
    });

    // Update inventory
    for (const item of items) {
      await Inventory.findOneAndUpdate(
        { pharmacy: pharmacyId, medicine: item.medicineId },
        { $inc: { quantity: -item.quantity } }
      );
    }

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('pharmacy', 'name address')
      .populate('items.medicine');

    // Send socket notification to admin
    const io = req.app.get('io');
    if (io) {
      io.to(`pharmacy-${pharmacyId}`).emit('new-order', {
        message: 'New order received',
        order: populatedOrder,
      });
    }

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get orders for customer
router.get('/customer', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('pharmacy', 'name address')
      .populate('items.medicine')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get orders for pharmacy (admin)
router.get('/pharmacy/:pharmacyId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const orders = await Order.find({ pharmacy: pharmacyId })
      .populate('customer', 'name email phone')
      .populate('items.medicine')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get pharmacy orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (admin)
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('customer', 'name email phone')
      .populate('pharmacy', 'name address')
      .populate('items.medicine');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send socket notification to customer
    const io = req.app.get('io');
    if (io && status === 'ready') {
      io.to(`user-${order.customer._id}`).emit('order-ready', {
        message: 'Your order is ready for pickup',
        order,
      });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('pharmacy', 'name address')
      .populate('items.medicine');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
