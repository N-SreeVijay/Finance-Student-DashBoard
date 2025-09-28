const Payment = require("../models/Payment");

function startPaymentWatcher(io) {
  setInterval(async () => {
    try {
      const newPayments = await Payment.find({ status: "paid", notified: false });

      newPayments.forEach(async (payment) => {
        io.emit("paymentVerified", {
          type: "success",
          title: "Payment Verified",
          message: `Payment of ₹${payment.amount} by ${payment.studentName} has been verified.`,
          date: new Date(),
        });

        payment.notified = true;
        await payment.save();
      });
    } catch (err) {
      console.error("Error in payment watcher:", err);
    }
  }, 10000);
}

module.exports = startPaymentWatcher;
