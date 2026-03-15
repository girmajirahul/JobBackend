const Application = require("../models/Application");
const Job = require("../models/Job");


// APPLY JOB
exports.applyJob = async (req, res) => {

  try {

    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You already applied for this job"
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id
    });

    res.status(201).json(application);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



// GET MY APPLICATIONS (Job Seeker)
exports.getMyApplications = async (req, res) => {

  const applications = await Application.find({
    applicant: req.user._id
  })
  .populate("job");

  res.json({
    status:true,
    message:"Data fetch successfully !",
    data:applications
  });
};



// EMPLOYER VIEW APPLICANTS
exports.getApplicants = async (req, res) => {

  const jobId = req.params.jobId;

  const applications = await Application.find({
    job: jobId
  })
  .populate("applicant", "name email resume");

  res.json(applications);
};



// UPDATE APPLICATION STATUS
exports.updateApplicationStatus = async (req, res) => {

  const { status } = req.body;

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(application);
};