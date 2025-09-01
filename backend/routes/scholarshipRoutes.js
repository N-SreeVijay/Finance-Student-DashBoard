const express = require("express");
const router = express.Router();
const {
  getScholarships,
  createScholarship,
  updateScholarshipStatus,
} = require("../controllers/scholarshipController");

const protect = require("../middleware/auth"); 

router.get("/", protect, getScholarships);
router.post("/", protect, createScholarship);
const { deleteScholarship } = require("../controllers/scholarshipController");

router.delete("/:id", protect, deleteScholarship);


module.exports = router;
