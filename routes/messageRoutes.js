const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST - Save Message
router.post('/', async (req, res) => {
  try {
    console.log('📝 Received message data:', req.body);
    
    // Validate required fields
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'subject', 'message'],
        received: Object.keys(req.body)
      });
    }

    const newMessage = new Message(req.body);
    const saved = await newMessage.save();
    
    console.log('✅ Message saved successfully:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error saving message:', err);
    res.status(500).json({ 
      error: 'Failed to save message',
      details: err.message 
    });
  }
});

// GET - Get All Messages
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all messages...');
    const messages = await Message.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${messages.length} messages`);
    res.json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PUT - Update Message Status
router.put('/:id', async (req, res) => {
  try {
    console.log('📝 Updating message status:', req.params.id, 'to:', req.body.status);
    
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!updatedMessage) {
      console.log('❌ Message not found:', req.params.id);
      return res.status(404).json({ error: 'Message not found' });
    }
    
    console.log('✅ Message status updated successfully:', updatedMessage);
    res.json(updatedMessage);
  } catch (error) {
    console.error('❌ Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE - Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
