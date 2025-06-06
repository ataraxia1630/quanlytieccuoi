require('dotenv').config();

const commonConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  timezone: '+07:00',
  dialectOptions: {
    timezone: '+07:00',
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

module.exports = {
  development: {
    ...commonConfig,
    database: process.env.DB_NAME,
  },
  test: {
    ...commonConfig,
    database: process.env.DB_NAME + '_test',
  },
  production: {
    ...commonConfig,
    database: process.env.DB_NAME + '_prod',
  },
};
