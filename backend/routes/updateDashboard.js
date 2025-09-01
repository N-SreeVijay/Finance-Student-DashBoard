const express = require('express');
const Student = require('../models/Student');
const Payment = require('../models/Payment');
const StdFeeData = require('../models/stdFeedata');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const students = await Student.find();

    for (const student of students) {
      const payments = await Payment.find({ registrationNo: student.registrationNumber });
      const totalPaid = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

      const totalDue = student.semfees - totalPaid;

      await StdFeeData.findOneAndUpdate(
        { registrationNumber: student.registrationNumber },
        {
          registrationNumber: student.registrationNumber,
          fullName: student.fullName,
          branch: student.branch,
          course: student.course,
          currentSemester: student.currentSemester,
          semfees: student.semfees,
          totalPaid,
          totalDue,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Dashboard data updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
