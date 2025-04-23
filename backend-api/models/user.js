const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ."],
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["manager", "employee"],
    default: "employee",
    required: true,
  },
  fcmToken: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
