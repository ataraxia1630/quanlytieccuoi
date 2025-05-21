const { body, param, query } = require("express-validator");

const validateCt_DichVu = [
  body("MaDichVu")
    .trim()
    .notEmpty()
    .withMessage("Mã dịch vụ là bắt buộc.")
    .matches(/^DV\d{3}$/)
    .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là số)."),
  body("SoPhieuDatTiec")
    .trim()
    .notEmpty()
    .withMessage("Số phiếu đặt tiệc là bắt buộc.")
    .matches(/^PDT\d{3}$/)
    .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là số)."),
  body("SoLuong")
    .isInt({ min: 1 })
    .withMessage("Số lượng phải là số nguyên dương."),
];

const validateCompositeKey = [
  param("maDichVu")
    .trim()
    .notEmpty()
    .withMessage("Mã dịch vụ không hợp lệ.")
    .matches(/^DV\d{3}$/)
    .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là số)."),
  param("soPhieuDatTiec")
    .trim()
    .notEmpty()
    .withMessage("Số phiếu đặt tiệc không hợp lệ.")
    .matches(/^PDT\d{3}$/)
    .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là số)."),
];

const validateSearchCt_DichVu = [
  query("maDichVu")
    .optional()
    .trim()
    .matches(/^DV\d{3}$/)
    .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là số)."),
  query("soPhieuDatTiec")
    .optional()
    .trim()
    .matches(/^PDT\d{3}$/)
    .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là số)."),
  query("soLuong")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Số lượng phải là số nguyên dương."),
  query("donGiaTu")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Đơn giá từ phải là số dương."),
  query("donGiaDen")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Đơn giá đến phải là số dương."),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit phải là số nguyên dương."),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset phải là số không âm."),
];

module.exports = {
  validateCt_DichVu,
  validateCompositeKey,
  validateSearchCt_DichVu,
};
