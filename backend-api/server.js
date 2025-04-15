// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoute = require("./Route/userRoute.js")
const protectedRoute = require("./Route/protectedRoute.js")

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
connectDB();


app.use("/api/user",userRoute );
app.use("/api/protected",protectedRoute );



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
