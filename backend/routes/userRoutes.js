const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  getUserAppliedJobs
} = require('../controllers/userController');

router.get('/me', authMiddleware('user'), getUserProfile);
router.put('/me', authMiddleware('user'), updateUserProfile);
router.get('/applied-jobs', authMiddleware('user'), getUserAppliedJobs);
module.exports = router;