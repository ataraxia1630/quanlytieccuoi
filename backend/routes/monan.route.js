const { Router } = require('express');
const { MonAnController } = require('../controllers/monan.controller');
const { upload } = require('../middlewares/uploadHandler');
const validate = require('../middlewares/validation');
const {
  createMonAnValidation,
  updateMonAnValidation,
} = require('../validations/monan.validation');
const { verifyToken } = require('../middlewares/auth.middleware');
import { checkPermission } from '../middlewares/permission.middleware';

const router = Router();

// Lấy danh sách món ăn (available)
router.get('/available', verifyToken, MonAnController.getAvailableMonAn);

// Lấy chi tiết món ăn theo ID
router.get('/:id', verifyToken, MonAnController.getMonAnById);

// Có thể thêm các tham số truy vấn để phân trang, sắp xếp, lọc
router.get('/', verifyToken, MonAnController.getAllMonAn);

// Tạo một món ăn mới
router.post(
  '/',
  verifyToken,
  checkPermission('food.create'),
  upload.single('image'),
  createMonAnValidation,
  validate,
  MonAnController.createMonAn
);

// Cập nhật thông tin món ăn theo ID
router.put(
  '/:id',
  verifyToken,
  checkPermission('food.edit'),
  upload.single('image'),
  updateMonAnValidation,
  validate,
  MonAnController.updateMonAn
);

// Xóa món ăn theo ID
router.delete(
  '/:id',
  verifyToken,
  checkPermission('food.delete'),
  MonAnController.deleteMonAn
);

// // Xóa tất cả món ăn
// router.delete('/', MonAnController.markAllMonAnAsDeleted);

module.exports = router;
