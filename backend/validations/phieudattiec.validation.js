const { body, param, query } = require("express-validator");
const { options } = require("../routes/ca.route");


const phieuDatTiecValidation = {

    getAllPhieuDatTiecById: [
        param("id")
            .trim()
            .notEmpty()
            .withMessage("Số phiếu đặt tiệc không được để trống.")
            .matches(/^PDT\d{3}$/)
            .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),
    ],
    getPhieuDatTiecById: [
        param("id")
            .trim()
            .notEmpty()
            .withMessage("Số phiếu đặt tiệc không được để trống.")
            .matches(/^PDT\d{3}$/)
            .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),


    ],
    searchPhieuDatTiec: [
        body("TenChuRe")
            .trim()
            .optional({ nullable: true })
            .isLength({ max: 100 })
            .withMessage("Tên chú không được vượt quá 100 ký tự."),
        body("TenCoDau")
            .trim()
            .optional({ nullable: true })
            .isLength({ max: 100 })
            .withMessage("Tên cô dâu không được vượt quá 100 ký tự."),

        body("TenSanh")
            .optional({ nullable: true })
            .isLength({ max: 100 })
            .withMessage("Tên sảnh không được vượt quá 100 ký tự."),
    ],

    createPhieuDatTiec: [
        body("TenChuRe")
            .trim()
            .notEmpty()
            .withMessage("Tên chú rể không được để trống.")
            .isLength({ max: 100 })
            .withMessage("Tên chú không được vượt quá 100 ký tự."),
        body("TenCoDau")
            .trim()
            .notEmpty()
            .withMessage("Tên cô dâu không được để trống.")
            .isLength({ max: 100 })
            .withMessage("Tên cô dâu không được vượt quá 100 ký tự."),
        body("SDT")
            .trim()
            .notEmpty()
            .withMessage("Số điện thoại không được để trống.")
            .matches(/^0(3|5|7|8|9)\d{8}$/)

            .withMessage("Số điện thoại không đúng định dạng."),
        body("SoLuongBan")
            .notEmpty()
            .withMessage("Số lượng bàn không được để trống.")
            .isFloat({ min: 0 })
            .withMessage("Số lượng bàn phải là số không âm."),

        body("SoBanDuTru")
            .notEmpty()
            .withMessage("Số bàn dự trù không được để trống.")
            .isFloat({ min: 0 })
            .withMessage("Số bàn dự trù phải là số không âm."),

        body("NgayDaiTiec")
            .notEmpty()
            .withMessage("Ngày đãi tiệc không được để trống.")
            .isISO8601()
            .withMessage("Ngày đãi tiệc không đúng định dạng."),
        body("MaCa")
            .notEmpty()
            .withMessage("Mã ca không được để trống.")
            .matches(/^CA\d{3}$/)
            .withMessage("Mã ca phải có định dạng CAxxx (x là chữ số)."),
        body("TienDatCoc")
            .notEmpty()
            .withMessage("Tiền đặt cọc không được để trống.")
            .isFloat({ min: 0 })
            .withMessage("Tiền đặt cọc phải là số không âm."),
        body("NgayDatTiec")

            .notEmpty()
            .withMessage("Ngày đặt tiệc không được để trống.")
            .isISO8601()
            .withMessage("Ngày đặt tiệc không đúng định dạng."),
        body("TrangThai")
            .notEmpty()
            .withMessage("Trạng thái không được để trống.")
            .trim()
            .isIn(["Đã thanh toán", "Đã hủy", "Chưa thanh toán"])
            .withMessage("Trạng thái phải là một trong các giá trị: 'Đã thanh toán', 'Đã hủy', 'Chưa thanh toán'."),
        body("MaSanh")
            .notEmpty()
            .withMessage("Mã sảnh không được để trống.")
            .matches(/^S\d{3}$/)
            .withMessage("Mã sảnh phải có định dạng Sxxx(x là chữ số)."),

    ],

    updatePhieuDatTiec: [
        param("id")
            .trim()
            .notEmpty()
            .withMessage("Số phiếu đặt tiệc không được để trống.")
            .matches(/^PDT\d{3}$/)
            .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),


        body("TenChuRe")
            .trim()
            .optional({ nullable: true })
            .isLength({ max: 100 })
            .withMessage("Tên chú không được vượt quá 100 ký tự."),
        body("TenCoDau")
            .trim()
            .optional({ nullable: true })
            .isLength({ max: 100 })
            .withMessage("Tên cô dâu không được vượt quá 100 ký tự."),
        body("SDT")
            .trim()
            .optional({ nullable: true })
            .matches(/^0(3|5|7|8|9)\d{8}$/)
            .withMessage("Số điện thoại không đúng định dạng."),
        body("NgayDaiTiec")
            .optional({ nullable: true })
            .isISO8601()
            .withMessage("Ngày đãi tiệc không đúng định dạng."),
        body("MaCa")
            .optional({ nullable: true })
            .matches(/^CA\d{3}$/)
            .withMessage("Mã ca phải có định dạng CAxxx (x là chữ số)."),
        body("TienDatCoc")
            .optional({ nullable: true })
            .isFloat({ min: 0 })
            .withMessage("Tiền đặt cọc phải là số không âm."),
        body("SoLuongBan")
            .optional({ nullable: true })
            .isFloat({ min: 0 })
            .withMessage("Số lượng bàn phải là số không âm."),
        body("SoBanDuTru")
            .optional({ nullable: true })
            .isFloat({ min: 0 })
            .withMessage("Số bàn dự trù phải là số không âm."),
        body("NgayDatTiec")

            .optional({ nullable: true })
            .isISO8601()
            .withMessage("Ngày đặt tiệc không đúng định dạng."),
        body("TrangThai")
            .notEmpty()
            .withMessage("Trạng thái không được để trống.")
            .trim()
            .isIn(["Đã thanh toán", "Đã hủy", "Chưa thanh toán"])
            .withMessage("Trạng thái phải là một trong các giá trị: 'Đã thanh toán', 'Đã hủy', 'Chưa thanh toán'."),
        body("MaSanh")
            .optional({ nullable: true })
            .matches(/^S\d{3}$/)
            .withMessage("Mã sảnh phải có định dạng Sxxx(x là chữ số)."),

    ],

    deletePhieuDatTiec: [
        param("id")
            .trim()
            .notEmpty()
            .withMessage("Số phiếu đặt tiệc không được để trống.")
            .matches(/^PDT\d{3}$/)
            .withMessage("Số phiếu đặt tiệc phải có định dạng PDTxxx (x là chữ số)."),
    ],

}

module.exports = phieuDatTiecValidation;
