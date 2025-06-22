const { Router } = require('express');
const DichVuValidation = require('../validations/dichvu.validation.js');
const DichVuController = require('../controllers/dichvu.controller.js');
const validate = require('../middlewares/validation.js');
const { verifyToken } = require('../middlewares/auth.middleware');
import { checkPermission } from '../middlewares/permission.middleware';

const router = Router();

// Lấy tất cả dịch vụ
router.get('/', verifyToken, DichVuController.getAllDichVu);

// Tìm kiếm và lọc dịch vụ
router.get(
  '/search',
  verifyToken,
  DichVuValidation.searchDichVu,
  validate,
  DichVuController.searchDichVu
);

// Lấy các dịch vụ có thể đặt tiệc
router.get('/active', verifyToken, DichVuController.getActiveDichVu);

// Lấy dịch vụ theo ID
router.get(
  '/:id',
  verifyToken,
  DichVuValidation.getDichVuById,
  validate,
  DichVuController.getDichVuById
);

// Tạo dịch vụ mới
router.post(
  '/',
  verifyToken,
  checkPermission('service.create'),
  DichVuValidation.createDichVu,
  validate,
  DichVuController.createDichVu
);

// Cập nhật dịch vụ
router.put(
  '/:id',
  verifyToken,
  checkPermission('service.edit'),
  DichVuValidation.updateDichVu,
  validate,
  DichVuController.updateDichVu
);

// Xóa dịch vụ
router.delete(
  '/:id',
  verifyToken,
  checkPermission('service.delete'),
  DichVuValidation.deleteDichVu,
  validate,
  DichVuController.deleteDichVu
);

module.exports = router;
