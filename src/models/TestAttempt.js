const mongoose = require("mongoose");

// Equivalent of SelfEvaluationAttemptQuestions - a snapshot of which questions,
// in which order, and for how many marks, were served for this attempt.
// Embedded because it is only ever read/written together with the attempt.
const attemptQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestQuestion",
      required: true,
    },
    displayOrder: Number,
    marks: Number,
    negativeMarks: { type: Number, default: 0 },
  },
  { _id: false }
);

// Equivalent of SelfEvaluationResponses
const responseSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestQuestion",
      required: true,
    },
    selectedOptionIds: [{ type: mongoose.Schema.Types.ObjectId }],
    isCorrect: { type: Boolean, default: false },
    marksAwarded: { type: Number, default: 0 },
    answeredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Equivalent of SelfEvaluationTestAttempts
const testAttemptSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "EXPIRED"],
      default: "IN_PROGRESS",
    },
    attemptQuestions: [attemptQuestionSchema],
    responses: [responseSchema],
    totalMarks: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    durationMinutes: Number,
    startedAt: { type: Date, default: Date.now },
    submittedAt: Date,
  },
  { timestamps: true }
);

// One IN_PROGRESS attempt per candidate per job at a time is enforced in the
// controller (findOne + create) rather than a unique index, since completed/
// expired attempts for the same pair must remain allowed.
testAttemptSchema.index({ candidate: 1, job: 1 });

module.exports = mongoose.model("TestAttempt", testAttemptSchema);
