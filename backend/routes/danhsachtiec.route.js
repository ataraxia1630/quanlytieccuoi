const express = require("express");
const router = express.Router();
const danhsachtiecController = require("../controllers/danhsachtiec.controller");

router.get("/", danhsachtiecController.index);
router.get("/detail/:id", danhsachtiecController.detail);
router.post("/filter", danhsachtiecController.filter)
module.exports = router;
