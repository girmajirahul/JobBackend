const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["jobseeker", "employer","admin"],
    default: "jobseeker",
  },
  resume: String,
  companyName: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);