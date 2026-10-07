import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useCallback, useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";

/**
 * Interview actions. They throw on failure so the calling page can show the error,
 * and they don't fetch anything on their own — each page decides what to load.
 */
export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  const { reports, setReports } = context;

  const generateReport = useCallback(
    async ({ jobDescription, selfDescription, resumeFile }) => {
      const data = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      return data.report;
    },
    [],
  );

  const getReportById = useCallback(async (interviewId) => {
    const data = await getInterviewReportById(interviewId);
    return data.interviewReport;
  }, []);

  const getReports = useCallback(async () => {
    const data = await getAllInterviewReports();
    setReports(data.interviewReports);
    return data.interviewReports;
  }, [setReports]);

  const getResumePdf = useCallback(async (interviewReportId) => {
    const pdf = await generateResumePdf({ interviewReportId });
    const url = window.URL.createObjectURL(
      new Blob([pdf], { type: "application/pdf" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `resume_${interviewReportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Give the browser time to start the download before freeing the blob
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }, []);

  return {
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
