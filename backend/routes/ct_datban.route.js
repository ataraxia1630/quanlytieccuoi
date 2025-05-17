const { Router } = require("express");
const validate = require("../middlewares/validation");
const ctDatBanValidation = require("../validations/ct_datban.validation");
const ctDatBanController = require("../controllers/ct_datban.controller");

const router = Router();
console.log( "á", validate)



router.get("/:soPhieuDatTiec",
    ctDatBanValidation.getAllCTDatBanByPDTId,
    validate,
     ctDatBanController.getAllCTDatBanByPDTId);
router.get(
  "/:soPhieuDatTiec/:maMonan",
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
  "/:soPhieuDatTiec/:maMonan",
  ctDatBanValidation.updateCTDatBan,
  validate,
  ctDatBanController.updateCTDatBan
);
router.delete(
  "/:soPhieuDatTiec/:maMonan",
  ctDatBanValidation.deleteCTDatBan,
  validate,
  ctDatBanController.deleteCTDatBan
);

module.exports = router;
