const express = require("express");
const router = express.Router();
const { submitPayment, getPayments } = require("../controllers/paymentController");
const auth = require("../middleware/auth");

router.post("/", auth, submitPayment);

router.get("/", auth, getPayments);

module.exports = router;
