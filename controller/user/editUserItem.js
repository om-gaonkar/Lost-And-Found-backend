import mongoose from "mongoose";
import Item from "../../model/itemModel.js";

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID",
      });
    }

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const item = await Item.findOne({
      _id: itemId,
      user: userId,
      isDeleted: false,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found or you are not authorized to edit this item",
      });
    }

    const allowedFields = [
      "title",
      "category",
      "description",
      "incidentDate",
      "location",
      "contactNumber",
      "reward",
      "additionalDetails",
      "claimProcess",
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        item[field] = req.body[field];
      }
    }

    if (item.type === "lost") {
      item.claimProcess = null;
    }

    if (item.type === "found") {
      item.reward = 0;
    }

    const updatedItem = await item.save();

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Update item error:", error);

    if (error.name === "ValidationError") {
      const errors = {};

      Object.keys(error.errors).forEach((field) => {
        errors[field] = error.errors[field].message;
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    /* =========================================================
       INVALID CAST
    ========================================================= */

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid value for ${error.path}`,
      });
    }

    /* =========================================================
       SERVER ERROR
    ========================================================= */

    return res.status(500).json({
      success: false,
      message: "Failed to update item",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    /* =========================================================
       VALIDATE ITEM ID
    ========================================================= */

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID",
      });
    }

    /* =========================================================
       GET LOGGED-IN USER

       authMiddlware attaches the user to req.user
    ========================================================= */

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* =========================================================
       FIND ITEM

       We check:
       1. Item ID
       2. Item owner
       3. Item is not already deleted
    ========================================================= */

    const item = await Item.findOne({
      _id: itemId,
      user: userId,
      isDeleted: false,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found or you are not authorized to delete it",
      });
    }

    /* =========================================================
       SOFT DELETE

       We don't permanently remove the document.
    ========================================================= */

    item.isDeleted = true;

    await item.save();

    /* =========================================================
       RESPONSE
    ========================================================= */

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error);

    /* =========================================================
       INVALID CAST
    ========================================================= */

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID",
      });
    }

    /* =========================================================
       SERVER ERROR
    ========================================================= */

    return res.status(500).json({
      success: false,
      message: "Failed to delete item",
    });
  }
};
