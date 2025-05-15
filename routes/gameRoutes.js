const express = require('express');
const { createGame, getGames, setGameResult } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware'); // Only import protect here
const { admin } = require('../middleware/adminMiddleware'); // Correctly import admin middleware

const router = express.Router();

// Define routes
router.post('/', protect, admin, createGame); // Ensure createGame is a valid function
router.get('/', getGames); // Ensure getGames is a valid function
router.patch('/:id/result', protect, admin, setGameResult); // Ensure setGameResult is a valid function

module.exports = router;