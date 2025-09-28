const Student = require('../models/Student');
const Payment = require('../models/Payment');
const StdFeeData = require('../models/stdFeedata');

async function updateStdFeeData() {
  try {
    const students = await Student.find().lean();

    for (const student of students) {
      const semfees = Number(
        student.semfees ?? student.semFees ?? student.semesterFees ?? 0
      );

      const payments = await Payment.find({
        studentId: student._id,
        status: 'paid',
      }).lean();

      const totalPaid = payments.reduce(
        (sum, p) => sum + (Number(p.amount) || 0),
        0
      );

      const totalDue = semfees - totalPaid;

      const paymentHistory = payments.map((p) => ({
        _id: p._id,
        amount: p.amount,
        date: p.date,
        method: p.method,
        status: p.status,
      }));

      const feeData = {
        studentId: student._id,
        fullName: student.fullName,
        registrationNumber: student.registrationNumber,
        branch: student.branch,
        course: student.course,
        currentSemester: student.semester ?? student.currentSemester ?? 1,
        semfees,
        totalPaid,
        totalDue,
        payments: paymentHistory,
      };

      await StdFeeData.findOneAndUpdate(
        { studentId: student._id },
        feeData,
        { new: true, upsert: true }
      );
    }

    console.log('Updated successfully!');
  } catch (err) {
    console.error('Error updating', err);
  }
}

module.exports = { updateStdFeeData };
