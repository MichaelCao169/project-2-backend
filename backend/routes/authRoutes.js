const express = require('express');
const { registerUser, loginUser, registerCompany, loginCompany, refreshToken } = require('../controllers/authController');
const router = express.Router();

// Routes cho User
router.post('/register/user', registerUser);
router.post('/login/user', loginUser);

// Routes cho Company
router.post('/register/company', registerCompany);
router.post('/login/company', loginCompany);

// Route làm mới token
router.post('/refresh', refreshToken);

module.exports = router;