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
  updateSkills,
  getProfile,
  getEducation,
  getExperience,
  getProjects,
  getSkills
} = require("../controllers/userController");

router.put("/profile", protect, updateProfile);
router.get("/profile",protect, getProfile)

router.post("/education", protect, addEducation);
router.get('/education',protect,getEducation)
router.put("/education/:eduId", protect, updateEducation);
router.delete("/education/:eduId", protect, deleteEducation);

router.post("/experience", protect, addExperience);
router.get("/experience",protect,getExperience)
router.put("/experience/:expId", protect, updateExperience);
router.delete("/experience/:expId", protect, deleteExperience);

router.post("/projects", protect, addProject);
router.get("/projects",protect,getProjects)

router.get("/skills",protect,getSkills)
router.put("/skills", protect, updateSkills);

module.exports = router;