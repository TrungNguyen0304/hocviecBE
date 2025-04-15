const express = require("express");
const { login } = require("../Controller/user.js");
const passport = require("passport");
require("../config/passport.js"); 

const router = express.Router();

// Route đăng nhập
router.post("/login", login);

module.exports = router;
