const express = require('express');
const router = express.Router();
const { createAdmin } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

router.post(
  '/',
  [
    protect,
    admin,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('country', 'Country is required').not().isEmpty(),
  ],
  createAdmin
);

module.exports = router;