const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Sign up a new user
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, country } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, country });
    await user.save();

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: `Welcome, ${name}! Your account is ready—time to bet!`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        isAdmin: user.isAdmin,
        wallet: user.wallet,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server hiccup—try again!' });
  }
};

// Log in a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Wrong email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong email or password' });

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: `Welcome back, ${user.name}! Let’s get betting!`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        isAdmin: user.isAdmin,
        wallet: user.wallet,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server hiccup—try again!' });
  }
};

// Create a new admin (admin only)
const createAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, country } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, country, isAdmin: true, wallet: 150 });
    await user.save();

    res.status(201).json({
      message: `New admin ${name} created! Ready to manage BetWise!`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server hiccup—try again!' });
  }
};

module.exports = { registerUser, loginUser, createAdmin };