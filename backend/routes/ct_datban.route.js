const { Router } = require("express");
const validate = require("../middlewares/validation");
const ctDatBanValidation = require("../validations/ct_datban.validation");
const ctDatBanController = require("../controllers/ct_datban.controller");

const router = Router();



router.get("/:soPhieuDatTiec",
  ctDatBanValidation.getAllCTDatBanByPDTId,
  validate,
  ctDatBanController.getAllCTDatBanByPDTId);
router.get(
  "/:soPhieuDatTiec/:maMonAn",
  ctDatBanValidation.getCTDatBanById,
  validate,
  ctDatBanController.getCTDatBanById
);
router.post(
  "/",
  ctDatBanValidation.createCTDatBan,
  validate,
  ctDatBanController.createCTDatBan
);
router.put(
  "/:soPhieuDatTiec/:maMonAn",
  ctDatBanValidation.updateCTDatBan,
  validate,
  ctDatBanController.updateCTDatBan
);
router.delete(
  "/:soPhieuDatTiec/:maMonAn",
  ctDatBanValidation.deleteCTDatBan,
  validate,
  ctDatBanController.deleteCTDatBan
);

module.exports = router;
