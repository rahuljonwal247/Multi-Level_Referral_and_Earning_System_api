const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { addPurchase } = require("../controllers/referralController");

const router = express.Router();

router.post("/purchase",protect, addPurchase);

module.exports = router;
