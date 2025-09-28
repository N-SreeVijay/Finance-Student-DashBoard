const mongoose = require("mongoose");

const DeadlineSchema = new mongoose.Schema({
  dueDate: { type: Date, required: true },
  description: { type: String, default: "Fee payment deadline" }
}, { timestamps: true });

module.exports = mongoose.model("Deadline", DeadlineSchema);
