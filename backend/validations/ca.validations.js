const { check } = require('express-validator');

// Validation cho việc tạo mới ca làm việc
const caValidation = [
  check('TenCa')
    .isLength({ max: 50 })
    .withMessage('Tên ca tối đa 50 ký tự')
    .notEmpty()
    .withMessage('Tên ca là bắt buộc'),

  check('GioBatDau')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Giờ bắt đầu phải có định dạng HH:mm:ss')
    .notEmpty()
    .withMessage('Giờ bắt đầu là bắt buộc'),

  check('GioKetThuc')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Giờ kết thúc phải có định dạng HH:mm:ss')
    .notEmpty()
    .withMessage('Giờ kết thúc là bắt buộc'),
];

// Validation cho việc cập nhật thông tin ca làm việc (tất cả các trường đều không bắt buộc)
const caUpdateValidation = [
  check('TenCa')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Tên ca tối đa 50 ký tự'),

  check('GioBatDau')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Giờ bắt đầu phải có định dạng HH:mm:ss'),

  check('GioKetThuc')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Giờ kết thúc phải có định dạng HH:mm:ss'),
];

// Validation liên quan đến lịch trình (ví dụ: lọc theo khoảng thời gian)
const scheduleValidation = [
  check('startDate')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Ngày bắt đầu phải có định dạng YYYY-MM-DD'),

  check('endDate')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Ngày kết thúc phải có định dạng YYYY-MM-DD'),
];

// Validation cho việc tìm kiếm và lọc ca làm việc (tất cả các trường đều không bắt buộc)
const searchAndFilterValidation = [
  check('maCa')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Mã ca tối đa 10 ký tự'),
  check('tenCa')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Tên ca tối đa 50 ký tự'),

  check('gioBatDauFrom')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Giờ bắt đầu từ phải có định dạng HH:mm:ss'),

  check('gioBatDauTo')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Giờ bắt đầu đến phải có định dạng HH:mm:ss'),

  check('gioKetThucFrom')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Giờ kết thúc từ phải có định dạng HH:mm:ss'),

  check('gioKetThucTo')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Giờ kết thúc đến phải có định dạng HH:mm:ss'),

  check('sortBy')
    .optional()
    .isIn(['MaCa', 'TenCa', 'GioBatDau', 'GioKetThuc'])
    .withMessage('Trường sắp xếp phải là MaCa, TenCa, GioBatDau hoặc GioKetThuc'),

  check('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Thứ tự sắp xếp phải là ASC hoặc DESC'),
];

module.exports = {
  caValidation,
  caUpdateValidation,
  scheduleValidation,
  searchAndFilterValidation,
};