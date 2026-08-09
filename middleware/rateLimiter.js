import rateLimit from "express-rate-limit";
// Rate limit by email + IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const email = (req.body.email || "").toLowerCase();
    return `${req.ip}:${email}`;
  },
  skipSuccessfulRequests: true,
});

// export const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   skipSuccessfulRequests: true,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: "Too many failed login attempts.",
//   },
// });
