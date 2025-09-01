const mongoose = require("mongoose");

const StdFeeDataSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  fullName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  branch: { type: String },
  course: { type: String },
  currentSemester: { type: Number },
  semfees: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  totalDue: { type: Number, default: 0 },
  payments: { type: Array, default: [] },
});

module.exports = mongoose.model("StdFeeData", StdFeeDataSchema);
