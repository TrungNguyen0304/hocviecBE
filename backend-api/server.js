// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoute = require("./Route/userRoute.js")
const protectedRoute = require("./Route/protectedRoute.js")
const managerRoute = require("./Route/managerRoute.js")
const employeeRoute = require("./Route/employeeRoute.js")
const notificationRoute = require("./Route/notificationRoute.js")


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
connectDB();


app.use("/api/user",userRoute );
app.use("/api/protected",protectedRoute );
app.use("/api/manager",managerRoute );
app.use("/api/employee",employeeRoute );
app.use("/api/notification",notificationRoute );

  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
