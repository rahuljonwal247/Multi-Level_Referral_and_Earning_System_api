const express = require("express");
const userRoutes=require('./authRoutes')
const referralRoutes=require('./referralRoutes')
const earning=require('./earningsRoutes')
const router = express.Router();

router.use("/users", userRoutes);
router.use("/referrals", referralRoutes);
router.use("/earning", earning);


module.exports = router;