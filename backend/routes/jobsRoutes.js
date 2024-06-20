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
  getJobsByEmail,
  approveApplication,
  rejectApplication
} = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/:id', getJobById); 
router.post('/', authMiddleware('company'), createJob);
router.put('/:id', authMiddleware('company'), updateJob);
router.delete('/:id', authMiddleware('company'), deleteJob);
router.post('/:id/apply', authMiddleware('user'), applyJob);
router.get('/:id/applicants', authMiddleware('company'), getApplicants);
router.get('/my-job/:email', authMiddleware('company'), getJobsByEmail);
router.post('/:jobId/applicants/:userId/approve', authMiddleware('company'), approveApplication);
router.post('/:jobId/applicants/:userId/reject', authMiddleware('company'), rejectApplication);
module.exports = router;