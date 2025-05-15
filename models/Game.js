const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  homeTeam: { type: String, required: true }, // E.g., "Arsenal"
  awayTeam: { type: String, required: true }, // E.g., "Chelsea"
  odds: {
    home: { type: Number, required: true }, // E.g., 2.0 (Arsenal wins)
    away: { type: Number, required: true }, // E.g., 3.5 (Chelsea wins)
    draw: { type: Number, required: true }, // E.g., 2.8 (Tie)
  },
  result: { 
    type: String, 
    enum: ['home', 'away', 'draw'], 
    default: null 
  }, // Result, e.g., "home"
  league: { type: String, required: true }, // E.g., "Premier League"
  matchDate: { type: Date, required: true }, // E.g., "2025-05-20"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', gameSchema);