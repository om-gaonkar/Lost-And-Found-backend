import express from "express";
import { getUserItems } from "../controller/user/getUserData.js";
import { authMiddlware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-user-items", authMiddlware, getUserItems);

export default router;
