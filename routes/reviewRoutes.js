const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Business = require('../models/Bussiness');

// GET - Get all reviews with business details
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('businessId', 'name category')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST - Create new review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    const savedReview = await review.save();
    
    // Populate business details
    const populatedReview = await Review.findById(savedReview._id)
      .populate('businessId', 'name category');
    
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT - Update review
router.put('/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('businessId', 'name category');
    
    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE - Delete review
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// PATCH - Update review status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('businessId', 'name category');
    
    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

// GET - Get reviews by business
router.get('/business/:businessId', async (req, res) => {
  try {
    const reviews = await Review.find({ businessId: req.params.businessId })
      .populate('businessId', 'name category')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching business reviews:', error);
    res.status(500).json({ error: 'Failed to fetch business reviews' });
  }
});

module.exports = router;
