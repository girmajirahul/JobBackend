const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  updateProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addProject,
  updateSkills
} = require("../controllers/userController");

router.put("/profile", protect, updateProfile);

router.post("/education", protect, addEducation);
router.put("/education/:eduId", protect, updateEducation);
router.delete("/education/:eduId", protect, deleteEducation);

router.post("/experience", protect, addExperience);
router.put("/experience/:expId", protect, updateExperience);
router.delete("/experience/:expId", protect, deleteExperience);

router.post("/projects", protect, addProject);

router.put("/skills", protect, updateSkills);

module.exports = router;