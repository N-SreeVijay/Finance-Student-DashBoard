
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  method: { type: String, enum: ['cash', 'bank_transfer', 'upi'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  challanNumber: { type: String },
  registrationNo: { type: String, required: true },
  studentName: { type: String, required: true },
  utrNumber: { type: String },
  fromBank: { type: String },
  toBank: { type: String },
  transactionId: { type: String },
  upiId: { type: String },
  merchantName: { type: String },
  status: { type: String, enum: ['paid', 'pending', 'processing', 'failed'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);