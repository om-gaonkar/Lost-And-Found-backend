import Item from "../../model/itemModel.js";

export const adminFoundController = async (req, res) => {
  try {
    const [totalFound, totalActive, totalClaimed, foundItems] =
      await Promise.all([
        Item.countDocuments({
          type: "found",
          isDeleted: "false",
        }),
        Item.countDocuments({
          type: "found",
          status: "approved",
          isDeleted: "false",
        }),
        Item.countDocuments({
          type: "found",
          isDeleted: "false",
          status: "claimed",
        }),
        Item.find({ isDeleted: "false", type: "found" })
          .populate("user", "role firstName ")
          .select(
            "title category location incidentDate status claimedBy description",
          ),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalFound,
        totalActive,
        totalClaimed,
      },
      foundItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
