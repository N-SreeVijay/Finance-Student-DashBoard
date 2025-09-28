const express = require("express");
const StdFeeData = require("../models/stdFeedata");
const Deadline = require("../models/deadline");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * ✅ Get notifications for the logged-in student
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user.id;
    const dynamicNotifications = [];

    // 1. Auto-generate "Fee Due" notification
    const feeData = await StdFeeData.findOne({ studentId });
    if (feeData?.totalDue > 0) {
      dynamicNotifications.push({
        _id: `fee-${studentId}`, // use _id for consistency
        type: "warning",
        title: "Fee Due",
        message: `You have ₹${feeData.totalDue} pending.`,
        date: new Date(),
        read: false,
        dynamic: true,
      });
    }

    // 2. Auto-generate "Deadline Reminder"
    const deadline = await Deadline.findOne().sort({ createdAt: -1 });
    if (deadline && new Date(deadline.dueDate) > new Date()) {
      dynamicNotifications.push({
        _id: `deadline-${studentId}`,
        type: "reminder",
        title: "Deadline Reminder",
        message: `Fee deadline: ${new Date(deadline.dueDate).toDateString()}`,
        date: new Date(),
        read: false,
        dynamic: true,
      });
    }

    // 3. Fetch saved DB notifications
    const savedNotifications = await Notification.find({ studentId }).sort({ createdAt: -1 });

    res.json([...dynamicNotifications, ...savedNotifications]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

/**
 * ✅ Mark a single notification as read (DB only)
 */
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Not found or unauthorized" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Mark all notifications as read (DB only)
 */
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { studentId: req.user.id },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Delete a notification (DB only)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notif = await Notification.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user.id,
    });
    if (!notif) return res.status(404).json({ message: "Not found or unauthorized" });
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
