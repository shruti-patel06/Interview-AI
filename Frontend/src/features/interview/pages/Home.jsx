import { useRef, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
const Home = () => {
  const { loading, reports, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeName, setResumeName] = useState("");
  const resumeInputRef = useRef(null);
  const navigate = useNavigate();
  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    navigate(`/interview/${data._id}`);
  };
  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your Interrview Plan...</h1>
      </main>
    );
  }
  return (
    <main className="home">
      <section className="interview-panel" aria-labelledby="interview-title">
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
              {jobDescription.length} / 5000 chars
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
                  {resumeName
                    ? "Resume uploaded"
                    : "Click to upload or drag & drop"}
                </strong>
                <small>
                  {resumeName
                    ? `Selected file: ${resumeName}`
                    : "PDF or DOCX (Max 5MB)"}
                </small>
              </label>
              <input
                ref={resumeInputRef}
                onChange={(event) =>
                  setResumeName(event.target.files[0]?.name ?? "")
                }
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,.docx"
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
