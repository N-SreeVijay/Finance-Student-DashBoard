const express = require("express");
const router = express.Router();
const { getFee, updateFee } = require("../controllers/feeController");

router.get("/", getFee);
router.put("/", updateFee);

module.exports = router;
