import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    },
  );

export const generateRefreshToken = (user, rememberMe) =>
  jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: rememberMe
        ? process.env.REFRESH_TOKEN_REMEMBER_EXPIRY || "2d"
        : process.env.REFRESH_TOKEN_EXPIRY || "45m",
    },
  );
