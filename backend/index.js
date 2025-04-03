const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database.js");
const port = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
