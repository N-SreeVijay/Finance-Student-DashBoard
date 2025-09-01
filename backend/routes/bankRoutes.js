
const express = require("express");
const router = express.Router();
const { getBankInfo, updateBankInfo } = require("../controllers/bankController");
const auth = require("../middleware/auth");

router.get("/", getBankInfo);

router.put("/", auth, updateBankInfo);

module.exports = router;
