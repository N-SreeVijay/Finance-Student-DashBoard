const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    sem: { type: String, required: true }, 
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    branch: { type: String },
    amount: { type: Number, required: true },
    concessionPercentage: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', ScholarshipSchema);
