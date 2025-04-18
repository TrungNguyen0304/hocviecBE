const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    // Trả token về client hoặc redirect tùy ý
    res.redirect(`/success?token=${token}`);
  }
);

module.exports = router;
