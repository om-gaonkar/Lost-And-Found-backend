import Item from "../../model/itemModel.js";

export const getUserItems = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const items = await Item.find({
      isDeleted: false,

      $or: [
        {
          user: userId,
        },
        {
          claimedBy: userId,
        },
      ],
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("Get user items error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user items",
    });
  }
};
