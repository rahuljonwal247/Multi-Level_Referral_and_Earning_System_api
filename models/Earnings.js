const mongoose = require("mongoose");

const earningsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sourceId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  level: { type: Number, required: true }, // 1 for direct, 2 for indirect
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Earnings", earningsSchema);
