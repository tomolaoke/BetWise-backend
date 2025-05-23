// routes/adminRoutes.js
const express = require('express');
const { createAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

// Only logged-in admins can create new admins
router.post('/', protect, admin, createAdmin);

module.exports = router;