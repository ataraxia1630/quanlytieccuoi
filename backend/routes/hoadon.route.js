const express = require('express');
const router = express.Router();
const hoadonController = require('../controllers/hoadon.controller');

router.get("/hoadon", hoadonController.index)
router.get("/hoadon/create", hoadonController.create)

module.exports = router;