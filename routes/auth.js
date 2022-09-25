const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

/* -------------------------------- Register -------------------------------- */
router.post("/register", async (req, res) => {
  // Create the new user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  // Save it
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ---------------------------------- Login --------------------------------- */
router.post("/login", async (req, res) => {
  try {
    // Request for matching
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials (username) !");

    const hasedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const _password = hasedPassword.toString(CryptoJS.enc.Utf8);
    _password !== req.body.password &&
      res.status(401).json("Wrong credentials (password) !");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    /**
     * Return user data
     *? password excluded
     */
    const { password, ...others } = user._doc;

    res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(err).json(err);
  }
});

module.exports = router;
