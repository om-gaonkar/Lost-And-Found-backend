import Item from "../../model/itemModel.js";

export const deleteFounditems = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItem = await Item.findByIdAndDelete({ _id: id, type: "found" });
    if (!deleteItem) {
      return res.status(404).json({
        success: false,
        message: "delete item not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Item Deleted successfully",
      item: deleteItem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
