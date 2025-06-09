const { body, param, query } = require("express-validator");

const validTinhTrang = ["Có sẵn", "Tạm dừng", "Ngừng cung cấp"];

const dichVuValidation = {
  getDichVuById: [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Mã dịch vụ không được để trống.")
      .matches(/^DV\d{3}$/)
      .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là chữ số)."),
  ],

  createDichVu: [
    body("TenDichVu")
      .trim()
      .notEmpty()
      .withMessage("Tên dịch vụ không được để trống.")
      .isLength({ max: 100 })
      .withMessage("Tên dịch vụ không được vượt quá 100 ký tự."),

    body("DonGia")
      .notEmpty()
      .withMessage("Đơn giá không được để trống.")
      .isFloat({ min: 0 })
      .withMessage("Đơn giá phải là số không âm."),

    body("TinhTrang")
      .notEmpty()
      .withMessage("Tình trạng không được để trống.")
      .trim()
      .isIn(validTinhTrang)
      .withMessage(
        "Tình trạng phải là một trong các giá trị: Có sẵn, Tạm dừng, Ngừng cung cấp."
      ),
  ],

  updateDichVu: [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Mã dịch vụ không được để trống.")
      .matches(/^DV\d{3}$/)
      .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là chữ số)."),

    body("TenDichVu")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Tên dịch vụ không được vượt quá 100 ký tự."),

    body("DonGia")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Đơn giá phải là số không âm."),

    body("TinhTrang")
      .optional()
      .trim()
      .isIn(validTinhTrang)
      .withMessage(
        "Tình trạng phải là một trong các giá trị: Có sẵn, Tạm dừng, Ngừng cung cấp."
      ),
  ],

  deleteDichVu: [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Mã dịch vụ không được để trống.")
      .matches(/^DV\d{3}$/)
      .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là chữ số)."),
  ],

  searchDichVu: [
    query("maDichVu")
      .optional()
      .trim()
      .isLength({ max: 10 })
      .withMessage("Mã dịch vụ không được vượt quá 10 ký tự."),

    query("tenDichVu")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Tên dịch vụ không được vượt quá 100 ký tự."),

    query("giaTu")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Giá từ phải là số không âm."),

    query("giaDen")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Giá đến phải là số không âm."),

    query().custom((_, { req }) => {
      const { giaTu, giaDen } = req.query;
      if (giaTu !== undefined && giaDen !== undefined) {
        if (Number(giaTu) > Number(giaDen)) {
          throw new Error("Giá từ phải nhỏ hơn hoặc bằng giá đến.");
        }
      }
      return true;
    }),

    query("tinhTrang")
      .optional()
      .trim()
      .isIn(validTinhTrang)
      .withMessage(
        "Tình trạng phải là một trong các giá trị: Có sẵn, Tạm dừng, Ngừng cung cấp."
      ),
  ],
};

module.exports = dichVuValidation;
