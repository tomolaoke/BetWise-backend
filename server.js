const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}—let’s bet!`);
});

// Root route for welcome message
app.get('/', (req, res) => {  
  res.json({ message: 'Welcome to the BetWise API—place your bets!' });
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});
