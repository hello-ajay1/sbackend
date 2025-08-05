const express = require('express');
const router = express.Router();
const Business = require('../models/Bussiness');


// POST - Add new business
router.post('/', async (req, res) => {
  try {
    const business = new Business(req.body);
    const savedBusiness = await business.save();
    res.status(201).json(savedBusiness);
  } catch (error) {
    console.error('Error saving business:', error);
    res.status(500).json({ error: 'Failed to save business' });
  }
});

// GET - Fetch all businesses
router.get('/', async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

module.exports = router;
