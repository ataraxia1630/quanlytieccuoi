require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: 'mysql',
    logging: false, // Tắt log query SQL (nếu cần bật, đặt là true)
    pool: {
        max: 10, // Số kết nối tối đa
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate()
    .then(() => console.log('Kết nối MySQL bằng Sequelize thành công!'))
    .catch(err => console.error('Kết nối thất bại:', err.message));

module.exports = sequelize;
