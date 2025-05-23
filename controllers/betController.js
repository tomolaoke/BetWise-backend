const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Bet = require('../models/Bet');
const Game = require('../models/Game');
const User = require('../models/User');

// Helper to format amount with currency
const formatAmount = (amount, country) => {
  if (country === 'Nigeria') return `₦${amount}`;
  return `$${amount}`;
};

const placeBet = asyncHandler(async (req, res) => {
  const { gameId, outcome, stake } = req.body;

  // Validate input
  if (!gameId || !outcome || !stake) {
    res.status(400);
    throw new Error('Please provide gameId, outcome, and stake');
  }

  if (!['home', 'away', 'draw'].includes(outcome)) {
    res.status(400);
    throw new Error('Outcome must be "home", "away", or "draw"');
  }

  if (stake < 1) {
    res.status(400);
    throw new Error('Stake must be at least 1');
  }

  // Find game
  const game = await Game.findById(gameId);
  if (!game) {
    res.status(404);
    throw new Error('Match not found');
  }
  if (game.result) {
    res.status(400);
    throw new Error('Match already ended');
  }
  if (!game.odds[outcome]) {
    res.status(400);
    throw new Error(`No odds available for outcome "${outcome}"`);
  }

  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.wallet < stake) {
    res.status(400);
    throw new Error(`Not enough funds! You need ${formatAmount(stake, user.country)}.`);
  }

  // Use transaction for atomicity
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Create bet
    const bet = new Bet({
      user: req.user.id,
      game: gameId,
      outcome,
      stake,
      payout: stake * game.odds[outcome],
      status: 'pending',
    });

    // Deduct stake
    user.wallet -= stake;

    // Save with session
    await bet.save({ session });
    await user.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: `Bet placed successfully! Good luck on ${game.homeTeam} vs ${game.awayTeam}!`,
      bet: {
        ...bet.toObject(),
        stake: formatAmount(bet.stake, user.country),
        payout: formatAmount(bet.payout, user.country),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const getBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ user: req.user.id }).populate('game');
  const user = await User.findById(req.user.id);

  const formattedBets = bets.map(bet => ({
    ...bet.toObject(),
    stake: formatAmount(bet.stake, user.country),
    payout: formatAmount(bet.payout, user.country),
  }));

  res.json({
    message: 'Here’s your betting history—check your wins!',
    bets: formattedBets,
  });
});

module.exports = { placeBet, getBets };