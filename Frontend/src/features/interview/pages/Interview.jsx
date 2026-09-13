import { useState } from "react";
import "../style/interview.scss";

const report = {
  matchScore: 92,
  technicalQuestions: [
    {
      question:
        "How do you ensure idempotency in your transaction processing logic when using Node.js and MongoDB?",
      intention:
        "To test the candidate's understanding of building reliable financial systems and handling distributed state.",
      answer:
        "I use unique request identifiers for each transaction stored in the database. Before processing, the system checks if the identifier exists; if it does, it returns the previous result instead of creating a duplicate.",
    },
    {
      question:
        "Explain the role of IAM roles vs users in AWS and how you managed permissions for your CI/CD pipeline.",
      intention:
        "To evaluate practical knowledge of AWS security and cloud infrastructure management.",
      answer:
        "IAM users are for long-term credentials, while roles are temporary and best for services like EC2. In my pipeline, I assigned an IAM role to the EC2 instance to allow CodePipeline and SSM to access resources securely without hardcoding credentials.",
    },
    {
      question:
        "How do you handle performance optimization when querying large datasets in MongoDB?",
      intention:
        "To assess database proficiency and awareness of indexing and aggregation efficiency.",
      answer:
        "I focus on creating appropriate indexes based on query patterns, using projection to retrieve only necessary fields, and leveraging MongoDB aggregation pipelines for efficient data processing on the server side.",
    },
  ],
  behavioralQuestions: [
    {
      question:
        "Can you describe a time you faced a technical roadblock in a project and how you resolved it?",
      intention:
        "To understand the candidate's problem-solving process and perseverance.",
      answer:
        "During my CI/CD project, I encountered consistent IAM permission failures. I methodically debugged by checking SSM logs, testing individual permission sets, and cross-referencing AWS documentation until I identified the missing tag-based access policies.",
    },
    {
      question:
        "How do you manage your workflow when collaborating on open-source projects via GitHub?",
      intention: "To assess team collaboration and version control skills.",
      answer:
        "I follow standard Git flow: creating descriptive branches, committing modular changes, requesting code reviews, and addressing feedback from project maintainers before merging.",
    },
  ],
  skillGaps: [
    {
      skill: "Advanced Database Schema Design (ACID compliance at scale)",
      severity: "medium",
    },
    {
      skill: "Automated Testing Frameworks (Jest/Cypress)",
      severity: "medium",
    },
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "Advanced Backend & Database Optimization",
      tasks: [
        "Review MongoDB indexing strategies",
        "Deep dive into JWT security best practices",
        "Practice implementing transaction atomicity",
      ],
    },
    {
      day: 2,
      focus: "AWS & Cloud Security",
      tasks: [
        "Study AWS IAM policy structure in depth",
        "Refresh knowledge on CI/CD lifecycle management",
        "Document your specific CI/CD architecture flow",
      ],
    },
    {
      day: 3,
      focus: "Full-Stack System Design",
      tasks: [
        "Review RESTful API design principles",
        "Prepare a walkthrough of the Interview AI architecture",
        "Practice mock behavioral interview questions",
      ],
    },
  ],
};

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");

  return (
    <main className="interview-page">
      <section className="report-shell" aria-labelledby="report-title">
        <header className="report-header">
          <div>
            <span className="eyebrow">Interview preparation report</span>
            <h1 id="report-title">Full-Stack Developer Interview</h1>
            <p>Personalized preparation plan for Shruti Patel</p>
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
