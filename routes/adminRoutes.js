import express from "express";
import { Router } from "express";
import { dashboardConstroller } from "../controller/admin/dashboardController.js";
import {
  adminFoundController,
  adminLostController,
} from "../controller/admin/adminItemsController.js";
import {
  adminUpdateFoundItem,
  adminUpdateLostItem,
} from "../controller/admin/adminUpdateController.js";
import {
  deleteFounditems,
  deleteLostitems,
} from "../controller/admin/adminDeleteController.js";

const router = express.Router();

router.get("/admin-dashboard", dashboardConstroller);
router.get("/admin-foundItems", adminFoundController);
router.get("/admin-lostItems", adminLostController);
router.patch("/admin-foundItem-Update/:id", adminUpdateFoundItem);
router.patch("/admin-lostItem-Update/:id", adminUpdateLostItem);
router.delete("/admin-foundItem-delete/:id", deleteFounditems);
router.delete("/admin-lostItem-delete/:id", deleteLostitems);

export default router;
