const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { registerSchema, loginSchema } = require("../validation/userValidation");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, referrerId } = req.body;
// Validate input using Joi
const { error } = registerSchema.validate(req.body, { abortEarly: false });
if (error) {
  return res.status(400).json({ errors: error.details.map(err => err.message) });
}
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
   // Check for referrer validity
   let referrer = null;
   if (referrerId) {
     referrer = await User.findById(referrerId);
     if (!referrer) {
       return res.status(404).json({ message: "Invalid referrer ID" });
     }
     if (referrer.directReferrals.length >= 8) {
       return res.status(400).json({ message: "Referrer has reached the maximum limit of 8 referrals" });
     }
   }
    const newUser = new User({
      name,
      email,
      password,
      referrer: referrerId || null,
    });

    const user = await newUser.save();
    // Update referrer's directReferrals
    if (referrerId) {
      const referrer = await User.findById(referrerId);
      if (referrer) {
        referrer.directReferrals.push(user._id);
        await referrer.save();
      }
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
