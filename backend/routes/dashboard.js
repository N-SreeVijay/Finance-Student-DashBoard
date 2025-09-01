const express = require('express');
const StdFeeData = require('../models/stdFeedata');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const studentData = await StdFeeData.findOne({ studentId: req.user._id });

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.json(studentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
