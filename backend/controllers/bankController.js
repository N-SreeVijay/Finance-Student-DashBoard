const Bank = require("../models/Bank");
const getBankInfo = async (req, res) => {
  try {
    const bank = await Bank.findOne();
    if (!bank) return res.status(404).json({ message: "Bank info not found" });
    res.json(bank);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const updateBankInfo = async (req, res) => {
  try {
    let bank = await Bank.findOne();
    if (!bank) {
      bank = new Bank(req.body);
    } else {
      Object.assign(bank, req.body);
    }
    const saved = await bank.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error updating bank info" });
  }
};
module.exports = { getBankInfo, updateBankInfo };
