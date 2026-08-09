import Item from "../../model/itemModel.js";

export const reportLost = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      incidentDate,
      location,
      // images,
      contactNumber,
      reward,
      additionalDetails,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !category ||
      !description ||
      !incidentDate ||
      !location ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const item = await Item.create({
      user: req.user.id, // Comes from auth middleware
      type: "lost",
      title,
      category,
      description,
      incidentDate,
      location,
      // images: images || [],
      contactNumber,
      reward: reward || 0,
      additionalDetails,
    });

    return res.status(201).json({
      success: true,
      message: "Lost item reported successfully.",
      item,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to report lost item.",
      error: error.message,
    });
  }
};
