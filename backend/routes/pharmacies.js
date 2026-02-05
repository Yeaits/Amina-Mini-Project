const express = require('express');
const Pharmacy = require('../models/Pharmacy');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get nearby pharmacies (GPS - 2km radius)
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 2000 } = req.query; // radius in meters

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseInt(radius) / 1000;

    // Get all pharmacies
    const pharmacies = await Pharmacy.find().populate('owner', 'name email');

    // Calculate distance and filter
    const nearbyPharmacies = pharmacies
      .map((pharmacy) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          pharmacy.latitude,
          pharmacy.longitude
        );
        return { ...pharmacy.toObject(), distance };
      })
      .filter((pharmacy) => pharmacy.distance <= radiusInKm * 1000)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyPharmacies);
  } catch (error) {
    console.error('Nearby pharmacies error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pharmacy by ID
router.get('/:id', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id).populate('owner', 'name email');
    
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    res.json(pharmacy);
  } catch (error) {
    console.error('Get pharmacy error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create pharmacy (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const pharmacy = await Pharmacy.create({
      name,
      address,
      latitude,
      longitude,
      owner: req.user.id,
    });

    res.status(201).json(pharmacy);
  } catch (error) {
    console.error('Create pharmacy error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

module.exports = router;
