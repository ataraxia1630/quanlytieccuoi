const { Router } = require('express');
const { LoaiSanhController } = require('../controllers/loaisanh.controller');
const router = Router();

// Lấy tất cả loại sânh
router.get('/', LoaiSanhController.getAllLoaiSanh);

// Lấy loại sânh theo id
router.get('/:id', LoaiSanhController.getLoaiSanhById);

// Thêm loại sânh mới
router.post('/', LoaiSanhController.createLoaiSanh);

// Cập nhật loại sânh theo id
router.put('/:id', LoaiSanhController.updateLoaiSanh);

// Xóa loại sânh theo id
router.delete('/:id', LoaiSanhController.deleteLoaiSanh);

// Xóa tất cả loại sânh
router.delete('/', LoaiSanhController.deleteAllLoaiSanh);

// Tìm kiếm loại sânh theo tên
router.get('/search/:name', LoaiSanhController.searchLoaiSanhByName);

module.exports = router;
