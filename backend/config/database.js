require("dotenv").config();
const { Sequelize } = require("sequelize");

// Khởi tạo kết nối Sequelize
const sequelize = new Sequelize({
  database: process.env.DATABASE,
  username: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  dialect: "mysql",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false, // Tắt logging để không in ra câu lệnh SQL trong console
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Kết nối MySQL bằng sequelize thành công!");
  } catch (error) {
    console.error("Kết nối thất bại:", error.message);
  }
}

testConnection();

module.exports = sequelize;
