const express = require("express");
const { login, saveFcmToken } = require("../Controller/user.js");
const passport = require("passport");
require("../config/passport.js");

const router = express.Router();

// Route đăng nhập
router.post("/login", login);

// Route lưu FCM token
router.post("/fcm-token", saveFcmToken)


module.exports = router;
