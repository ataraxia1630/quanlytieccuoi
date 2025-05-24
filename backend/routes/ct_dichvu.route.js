const { Router } = require("express");
const  validate  = require("../middlewares/validation");
const ctDichVuValidation = require("../validations/ct_dichvu.validation");
const ctDichVuController = require("../controllers/ct_dichvu.controller");

const router = Router();

router.get("/:soPhieuDatTiec", 
    ctDichVuValidation.getAllCTDichVuByPDTId,
    validate,
    ctDichVuController.getAllCTDichVuByPDTId);
router.get(
  "/:soPhieuDatTiec/:maDichVu",
  ctDichVuValidation.getCTDichVuById,
  validate,
  ctDichVuController.getCTDichVuById
);
router.post(
  "/",
  ctDichVuValidation.createCTDichVu,
  validate,
  ctDichVuController.createCTDichVu
);
router.put(
  "/:soPhieuDatTiec/:maDichVu",
  ctDichVuValidation.updateCTDichVu,
  validate,
  ctDichVuController.updateCTDichVu
);
router.delete(
  "/:soPhieuDatTiec/:maDichVu",
  ctDichVuValidation.deleteCTDichVu,
  validate,
  ctDichVuController.deleteCTDichVu
);

module.exports = router;
