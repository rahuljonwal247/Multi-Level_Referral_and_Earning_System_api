const express = require("express");
const { getEarningsReport } = require('../controllers/earningsController');
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();




// Route for real-time earnings
router.get('/:userId', protect,getEarningsReport);

module.exports = router;
