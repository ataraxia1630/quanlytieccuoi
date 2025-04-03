const express = require('express');
const router = express.Router();
const { KhachHang } = require('../models');

router.get('/', async (req, res) => {
  const khachHangList = await KhachHang.findAll();
  res.json(khachHangList);
});

module.exports = router;
