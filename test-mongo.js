const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoDB() {
  console.log('🧪 Testing MongoDB Connection...\n');

  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sindisahib';
    console.log('🔗 Connecting to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    
    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', TestSchema);
    
    const testDoc = new TestModel({ name: 'Test Document' });
    await testDoc.save();
    console.log('✅ Test document saved successfully');
    
    const foundDoc = await TestModel.findOne({ name: 'Test Document' });
    console.log('✅ Test document retrieved:', foundDoc);
    
    // Clean up
    await TestModel.deleteOne({ name: 'Test Document' });
    console.log('✅ Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
    
    console.log('\n🎉 MongoDB is working correctly!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Please make sure:');
    console.log('1. MongoDB is installed on your system');
    console.log('2. MongoDB service is running');
    console.log('3. You can download MongoDB from: https://www.mongodb.com/try/download/community');
  }
}

testMongoDB();
