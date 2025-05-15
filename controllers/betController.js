const Bet = require('../models/Bet');
const Game = require('../models/Game');
const User = require('../models/User');

// Helper to format amount with currency
const formatAmount = (amount, country) => {
  if (country === 'Nigeria') return `₦${amount}`;
  return `$${amount}`;
};

const placeBet = async (req, res) => {
  const { gameId, outcome, stake } = req.body;

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: 'Match not found' });
    if (game.result) return res.status(400).json({ message: 'Match already ended' });

    const user = await User.findById(req.user.id);
    if (user.wallet < stake) {
      return res.status(400).json({ 
        message: `Not enough funds! You need ${formatAmount(stake, user.country)}.` 
      });
    }

    const bet = new Bet({
      user: req.user.id,
      game: gameId,
      outcome,
      stake,
    });

    bet.payout = stake * game.odds[outcome]; // Calculate potential winnings
    await bet.save();

    user.wallet -= stake; // Deduct stake
    await user.save();

    res.status(201).json({ 
      message: `Bet placed successfully! Good luck on ${game.homeTeam} vs ${game.awayTeam}!`,
      bet: {
        ...bet._doc,
        stake: formatAmount(bet.stake, user.country),
        payout: formatAmount(bet.payout, user.country),
      },
    });
  } catch (error) {
    console.error('Error placing bet:', error); // Log the error
    res.status(500).json({ message: 'Server error—bet not placed!', error: error.message });
  }
};

const getBets = async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.user.id }).populate('game');
    const user = await User.findById(req.user.id);
    const formattedBets = bets.map(bet => ({
      ...bet._doc,
      stake: formatAmount(bet.stake, user.country),
      payout: formatAmount(bet.payout, user.country),
    }));
    res.json({ 
      message: 'Here’s your betting history—check your wins!', 
      bets: formattedBets 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error—can’t fetch bets!' });
  }
};

module.exports = { placeBet, getBets };