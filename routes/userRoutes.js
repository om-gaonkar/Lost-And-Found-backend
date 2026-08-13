import express from "express";
import { getUserItems } from "../controller/user/getUserData.js";
import { authMiddlware } from "../middleware/authMiddleware.js";
import { deleteItem, updateItem } from "../controller/user/editUserItem.js";

const router = express.Router();

router.get("/get-user-items", authMiddlware, getUserItems);
router.patch("/:itemId", authMiddlware, updateItem);
router.delete("/:itemId", authMiddlware, deleteItem);

export default router;
