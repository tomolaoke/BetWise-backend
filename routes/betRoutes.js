const express = require('express');
const router = express.Router();
const { placeBet, getBets } = require('../controllers/betController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

router.post(
  '/',
  [
    protect,
    check('gameId', 'Valid game ID is required').isMongoId(),
    check('outcome', 'Outcome must be home, away, or draw').isIn(['home', 'away', 'draw']),
    check('stake', 'Stake must be at least ₦1').isFloat({ min: 1 }),
  ],
  placeBet
);

router.get('/', protect, getBets);

module.exports = router;