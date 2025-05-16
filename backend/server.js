const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models/index.js"); // Import sequelize instance từ models/index.js
const models = require("./models/index.js"); // Import tất cả các model
const errorHandler = require("./middlewares/errorHandler.js");
const route = require("./routes/index.js");

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

// Kết nối database
sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connected successfully");
  })
  .catch((err) => console.error("Database connection failed:", err));

// Đồng bộ models với database (Cập nhật cơ sở dữ liệu nếu có thay đổi trong các model)
if (process.env.NODE_ENV === "development") {
  // sequelize
  //   .sync({ alter: true }) // nên dùng phương pháp migration để thay cho alter: true
  //   .then(() => console.log("Database synchronized!"))
  //   .catch((err) => console.error("Sync failed:", err.message));
}

// Route mặc định
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middleware xử lý lỗi ApiError và multer trước
app.use((err, req, res, next) => {
  if (err.name === 'ApiError') {
    res.status(err.statusCode).json({ status: err.statusCode, message: err.message, details: err.details });
  } else if (err instanceof multer.MulterError) {
    res.status(400).json({ status: 400, message: 'Lỗi upload file: ' + err.message });
  } else if (err.message.includes('Chỉ hỗ trợ file ảnh')) {
    res.status(400).json({ status: 400, message: err.message });
  } else {
    next(err); // Chuyển lỗi cho errorHandler xử lý
  }
});

// Gọi hàm route để gắn các router
route(app);

// Middleware xử lý lỗi (phải đặt sau tất cả các route)
app.use(errorHandler);

// Middleware 404
app.use((req, res) => {
  console.log(`404 Error for: ${req.method} ${req.url}`);
  res.status(404).json({ status: 404, message: 'Không tìm thấy tài nguyên' });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});