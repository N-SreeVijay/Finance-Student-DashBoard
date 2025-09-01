const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Student = require("../models/Student");
const Payment = require("../models/Payment");
const StdFeeData = require("../models/stdFeedata");

dotenv.config();
require("../config/db")(); // connect to MongoDB

async function updateStdFeeData() {
  try {
    const students = await Student.find();

    for (const student of students) {
      const semFees = Number(student.semFees) || 0;

      const payments = await Payment.find({ studentId: student._id, status: "paid" });

      const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      const totalDue = semFees - totalPaid;

      const feeData = {
        studentId: student._id,
        fullName: student.fullName,
        registrationNumber: student.registrationNumber,
        branch: student.branch,
        course: student.course,
        currentSemester: student.semester,
        semfees: semFees,
        totalPaid,
        totalDue,
        payments, 
      };

      await StdFeeData.findOneAndUpdate(
        { studentId: student._id },
        feeData,
        { new: true, upsert: true }
      );
    }

    console.log("StdFeeData updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating StdFeeData:", err);
    process.exit(1);
  }
}

updateStdFeeData();
