const User = require("../models/User");

// ================= PROFILE =================
exports.updateProfile = async (req, res) => {
  try {

    if (!Object.keys(req.body).length) {
      return res.status(400).json({ message: "No data provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { returnDocument: "after", runValidators: true }
    ).select("-password -otp");

    res.json({ message: "Profile updated", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= EDUCATION =================
exports.addEducation = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { education: req.body } },
      { returnDocument: "after" }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEducation = async (req, res) => {
  try {

    const { eduId } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, "education._id": eduId },
      { $set: { "education.$": req.body } },
      { returnDocument: "after" }
    );

    if (!user) return res.status(404).json({ message: "Education not found" });

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEducation = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { education: { _id: req.params.eduId } } },
      { returnDocument: "after" }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= EXPERIENCE =================
exports.addExperience = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { experience: req.body } },
      { returnDocument: "after" }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, "experience._id": req.params.expId },
      { $set: { "experience.$": req.body } },
      { returnDocument: "after" }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExperience = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { experience: { _id: req.params.expId } } },
      { returnDocument: "after" }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= PROJECTS =================
exports.addProject = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { projects: req.body } },
      { returnDocument: "after" }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SKILLS =================
exports.updateSkills = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { skills: req.body.skills } },
      { returnDocument: "after" }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};