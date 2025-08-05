const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('DB Error:', err));

console.log('MONGO_URI from .env:', process.env.MONGO_URI);

// ✅ Import Routes (tere naam ke hisaab se)
const messageRoutes = require('./routes/messageRoutes');
const bussinessRoutes = require('./routes/bussinessRoutes');  // tu bussiness hi use kar raha hai

// ✅ Route Setup
app.use('/api/messages', messageRoutes);
app.use('/api/bussiness', bussinessRoutes);  // ye /api/bussiness chalega

// ✅ Default test route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
