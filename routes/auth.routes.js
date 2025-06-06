const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Register (for admins or bootstrapping)
const upload = require('../upload'); // or '../middlewares/upload' if that's where you put it

router.post('/register', upload.single('profileImage'), authController.register);

// Login
router.post('/login', authController.login);

// Profile (protected)
const requireAuth = require('../middlewares/requireAuth');
router.get('/profile', requireAuth, authController.getProfile);

module.exports = router;
