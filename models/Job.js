const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  salary: String,
  skills: [
      {
        type: String
      }
    ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
   status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive"
  }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);