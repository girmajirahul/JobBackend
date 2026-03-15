const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getStats
} = require("../controllers/adminController");


// USERS
router.get("/users", protect, adminOnly, getUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);


// JOBS
router.get("/jobs", protect, adminOnly, getAllJobs);
router.delete("/jobs/:id", protect, adminOnly, deleteJob);


// PLATFORM STATS
router.get("/stats", protect, adminOnly, getStats);

module.exports = router;