import Item from "../../model/itemModel.js";

export const adminUpdateFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("fromBackend>>", req.params.id);
    console.log("frombackendBody", req.body);
    const updatedItem = await Item.findOneAndUpdate(
      {
        _id: id,
        type: "found",
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const adminUpdateLostItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("fromBackend>>", req.params.id);
    console.log("frombackendBody", req.body);
    const updatedItem = await Item.findOneAndUpdate(
      {
        _id: id,
        type: "lost",
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
