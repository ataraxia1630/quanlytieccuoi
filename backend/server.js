const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models/index.js"); // Import sequelize instance từ models/index.js
const models = require("./models/index.js"); // Import tất cả các model
const errorHandler = require("./middlewares/errorHandler.js");

const app = express();
const port = process.env.DB_PORT || 3000;

const requiredEnvVars = [
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_HOST",
  "DB_DIALECT",
];

// Kiểm tra các biến môi trường bắt buộc
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
});

app.use(cors());
app.use(express.json()); // Hỗ trợ JSON request body

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// Đồng bộ models với database (Cập nhật cơ sở dữ liệu nếu có thay đổi trong các model)
if (process.env.NODE_ENV === "development") {
  // sequelize
  //   .sync({ alter: true }) //nên dùng phương pháp migration để thay cho alter: true
  //   .then(() => console.log("Database synchronized!"))
  //   .catch((err) => console.error("Sync failed:", err.message));
}


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
