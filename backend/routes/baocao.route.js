const { Router } = require('express');
const { BaoCaoController } = require('../controllers/baocao.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
import { checkPermission } from '../middlewares/permission.middleware';

const router = Router();

// Xem bao cao thang
router.get(
  '/:year/:month',
  verifyToken,
  checkPermission('report.view'),
  BaoCaoController.XemBaoCao
);

// Xuat file bao cao
router.get(
  '/export/:year/:month',
  verifyToken,
  checkPermission('report.view'),
  BaoCaoController.XuatBaoCao
);

module.exports = router;
