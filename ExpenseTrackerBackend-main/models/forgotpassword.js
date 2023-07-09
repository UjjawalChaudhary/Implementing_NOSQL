const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  id: { type: String, required: true },
  active: { type: Boolean, default: true },
  expiresBy: { type: Date }
});

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);
