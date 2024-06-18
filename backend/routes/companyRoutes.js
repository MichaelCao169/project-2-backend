const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getCompanyProfile } = require('../controllers/companyController');

// Endpoint để lấy thông tin công ty
router.get('/profile', authMiddleware('company'), getCompanyProfile);

module.exports = router;