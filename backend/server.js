const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models/index.js'); // Import sequelize instance từ models/index.js
const models = require('./models/index.js'); // Import tất cả các model
const errorHandler = require('./middlewares/errorHandler.js');

// Import các route
const caRouter = require('./routes/ca.route.js');
const sanhRouter = require('./routes/sanh.route.js');
const route = require('./routes/index.js');

const app = express();
const port = process.env.DB_PORT || 3000;

const requiredEnvVars = [
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_HOST',
  'DB_DIALECT',
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
    console.log('Database connected successfully');
  })
  .catch((err) => console.error('Database connection failed:', err));

// Đồng bộ models với database (Cập nhật cơ sở dữ liệu nếu có thay đổi trong các model)
if (process.env.NODE_ENV === 'development') {
  // sequelize
  //   .sync({ alter: true }) // nên dùng phương pháp migration để thay cho alter: true
  //   .then(() => console.log("Database synchronized!"))
  //   .catch((err) => console.error("Sync failed:", err.message));
}

// Route mặc định
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Log tất cả request
// app.use((req, res, next) => {
//     console.log(`Request received: ${req.method} ${req.url}`);
//     next();
// });

// Gắn các route
app.use('/api', caRouter); // Các endpoint như /api/ca
app.use('/api', sanhRouter); // Các endpoint như /api/sanh

// Middleware xử lý lỗi (phải đặt sau tất cả các route)

app.use(errorHandler);

// Khởi động server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

route(app);
