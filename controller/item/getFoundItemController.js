import Item from "../../model/itemModel.js";

export const getFoundItems = async (req, res) => {
  const { search, category, reward, sort } = req.query;

  const query = {
    isDeleted: false,
    type: "found",
  };

  if (category) {
    query.category = category;
  }

  if (reward === "yes") {
    query.reward = { $gt: 0 };
  } else if (reward === "no") {
    query.reward = 0;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  let items = Item.find(query)
    .populate("user", "firstName email phone")
    .populate("claimedBy", "name email")
    .populate("approvedBy", "name email");

  if (sort === "newest") {
    items = items.sort({ createdAt: -1 });
  } else if (sort === "oldest") {
    items = items.sort({ createdAt: 1 });
  }

  const result = await items;

  res.json({
    success: true,
    count: result.length,
    items: result,
  });
};
