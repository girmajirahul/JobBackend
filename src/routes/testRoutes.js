const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");

const {
  startTest,
  getTestQuestions,
  submitResponses,
  bulkImportQuestions,
  getAttemptResult
} = require("../controllers/testController");


// START TEST
router.post("/start", protect, startTest);


// GET QUESTIONS FOR A TEST
router.get("/:attemptId/questions", protect, getTestQuestions);


// SUBMIT RESPONSES
router.post("/:attemptId/submit", protect, submitResponses);

// GET ATTEMPT RESULT
router.get("/:attemptId/result", protect, getAttemptResult);

// BULK IMPORT QUESTIONS (role/admin protected same way jobs are)
// router.post("/questions/bulk-import", bulkImportQuestions);
router.post(
  "/questions/bulk-import",
  upload.single("file"),
  bulkImportQuestions
);

module.exports = router;
