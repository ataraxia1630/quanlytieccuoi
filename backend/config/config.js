require('dotenv').config();  // Đọc file .env

const commonConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};


module.exports = {
  development: {
    ...commonConfig,
    database: "defaultdb",
  },
  production: {
    ...commonConfig,
    database: "defaultdb" + "_prod",
  },
};
