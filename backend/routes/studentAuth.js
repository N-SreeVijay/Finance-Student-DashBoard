const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, loginStudent } = require("../controllers/studentController");
const auth = require("../middleware/auth");

router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);

router.post('/login', loginStudent);

module.exports = router;
