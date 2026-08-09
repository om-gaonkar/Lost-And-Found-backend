import bcrypt from "bcrypt";
import crypto from "node:crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenHelper.js";
import User from "../../model/userModel.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    const user = await User.findOne({ email }).select(
      "+password +refreshToken.token",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check account lock
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message: "Account is temporarily locked. Please try again later.",
      });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.loginAttempts = 0;
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await user.save({ validateBeforeSave: false });

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Reset failed attempts
    user.loginAttempts = 0;
    user.lockUntil = null;

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rememberMe);

    // Hash refresh token before storing
    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Calculate expiry
    const expiresAt = new Date(
      Date.now() +
        (rememberMe
          ? 24 * 60 * 60 * 1000 // 1 day
          : 30 * 60 * 1000), // 30 minutes
    );

    // Store refresh token metadata
    user.refreshToken = {
      token: hashedToken,
      createdAt: new Date(),
      expiresAt,
    };

    await user.save({ validateBeforeSave: false });

    // Send refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",

      maxAge: rememberMe
        ? 24 * 60 * 60 * 1000 // 1 day
        : 30 * 60 * 1000, // 30 minutes
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
