const { Router } = require('express');
const { BaoCaoController } = require('../controllers/baocao.controller');

const router = Router();

// Xem bao cao thang
router.get('/:year/:month', BaoCaoController.XemBaoCao);

// Xuat file bao cao
router.post('/export', BaoCaoController.XuatFile);

// In bao cao
router.post('/print', BaoCaoController.InBaoCao);
