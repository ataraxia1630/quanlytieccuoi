"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

// Log thông tin kết nối database
if (process.env.NODE_ENV === "development") {
  console.log(
    `Connecting to database: ${config.database} and admin: ${config.username}`
  );
}

const sequelize = new Sequelize({
  ...config,
  logging: false, // Tắt logging của SQL queries
});

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
  )
  .forEach((file) => {
    try {
      const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes
      );
      db[model.name] = model;
    } catch (err) {
      console.error(`Error loading model ${file}:`, err);
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

