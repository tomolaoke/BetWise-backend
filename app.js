const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB (await to ensure connection before routes)
connectDB().then(() => console.log('MongoDB connected—ready to bet!'));

// Middleware
app.use(cors()); // Allow frontend access
app.use(morgan('dev')); // Log requests
app.use(express.json()); // Parse JSON bodies

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BetWise API—place your bets!' });
});

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/games', require('./routes/gameRoutes'));
app.use('/bets', require('./routes/betRoutes'));
app.use('/wallet', require('./routes/walletRoutes'));
app.use('/admins', require('./routes/adminRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something broke—try again!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

module.exports = app;