import express from "express";
import { Router } from "express";
import { dashboardConstroller } from "../controller/admin/dashboardController.js";
import { adminFoundController } from "../controller/admin/adminFoundController.js";
import { adminUpdateFoundItem } from "../controller/admin/adminUpdateController.js";
import { deleteFounditems } from "../controller/admin/adminDeleteController.js";

const router = express.Router();

router.get("/admin-dashboard", dashboardConstroller);
router.get("/admin-foundItems", adminFoundController);
router.patch("/admin-foundItem-Update/:id", adminUpdateFoundItem);
router.delete("/admin-foundItem-delete/:id", deleteFounditems);

export default router;
