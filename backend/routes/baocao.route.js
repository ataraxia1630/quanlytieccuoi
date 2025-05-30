const { Router } = require('express');
const { BaoCaoController } = require('../controllers/baocao.controller');

const router = Router();

// Xem bao cao thang
router.get('/:year/:month', BaoCaoController.XemBaoCao);

// Xuat file bao cao
router.get('/export/:year/:month', BaoCaoController.XuatBaoCao);

module.exports = router;
