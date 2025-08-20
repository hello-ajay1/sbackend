const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// GET - Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// POST - Create new feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

// PUT - Update feedback
router.put('/:id', async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// DELETE - Delete feedback
router.delete('/:id', async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// PATCH - Update feedback status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ error: 'Failed to update feedback status' });
  }
});

// GET - Get feedback statistics
router.get('/stats', async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });
    const approvedFeedback = await Feedback.countDocuments({ status: 'approved' });
    const rejectedFeedback = await Feedback.countDocuments({ status: 'rejected' });
    
    // Calculate average rating
    const feedbackWithRatings = await Feedback.find({ rating: { $exists: true } });
    const averageRating = feedbackWithRatings.length > 0 
      ? (feedbackWithRatings.reduce((sum, f) => sum + f.rating, 0) / feedbackWithRatings.length).toFixed(1)
      : 0;

    res.json({
      total: totalFeedback,
      pending: pendingFeedback,
      approved: approvedFeedback,
      rejected: rejectedFeedback,
      averageRating: parseFloat(averageRating)
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({ error: 'Failed to fetch feedback statistics' });
  }
});

module.exports = router;
