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

exports.getEducation = async (req, res) => {
  try {
    const education = await User.findById(req.user.id)
      .select("education -_id");

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Education fetched successfully",
      data: education.education,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch education",
    });
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

exports.getExperience = async (req, res) => {
  try {
    const experience = await User.findById(req.user.id)
      .select("experience -_id");

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience fetched successfully",
      data: experience.experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch experience",
    });
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

exports.getProjects=async(req,res)=>{
  try{
    const projects = await User.findById(req.user.id)
      .select("projects -_id");

    if (!projects) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects.projects,
    });
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}

// ================= SKILLS =================
exports.getSkills =async(req,res)=>{
  try{
    const skills = await User.findById(req.user.id)
      .select("skills -_id");

    if (!skills) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skills fetched successfully",
      data: skills.skills,
    });

  }catch(err){
    res.status(500).json(err.message)
  }
}

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



exports.getProfile = async (req, res) => {
  try {
    const userdata = await User.findById(req.user.id)
      .select("name email phone location linkedin github jobTitle website bio ");

    res.json({
      success: true,
      message: "Data fetched successfully",
      data: userdata,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
    });
  }
};