import User from "../../model/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const now = new Date();

    const { role, registrationFrom, registrationTo, search } = req.query;

    // -----------------------------
    // Build user filter
    // -----------------------------
    const userFilter = {};

    // Filter by role
    if (role && ["user", "admin"].includes(role)) {
      userFilter.role = role;
    }

    // Filter by registration date
    if (registrationFrom || registrationTo) {
      userFilter.createdAt = {};

      if (registrationFrom) {
        const fromDate = new Date(registrationFrom);

        if (!isNaN(fromDate.getTime())) {
          userFilter.createdAt.$gte = fromDate;
        }
      }

      if (registrationTo) {
        const toDate = new Date(registrationTo);

        if (!isNaN(toDate.getTime())) {
          // Include the entire "to" date
          toDate.setHours(23, 59, 59, 999);

          userFilter.createdAt.$lte = toDate;
        }
      }

      // Remove empty createdAt object
      if (Object.keys(userFilter.createdAt).length === 0) {
        delete userFilter.createdAt;
      }
    }

    // Search by firstName, lastName, or email
    if (search?.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      userFilter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    // -----------------------------
    // Dashboard counts
    // -----------------------------
    const [totalAccounts, totalUser, activeUser, totalAdmins, userDetail] =
      await Promise.all([
        User.countDocuments({}),

        User.countDocuments({
          ...userFilter,
          role: "user",
        }),

        User.countDocuments({
          ...userFilter,
          "refreshToken.token": { $exists: true, $ne: null },
          "refreshToken.expiresAt": { $gt: now },
        }),

        User.countDocuments({
          ...userFilter,
          role: "admin",
        }),

        User.find(userFilter)
          .select(
            "firstName lastName email role refreshToken lockUntil createdAt",
          )
          .lean(),
      ]);

    const users = userDetail.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      lockUntil: user.lockUntil,

      // Registration date
      registrationDate: user.createdAt,

      // Only send boolean to frontend
      isActive: Boolean(
        user.refreshToken?.token &&
        user.refreshToken?.expiresAt &&
        user.refreshToken.expiresAt > now,
      ),
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalAccounts,
        totalUser,
        activeUser,
        totalAdmins,
      },
      users,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive, lockUntil } = req.body;

    console.log("Updating user:", id);
    console.log("Update body:", req.body);

    // -----------------------------
    // Find user
    // -----------------------------
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------
    // Update role
    // -----------------------------
    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      user.role = role;
    }

    // -----------------------------
    // Update active status
    // -----------------------------
    if (isActive !== undefined) {
      if (isActive === false) {
        // Invalidate/delete refresh token
        user.refreshToken = undefined;
      }

      // If isActive === true:
      // Don't create a refresh token here.
      // The user can become active again when they log in.
    }

    // -----------------------------
    // Update lock status
    // -----------------------------
    if (lockUntil !== undefined) {
      if (lockUntil === null || lockUntil === "") {
        // Unlock user
        user.lockUntil = null;
      } else {
        const lockDate = new Date(lockUntil);

        if (isNaN(lockDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid lockUntil date",
          });
        }

        user.lockUntil = lockDate;
      }
    }

    // -----------------------------
    // Save changes
    // -----------------------------
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        lockUntil: user.lockUntil,
        isActive: Boolean(
          user.refreshToken?.token &&
          user.refreshToken?.expiresAt &&
          user.refreshToken.expiresAt > new Date(),
        ),
      },
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete({ _id: id });
    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: "delete item not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Deleted successfully",
      user: deleteUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
