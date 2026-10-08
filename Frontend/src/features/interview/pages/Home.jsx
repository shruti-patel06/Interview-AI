import { useEffect, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../../../lib/api.js";
import { useAuth } from "../../auth/hooks/useAuth.js";

// Must match the limits enforced by the backend
const MAX_JOB_DESCRIPTION_LENGTH = 5000;
const MAX_RESUME_SIZE_MB = 3;

const Home = () => {
  const { reports, generateReport, getReports, deleteReport } = useInterview();
  const { user, handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getReports().catch(async (err) => {
      setError(
        await getErrorMessage(err, "Could not load your recent interview plans."),
      );
    });
  }, [getReports]);

  const handleResumeChange = (event) => {
    const file = event.target.files[0] ?? null;
    if (file && file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
      setError(`Resume must be ${MAX_RESUME_SIZE_MB} MB or smaller.`);
      setResumeFile(null);
      event.target.value = "";
      return;
    }
    setError("");
    setResumeFile(file);
  };

  const handleDeleteReport = async (event, report) => {
    event.stopPropagation(); // don't open the report the button sits on
    const title = report.title || "this interview plan";
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      return;
    }
    setError("");
    setDeletingId(report._id);
    try {
      await deleteReport(report._id);
    } catch (err) {
      setError(
        await getErrorMessage(err, "Failed to delete the interview plan."),
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleGenerateReport = async () => {
    setError("");
    if (!jobDescription.trim()) {
      setError("Please paste the job description you are preparing for.");
      return;
    }
    if (!resumeFile && !selfDescription.trim()) {
      setError("Upload your resume or write a short self-description.");
      return;
    }

    setGenerating(true);
    try {
      const report = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      navigate(`/interview/${report._id}`);
    } catch (err) {
      setError(
        await getErrorMessage(
          err,
          "Failed to generate your interview plan. Please try again.",
        ),
      );
    } finally {
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <main className="loading-screen">
        <h1>Generating your Interview Plan...</h1>
      </main>
    );
  }
  return (
    <main className="home">
      <section className="interview-panel" aria-labelledby="interview-title">
        <header className="home-header">
          <span className="brand">Hire Ready</span>
          <div className="user-menu">
            <span>{user?.username}</span>
            <button className="logout-button" type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>
        <div className="interview-content">
          <div className="left">
            <div className="section-heading">
              <div>
                <span className="section-icon" aria-hidden="true">
                  +
                </span>
                <h1 id="interview-title">Target Job Description</h1>
              </div>
              <span className="required-badge">Required</span>
            </div>
            <textarea
              value={jobDescription}
              maxLength={MAX_JOB_DESCRIPTION_LENGTH}
              onChange={(e) => {
                setJobDescription(e.target.value);
              }}
              name="jobDescription"
              id="jobDescription"
              placeholder={
                'Paste the full job description here...\n e.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."'
              }
            ></textarea>
            <span className="character-count">
              {jobDescription.length} / {MAX_JOB_DESCRIPTION_LENGTH} chars
            </span>
          </div>

          <div className="right">
            <div className="section-heading profile-heading">
              <div>
                <span className="section-icon" aria-hidden="true">
                  &#9823;
                </span>
                <h2>Your Profile</h2>
              </div>
            </div>

            <div className="input-group upload-group">
              <p className="field-label">
                Upload Resume <span className="highlight">(Best Results)</span>
              </p>
              <label className="file-label" htmlFor="resume">
                <span className="upload-icon" aria-hidden="true">
                  &#8593;
                </span>
                <strong>
                  {resumeFile ? "Resume uploaded" : "Click to upload"}
                </strong>
                <small>
                  {resumeFile
                    ? `Selected file: ${resumeFile.name}`
                    : `PDF only (Max ${MAX_RESUME_SIZE_MB}MB)`}
                </small>
              </label>
              <input
                onChange={handleResumeChange}
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,application/pdf"
              />
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="input-group self-description-group">
              <label className="field-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              ></textarea>
            </div>

            <div className="info-message">
              <span aria-hidden="true">&#9679;</span>
              <p>
                Either a Resume or a Self Description is required to generate a
                personalized plan.
              </p>
            </div>

            {error && (
              <div className="error-message" role="alert">
                <span aria-hidden="true">!</span>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>

        <footer className="interview-footer">
          <span>
            AI-Powered Strategy Generation <b aria-hidden="true">&bull;</b>{" "}
            Approx 30s
          </span>
          <button
            onClick={handleGenerateReport}
            className="button primary-button"
            type="button"
          >
            <span aria-hidden="true">&#10022;</span> Generate My Interview
            Strategy
          </button>
        </footer>
        <div className="interview-card">
          {reports.length > 0 && (
            <section className="recent-reports">
              <h2>My Recent Interview Plans</h2>
              <ul className="reports-list">
                {reports.map((report) => (
                  <li
                    key={report._id}
                    className="report-item"
                    onClick={() => navigate(`/interview/${report._id}`)}
                  >
                    <button
                      className="delete-report-button"
                      type="button"
                      disabled={deletingId === report._id}
                      onClick={(event) => handleDeleteReport(event, report)}
                      aria-label={`Delete ${report.title || "interview plan"}`}
                      title="Delete"
                    >
                      {deletingId === report._id ? "…" : "✕"}
                    </button>
                    <h3>{report.title || "Untitled Position"}</h3>
                    <p className="report-meta">
                      Generated on{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <p
                      className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                    >
                      Match Score: {report.matchScore}%
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
