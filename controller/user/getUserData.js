import Item from "../../model/itemModel.js";

export const getUserItems = async (req, res) => {
  try {
    const userId = req.user.id; // set by your auth middleware

    const items = await Item.find({
      user: userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
