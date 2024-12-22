const User = require('../models/user');
const Earnings = require('../models/Earnings');

/**
 * Get Real-Time Earnings for a User
 * @route GET /earnings/:userId
 */
const getEarningsReport = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate userId (ensure it's a valid ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch earnings for the user grouped by level
    const earnings = await Earnings.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: "$level",
          totalEarnings: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format the response
    const totalEarnings = earnings.reduce((sum, entry) => sum + entry.totalEarnings, 0);
    const breakdown = earnings.map((entry) => ({
      level: entry._id,
      earnings: entry.totalEarnings,
    }));

    res.status(200).json({
      totalEarnings,
      breakdown,
    });
  } catch (error) {
    console.error("Error fetching earnings report:", error);
    next(error);
  }
};

module.exports = { getEarningsReport };
