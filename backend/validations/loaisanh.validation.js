const { check } = require('express-validator');

const createLoaiSanhValidation = [
  check('TenLoaiSanh')
    .notEmpty()
    .withMessage('Tên loại sảnh là bắt buộc')
    .isLength({ max: 10 })
    .withMessage('Tên loại sảnh tối đa 10 ký tự'),

  check('DonGiaBanToiThieu')
    .notEmpty()
    .withMessage('Đơn giá bán tối thiểu là bắt buộc')
    .isFloat({ min: 0, max: 99999999 })
    .withMessage('Đơn giá bán tối thiểu phải là số và >= 0, <= 99999999'),
];

const updateLoaiSanhValidation = [
  check('TenLoaiSanh')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Tên loại sảnh tối đa 10 ký tự'),

  check('DonGiaBanToiThieu')
    .optional()
    .isFloat({ min: 0, max: 99999999 })
    .withMessage('Đơn giá bán tối thiểu phải là số và >= 0, <= 99999999'),
];

module.exports = {
  createLoaiSanhValidation,
  updateLoaiSanhValidation,
};
