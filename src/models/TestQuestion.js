const mongoose = require("mongoose");

// Equivalent of SelfEvaluationQuestionOptions, embedded instead of a separate table
const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: true }
);

const testQuestionSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    // Denormalized snapshot so question banks stay searchable/reusable even if
    // the Job doc changes title later. Also lets bulk import group by role.
    jobRole: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["single_choice", "multiple_choice", "true_false"],
      default: "single_choice",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    questionText: { type: String, required: true },
    options: {
      type: [optionSchema],
      validate: {
        validator: (opts) => Array.isArray(opts) && opts.length >= 2,
        message: "A question needs at least 2 options",
      },
    },
    marks: { type: Number, default: 1 },
    negativeMarks: { type: Number, default: 0 },
    topic: String,
    subTopics: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

testQuestionSchema.index({ job: 1, isActive: 1 });

module.exports = mongoose.model("TestQuestion", testQuestionSchema);
