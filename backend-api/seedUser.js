const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/user.js"); // nếu file này dùng export mặc định ES Module thì cũng cần đổi

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email: "test11@example.com" });

    if (existingUser) {
      console.log(" User already exists");
    } else {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await User.create({
        name: "Test User",
        email: "test11@example.com",
        password: hashedPassword,
        role: "employee",
      });
      console.log(" User created");
    }
  } catch (error) {
    console.error(" Error creating user:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

// Nếu bạn muốn chạy file trực tiếp
createTestUser();
