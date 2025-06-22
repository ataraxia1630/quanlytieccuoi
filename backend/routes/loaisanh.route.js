const { Router } = require('express');
const { LoaiSanhController } = require('../controllers/loaisanh.controller');
const validate = require('../middlewares/validation');
const {
  createLoaiSanhValidation,
  updateLoaiSanhValidation,
} = require('../validations/loaisanh.validation');
const { verifyToken } = require('../middlewares/auth.middleware');
import { checkPermission } from '../middlewares/permission.middleware';

const router = Router();

// Lấy tất cả loại sânh
router.get('/', verifyToken, LoaiSanhController.getAllLoaiSanh);

// Lấy loại sânh theo id
router.get('/:id', verifyToken, LoaiSanhController.getLoaiSanhById);

// Thêm loại sânh mới
router.post(
  '/',
  verifyToken,
  checkPermission('hallType.create'),
  createLoaiSanhValidation,
  validate,
  LoaiSanhController.createLoaiSanh
);

// Cập nhật loại sânh theo id
router.put(
  '/:id',
  verifyToken,
  checkPermission('hallType.edit'),
  updateLoaiSanhValidation,
  validate,
  LoaiSanhController.updateLoaiSanh
);

// Xóa loại sânh theo id
router.delete(
  '/:id',
  verifyToken,
  checkPermission('hallType.delete'),
  LoaiSanhController.deleteLoaiSanh
);

// Xóa tất cả loại sânh
// router.delete('/', LoaiSanhController.deleteAllLoaiSanh);

module.exports = router;
