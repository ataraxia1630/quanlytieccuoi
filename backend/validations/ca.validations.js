const { check } = require('express-validator');

const caValidation = [
    check('MaCa').isLength({ max: 10 }).withMessage('Mã ca tối đa 10 ký tự')
    .notEmpty().withMessage('Mã ca là bắt buộc'),
    check('TenCa').isLength({ max: 5 }).withMessage('Tên ca tối đa 5 ký tự')
    .notEmpty().withMessage('Tên ca là bắt buộc'),
    check('GioBatDau').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Giờ bắt đầu phải có định dạng HH:mm:ss')
    .notEmpty().withMessage('Giờ bắt đầu là bắt buộc'),
    check('GioKetThuc').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Giờ kết thúc phải có định dạng HH:mm:ss')
    .notEmpty().withMessage('Giờ kết thúc là bắt buộc')
];

const caUpdateValidation = [
    check('TenCa').optional().isLength({ max: 5 }).withMessage('Tên ca tối đa 5 ký tự'),
    check('GioBatDau').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Giờ bắt đầu phải có định dạng HH:mm:ss'),
    check('GioKetThuc').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Giờ kết thúc phải có định dạng HH:mm:ss')
];

const scheduleValidation = [
    check('startDate').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Ngày bắt đầu phải có định dạng YYYY-MM-DD'),
    check('endDate').optional().isDate({ format: 'YYYY-MM-DD' }).withMessage('Ngày kết thúc phải có định dạng YYYY-MM-DD')
];

const searchValidation = [
    check('tenCa').optional().isLength({ max: 5 }).withMessage('Tên ca tối đa 5 ký tự'),
    check('gioBatDauFrom').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Giờ bắt đầu từ phải có định dạng HH:mm:ss'),
    check('gioBatDauTo').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Giờ bắt đầu đến phải có định dạng HH:mm:ss'),
    check('gioKetThucFrom').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Giờ kết thúc từ phải có định dạng HH:mm:ss'),
    check('gioKetThucTo').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Giờ kết thúc đến phải có định dạng HH:mm:ss')
];

module.exports = {
    caValidation,
    caUpdateValidation,
    scheduleValidation,
    searchValidation
};