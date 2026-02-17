import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully!');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
  }
};

testMongoConnection();
