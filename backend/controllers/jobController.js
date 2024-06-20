const Job = require('../models/Job');
const Company = require('../models/Company');
const multer = require('multer');
const path = require('path');
// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('company', 'companyName email companyLogo');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
};

// Get a job by ID
const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id).populate('company', 'companyName email companyLogo');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching job', error: err.message });
  }
};

// Create a new job
const createJob = async (req, res) => {
  const {
    title,
    position,
    experience,
    vacancies,
    employmentType,
    genderRequirement,
    salary,
    location,
    description,
    applicationDeadline,
    skills,
  } = req.body;

  try {
    const job = new Job({
      title,
      position,
      experience,
      vacancies,
      employmentType,
      genderRequirement,
      salary,
      location,
      description,
      applicationDeadline,
      skills,
      company: req.user.id,  // Assuming req.user.id is the company ID
    });

    await job.save();

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating job', error: err.message });
  }
};

// Update a job
const updateJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByIdAndUpdate(id, req.body, { new: true });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating job', error: err.message });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
};



// Get applicants for a job
const getApplicants = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id).populate('cvFiles.user', 'fullName email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applicants = job.cvFiles.map(cvFile => ({
      _id: cvFile.user._id,
      fullName: cvFile.user.fullName,
      email: cvFile.user.email,
      cvFile: cvFile.filePath,
      status: cvFile.status,
    }));

    res.json(applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching applicants', error: err.message });
  }
};

// Get jobs by user email
const getJobsByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
};
// Cấu hình multer để lưu trữ tệp PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'..', 'uploads', 'cv')); // Thư mục lưu trữ tệp PDF trong thư mục backend
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single('cv');

// Apply for a job
const applyJob = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
    }

    const { id } = req.params;

    try {
      const job = await Job.findById(id);

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      if (job.applicants.includes(req.user.id)) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }

      job.applicants.push(req.user.id);
      job.cvFiles.push({
        user: req.user.id,
        filePath: path.join('uploads/cv', req.file.filename), // Lưu trữ đường dẫn tệp tương đối
      });
      await job.save();

      res.json({ message: 'Applied successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error applying for job', error: err.message });
    }
  });
};

// Chấp nhận đơn ứng tuyển
const approveApplication = async (req, res) => {
  const { jobId, userId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const cvFile = job.cvFiles.find(cv => cv.user.toString() === userId);
    if (!cvFile) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    cvFile.status = 'Approved';
    await job.save();

    res.json({ message: 'Application approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error approving application', error: err.message });
  }
};

// Từ chối đơn ứng tuyển
const rejectApplication = async (req, res) => {
  const { jobId, userId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const cvFile = job.cvFiles.find(cv => cv.user.toString() === userId);
    if (!cvFile) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    cvFile.status = 'Rejected';
    await job.save();

    res.json({ message: 'Application rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error rejecting application', error: err.message });
  }
};
module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  getApplicants,
  getJobsByEmail,
  approveApplication,
  rejectApplication,
};