const { check } = require('express-validator');

const VALID_STATUS = ['AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_AVAILABLE'];

const createMonAnValidation = [
  check('TenMonAn')
    .notEmpty()
    .withMessage('Tên món ăn là bắt buộc')
    .isLength({ max: 100 })
    .withMessage('Tên món ăn tối đa 100 ký tự'),

  check('DonGia')
    .notEmpty()
    .withMessage('Đơn giá là bắt buộc')
    .toFloat()
    .isFloat({ min: 0, max: 99999999 })
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
    .toFloat()
    .isFloat({ min: 0, max: 99999999 })
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
