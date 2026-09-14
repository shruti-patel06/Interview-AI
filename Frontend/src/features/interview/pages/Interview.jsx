import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview.js";

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const { interviewId } = useParams();
  const { loading, report, getReportById, getResumePdf } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [getReportById, interviewId]);

  if (loading || !report) {
    return <main className="interview-page">Loading Interview report...</main>;
  }
  return (
    <main className="interview-page">
      <section className="report-shell" aria-labelledby="report-title">
        <header className="report-header">
          <div>
            <span className="eyebrow">Interview preparation report</span>
            <h1 id="report-title">Full-Stack Developer Interview</h1>
            <p>Personalized preparation plan for Shruti Patel</p>
            <button
              className="back-button"
              type="button"
              onClick={() => navigate("/")}
            >
              Back to interview
            </button>
          </div>
          <div className="match-score">
            <strong>{report.matchScore}</strong>
            <span>% match</span>
          </div>
        </header>

        <div className="report-layout">
          <nav className="report-nav" aria-label="Report sections">
            <span className="nav-label">Explore report</span>
            <button
              className={activeSection === "technical" ? "active" : ""}
              type="button"
              onClick={() => setActiveSection("technical")}
            >
              Technical questions
            </button>
            <button
              className={activeSection === "behavioral" ? "active" : ""}
              type="button"
              onClick={() => setActiveSection("behavioral")}
            >
              Behavioral questions
            </button>
            <button
              className={activeSection === "roadmap" ? "active" : ""}
              type="button"
              onClick={() => setActiveSection("roadmap")}
            >
              Road map
            </button>
            <button
              onClick={() => getResumePdf(interviewId)}
              className="button primary-button download-resume-button"
              type="button"
            >
              <svg
                width="1rem"
                height="1rem"
                style={{ marginRight: "0.8rem", flexShrink: 0 }}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 16.9703 20.3125 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
              </svg>
              Download Resume
            </button>
          </nav>

          <div className="report-main">
            {activeSection === "technical" && (
              <section className="report-section" id="technical">
                <div className="section-title">
                  <span>01</span>
                  <div>
                    <h2>Technical questions</h2>
                    <p>Topics your interview is likely to explore</p>
                  </div>
                </div>
                <div className="question-list">
                  {report.technicalQuestions.map((item, index) => (
                    <details
                      className="question-card"
                      key={item.question}
                      open={index === 0}
                    >
                      <summary>
                        <span className="question-number">Q{index + 1}</span>
                        <h3>{item.question}</h3>
                        <span className="chevron" aria-hidden="true">
                          ⌄
                        </span>
                      </summary>
                      <div className="question-details">
                        <p className="intention">
                          <b>Why they ask:</b> {item.intention}
                        </p>
                        <div className="answer">
                          <b>Suggested answer</b>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "behavioral" && (
              <section className="report-section" id="behavioral">
                <div className="section-title">
                  <span>02</span>
                  <div>
                    <h2>Behavioral questions</h2>
                    <p>Prepare stories that show how you work</p>
                  </div>
                </div>
                <div className="question-list">
                  {report.behavioralQuestions.map((item, index) => (
                    <details className="question-card" key={item.question}>
                      <summary>
                        <span className="question-number">Q{index + 1}</span>
                        <h3>{item.question}</h3>
                        <span className="chevron" aria-hidden="true">
                          ⌄
                        </span>
                      </summary>
                      <div className="question-details">
                        <p className="intention">
                          <b>Why they ask:</b> {item.intention}
                        </p>
                        <div className="answer">
                          <b>Suggested answer</b>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "roadmap" && (
              <section className="report-section" id="roadmap">
                <div className="section-title">
                  <span>03</span>
                  <div>
                    <h2>Preparation road map</h2>
                    <p>A focused three-day revision plan</p>
                  </div>
                </div>
                <div className="roadmap-list">
                  {report.preparationPlan.map((item) => (
                    <article className="roadmap-card" key={item.day}>
                      <span className="roadmap-dot" aria-hidden="true"></span>
                      <span>DAY {item.day}</span>
                      <h3>{item.focus}</h3>
                      <ul>
                        {item.tasks.map((task) => (
                          <li key={task}>{task}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="skill-panel">
            <div className="aside-heading">
              <span className="eyebrow">Focus next</span>
              <h2>Skill gaps</h2>
            </div>
            <div className="skill-list">
              {report.skillGaps.map((item) => (
                <div className="skill-pill" key={item.skill}>
                  <span>{item.skill}</span>
                  <small>{item.severity}</small>
                </div>
              ))}
            </div>
            <div className="score-note">
              <span>+</span>
              <p>
                Use these gaps to prioritize your preparation before the
                interview.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Interview;
