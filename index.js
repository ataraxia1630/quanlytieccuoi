const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World????!");
});

app.listen(port, () => {
  console.log("Example app listening on port " + port);
});
