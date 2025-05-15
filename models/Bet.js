const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  outcome: { 
    type: String, 
    enum: ['home', 'away', 'draw'], 
    required: true 
  }, // What they bet on, e.g., "home"
  stake: { type: Number, required: true }, // Amount bet, e.g., 100
  payout: { type: Number, default: 0 }, // Winnings, e.g., 200
  status: { 
    type: String, 
    enum: ['pending', 'won', 'lost'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bet', betSchema);