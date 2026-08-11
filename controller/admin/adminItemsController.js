import Item from "../../model/itemModel.js";

export const adminFoundController = async (req, res) => {
  try {
    const { search, category, location, incidentDate } = req.query;

    // Base filter
    const filter = {
      type: "found",
      isDeleted: false,
    };

    // Search by title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by location
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by incident date
    if (incidentDate) {
      const startDate = new Date(incidentDate);

      const endDate = new Date(incidentDate);
      endDate.setDate(endDate.getDate() + 1);

      filter.incidentDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const [totalFound, totalActive, totalClaimed, foundItems] =
      await Promise.all([
        Item.countDocuments(filter),

        Item.countDocuments({
          ...filter,
          status: "approved",
        }),

        Item.countDocuments({
          ...filter,
          status: "claimed",
        }),

        Item.find(filter)
          .populate("user", "role firstName")
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

export const adminLostController = async (req, res) => {
  try {
    const { search, category, location, incidentDate } = req.query;

    // Base filter
    const filter = {
      type: "lost",
      isDeleted: false,
    };

    // Search by title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by location
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by incident date
    if (incidentDate) {
      const startDate = new Date(incidentDate);

      const endDate = new Date(incidentDate);
      endDate.setDate(endDate.getDate() + 1);

      filter.incidentDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const [totalLost, totalActive, totalClaimed, lostItems] = await Promise.all(
      [
        Item.countDocuments(filter),

        Item.countDocuments({
          ...filter,
          status: "approved",
        }),

        Item.countDocuments({
          ...filter,
          status: "claimed",
        }),

        Item.find(filter)
          .populate("user", "role firstName")
          .select(
            "title category location incidentDate status claimedBy description",
          ),
      ],
    );

    res.status(200).json({
      success: true,
      stats: {
        totalLost,
        totalActive,
        totalClaimed,
      },
      lostItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
