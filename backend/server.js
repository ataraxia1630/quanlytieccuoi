const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models/index.js");

// const models = require("./models/index.js");

// Middlewares
const errorHandler = require("./middlewares/errorHandler.js");

// Routes
const caRouter = require("./routes/ca.route.js");
const sanhRouter = require("./routes/sanh.route.js");
const dichVuRoute = require("./routes/dichvu.route.js");

const app = express();
const port = process.env.DB_PORT;

// Kiểm tra các biến môi trường bắt buộc
const requiredEnvVars = [
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_HOST",
  "DB_DIALECT",
];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Kết nối database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Route mặc định
app.get("/", (req, res) => {
  res.send("Hello World!");
});


// Log tất cả request
// app.use((req, res, next) => {
//     console.log(`Request received: ${req.method} ${req.url}`);
//     next();
// });

// API routes
app.use("/api", caRouter); // Các endpoint như /api/ca
app.use("/api", sanhRouter); // Các endpoint như /api/sanh
app.use("/api/dichvu", dichVuRoute);

// Middleware xử lý lỗi (phải đặt sau tất cả các route)
app.use(errorHandler);

// Khởi động server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
