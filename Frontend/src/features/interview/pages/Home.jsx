import "../style/home.scss";

const Home = () => {
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
              name="jobDescription"
              id="jobDescription"
              placeholder={
                'Paste the full job description here...\n e.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."'
              }
            ></textarea>
            <span className="character-count">0 / 5000 chars</span>
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
                <strong>Click to upload or drag &amp; drop</strong>
                <small>PDF or DOCX (Max 5MB)</small>
              </label>
              <input
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
          <button className="button primary-button" type="button">
            <span aria-hidden="true">&#10022;</span> Generate My Interview
            Strategy
          </button>
        </footer>
      </section>
    </main>
  );
};

export default Home;
