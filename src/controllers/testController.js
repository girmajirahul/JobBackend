const mongoose = require("mongoose");
const Job = require("../models/Job");
const Application = require("../models/Application");
const TestQuestion = require("../models/TestQuestion");
const TestAttempt = require("../models/TestAttempt");

const XLSX = require("xlsx");


// Fisher-Yates shuffle, used to randomize question order per attempt
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};


// -------------------------------------------------------------------------
// START TEST
// POST /api/tests/start
// body: { jobId, questionCount? }
// -------------------------------------------------------------------------
// exports.startTest = async (req, res) => {
//   try {

//     const { jobId, questionCount } = req.body;

//     if (!jobId) {
//       return res.status(400).json({ message: "jobId is required" });
//     }

//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     // candidate must have applied for this job before taking its test
//     const application = await Application.findOne({
//       job: jobId,
//       applicant: req.user._id
//     });

//     if (!application) {
//       return res.status(403).json({
//         message: "You must apply to this job before taking its test"
//       });
//     }

//     // resume an attempt already in progress instead of starting a fresh one
//     const existingAttempt = await TestAttempt.findOne({
//       candidate: req.user._id,
//       job: jobId,
//       status: "IN_PROGRESS"
//     });

//     if (existingAttempt) {
//       return res.status(200).json({
//         success: true,
//         message: "Resuming your in-progress test",
//         data: {
//           attemptId: existingAttempt._id,
//           totalQuestions: existingAttempt.attemptQuestions.length,
//           status: existingAttempt.status
//         }
//       });
//     }

//     const questionPool = await TestQuestion.find({
//       job: jobId,
//       isActive: true
//     });

//     if (questionPool.length === 0) {
//       return res.status(404).json({
//         message: "No active questions configured for this job yet"
//       });
//     }

//     const count = Math.min(
//       Number(questionCount) || questionPool.length,
//       questionPool.length
//     );

//     const selected = shuffle(questionPool).slice(0, count);

//     const attemptQuestions = selected.map((q, index) => ({
//       question: q._id,
//       displayOrder: index + 1,
//       marks: q.marks,
//       negativeMarks: q.negativeMarks
//     }));

//     const totalMarks = attemptQuestions.reduce(
//       (sum, q) => sum + (q.marks || 0),
//       0
//     );

//     const attempt = await TestAttempt.create({
//       candidate: req.user._id,
//       job: jobId,
//       application: application._id,
//       attemptQuestions,
//       totalMarks,
//       status: "IN_PROGRESS"
//     });

//     res.status(201).json({
//       success: true,
//       message: "Test started successfully",
//       data: {
//         attemptId: attempt._id,
//         totalQuestions: attemptQuestions.length,
//         totalMarks,
//         status: attempt.status
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.startTest = async (req, res) => {
  try {
    const { jobId, questionCount } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "jobId is required"
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    // Candidate must have applied for this job
    const application = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (!application) {
      return res.status(403).json({
        message: "You must apply to this job before taking its test"
      });
    }

    // Check if candidate has already attempted this test
    const existingAttempt = await TestAttempt.findOne({
      candidate: req.user._id,
      job: jobId
    });

    if (existingAttempt?.status === "IN_PROGRESS") {
      return res.status(200).json({
        success: true,
        message: "Resuming your in-progress test",
        data: {
          attemptId: existingAttempt._id,
          totalQuestions: existingAttempt.attemptQuestions.length,
          totalMarks: existingAttempt.totalMarks,
          status: existingAttempt.status
        }
      });
    }

    if (existingAttempt?.status === "COMPLETED" || existingAttempt?.status === "SUBMITTED") { 
      return res.status(409).json({ 
        success: false, 
        message: "You have already completed this test", 
        data: { 
          attemptId: existingAttempt._id, 
          status: existingAttempt.status 
        } 
      }); 
    }

    // Get active questions
    const questionPool = await TestQuestion.find({
      job: jobId,
      isActive: true
    });

    if (questionPool.length === 0) {
      return res.status(404).json({
        message: "No active questions configured for this job yet"
      });
    }

    const count = Math.min(
      Number(questionCount) || questionPool.length,
      questionPool.length
    );

    const selected = shuffle(questionPool).slice(0, count);

    const attemptQuestions = selected.map((q, index) => ({
      question: q._id,
      displayOrder: index + 1,
      marks: q.marks,
      negativeMarks: q.negativeMarks
    }));

    const totalMarks = attemptQuestions.reduce(
      (sum, q) => sum + (q.marks || 0),
      0
    );

    const attempt = await TestAttempt.create({
      candidate: req.user._id,
      job: jobId,
      application: application._id,
      attemptQuestions,
      totalMarks,
      status: "IN_PROGRESS"
    });

    return res.status(201).json({
      success: true,
      message: "Test started successfully",
      data: {
        attemptId: attempt._id,
        totalQuestions: attemptQuestions.length,
        totalMarks,
        status: attempt.status
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


// -------------------------------------------------------------------------
// GET TEST QUESTIONS
// GET /api/tests/:attemptId/questions
// -------------------------------------------------------------------------
exports.getTestQuestions = async (req, res) => {
  try {

    const { attemptId } = req.params;

    const attempt = await TestAttempt.findById(attemptId)
      .populate("attemptQuestions.question");

    if (!attempt) {
      return res.status(404).json({ message: "Test attempt not found" });
    }

    if (attempt.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    if (attempt.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message: `This test is already ${attempt.status.toLowerCase()}`
      });
    }

    const questions = attempt.attemptQuestions
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((aq) => ({
        questionId: aq.question._id,
        displayOrder: aq.displayOrder,
        marks: aq.marks,
        type: aq.question.type,
        difficulty: aq.question.difficulty,
        questionText: aq.question.questionText,
        // isCorrect is intentionally stripped so candidates can't see answers
        options: aq.question.options.map((opt) => ({
          optionId: opt._id,
          text: opt.text
        }))
      }));

    res.json({
      success: true,
      message: "Data fetch successfully !",
      data: {
        attemptId: attempt._id,
        job: attempt.job,
        status: attempt.status,
        totalQuestions: questions.length,
        questions
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// -------------------------------------------------------------------------
// SUBMIT RESPONSES
// POST /api/tests/:attemptId/submit
// body: { responses: [{ questionId, selectedOptionIds: [] }] }
// -------------------------------------------------------------------------
exports.submitResponses = async (req, res) => {
  try {

    const { attemptId } = req.params;
    const { responses } = req.body;

    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: "responses array is required" });
    }

    const attempt = await TestAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: "Test attempt not found" });
    }

    if (attempt.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    if (attempt.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message: `This test is already ${attempt.status.toLowerCase()}`
      });
    }

    const validQuestionIds = attempt.attemptQuestions.map((aq) =>
      aq.question.toString()
    );

    const questionDocs = await TestQuestion.find({
      _id: { $in: validQuestionIds }
    });

    const questionMap = {};
    questionDocs.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    const attemptQuestionMap = {};
    attempt.attemptQuestions.forEach((aq) => {
      attemptQuestionMap[aq.question.toString()] = aq;
    });

    let score = 0;
    const gradedResponses = [];

    for (const res_ of responses) {

      const { questionId, selectedOptionIds } = res_;

      if (!questionId || !validQuestionIds.includes(questionId.toString())) {
        // ignore responses for questions not part of this attempt
        continue;
      }

      const question = questionMap[questionId.toString()];
      const attemptQuestion = attemptQuestionMap[questionId.toString()];

      const correctOptionIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt._id.toString());

      const selectedIds = (selectedOptionIds || []).map((id) => id.toString());

      const isCorrect =
        correctOptionIds.length === selectedIds.length &&
        correctOptionIds.every((id) => selectedIds.includes(id));

      const marksAwarded = isCorrect
        ? attemptQuestion.marks || 0
        : -(attemptQuestion.negativeMarks || 0);

      score += marksAwarded;

      gradedResponses.push({
        question: question._id,
        selectedOptionIds: selectedIds,
        isCorrect,
        marksAwarded,
        answeredAt: new Date()
      });
    }

    attempt.responses = gradedResponses;
    attempt.score = score;
    attempt.status = "COMPLETED";
    attempt.submittedAt = new Date();

    await attempt.save();

    res.json({
      success: true,
      message: "Test submitted successfully",
      data: {
        attemptId: attempt._id,
        status: attempt.status,
        totalMarks: attempt.totalMarks,
        score: attempt.score,
        totalAnswered: gradedResponses.length,
        submittedAt: attempt.submittedAt
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attemptId",
      });
    }

    const attempt = await TestAttempt.findById(attemptId)
      .populate({
        path: "candidate",
        select: "_id name email",
      })
      .populate({
        path: "job",
        select: "_id title",
      })
      .populate({
        path: "application",
        select: "_id status",
      })
      .populate({
        path: "attemptQuestions.question",
        select: "_id questionText options type",
      })
      .lean();

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Test attempt not found",
      });
    }

    // Create a quick lookup for responses by question ID
    const responseMap = new Map(
      attempt.responses.map((response) => [
        response.question.toString(),
        response,
      ])
    );

    const questions = attempt.attemptQuestions
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((attemptQuestion) => {
        const questionId = attemptQuestion.question?._id?.toString();

        const response = responseMap.get(questionId);

        return {
          question: attemptQuestion.question,
          displayOrder: attemptQuestion.displayOrder,
          marks: attemptQuestion.marks,
          negativeMarks: attemptQuestion.negativeMarks,

          response: response
            ? {
                selectedOptionIds: response.selectedOptionIds,
                isCorrect: response.isCorrect,
                marksAwarded: response.marksAwarded,
                answeredAt: response.answeredAt,
              }
            : null,
        };
      });

    return res.status(200).json({
      success: true,
      message: "Test result fetched successfully",

      data: {
        attemptId: attempt._id,

        candidate: attempt.candidate,
        job: attempt.job,
        application: attempt.application,

        status: attempt.status,

        result: {
          totalMarks: attempt.totalMarks,
          score: attempt.score,
          percentage:
            attempt.totalMarks > 0
              ? Number(
                  ((attempt.score / attempt.totalMarks) * 100).toFixed(2)
                )
              : 0,
        },

        timing: {
          durationMinutes: attempt.durationMinutes,
          startedAt: attempt.startedAt,
          submittedAt: attempt.submittedAt,
        },

        questions,
      },
    });
  } catch (error) {
    console.error("Get attempt result error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch test result",
      error: error.message,
    });
  }
};



// -------------------------------------------------------------------------
// BULK IMPORT QUESTIONS
// POST /api/tests/questions/bulk-import
// body: { jobId, questions: [{ questionText, type, difficulty, marks,
//         negativeMarks, topic, subTopics, options: [{ text, isCorrect }] }] }
// -------------------------------------------------------------------------
// exports.bulkImportQuestions = async (req, res) => {
//   try {

//     const { jobId, questions } = req.body;

//     if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
//       return res.status(400).json({ message: "Valid jobId is required" });
//     }

//     if (!Array.isArray(questions) || questions.length === 0) {
//       return res.status(400).json({ message: "questions array is required" });
//     }

//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     const errors = [];

//     const docs = questions.reduce((acc, q, index) => {

//       const rowLabel = `Question ${index + 1}`;

//       if (!q.questionText) {
//         errors.push(`${rowLabel}: questionText is required`);
//         return acc;
//       }

//       if (!Array.isArray(q.options) || q.options.length < 2) {
//         errors.push(`${rowLabel}: at least 2 options are required`);
//         return acc;
//       }

//       const hasCorrectOption = q.options.some((opt) => opt.isCorrect);

//       if (!hasCorrectOption) {
//         errors.push(`${rowLabel}: at least 1 correct option is required`);
//         return acc;
//       }

//       acc.push({
//         job: jobId,
//         jobRole: job.title,
//         type: q.type || "single_choice",
//         difficulty: q.difficulty || "medium",
//         questionText: q.questionText,
//         options: q.options.map((opt) => ({
//           text: opt.text,
//           isCorrect: !!opt.isCorrect
//         })),
//         marks: q.marks ?? 1,
//         negativeMarks: q.negativeMarks ?? 0,
//         topic: q.topic,
//         subTopics: q.subTopics,
//         isActive: q.isActive ?? true
//       });

//       return acc;

//     }, []);

//     const inserted = docs.length ? await TestQuestion.insertMany(docs) : [];

//     res.status(201).json({
//       success: true,
//       message: "Questions imported successfully",
//       data: {
//         totalReceived: questions.length,
//         totalImported: inserted.length,
//         totalSkipped: errors.length,
//         errors
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




exports.bulkImportQuestions = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Valid jobId is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }



    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return res.status(400).json({
        success: false,
        message: "Excel file does not contain any sheet",
      });
    }

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: true,
    });

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty",
      });
    }

    const requiredColumns = [
      "Question",
      "A",
      "B",
      "C",
      "D",
      "Answer",
      "Level",
      "Topic",
      "SubTopic",
    ];

    const excelColumns = Object.keys(rows[0]);

    const missingColumns = requiredColumns.filter(
      (column) => !excelColumns.includes(column)
    );

    if (missingColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Excel format",
        missingColumns,
        expectedColumns: requiredColumns,
      });
    }


    // Convert Level from Excel to MongoDB difficulty
    const normalizeDifficulty = (level) => {
      const value = String(level || "")
        .trim()
        .toLowerCase();

      switch (value) {
        case "easy":
          return "easy";

        case "mid":
        case "medium":
          return "medium";

        case "hard":
          return "hard";

        default:
          return null;
      }
    };

    // Normalize answer
    const normalizeAnswer = (answer) => {
      return String(answer || "")
        .trim()
        .toUpperCase();
    };

    const errors = [];
    const docs = [];

    rows.forEach((row, index) => {
      const excelRowNumber = index + 2;
      const rowLabel = `Excel Row ${excelRowNumber}`;

      const questionText = String(
        row.Question || ""
      ).trim();

      if (!questionText) {
        errors.push(
          `${rowLabel}: Question is required`
        );
        return;
      }

      const optionValues = [
        {
          key: "A",
          text: String(row.A || "").trim(),
        },
        {
          key: "B",
          text: String(row.B || "").trim(),
        },
        {
          key: "C",
          text: String(row.C || "").trim(),
        },
        {
          key: "D",
          text: String(row.D || "").trim(),
        },
      ];

      // Remove empty options
      const options = optionValues.filter(
        (option) => option.text !== ""
      );

      // At least 2 options
      if (options.length < 2) {
        errors.push(
          `${rowLabel}: at least 2 options are required`
        );
        return;
      }

      const answer = normalizeAnswer(row.Answer);

      if (!["A", "B", "C", "D"].includes(answer)) {
        errors.push(
          `${rowLabel}: Answer must be A, B, C or D`
        );
        return;
      }

      // Check answer option exists
      const answerOption = options.find(
        (option) => option.key === answer
      );

      if (!answerOption) {
        errors.push(
          `${rowLabel}: Answer "${answer}" does not have a corresponding option`
        );
        return;
      }

      const formattedOptions = options.map(
        (option) => ({
          text: option.text,
          isCorrect: option.key === answer,
        })
      );

      const difficulty = normalizeDifficulty(
        row.Level
      );

      if (!difficulty) {
        errors.push(
          `${rowLabel}: Level must be easy, mid/medium or hard`
        );
        return;
      }

      const topic = String(
        row.Topic || ""
      ).trim();

      const subTopics = String(
        row.SubTopic || ""
      ).trim();

      docs.push({
        job: jobId,
        jobRole: job.title,
        type: "single_choice",
        difficulty,
        questionText,
        options: formattedOptions,

        marks: 1,
        negativeMarks: 0,
        topic: topic || undefined,
        subTopics: subTopics || undefined,
        isActive: true,
      });
    });

    let inserted = [];

    if (docs.length > 0) {
      inserted = await TestQuestion.insertMany(
        docs
      );
    }

    return res.status(201).json({
      success: true,
      message: "Questions imported successfully",

      data: {
        jobId,
        jobRole: job.title,
        fileName: req.file.originalname,
        totalReceived: rows.length,
        totalImported: inserted.length,
        totalSkipped: errors.length,
        errors,
      },
    });
  } catch (error) {
    console.error(
      "Bulk Question Excel Import Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to import questions",
      error: error.message,
    });
  }
};