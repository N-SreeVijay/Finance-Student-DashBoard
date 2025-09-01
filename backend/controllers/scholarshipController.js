const Scholarship = require('../models/Scholarship');
exports.getScholarships = async (req, res) => 
  {
  try {
    const studentId = req.user.id; 
    const scholarships = await Scholarship.find({ studentId }).sort({ appliedDate: -1 });
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.createScholarship = async (req, res) => 
  {
  try {
    const studentId = req.user.id;
    const { studentName, registrationNumber, bankName, accountNumber, ifscCode, branch, amount, concessionPercentage } = req.body;

    const newScholarship = new Scholarship(
      {
      studentId,
      studentName,
      registrationNumber,
      bankName,
      accountNumber,
      ifscCode,
      branch,
      amount,
      concessionPercentage,
    }
  );

    await newScholarship.save();
    res.status(201).json(newScholarship);
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateScholarshipStatus = async (req, res) => 
  {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const scholarship = await Scholarship.findById(id);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    scholarship.status = status;
    await scholarship.save();

    res.json(scholarship);
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteScholarship = async (req, res) => {
  try 
  {
    const { id } = req.params;
    const scholarship = await Scholarship.findByIdAndDelete(id);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    res.json({ message: 'Scholarship deleted successfully' });
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'Server error' });
  }
};
