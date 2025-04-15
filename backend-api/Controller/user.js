const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();

// Tạo JWT token
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info?.message || "Đăng nhập thất bại",
      });
    }

    const token = generateToken(user);
    res.json({ token });
  })(req, res, next);
};

module.exports = { login };