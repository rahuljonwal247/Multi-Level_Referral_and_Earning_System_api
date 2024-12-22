const express = require("express");
const {
  getEarningsByUser,
  getTotalEarnings,
  getEarningsSummary,
  deleteEarnings,
} = require("../controllers/earningsController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Get earnings by user
router.get("/:userId",protect, getEarningsByUser);

// Get total earnings by user
router.get("/:userId/total",protect, getTotalEarnings);

// Get earnings summary
router.get("/:userId/summary",protect, getEarningsSummary);

// Delete earning (Admin only)
router.delete("/:earningsId", deleteEarnings);

module.exports = router;
