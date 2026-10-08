const { rateLimit } = require("express-rate-limit");

/*
 * Counters are kept in memory: they reset when the server restarts and are not
 * shared between instances, which is fine for a single Render service.
 */

/**
 * @description Slows down password guessing and mass sign-ups. Counted per IP address.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many login or register attempts. Please try again in 15 minutes.",
  },
});

/**
 * @description Each request calls Gemini (and the PDF route also launches Chrome), so
 * limit how often one user can trigger them. Counted per logged-in user,
 * so it must run after authUser.
 */
function aiLimiter({ limit, action }) {
  return rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req) => req.user.id,
    message: {
      message: `You can ${action} up to ${limit} times per hour. Please try again later.`,
    },
  });
}

const generateReportLimiter = aiLimiter({ limit: 10, action: "generate an interview plan" });
const resumePdfLimiter = aiLimiter({ limit: 10, action: "generate a resume PDF" });

module.exports = { authLimiter, generateReportLimiter, resumePdfLimiter };
