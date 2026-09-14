require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");
const {
  resume,
  selfDescription,
  jobDescription,
} = require("./src/services/temp");
const { generateInterviewReport } = require("./src/services/ai.service");

async function startServices() {
  if (process.env.MONGO_URI) {
    try {
      await connectDB();
    } catch (err) {
      console.error("Database connection failed:", err.message);
    }
  } else {
    console.warn("MONGO_URI is missing. Database connection skipped.");
  }

  if (process.env.GOOGLE_GENAI_API_KEY) {
    try {
      const report = await generateInterviewReport({
        resume,
        selfDescription,
        jobDescription,
      });
      console.log("Generated interview report:", report);
    } catch (err) {
      console.error("Failed to generate interview report:", err.message);
    }
  } else {
    console.warn("GOOGLE_GENAI_API_KEY is missing. AI generation skipped.");
  }
}

startServices();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
