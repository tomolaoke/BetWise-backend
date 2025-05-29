const express = require('express');
const router = express.Router();
const { createGame, getGames, setGameResult, getGameResult } = require('../controllers/gameController');
const { protect, admin } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

router.post(
  '/',
  [
    protect,
    admin,
    check('homeTeam', 'Home team is required').not().isEmpty(),
    check('awayTeam', 'Away team is required').not().isEmpty(),
    check('odds.home', 'Home odds must be greater than 1.01').isFloat({ min: 1.01 }),
    check('odds.draw', 'Draw odds must be greater than 1.01').isFloat({ min: 1.01 }),
    check('odds.away', 'Away odds must be greater than 1.01').isFloat({ min: 1.01 }),
    check('league', 'League is required').not().isEmpty(),
    check('matchDate', 'Valid match date is required').isISO8601().toDate(),
  ],
  createGame
);

router.get('/', getGames);

router.patch(
  '/:id/result',
  [
    protect,
    admin,
    check('result', 'Result must be home, away, or draw').isIn(['home', 'away', 'draw']),
  ],
  setGameResult
);

router.get('/:id/result', getGameResult);

module.exports = router;