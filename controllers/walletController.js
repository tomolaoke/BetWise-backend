const mongoose = require('mongoose');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const formatAmount = (amount, country) => {
  if (country === 'Nigeria') return `₦${amount}`;
  return `$${amount}`;
};

const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      message: 'Your wallet balance is ready!',
      balance: formatAmount(user.wallet, user.country),
      country: user.country 
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Server error—can’t check wallet!' });
  }
};

const deposit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array().map(err => err.msg).join(', ') });
    }

    const { amount } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      user.wallet += amount;
      await user.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        message: `Wallet funded with ${formatAmount(amount, user.country)}—ready to bet!`,
        balance: formatAmount(user.wallet, user.country),
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Deposit error:', error);
      return res.status(500).json({ message: 'Server error—deposit failed!' });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Server error—deposit failed!' });
  }
};

const withdraw = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array().map(err => err.msg).join(', ') });
    }

    const { amount } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.wallet < amount) {
      return res.status(400).json({ 
        message: `Insufficient funds! You have ${formatAmount(user.wallet, user.country)}.` 
      });
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      user.wallet -= amount;
      await user.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        message: `Withdrew ${formatAmount(amount, user.country)} from wallet!`,
        balance: formatAmount(user.wallet, user.country),
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Withdraw error:', error);
      return res.status(500).json({ message: 'Server error—withdrawal failed!' });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ message: 'Server error—withdrawal failed!' });
  }
};

module.exports = { getWallet, deposit, withdraw };