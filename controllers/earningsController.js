const Earnings = require("../models/Earnings");
const User = require("../models/user");

/**
 * Get Earnings for a Specific User
 */
const getEarningsByUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const earnings = await Earnings.find({ user: userId }).sort({ date: -1 });

    if (!earnings || earnings.length === 0) {
      return res.status(404).json({ message: "No earnings found for this user" });
    }

    res.status(200).json({ earnings });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Total Earnings for a Specific User
 */
const getTotalEarnings = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ totalEarnings: user.earnings });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Earnings Summary (Level-wise)
 */
const getEarningsSummary = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const earnings = await Earnings.find({ user: userId });

    const summary = earnings.reduce(
      (acc, earning) => {
        if (earning.source === "Level 1") {
          acc.level1 += earning.amount;
        } else if (earning.source === "Level 2") {
          acc.level2 += earning.amount;
        }
        return acc;
      },
      { level1: 0, level2: 0 }
    );

    res.status(200).json({ summary });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Earnings (Admin-only or for Testing)
 */
const deleteEarnings = async (req, res, next) => {
  const { earningsId } = req.params;

  try {
    const deletedEarning = await Earnings.findByIdAndDelete(earningsId);

    if (!deletedEarning) {
      return res.status(404).json({ message: "Earning record not found" });
    }

    res.status(200).json({ message: "Earning record deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEarningsByUser,
  getTotalEarnings,
  getEarningsSummary,
  deleteEarnings,
};
