const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register User Baru
router.post('/register', userController.register);

// Generate API Key Baru (TAMBAHAN BARU)
router.post('/generate-key', userController.generateKey);

module.exports = router;