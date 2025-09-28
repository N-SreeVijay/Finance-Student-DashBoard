const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  type: { type: String, enum: ["success", "warning", "reminder", "info"], default: "info" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
