const { body, param } = require("express-validator");


const ctDichVuValidation = {

  getAllCTDichVuByPDTId: [
    param("soPhieuDatTiec")
      .trim()
      .notEmpty()
      .withMessage("Số phiếu đặt tiệc gắn với chi tiết dịch vụ không được để trống.")
      .matches(/^PDT\d{3}$/)
      .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),
  ],
  getCTDichVuById: [
    param("maDichVu")
      .trim()
      .notEmpty()
      .withMessage("Mã dịch vụ không được để trống.")
      .matches(/^DV\d{3}$/)
      .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là chữ số)."),

    param("soPhieuDatTiec")
      .trim()
      .notEmpty()
      .withMessage("Số phiếu đặt tiệc gắn với chi tiết dịch vụ không được để trống.")
      .matches(/^PDT\d{3}$/)
      .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),
  ],

  createCTDichVu: [
    body("MaDichVu")
      .trim()
      .notEmpty()
      .withMessage("Mã dịch vụ gắn với chi tiết dịch vụ không được để trống.")
      .matches(/^DV\d{3}$/)
      .withMessage("Mã dịch vụ  phải có định dạng DVxxx (x là chữ số)."),

    body("SoPhieuDatTiec")
      .trim()
      .notEmpty()
      .withMessage("Số phiếu đặt tiệc gắn với chi tiết dịch vụ không được để trống.")
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

  updateCTDichVu: [
    param("maDichVu")
      .trim()
      .optional({ nullable: true })
      .matches(/^DV\d{3}$/)
      .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là chữ số)."),

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


  ],

  deleteCTDichVu: [
    param("maDichVu")
      .trim()
      .notEmpty()
      .withMessage("Mã dịch vụ không được để trống.")
      .matches(/^DV\d{3}$/)
      .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là chữ số)."),

    param("soPhieuDatTiec")
      .trim()
      .notEmpty()
      .withMessage("Số phiếu đặt tiệc gắn với chi tiết dịch vụ không được để trống.")
      .matches(/^PDT\d{3}$/)
      .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),

  ],

}

module.exports = ctDichVuValidation;
