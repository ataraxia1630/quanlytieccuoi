const { body, param } = require("express-validator");


const ctDatBanValidation = {

  getAllCTDatBanByPDTId: [
    param("soPhieuDatTiec")
      .trim()
      .notEmpty()
      .withMessage("Số phiếu đặt tiệc gắn với chi tiết món ăn không được để trống.")
      .matches(/^PDT\d{3}$/)
      .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),
  ],
  getCTDatBanById: [
    param("maMonAn")
      .trim()
      .notEmpty()
      .withMessage("Mã món ăn không được để trống.")
      .matches(/^MA\d{3}$/)
      .withMessage("Mã món ăn phải có định dạng MAxxx (x là chữ số)."),

    param("soPhieuDatTiec")
      .trim()
      .notEmpty()
      .withMessage("Số phiếu đặt tiệc gắn với chi tiết món ăn không được để trống.")
      .matches(/^PDT\d{3}$/)
      .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),
  ],

  createCTDatBan: [
    body("MaMonAn")
      .trim()
      .notEmpty()
      .withMessage("Mã món ăn gắn với chi tiết món ăn không được để trống.")
      .matches(/^MA\d{3}$/)
      .withMessage("Mã món ăn  phải có định dạng MAxxx (x là chữ số)."),

    body("GhiChu")
      .trim()
      .isLength({ max: 200 })
      .withMessage("Ghi chú không được vượt quá 200 ký tự."),

    body("SoPhieuDatTiec")
      .trim()
      .notEmpty()
      .withMessage("Số phiếu đặt tiệc gắn với chi tiết món ăn không được để trống.")
      .matches(/^PDT\d{3}$/)
      .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),

    body("DonGia")
      .notEmpty()
      .withMessage("Đơn giá không được để trống.")
      .isFloat({ min: 0 })
      .withMessage("Đơn giá phải là số không âm."),

    body("SoLuong")
      .notEmpty()
      .withMessage("Số lượng không được để trống.")
      .isFloat({ min: 0 })
      .withMessage("Số lượng phải là số không âm."),
  ],

  updateCTDatBan: [
    param("maMonAn")
      .trim()
      .optional({ nullable: true })
      .matches(/^MA\d{3}$/)
      .withMessage("Mã món ăn phải có định dạng MAxxx (x là chữ số)."),

    param("soPhieuDatTiec")
      .trim()
      .optional({ nullable: true })
      .matches(/^PDT\d{3}$/)
      .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),

    body("DonGia")
      .optional({ nullable: true })
      .isFloat({ min: 0 })
      .withMessage("Đơn giá phải là số không âm."),

    body("SoLuong")
      .optional({ nullable: true })
      .isFloat({ min: 0 })
      .withMessage("Số lượng phải là số không âm."),

    body("GhiChu")
      .trim()
      .optional({ nullable: true })
      .isLength({ max: 200 })
      .withMessage("Ghi chú không được vượt quá 200 ký tự."),

  ],

  deleteCTDatBan: [
    param("maMonAn")
      .trim()
      .notEmpty()
      .withMessage("Mã món ăn không được để trống.")
      .matches(/^MA\d{3}$/)
      .withMessage("Mã món ăn phải có định dạng MAxxx (x là chữ số)."),

    param("soPhieuDatTiec")
      .trim()
      .notEmpty()
      .withMessage("Số phiếu đặt tiệc gắn với chi tiết món ăn không được để trống.")
      .matches(/^PDT\d{3}$/)
      .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),

  ],

}

module.exports = ctDatBanValidation;
