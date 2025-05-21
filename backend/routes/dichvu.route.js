const { Router } = require("express");
const DichVuValidation = require("../validations/dichvu.validation.js");
const DichVuController = require("../controllers/dichvu.controller.js");
const validate = require("../middlewares/validation.js");

const router = Router();

// Lấy tất cả dịch vụ
router.get("/", DichVuController.getAllDichVu);

// Tìm kiếm và lọc dịch vụ
router.get(
  "/search",
  DichVuValidation.searchDichVu,
  validate,
  DichVuController.searchDichVu
);

// Lấy các dịch vụ có thể đặt tiệc
router.get("/active", DichVuController.getActiveDichVu);

// Lấy dịch vụ theo ID
router.get(
  "/:id",
  DichVuValidation.getDichVuById,
  validate,
  DichVuController.getDichVuById
);

// Tạo dịch vụ mới
router.post(
  "/",
  DichVuValidation.createDichVu,
  validate,
  DichVuController.createDichVu
);

// Cập nhật dịch vụ
router.put(
  "/:id",
  DichVuValidation.updateDichVu,
  validate,
  DichVuController.updateDichVu
);

// Xóa dịch vụ
router.delete(
  "/:id",
  DichVuValidation.deleteDichVu,
  validate,
  DichVuController.deleteDichVu
);

module.exports = router;
