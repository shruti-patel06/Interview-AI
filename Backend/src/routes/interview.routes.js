const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");
const {
  generateReportLimiter,
  resumePdfLimiter,
} = require("../middlewares/rateLimit.middleware");
const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate a new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */

interviewRouter.post(
  "/",
  authMiddleware.authUser,
  generateReportLimiter,
  upload.single("resume"),
  interviewController.generateInterviewReportController,
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */

interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route DELETE /api/interview/report/:interviewId
 * @description delete an interview report of the logged in user.
 * @access private
 */

interviewRouter.delete(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.deleteInterviewReportController,
);

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReports,
);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUser,
  resumePdfLimiter,
  interviewController.generateResumePdfController,
);

module.exports = interviewRouter;
