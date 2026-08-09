import Item from "../../model/itemModel.js";

export const reportFound = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      incidentDate,
      location,
      // images,
      claimProcess,
      contactNumber,
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
      type: "found",
      title,
      category,
      claimProcess,
      description,
      incidentDate,
      location,
      // images: images || [],
      contactNumber,
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
