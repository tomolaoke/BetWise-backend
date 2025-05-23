const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load our .env file

// This function connects to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('MongoDB connected—ready to store games and bets!');
  } catch (error) {
    console.error('Oops, MongoDB connection failed:', error);
    process.exit(1); // Stop the app if we can’t connect
  }
};

module.exports = connectDB; // Share this function with the app
