const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token from "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next(); // Move to the next step
    } catch (error) {
      res.status(401).json({ message: 'Not logged in—token failed!' });
    }
  } else {
    res.status(401).json({ message: 'No token, no access!' });
  }
};

module.exports = { protect };