const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { generateResume } = require("../controllers/resumeController");

router.get("/generate", protect, generateResume);

module.exports = router;