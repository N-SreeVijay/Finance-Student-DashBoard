// backend/routes/stdFeeData.js
const express = require("express");
const router = express.Router();
const StdFeeData = require("../models/stdFeedata");
const authMiddleware = require("../middleware/auth"); 

router.get("/fe", authMiddleware, async (req, res) => {
  try {
    const feeData = await StdFeeData.findOne({ studentId: req.user._id });
    if (!feeData) return res.status(404).json({ message: "Fee data not found" });
    res.json(feeData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
