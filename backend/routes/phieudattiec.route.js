const express = require("express");
const router = express.Router();
const phieudattiecController = require("../controllers/phieudattiec.controller");

router.get("/", phieudattiecController.index);
router.get("/detail/:id", phieudattiecController.detail);

module.exports = router;
