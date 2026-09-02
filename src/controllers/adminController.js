const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");


// GET ALL USERS
exports.getUsers = async (req, res) => {

  const users = await User.find().select("-password");

  res.json(users);

};



// DELETE USER
exports.deleteUser = async (req, res) => {

  await User.findByIdAndDelete(req.params.id);

  res.json({
    message: "User deleted"
  });

};



// GET ALL JOBS
exports.getAllJobs = async (req, res) => {

  const jobs = await Job.find()
    .populate("company", "name companyName");

  res.json(jobs);

};



// DELETE JOB
exports.deleteJob = async (req, res) => {

  await Job.findByIdAndDelete(req.params.id);

  res.json({
    message: "Job removed by admin"
  });

};



// PLATFORM STATS
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status:"active" }); // active jobs
    const inactiveJobs = await Job.countDocuments({ status:"inactive" }); // inactive jobs
    const totalApplications = await Application.countDocuments();

    res.json({
      totalUsers,
      totalJobs,
      activeJobs,
      inactiveJobs,
      totalApplications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};