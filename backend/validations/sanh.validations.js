const { check } = require('express-validator');

// Validation cho việc tạo mới sảnh
const sanhValidation = [
  check('MaLoaiSanh')
    .isLength({ max: 10 })
    .withMessage('Mã loại sảnh tối đa 10 ký tự')
    .notEmpty()
    .withMessage('Mã loại sảnh là bắt buộc'),

  check('TenSanh')
    .isLength({ max: 100 })
    .withMessage('Tên sảnh tối đa 100 ký tự')
    .notEmpty()
    .withMessage('Tên sảnh là bắt buộc'),

  check('SoLuongBanToiDa')
    .isInt({ min: 0, max: 999 })
    .withMessage('Số lượng bàn tối đa từ 0 đến 999')
    .notEmpty()
    .withMessage('Số lượng bàn tối đa là bắt buộc'),

  check('HinhAnh')
    .optional() // Trường này không bắt buộc
    .isLength({ max: 255 })
    .withMessage('Đường dẫn hình ảnh tối đa 255 ký tự'),

  check('GhiChu')
    .optional() // Trường này không bắt buộc
    .isLength({ max: 255 })
    .withMessage('Ghi chú tối đa 255 ký tự'),
];

// Validation cho việc cập nhật thông tin sảnh (tất cả các trường đều không bắt buộc)
const sanhUpdateValidation = [
  check('MaLoaiSanh')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Mã loại sảnh tối đa 10 ký tự'),

  check('TenSanh')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Tên sảnh tối đa 100 ký tự'),

  check('SoLuongBanToiDa')
    .optional()
    .isInt({ min: 0, max: 999 })
    .withMessage('Số lượng bàn tối đa từ 0 đến 999'),

  check('HinhAnh')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Đường dẫn hình ảnh tối đa 255 ký tự'),

  check('GhiChu')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Ghi chú tối đa 255 ký tự'),
];

// Validation cho việc tìm kiếm và lọc sảnh (tất cả các trường đều không bắt buộc)
const searchAndFilterValidation = [
  check('maSanh')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Mã sảnh tối đa 10 ký tự'),

  check('tenSanh')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Tên sảnh tối đa 100 ký tự'),

  check('maLoaiSanh')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Mã loại sảnh tối đa 10 ký tự'),

  check('minSoLuongBan')
    .optional()
    .isInt({ min: 0, max: 999 })
    .withMessage('Số lượng bàn tối thiểu từ 0 đến 999'),

  check('maxSoLuongBan')
    .optional()
    .isInt({ min: 0, max: 999 })
    .withMessage('Số lượng bàn tối đa từ 0 đến 999'),

  check('sortBy')
    .optional()
    .isIn(['MaSanh', 'TenSanh', 'MaLoaiSanh', 'SoLuongBanToiDa'])
    .withMessage('Trường sắp xếp phải là MaSanh, TenSanh, MaLoaiSanh hoặc SoLuongBanToiDa'),

  check('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Thứ tự sắp xếp phải là ASC hoặc DESC'),
];

// Validation cho việc tải lên hình ảnh (yêu cầu mã sảnh)
const uploadImageValidation = [
];

module.exports = {
  sanhValidation,
  sanhUpdateValidation,
  searchAndFilterValidation,
  uploadImageValidation,
};