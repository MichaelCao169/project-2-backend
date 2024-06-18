const mongoose = require('mongoose');


const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyLogo: { type: String },
  description: { type: String },
  industry: { type: String },
  website: { type: String },
  role: { type: String, default: 'company' },
  postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
});



module.exports = mongoose.model('Company', companySchema);