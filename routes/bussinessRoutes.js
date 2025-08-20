const express = require('express');
const router = express.Router();
const Business = require('../models/Bussiness');

// POST - Add new business
router.post('/', async (req, res) => {
  try {
    console.log('📝 Received business data:', req.body);
    
    // Validate required fields
    const { name, description, category, address, phone, email } = req.body;
    if (!name || !description || !category || !address || !phone || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'description', 'category', 'address', 'phone', 'email'],
        received: Object.keys(req.body)
      });
    }

    const business = new Business(req.body);
    const savedBusiness = await business.save();
    
    console.log('✅ Business saved successfully:', savedBusiness);
    res.status(201).json(savedBusiness);
  } catch (error) {
    console.error('❌ Error saving business:', error);
    res.status(500).json({ 
      error: 'Failed to save business',
      details: error.message 
    });
  }
});

// PATCH - Toggle business block status
router.patch('/:id/toggle-block', async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;
    
    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({ error: 'isBlocked must be a boolean value' });
    }
    
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true }
    );
    
    if (!updatedBusiness) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    console.log(`✅ Business ${isBlocked ? 'blocked' : 'unblocked'} successfully:`, updatedBusiness.name);
    res.json(updatedBusiness);
  } catch (error) {
    console.error('❌ Error updating business block status:', error);
    res.status(500).json({ 
      error: 'Failed to update business block status',
      details: error.message 
    });
  }
});

// PATCH - Toggle business approval status
router.patch('/:id/toggle-approval', async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ error: 'isApproved must be a boolean value' });
    }
    
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );
    
    if (!updatedBusiness) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    console.log(`✅ Business ${isApproved ? 'approved' : 'unapproved'} successfully:`, updatedBusiness.name);
    res.json(updatedBusiness);
  } catch (error) {
    console.error('❌ Error updating business approval status:', error);
    res.status(500).json({ 
      error: 'Failed to update business approval status',
      details: error.message 
    });
  }
});

// GET - Fetch all businesses (must come before /:id route)
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all businesses...');
    
    // For public API, filter out blocked and pending businesses
    // For admin API, show all businesses
    const isAdmin = req.query.admin === 'true';
    const filter = isAdmin ? {} : { 
      isBlocked: { $ne: true },
      isApproved: true  // Only show approved businesses to public
    };
    
    // Sort: approved businesses first, then by creation date (newest first)
    const businesses = await Business.find(filter).sort({ 
      isApproved: -1, // -1 puts true (approved) first
      createdAt: -1   // Then by creation date, newest first
    });
    
    console.log(`✅ Found ${businesses.length} businesses (${isAdmin ? 'admin view' : 'public view'})`);
    res.json(businesses);
  } catch (error) {
    console.error('❌ Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

// GET - Get business statistics (must come before /:id route)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalBusinesses = await Business.countDocuments();
    const businessesByCategory = await Business.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const recentBusinesses = await Business.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      total: totalBusinesses,
      byCategory: businessesByCategory,
      recent: recentBusinesses
    });
  } catch (error) {
    console.error('Error fetching business stats:', error);
    res.status(500).json({ error: 'Failed to fetch business statistics' });
  }
});

// GET - Get businesses by category (must come before /:id route)
router.get('/category/:category', async (req, res) => {
  try {
    const businesses = await Business.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses by category:', error);
    res.status(500).json({ error: 'Failed to fetch businesses by category' });
  }
});

// GET - Search businesses (must come before /:id route)
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const businesses = await Business.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).sort({ 
      isApproved: -1, // Approved businesses first
      createdAt: -1   // Then by creation date
    });
    res.json(businesses);
  } catch (error) {
    console.error('Error searching businesses:', error);
    res.status(500).json({ error: 'Failed to search businesses' });
  }
});

// GET - Fetch business by ID (must come last)
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Failed to fetch business' });
  }
});

// PUT - Update business
router.put('/:id', async (req, res) => {
  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBusiness) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(updatedBusiness);
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ error: 'Failed to update business' });
  }
});

// DELETE - Delete a business
router.delete('/:id', async (req, res) => {
  try {
    const deletedBusiness = await Business.findByIdAndDelete(req.params.id);
    if (!deletedBusiness) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ error: 'Failed to delete business' });
  }
});

module.exports = router;
