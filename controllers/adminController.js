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

  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  const applications = await Application.countDocuments();

  res.json({
    totalUsers: users,
    totalJobs: jobs,
    totalApplications: applications
  });

};