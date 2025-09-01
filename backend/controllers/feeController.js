const Fee = require("../models/Fee");
const getFee = async (req, res) => {
  try {
    const fee = await Fee.findOne();
    if (!fee) return res.status(404).json({ message: "Fee info not found" });
    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const updateFee = async (req, res) => {
  try {
    let fee = await Fee.findOne();
    if (!fee) {
      fee = new Fee(req.body);
    } else {
      Object.assign(fee, req.body);
    }
    const saved = await fee.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error updating fee info" });
  }
};

module.exports = { getFee, updateFee };
