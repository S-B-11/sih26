import rateLimit from "express-rate-limit";

/**
 * Rate limiter — 100 requests per 15 minutes per IP.
 * Protects the ORCA API from abuse.
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again after 15 minutes."
  }
});
