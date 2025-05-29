const mongoose = require('mongoose');

const betSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    outcome: {
      type: String,
      enum: ['home', 'away', 'draw'],
      required: true,
    },
    stake: {
      type: Number,
      required: true,
      min: [1, 'Stake must be at least 1'],
    },
    payout: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'won', 'lost'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bet', betSchema);