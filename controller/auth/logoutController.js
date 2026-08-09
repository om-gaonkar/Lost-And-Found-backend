import crypto from "node:crypto";
import User from "../../model/userModel.js";

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.sendStatus(204);
  }

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  await User.updateOne(
    {
      refreshToken: hashed,
    },
    {
      $unset: {
        refreshToken: "",
      },
    },
  );

  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.sendStatus(204);
};
