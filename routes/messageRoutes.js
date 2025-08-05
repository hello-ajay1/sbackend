const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// POST - Save Message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    const saved = await message.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// GET - Get All Messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
