const express = require('express');
const { placeBet, getBets } = require('../controllers/betController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, placeBet);
router.get('/', protect, getBets);

module.exports = router;