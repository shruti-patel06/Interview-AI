const multer = require("multer");
const { MAX_RESUME_SIZE_MB } = require("./file.middleware");

/**
 * @description Responds with JSON for routes that don't exist.
 */
function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

/**
 * @description Turns every error that reaches Express into a JSON response,
 * so the frontend can always read `message`.
 */
// Express recognises an error handler by its four parameters, so `next` must stay even though it's unused.
function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? `Resume must be ${MAX_RESUME_SIZE_MB} MB or smaller`
        : err.message;
    return res.status(400).json({ message });
  }

  // e.g. a malformed MongoDB id in the URL
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }

  // errors from express.json() (invalid JSON body) and our own errors carry a status
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    message: status >= 500 ? "Something went wrong" : err.message,
  });
}

module.exports = { notFound, errorHandler };
