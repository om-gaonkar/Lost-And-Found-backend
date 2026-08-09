//data to get : total lost , total found , totoal pending , approved claims ,active users

import Item from "../../model/itemModel.js";
import User from "../../model/userModel.js";

export const dashboardConstroller = async (req, res) => {
  try {
    const [
      totalLost,
      totalFound,
      totalPending,
      approvedClaims,
      totalUsers,
      recentActivity,
    ] = await Promise.all([
      Item.countDocuments({
        type: "lost",
        isDeleted: false,
      }),

      Item.countDocuments({
        type: "found",
        isDeleted: false,
      }),

      Item.countDocuments({
        status: "pending",
        isDeleted: false,
      }),

      Item.countDocuments({
        claimStatus: "approved",
        isDeleted: false,
      }),

      User.countDocuments(),
      Item.find({ isDeleted: false })
        .populate("user", "firstName lastName")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title type status createdAt location category user"),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalLost,
        totalFound,
        totalPending,
        approvedClaims,
        totalUsers,
      },
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
