const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema(
  {
    semester: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const StudentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    mobile: { type: String },
    branch: { type: String },
    course: { type: String },
    currentSemester: { type: Number, required: true },
    admissionYear: { type: Number },
    semfees:{type:Number},
  },
  { collection: 'students', timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);
