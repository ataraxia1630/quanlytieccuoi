require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Kết nối thất bại:', err.message);
    } else {
        console.log('Kết nối MySQL thành công!');
        connection.release();
    }
});

module.exports = pool;
