const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // cookies se data handle hota hai so it has has to be true
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Interview AI API is running",
    health: "/health",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/*using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
module.exports = app;
