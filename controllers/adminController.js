// controllers/adminController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Create a new admin user (admin-only)
// @route   POST /api/admins
// @access  Private/Admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, country } = req.body;

    // Validate input
    if (!name || !email || !password || !country) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin user
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      country,
      isAdmin: true,
      wallet: 0 // Default wallet balance
    });

    await adminUser.save();

    // Exclude password from response
    const { password: _, ...adminData } = adminUser._doc;

    res.status(201).json({
      message: 'Admin user created successfully!',
      admin: adminData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error—admin not created!', error: error.message });
  }
};