const mongoose = require("mongoose");

// Sub Schemas
const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  marks:String,
  startYear: String,
  endYear: String,
  description: String
});

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  startDate: String,
  endDate: String,
  description: String
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String],
  link: String
});

const userSchema = new mongoose.Schema(
{
  // BASIC (existing + improved)
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["jobseeker", "employer", "admin"],
    default: "jobseeker"
  },

  // 🔹 PROFILE INFO (for dashboard + resume)
  firstName: String,
  lastName: String,
  phone: String,
  location: String,
  bio: String,

  jobTitle: String,
  experienceLevel: String,

  // 🔹 LINKS
  website: String,
  linkedin: String,
  github: String,

  // 🔹 RESUME DATA (IMPORTANT)
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: [String],

  certifications: [
    {
      title: String,
      issuer: String,
      year: String
    }
  ],

  achievements: [String],

  // 🔹 FILES
  resume: String, // existing (uploaded resume)
  profileImage: String,

  // 🔹 EMPLOYER FIELD
  companyName: String,

  // 🔹 AUTH (OTP)
  otp: String,
  otpExpiry: Date

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);