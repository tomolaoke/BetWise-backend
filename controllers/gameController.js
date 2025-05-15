const Game = require('../models/Game');

const createGame = async (req, res) => {
  const { homeTeam, awayTeam, odds, league, matchDate } = req.body;

  try {
    const game = new Game({ homeTeam, awayTeam, odds, league, matchDate });
    await game.save();
    res.status(201).json({ 
      message: `Match added! ${homeTeam} vs ${awayTeam} is ready for bets!`, 
      game 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error—match not added!' });
  }
};

const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json({ 
      message: 'Here’s the lineup of matches to bet on!', 
      games 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error—can’t fetch matches!' });
  }
};

const setGameResult = async (req, res) => {
  const { id } = req.params;
  const { result } = req.body;

  try {
    console.log('Setting result for gameId:', id); // Log the gameId
    const game = await Game.findById(id);
    if (!game) {
      console.log('Game not found for id:', id);
      return res.status(404).json({ message: 'Match not found' });
    }

    game.result = result;
    await game.save();
    res.json({ 
      message: `Result set for ${game.homeTeam} vs ${game.awayTeam}!`, 
      game 
    });
  } catch (error) {
    console.error('Error setting game result:', error); // Log any errors
    res.status(500).json({ message: 'Server error—result not set!', error: error.message });
  }
};

module.exports = { createGame, getGames, setGameResult };