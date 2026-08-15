import Item from "../../model/itemModel.js";

// get by status, claim staus, claimed by, approved by, item details

export const adminClaimController = async (req, res) => {
  try {
    const [totalActive, totalClaimed, rejectedClaims, foundItems] =
      await Promise.all([
        // Active items
        Item.countDocuments({
          //   isDeleted: false,
          //   status: "approved",
          claimStatus: "inProcess",
        }),

        // Claimed items
        Item.countDocuments({
          //   isDeleted: false,
          claimStatus: "claimed",
        }),

        // Rejected claims
        Item.countDocuments({
          //   isDeleted: false,
          claimStatus: "rejected",
        }),

        // Only items currently being claimed or already claimed
        Item.find({
          //   isDeleted: false,
          claimStatus: { $in: ["inProcess", "claimed", "rejected"] },
        })
          .populate("user", "name email")
          .populate("claimedBy", "name email")
          .populate("approvedBy", "name email")
          .select(
            "title category location incidentDate status claimStatus claimedBy approvedBy type reward ",
          )
          .sort({ createdAt: -1 }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalActive,
        totalClaimed,
        rejectedClaims,
      },
      foundItems,
    });
  } catch (error) {
    console.error("Error fetching item stats:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch item statistics",
    });
  }
};

//update the status and claimstatus

export const adminEditController = async (req, res) => {
  try {
    const { id } = req.params;
    const { claimStatus } = req.body;

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

    // Update claim status if provided
    if (claimStatus !== undefined) {
      item.claimStatus = claimStatus;
    }

    // If claim is rejected, remove the claimant
    if (claimStatus === "rejected") {
      item.claimedBy = null;
      item.claimProcess = null;
      item.status = "approved";
      item.approvedBy = req.user.id;
    }

    // If claim is successfully completed
    if (claimStatus === "claimed") {
      item.status = "claimed";
      item.claimStatus = "claimed";
      item.claimProcess = null;
      item.approvedBy = req.user.id;
    }

    await item.save();

    const updatedItem = await Item.findById(item._id)
      .populate("user", "firstName lastName email role")
      .populate("claimedBy", "firstName lastName email role")
      .populate("approvedBy", "firstName lastName email role");

    return res.status(200).json({
      success: true,
      message: "Item claim updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Admin edit claim error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update item claim",
      error: error.message,
    });
  }
};
