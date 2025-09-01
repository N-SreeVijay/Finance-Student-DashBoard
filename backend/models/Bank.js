
const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  branch: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  upiId: { type: String },
  upiQrData: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Bank", bankSchema);
