const bcrypt = require('bcrypt');
const User = require('../models/User');
const Job = require('../models/Job');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user profile', error: err.message });
  }
};

const getUserAppliedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ 'cvFiles.user': req.user.id }).populate('company', 'companyName email');
    const appliedJobs = jobs.map(job => {
      const cvFile = job.cvFiles.find(cv => cv.user.toString() === req.user.id.toString());
      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        salary: job.salary,
        status: cvFile.status,
      };
    });
    res.json(appliedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching applied jobs', error: err.message });
  }
};
module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserAppliedJobs
};