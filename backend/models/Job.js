const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, enum: ['Dưới 1 năm', '1-2 năm', 'Trên 2 năm'], required: true },
  vacancies: { type: Number, required: true },
  employmentType: { type: String, enum: ['Toàn thời gian', 'Bán thời gian', 'Thực tập', 'Khác'], required: true },
  genderRequirement: { type: String, enum: ['Không yêu cầu', 'Nam', 'Nữ', 'Khác'], default: 'Không yêu cầu' },
  salary: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  applicationDeadline: { type: Date, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);