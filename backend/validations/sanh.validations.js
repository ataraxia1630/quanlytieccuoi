const { check } = require('express-validator');

const sanhValidation = [
    check('MaSanh').isLength({ max: 10 }).withMessage('Mã sảnh tối đa 10 ký tự')
    .notEmpty().withMessage('Mã sảnh là bắt buộc'),
    check('MaLoaiSanh').isLength({ max: 10 }).withMessage('Mã loại sảnh tối đa 10 ký tự')
    .notEmpty().withMessage('Mã loại sảnh là bắt buộc'),
    check('TenSanh').isLength({ max: 100 }).withMessage('Tên sảnh tối đa 100 ký tự')
    .notEmpty().withMessage('Tên sảnh là bắt buộc'),
    check('SoLuongBanToiDa').isInt({ min: 0, max: 255 }).withMessage('Số lượng bàn tối đa từ 0 đến 255')
    .notEmpty().withMessage('Số lượng bàn tối đa là bắt buộc'),
    check('HinhAnh').optional().isLength({ max: 255 }).withMessage('Đường dẫn hình ảnh tối đa 255 ký tự'),
    check('GhiChu').optional().isLength({ max: 255 }).withMessage('Ghi chú tối đa 255 ký tự')
];

const sanhUpdateValidation = [
    check('MaLoaiSanh').optional().isLength({ max: 10 }).withMessage('Mã loại sảnh tối đa 10 ký tự'),
    check('TenSanh').optional().isLength({ max: 100 }).withMessage('Tên sảnh tối đa 100 ký tự'),
    check('SoLuongBanToiDa').optional().isInt({ min: 0, max: 255 }).withMessage('Số lượng bàn tối đa từ 0 đến 255'),
    check('HinhAnh').optional().isLength({ max: 255 }).withMessage('Đường dẫn hình ảnh tối đa 255 ký tự'),
    check('GhiChu').optional().isLength({ max: 255 }).withMessage('Ghi chú tối đa 255 ký tự')
];

const checkAvailabilityValidation = [
    check('ngayDaiTiec').isDate({ format: 'YYYY-MM-DD' }).withMessage('Ngày diễn tiệc phải có định dạng YYYY-MM-DD')
    .notEmpty().withMessage('Ngày diễn tiệc là bắt buộc'),
    check('maCa').isLength({ max: 10 }).withMessage('Mã ca tối đa 10 ký tự')
    .notEmpty().withMessage('Mã ca là bắt buộc')
];

const searchValidation = [
    check('maSanh').optional().isLength({ max: 10 }).withMessage('Mã sảnh tối đa 10 ký tự'),
    check('maLoaiSanh').optional().isLength({ max: 10 }).withMessage('Mã loại sảnh tối đa 10 ký tự'),
    check('tenSanh').optional().isLength({ max: 100 }).withMessage('Tên sảnh tối đa 100 ký tự'),
    check('tenLoaiSanh').optional().isLength({ max: 10 }).withMessage('Tên loại sảnh tối đa 10 ký tự'),
    check('minSoLuongBan').optional().isInt({ min: 0, max: 255 }).withMessage('Số lượng bàn tối thiểu từ 0 đến 255'),
    check('maxSoLuongBan').optional().isInt({ min: 0, max: 255 }).withMessage('Số lượng bàn tối đa từ 0 đến 255')
];

module.exports = {
    sanhValidation,
    sanhUpdateValidation,
    checkAvailabilityValidation,
    searchValidation
};