const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

connectDB(); // Connect to MongoDB

app.use(cors()); // Let the frontend talk to us
app.use(morgan('dev')); // Log requests
app.use(express.json()); // Understand JSON from requests

// Hook up our routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/games', require('./routes/gameRoutes'));
app.use('/bets', require('./routes/betRoutes'));
app.use('/wallet', require('./routes/walletRoutes'));

module.exports = app;