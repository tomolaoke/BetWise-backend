const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB().then(() => console.log(`Best Wishes! - Tomola Oke (CareerEx Cohort3)`));

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Debug route loading
console.log('Loading routes...');

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