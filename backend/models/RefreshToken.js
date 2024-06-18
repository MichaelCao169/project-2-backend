const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' || 'Company' },
  createdAt: { type: Date, default: Date.now, expires: '30d' }, 
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);