const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  applyJob,
  getMyApplications,
  getApplicants,
  updateApplicationStatus
} = require("../controllers/applicationController");


// APPLY JOB
router.post("/apply/:jobId", protect, applyJob);


// JOB SEEKER APPLICATIONS
router.get("/my-applications", protect, getMyApplications);


// EMPLOYER VIEW APPLICANTS
router.get("/applicants/:jobId", protect, getApplicants);


// ACCEPT / REJECT
router.put("/status/:id", protect, updateApplicationStatus);

module.exports = router;