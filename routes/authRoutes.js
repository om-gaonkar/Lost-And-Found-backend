import express from "express";
import { registerUser } from "../controller/auth/authController.js";
import { loginUser } from "../controller/auth/loginController.js";
import { refreshToken } from "../controller/auth/refreshTokenController.js";
import { logout } from "../controller/auth/logoutController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
