const express = require('express');
const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get medicines for a pharmacy (with stock info)
router.get('/pharmacy/:pharmacyId', async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    // Get inventory for this pharmacy
    const inventory = await Inventory.find({ pharmacy: pharmacyId })
      .populate('medicine')
      .lean();

    // Transform to include stock quantity
    const medicines = inventory.map((item) => ({
      ...item.medicine,
      stock: item.quantity,
      inventoryId: item._id,
    }));

    res.json(medicines);
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    console.error('Get all medicines error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create medicine (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, brand, description, unitPrice, sku } = req.body;

    const medicine = await Medicine.create({
      name,
      brand,
      description,
      unitPrice,
      sku,
    });

    res.status(201).json(medicine);
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update inventory (admin only)
router.post('/inventory', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { pharmacyId, medicineId, quantity } = req.body;

    const inventory = await Inventory.findOneAndUpdate(
      { pharmacy: pharmacyId, medicine: medicineId },
      { quantity, updatedAt: new Date() },
      { upsert: true, new: true }
    ).populate('medicine');

    res.json(inventory);
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get inventory for admin
router.get('/inventory/:pharmacyId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const inventory = await Inventory.find({ pharmacy: pharmacyId })
      .populate('medicine')
      .sort({ updatedAt: -1 });

    res.json(inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
