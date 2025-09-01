const Payment = require("../models/Payment");

exports.submitPayment = async (req, res) => {
  try {
    const 
    {
      method,
      amount,
      date,
      challanNumber,
      registrationNo,
      studentName,
      utrNumber,
      fromBank,
      toBank,
      transactionId,
      upiId,
      merchantName
    } = req.body;

    if (utrNumber) {
      const existingUTR = await Payment.findOne({ utrNumber });
      if (existingUTR) return res.status(400).json({ message: "Duplicate UTR number" });
    }

    if (transactionId) {
      const existingTxn = await Payment.findOne({ transactionId });
      if (existingTxn) return res.status(400).json({ message: "Duplicate Transaction ID" });
    }

    const payment = new Payment(
      {
      studentId: req.user.id,
      method,
      amount,
      date,
      status: "pending", 
      challanNumber: method === "cash" ? challanNumber : undefined,
      registrationNo: method === "cash" ? registrationNo : undefined,
      studentName: method === "cash" ? studentName : undefined,
      utrNumber: method === "bank_transfer" ? utrNumber : undefined,
      fromBank: method === "bank_transfer" ? fromBank : undefined,
      toBank: method === "bank_transfer" ? toBank : undefined,
      transactionId: method === "upi" ? transactionId : undefined,
      upiId: method === "upi" ? upiId : undefined,
      merchantName: method === "upi" ? merchantName : undefined
    }
  );

    await payment.save();
    res.status(201).json(payment);
  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
