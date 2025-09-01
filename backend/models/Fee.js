const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  tuitionFee: { type: Number, required: true },
  examFee: { type: Number, required: true },
  otherFee: { type: Number, required: true },
  insuranceFee: { type: Number, required: true },
  total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Fee", feeSchema);
