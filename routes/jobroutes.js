const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const checkEmployer = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { bulkImportJobs } = require("../controllers/jobController");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobController");


// PUBLIC
router.get("/", getJobs);
router.get("/:id", getJobById);


// EMPLOYER ONLY
router.post("/", protect, checkEmployer, createJob);
router.post(
  "/bulk-import",
  protect,
  checkEmployer,
  upload.single("file"),
  bulkImportJobs
);
router.put("/update-job/:id", protect, checkEmployer, updateJob);
router.delete("/:id", protect, checkEmployer, deleteJob);

module.exports = router;