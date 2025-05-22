const { Router } = require("express");
const {
  validateCt_DichVu,
  validateCompositeKey,
  validateSearchCt_DichVu,
} = require("../validations/ct_dichvu.validation.js");
const Ct_DichVuController = require("../controllers/ct_dichvu.controller.js");
const validate = require("../middlewares/validation.js");

const router = Router();

// Lấy tất cả các ct_dichvu
router.get("/", Ct_DichVuController.getAllCt_DichVu);

// Lấy chi tiết dịch vụ theo khóa chính
router.get(
  "/:maDichVu/:soPhieuDatTiec",
  validateCompositeKey,
  validate,
  Ct_DichVuController.getCt_DichVuById
);

// Tạo chi tiết dịch vụ
router.post(
  "/",
  validateCt_DichVu,
  validate,
  Ct_DichVuController.createCt_DichVu
);

// Cập nhật ctdv
router.put(
  "/:maDichVu/:soPhieuDatTiec",
  validateCompositeKey,
  validateCt_DichVu,
  validate,
  Ct_DichVuController.updateCt_DichVu
);

module.exports = router;
