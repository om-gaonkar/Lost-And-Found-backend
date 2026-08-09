import Item from "../../model/itemModel.js";

export const getItemDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id)
      .populate("user", "firstName lastName email phone")
      .populate("claimedBy", "name email")
      .populate("approvedBy", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Get Item Detail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
