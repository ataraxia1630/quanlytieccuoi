const { Router } = require('express');
const { LoaiSanhController } = require('../controllers/loaisanh.controller');
const validate = require('../middlewares/validation');
const {
  createLoaiSanhValidation,
  updateLoaiSanhValidation,
} = require('../validations/loaisanh.validation');
const router = Router();

// Lấy tất cả loại sânh
router.get('/', LoaiSanhController.getAllLoaiSanh);

// Lấy loại sânh theo id
router.get('/:id', LoaiSanhController.getLoaiSanhById);

// Thêm loại sânh mới
router.post(
  '/',
  createLoaiSanhValidation,
  validate,
  LoaiSanhController.createLoaiSanh
);

// Cập nhật loại sânh theo id
router.put(
  '/:id',
  updateLoaiSanhValidation,
  validate,
  LoaiSanhController.updateLoaiSanh
);

// Xóa loại sânh theo id
router.delete('/:id', LoaiSanhController.deleteLoaiSanh);

// Xóa tất cả loại sânh
router.delete('/', LoaiSanhController.deleteAllLoaiSanh);

module.exports = router;
