const express = require('express');
const router  = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register  — create admin account
router.post('/register', register);

// POST /api/auth/login     — returns JWT
router.post('/login', login);

module.exports = router;
