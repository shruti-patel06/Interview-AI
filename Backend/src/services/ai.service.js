const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");
const MODEL = "gemini-3.1-flash-lite";

let genAI;

// Created on first use so a missing key fails only the AI requests, not the whole server start-up.
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GENAI_API_KEY is missing. Add it to Backend/.env");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

const interviewReportZod = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    ),

  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

// Gemini gets the same schema (including every .describe() hint and the 0-100 bounds) that the response is validated against.
function toGeminiJsonSchema(zodSchema) {
  const jsonSchema = z.toJSONSchema(zodSchema);
  delete jsonSchema.$schema;
  return jsonSchema;
}

const interviewReportJsonSchema = toGeminiJsonSchema(interviewReportZod);

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    const prompt = `
You are an experienced technical interviewer and career coach.
Using the candidate's resume, self description and the target job description below, generate a detailed interview preparation report.

Guidelines:
- matchScore: a whole number from 0 to 100 reflecting how well the candidate fits this specific job.
- technicalQuestions: 6 to 10 questions tailored to the job's required skills and the candidate's experience.
- behavioralQuestions: 4 to 6 questions relevant to the role.
- answer: concrete guidance on how this candidate should answer, referring to their own projects and experience where possible.
- skillGaps: skills the job requires that the candidate lacks or shows only weakly; use an empty list if there are none.
- preparationPlan: a day-by-day plan (usually 5 to 7 days) with day numbers starting at 1, prioritising the most severe skill gaps.
- title: the job title from the job description.
If the resume or the self description is "Not provided", base the analysis only on the information that is available.

Resume:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}
`;

    const result = await getGenAI().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: interviewReportJsonSchema,
      },
    });

    const text = result.text;

    const parsedData = JSON.parse(text);

    return interviewReportZod.parse(parsedData);
  } catch (error) {
    console.error("Failed to generate interview report:", error);
    throw error;
  }
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    // Hosted containers (e.g. Render) don't support Chrome's sandbox
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // The HTML is AI-generated from user input, so it must not run scripts
    // or make the server fetch any URL (e.g. internal services).
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().startsWith("data:")) {
        request.continue();
      } else {
        request.abort();
      }
    });

    await page.setContent(htmlContent, { waitUntil: "load" });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });
  } finally {
    // Always close Chrome, otherwise a failed render leaks a browser process
    await browser.close();
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume || "Not provided"}
                        Self Description: ${selfDescription || "Not provided"}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

  const response = await getGenAI().models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: toGeminiJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = resumePdfSchema.parse(JSON.parse(response.text));

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
