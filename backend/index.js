const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database.js"); // Import Sequelize
const models = require("./models"); // Import tất cả các model


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json()); // Hỗ trợ JSON request body

// Đồng bộ models với database
sequelize.sync({ alter: true })  
    .then(() => console.log("Database synchronized!"))
    .catch(err => console.error("Sync failed:", err.message));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});