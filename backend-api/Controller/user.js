const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const passport = require("passport");
const User = require("../models/user")
dotenv.config();

// Tạo JWT token
const generateToken = (user) => {
  const payload = {
    _id: user._id,
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

const saveFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  if (!userId || !fcmToken) return res.status(400).json({ message: "Thiếu userId hoặc fcmToken." });
  try {
    const user = await User.findByIdAndUpdate(userId, { fcmToken }, { new: true });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });

    res.json({ message: " Đã lưu FCM token." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

module.exports = { login, saveFcmToken };