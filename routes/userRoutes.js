const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');

// GET - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST - Create new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT - Update user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// PATCH - Update user status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});



// POST - Broadcast a message to all users
router.post('/broadcast', async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(200).json({ created: 0, details: 'No users to broadcast to' });
    }

    const messagesToCreate = users
      .filter(u => !!u.email && !!u.name)
      .map(u => ({
        name: u.name,
        email: u.email,
        subject,
        message,
      }));

    if (messagesToCreate.length === 0) {
      return res.status(200).json({ created: 0, details: 'No users with valid email/name' });
    }

    const created = await Message.insertMany(messagesToCreate);
    return res.status(201).json({ created: created.length });
  } catch (error) {
    console.error('Error broadcasting message to users:', error);
    return res.status(500).json({ error: 'Failed to broadcast message' });
  }
});
module.exports = router;