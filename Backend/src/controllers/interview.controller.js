const mongoose = require("mongoose");
const { PDFParse } = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

const MAX_JOB_DESCRIPTION_LENGTH = 5000;

async function extractResumeText(file) {
  const parser = new PDFParse({ data: file.buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

/**
 * @description Controller to generate interview report based on user self description,resume and job description
 */

async function generateInterviewReportController(req, res) {
  const jobDescription = req.body?.jobDescription?.trim();
  const selfDescription = req.body?.selfDescription?.trim() || "";

  if (!jobDescription) {
    return res.status(400).json({ message: "Job description is required" });
  }
  if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
    return res.status(400).json({
      message: `Job description must be at most ${MAX_JOB_DESCRIPTION_LENGTH} characters`,
    });
  }
  if (!req.file && !selfDescription) {
    return res.status(400).json({
      message: "Either a resume PDF or a self description is required",
    });
  }

  let resume = "";
  if (req.file) {
    try {
      resume = (await extractResumeText(req.file)).trim();
    } catch (error) {
      console.error("Failed to read resume PDF:", error);
      return res.status(400).json({
        message: "Could not read the resume PDF. Please upload a valid PDF file.",
      });
    }
    if (!resume && !selfDescription) {
      return res.status(400).json({
        message:
          "No text could be extracted from the resume PDF. Upload a text-based PDF or add a self description.",
      });
    }
  }

  try {
    const interviewReportByAI = await generateInterviewReport({
      resume,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume,
      selfDescription,
      jobDescription,
      ...interviewReportByAI,
    });

    return res.status(201).json({
      message: "Interview report generated successfully",
      report: interviewReport,
    });
  } catch (error) {
    console.error("Failed to generate interview report:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate interview report" });
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */

async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  if (!mongoose.isValidObjectId(interviewId)) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }
  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @description Controller to delete an interview report of the logged in user.
 */

async function deleteInterviewReportController(req, res) {
  const { interviewId } = req.params;

  if (!mongoose.isValidObjectId(interviewId)) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  // Filtering by user as well means nobody can delete another user's report
  const interviewReport = await interviewReportModel.findOneAndDelete({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }
  res.status(200).json({
    message: "Interview report deleted successfully.",
  });
}

/**
 * @description Controller to get all interview reports of logged in user.
 */

async function getAllInterviewReports(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );
  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */

async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  if (!mongoose.isValidObjectId(interviewReportId)) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  let pdfBuffer;
  try {
    pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
    });
  } catch (error) {
    console.error("Failed to generate resume PDF:", error);
    return res.status(500).json({ message: "Failed to generate resume PDF" });
  }

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  deleteInterviewReportController,
  getAllInterviewReports,
  generateResumePdfController,
};
