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
      const user = await User.findById(req.user.id).populate('appliedJobs');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const jobs = await Job.find({ applicants: user._id }).populate('company', 'companyName email');
      res.json(jobs);
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