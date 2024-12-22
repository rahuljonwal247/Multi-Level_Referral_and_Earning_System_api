const User = require("../models/user");
const Purchase = require("../models/Purchase");
const Earnings = require("../models/Earnings");
const { sendEarningsUpdate } = require("../utils/socket");
const { purchaseSchema } = require("../validation/purchaseValidation");
const addPurchase = async (req, res, next) => {
  const { userId, amount } = req.body;

  const { error } = purchaseSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }

  // Validate purchase amount
  if (amount < 1000) {
    return res.status(400).json({ message: "Purchase amount must exceed 1000 Rs" });
  }

  try {
    const user = await User.findById(userId).populate({
      path: "referrer",
      populate: { path: "referrer" }, 
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save the purchase
    const purchase = new Purchase({ userId: userId, amount });

    // Process direct earnings (Level 1)
    if (user.referrer) {
      const directEarning = (5 / 100) * amount;
      user.referrer.earnings += directEarning;
      await user.referrer.save();

      const earning = new Earnings({
        userId: user.referrer._id,
        amount: directEarning,
        sourceId: userId,
        level: 1,
      });
      await earning.save();

      sendEarningsUpdate(user.referrer._id, {
        amount: directEarning,
        level: 1,
      });

      // Process indirect earnings (Level 2)
      if (user.referrer.referrer) {
        const level2User = user.referrer.referrer;

        const indirectEarning = (1 / 100) * amount;
        level2User.earnings += indirectEarning;
        await level2User.save();

        const level2Earning = new Earnings({
          userId: level2User._id,
          amount: indirectEarning,
          sourceId: userId,
          level: 2,
        });
        await level2Earning.save();

        sendEarningsUpdate(level2User._id, {
          amount: indirectEarning,
          level: 2,
        });
      }
    }

    await purchase.save();

    res.status(200).json({ message: "Purchase added successfully" ,userId:userId});
  } catch (error) {
    console.error("Error adding purchase:", error);
    next(error);
  }
};

module.exports = { addPurchase };
