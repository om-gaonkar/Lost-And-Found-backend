import express from "express";
import { reportLost } from "../controller/item/reportLostController.js";
import { authMiddlware } from "../middleware/authMiddleware.js";
import { reportFound } from "../controller/item/reportFoundContorller.js";
import { getLostItems } from "../controller/item/getLostItemsController.js";
import { getFoundItems } from "../controller/item/getFoundItemController.js";
import { getItemDetail } from "../controller/item/itemDetailController.js";
const router = express.Router();

router.post("/report-lost", authMiddlware, reportLost);
router.post("/report-found", authMiddlware, reportFound);
router.get("/get-lost-items", getLostItems);
router.get("/get-items/:id", getItemDetail);
router.get("/get-found-items", getFoundItems);

export default router;
