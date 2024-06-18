const Company = require('../models/Company');
const Job = require('../models/Job');

// Get company profile
const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.user.id)

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching company profile', error: err.message });
  }
};

// Update company profile
const updateCompanyProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.companyLogo = req.file.path;
    }

    const company = await Company.findByIdAndUpdate(req.user.id, updates, { new: true });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating company profile', error: err.message });
  }
};

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
};