/**
 * Global error handler middleware.
 * Catches all errors thrown in route handlers and sends a structured response.
 */
export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${statusCode} — ${message}`, err.stack || "");

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}

/**
 * Creates an error with a custom HTTP status code.
 * Usage: throw createError(404, "Resource not found")
 */
export function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}
