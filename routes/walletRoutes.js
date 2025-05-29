const express = require('express');
const router = express.Router();
const { getWallet, deposit, withdraw } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

router.get('/', protect, getWallet);

router.post(
  '/deposit',
  [
    protect,
    check('amount', 'Amount must be at least ₦100').isFloat({ min: 100 }),
  ],
  deposit
);

router.post(
  '/withdraw',
  [
    protect,
    check('amount', 'Amount must be at least ₦100').isFloat({ min: 100 }),
  ],
  withdraw
);

module.exports = router;