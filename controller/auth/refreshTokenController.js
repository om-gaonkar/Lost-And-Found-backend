import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenHelper.js";
import User from "../../model/userModel.js";

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      console.log(req.cookies);
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    // Hash incoming refresh token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by hashed token
    const user = await User.findOne({
      "refreshToken.token": hashedToken,
    }).select("+refreshToken.token");

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check expiry stored in DB
    if (user.refreshToken.expiresAt < new Date()) {
      user.refreshToken = {
        token: null,
        createdAt: null,
        expiresAt: null,
      };

      await user.save({ validateBeforeSave: false });

      return res.status(403).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    if (!user._id.equals(decoded.id)) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Determine rememberMe from remaining lifetime
    const rememberMe =
      user.refreshToken.expiresAt - user.refreshToken.createdAt >
      30 * 60 * 1000;

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user, rememberMe);

    const newHashedToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    const createdAt = new Date();

    const expiresAt = new Date(
      Date.now() + (rememberMe ? 24 * 60 * 60 * 1000 : 30 * 60 * 1000),
    );

    // Rotate refresh token
    user.refreshToken = {
      token: newHashedToken,
      createdAt,
      expiresAt,
    };

    await user.save({ validateBeforeSave: false });

    // Send new cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: rememberMe ? 24 * 60 * 60 * 1000 : 30 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};
