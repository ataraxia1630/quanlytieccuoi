const { body, param, query } = require("express-validator");

const validTinhTrang = ["Đang áp dụng", "Tạm ngừng", "Ngừng áp dụng"];

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
      .trim()
      .isIn(validTinhTrang)
      .withMessage(
        "Tình trạng phải là một trong các giá trị: Đang áp dụng, Tạm ngừng, Ngừng áp dụng."
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
      .trim()
      .optional({ nullable: true })
      .withMessage("Tên dịch vụ không được để trống.")
      .isLength({ max: 100 })
      .withMessage("Tên dịch vụ không được vượt quá 100 ký tự."),

    body("DonGia")
      .optional({ nullable: true })
      .withMessage("Đơn giá không được để trống.")
      .isFloat({ min: 0 })
      .withMessage("Đơn giá phải là số không âm."),

    body("TinhTrang")
      .optional()
      .trim()
      .isIn(validTinhTrang)
      .withMessage(
        "Tình trạng phải là một trong các giá trị: Đang áp dụng, Tạm ngừng, Ngừng áp dụng."
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
      .matches(/^DV\d{3}$/)
      .withMessage("Mã dịch vụ phải có định dạng DVxxx (x là chữ số)."),

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
        "Tình trạng phải là một trong các giá trị: Đang áp dụng, Tạm ngừng, Ngừng áp dụng."
      ),
  ],
};

module.exports = dichVuValidation;
