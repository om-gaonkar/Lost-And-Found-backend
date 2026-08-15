// when user clicks claim -- update claimed By , change claim status, if claimed change both - claimstatus and status
import mongoose from "mongoose";
import Item from "../../model/itemModel.js";

export const claimItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
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
      _id: id,
      isDeleted: false,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.user.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot claim your own item",
      });
    }

    if (item.type !== "found") {
      return res.status(400).json({
        success: false,
        message: "Only found items can be claimed",
      });
    }

    if (item.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "This item is not available for claiming yet",
      });
    }

    if (
      // item.claimStatus === "pending" ||
      item.claimStatus === "inProcess" ||
      item.claimStatus === "claimed"
    ) {
      return res.status(400).json({
        success: false,
        message: "This item already has an active claim",
      });
    }

    item.claimedBy = userId;
    item.claimStatus = "inProcess";

    await item.save();
    return res.status(200).json({
      success: true,
      message: "Claim request submitted successfully",
      item,
    });
  } catch (error) {
    console.error("Claim item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit claim request",
    });
  }
};
