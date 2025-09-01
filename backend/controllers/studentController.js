const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const generateToken = (id, registrationNumber) =>
  jwt.sign({ id, registrationNumber }, process.env.JWT_SECRET, { expiresIn: '2h' });

const loginStudent = async (req, res) => {
  const { registrationNumber, password } = req.body;

  if (!registrationNumber || !password) {
    return res.status(400).json({ message: 'Registration number and password are required' });
  }

  try {
    const student = await Student.findOne({ registrationNumber });
    if (!student)
      return res.status(401).json({ message: 'Invalid registration number or password' });

    if (password !== student.registrationNumber) {
      return res.status(401).json({ message: 'Invalid registration number or password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(student._id, student.registrationNumber),
      student: {
        registrationNumber: student.registrationNumber,
        fullName: student.fullName,
        email: student.email,
        mobile: student.mobile,
        branch: student.branch,
        course: student.course,
        currentSemester: student.currentSemester,
        admissionYear: student.admissionYear,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.user.id,
      {
        fullName: req.body.fullName,
        email: req.body.email,
        mobile: req.body.mobile,
        currentSemester: req.body.currentSemester,
      },
      {
        new: true,             
        runValidators: true,   
        omitUndefined: true,  
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

module.exports = {
  loginStudent,
  getProfile,
  updateProfile,
};
