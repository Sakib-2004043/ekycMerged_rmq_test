const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // Optional: where generated PDF will be stored (URL or path)
  pdfUrl: {
    type: String,
    default: null
  },
  // KYC processing status: pending -> processing -> completed -> rejected
  status: {
    type: String,
    default: 'pending'
  },
  // User type (default: user)
  type: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true // creates createdAt and updatedAt automatically
});

module.exports = mongoose.model('Kyc', kycSchema);
