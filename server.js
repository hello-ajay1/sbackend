const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sindisahib';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully to:', mongoURI))
.catch(err => console.error('❌ DB Error:', err));

// ✅ Import Routes
const messageRoutes = require('./routes/messageRoutes');
const businessRoutes = require('./routes/bussinessRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// ✅ Setup API Routes
app.use('/api/messages', messageRoutes);
app.use('/api/bussiness', businessRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/feedback', feedbackRoutes);

// ✅ Default Route
app.get('/', (req, res) => {
  res.send('🚀 Server is running...');
});

// ✅ Ping Route for uptime checks
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
