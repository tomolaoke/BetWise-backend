const User = require('../models/User');

// Helper to format amount with currency
const formatAmount = (amount, country) => {
  if (country === 'Nigeria') return `₦${amount}`;
  return `$${amount}`; // Default for others
};

const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ 
      message: 'Your wallet balance is ready!',
      balance: formatAmount(user.wallet, user.country),
      country: user.country 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error—can’t check wallet!' });
  }
};

module.exports = { getWallet };