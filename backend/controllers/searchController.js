import User from "../models/User.js";
export const searchUsers = async (req, res) => {

  try {
    const { q } = req.query;
    const currentUserId = req.user._id;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const search = q.trim();


    if (search.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search must contain at least 2 characters",
      });
    }

    // Escape regex characters
    const escapedSearch = search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const users = await User.find({
      _id: { $ne: currentUserId },

      $or: [
        {
          username: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          firstName: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ],
    })
      .select("username firstName lastName profilePicture")
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.error("Search users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search users",
    });
  }
};