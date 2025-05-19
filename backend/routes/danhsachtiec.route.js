const express = require("express");
const router = express.Router();
const phieudattiecController = require("../controllers/danhsachtiec.controller");

router.get("/", phieudattiecController.index);
router.get("/detail/:id", phieudattiecController.detail);

module.exports = router;
