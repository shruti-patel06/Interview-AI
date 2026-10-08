const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// Render sits behind a proxy; trust it so req.ip (used by the rate limiter) is the real client IP
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Browsers send the Origin without a trailing slash, so strip one from the env value
const allowedOrigin = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // cookies se data handle hota hai so it has has to be true
  }),
);

/*
 * CSRF protection: in production the auth cookie is SameSite=None, so the browser would
 * attach it to a form posted from any website. Reject state-changing requests that come
 * from a different origin than our frontend.
 */
app.use((req, res, next) => {
  const origin = req.get("origin");
  const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (isSafeMethod || !origin || origin === allowedOrigin) {
    return next();
  }
  return res.status(403).json({ message: "Request origin not allowed" });
});

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

/* JSON responses for unknown routes and errors, must come after all the routes */
app.use(notFound);
app.use(errorHandler);

module.exports = app;
