const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Bet = require('../models/Bet');
const Game = require('../models/Game');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const formatAmount = (amount, country) => {
  if (country === 'Nigeria') return `₦${amount}`;
  return `$${amount}`;
};

const placeBet = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(err => err.msg).join(', '));
  }

  const { gameId, outcome, stake } = req.body;

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

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const bet = new Bet({
      user: req.user.id,
      game: gameId,
      outcome,
      stake,
      payout: stake * game.odds[outcome],
      status: 'pending',
    });

    user.wallet -= stake;

    await bet.save({ session });
    await user.save({ session });

    await session.commitTransaction();

    const betObj = bet.toObject({ versionKey: false });
    res.status(201).json({
      message: `Bet placed successfully! Good luck on ${game.homeTeam} vs ${game.awayTeam}!`,
      bet: {
        ...betObj,
        stake: formatAmount(betObj.stake, user.country),
        payout: formatAmount(betObj.payout, user.country),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Place bet error:', error);
    throw error;
  } finally {
    session.endSession();
  }
});

const getBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ user: req.user.id }).populate('game');
  const user = await User.findById(req.user.id);

  const formattedBets = bets.map(bet => {
    const betObj = bet.toObject({ versionKey: false });
    return {
      ...betObj,
      stake: formatAmount(betObj.stake, user.country),
      payout: formatAmount(betObj.payout, user.country),
    };
  });

  res.json({
    message: 'Here’s your betting history—check your wins!',
    bets: formattedBets,
  });
});

module.exports = { placeBet, getBets };