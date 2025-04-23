// server.js
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db.js");
const userRoute = require("./Route/userRoute.js");
const protectedRoute = require("./Route/protectedRoute.js");
const managerRoute = require("./Route/managerRoute.js");
const employeeRoute = require("./Route/employeeRoute.js");
const notificationRoute = require("./Route/notificationRoute.js");
const authRoute = require("./Route/authRoute.js");

const { setupSocket } = require("./socket/socketHandler.js");   
const {startScheduleCheck} = require("./socket/socketSchedule.js")

dotenv.config();
const app = express();

const server = http.createServer(app); // Tạo server để dùng với socket
const io = new Server(server, {
  cors: {
    origin: "*", // cấu hình CORS nếu client khác port
  },
});

app.use(express.json());
connectDB();

// ROUTES
app.use("/api/user", userRoute);
app.use("/api/protected", protectedRoute);
app.use("/api/manager", managerRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/notification", notificationRoute);
app.use("/auth", authRoute);

// SOCKET setup
setupSocket(io);
startScheduleCheck();

// Khởi động server
const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
