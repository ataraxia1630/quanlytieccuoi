const { Router } = require('express');

const { MonAnController } = require('../controllers/monan.controller');

const router = Router();

// Lấy danh sách món ăn (available, unavailable, no_longer_available)
// Có thể thêm các tham số truy vấn để phân trang, sắp xếp, lọc
router.get('/', MonAnController.getAllMonAn);

// Lấy chi tiết món ăn theo ID
router.get('/:id', MonAnController.getMonAnById);

// Tạo một món ăn mới
router.post('/', MonAnController.createMonAn);

// Cập nhật thông tin món ăn theo ID
router.put('/:id', MonAnController.updateMonAn);

// Xóa món ăn theo ID
router.delete('/:id', MonAnController.deleteMonAn);

// Xóa tất cả món ăn
router.delete('/', MonAnController.markAllMonAnAsDeleted);

// Tìm kiếm món ăn theo tên, khoảng giá, tình trạng
router.get('/search/:name', MonAnController.searchMonAnByName);
