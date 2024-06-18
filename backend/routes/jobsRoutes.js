const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  getApplicants,
  getJobsByEmail
} = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/:id', getJobById); 
router.post('/', authMiddleware('company'), createJob);
router.put('/:id', authMiddleware('company'), updateJob);
router.delete('/:id', authMiddleware('company'), deleteJob);
router.post('/:id/apply', authMiddleware('user'), applyJob);
router.get('/:id/applicants', authMiddleware('company'), getApplicants);
router.get('/my-job/:email', authMiddleware('company'), getJobsByEmail);

module.exports = router;