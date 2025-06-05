const { body, param, query } = require('express-validator');

const ThamSoValidation = {
  updateThamSo: [
    param('tenThamSo')
      .isIn([
        'ThoiDiemThanhToanSoVoiNgayDaiTiec',
        'TyLePhat',
        'ApDungQDPhatThanhToanTre',
      ])
      .withMessage('Tên tham số không hợp lệ'),
    body('GiaTri')
      .isInt()
      .withMessage('Giá trị phải là số nguyên')
      .custom((value, { req }) => {
        const tenThamSo = req.params.tenThamSo;
        if (tenThamSo === 'TyLePhat' && (value < 0 || value > 100)) {
          throw new Error('Tỷ lệ phạt phải từ 0 đến 100');
        }
        if (
          tenThamSo === 'ApDungQDPhatThanhToanTre' &&
          ![0, 1].includes(value)
        ) {
          throw new Error(
            'Áp dụng quy định phạt thanh toán trễ phải là 0 hoặc 1'
          );
        }
        return true;
      }),
  ],

  searchThamSo: [
    query('search')
      .optional()
      .isString()
      .withMessage('Từ khóa tìm kiếm phải là chuỗi'),
    query('limit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Limit phải là số nguyên dương'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset phải là số không âm'),
  ],
};

module.exports = ThamSoValidation;
