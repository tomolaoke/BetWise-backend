const Game = require('../models/Game');
const { validationResult } = require('express-validator');

// Helper function to format result
const formatResult = (game) => {
  if (!game.result) return null;
  switch (game.result) {
    case 'home':
      return `home - ${game.homeTeam} Wins!`;
    case 'away':
      return `away - ${game.awayTeam} Wins!`;
    case 'draw':
      return `draw - It's a Tie!`;
    default:
      return game.result;
  }
};

const createGame = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { homeTeam, awayTeam, odds, league, matchDate } = req.body;

  try {
    const existingGame = await Game.findOne({
      homeTeam,
      awayTeam,
      matchDate: {
        $gte: new Date(new Date(matchDate).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(matchDate).setHours(23, 59, 59, 999)),
      },
    });
    if (existingGame) {
      return res.status(400).json({ message: 'Match already exists for these teams on this date' });
    }

    const game = new Game({ homeTeam, awayTeam, odds, league, matchDate });
    await game.save();
    const gameObj = game.toObject({ versionKey: false });
    gameObj.result = formatResult(game);
    res.status(201).json({ 
      message: `Match added! ${homeTeam} vs ${awayTeam} is ready for bets!`, 
      game: gameObj
    });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({ message: 'Server error—match not added!' });
  }
};

const getGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ matchDate: 1 });
    res.json({ 
      message: 'Here’s the lineup of matches to bet on!', 
      games: games.map(game => {
        const gameObj = game.toObject({ versionKey: false });
        gameObj.result = formatResult(game);
        return gameObj;
      })
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: 'Server error—can’t fetch matches!' });
  }
};

const setGameResult = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { result } = req.body;

  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (game.result) {
      return res.status(400).json({ message: 'Result already set for this match' });
    }

    game.result = result;
    await game.save();
    console.log('Game result set:', { id, result });
    const gameObj = game.toObject({ versionKey: false });
    gameObj.result = formatResult(game);
    res.json({ 
      message: `Result set for ${game.homeTeam} vs ${game.awayTeam}!`, 
      game: gameObj
    });
  } catch (error) {
    console.error('Set game result error:', error);
    res.status(500).json({ message: 'Server error—result not set!' });
  }
};

const getGameResult = async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const gameObj = game.toObject({ versionKey: false });
    res.json({
      message: `Result for ${game.homeTeam} vs ${game.awayTeam}`,
      game: {
        gameId: gameObj._id,
        homeTeam: gameObj.homeTeam,
        awayTeam: gameObj.awayTeam,
        result: formatResult(game),
      },
    });
  } catch (error) {
    console.error('Get game result error:', error);
    res.status(500).json({ message: 'Server error—can’t fetch result!' });
  }
};

module.exports = { createGame, getGames, setGameResult, getGameResult };