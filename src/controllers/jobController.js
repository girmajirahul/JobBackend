const Job = require("../models/Job");
const fs=require("fs");
const csv=require('csv-parser');

// CREATE JOB
exports.createJob = async (req, res) => {
  try {

    const { title, description, location, salary, skills } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      skills,
      company: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Jobs created succesfully !",
      data: job
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//jobs bulk import
exports.bulkImportJobs = async (req, res) => {

  try {

    const jobs = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {

        jobs.push({
          title: row.title,
          description: row.description,
          location: row.location,
          salary: row.salary,
          skills: row.skills ? row.skills.split(",") : [],
          company: req.user._id
        });

      })
      .on("end", async () => {

        await Job.insertMany(jobs);

        res.json({
          success:true,
          message: "Jobs imported successfully",
          totalJobs: jobs.length
        });

        fs.unlinkSync(req.file.path);

      });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {

    const { title, location, skills, page , limit  } = req.query;

    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (skills) {
      filter.skills = { $in: skills.split(",") };
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .populate("company", "name companyName")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      jobs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE JOB
exports.getJobById = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id)
      .populate("company", "name companyName");

    if (!job)
      return res.status(404).json({ message: "Job not found" });

    res.json({
      success: true,
      message: "Data fetch successfully !",
      data: job
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE JOB
exports.updateJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized"
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Update successfully !",
      data: updatedJob
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateJobStatus = async (req, res) => {

  try {

    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.json({
      message: "Job status updated",
      job
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// DELETE JOB
exports.deleteJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized"
      });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};