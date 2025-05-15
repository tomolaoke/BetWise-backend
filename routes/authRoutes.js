const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('country', 'Country is required').not().isEmpty(),
  ],
  registerUser
);

router.post('/login', loginUser);

module.exports = router;