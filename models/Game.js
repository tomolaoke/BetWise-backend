const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  homeTeam: { 
    type: String, 
    required: [true, 'Home team is required'], 
    trim: true 
  },
  awayTeam: { 
    type: String, 
    required: [true, 'Away team is required'], 
    trim: true 
  },
  odds: {
    home: { 
      type: Number, 
      required: [true, 'Home odds are required'], 
      min: [1.01, 'Home odds must be greater than 1.01'] 
    },
    away: { 
      type: Number, 
      required: [true, 'Away odds are required'], 
      min: [1.01, 'Away odds must be greater than 1.01'] 
    },
    draw: { 
      type: Number, 
      required: [true, 'Draw odds are required'], 
      min: [1.01, 'Draw odds must be greater than 1.01'] 
    },
  },
  result: { 
    type: String, 
    enum: ['home', 'away', 'draw', null], 
    default: null 
  },
  league: { 
    type: String, 
    required: [true, 'League is required'], 
    trim: true 
  },
  matchDate: { 
    type: Date, 
    required: [true, 'Match date is required'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Game', gameSchema);