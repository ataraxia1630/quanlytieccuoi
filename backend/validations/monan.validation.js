const { check } = require('express-validator');

const VALID_STATUS = ['AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_AVAILABLE'];

const createMonAnValidation = [
  check('MaMonAn')
    .notEmpty()
    .withMessage('Mã món ăn là bắt buộc')
    .isLength({ max: 10 })
    .withMessage('Mã món ăn tối đa 10 ký tự'),

  check('TenMonAn')
    .notEmpty()
    .withMessage('Tên món ăn là bắt buộc')
    .isLength({ max: 100 })
    .withMessage('Tên món ăn tối đa 100 ký tự'),

  check('DonGia')
    .notEmpty()
    .withMessage('Đơn giá là bắt buộc')
    .isFloat({ min: 0, max: 9999999 })
    .withMessage('Đơn giá phải là số và >= 0'),

  check('TinhTrang')
    .optional()
    .isIn(VALID_STATUS)
    .withMessage(`TinhTrang phải là một trong: ${VALID_STATUS.join(', ')}`),
];

const updateMonAnValidation = [
  check('TenMonAn')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Tên món ăn tối đa 100 ký tự'),

  check('DonGia')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Đơn giá phải là số và >= 0'),

  check('TinhTrang')
    .optional()
    .isIn(VALID_STATUS)
    .withMessage(`TinhTrang phải là một trong: ${VALID_STATUS.join(', ')}`),
];

module.exports = {
  createMonAnValidation,
  updateMonAnValidation,
};
